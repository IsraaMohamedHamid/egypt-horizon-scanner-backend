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
        return db["dimensions"]
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

# Function to remove outer quotes
def remove_outer_quotes(text):
    if text.startswith('"') and text.endswith('"'):
        return text[1:-1]
    return text

# Function to parse classification and extraction response
def parse_classification_and_extraction(response_dict):
    # Extract the string from the 'Themes' key
    response = response_dict
    
    # Define the regex pattern for sections
    pattern = re.compile(r"(Main objectives:|Main outcomes:|Problem statement:|KPIs:)", re.IGNORECASE)
    
    # Initialize a dictionary to store the sections
    sections = {"Themes": [], "Main objectives": "", "Main outcomes": "", "Problem statement": "", "KPIs": ""}
    current_section = "Themes"
    
    for line in response.split("-"):
        line = line.strip()
        
        # Check if the line matches a section header
        match = pattern.match(line)
        if match:
            current_section = match.group(1).rstrip(":")
            continue
        
        # If we're within a section, add lines to that section
        if current_section:
            if current_section == "Themes":
                sections[current_section].append(remove_outer_quotes(line))
            else:
                sections[current_section] += remove_outer_quotes(line) + " "
    
    # Join the themes content to create a single string
    sections["Themes"] = " ".join(sections["Themes"]).strip()
    
    # Strip any extra whitespace from the sections
    for key in sections:
        if key != "Themes":
            sections[key] = sections[key].strip()
    
    return sections["Themes"], sections

# Function to extract and classify text from a webpage
async def classify_and_extract_text(url):
    prompt = (
        f"From the following Link {url}, classify the text into 5 of the following themes and extract relevant information:\n"
        "Themes:\n"
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
        "Extract information:\n"
        "- Main objectives\n"
        "- Main outcomes\n"
        "- Problem statement\n"
        "- KPIs"
    )
    
    response, input_tokens, output_tokens = await gpt_get(prompt)
    themes, extracted_info = parse_classification_and_extraction(response)
    
    return themes, extracted_info, input_tokens, output_tokens

# Function to summarize webpage
async def summarize_webpage(url):
    prompt = f"Summarize the text from the following Link in 5 lines: {url}"
    summary, input_tokens, output_tokens = await gpt_get(prompt)
    return summary, input_tokens, output_tokens

# Function to perform sentiment analysis
async def sentiment_analysis(summary):
    prompt = f"Analyze the sentiment of the following text and return 'positive', 'neutral', or 'negative': {summary}"
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
    themes, extracted_info, themes_input_tokens, themes_output_tokens = await classify_and_extract_text(url)
    print(themes)
    print(extracted_info)
    summary, summary_input_tokens, summary_output_tokens = await summarize_webpage(url)
    # sentiment, sentiment_input_tokens, sentiment_output_tokens = await sentiment_analysis(summary)
   
    return {
        'summary': summary.strip(),
        'summary_input_tokens': summary_input_tokens,
        'summary_output_tokens': summary_output_tokens,
        # 'sentiment': sentiment,
        # 'sentiment_input_tokens': sentiment_input_tokens,
        # 'sentiment_output_tokens': sentiment_output_tokens,
        'themes': themes,
        'themes_input_tokens': themes_input_tokens,
        'themes_output_tokens': themes_output_tokens,
        'extracted_info': extracted_info
    }

# Function to process each URL
async def process_url(session, item):
    try:
        url = item.get('Link')
        if not url:
            return {'_id': item.get('_id'), 'Link': None, 'error': "URL is missing"}

        analysis_results = await analyze_text(url)
        lang = detect_language(analysis_results['summary'])
        
        print(analysis_results)

        result = {
            '_id': item.get('_id'),
            'Language': lang,
            'Description': analysis_results['summary'],
            'summary_input_tokens': analysis_results['summary_input_tokens'],
            'summary_output_tokens': analysis_results['summary_output_tokens'],
            'Themes': analysis_results['themes'],
            'theme_input_tokens': analysis_results['themes_input_tokens'],
            'theme_output_tokens': analysis_results['themes_output_tokens'],
            'MainObject': [analysis_results['extracted_info'].get("Main objectives", "").strip()],
            'MainOutcome': [analysis_results['extracted_info'].get("Main outcomes", "").strip()],
            'ProblemStatment': [analysis_results['extracted_info'].get("Problem statement", "").strip()],
            'KPIs': [analysis_results['extracted_info'].get("KPIs", "").strip()],
        }
        
        # print(result)

        return result
    except Exception as e:
        logging.error("Error processing URL %s: %s", item.get('Link'), str(e))
        return {'_id': item.get('_id'), 'Link': item.get('Link'), 'error': str(e)}

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
                        'Link': row['Link'],
                        "Dimension": row['Dimension'],
                        'Pillars': row['Pillars'],
                        'Indicators': row['Indicators'],
                        'Source': row['Source']
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
        valid_data = [item for item in data if isinstance(item, dict) and item.get('Link')]
        
        if not valid_data:
            logging.error("No valid URLs found in the input data.")
            sys.exit(1)
        
        # Attempt to process URLs
        asyncio.run(update_emerging_issues_data(db_collection))
    except Exception as e:
        logging.error("An error occurred: %s", e)
        sys.exit(1)
