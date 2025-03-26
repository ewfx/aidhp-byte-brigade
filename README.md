# 🚀 Project Name

## 📌 Table of Contents
- [Introduction](#introduction)
- [Demo](#demo)
- [Inspiration](#inspiration)
- [What It Does](#what-it-does)
- [How We Built It](#how-we-built-it)
- [Challenges We Faced](#challenges-we-faced)
- [How to Run](#how-to-run)
- [Tech Stack](#tech-stack)
- [Team](#team)

---

## 🎯 Introduction
A brief overview of your project and its purpose. Mention which problem statement are your attempting to solve. Keep it concise and engaging.

## 🎥 Demo
🔗 [Live Demo](#) 

(https://drive.google.com/file/d/1315-UXgavLlsbtkcpWQ7u5K9WoKTcPvi/view?usp=drive_link)

📹 [Video Demo](#) 

(https://drive.google.com/file/d/1315-UXgavLlsbtkcpWQ7u5K9WoKTcPvi/view?usp=drive_link)

📹 [Presentation](#) 

![Hyper_Personalization_Recommendation_System](artifacts/demo/Hyper_Personalization_Recommendation_System.pptx)

🖼️ Screenshots:

![Screenshot 1](link-to-image)

**Architecture:**
https://github.com/ewfx/aidhp-byte-brigade/blob/main/artifacts/arch/ByteBrigade-Architecture.png

## Sequence Diagram:
**Customer Flow**
![Customer Flow](artifacts/sequence_diagrams/Customer_Flow.png)
**Banker Flow**
![Banker Flow](artifacts/sequence_diagrams/Banker_Flow.png)
## 💡 Inspiration
The inspiration for this project came from the need to enhance customer experience and engagement in the banking sector by offering personalized product recommendations. Traditional banking product recommendations are often generic and lack personalization, leading to low conversion rates and customer dissatisfaction. We wanted to leverage AI and machine learning to create a smart, data-driven recommendation system that helps both customers and bankers make informed decisions.

Customers often struggle to find relevant financial products (loans, credit cards, investment plans, etc.) that align with their needs. Similarly, bankers lack an efficient way to identify and recommend the best products to their assigned customers. Our solution aims to:
	•	Personalize banking recommendations based on customer profiles, transactions, and interests.
	•	Assist bankers by providing an overview of the best-suited products for their customers.
	•	Use AI models to generate accurate, relevant, and explainable product suggestions.
	•	Enhance user experience by integrating multimodal AI and similarity analysis for better matching.

By solving this problem, we aim to bridge the gap between customers and financial products while improving conversion rates and customer satisfaction. 🚀

## ⚙️ What It Does
Our project is an AI-powered product recommendation system designed to enhance the banking experience for both customers and bankers. It analyzes customer data and leverages multiple AI models to generate personalized financial product recommendations.

**Key Features:**

**1.	Customer-Specific Recommendations**
 
		•	Customers receive personalized product suggestions (e.g., credit cards, loans, investment plans) based on their purchase history, interests, and engagement scores.
  
		•	Recommendations are fetched using Google Gemini AI and refined through multiple AI models for better accuracy.
  
**2.	AI-Driven Insights**
 
		•	Hugging Face T5 Model: Summarizes recommendations for easy understanding.
  
		•	CLIP (Multimodal Matching): Matches customer profiles with product images and descriptions.
  
		•	SBERT (Similarity Calculation): Measures similarity between user profiles and product embeddings to improve relevance.
  
		•	GCP Custom Search API: Retrieves real-time purchase links for recommended products.
  
**3.	Dual-Role Access: Customer & Banker Dashboards**
 
		•	Customers: View their top recommended products, along with explanations and purchase links.
  
		•	Bankers: Access a dashboard showing recommendations for all their assigned customers, helping them proactively suggest suitable financial products.
  
**4.	Seamless Backend Integration**
 
		•	Customer data is stored in customerdata.csv, which acts as our database.
  
		•	Backend processes customer ID, retrieves user profile, and interacts with AI models to generate and refine recommendations.
  
		•	Response is formatted and displayed in an intuitive user-friendly dashboard.
  

By combining machine learning, natural language processing, and multimodal AI, our project transforms the way banking products are recommended, ensuring a smarter, more engaging, and highly personalized experience for both customers and bankers. 
## 🛠️ How We Built It
Briefly outline the technologies, frameworks, and tools used in development.

## 🚧 Challenges We Faced
Describe the major technical or non-technical challenges your team encountered.

## 🏃 How to Run
1. Clone the repository  
   ```sh
   git clone https://github.com/your-repo.git
   ```
2. Install dependencies  
   ```sh
   npm install  # or pip install -r requirements.txt (for Python)
   ```
3. Run the project  
   ```sh
   npm start  # or python app.py
   ```

## 🏗️ Tech Stack
- 🔹 Frontend: React
- 🔹 Backend: Python Flask API
- 🔹 Models: Gemini AI , Hugging Face T5  , CLIP , SBERT
- 🔹 Cloud: GCP Custom Search API

## 👥 Team
- **Bibhudatta Mishra** - [GitHub](#) | [LinkedIn](#)
- **Abinash Prusty** - [GitHub](#) | [LinkedIn](#)
- **Zabir Akram** - [GitHub](#) | [LinkedIn](#)
- **Deepak Kumar Kar** - [GitHub](#) | [LinkedIn](#)
