%pip install nltk

import os
import sys
import nltk
import pandas as pd
import requests
from bs4 import BeautifulSoup
from pymongo import MongoClient, UpdateOne, errors
from concurrent.futures import ThreadPoolExecutor, as_completed
from cachetools import cached, TTLCache
import logging
from urllib3 import Retry
from requests.adapters import HTTPAdapter
from langdetect import detect, DetectorFactory
from openai import OpenAI

# Initialize logging
logging.basicConfig(level=logging.INFO)

# Ensure you have the VADER lexicon downloaded
nltk.download('vader_lexicon')

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

# OpenAI API client initialization
client = OpenAI(api_key="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")

def gpt_get(prompt: str, text: str, model="gpt-3.5-turbo"):
    messages = [{"role": "user", "content": prompt + "\n" + text}]
    response = client.chat.completions.create(
        model=model,
        messages=messages,
        temperature=0,
    )
    return response.choices[0].message.content.strip(), response.usage.prompt_tokens, response.usage.completion_tokens

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

def detect_language(text):
    try:
        return language_mapping.get(detect(text), 'Unknown')
    except Exception as e:
        logging.error("Error in language detection: %s", str(e))
        return 'Unknown'

def summarize_text(text):
    prompt = "Summarize the following text in 5 lines.\nHere is the text to summarize:"
    summary, _, _ = gpt_get(prompt, text)
    return summary

def perform_sentiment_analysis(text):
    prompt = "Analyze the sentiment of this text and return 'positive', 'neutral', or 'negative':"
    sentiment, _, _ = gpt_get(prompt, text)
    sentiment = sentiment.lower()
    sentiment = 'neutral' if sentiment not in ['positive', 'negative'] else sentiment
    weight = {'positive': 1.0, 'neutral': 0.75, 'negative': 0.5}.get(sentiment, 0.75)
    return sentiment, weight

def process_url(item):
    try:
        url = item.get('link')
        if not url:
            return {'link': None, 'error': "URL is missing"}

        html_content = fetch_webpage(url)
        if not html_content:
            return {'link': url, 'error': "URL is inaccessible"}

        page_text = extract_text(html_content)
        if not page_text:
            return {'link': url, 'error': "No extractable text"}

        summary = summarize_text(page_text)
        sentiment, weight = perform_sentiment_analysis(summary)
        lang = detect_language(summary)

        result = {
            'emergingIssue': item.get('issueTitle'),
            'language': lang,
            'description': summary,
            'sentimentAnalysis': sentiment,
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
        result = process_url(row.to_dict())
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
        
        logging.info(f"START: Total records: {len(data)}")
        
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