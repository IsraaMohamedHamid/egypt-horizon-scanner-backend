import os
import sys
import nltk
import pandas as pd
import requests
from bs4 import BeautifulSoup
from transformers import pipeline, AutoTokenizer, AutoModelForSeq2SeqLM
import tensorflow as tf
from transformers import TFAutoModelForSequenceClassification, AutoTokenizer
from pymongo import MongoClient, UpdateOne, errors
from concurrent.futures import ThreadPoolExecutor, as_completed
from cachetools import cached, TTLCache
import logging
from urllib3 import Retry
from requests.adapters import HTTPAdapter
from langdetect import detect, DetectorFactory

# Initialize logging
logging.basicConfig(level=logging.INFO)

# Ensure you have the VADER lexicon downloaded
nltk.download('vader_lexicon')

# Configure logging
# logging.set_verbosity_warning()

# Disable GPU for TensorFlow to ensure compatibility and resource management
os.environ['CUDA_VISIBLE_DEVICES'] = '-1'
os.environ['TF_ENABLE_ONEDNN_OPTS'] = '0'
os.environ['TF_CPP_MIN_LOG_LEVEL'] = '2'

# Ensure deterministic behavior in language detection
DetectorFactory.seed = 0

# Language mapping dictionary
language_mapping = {
    'en': 'English', 'ar': 'Arabic', 'fr': 'French', 'es': 'Spanish', 
    'de': 'German', 'zh': 'Chinese', 'ja': 'Japanese', 'ru': 'Russian', 
    'it': 'Italian', 'pt': 'Portuguese'
}

# MongoDB Connection
def get_mongo_connection():
    try:
        mongo_uri = 'mongodb+srv://doadmin:6d30Bi4ec59u7ag1@egypt-horizon-scanner-1948d167.mongo.ondigitalocean.com/egypt-horizon-scanner?tls=true&authSource=admin&replicaSet=egypt-horizon-scanner'
        client = MongoClient(mongo_uri, tls=True, authSource='admin')
        db = client["egypt-horizon-scanner"]
        client.admin.command('ping')  # Check connection
        return db["emergence_issue_of_the_month_data"]
    except errors.ServerSelectionTimeoutError as err:
        logging.error("Server selection timeout error: %s", err)
        sys.exit(1)
    except errors.ConnectionFailure as err:
        logging.error("Connection failure: %s", err)
        sys.exit(1)
    except Exception as err:
        logging.error("An unexpected error occurred: %s", err)
        sys.exit(1)

# Cache configuration
cache = TTLCache(maxsize=100, ttl=300)

# Load the model and tokenizer once to avoid reloading for each request
tokenizer = AutoTokenizer.from_pretrained("facebook/bart-large-cnn")
model = AutoModelForSeq2SeqLM.from_pretrained("facebook/bart-large-cnn")
summarizer = pipeline("summarization", model=model, tokenizer=tokenizer)

# Load the model and tokenizer for the new sentiment analysis
model_name = "jysh1023/tiny-bert-sst2-distilled"
new_model = TFAutoModelForSequenceClassification.from_pretrained(model_name, from_pt=True)
new_tokenizer = AutoTokenizer.from_pretrained(model_name)

# Configure retry strategy
retry_strategy = Retry(
    total=3,
    backoff_factor=1,
    status_forcelist=[429, 500, 502, 503, 504],
    allowed_methods=["HEAD", "GET", "OPTIONS"]
)
adapter = HTTPAdapter(max_retries=retry_strategy)
http = requests.Session()
http.mount("https://", adapter)
http.mount("http://", adapter)

@cached(cache)
def fetch_webpage(url):
    try:
        response = http.get(url, verify=False)
        response.raise_for_status()
        return response.text
    except requests.exceptions.RequestException as e:
        logging.warning("Failed to fetch the webpage %s: %s", url, str(e))
        return None

def extract_text(html_content):
    if html_content:
        soup = BeautifulSoup(html_content, 'html.parser')
        paragraphs = soup.find_all('p')
        page_text = ' '.join([para.get_text() for para in paragraphs])
        return page_text
    return ""

def chunk_text(text, max_length=512):
    inputs = tokenizer(text, return_tensors="pt", max_length=max_length, truncation=True, padding="max_length")
    chunks = []
    for i in range(0, len(inputs["input_ids"][0]), max_length):
        chunk = tokenizer.decode(inputs["input_ids"][0][i:i + max_length], skip_special_tokens=True)
        chunks.append(chunk)
    return chunks

def detect_language(text):
    try:
        return language_mapping.get(detect(text), 'Unknown')
    except Exception as e:
        logging.error("Error in language detection: %s", str(e))
        return 'Unknown'

def summarize_text(text):
    chunks = chunk_text(text)
    summaries = []
    for chunk in chunks:
        max_length = min(130, len(chunk.split()))
        min_length = min(30, max_length - 1)
        summary = summarizer(chunk, max_length=max_length, min_length=min_length, do_sample=False)[0]['summary_text']
        summaries.append(summary)
    return ' '.join(summaries)

def sentiment_analysis(text, model, tokenizer):
    # Encode the text using the tokenizer
    inputs = tokenizer(text, return_tensors="tf", truncation=True, padding=True, max_length=512)

    # Perform the prediction
    outputs = model(inputs)

    # Apply softmax to convert logits to probabilities
    probabilities = tf.nn.softmax(outputs.logits, axis=-1)

    # Get the predicted class (index with the highest probability)
    predicted_class_index = tf.argmax(probabilities, axis=-1).numpy()[0]
    predicted_class = model.config.id2label[predicted_class_index]
    
    return predicted_class, probabilities.numpy(), predicted_class_index

def perform_sentiment_analysis(text):
    lang = detect_language(text)
    predicted_class, probabilities, predicted_class_index = sentiment_analysis(text, new_model, new_tokenizer)
    sentiment_scores = {new_model.config.id2label[i]: float(prob) for i, prob in enumerate(probabilities[0])}  # Convert numpy floats to Python floats
    max_sentiment = max(sentiment_scores, key=sentiment_scores.get)
    weight = {'positive': 1.0, 'neutral': 0.75, 'negative': 0.5}.get(getSentimentLabel(max_sentiment), 0.75) 
    score = float(probabilities[predicted_class_index])  # Convert numpy float to Python float
    return lang, sentiment_scores, max_sentiment, sentiment_scores[max_sentiment], weight, score

def getSentimentLabel(sentiment):
    if sentiment == 'pos':
        return 'positive'
    elif sentiment == 'neg':
        return 'negative'
    return 'neutral'

def process_url(item, collection):
    try:
        url = item.get('link')
        if not url:
            logging.info("Skipping item with missing URL")
            return {'link': None, 'error': "URL is missing"}

        html_content = fetch_webpage(url)
        if not html_content:
            logging.info("Skipping item with inaccessible URL: %s", url)
            return {'link': url, 'error': "URL is inaccessible"}

        page_text = extract_text(html_content)
        if not page_text:
            logging.info("Skipping item with no extractable text: %s", url)
            return {'link': url, 'error': "No extractable text"}

        summary = summarize_text(page_text)
        print9
        lang, sentiment_scores, sentiment, score1, weight, score = perform_sentiment_analysis(summary)
        logging.info(f"link': {url}, sentimentAnalysis: {sentiment}, weight: {weight}, score: {score}, language: {lang}")
        
        result = {
            # **item,  # Copy all fields from the input data
            'language': lang,
            'description': summary,
            'sentimentAnalysisDictionary': sentiment_scores,
            'sentimentAnalysis': getSentimentLabel(sentiment),
            'score': score,
            'weight': weight
        }
        
        return result
    except Exception as e:
        logging.error("Error processing URL %s: %s", item.get('link'), str(e))
        return {'link': item.get('link'), 'error': str(e)}

def update_emerging_issues_data(collection):
    data = pd.DataFrame(list(collection.find()))

    if data.empty:
        logging.info("No data to process.")
        return

    updates = []
    for index, row in data.iterrows():
        result = process_url(row.to_dict(), collection)
        update_dict = {
            'filter': {
                '_id': row['_id'],
                'link': row['link'],
                'issueTitle': row['issueTitle'],
                'pillar': row['pillar'],
                'indicators': row['indicators'],
                'issuesMainSource': row['issuesMainSource'],
                'sourceCategory': row['sourceCategory']
            },
            'update': {'$set': result}
        }
        updates.append(update_dict)
    
    logging.info("Processed %d records. Updating...", len(data))

    if updates:
        try:
            logging.info("Attempting to update %d records...", len(updates))
            result = collection.bulk_write([UpdateOne(x['filter'], x['update']) for x in updates], ordered=False)
            logging.info("Successfully updated records.")
        except errors.BulkWriteError as e:
            logging.error("Bulk write error: %s", e.details)        
        except Exception as e:
            logging.error("An error occurred during the update process: %s", str(e))

if __name__ == "__main__":
    try:
        db_collection = get_mongo_connection()
        
        # Fetching all data from the collection
        data = list(db_collection.find())
        
        # Validate URLs
        valid_data = [item for item in data if isinstance(item, dict) and item.get('link')]
        
        if not valid_data:
            logging.error("No valid URLs found in the input data.")
            sys.exit(1)
        
        # Attempt to process URLs
        update_emerging_issues_data(db_collection)
    except Exception as e:
        logging.error("An error occurred: %s", e)
        sys.exit(1)