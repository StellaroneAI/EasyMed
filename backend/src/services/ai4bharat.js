const axios = require('axios');
const config = require('../config');

class AI4BharatService {
  constructor() {
    this.baseUrl = config.ai4bharat.baseUrl;
    this.apiKey = config.ai4bharat.apiKey;
    this.userId = config.ai4bharat.userId;
    
    this.client = axios.create({
      baseURL: this.baseUrl,
      timeout: 30000,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': this.apiKey ? `Bearer ${this.apiKey}` : undefined,
        'User-Id': this.userId
      }
    });
  }

  /**
   * Translate text between supported languages
   * @param {string} text - Text to translate
   * @param {string} sourceLanguage - Source language code (e.g., 'en', 'hi')
   * @param {string} targetLanguage - Target language code
   * @returns {Promise<Object>} Translation result
   */
  async translateText(text, sourceLanguage, targetLanguage) {
    try {
      // For now, using a mock implementation since AI4Bharat requires specific setup
      // In production, this would use the actual AI4Bharat API
      const mockTranslations = {
        'en-hi': {
          'Hello': 'नमस्ते',
          'How are you?': 'आप कैसे हैं?',
          'Thank you': 'धन्यवाद',
          'doctor': 'डॉक्टर',
          'medicine': 'दवा',
          'hospital': 'अस्पताल',
          'pain': 'दर्द',
          'fever': 'बुखार'
        },
        'en-ta': {
          'Hello': 'வணக்கம்',
          'How are you?': 'எப்படி இருக்கிறீர்கள்?',
          'Thank you': 'நன்றி',
          'doctor': 'மருத்துவர்',
          'medicine': 'மருந்து',
          'hospital': 'மருத்துவமனை',
          'pain': 'வலி',
          'fever': 'காய்ச்சல்'
        },
        'en-te': {
          'Hello': 'హలో',
          'How are you?': 'మీరు ఎలా ఉన్నారు?',
          'Thank you': 'ధన్యవాదాలు',
          'doctor': 'వైద్యుడు',
          'medicine': 'మందు',
          'hospital': 'ఆసుపత్రి',
          'pain': 'నొప్పి',
          'fever': 'జ్వరం'
        }
      };

      const translationKey = `${sourceLanguage}-${targetLanguage}`;
      const translations = mockTranslations[translationKey] || {};
      
      // Simple word-by-word translation for demo
      const translatedText = text.split(' ').map(word => {
        const cleanWord = word.toLowerCase().replace(/[.,!?]/g, '');
        return translations[cleanWord] || word;
      }).join(' ');

      return {
        success: true,
        data: {
          translatedText: translatedText || text,
          sourceLanguage,
          targetLanguage,
          originalText: text,
          confidence: 0.85,
          service: 'AI4Bharat-IndicTrans2'
        }
      };
    } catch (error) {
      console.error('AI4Bharat translation error:', error);
      return {
        success: false,
        error: 'Translation failed',
        details: error.message
      };
    }
  }

  /**
   * Convert speech to text using IndicASR
   * @param {Buffer} audioBuffer - Audio data
   * @param {string} language - Language code
   * @returns {Promise<Object>} Speech recognition result
   */
  async speechToText(audioBuffer, language = 'hi') {
    try {
      // Mock implementation for demo
      const mockResults = {
        'hi': 'मुझे सिरदर्द हो रहा है',
        'ta': 'எனக்கு தலைவலி இருக்கிறது',
        'te': 'నాకు తలనొప్పి ఉంది',
        'en': 'I have a headache'
      };

      return {
        success: true,
        data: {
          text: mockResults[language] || mockResults['en'],
          language,
          confidence: 0.92,
          duration: 2.5,
          service: 'AI4Bharat-IndicASR'
        }
      };
    } catch (error) {
      console.error('AI4Bharat ASR error:', error);
      return {
        success: false,
        error: 'Speech recognition failed',
        details: error.message
      };
    }
  }

  /**
   * Convert text to speech using IndicTTS
   * @param {string} text - Text to convert
   * @param {string} language - Language code
   * @param {string} voice - Voice type (male/female)
   * @returns {Promise<Object>} TTS result
   */
  async textToSpeech(text, language = 'hi', voice = 'female') {
    try {
      // Mock implementation - in production this would return audio data
      return {
        success: true,
        data: {
          audioUrl: `https://mock-tts-service.com/audio/${encodeURIComponent(text)}`,
          text,
          language,
          voice,
          duration: Math.ceil(text.length / 10), // Rough estimate
          format: 'wav',
          service: 'AI4Bharat-IndicTTS'
        }
      };
    } catch (error) {
      console.error('AI4Bharat TTS error:', error);
      return {
        success: false,
        error: 'Text-to-speech failed',
        details: error.message
      };
    }
  }

  /**
   * Analyze text using IndicBERT for NLU
   * @param {string} text - Text to analyze
   * @param {string} language - Language code
   * @returns {Promise<Object>} NLU analysis result
   */
  async analyzeText(text, language = 'hi') {
    try {
      // Mock implementation for medical intent analysis
      const medicalKeywords = ['दर्द', 'बुखार', 'सिरदर्द', 'पेट', 'खांसी', 'जुकाम', 'வலி', 'காய்ச்சல்', 'தலைவலி', 'నొప్పి', 'జ్వరం', 'pain', 'fever', 'headache', 'cough', 'cold'];
      
      const foundSymptoms = medicalKeywords.filter(keyword => 
        text.toLowerCase().includes(keyword)
      );

      return {
        success: true,
        data: {
          intent: foundSymptoms.length > 0 ? 'medical_query' : 'general',
          symptoms: foundSymptoms,
          confidence: foundSymptoms.length > 0 ? 0.88 : 0.45,
          language,
          entities: foundSymptoms.map(symptom => ({
            text: symptom,
            label: 'SYMPTOM',
            confidence: 0.85
          })),
          service: 'AI4Bharat-IndicBERT'
        }
      };
    } catch (error) {
      console.error('AI4Bharat NLU error:', error);
      return {
        success: false,
        error: 'Text analysis failed',
        details: error.message
      };
    }
  }

  /**
   * Get supported languages
   * @returns {Object} Supported languages
   */
  getSupportedLanguages() {
    return config.ai4bharat.languages;
  }

  /**
   * Check if language is supported
   * @param {string} languageCode - Language code to check
   * @returns {boolean} Whether language is supported
   */
  isLanguageSupported(languageCode) {
    return languageCode in config.ai4bharat.languages;
  }
}

module.exports = AI4BharatService;