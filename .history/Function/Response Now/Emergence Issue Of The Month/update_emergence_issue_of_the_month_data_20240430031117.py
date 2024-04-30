!pip install pandas

import pandas as pd
from transformers import pipeline
from pymongo import MongoClient

# Function to assign sentiment
def assign_sentiment(sentiment):
    if 'POSITIVE' in sentiment:
        return 'positive'
    elif 'NEGATIVE' in sentiment:
        return 'negative'
    else:
        return 'neutral'

# Function to assign weight
def assign_weight(sentiment):
    if 'positive' in sentiment:
        return 1.0
    elif 'negative' in sentiment:
        return 0.5
    else:
        return 0.75

# Function to perform sentiment analysis
def analyze_description_sentiment(description, sentiment_analyzer):
    sentiment_result = sentiment_analyzer(description)
    sentiment_label = sentiment_result[0]['label']
    sentiment_score = sentiment_result[0]['score']
    
    return {
        'sentiment': assign_sentiment(sentiment_label),
        'weight': assign_weight(assign_sentiment(sentiment_label)),
        'score': sentiment_score
    }

# Function to update emerging issues data
def update_emerging_issues_data(data):
    sentiment_analyzer = pipeline("sentiment-analysis")

    data['sentiment'] = data['description'].map(lambda desc: analyze_description_sentiment(desc, sentiment_analyzer)['sentiment'])
    data['weight'] = data['description'].map(lambda desc: analyze_description_sentiment(desc, sentiment_analyzer)['weight'])
    data['score'] = data['description'].map(lambda desc: analyze_description_sentiment(desc, sentiment_analyzer)['score'])
    
    return data

if __name__ == "__main__":
    # Connect to MongoDB database
    mongo_uri = 'mongodb+srv://doadmin:3SPyA6U2Q901Ot75@dbaas-db-5626135-310aba91.mongo.ondigitalocean.com/egypt-horizon-scanner?tls=true&authSource=admin&replicaSet=dbaas-db-5626135'
    client = MongoClient(mongo_uri)
    db = client["egypt-horizon-scanner"]
    collection = db["emergence_issue_of_the_month_data"]

    # Read data from MongoDB collection into a DataFrame
    data = pd.DataFrame(list(collection.find()))

    # Update the data
    updated_data = update_emerging_issues_data(data)

    # Save the updated data back to MongoDB collection
    updated_records = updated_data.to_dict(orient='records')
    collection.delete_many({})  # Clear existing data
    collection.insert_many(updated_records)