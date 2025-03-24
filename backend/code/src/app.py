# app.py
import json
import os

import openai
import pandas as pd
import requests
from dotenv import load_dotenv
from flask import Flask, request, jsonify
from flask_cors import CORS
from google import genai
from nltk.sentiment import SentimentIntensityAnalyzer
from sentence_transformers import SentenceTransformer
from sentence_transformers import util
from transformers import BartForConditionalGeneration, BartTokenizer, CLIPProcessor, CLIPModel, pipeline

# Flask API initialization
app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "http://localhost:3000"}})


# Load environment variables from .env file
load_dotenv()

# Load fine-tuned models and config
openai.api_key = os.getenv("OPENAI_API_KEY")
bart_model_name = "facebook/bart-base"
clip_model_name = "openai/clip-vit-base-patch32"
gemini_api_key = os.getenv("GEMINI_API_KEY")
search_engine_id = os.getenv("SEARCH_ENGINE_ID")
google_api_key = os.getenv("GOOGLE_API_KEY")
client = genai.Client(api_key=gemini_api_key)


# Load models
bart_tokenizer = BartTokenizer.from_pretrained(bart_model_name)
bart_model = BartForConditionalGeneration.from_pretrained(bart_model_name)
clip_model = CLIPModel.from_pretrained(clip_model_name)
clip_processor = CLIPProcessor.from_pretrained(clip_model_name)
sbert_model = SentenceTransformer("all-MiniLM-L6-v2")
sia = SentimentIntensityAnalyzer()
# Load summarization model
summarizer = pipeline("summarization", model="t5-small")

# Get the absolute path of the project root (move two levels up from src)
base_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", ".."))

# Construct the correct file path
file_path = os.path.join(base_dir, "data", "customer_data.csv")


# Load dataset
data = pd.read_csv(file_path)


# Sentiment Analysis using VADER
def analyze_sentiment(text):
    sentiment_score = sia.polarity_scores(text)
    return sentiment_score['compound']

# Gemini Recommendation Function
def get_gemini_recommendation(profile_data):
    prompt = f"""
        You are a recommendation engine. Based on this user profile, suggest 3 actual branded recommended products along with the product type in a key-value pair.Valid keys are product_name and product_type. No rationale is required.
        Profile: {profile_data}
        """
    response = client.models.generate_content(
        model="gemini-2.0-flash", contents=prompt
    )
    return  response.text.removeprefix("```json").replace("```","").replace("\n","")


# GPT-4 Recommendation Function
def get_gpt_recommendation(profile_data):
    prompt = f"""
    You are a recommendation engine. Based on this user profile, suggest 3 personalized recommendations.
    Profile: {profile_data}
    """

    response = openai.ChatCompletion.create(
        model="gpt-4o",
        messages=[{"role": "user", "content": prompt}],
        max_tokens=150,
        temperature=0.7
    )

    return response['choices'][0]['text'].strip()

# Hugging Face’s T5 model  for summarizing recommendations
def summarize_recommendations(recommendations):
    # Ensure recommendations is a list, not a string
    if isinstance(recommendations, str):
        recommendations = json.loads(recommendations)

    # Convert recommendations to readable text format
    recommendation_text = ", ".join([f"{item['product_name']} ({item['product_type']})" for item in recommendations])

    # Summarize
    summary = summarizer(f"Summarßize: {recommendation_text}", max_length=300, min_length=10, do_sample=False)

    return summary[0]['summary_text']


# CLIP for multi-modal matching
def get_clip_image_match(text_description):
    inputs = clip_processor(text=text_description, return_tensors="pt", padding=True)
    image_features = clip_model.get_text_features(**inputs)
    return image_features


# SBERT to calculate similarity between user profile and product embeddings
def get_text_similarity(profile_data, recommendations):
    profile_embedding = sbert_model.encode(profile_data, convert_to_tensor=True)
    rec_embedding = sbert_model.encode(recommendations, convert_to_tensor=True)
    similarity_score = util.pytorch_cos_sim(profile_embedding, rec_embedding)
    return similarity_score.item()

# Get Product image and purchase link using GCP Custom Search API
def get_image_purchase_link(product_name,product_type):
    search_query = f"Buy {product_type} {product_name} online"
    search_url = f"https://www.googleapis.com/customsearch/v1?q={search_query}&key={google_api_key}&cx={search_engine_id}&searchType=image"

    response = requests.get(search_url)

    search_results = response.json()

    if "items" in search_results:
        # Get the first result
        image_url = search_results["items"][0]["link"]
        purchase_url = search_results["items"][0]["image"]["contextLink"]

        return image_url, purchase_url
    else:
        return None, None


# Generate Recommendations API
@app.route('/recommend', methods=[ 'POST', 'OPTIONS'])
def recommend():
    if request.method == "OPTIONS":
        response = jsonify({"message": "Preflight OK"})
        response.headers.add("Access-Control-Allow-Origin", "http://localhost:3000")
        response.headers.add("Access-Control-Allow-Methods", "POST, OPTIONS")
        response.headers.add("Access-Control-Allow-Headers", "Content-Type, Authorization")
        return response, 200
    print(request.json)
    input_data = request.json
    #customer_id = input_data.get('customer_id')
    customer_id = int(input_data.get('customer_id'))
    # Fetch user data
    user_profile = data[data['Customer ID'] == customer_id].to_dict('records')[0]
    profile_data = f"{user_profile['Purchase History']}, {user_profile['Interests']}, {user_profile['Engagement Score']}"

    # Get sentiment analysis
    sentiment_score = analyze_sentiment(profile_data)
    user_profile['Sentiment Score'] = sentiment_score
    #get_gemini_recommendation(profile_data)
    # Get recommendations using GPT-4
    recommendations = get_gemini_recommendation(profile_data)

    # Summarize recommendations using BART
    summarized_recommendations = summarize_recommendations(recommendations)

    # Get image matches using CLIP
    image_features = get_clip_image_match(summarized_recommendations)

    # Calculate similarity using SBERT
    similarity_score = get_text_similarity(profile_data, summarized_recommendations)

    # Final response
    result = {
        "customer_id": customer_id,
        "profile_data": profile_data,
        "sentiment_score": sentiment_score,
        "recommendations": recommendations,
        "summarized_recommendations": summarized_recommendations,
        "similarity_score": similarity_score,
        "clip_image_match": "Available" if image_features is not None else "Not Available"
    }
    recommendation_data = json.loads(result["recommendations"])
    for product in recommendation_data:
        product_name = product["product_name"]
        product_type = product["product_type"]
        image_link, purchase_link = get_image_purchase_link(product_name, product_type)
        product["image_link"] = image_link if image_link else "Not Available"
        product["purchase_link"] = purchase_link if purchase_link else "Not Available"
    result["recommendations"] = recommendation_data

    response = jsonify(result)
    response.headers.add("Access-Control-Allow-Origin", "http://localhost:3000")
    return response


# Run Flask app
if __name__ == '__main__':
    app.run(debug=True)