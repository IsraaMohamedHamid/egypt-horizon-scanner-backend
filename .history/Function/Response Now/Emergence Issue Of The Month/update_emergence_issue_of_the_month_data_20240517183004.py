import os
import pandas as pd
import tensorflow as tf
from pymongo import MongoClient
from transformers import pipeline, AutoTokenizer, TFAutoModelForSequenceClassification, logging
from langdetect import detect, DetectorFactory

# Configure logging
logging.set_verbosity_warning()

# Configure TensorFlow to avoid using GPU
os.environ['CUDA_VISIBLE_DEVICES'] = '-1'
os.environ['TF_ENABLE_ONEDNN_OPTS'] = '0'
os.environ['TF_CPP_MIN_LOG_LEVEL'] = '2'

# Set deterministic behavior
DetectorFactory.seed = 0

# Language mapping dictionary
language_mapping = {
    'en': 'English', 'ar': 'Arabic', 'fr': 'French', 'es': 'Spanish', 
    'de': 'German', 'zh': 'Chinese', 'ja': 'Japanese', 'ru': 'Russian', 
    'it': 'Italian', 'pt': 'Portuguese'
}

def detect_language(text):
    try:
        return language_mapping.get(detect(text), 'Unknown')
    except:
        return 'Unknown'

def sentiment_analysis(text, model, tokenizer):
    inputs = tokenizer(text, return_tensors="tf", truncation=True, padding=True, max_length=512)
    outputs = mongoose.modelinputs)
    probabilities = tf.nn.softmax(outputs.logits, axis=-1)
    predicted_class_index = tf.argmax(probabilities, axis=-1).numpy()[0]
    return model.config.id2label[predicted_class_index], probabilities.numpy()

def analyze_description_sentiment(description, model, tokenizer):
    lang = detect_language(description)
    sentiment_label, sentiment_score = sentiment_analysis(description, model, tokenizer)
    weight = {'positive': 1.0, 'neutral': 0.75, 'negative': 0.5}.get(sentiment_label, 0.75)
    return {'sentimentAnalysis': sentiment_label, 'weight': weight, 'score': sentiment_score, 'language': lang}

def update_emerging_issues_data(data, model, tokenizer):
    results = data['description'].apply(lambda desc: analyze_description_sentiment(desc, model, tokenizer))
    return pd.concat([data, results.apply(pd.Series)], axis=1)

if __name__ == "__main__":
    # MongoDB connection setup
    mongo_uri = 'your_mongo_uri_here'
    client = MongoClient(mongo_uri)
    db = client["your_database_name"]
    collection = db["your_collection_name"]
    
    # Load data from MongoDB
    data = pd.DataFrame(list(collection.find()))

    # Load model and tokenizer
    model_name = "model_identifier_here"
    model = TFAutoModelForSequenceClassification.from_pretrained(model_name, from_pt=True)
    tokenizer = AutoTokenizer.from_pretrained(model_name)
    sentiment_classifier = pipeline("sentiment-analysis", model=model_name)
    
    # Update data
    updated_data = update_emerging_issues_data(data, model, tokenizer)
    updated_data = updated_data.loc[:,~updated_data.columns.duplicated()]
    
    # Save updated data back to MongoDB
    collection.delete_many({})
    collection.insert_many(updated_data.to_dict(orient='records'))
    print(f"Updated {len(updated_data)} records")
    
    
    
    
##################### MODELS AND THEIR PARAM 