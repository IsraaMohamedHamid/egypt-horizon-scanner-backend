import pandas as pd
import tensorflow as tf
from pymongo import MongoClient
from transformers import BertTokenizer, TFBertForSequenceClassification
import os

# Ensure TensorFlow does not attempt to use unavailable CUDA resources
os.environ['CUDA_VISIBLE_DEVICES'] = '-1'
# Optional: Disable oneDNN optimizations if you encounter unusual issues
os.environ['TF_ENABLE_ONEDNN_OPTS'] = '0'
os.environ['TF_CPP_MIN_LOG_LEVEL'] = '2'

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
def analyze_description_sentiment(description, model, tokenizer):
    inputs = tokenizer(description, return_tensors="tf", padding=True, truncation=True)
    outputs = model(inputs)
    predicted_class = tf.argmax(outputs.logits, axis=1).numpy()[0]
    sentiment_label = "POSITIVE" if predicted_class == 1 else "NEGATIVE"
    sentiment_score = tf.nn.softmax(outputs.logits)[0][predicted_class].numpy()
    sentiment = assign_sentiment(sentiment_label)
    
    return {
        'sentimentAnalysis': sentiment,
        'weight': assign_weight(sentiment),
        'score': sentiment_score
    }

# Function to update emerging issues data
def update_emerging_issues_data(data, model, tokenizer):
    results = data['description'].apply(lambda desc: analyze_description_sentiment(desc, model, tokenizer))
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

    # Load the model and tokenizer
    model_name = "distilbert-base-uncased-finetuned-sst-2-english"
    model = TFBertForSequenceClassification.from_pretrained(model_name)
    tokenizer = DistilBertTokenizer.from_pretrained(model_name)

    # Update the data
    updated_data = update_emerging_issues_data(data, model, tokenizer)

    # Rename duplicate columns
    updated_data = updated_data.loc[:,~updated_data.columns.duplicated()]

    # Save the updated data back to MongoDB collection
    updated_records = updated_data.to_dict(orient='records')

    collection.delete_many({})  # Clear existing data
    collection.insert_many(updated_records)