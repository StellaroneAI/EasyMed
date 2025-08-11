# API Usage Examples

This document provides practical examples of using the EasyMed AI API endpoints.

## Prerequisites

Make sure the server is running:
```bash
npm start
```

Server will be available at: `http://localhost:3000`

## Example API Calls

### 1. Health Check

```bash
curl http://localhost:3000/health
```

Response:
```json
{
  "status": "OK",
  "message": "EasyMed AI Healthcare Platform is running",
  "timestamp": "2025-08-11T17:46:50.793Z"
}
```

### 2. AI Services Health

```bash
curl http://localhost:3000/api/ai/health
```

### 3. Translation - English to Hindi

```bash
curl -X POST http://localhost:3000/api/ai/translate \
  -H "Content-Type: application/json" \
  -d '{
    "text": "Take your medicine twice daily",
    "sourceLanguage": "en",
    "targetLanguage": "hi"
  }'
```

### 4. Medical Entity Extraction

```bash
curl -X POST http://localhost:3000/api/ai/extract-medical-entities \
  -H "Content-Type: application/json" \
  -d '{
    "text": "Patient has diabetes and is taking insulin for blood sugar control",
    "language": "en"
  }'
```

Response:
```json
{
  "success": true,
  "data": {
    "text": "Patient has diabetes and is taking insulin for blood sugar control",
    "language": "en",
    "entities": [
      {
        "entity_group": "CONDITIONS",
        "word": "diabetes",
        "start": 12,
        "end": 20,
        "score": 0.916
      },
      {
        "entity_group": "MEDICATIONS",
        "word": "insulin",
        "start": 35,
        "end": 42,
        "score": 0.897
      }
    ],
    "primaryService": "HuggingFace"
  }
}
```

### 5. Symptom Analysis

```bash
curl -X POST http://localhost:3000/api/ai/analyze-symptoms \
  -H "Content-Type: application/json" \
  -d '{
    "symptoms": "I have been having headaches and fever for 2 days",
    "language": "en"
  }'
```

### 6. Medical Chat

```bash
curl -X POST http://localhost:3000/api/ai/medical-chat \
  -H "Content-Type: application/json" \
  -d '{
    "message": "I have been feeling dizzy lately, what should I do?",
    "language": "en"
  }'
```

### 7. Text-to-Speech

```bash
curl -X POST http://localhost:3000/api/ai/text-to-speech \
  -H "Content-Type: application/json" \
  -d '{
    "text": "Please take your medicine on time",
    "language": "hi",
    "voice": "female"
  }'
```

### 8. Batch Processing

```bash
curl -X POST http://localhost:3000/api/ai/batch \
  -H "Content-Type: application/json" \
  -d '{
    "operations": [
      {
        "id": 1,
        "type": "translate",
        "text": "Good morning",
        "sourceLanguage": "en",
        "targetLanguage": "hi"
      },
      {
        "id": 2,
        "type": "extract-entities",
        "text": "Patient has high blood pressure",
        "language": "en"
      }
    ]
  }'
```

### 9. Speech-to-Text (with file upload)

```bash
curl -X POST http://localhost:3000/api/ai/speech-to-text \
  -F "audio=@sample_audio.wav" \
  -F "language=hi"
```

Note: You need an actual audio file for this endpoint.

## JavaScript/Node.js Examples

### Using fetch in JavaScript

```javascript
// Translation example
async function translateText(text, sourceLang, targetLang) {
  const response = await fetch('http://localhost:3000/api/ai/translate', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      text: text,
      sourceLanguage: sourceLang,
      targetLanguage: targetLang
    })
  });
  
  const result = await response.json();
  return result;
}

// Usage
translateText("Hello doctor", "en", "hi")
  .then(result => console.log(result))
  .catch(error => console.error(error));
```

### Medical Entity Extraction

```javascript
async function extractEntities(text) {
  const response = await fetch('http://localhost:3000/api/ai/extract-medical-entities', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      text: text,
      language: 'en'
    })
  });
  
  return await response.json();
}

// Usage
extractEntities("Patient shows symptoms of hypertension and diabetes")
  .then(result => {
    console.log('Extracted entities:', result.data.entities);
  });
```

## Python Examples

### Using requests library

```python
import requests

# Translation
def translate_text(text, source_lang, target_lang):
    url = "http://localhost:3000/api/ai/translate"
    data = {
        "text": text,
        "sourceLanguage": source_lang,
        "targetLanguage": target_lang
    }
    
    response = requests.post(url, json=data)
    return response.json()

# Medical entity extraction
def extract_medical_entities(text):
    url = "http://localhost:3000/api/ai/extract-medical-entities"
    data = {
        "text": text,
        "language": "en"
    }
    
    response = requests.post(url, json=data)
    return response.json()

# Usage
result = translate_text("Take medicine", "en", "hi")
print(result)

entities = extract_medical_entities("Patient has fever and cough")
print(entities)
```

## Error Handling Examples

### Handling validation errors

```bash
# Missing required field
curl -X POST http://localhost:3000/api/ai/translate \
  -H "Content-Type: application/json" \
  -d '{"text": "Hello"}'
```

Response:
```json
{
  "error": "Missing required fields",
  "message": "text, sourceLanguage, and targetLanguage are required"
}
```

### Handling rate limiting

When rate limit is exceeded:
```json
{
  "error": "Too many AI requests",
  "message": "Please wait before making more AI requests"
}
```

## Integration Tips

1. **Caching**: The API automatically caches responses. Identical requests will return cached results.

2. **Rate Limiting**: Be aware of rate limits:
   - General API: 100 requests per 15 minutes
   - AI endpoints: 20 requests per 5 minutes

3. **Error Handling**: Always check the `success` field in responses.

4. **Batch Processing**: Use the batch endpoint for multiple operations to reduce round trips.

5. **File Uploads**: For speech-to-text, use multipart/form-data with audio files under 10MB.

## Testing with Postman

1. Import the API endpoints into Postman
2. Set the base URL to `http://localhost:3000`
3. Use the examples above as request templates
4. Set appropriate headers (Content-Type: application/json)

## Frontend Integration

The API is designed to work seamlessly with React, Vue, Angular, or any frontend framework. All endpoints return JSON and use standard HTTP methods and status codes.