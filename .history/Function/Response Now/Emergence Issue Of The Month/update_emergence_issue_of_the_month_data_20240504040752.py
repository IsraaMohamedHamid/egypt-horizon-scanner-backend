import logging
import pandas as pd
import tensorflow as tf
from pymongo import MongoClient
from transformers import pipeline, BertTokenizer, MobileBertTokenizer, AutoModelForSequenceClassification, TFAutoModelForSequenceClassification, AutoModel, AutoTokenizer, logging, BertForSequenceClassification, TFBertForSequenceClassification
from langdetect import detect, DetectorFactory
import os

logging.set_verbosity_warning()

# Ensure TensorFlow does not attempt to use unavailable CUDA resources
os.environ['CUDA_VISIBLE_DEVICES'] = '-1'
os.environ['TF_ENABLE_ONEDNN_OPTS'] = '0'
os.environ['TF_CPP_MIN_LOG_LEVEL'] = '2'

# Set seed to get consistent results
DetectorFactory.seed = 0

# Language code to full name mapping
language_mapping = {
    'en': 'English',
    'ar': 'Arabic',
    'fr': 'French',
    'es': 'Spanish',
    'de': 'German',
    'zh': 'Chinese',
    'ja': 'Japanese',
    'ru': 'Russian',
    'it': 'Italian',
    'pt': 'Portuguese'
}

# Function to detect language and return full name
def detect_language(text):
    try:
        code = detect(text)
        return language_mapping.get(code, 'Unknown')
    except:
        return 'Unknown'

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

# Function to find the output with the highest score
def find_highest_score(outputs):
    # print(outputs[0])
    # Assuming outputs is a list of lists as given, we take the first item since your example hints there's only one such list
    result = outputs

    # Initialize variables to store the label with the highest score
    highest_label = result[0]['label']
    highest_score = result[0]['score']

    # Iterate over the list to find the sentiment with the highest score
    for sentiment in result:
        if sentiment['score'] > highest_score:
            highest_score = sentiment['score']
            highest_label = sentiment['label']

    # Return the best output found, or None if no outputs were processed
    return highest_label, highest_score

# Function to perform sentiment analysis
def analyze_description_sentiment(description, distilled_student_sentiment_classifier):
    # First, detect language
    lang = detect_language(description)
    
    # inputs = tokenizer(description, return_tensors="tf", padding=True, truncation=True)
    outputs = distilled_student_sentiment_classifier(description) # model(inputs)
    # predicted_class = tf.argmax(outputs.logits, axis=1).numpy()[0]
    # sentiment_label = "POSITIVE" if predicted_class == 1 else "NEGATIVE"
    # sentiment_score = tf.nn.softmax(outputs.logits)[0][predicted_class].numpy()
    sentiment_label, sentiment_score = find_highest_score(outputs)
    # sentiment = assign_sentiment(sentiment_label)
    
    # print(f"lang: {lang}")
    
    return {
        'sentimentAnalysis': sentiment_label,
        'weight': assign_weight(sentiment_label),
        'score': sentiment_score,
        'language': lang
    }

# Function to update emerging issues data
def update_emerging_issues_data(data, distilled_student_sentiment_classifier):
    results = data['description'].apply(lambda desc: analyze_description_sentiment(desc, distilled_student_sentiment_classifier))
    data = pd.concat([data, results.apply(pd.Series)], axis=1)
    return data

if __name__ == "__main__":
    mongo_uri = 'mongodb+srv://doadmin:73Le6F4d2hZ9K8Y0@dbaas-db-5626135-310aba91.mongo.ondigitalocean.com/egypt-horizon-scanner?replicaSet=dbaas-db-5626135&tls=true&authSource=admin'
    client = MongoClient(mongo_uri)
    db = client["egypt-horizon-scanner"]
    collection = db["emergence_issue_of_the_month_data"]

    # Read data from MongoDB collection into a DataFrame
    data = pd.DataFrame(list(collection.find()))

    # Load the model and tokenizer
    model_name = "voidful/albert_chinese_tiny" # "albert/albert-base-v2" 
    # pipe = pipeline("fill-mask", model="albert/albert-base-v2")
    
    # Load model directly
    distilled_student_sentiment_classifier = pipeline("text-classification", model="mrm8488/distilroberta-finetuned-financial-news-sentiment-analysis")
    # tokenizer = AutoTokenizer.from_pretrained("lxyuan/distilbert-base-multilingual-cased-sentiments-student")
    # model = AutoModelForSequenceClassification.from_pretrained("lxyuan/distilbert-base-multilingual-cased-sentiments-student")
    # model = TFAutoModelForSequenceClassification.from_pretrained(model_name, from_pt=True)
    # tokenizer =  AutoTokenizer.from_pretrained(model_name) # TinyBertTokenizer.from_pretrained(model_name)

    # Update the data
    updated_data = update_emerging_issues_data(data, distilled_student_sentiment_classifier)

    # Rename duplicate columns
    updated_data = updated_data.loc[:,~updated_data.columns.duplicated()]

    # Save the updated data back to MongoDB collection
    updated_records = updated_data.to_dict(orient='records')

    collection.delete_many({})  # Clear existing data
    collection.insert_many(updated_records)