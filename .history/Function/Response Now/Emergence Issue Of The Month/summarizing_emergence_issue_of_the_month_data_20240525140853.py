import sys
import json
import requests
from bs4 import BeautifulSoup
from transformers import pipeline, AutoTokenizer, AutoModelForSeq2SeqLM
from nltk.sentiment.vader import SentimentIntensityAnalyzer
import nltk
from pymongo import MongoClient

# Ensure you have the VADER lexicon downloaded
nltk.download('vader_lexicon')

# MongoDB configuration
    mongo_uri = 'mongodb+srv://doadmin:73Le6F4d2hZ9K8Y0@dbaas-db-5626135-310aba91.mongo.ondigitalocean.com/egypt-horizon-scanner?replicaSet=dbaas-db-5626135&tls=true&authSource=admin'
    client = MongoClient(mongo_uri)
    db = client["egypt-horizon-scanner"]
    collection = db["emergence_issue_of_the_month_data"]

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

def chunk_text(text, tokenizer, max_length=512):
    inputs = tokenizer(text, return_tensors="pt", max_length=max_length, truncation=True, padding="max_length")
    chunks = []
    for i in range(0, len(inputs["input_ids"][0]), max_length):
        chunk = tokenizer.decode(inputs["input_ids"][0][i:i + max_length], skip_special_tokens=True)
        chunks.append(chunk)
    return chunks

def summarize_text(text):
    tokenizer = AutoTokenizer.from_pretrained("facebook/bart-large-cnn")
    model = AutoModelForSeq2SeqLM.from_pretrained("facebook/bart-large-cnn")
    summarizer = pipeline("summarization", model=model, tokenizer=tokenizer)
    
    chunks = chunk_text(text, tokenizer)
    summaries = [summarizer(chunk, max_length=130, min_length=30, do_sample=False)[0]['summary_text'] for chunk in chunks]
    return ' '.join(summaries)

def perform_sentiment_analysis(text):
    sid = SentimentIntensityAnalyzer()
    sentiment_scores = sid.polarity_scores(text)
    return sentiment_scores

def process_urls(data):
    results = []
    for item in data:
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
            
            results.append(result)
            # Save the result to MongoDB
            collection.update_one({'link': url}, {'$set': result}, upsert=True)
        except Exception as e:
            results.append({'link': url, 'error': str(e)})
    return results

if __name__ == "__main__":
    data = json.loads(sys.argv[1])
    results = process_urls(data)
    print(json.dumps(results))