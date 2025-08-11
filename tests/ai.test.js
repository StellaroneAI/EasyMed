const request = require('supertest');
const app = require('../backend/src/server');

describe('EasyMed AI API', () => {
  describe('Health Endpoints', () => {
    test('GET /health should return 200', async () => {
      const response = await request(app)
        .get('/health')
        .expect(200);
      
      expect(response.body.status).toBe('OK');
      expect(response.body.message).toContain('EasyMed');
    });

    test('GET /api/ai/health should return service status', async () => {
      const response = await request(app)
        .get('/api/ai/health')
        .expect(200);
      
      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveProperty('services');
      expect(response.body.data).toHaveProperty('features');
    });

    test('GET /api/ai/languages should return supported languages', async () => {
      const response = await request(app)
        .get('/api/ai/languages')
        .expect(200);
      
      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveProperty('ai4bharat');
      expect(response.body.data).toHaveProperty('translation');
    });
  });

  describe('Translation API', () => {
    test('POST /api/ai/translate should translate text', async () => {
      const response = await request(app)
        .post('/api/ai/translate')
        .send({
          text: 'Hello, how are you?',
          sourceLanguage: 'en',
          targetLanguage: 'hi'
        })
        .expect(200);
      
      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveProperty('translatedText');
      expect(response.body.data.sourceLanguage).toBe('en');
      expect(response.body.data.targetLanguage).toBe('hi');
    });

    test('POST /api/ai/translate should return 400 for missing fields', async () => {
      const response = await request(app)
        .post('/api/ai/translate')
        .send({
          text: 'Hello'
          // missing sourceLanguage and targetLanguage
        })
        .expect(400);
      
      expect(response.body.error).toContain('Missing required fields');
    });
  });

  describe('Medical Entity Extraction API', () => {
    test('POST /api/ai/extract-medical-entities should extract entities', async () => {
      const response = await request(app)
        .post('/api/ai/extract-medical-entities')
        .send({
          text: 'I have a headache and fever',
          language: 'en'
        })
        .expect(200);
      
      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveProperty('entities');
      expect(Array.isArray(response.body.data.entities)).toBe(true);
    });

    test('POST /api/ai/extract-medical-entities should return 400 for missing text', async () => {
      const response = await request(app)
        .post('/api/ai/extract-medical-entities')
        .send({
          language: 'en'
          // missing text
        })
        .expect(400);
      
      expect(response.body.error).toContain('Missing required field');
    });
  });

  describe('Symptom Analysis API', () => {
    test('POST /api/ai/analyze-symptoms should analyze symptoms', async () => {
      const response = await request(app)
        .post('/api/ai/analyze-symptoms')
        .send({
          symptoms: 'I have a headache and feel tired',
          language: 'en'
        })
        .expect(200);
      
      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveProperty('analyses');
      expect(response.body.data).toHaveProperty('summary');
      expect(response.body.disclaimer).toContain('informational purposes only');
    });
  });

  describe('Medical Chat API', () => {
    test('POST /api/ai/medical-chat should generate chat response', async () => {
      const response = await request(app)
        .post('/api/ai/medical-chat')
        .send({
          message: 'Hello, I need medical help',
          language: 'en'
        })
        .expect(200);
      
      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveProperty('response');
      expect(response.body.data).toHaveProperty('context');
      expect(response.body.disclaimer).toContain('not a substitute');
    });
  });

  describe('Text-to-Speech API', () => {
    test('POST /api/ai/text-to-speech should generate speech URL', async () => {
      const response = await request(app)
        .post('/api/ai/text-to-speech')
        .send({
          text: 'Take your medicine',
          language: 'en',
          voice: 'female'
        })
        .expect(200);
      
      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveProperty('audioUrl');
      expect(response.body.data).toHaveProperty('duration');
    });
  });

  describe('Batch Processing API', () => {
    test('POST /api/ai/batch should process multiple operations', async () => {
      const response = await request(app)
        .post('/api/ai/batch')
        .send({
          operations: [
            {
              id: 1,
              type: 'translate',
              text: 'Hello',
              sourceLanguage: 'en',
              targetLanguage: 'hi'
            },
            {
              id: 2,
              type: 'extract-entities',
              text: 'I have a headache',
              language: 'en'
            }
          ]
        })
        .expect(200);
      
      expect(response.body.success).toBe(true);
      expect(response.body.data.processed).toBe(2);
      expect(response.body.data.results).toHaveLength(2);
    });
  });

  describe('Error Handling', () => {
    test('GET /nonexistent should return 404', async () => {
      const response = await request(app)
        .get('/nonexistent')
        .expect(404);
      
      expect(response.body.error).toBe('Route not found');
    });
  });
});

// Close the server after all tests
afterAll((done) => {
  done();
});