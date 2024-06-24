import os
import sys
import nltk
import pandas as pd
import aiohttp
import asyncio
from bs4 import BeautifulSoup
from pymongo import MongoClient, UpdateOne, errors
from cachetools import cached, TTLCache
import logging
from langdetect import detect, DetectorFactory
from openai import OpenAI
import nest_asyncio


# Apply the nest_asyncio patch
nest_asyncio.apply()

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

# OpenAI API client initialization
client = OpenAI(api_key="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")

# Function to get response from GPT-3.5-turbo
async def gpt_get(prompt, model="gpt-3.5-turbo"):
    messages = [{"role": "user", "content": prompt}]
    response = client.chat.completions.create(
            model=model,
            messages=messages,
            temperature=0,
            #response_format={ "type": "json_object" }
        )
    return response.choices[0].message.content.strip(), response.usage.prompt_tokens, response.usage.completion_tokens

async def summarize_webpage(url):
    prompt = f"From the following link {url} Summarize the text in 5 lines."
    summary, input_tokens, output_tokens = await gpt_get(prompt)
    return summary, input_tokens, output_tokens

async def sentiment_analysis(summary):
    prompt = f"Analyze the sentiment of the following text and return 'positive', 'neutral', or 'negative': {summary}"
    sentiment, input_tokens, output_tokens = await gpt_get(prompt)
    return sentiment, input_tokens, output_tokens

def detect_language(text):
    try:
        return language_mapping.get(detect(text), 'Unknown')
    except Exception as e:
        logging.error("Error in language detection: %s", str(e))
        return 'Unknown'


async def analyze_text(url):
    summary, summary_input_tokens, summary_output_tokens = await summarize_webpage(url)
    sentiment, sentiment_input_tokens, sentiment_output_tokens = await sentiment_analysis(summary)
    
    return summary.strip(), summary_input_tokens, summary_output_tokens, sentiment, sentiment_input_tokens, sentiment_output_tokens

async def process_url(session, item):
    try:
        url = item.get('link')
        if not url:
            return {'_id': item.get('_id'), 'link': None, 'error': "URL is missing"}

        summary, summary_input_tokens, summary_output_tokens, sentiment, sentiment_input_tokens, sentiment_output_tokens = await analyze_text(url)
        lang = detect_language(summary)

        result = {
            '_id': item.get('_id'),
            'emergingIssue': item.get('issueTitle'),
            'language': lang,
            'description': summary,
            'summary_input_tokens': summary_input_tokens,
            'summary_output_tokens': summary_output_tokens,
            'sentimentAnalysis': sentiment,
            'sentiment_input_tokens': sentiment_input_tokens,
            'sentiment_output_tokens': sentiment_output_tokens
        }

        return result
    except Exception as e:
        logging.error("Error processing URL %s: %s", item.get('link'), str(e))
        return {'_id': item.get('_id'), 'link': item.get('link'), 'error': str(e)}

async def update_emerging_issues_data(collection):
    data = pd.DataFrame(list(collection.find()))

    if data.empty:
        logging.info("No data to process.")
        return

    updates = []
    total_input_tokens = 0
    total_output_tokens = 0

    async with aiohttp.ClientSession() as session:
        tasks = [process_url(session, row.to_dict()) for index, row in data.iterrows()]
        results = await asyncio.gather(*tasks)

        for result in results:
            if 'error' not in result:
                row = data.loc[data['_id'] == result['_id']].iloc[0]
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
                total_input_tokens += result['summary_input_tokens'] + result['sentiment_input_tokens']
                total_output_tokens += result['summary_output_tokens'] + result['sentiment_output_tokens']

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

    # Calculate and print the total cost
    input_cost = (total_input_tokens * 0.50) / 1_000_000
    output_cost = (total_output_tokens * 1.50) / 1_000_000
    total_cost = input_cost + output_cost

    logging.info(f"Total cost: ${total_cost:.6f}")

def main():
    db_collection = get_mongo_connection()

    # Fetching all data from the collection
    data = list(db_collection.find())

    logging.info(f"START: Total records: {len(data)}")

    # Validate URLs
    valid_data = [item for item in data if isinstance(item, dict) and item.get('link')]

    if not valid_data:
        logging.info("No valid URLs found in the input data.")
        sys.exit(1)

    # Attempt to process URLs
    asyncio.run(update_emerging_issues_data(db_collection))

if __name__ == "__main__":
    main()