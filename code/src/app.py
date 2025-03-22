# app.py
import openai
import pandas as pd
import json
import torch
from transformers import BartForConditionalGeneration, BartTokenizer, CLIPProcessor, CLIPModel, Pipeline, pipeline
from sentence_transformers import SentenceTransformer, util
from nltk.sentiment import SentimentIntensityAnalyzer
from textblob import TextBlob
import spacy
from flask import Flask, request, jsonify
from sentence_transformers import SentenceTransformer, losses, InputExample
from torch.utils.data import DataLoader
from huggingface_hub import login
from google import genai
# Flask API initialization
app = Flask(__name__)

# Load fine-tuned models and config
openai.api_key = "YOUR_OPENAI_API_KEY"
bart_model_name = "facebook/bart-base"
clip_model_name = "openai/clip-vit-base-patch32"
gemini_api_key = "YOUR_GEMINI_API_KEY"
client = genai.Client(api_key=gemini_api_key)


# Load models
bart_tokenizer = BartTokenizer.from_pretrained(bart_model_name)
bart_model = BartForConditionalGeneration.from_pretrained(bart_model_name)
clip_model = CLIPModel.from_pretrained(clip_model_name)
clip_processor = CLIPProcessor.from_pretrained(clip_model_name)
sbert_model = SentenceTransformer("all-MiniLM-L6-v2")
sia = SentimentIntensityAnalyzer()

# Load dataset
data = pd.read_csv("data/customer_data.csv")


# Sentiment Analysis using VADER
def analyze_sentiment(text):
    sentiment_score = sia.polarity_scores(text)
    return sentiment_score['compound']
def get_gemini_recommendation(profile_data):
    print("profile_data::"+profile_data)
    prompt = f"""
        You are a recommendation engine. Based on this user profile, suggest 1 actual branded recommended product along with the product type in a key-value pair. No rationale is required.
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

# Fine-tuned BART for summarizing recommendations
def summarize_recommendations(recommendations):
    inputs = bart_tokenizer(recommendations, return_tensors="pt", max_length=1024, truncation=True)
    summary_ids = bart_model.generate(inputs["input_ids"], max_length=50, min_length=20, length_penalty=2.0)
    summary = bart_tokenizer.decode(summary_ids[0], skip_special_tokens=True)
    return summary


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


# Generate Recommendations API
@app.route('/recommend', methods=['POST'])
def recommend():
    input_data = request.json
    customer_id = input_data.get('customer_id')
    #print(customer_id)
    #print(data)
    #print(data['Customer ID'])
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
        "Customer ID": customer_id,
        "Profile Summary": profile_data,
        "Sentiment Score": sentiment_score,
        "Recommendations": summarized_recommendations,
        "Similarity Score": similarity_score,
        "CLIP Image Match": "Available" if image_features is not None else "Not Available"
    }
    # Load pre-trained model
    # Load pre-trained model
    model = SentenceTransformer('all-MiniLM-L6-v2')

    # Prepare data
    train_examples = [InputExample(texts=["User Interests", "Recommended Products"], label=0.85)]
    train_dataloader = DataLoader(train_examples, shuffle=True, batch_size=16)

    # Define cosine similarity loss
    train_loss = losses.CosineSimilarityLoss(model)

    # Fine-tune model
    model.fit(train_objectives=[(train_dataloader, train_loss)], epochs=4, warmup_steps=100)

    # Save model
    model.save("models/fine_tuned_model.pt")

    return jsonify(result)


# Run Flask app
if __name__ == '__main__':
    app.run(debug=True)