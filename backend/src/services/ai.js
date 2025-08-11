const AI4BharatService = require('./ai4bharat');
const HuggingFaceService = require('./huggingface');
const cacheService = require('./cache');

class AIService {
  constructor() {
    this.ai4bharat = new AI4BharatService();
    this.huggingface = new HuggingFaceService();
  }

  /**
   * Translate text with fallback between services
   * @param {string} text - Text to translate
   * @param {string} sourceLanguage - Source language code
   * @param {string} targetLanguage - Target language code
   * @returns {Promise<Object>} Translation result
   */
  async translateText(text, sourceLanguage, targetLanguage) {
    const cacheKey = cacheService.getTranslationKey(text, sourceLanguage, targetLanguage, 'combined');
    
    return await cacheService.getOrSet(cacheKey, async () => {
      // Try AI4Bharat first for Indian languages
      const indianLanguages = ['hi', 'ta', 'te', 'bn', 'gu', 'kn', 'ml', 'mr', 'or', 'pa', 'ur'];
      
      if (indianLanguages.includes(targetLanguage) || indianLanguages.includes(sourceLanguage)) {
        const ai4Result = await this.ai4bharat.translateText(text, sourceLanguage, targetLanguage);
        if (ai4Result.success) {
          return {
            ...ai4Result,
            primaryService: 'AI4Bharat',
            fallbackUsed: false
          };
        }
      }

      // Fallback to Hugging Face for other languages
      const hfResult = await this.huggingface.translateMedicalContent(text, targetLanguage, sourceLanguage);
      if (hfResult.success) {
        return {
          ...hfResult,
          primaryService: 'HuggingFace',
          fallbackUsed: true
        };
      }

      // If both fail, return error
      return {
        success: false,
        error: 'Translation failed on all services',
        primaryService: 'none',
        fallbackUsed: true
      };
    }, 3600); // Cache for 1 hour
  }

  /**
   * Convert speech to text
   * @param {Buffer} audioBuffer - Audio data
   * @param {string} language - Language code
   * @returns {Promise<Object>} Speech recognition result
   */
  async speechToText(audioBuffer, language = 'en') {
    // Use AI4Bharat for Indian languages, fallback for others
    const indianLanguages = ['hi', 'ta', 'te', 'bn', 'gu', 'kn', 'ml', 'mr', 'or', 'pa', 'ur'];
    
    if (indianLanguages.includes(language)) {
      return await this.ai4bharat.speechToText(audioBuffer, language);
    }

    // For non-Indian languages, return a mock implementation
    // In production, you might integrate with other ASR services
    return {
      success: true,
      data: {
        text: 'I have a headache and feel tired',
        language,
        confidence: 0.85,
        duration: 3.2,
        service: 'Generic-ASR'
      }
    };
  }

  /**
   * Convert text to speech
   * @param {string} text - Text to convert
   * @param {string} language - Language code
   * @param {string} voice - Voice type
   * @returns {Promise<Object>} TTS result
   */
  async textToSpeech(text, language = 'en', voice = 'female') {
    const cacheKey = cacheService.getTTSKey(text, language, voice, 'combined');
    
    return await cacheService.getOrSet(cacheKey, async () => {
      // Use AI4Bharat for Indian languages
      const indianLanguages = ['hi', 'ta', 'te', 'bn', 'gu', 'kn', 'ml', 'mr', 'or', 'pa', 'ur'];
      
      if (indianLanguages.includes(language)) {
        return await this.ai4bharat.textToSpeech(text, language, voice);
      }

      // For other languages, return mock implementation
      return {
        success: true,
        data: {
          audioUrl: `https://mock-tts-service.com/audio/${encodeURIComponent(text)}?lang=${language}&voice=${voice}`,
          text,
          language,
          voice,
          duration: Math.ceil(text.length / 10),
          format: 'wav',
          service: 'Generic-TTS'
        }
      };
    }, 1800); // Cache for 30 minutes
  }

  /**
   * Analyze symptoms using multiple AI services
   * @param {string} symptoms - Symptom description
   * @param {string} language - Language of symptoms
   * @returns {Promise<Object>} Comprehensive analysis
   */
  async analyzeSymptoms(symptoms, language = 'en') {
    const cacheKey = cacheService.getSymptomClassificationKey(symptoms, 'combined');
    
    return await cacheService.getOrSet(cacheKey, async () => {
      const results = {
        success: true,
        data: {
          symptoms,
          language,
          analyses: []
        }
      };

      // Get NLU analysis from AI4Bharat if Indian language
      const indianLanguages = ['hi', 'ta', 'te', 'bn', 'gu', 'kn', 'ml', 'mr', 'or', 'pa', 'ur'];
      if (indianLanguages.includes(language)) {
        const ai4Result = await this.ai4bharat.analyzeText(symptoms, language);
        if (ai4Result.success) {
          results.data.analyses.push({
            service: 'AI4Bharat-IndicBERT',
            type: 'nlu',
            result: ai4Result.data
          });
        }
      }

      // Get medical entity extraction from Hugging Face
      const hfNERResult = await this.huggingface.extractMedicalEntities(symptoms);
      if (hfNERResult.success) {
        results.data.analyses.push({
          service: 'HuggingFace-MedicalNER',
          type: 'entity_extraction',
          result: hfNERResult.data
        });
      }

      // Get symptom classification from Hugging Face
      const hfClassResult = await this.huggingface.classifySymptoms(symptoms);
      if (hfClassResult.success) {
        results.data.analyses.push({
          service: 'HuggingFace-SymptomClassification',
          type: 'classification',
          result: hfClassResult.data
        });
      }

      // Combine results for comprehensive analysis
      results.data.summary = this.combineAnalyses(results.data.analyses);

      return results;
    }, 1800); // Cache for 30 minutes
  }

  /**
   * Medical chatbot conversation
   * @param {string} message - User message
   * @param {Array} context - Conversation context
   * @param {string} language - Message language
   * @returns {Promise<Object>} Chat response
   */
  async medicalChat(message, context = [], language = 'en') {
    // First, analyze the message for medical entities
    const analysisResult = await this.analyzeSymptoms(message, language);
    
    // Generate response using Hugging Face
    const chatResult = await this.huggingface.generateMedicalChatResponse(message, context);
    
    if (chatResult.success) {
      // Enhance response with analysis data
      chatResult.data.analysis = analysisResult.success ? analysisResult.data : null;
      
      // If message is not in English, translate the response
      if (language !== 'en') {
        const translationResult = await this.translateText(chatResult.data.response, 'en', language);
        if (translationResult.success) {
          chatResult.data.translatedResponse = translationResult.data.translatedText;
        }
      }
    }

    return chatResult;
  }

  /**
   * Extract medical entities from text
   * @param {string} text - Text to analyze
   * @param {string} language - Text language
   * @returns {Promise<Object>} Entity extraction results
   */
  async extractMedicalEntities(text, language = 'en') {
    const cacheKey = cacheService.getMedicalNERKey(text, 'combined');
    
    return await cacheService.getOrSet(cacheKey, async () => {
      const results = {
        success: true,
        data: {
          text,
          language,
          entities: []
        }
      };

      // Use Hugging Face for medical NER
      const hfResult = await this.huggingface.extractMedicalEntities(text);
      if (hfResult.success) {
        results.data.entities = hfResult.data.entities;
        results.data.primaryService = 'HuggingFace';
      }

      // If Indian language, also use AI4Bharat for additional context
      const indianLanguages = ['hi', 'ta', 'te', 'bn', 'gu', 'kn', 'ml', 'mr', 'or', 'pa', 'ur'];
      if (indianLanguages.includes(language)) {
        const ai4Result = await this.ai4bharat.analyzeText(text, language);
        if (ai4Result.success && ai4Result.data.entities) {
          // Merge entities from both services
          results.data.entities = [...results.data.entities, ...ai4Result.data.entities];
          results.data.additionalService = 'AI4Bharat';
        }
      }

      return results;
    }, 3600); // Cache for 1 hour
  }

  /**
   * Get service health status
   * @returns {Promise<Object>} Health status of all services
   */
  async getHealthStatus() {
    const status = {
      timestamp: new Date().toISOString(),
      services: {
        ai4bharat: {
          status: 'operational',
          supportedLanguages: this.ai4bharat.getSupportedLanguages()
        },
        huggingface: {
          status: 'operational',
          models: Object.keys(this.huggingface.models)
        },
        cache: {
          status: 'operational',
          stats: cacheService.getStats()
        }
      },
      features: {
        translation: true,
        speechToText: true,
        textToSpeech: true,
        symptomAnalysis: true,
        medicalChat: true,
        entityExtraction: true
      }
    };

    return status;
  }

  /**
   * Combine analysis results from multiple services
   * @param {Array} analyses - Array of analysis results
   * @returns {Object} Combined analysis summary
   */
  combineAnalyses(analyses) {
    const summary = {
      confidence: 0,
      entities: [],
      symptoms: [],
      conditions: [],
      urgency: 'low',
      recommendations: []
    };

    analyses.forEach(analysis => {
      if (analysis.type === 'entity_extraction' && analysis.result.entities) {
        summary.entities = [...summary.entities, ...analysis.result.entities];
      }
      
      if (analysis.type === 'classification' && analysis.result.analysis) {
        const classResult = analysis.result.analysis;
        if (classResult.possibleConditions) {
          summary.conditions = [...summary.conditions, ...classResult.possibleConditions];
        }
        if (classResult.urgency && this.getUrgencyLevel(classResult.urgency) > this.getUrgencyLevel(summary.urgency)) {
          summary.urgency = classResult.urgency;
        }
        if (classResult.recommendations) {
          summary.recommendations = [...summary.recommendations, ...classResult.recommendations];
        }
      }

      if (analysis.type === 'nlu' && analysis.result.symptoms) {
        summary.symptoms = [...summary.symptoms, ...analysis.result.symptoms];
      }
    });

    // Calculate overall confidence
    const confidenceScores = analyses
      .map(a => a.result.confidence)
      .filter(c => typeof c === 'number');
    
    if (confidenceScores.length > 0) {
      summary.confidence = confidenceScores.reduce((a, b) => a + b, 0) / confidenceScores.length;
    }

    // Remove duplicates
    summary.entities = this.removeDuplicateEntities(summary.entities);
    summary.symptoms = [...new Set(summary.symptoms)];
    summary.conditions = [...new Set(summary.conditions)];
    summary.recommendations = [...new Set(summary.recommendations)];

    return summary;
  }

  /**
   * Get urgency level as number for comparison
   * @param {string} urgency - Urgency level
   * @returns {number} Numeric urgency level
   */
  getUrgencyLevel(urgency) {
    const levels = { low: 1, moderate: 2, high: 3, critical: 4 };
    return levels[urgency] || 1;
  }

  /**
   * Remove duplicate entities based on text and type
   * @param {Array} entities - Array of entities
   * @returns {Array} Deduplicated entities
   */
  removeDuplicateEntities(entities) {
    const seen = new Set();
    return entities.filter(entity => {
      const key = `${entity.word || entity.text}_${entity.entity_group || entity.label}`;
      if (seen.has(key)) {
        return false;
      }
      seen.add(key);
      return true;
    });
  }
}

module.exports = AIService;