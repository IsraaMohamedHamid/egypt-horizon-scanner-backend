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
import mongoose from 'mongoose';

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

# Theme to Dimension, Pillars, Indicators, Issues title mapping
theme_mapping = {
    "Egypt's neighbouring countries and partners": {
        "Dimension": "Economic",
        "Pillars": "Economic development",
        "Indicators": "",
        "Issues title": "Egypt's neighbouring countries and partners"
    },
    "Palestine, Sudan and EU policy": {
        "Dimension": "Economic",
        "Pillars": "Economic development",
        "Indicators": "Security Incidents (S)",
        "Issues title": "Palestine, Sudan and EU policy"
    },
    # ... (add the rest of the theme_mapping here)
}

# MongoDB connection using Mongoose
mongoose.connect('mongodb+srv://doadmin:6d30Bi4ec59u7ag1@egypt-horizon-scanner-1948d167.mongo.ondigitalocean.com/egypt-horizon-scanner?tls=true&authSource=admin&replicaSet=egypt-horizon-scanner', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

const dimensionSchema = new mongoose.Schema({
  Dimension: String,
  Pillars: String,
  Indicators: String,
  Source: String,
  Link: String,
  Description: String,
  Language: String,
  Themes: [String],
  MainObject: String,
  MainOutcome: String,
  ProblemStatment: String,
  KPIs: String,
  summary_input_tokens: Number,
  summary_output_tokens: Number,
  // sentimentAnalysis: String,
  // sentiment_input_tokens: Number,
  // sentiment_output_tokens: Number,
  theme_input_tokens: Number,
  theme_output_tokens: Number,
  extracted_info_input_tokens: Number,
  extracted_info_output_tokens: Number,
});

const Dimension = mongoose.model('Dimension', dimensionSchema);

// Cache configuration
cache = TTLCache(maxsize=100, ttl=300);

// OpenAI API client initialization
client = OpenAI(api_key="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");

// Function to get response from GPT-3.5-turbo
async function gpt_get(prompt, model="gpt-3.5-turbo") {
    const messages = [{role: "user", content: prompt}];
    const response = await client.chat.completions.create({
        model: model,
        messages: messages,
        temperature: 0,
    });
    return [response.choices[0].message.content.trim(), response.usage.prompt_tokens, response.usage.completion_tokens];
}

// Helper function to remove outer quotes
function remove_outer_quotes(text) {
    if (text.startsWith('"') && text.endsWith('"')) {
        return text.slice(1, -1);
    }
    return text;
}

// Function to parse classification and extraction response
function parse_classification_and_extraction(response) {
    const sections = {"Themes": [], "Main objectives": [], "Main outcomes": [], "Problem statement": [], "KPIs": []};
    let current_section = null;

    response.split("\n").forEach(line => {
        line = line.trim();
        if (line.startsWith("Themes:")) {
            current_section = "Themes";
            sections[current_section] = [];
        } else if (line.startsWith("Main objectives:")) {
            current_section = "Main objectives";
            sections[current_section] = [];
        } else if (line.startsWith("Main outcomes:")) {
            current_section = "Main outcomes";
            sections[current_section] = [];
        } else if (line.startsWith("Problem statement:")) {
            current_section = "Problem statement";
            sections[current_section] = [];
        } else if (line.startsWith("KPIs:")) {
            current_section = "KPIs";
            sections[current_section] = [];
        } else if (current_section) {
            sections[current_section].push(remove_outer_quotes(line));
        }
    });

    // Join the sections content to create single strings
    Object.keys(sections).forEach(key => {
        sections[key] = sections[key].join(" ").trim();
    });

    return [sections["Themes"], sections];
}

// Function to extract and classify text from a webpage
async function classify_and_extract_text(url) {
    const prompt = (
        `From the following Link ${url}, classify the text into themes and extract relevant information:\n`
        // Add the rest of the prompt here
    );

    const [response, input_tokens, output_tokens] = await gpt_get(prompt);
    const [themes, extracted_info] = parse_classification_and_extraction(response);

    return [themes, extracted_info, input_tokens, output_tokens];
}

// Function to summarize webpage
async function summarize_webpage(url) {
    const prompt = `Summarize the text from the following Link in 5 lines: ${url}`;
    const [summary, input_tokens, output_tokens] = await gpt_get(prompt);
    return [summary, input_tokens, output_tokens];
}

// Function to perform sentiment analysis
// async function sentiment_analysis(summary) {
//     const prompt = `Analyze the sentiment of the following text and return 'positive', 'neutral', or 'negative': ${summary}`;
//     const [sentiment, input_tokens, output_tokens] = await gpt_get(prompt);
//     return [sentiment, input_tokens, output_tokens];
// }

// Function to detect language
function detect_language(text) {
    try {
        return language_mapping.get(detect(text), 'Unknown');
    } catch (e) {
        logging.error("Error in language detection: %s", e);
        return 'Unknown';
    }
}

// Function to analyze text from URL
async function analyze_text(url) {
    const [themes, extracted_info, themes_input_tokens, themes_output_tokens] = await classify_and_extract_text(url);
    const [summary, summary_input_tokens, summary_output_tokens] = await summarize_webpage(url);
    // const [sentiment, sentiment_input_tokens, sentiment_output_tokens] = await sentiment_analysis(summary);

    return {
        'summary': summary.trim(),
        'summary_input_tokens': summary_input_tokens,
        'summary_output_tokens': summary_output_tokens,
        // 'sentiment': sentiment,
        // 'sentiment_input_tokens': sentiment_input_tokens,
        // 'sentiment_output_tokens': sentiment_output_tokens,
        'themes': themes,
        'themes_input_tokens': themes_input_tokens,
        'themes_output_tokens': themes_output_tokens,
        'extracted_info': extracted_info
    };
}

// Function to process each URL
async function process_url(session, item) {
    try {
        const url = item.Link;
        if (!url) {
            return {'_id': item._id, 'Link': null, 'error': "URL is missing"};
        }

        const analysis_results = await analyze_text(url);
        const lang = detect_language(analysis_results.summary);

        const result = {
            '_id': item._id,
            'Language': lang,
            'Description': analysis_results.summary,
            'summary_input_tokens': analysis_results.summary_input_tokens,
            'summary_output_tokens': analysis_results.summary_output_tokens,
            // 'sentimentAnalysis': analysis_results.sentiment,
            // 'sentiment_input_tokens': analysis_results.sentiment_input_tokens,
            // 'sentiment_output_tokens': analysis_results.sentiment_output_tokens,
            'Themes': analysis_results.themes,
            'theme_input_tokens': analysis_results.themes_input_tokens,
            'theme_output_tokens': analysis_results.themes_output_tokens,
            'MainObject': analysis_results.extracted_info["Main objectives"].trim(),
            'MainOutcome': analysis_results.extracted_info["Main outcomes"].trim(),
            'ProblemStatment': analysis_results.extracted_info["Problem statement"].trim(),
            'KPIs': analysis_results.extracted_info["KPIs"].trim(),
            'extracted_info_input_tokens': analysis_results.themes_input_tokens + analysis_results.themes_output_tokens,
            'extracted_info_output_tokens': analysis_results.summary_output_tokens //+ analysis_results.sentiment_output_tokens
        };

        return result;
    } catch (e) {
        logging.error("Error processing URL %s: %s", item.Link, e);
        return {'_id': item._id, 'Link': item.Link, 'error': e};
    }