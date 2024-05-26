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
mongo_client = MongoClient('mongodb://localhost:27017/')
db = mongo_client['your_database']
collection = db['your_collection']

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

def process_urls( urls):
    results = []
    for url in urls:
        try:
            html_content = fetch_webpage(url)
            page_text = extract_text(html_content)
            summary = summarize_text(page_text)
            sentiment = perform_sentiment_analysis(summary)
            result = {
                'link': url,
                'summary': summary,
                'sentimentAnalysis': json.dumps(sentiment),
                'description': page_text,  # Assuming description is the full text extracted
                # Add default or placeholder values for other fields
                'source': 'unknown',
                'sourceCategory': 'unknown',
                'issueTitle': 'unknown',
                'repetition': 0,
                'weight': 0.0,
                'score': 0.0,
                'emergingIssue': 'unknown',
                'language': 'unknown',
                'sdgTargeted': [],
                'image': '',
                'dimension': 'unknown',
                'pillar': 'unknown',
                'indicators': 'unknown',
                'issuesMainSource': 'unknown',
                'sourceCategory': 'unknown',
                'notesForDataAcquisitionProtocol': '',
                'PaidSubscription': '',
                'WordDictionaryWorDDictionary': '',
                'WordDictionarySearcHTerms': '',
            }
            results.append(result)
            # Save the result to MongoDB
            collection.update_one({'link': url}, {'$set': result}, upsert=True)
        except Exception as e:
            results.append({'link': url, 'error': str(e)})
    return results

if __name__ == "__main__":
    urls = json.loads(sys.argv[1])
    results = process_urls(urls)
    print(json.dumps(results))