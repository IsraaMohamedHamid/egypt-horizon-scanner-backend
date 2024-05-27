import os
import sys
import json
import pandas as pd
import requests
from bs4 import BeautifulSoup
from transformers import pipeline, AutoTokenizer, AutoModelForSeq2SeqLM
from nltk.sentiment.vader import SentimentIntensityAnalyzer
import nltk
from pymongo import MongoClient, UpdateOne, errors
from concurrent.futures import ThreadPoolExecutor, as_completed
from cachetools import cached, TTLCache
import logging

from urllib3 import Retry
from requests.adapters import HTTPAdapter

# Initialize logging
logging.basicConfig(level=logging.INFO)

# Ensure you have the VADER lexicon downloaded
nltk.download('vader_lexicon')

# MongoDB Connection
def get_mongo_connection():
    try:
        mongo_uri = 'mongodb+srv://doadmin:w94yB2Y17dWE8C63@dbaas-db-5626135-310aba91.mongo.ondigitalocean.com/egypt-horizon-scanner?tls=true&authSource=admin&replicaSet=dbaas-db-5626135'
        client = MongoClient(mongo_uri, tls=True, authSource='admin')
        db = client["egypt-horizon-scanner"]
        client.admin.command('ping')  # Check connection
        return db["emergence_issue_of_the_month_data"]
    except errors.ServerSelectionTimeoutError as err:
        logging.error(f"Server selection timeout error: {err}")
        sys.exit(1)
    except errors.ConnectionFailure as err:
        logging.error(f"Connection failure: {err}")
        sys.exit(1)
    except Exception as err:
        logging.error(f"An unexpected error occurred: {err}")
        sys.exit(1)

# Cache configuration
cache = TTLCache(maxsize=100, ttl=300)

# Load the model and tokenizer once to avoid reloading for each request
tokenizer = AutoTokenizer.from_pretrained("facebook/bart-large-cnn")
model = AutoModelForSeq2SeqLM.from_pretrained("facebook/bart-large-cnn")
summarizer = pipeline("summarization", model=model, tokenizer=tokenizer)
sentiment_analyzer = SentimentIntensityAnalyzer()

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
        logging.warning(f"Failed to fetch the webpage {url}: {str(e)}")
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

def summarize_text(text):
    chunks = chunk_text(text)
    summaries = []
    for chunk in chunks:
        max_length = min(130, len(chunk.split()))
        min_length = min(30, max_length - 1)
        summary = summarizer(chunk, max_length=max_length, min_length=min_length, do_sample=False)[0]['summary_text']
        summaries.append(summary)
    return ' '.join(summaries)

def perform_sentiment_analysis(text):
    sentiment_scores = sentiment_analyzer.polarity_scores(text)
    max_sentiment = max(sentiment_scores, key=sentiment_scores.get)
    return sentiment_scores, max_sentiment, sentiment_scores[max_sentiment]

def getSentimentLabel(sentiment):
    {
    return sentiment === "neu" ? "neutral"  (sentiment === "neg"  ? "negative"  : "positive");
}

def process_url(item, collection):
    try:
        url = item.get('link')
        if not url:
            logging.info("Skipping item with missing URL")
            return {'link': None, 'error': "URL is missing"}

        html_content = fetch_webpage(url)
        if not html_content:
            logging.info(f"Skipping item with inaccessible URL: {url}")
            return {'link': url, 'error': "URL is inaccessible"}

        page_text = extract_text(html_content)
        if not page_text:
            logging.info(f"Skipping item with no extractable text: {url}")
            return {'link': url, 'error': "No extractable text"}

        summary = summarize_text(page_text)
        sentiment_scores, sentiment, score = perform_sentiment_analysis(summary)
        
        result = {
            **item,  # Copy all fields from the input data
            'description': summary,
            'sentimentAnalysisDictionary': sentiment_scores,
            'sentimentAnalysis': getSentimentLabel(sentiment),
            'score': score
        }
        
        return result
    except Exception as e:
        logging.error(f"Error processing URL {item.get('link')}: {str(e)}")
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
    
    logging.info(f"Processed {len(data)} records. Updating...")

    if updates:
        try:
            logging.info(f"Attempting to update {len(updates)} records...")
            result = collection.bulk_write([UpdateOne(x['filter'], x['update']) for x in updates], ordered=False)
            logging.info(f"Successfully updated records.")
        except Exception as e:
            logging.error("An error occurred during the update process:", str(e))

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
        logging.error(f"An error occurred: {e}")
        sys.exit(1)