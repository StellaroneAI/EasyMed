const dotenv = require('dotenv');
dotenv.config();

const config = {
  // Server Configuration
  server: {
    port: process.env.PORT || 3000,
    nodeEnv: process.env.NODE_ENV || 'development'
  },

  // AI4Bharat Configuration
  ai4bharat: {
    baseUrl: process.env.AI4BHARAT_BASE_URL || 'https://dhruva-api.bhashini.gov.in',
    apiKey: process.env.AI4BHARAT_API_KEY || '',
    userId: process.env.AI4BHARAT_USER_ID || '',
    
    // Service endpoints
    endpoints: {
      translation: '/services/inference/pipeline',
      asr: '/services/inference/pipeline',
      tts: '/services/inference/pipeline',
      nlu: '/services/inference/pipeline'
    },

    // Supported languages
    languages: {
      'en': 'English',
      'hi': 'Hindi',
      'ta': 'Tamil',
      'te': 'Telugu',
      'bn': 'Bengali',
      'gu': 'Gujarati',
      'kn': 'Kannada',
      'ml': 'Malayalam',
      'mr': 'Marathi',
      'or': 'Odia',
      'pa': 'Punjabi',
      'ur': 'Urdu'
    }
  },

  // Hugging Face Configuration
  huggingface: {
    apiKey: process.env.HUGGINGFACE_API_KEY || '',
    baseUrl: process.env.HUGGINGFACE_BASE_URL || 'https://api-inference.huggingface.co',
    
    // Model configurations
    models: {
      medicalNER: process.env.HF_MEDICAL_NER_MODEL || 'alvaroalon2/biobert_diseases_ner',
      symptomClassification: process.env.HF_SYMPTOM_MODEL || 'microsoft/DialoGPT-medium',
      medicalChat: process.env.HF_MEDICAL_CHAT_MODEL || 'microsoft/BioGPT-Large',
      multilingualMedical: process.env.HF_MULTILINGUAL_MODEL || 'Helsinki-NLP/opus-mt-en-mul'
    }
  },

  // Cache Configuration
  cache: {
    ttl: parseInt(process.env.CACHE_TTL) || 3600, // 1 hour default
    checkperiod: parseInt(process.env.CACHE_CHECK_PERIOD) || 600 // 10 minutes
  },

  // Rate Limiting
  rateLimiting: {
    windowMs: parseInt(process.env.RATE_LIMIT_WINDOW) || 15 * 60 * 1000, // 15 minutes
    max: parseInt(process.env.RATE_LIMIT_MAX) || 100,
    ai: {
      windowMs: parseInt(process.env.AI_RATE_LIMIT_WINDOW) || 5 * 60 * 1000, // 5 minutes
      max: parseInt(process.env.AI_RATE_LIMIT_MAX) || 20
    }
  },

  // Logging
  logging: {
    level: process.env.LOG_LEVEL || 'info',
    enableRequestLogging: process.env.ENABLE_REQUEST_LOGGING !== 'false'
  }
};

module.exports = config;