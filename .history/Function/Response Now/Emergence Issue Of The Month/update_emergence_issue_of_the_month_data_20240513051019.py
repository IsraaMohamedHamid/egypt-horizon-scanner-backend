import logging
import pandas as pd
import tensorflow as tf
from pymongo import MongoClient
from transformers import pipeline, BertTokenizer, MobileBertTokenizer, AutoModelForSequenceClassification, TFAutoModelForSequenceClassification, AutoModel, AutoTokenizer, logging, BertForSequenceClassification, TFBertForSequenceClassification
from langdetect import detect, DetectorFactory
import os

logging.set_verbosity_warning()

# Ensure TensorFlow does not attempt to use unavailable CUDA resources
os.environ['CUDA_VISIBLE_DEVICES'] = '-1'
os.environ['TF_ENABLE_ONEDNN_OPTS'] = '0'
os.environ['TF_CPP_MIN_LOG_LEVEL'] = '2'

# Set seed to get consistent results
DetectorFactory.seed = 0

# Language code to full name mapping
language_mapping = {
    'en': 'English',
    'ar': 'Arabic',
    'fr': 'French',
    'es': 'Spanish',
    'de': 'German',
    'zh': 'Chinese',
    'ja': 'Japanese',
    'ru': 'Russian',
    'it': 'Italian',
    'pt': 'Portuguese'
}

# Function to detect language and return full name
def detect_language(text):
    try:
        code = detect(text)
        return language_mapping.get(code, 'Unknown')
    except:
        return 'Unknown'

# Function to assign sentiment
def assign_sentiment(sentiment):
    if sentiment == 'POSITIVE':
        return 'positive'
    elif sentiment == 'NEGATIVE':
        return 'negative'
    return 'neutral'

# Function to assign weight
def assign_weight(sentiment):
    if sentiment == 'positive':
        return 1.0
    elif sentiment == 'negative':
        return 0.5
    return 0.75

# Function to find the output with the highest score
def find_highest_score(outputs):
    # print(outputs)
    # Assuming outputs is a list of lists as given, we take the first item since your example hints there's only one such list
    result = outputs

    # Initialize variables to store the label with the highest score
    highest_label = result[0]['label']
    highest_score = result[0]['score']

    # Iterate over the list to find the sentiment with the highest score
    for sentiment in result:
        if sentiment['score'] > highest_score:
            highest_score = sentiment['score']
            highest_label = sentiment['label']

    # Return the best output found, or None if no outputs were processed
    return highest_label, highest_score

def sentiment_analysis(text, model, tokenizer):
    # Encode the text using the tokenizer
    inputs = tokenizer(text, return_tensors="tf", truncation=True, padding=True, max_length=512)

    # Perform the prediction
    outputs = model(inputs)

    # Apply softmax to convert logits to probabilities
    probabilities = tf.nn.softmax(outputs.logits, axis=-1)

    # Get the predicted class (index with the highest probability)
    predicted_class_index = tf.argmax(probabilities, axis=-1).numpy()[0]
    predicted_class = model.config.id2label[predicted_class_index]
    
    return predicted_class, probabilities.numpy()


# Function to perform sentiment analysis
def analyze_description_sentiment(description, model, tokenizer, sentiment_classifier):
    # First, detect language
    lang = detect_language(description)
    
    # outputs = distilled_student_sentiment_classifier(description) # model(inputs)
    # sentiment_label, sentiment_score = find_highest_score(outputs)
    sentiment_label, sentiment_score = sentiment_analysis(description, model, tokenizer)
    
    # sentiment = assign_sentiment(sentiment_label)
    
    # print(f"lang: {lang}")
    
    return {
        'sentimentAnalysis': sentiment_label,
        'weight': assign_weight(sentiment_label),
        'score': sentiment_score,
        'language': lang
    }

# Function to update emerging issues data
def update_emerging_issues_data(data, model, tokenizer, pipeline):
    results = data['description'].apply(lambda desc: analyze_description_sentiment(desc, model, tokenizer, pipeline))
    data = pd.concat([data, results.apply(pd.Series)], axis=1)
    return data

if __name__ == "__main__":
    mongo_uri = 'mongodb+srv://doadmin:73Le6F4d2hZ9K8Y0@dbaas-db-5626135-310aba91.mongo.ondigitalocean.com/egypt-horizon-scanner?replicaSet=dbaas-db-5626135&tls=true&authSource=admin'
    client = MongoClient(mongo_uri)
    db = client["egypt-horizon-scanner"]
    collection = db["emergence_issue_of_the_month_data"]

    # Read data from MongoDB collection into a DataFrame
    data = pd.DataFrame(list(collection.find()))

    # Load the model and tokenizer
    model_name = "prajjwal1/bert-tiny" # "AdamCodd/tinybert-sentiment-amazon"
    # "Alireza1044/mobilebert_sst2" 24,582,914
    # "Reza-Madani/mini-bert" 11,171,074
    # "moshew/Mini-bert-distilled" 11,209,367
    # "Katsiaryna/stsb-TinyBERT-L-4-finetuned_auc_40000-top3-BCE" 14,350,561
    # "jysh1023/tiny-bert-sst2-distilled" 4,386,178
    # "m-aliabbas1/tiny_bert_31_erc_intents"" 4,389,919
    # "nbhimte/tiny-bert-mnli-distilled" 14,350,874
    # "Sayan01/tiny-bert-sst2-distilled" 14,350,874
    # "Sayan01/tiny-bert-mrpc-distilled" 14,350,874
    # gokuls/tiny-bert-sst2-1_mobilebert_and_bert-multi-teacher-distillation 4,386,178
    # "yevhenkost/claim-detection-claimbuster-binary-TinyBERT_General_4L_312D" 14,350,874
    # "ChengZ2003/ms-marco-TinyBERT-ONNX"
    # "tkuye/tiny-bert-jdc" 4,386,952
    # "Sayan01/tiny-bert-sst2-distilled" 14,350,874
    # "SavvySpender/fin-cross-encoder-ms-marco-TinyBERT-L-2-v2-dynamicq-8bit-onnx" 
    # "philschmid/tiny-bert-sst2-distilled" 4,386,178
    # "Intel/dynamic_tinybert" 66,956,546
    # "prajjwal1/bert-tiny" 4,386,178
    # "cross-encoder/ms-marco-TinyBERT-L-2-v2" 4,386,049
    # 'huawei-noah/TinyBERT_General_4L_312D'  14,350,248
    # "Theivaprakasham/sentence-transformers-paraphrase-MiniLM-L6-v2-twitter_sentiment"  22,713,216
    # "AdamCodd/tinybert-sentiment-amazon" 4.39M
    # "voidful/albert_chinese_tiny" 4,080,520
    # "albert/albert-base-v2" 11,683,584
    # "lxyuan/distilbert-base-multilingual-cased-sentiments-student" 134,734,080
    # "cardiffnlp/twitter-roberta-base-sentiment-latest" 124,645,632
    # "avichr/heBERT_sentiment_analysis" 109,482,240
    # "finiteautomata/bertweet-base-sentiment-analysis" 134,899,968
    # "austinmw/distilbert-base-uncased-finetuned-tweets-sentiment" 66,362,880
    # "shhossain/all-MiniLM-L6-v2-sentiment-classifier" 19,292
    # "shahrukhx01/bert-mini-sentiment-reward-model" 11,170,560
    # "MarcoPC/finetuning-sentiment-model-3000-samples" 66,955,010
    # "gosorio/minilmFT_TripAdvisor_Sentiment" 33,361,155
    # "sakasa007/finetuning-sentiment-text-mining" 134,902,275
    # "stas/tiny-wmt19-en-ru"
    # "cross-encoder/ms-marco-TinyBERT-L-2" 4,386,049
    # "cross-encoder/ms-marco-TinyBERT-L-2-v2" 4,386,049
    # "cross-encoder/stsb-TinyBERT-L-4" 14,350,561
    
    # Load model directly
    sentiment_classifier = pipeline("text-classification", model=model_name)
    text_classifier = pipeline("text-classification", model=model_name)

    # Calculate the total number of parameters
    model = TFAutoModelForSequenceClassification.from_pretrained(model_name, from_pt=True)
    tokenizer =  AutoTokenizer.from_pretrained(model_name) # TinyBertTokenizer.from_pretrained(model_name)

    total_params = sum(tf.size(variable).numpy() for variable in model.trainable_variables)
    print(f"Total Parameters in {model_name}: {total_params}")
    
    # Update the data
    updated_data = update_emerging_issues_data(data, model, tokenizer, sentiment_classifier)

    # Rename duplicate columns
    updated_data = updated_data.loc[:,~updated_data.columns.duplicated()]

    # Save the updated data back to MongoDB collection
    updated_records = updated_data.to_dict(orient='records')
    print

    collection.delete_many({})  # Clear existing data
    collection.insert_many(updated_records)