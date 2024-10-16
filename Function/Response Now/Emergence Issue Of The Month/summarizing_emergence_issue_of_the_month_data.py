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
db_collection = get_mongo_connection()

# Fetching all data from the collection
data = list(db_collection.find())

data

# Cache configuration
cache = TTLCache(maxsize=100, ttl=300)

# OpenAI API client initialization
client = OpenAI(api_key="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")

# Function to get response from GPT-3.5-turbo
async def gpt_get(prompt, model="gpt-4o-mini"): # "gpt-3.5-turbo"
    messages = [{"role": "user", "content": prompt}]
    try:
        # Correctly await the async API call
        response = client.chat.completions.create(
            model=model,
            messages=messages,
            temperature=0.9,
        )
        # Debugging: Log the response
        # logging.info("API Response: %s", response)
        return response.choices[0].message.content.strip()
    except Exception as e:
        # logging.error("Error in gpt_get: %s", e)
        return None  # Return None to indicate failure

# Helper function to remove outer quotes
def remove_outer_quotes(text):
    if text.startswith('"') and text.endswith('"'):
        return text[1:-1]
    return text

# Function to parse classification and extraction response
def parse_classification_and_extraction(response):
    sections = {
        "Themes": [], 
        "SDG Targets": [], 
        "Publication Date": "", 
        "Main objectives": "", 
        "Main outcomes": "", 
        "Problem statement": "", 
        "KPIs": ""
    }
    current_section = None

    try:
        for line in response.split("\n"):
            line = line.strip()
            if line.startswith("Themes:"):
                current_section = "Themes"
                sections[current_section] = line[len("Themes:"):].strip('[]').split(", ")
            elif line.startswith("SDG Targets:"):
                current_section = "SDG Targets"
                sections[current_section] = line[len("SDG Targets:"):].strip('[]').split(", ")
            elif line.startswith("Publication Date:"):
                current_section = "Publication Date"
                sections[current_section] = line[len("Publication Date:"):].strip().strip('"')
            elif line.startswith("Main objectives:"):
                current_section = "Main objectives"
                sections[current_section] = line[len("Main objectives:"):].strip().strip('"')
            elif line.startswith("Main outcomes:"):
                current_section = "Main outcomes"
                sections[current_section] = line[len("Main outcomes:"):].strip().strip('"')
            elif line.startswith("Problem statement:"):
                current_section = "Problem statement"
                sections[current_section] = line[len("Problem statement:"):].strip().strip('"')
            elif line.startswith("KPIs:"):
                current_section = "KPIs"
                sections[current_section] = line[len("KPIs:"):].strip().strip('"')

        # Debugging: Log parsed sections
        # logging.info("Parsed sections: %s", sections)

    except Exception as e:
        logging.error("Error parsing response: %s", e)
    
    return sections["Themes"], sections

# Function to extract and classify text from a webpage
async def classify_and_extract_text(url):
    print(f"Processing URL for classification and extraction: {url}")
    prompt = (
        f"From the following link {url}, identify and extract the following information:\n"
        "Themes (up to 5):\n"
        "1. Adopt a gender-sensitive approach to climate change\n"
        "2. Biodiversity challenges in Egypt\n"
        "3. Challenges Facing the Implementation of Education for Sustainable Development in Egypt\n"
        "4. Challenges of Egyptian food exports to EU, US\n"
        "5. Climate change obstacles\n"
        "6. Digital government services\n"
        "7. Digital Infrastructure\n"
        "8. Economic issues\n"
        "9. Egypt's neighbouring countries and partners\n"
        "10. Egyptian Foreign Policy: Opportunities and Challenges in 2024\n"
        "11. Exchange rate and foreign currency\n"
        "12. Exclusion of the Egyptian SMEs in the banking system\n"
        "13. Food security and global trade challenges\n"
        "14. Funding Fintech\n"
        "15. Governmental changes\n"
        "16. Green jobs\n"
        "17. Hard currency shortage devaluation and decrease domestic demand\n"
        "18. Health issues\n"
        "19. Heatwaves reduce crops\n"
        "20. High food prices\n"
        "21. High number of doctors resign\n"
        "22. Illegal informal employment\n"
        "23. Infrastructure investments\n"
        "24. Innovate financing tools for the energy sector\n"
        "25. Lack of access to data, financial and technical support for the private sector\n"
        "26. Lack of adequate funding to transition into green growth\n"
        "27. Logistics in Africa: Status, Challenges & Routes for Egyptian Exports\n"
        "28. Losses of the national economy\n"
        "29. Low efficiency of public investment\n"
        "30. Modern and advanced infrastructure\n"
        "31. Natural gas and wheat supply\n"
        "32. Natural gas decline and power cuts\n"
        "33. Nile Dam\n"
        "34. Overpopulation\n"
        "35. Palestine, Sudan and EU policy\n"
        "36. Plastic waste mismanagement in Egypt\n"
        "37. Possible disconnects between the Government's macro policy aims for the green transition as well as the on-ground perceptions, concerns, and experiences of private sector actors\n"
        "38. Problem of Illiteracy\n"
        "39. Raising sea levels make Delta a vulnerable hotspot\n"
        "40. Rising fuel prices\n"
        "41. Rising sea levels\n"
        "42. School system caution threatening losing control\n"
        "43. Seasonal soil salinity and land degradation\n"
        "44. Sovereign Green bond allocation\n"
        "45. State of infrastructure in Egypt\n"
        "46. Stigma and discrimination against HIV\n"
        "47. Structural and cyclical determinants in Egypt for accessing to finance\n"
        "48. Student density in classrooms\n"
        "49. Sugar crisis\n"
        "50. Sustainable finance\n"
        "51. Targeting issues\n"
        "52. The excessive bureaucracy and limited access to credit for the private investment\n"
        "53. The insufficient marketing efforts for MICE tourism\n"
        "54. Unemployment\n"
        "55. Water management challenges\n"
        "56. Water scarcity and food production\n"
        "57. Water-Energy-Food nexus\n"
        "58. Wheat shortage and high prices\n"
        "SDG Targets (up to 5):\n"
        "1. GOAL 1: No Poverty\n"
        "2. GOAL 2: Zero Hunger\n"
        "3. GOAL 3: Good Health And Well-being\n"
        "4. GOAL 4: Quality Education\n"
        "5. GOAL 5: Gender Equality\n"
        "6. GOAL 6: Clean Water And Sanitation\n"
        "7. GOAL 7: Affordable And Clean Energy\n"
        "8. GOAL 8: Decent Work And Economic Growth\n"
        "9. GOAL 9: Industry, Innovation And Infrastructure\n"
        "10. GOAL 10: Reduced Inequality\n"
        "11. GOAL 11: Sustainable Cities And Communities\n"
        "12. GOAL 12: Responsible Consumption And Production\n"
        "13. GOAL 13: Climate Action\n"
        "14. GOAL 14: Life Below Water\n"
        "15. GOAL 15: Life on Land\n"
        "16. GOAL 16: Peace And Justice Strong Institutions\n"
        "17. GOAL 17: Partnerships to achieve the Goal\n"
        "Extract the following details:\n"
        "- Publication Date (in day/month/year format)\n"
        "- Main objectives\n"
        "- Main outcomes\n"
        "- Problem statement\n"
        "- KPIs\n"
        "Format the extracted information as follows:\n"
        "{\n"
        "  'Themes': [Themes],\n"
        "  'SDG Targets': [SDG Targets],\n"
        "  'Publication Date': 'day/month/year',\n"
        "  'Main objectives': '...',\n"
        "  'Main outcomes': '...',\n"
        "  'Problem statement': '...',\n"
        "  'KPIs': '...'\n"
        "}"
    )

    response = await gpt_get(prompt)
    
    # Check if the response is valid
    if not response:
        logging.error("No response from API or an error occurred.")
        return [], {}
    
    # Debugging: Log the raw response
    # logging.info("Raw Response: %s", response)

    # Parse the response safely
    try:
        themes, extracted_info = parse_classification_and_extraction(response)
    except Exception as e:
        # logging.error("Error parsing response: %s", e)
        themes, extracted_info = [], {}
    
    return themes, extracted_info

# asyncio.run(classify_and_extract_text("https://www.atlanticcouncil.org/in-depth-research-reports/report/egypt-stability-gcc-priority/"))
# Function to summarize webpage
async def summarize_webpage(url):
    prompt = f"Summarize the text from the following link in 5 lines: {url}"
    summary, input_tokens, output_tokens = await gpt_get(prompt)
    return summary, input_tokens, output_tokens

# Function to perform sentiment analysis
async def sentiment_analysis(summary):
    prompt = f"Analyze the sentiment of the following text and return only the sentiment: 'positive', 'neutral', or 'negative': {summary}"
    sentiment, input_tokens, output_tokens = await gpt_get(prompt)
    return sentiment, input_tokens, output_tokens

# Function to detect language
def detect_language(text):
    try:
        return language_mapping.get(detect(text), 'Unknown')
    except Exception as e:
        logging.error("Error in language detection: %s", str(e))
        return 'Unknown'
    
# Function to analyze text from URL
async def analyze_text(url):
    themes, extracted_info = await classify_and_extract_text(url)
    summary, summary_input_tokens, summary_output_tokens = await summarize_webpage(url)
    sentiment, sentiment_input_tokens, sentiment_output_tokens = await sentiment_analysis(summary)
    
    return {
        'summary': summary.strip(),
        'summary_input_tokens': summary_input_tokens,
        'summary_output_tokens': summary_output_tokens,
        'sentiment': sentiment,
        'sentiment_input_tokens': sentiment_input_tokens,
        'sentiment_output_tokens': sentiment_output_tokens,
        'themes': themes,
        'sdg_targets': extracted_info.get("SDG Targets", []),
        'publication_date': extracted_info.get("Publication Date", "").strip(),
        'issueObject': extracted_info.get("Main objectives", "").strip(),
        'issueOutcome': extracted_info.get("Main outcomes", "").strip(),
        'issueProblemStatement': extracted_info.get("Problem statement", "").strip(),
        'issueKPI': extracted_info.get("KPIs", "").strip()
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
            'sdg_targets': analysis_results['sdg_targets'],
            'publication_date': analysis_results['publication_date'],
            'issueObject': analysis_results['issueObject'],
            'issueOutcome': analysis_results['issueOutcome'],
            'issueProblemStatement': analysis_results['issueProblemStatement'],
            'issueKPI': analysis_results['issueKPI'],
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
            logging.info(result)
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

# Main execution
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