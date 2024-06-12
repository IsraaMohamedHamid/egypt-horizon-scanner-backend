import json
import os
import sys
import nltk
import pandas as pd
import aiohttp
import asyncio
from pymongo import MongoClient, UpdateOne, errors
from cachetools import cached, TTLCache
import logging
from langdetect import detect, DetectorFactory
from openai import OpenAI
import nest_asyncio
import re

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
        mongo_uri = 'mongodb+srv://doadmin:w94yB2Y17dWE8C63@dbaas-db-5626135-310aba91.mongo.ondigitalocean.com/egypt-horizon-scanner?tls=true&authSource=admin&replicaSet=dbaas-db-5626135'
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
        )
    return response.choices[0].message.content.strip(), response.usage.prompt_tokens, response.usage.completion_tokens

# Helper function to remove outer quotes
def remove_outer_quotes(text):
    if text.startswith('"') and text.endswith('"'):
        return text[1:-1]
    return text

# Function to parse classification and extraction response
def parse_classification_and_extraction(response):
    sections = {"Themes": [], "Main objectives": [], "Main outcomes": [], "Problem statement": [], "KPIs": []}
    current_section = None
    
    for line in response.split("\n"):
        line = line.strip()
        if line.startswith("Themes:"):
            current_section = "Themes"
            sections[current_section] = []
        elif line.startswith("Main objectives:"):
            current_section = "Main objectives"
            sections[current_section] = []
        elif line.startswith("Main outcomes:"):
            current_section = "Main outcomes"
            sections[current_section] = []
        elif line.startswith("Problem statement:"):
            current_section = "Problem statement"
            sections[current_section] = []
        elif line.startswith("KPIs:"):
            current_section = "KPIs"
            sections[current_section] = []
        elif current_section:
            sections[current_section].append(remove_outer_quotes(line))
    
    # Join the sections content to create single strings
    for key in sections:
        sections[key] = " ".join(sections[key]).strip()
    
    return sections["Themes"], sections

# Function to summarize webpage
async def summarize_webpage(url):
    prompt = f"Summarize the text from the following link in 5 lines: {url}"
    summary, input_tokens, output_tokens = await gpt_get(prompt)
    return summary, input_tokens, output_tokens


# Function to detect language
def detect_language(text):
    try:
        return language_mapping.get(detect(text), 'Unknown')
    except Exception as e:
        logging.error("Error in language detection: %s", str(e))
        return 'Unknown'

# Function to analyze text from URL
async def analyze_text(url):
    summary, summary_input_tokens, summary_output_tokens = await summarize_webpage(url)
    themesMap = {}

    
    return {
        'summary': summary.strip(),
        'summary_input_tokens': summary_input_tokens,
        'summary_output_tokens': summary_output_tokens,
        'sentiment': sentiment,
        'sentiment_input_tokens': sentiment_input_tokens,
        'sentiment_output_tokens': sentiment_output_tokens,
        # 'themes': themes,
        # 'themes_input_tokens': themes_input_tokens,
        # 'themes_output_tokens': themes_output_tokens,
        # 'extracted_info': extracted_info,
        'themesMap': themesMap
    }

# Function to process each URL
async def process_url(session, item):
    try:
        url = item.get('link')
        if not url:
            return {'_id': item.get('_id'), 'link': None, 'error': "URL is missing"}

        analysis_results = await analyze_text(url)
        lang = detect_language(analysis_results['summary'])

        result = {
            '_id': item.get('_id'),
            'emergingIssue': item.get('issueTitle'),
            'language': lang,
            'description': analysis_results['summary'],
            'summary_input_tokens': analysis_results['summary_input_tokens'],
            'summary_output_tokens': analysis_results['summary_output_tokens'],
            'sentimentAnalysis': analysis_results['sentiment'],
            'sentiment_input_tokens': analysis_results['sentiment_input_tokens'],
            'sentiment_output_tokens': analysis_results['sentiment_output_tokens'],
            'theme': analysis_results['themes'],
            'theme_input_tokens': analysis_results['themes_input_tokens'],
            'theme_output_tokens': analysis_results['themes_output_tokens'],
            'issueObject': analysis_results['extracted_info'].get("Main objectives", "").strip(),
            'issueOutcome': analysis_results['extracted_info'].get("Main outcomes", "").strip(),
            'issueProblemStatment': analysis_results['extracted_info'].get("Problem statement", "").strip(),
            'issueKPI': analysis_results['extracted_info'].get("KPIs", "").strip(),
            'extracted_info_input_tokens': analysis_results['themes_input_tokens'] + analysis_results['themes_output_tokens'],
            'extracted_info_output_tokens': analysis_results['summary_output_tokens'] + analysis_results['sentiment_output_tokens']
        }

        return result
    except Exception as e:
        logging.error("Error processing URL %s: %s", item.get('link'), str(e))
        return {'_id': item.get('_id'), 'link': item.get('link'), 'error': str(e)}

# Function to update emerging issues data in MongoDB
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
        asyncio.run(update_emerging_issues_data(db_collection))
    except Exception as e:
        logging.error("An error occurred: %s", e)
        sys.exit(1)