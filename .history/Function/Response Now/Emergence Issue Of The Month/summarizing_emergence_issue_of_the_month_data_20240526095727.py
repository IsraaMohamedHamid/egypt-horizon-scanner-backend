import sys
import json
import requests
from bs4 import BeautifulSoup
from transformers import pipeline, AutoTokenizer, AutoModelForSeq2SeqLM
from nltk.sentiment.vader import SentimentIntensityAnalyzer
import nltk
from pymongo import MongoClient
from concurrent.futures import ThreadPoolExecutor, as_completed
import os
from cachetools import cached, TTLCache
import logging

# Initialize logging
logging.basicConfig(level=logging.INFO)

# Ensure you have the VADER lexicon downloaded
nltk.download('vader_lexicon')

# MongoDB configuration from environment variables
mongo_uri = os.getenv('MONGO_URI', 'your_default_mongo_uri')
client = MongoClient(mongo_uri)
db = client["egypt-horizon-scanner"]
collection = db["emergence_issue_of_the_month_data"]

# Cache configuration
cache = TTLCache(maxsize=100, ttl=300)

# Load the model and tokenizer once to avoid reloading for each request
tokenizer = AutoTokenizer.from_pretrained("facebook/bart-large-cnn")
model = AutoModelForSeq2SeqLM.from_pretrained("facebook/bart-large-cnn")
summarizer = pipeline("summarization", model=model, tokenizer=tokenizer)
sentiment_analyzer = SentimentIntensityAnalyzer()

@cached(cache)
def fetch_webpage(url):
    response = requests.get(url)
    if response.status_code == 200:
        return response.text
    else:
        raise Exception(f"Failed to fetch the webpage: Status code {response.status_code}")

def extract_text(html_content):
    soup = BeautifulSoup(html_content, 'html.parser')
    paragraphs = soup.find_all('p')
    page_text = ' '.join([para.get_text() for para in paragraphs])
    return page_text

def chunk_text(text, max_length=512):
    inputs = tokenizer(text, return_tensors="pt", max_length=max_length, truncation=True, padding="max_length")
    chunks = []
    for i in range(0, len(inputs["input_ids"][0]), max_length):
        chunk = tokenizer.decode(inputs["input_ids"][0][i:i + max_length], skip_special_tokens=True)
        chunks.append(chunk)
    return chunks

def summarize_text(text):
    chunks = chunk_text(text)
    summaries = [summarizer(chunk, max_length=130, min_length=30, do_sample=False)[0]['summary_text'] for chunk in chunks]
    return ' '.join(summaries)

def perform_sentiment_analysis(text):
    sentiment_scores = sentiment_analyzer.polarity_scores(text)
    return sentiment_scores

def process_url(item):
    try:
        url = item.get('link')
        html_content = fetch_webpage(url)
        page_text = extract_text(html_content)
        summary = summarize_text(page_text)
        sentiment = perform_sentiment_analysis(summary)
        
        result = {
            **item,  # Copy all fields from the input data
            'summary': summary,
            'sentimentAnalysis': json.dumps(sentiment),
            'description': page_text  # Assuming description is the full text extracted
        }
        
        # Save the result to MongoDB
        collection.update_one({'link': url}, {'$set': result}, upsert=True)
        return result
    except Exception as e:
        logging.error(f"Error processing URL {item.get('link')}: {str(e)}")
        return {'link': item.get('link'), 'error': str(e)}

def process_urls(data):
    results = []
    with ThreadPoolExecutor(max_workers=10) as executor:
        futures = [executor.submit(process_url, item) for item in data]
        for future in as_completed(futures):
            results.append(future.result())
    return results

if __name__ == "__main__":
    data = json.loads(sys.argv[1])
    results = process_urls(data)
    print(json.dumps(results))