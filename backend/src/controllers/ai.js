const AIService = require('../services/ai');
const multer = require('multer');
const fs = require('fs').promises;

class AIController {
  constructor() {
    this.aiService = new AIService();
    
    // Configure multer for file uploads (audio files for ASR)
    this.upload = multer({
      dest: '/tmp/uploads/',
      limits: {
        fileSize: 10 * 1024 * 1024 // 10MB limit
      },
      fileFilter: (req, file, cb) => {
        // Accept audio files
        if (file.mimetype.startsWith('audio/')) {
          cb(null, true);
        } else {
          cb(new Error('Only audio files are allowed'), false);
        }
      }
    });
  }

  /**
   * Translate text between languages
   * POST /api/ai/translate
   */
  async translate(req, res) {
    try {
      const { text, sourceLanguage, targetLanguage } = req.body;

      if (!text || !sourceLanguage || !targetLanguage) {
        return res.status(400).json({
          error: 'Missing required fields',
          message: 'text, sourceLanguage, and targetLanguage are required'
        });
      }

      if (text.length > 5000) {
        return res.status(400).json({
          error: 'Text too long',
          message: 'Text must be less than 5000 characters'
        });
      }

      const result = await this.aiService.translateText(text, sourceLanguage, targetLanguage);

      if (result.success) {
        res.json({
          success: true,
          data: result.data,
          cached: result.cached || false
        });
      } else {
        res.status(500).json({
          success: false,
          error: result.error,
          details: result.details
        });
      }
    } catch (error) {
      console.error('Translation error:', error);
      res.status(500).json({
        error: 'Translation service error',
        message: 'An error occurred while processing your translation request'
      });
    }
  }

  /**
   * Convert speech to text
   * POST /api/ai/speech-to-text
   */
  async speechToText(req, res) {
    try {
      const { language = 'en' } = req.body;

      if (!req.file) {
        return res.status(400).json({
          error: 'No audio file provided',
          message: 'Please upload an audio file'
        });
      }

      // Read the uploaded file
      const audioBuffer = await fs.readFile(req.file.path);

      const result = await this.aiService.speechToText(audioBuffer, language);

      // Clean up the uploaded file
      try {
        await fs.unlink(req.file.path);
      } catch (cleanupError) {
        console.warn('Failed to cleanup uploaded file:', cleanupError);
      }

      if (result.success) {
        res.json({
          success: true,
          data: result.data
        });
      } else {
        res.status(500).json({
          success: false,
          error: result.error,
          details: result.details
        });
      }
    } catch (error) {
      console.error('Speech-to-text error:', error);
      
      // Clean up file on error
      if (req.file) {
        try {
          await fs.unlink(req.file.path);
        } catch (cleanupError) {
          console.warn('Failed to cleanup uploaded file on error:', cleanupError);
        }
      }

      res.status(500).json({
        error: 'Speech recognition service error',
        message: 'An error occurred while processing your audio'
      });
    }
  }

  /**
   * Convert text to speech
   * POST /api/ai/text-to-speech
   */
  async textToSpeech(req, res) {
    try {
      const { text, language = 'en', voice = 'female' } = req.body;

      if (!text) {
        return res.status(400).json({
          error: 'Missing required field',
          message: 'text is required'
        });
      }

      if (text.length > 1000) {
        return res.status(400).json({
          error: 'Text too long',
          message: 'Text must be less than 1000 characters for TTS'
        });
      }

      const result = await this.aiService.textToSpeech(text, language, voice);

      if (result.success) {
        res.json({
          success: true,
          data: result.data
        });
      } else {
        res.status(500).json({
          success: false,
          error: result.error,
          details: result.details
        });
      }
    } catch (error) {
      console.error('Text-to-speech error:', error);
      res.status(500).json({
        error: 'Text-to-speech service error',
        message: 'An error occurred while generating speech'
      });
    }
  }

  /**
   * Analyze symptoms using AI
   * POST /api/ai/analyze-symptoms
   */
  async analyzeSymptoms(req, res) {
    try {
      const { symptoms, language = 'en' } = req.body;

      if (!symptoms) {
        return res.status(400).json({
          error: 'Missing required field',
          message: 'symptoms description is required'
        });
      }

      if (typeof symptoms !== 'string' || symptoms.trim().length === 0) {
        return res.status(400).json({
          error: 'Invalid symptoms',
          message: 'symptoms must be a non-empty string'
        });
      }

      const result = await this.aiService.analyzeSymptoms(symptoms, language);

      if (result.success) {
        res.json({
          success: true,
          data: result.data,
          disclaimer: 'This analysis is for informational purposes only and should not replace professional medical advice, diagnosis, or treatment.'
        });
      } else {
        res.status(500).json({
          success: false,
          error: result.error,
          details: result.details
        });
      }
    } catch (error) {
      console.error('Symptom analysis error:', error);
      res.status(500).json({
        error: 'Symptom analysis service error',
        message: 'An error occurred while analyzing symptoms'
      });
    }
  }

  /**
   * Medical chatbot conversation
   * POST /api/ai/medical-chat
   */
  async medicalChat(req, res) {
    try {
      const { message, context = [], language = 'en' } = req.body;

      if (!message) {
        return res.status(400).json({
          error: 'Missing required field',
          message: 'message is required'
        });
      }

      if (typeof message !== 'string' || message.trim().length === 0) {
        return res.status(400).json({
          error: 'Invalid message',
          message: 'message must be a non-empty string'
        });
      }

      // Validate context format
      if (!Array.isArray(context)) {
        return res.status(400).json({
          error: 'Invalid context',
          message: 'context must be an array'
        });
      }

      const result = await this.aiService.medicalChat(message, context, language);

      if (result.success) {
        res.json({
          success: true,
          data: result.data,
          disclaimer: result.data.disclaimer
        });
      } else {
        res.status(500).json({
          success: false,
          error: result.error,
          details: result.details
        });
      }
    } catch (error) {
      console.error('Medical chat error:', error);
      res.status(500).json({
        error: 'Medical chat service error',
        message: 'An error occurred while generating chat response'
      });
    }
  }

  /**
   * Extract medical entities from text
   * POST /api/ai/extract-medical-entities
   */
  async extractMedicalEntities(req, res) {
    try {
      const { text, language = 'en' } = req.body;

      if (!text) {
        return res.status(400).json({
          error: 'Missing required field',
          message: 'text is required'
        });
      }

      if (typeof text !== 'string' || text.trim().length === 0) {
        return res.status(400).json({
          error: 'Invalid text',
          message: 'text must be a non-empty string'
        });
      }

      const result = await this.aiService.extractMedicalEntities(text, language);

      if (result.success) {
        res.json({
          success: true,
          data: result.data
        });
      } else {
        res.status(500).json({
          success: false,
          error: result.error,
          details: result.details
        });
      }
    } catch (error) {
      console.error('Medical entity extraction error:', error);
      res.status(500).json({
        error: 'Medical entity extraction service error',
        message: 'An error occurred while extracting medical entities'
      });
    }
  }

  /**
   * Get AI service health status
   * GET /api/ai/health
   */
  async getHealth(req, res) {
    try {
      const health = await this.aiService.getHealthStatus();
      res.json({
        success: true,
        data: health
      });
    } catch (error) {
      console.error('Health check error:', error);
      res.status(500).json({
        error: 'Health check failed',
        message: 'Unable to retrieve service health status'
      });
    }
  }

  /**
   * Get supported languages
   * GET /api/ai/languages
   */
  async getSupportedLanguages(req, res) {
    try {
      const languages = {
        ai4bharat: this.aiService.ai4bharat.getSupportedLanguages(),
        translation: {
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
          'ur': 'Urdu',
          'es': 'Spanish',
          'fr': 'French',
          'de': 'German'
        }
      };

      res.json({
        success: true,
        data: languages
      });
    } catch (error) {
      console.error('Language list error:', error);
      res.status(500).json({
        error: 'Failed to retrieve language list',
        message: 'Unable to get supported languages'
      });
    }
  }

  /**
   * Batch processing endpoint for multiple operations
   * POST /api/ai/batch
   */
  async batchProcess(req, res) {
    try {
      const { operations } = req.body;

      if (!Array.isArray(operations) || operations.length === 0) {
        return res.status(400).json({
          error: 'Invalid operations',
          message: 'operations must be a non-empty array'
        });
      }

      if (operations.length > 10) {
        return res.status(400).json({
          error: 'Too many operations',
          message: 'Maximum 10 operations allowed per batch'
        });
      }

      const results = [];

      for (const operation of operations) {
        try {
          let result;
          
          switch (operation.type) {
            case 'translate':
              result = await this.aiService.translateText(
                operation.text,
                operation.sourceLanguage,
                operation.targetLanguage
              );
              break;
            
            case 'analyze-symptoms':
              result = await this.aiService.analyzeSymptoms(
                operation.symptoms,
                operation.language
              );
              break;
            
            case 'extract-entities':
              result = await this.aiService.extractMedicalEntities(
                operation.text,
                operation.language
              );
              break;
            
            default:
              result = {
                success: false,
                error: `Unknown operation type: ${operation.type}`
              };
          }

          results.push({
            operationId: operation.id || results.length,
            type: operation.type,
            result
          });
        } catch (operationError) {
          results.push({
            operationId: operation.id || results.length,
            type: operation.type,
            result: {
              success: false,
              error: 'Operation failed',
              details: operationError.message
            }
          });
        }
      }

      res.json({
        success: true,
        data: {
          processed: results.length,
          results
        }
      });
    } catch (error) {
      console.error('Batch processing error:', error);
      res.status(500).json({
        error: 'Batch processing failed',
        message: 'An error occurred while processing batch operations'
      });
    }
  }
}

module.exports = AIController;