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
        raise Exception(f"Failed to fetch the webpage: {str(e)}")

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
    summaries = []
    for chunk in chunks:
        max_length = min(130, len(chunk.split()))
        min_length = min(30, max_length - 1)
        summary = summarizer(chunk, max_length=max_length, min_length=min_length, do_sample=False)[0]['summary_text']
        summaries.append(summary)
    return ' '.join(summaries)

def perform_sentiment_analysis(text):
    sentiment_scores = sentiment_analyzer.polarity_scores(text)
    return sentiment_scores

def process_url(item):
    try:
        url = item.get('link')
        if not url:
            raise ValueError("URL is missing")

        html_content = fetch_webpage(url)
        page_text = extract_text(html_content)
        summary = summarize_text(page_text)
        sentiment = perform_sentiment_analysis(summary)
        
        result = {
            **item,  # Copy all fields from the input data
            'description': summary,
            'sentimentAnalysis': json.dumps(sentiment),
            # 'description': page_text  # Assuming description is the full text extracted
        }
        
        # Save the result to MongoDB
        collection.update_one({'link': result['link']}, {'$set': result}, upsert=True)
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