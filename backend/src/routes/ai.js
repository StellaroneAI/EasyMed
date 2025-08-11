const express = require('express');
const rateLimit = require('express-rate-limit');
const AIController = require('../controllers/ai');
const config = require('../config');

const router = express.Router();
const aiController = new AIController();

// AI-specific rate limiting
const aiRateLimit = rateLimit({
  windowMs: config.rateLimiting.ai.windowMs,
  max: config.rateLimiting.ai.max,
  message: {
    error: 'Too many AI requests',
    message: 'Please wait before making more AI requests'
  },
  standardHeaders: true,
  legacyHeaders: false
});

// Apply rate limiting to all AI routes
router.use(aiRateLimit);

// Health and info endpoints (no file upload needed)
router.get('/health', (req, res) => aiController.getHealth(req, res));
router.get('/languages', (req, res) => aiController.getSupportedLanguages(req, res));

// Translation endpoint
router.post('/translate', (req, res) => aiController.translate(req, res));

// Speech-to-text endpoint (requires file upload)
router.post('/speech-to-text', 
  aiController.upload.single('audio'),
  (req, res) => aiController.speechToText(req, res)
);

// Text-to-speech endpoint
router.post('/text-to-speech', (req, res) => aiController.textToSpeech(req, res));

// Symptom analysis endpoint
router.post('/analyze-symptoms', (req, res) => aiController.analyzeSymptoms(req, res));

// Medical chat endpoint
router.post('/medical-chat', (req, res) => aiController.medicalChat(req, res));

// Medical entity extraction endpoint
router.post('/extract-medical-entities', (req, res) => aiController.extractMedicalEntities(req, res));

// Batch processing endpoint
router.post('/batch', (req, res) => aiController.batchProcess(req, res));

// Error handling for multer errors
router.use((error, req, res, next) => {
  if (error.code === 'LIMIT_FILE_SIZE') {
    return res.status(400).json({
      error: 'File too large',
      message: 'Audio file must be less than 10MB'
    });
  }
  
  if (error.code === 'LIMIT_UNEXPECTED_FILE') {
    return res.status(400).json({
      error: 'Invalid file',
      message: 'Only audio files are allowed'
    });
  }
  
  if (error.message === 'Only audio files are allowed') {
    return res.status(400).json({
      error: 'Invalid file type',
      message: 'Only audio files are allowed for speech-to-text'
    });
  }
  
  next(error);
});

module.exports = router;