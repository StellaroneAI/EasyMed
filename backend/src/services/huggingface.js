const { HfInference } = require('@huggingface/inference');
const config = require('../config');

class HuggingFaceService {
  constructor() {
    this.apiKey = config.huggingface.apiKey;
    this.hf = new HfInference(this.apiKey);
    this.models = config.huggingface.models;
  }

  /**
   * Extract medical entities from text using NER models
   * @param {string} text - Text to analyze
   * @returns {Promise<Object>} NER results
   */
  async extractMedicalEntities(text) {
    try {
      // Use token classification for medical NER
      let entities = [];
      
      // Mock implementation with common medical entities
      const medicalPatterns = {
        symptoms: ['headache', 'fever', 'cough', 'pain', 'nausea', 'fatigue', 'dizziness', 'rash'],
        conditions: ['diabetes', 'hypertension', 'asthma', 'pneumonia', 'bronchitis', 'arthritis'],
        medications: ['paracetamol', 'ibuprofen', 'aspirin', 'amoxicillin', 'metformin', 'insulin'],
        body_parts: ['head', 'chest', 'stomach', 'leg', 'arm', 'back', 'neck', 'throat']
      };

      const textLower = text.toLowerCase();
      
      Object.entries(medicalPatterns).forEach(([category, keywords]) => {
        keywords.forEach(keyword => {
          const index = textLower.indexOf(keyword);
          if (index !== -1) {
            entities.push({
              entity_group: category.toUpperCase(),
              word: keyword,
              start: index,
              end: index + keyword.length,
              score: 0.85 + Math.random() * 0.1 // Mock confidence score
            });
          }
        });
      });

      return {
        success: true,
        data: {
          entities,
          text,
          model: this.models.medicalNER,
          service: 'HuggingFace-MedicalNER'
        }
      };
    } catch (error) {
      console.error('HuggingFace NER error:', error);
      return {
        success: false,
        error: 'Medical entity extraction failed',
        details: error.message
      };
    }
  }

  /**
   * Classify symptoms and provide medical insights
   * @param {string} symptoms - Symptom description
   * @returns {Promise<Object>} Classification results
   */
  async classifySymptoms(symptoms) {
    try {
      // Mock symptom classification
      const symptomDatabase = {
        'headache fever': {
          possibleConditions: ['Flu', 'Viral infection', 'Sinusitis'],
          urgency: 'moderate',
          recommendations: ['Rest', 'Hydration', 'Monitor temperature', 'Consult doctor if symptoms worsen']
        },
        'chest pain': {
          possibleConditions: ['Muscle strain', 'Anxiety', 'Heart condition'],
          urgency: 'high',
          recommendations: ['Seek immediate medical attention', 'Do not ignore chest pain']
        },
        'stomach pain': {
          possibleConditions: ['Indigestion', 'Gastritis', 'Food poisoning'],
          urgency: 'low',
          recommendations: ['Avoid spicy food', 'Stay hydrated', 'Rest']
        },
        'cough fever': {
          possibleConditions: ['Cold', 'Flu', 'Respiratory infection'],
          urgency: 'moderate',
          recommendations: ['Rest', 'Warm fluids', 'Monitor symptoms']
        }
      };

      const symptomsLower = symptoms.toLowerCase();
      let matchedCondition = null;
      
      // Find best match
      for (const [key, value] of Object.entries(symptomDatabase)) {
        if (key.split(' ').some(keyword => symptomsLower.includes(keyword))) {
          matchedCondition = value;
          break;
        }
      }

      if (!matchedCondition) {
        matchedCondition = {
          possibleConditions: ['General consultation recommended'],
          urgency: 'low',
          recommendations: ['Consult healthcare provider for proper diagnosis']
        };
      }

      return {
        success: true,
        data: {
          symptoms,
          analysis: matchedCondition,
          confidence: 0.78,
          model: this.models.symptomClassification,
          service: 'HuggingFace-SymptomClassification',
          disclaimer: 'This is not a substitute for professional medical advice'
        }
      };
    } catch (error) {
      console.error('HuggingFace symptom classification error:', error);
      return {
        success: false,
        error: 'Symptom classification failed',
        details: error.message
      };
    }
  }

  /**
   * Generate medical chat responses
   * @param {string} message - User message
   * @param {Array} context - Previous conversation context
   * @returns {Promise<Object>} Chat response
   */
  async generateMedicalChatResponse(message, context = []) {
    try {
      // Mock medical chatbot responses
      const responses = {
        greeting: [
          "Hello! I'm here to help with your health questions. How can I assist you today?",
          "Hi there! What health concerns would you like to discuss?"
        ],
        symptoms: [
          "I understand you're experiencing some symptoms. Can you describe them in more detail?",
          "Thank you for sharing your symptoms. Based on what you've described, I'd recommend consulting with a healthcare professional for proper evaluation."
        ],
        medication: [
          "For medication-related questions, it's important to consult with your doctor or pharmacist who can provide personalized advice based on your medical history.",
          "Please consult your healthcare provider before starting, stopping, or changing any medication."
        ],
        emergency: [
          "If this is a medical emergency, please call emergency services immediately or go to the nearest emergency room.",
          "For urgent medical concerns, please seek immediate medical attention."
        ],
        default: [
          "I'm here to provide general health information. For specific medical advice, please consult with a qualified healthcare professional.",
          "Thank you for your question. While I can provide general information, it's best to discuss specific health concerns with your doctor."
        ]
      };

      const messageLower = message.toLowerCase();
      let responseType = 'default';
      
      if (messageLower.includes('hello') || messageLower.includes('hi')) {
        responseType = 'greeting';
      } else if (messageLower.includes('pain') || messageLower.includes('fever') || messageLower.includes('sick')) {
        responseType = 'symptoms';
      } else if (messageLower.includes('medicine') || messageLower.includes('drug') || messageLower.includes('medication')) {
        responseType = 'medication';
      } else if (messageLower.includes('emergency') || messageLower.includes('urgent') || messageLower.includes('severe')) {
        responseType = 'emergency';
      }

      const responseOptions = responses[responseType];
      const selectedResponse = responseOptions[Math.floor(Math.random() * responseOptions.length)];

      return {
        success: true,
        data: {
          response: selectedResponse,
          context: [...context, { user: message, bot: selectedResponse }],
          type: responseType,
          model: this.models.medicalChat,
          service: 'HuggingFace-MedicalChat',
          disclaimer: 'This chatbot provides general information only and is not a substitute for professional medical advice, diagnosis, or treatment.'
        }
      };
    } catch (error) {
      console.error('HuggingFace chat error:', error);
      return {
        success: false,
        error: 'Chat response generation failed',
        details: error.message
      };
    }
  }

  /**
   * Translate medical content to multiple languages
   * @param {string} text - Text to translate
   * @param {string} targetLanguage - Target language code
   * @param {string} sourceLanguage - Source language code
   * @returns {Promise<Object>} Translation result
   */
  async translateMedicalContent(text, targetLanguage, sourceLanguage = 'en') {
    try {
      // Mock multilingual medical translation
      const medicalTranslations = {
        'en-es': {
          'doctor': 'médico',
          'hospital': 'hospital',
          'medicine': 'medicina',
          'pain': 'dolor',
          'fever': 'fiebre',
          'headache': 'dolor de cabeza'
        },
        'en-fr': {
          'doctor': 'médecin',
          'hospital': 'hôpital',
          'medicine': 'médicament',
          'pain': 'douleur',
          'fever': 'fièvre',
          'headache': 'mal de tête'
        },
        'en-de': {
          'doctor': 'Arzt',
          'hospital': 'Krankenhaus',
          'medicine': 'Medizin',
          'pain': 'Schmerz',
          'fever': 'Fieber',
          'headache': 'Kopfschmerzen'
        }
      };

      const translationKey = `${sourceLanguage}-${targetLanguage}`;
      const translations = medicalTranslations[translationKey] || {};
      
      let translatedText = text;
      Object.entries(translations).forEach(([original, translated]) => {
        const regex = new RegExp(`\\b${original}\\b`, 'gi');
        translatedText = translatedText.replace(regex, translated);
      });

      return {
        success: true,
        data: {
          translatedText,
          originalText: text,
          sourceLanguage,
          targetLanguage,
          model: this.models.multilingualMedical,
          service: 'HuggingFace-MultilingualMedical'
        }
      };
    } catch (error) {
      console.error('HuggingFace translation error:', error);
      return {
        success: false,
        error: 'Medical content translation failed',
        details: error.message
      };
    }
  }

  /**
   * Analyze medical text for quality and accuracy
   * @param {string} text - Medical text to analyze
   * @returns {Promise<Object>} Analysis results
   */
  async analyzeMedicalText(text) {
    try {
      const words = text.toLowerCase().split(/\s+/);
      const medicalTerms = words.filter(word => 
        ['doctor', 'hospital', 'medicine', 'treatment', 'diagnosis', 'symptoms', 'patient'].includes(word)
      );

      const analysis = {
        wordCount: words.length,
        medicalTermCount: medicalTerms.length,
        medicalDensity: medicalTerms.length / words.length,
        readabilityScore: Math.max(0, 100 - words.length * 0.5), // Simple readability estimate
        suggestedImprovements: []
      };

      if (analysis.medicalDensity < 0.1) {
        analysis.suggestedImprovements.push('Consider using more specific medical terminology');
      }
      if (analysis.wordCount > 200) {
        analysis.suggestedImprovements.push('Consider breaking into shorter paragraphs for better readability');
      }

      return {
        success: true,
        data: {
          text,
          analysis,
          service: 'HuggingFace-MedicalTextAnalysis'
        }
      };
    } catch (error) {
      console.error('HuggingFace text analysis error:', error);
      return {
        success: false,
        error: 'Medical text analysis failed',
        details: error.message
      };
    }
  }
}

module.exports = HuggingFaceService;