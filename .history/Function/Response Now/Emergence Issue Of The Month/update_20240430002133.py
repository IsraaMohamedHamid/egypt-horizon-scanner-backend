import pandas as pd
from transformers import pipeline

def assign_sentiment(sentiment):
    if 'POSITIVE' in sentiment:
        return 'positive'
    elif 'NEGATIVE' in sentiment:
        return 'negative'
    else:
        return 'neutral'

def assign_weight(sentiment):
    if 'positive' in sentiment:
        return 1.0
    elif 'negative' in sentiment:
        return 0.5
    else:
        return 0.75

def analyze_description_sentiment(description, sentiment_analyzer):
    sentiment_result = sentiment_analyzer(description)
    sentiment_label = sentiment_result[0]['label']
    sentiment_score = sentiment_result[0]['score']
    
    return {
        'sentiment': assign_sentiment(sentiment_label),
        'weight': assign_weight(assign_sentiment(sentiment_label)),
        'score': sentiment_score
    }

def update_emerging_issues_data(data):
    sentiment_analyzer = pipeline("sentiment-analysis")

    data['sentiment'] = data['description'].map(lambda desc: analyze_description_sentiment(desc, sentiment_analyzer)['sentiment'])
    data['weight'] = data['description'].map(lambda desc: analyze_description_sentiment(desc, sentiment_analyzer)['weight'])
    data['score'] = data['description'].map(lambda desc: analyze_description_sentiment(desc, sentiment_analyzer)['score'])
    
    data.drop(columns=['_id'], inplace=True)
    
    return data

if __name__ == "__main__":
    # Example usage
    data = pd.read_csv("your_data.csv")  # Replace "your_data.csv" with the path to your data file
    updated_data = update_emerging_issues_data(data)
    print(updated_data)
