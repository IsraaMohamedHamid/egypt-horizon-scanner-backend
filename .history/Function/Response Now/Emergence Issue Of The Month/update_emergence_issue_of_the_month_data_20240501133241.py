import pandas as pd
import tensorflow as tf
from pymongo import MongoClient
from transformers import pipeline
import os

# Ensure TensorFlow does not attempt to use unavailable CUDA resources
os.environ['CUDA_VISIBLE_DEVICES'] = '-1'
# Optional: Disable oneDNN optimizations if you encounter unusual issues
os.environ['TF_ENABLE_ONEDNN_OPTS'] = '0'
os.environ['TF_CPP_MIN_LOG_LEVEL'] = '2'

# # Check if any GPUs are available
# gpus = tf.config.list_physical_devices('GPU')
# if not gpus:
#     # No GPUs found, use CPU only
#     os.environ['CUDA_VISIBLE_DEVICES'] = '-1'
# else:
#     # GPUs are available, print out number found
#     print(f"Number of GPUs available: {len(gpus)}")

# Function to assign sentiment
def assign_sentiment(sentiment):
    if sentiment == 'POSITIVE':
        return 'positive'
    elif sentiment == 'NEGATIVE':
        return 'negative'
    return 'neutral'

# Function to assign weight
def assign_weight(sentiment):
    if sentiment == 'positive':
        return 1.0
    elif sentiment == 'negative':
        return 0.5
    return 0.75

# Function to perform sentiment analysis
def analyze_description_sentiment(description, sentiment_analyzer):
    sentiment_result = sentiment_analyzer(description)
    sentiment_label = sentiment_result[0]['label']
    sentiment_score = sentiment_result[0]['score']
    sentiment = assign_sentiment(sentiment_label)
    
    return {
        'sentimentAnalysis': sentiment,
        'weight': assign_weight(sentiment),
        'score': sentiment_score
    }

# Function to update emerging issues data
def update_emerging_issues_data(data, sentiment_analyzer):
    results = data['description'].apply(lambda desc: analyze_description_sentiment(desc, sentiment_analyzer))
    data = pd.concat([data, results.apply(pd.Series)], axis=1)
    return data

if __name__ == "__main__":
    # Connect to MongoDB database
    mongo_uri = 'mongodb+srv://doadmin:73Le6F4d2hZ9K8Y0@dbaas-db-5626135-310aba91.mongo.ondigitalocean.com/egypt-horizon-scanner?replicaSet=dbaas-db-5626135&tls=true&authSource=admin'
    client = MongoClient(mongo_uri)
    db = client["egypt-horizon-scanner"]
    collection = db["emergence_issue_of_the_month_data"]

    # Read data from MongoDB collection into a DataFrame
    data = pd.DataFrame(list(collection.find()))

    # Initialize the sentiment analyzer
    sentiment_analyzer = pipeline("sentiment-analysis", model="distilbert-base-uncased-finetuned-sst-2-english")

    # Update the data
    updated_data = update_emerging_issues_data(data, sentiment_analyzer)

    # Save the updated data back to MongoDB collection
    updated_records = updated_data.to_dict(orient='records')
    
    
    
    collection.delete_many({})  # Clear existing data
    collection.insert_many(updated_records)
