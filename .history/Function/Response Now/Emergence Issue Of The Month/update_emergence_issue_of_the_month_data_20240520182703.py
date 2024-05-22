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
    outputs = model(inputs)
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
    mongo_uri = 'mongodb+srv://doadmin:w94yB2Y17dWE8C63@dbaas-db-5626135-310aba91.mongo.ondigitalocean.com/egypt-horizon-scanner?tls=true&authSource=admin&replicaSet=dbaas-db-5626135'
    client = MongoClient(mongo_uri)
    db = client["egypt-horizon-scanner"]
    collection = db["emergence_issue_of_the_month_data"]
    collection = db["emergence_issue_of_the_month_data"]
    
    # Load data from MongoDB
    data = pd.DataFrame(list(collection.find()))

    # Load model and tokenizer
    model_name = "jysh1023/tiny-bert-sst2-distilled"
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
    
    
    
    
##################### MODELS AND THEIR PARAM SIZE #####################
 # "AdamCodd/tinybert-sentiment-amazon"
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