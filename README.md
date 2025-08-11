# EasyMed - AI-Powered Multilingual Healthcare Platform

EasyMed is an innovative healthcare platform that integrates AI4Bharat and Hugging Face APIs to provide multilingual AI-powered features for healthcare applications. The platform specializes in Indian languages while supporting global healthcare AI capabilities.

## 🌟 Features

### AI4Bharat Integration
- **IndicTrans2**: Translation between English, Hindi, Tamil, Telugu, and other Indian languages
- **IndicASR**: Speech-to-text in Indian languages
- **IndicTTS**: Text-to-speech synthesis for Indian languages
- **IndicBERT**: Natural language understanding in Indian languages

### Hugging Face Integration
- **Medical NER**: Extract medical entities (symptoms, conditions, medications) from text
- **Symptom Classification**: AI-powered symptom analysis and recommendations
- **Healthcare Chatbot**: Medical question answering and guidance
- **Multilingual Models**: Cross-language medical content translation

## 🚀 Quick Start

### Prerequisites
- Node.js 18 or later
- npm or yarn
- Docker (optional)

### Installation

1. Clone the repository:
```bash
git clone https://github.com/StellaroneAI/EasyMed.git
cd EasyMed
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env
# Edit .env file with your API keys
```

4. Start the development server:
```bash
npm run dev
```

The server will start on `http://localhost:3000`

### Docker Deployment

1. Build the Docker image:
```bash
docker build -t easymed .
```

2. Run the container:
```bash
docker run -p 3000:3000 --env-file .env easymed
```

## 📚 API Documentation

### Base URL
```
http://localhost:3000/api/ai
```

### Endpoints

#### 1. Health Check
```
GET /api/ai/health
```
Returns the health status of all AI services.

#### 2. Supported Languages
```
GET /api/ai/languages
```
Returns list of supported languages for each service.

#### 3. Translation
```
POST /api/ai/translate
```
**Request Body:**
```json
{
  "text": "How are you feeling today?",
  "sourceLanguage": "en",
  "targetLanguage": "hi"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "translatedText": "आज आप कैसा महसूस कर रहे हैं?",
    "sourceLanguage": "en",
    "targetLanguage": "hi",
    "originalText": "How are you feeling today?",
    "confidence": 0.85,
    "service": "AI4Bharat-IndicTrans2"
  }
}
```

#### 4. Speech-to-Text
```
POST /api/ai/speech-to-text
```
**Request:** Multipart form with audio file
**Form Fields:**
- `audio`: Audio file (WAV, MP3, M4A, OGG)
- `language`: Language code (optional, defaults to 'en')

#### 5. Text-to-Speech
```
POST /api/ai/text-to-speech
```
**Request Body:**
```json
{
  "text": "Take your medicine on time",
  "language": "hi",
  "voice": "female"
}
```

#### 6. Symptom Analysis
```
POST /api/ai/analyze-symptoms
```
**Request Body:**
```json
{
  "symptoms": "I have a headache and fever since yesterday",
  "language": "en"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "symptoms": "I have a headache and fever since yesterday",
    "language": "en",
    "analyses": [
      {
        "service": "HuggingFace-MedicalNER",
        "type": "entity_extraction",
        "result": {
          "entities": [
            {
              "entity_group": "SYMPTOMS",
              "word": "headache",
              "start": 9,
              "end": 17,
              "score": 0.92
            }
          ]
        }
      }
    ],
    "summary": {
      "confidence": 0.88,
      "entities": [...],
      "conditions": ["Flu", "Viral infection"],
      "urgency": "moderate",
      "recommendations": ["Rest", "Hydration", "Monitor temperature"]
    }
  },
  "disclaimer": "This analysis is for informational purposes only..."
}
```

#### 7. Medical Chat
```
POST /api/ai/medical-chat
```
**Request Body:**
```json
{
  "message": "I have been feeling dizzy lately",
  "context": [],
  "language": "en"
}
```

#### 8. Medical Entity Extraction
```
POST /api/ai/extract-medical-entities
```
**Request Body:**
```json
{
  "text": "Patient has diabetes and is taking metformin",
  "language": "en"
}
```

#### 9. Batch Processing
```
POST /api/ai/batch
```
**Request Body:**
```json
{
  "operations": [
    {
      "id": 1,
      "type": "translate",
      "text": "Hello",
      "sourceLanguage": "en",
      "targetLanguage": "hi"
    },
    {
      "id": 2,
      "type": "extract-entities",
      "text": "I have a headache",
      "language": "en"
    }
  ]
}
```

## 🔧 Configuration

### Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `PORT` | Server port | 3000 |
| `NODE_ENV` | Environment | development |
| `AI4BHARAT_API_KEY` | AI4Bharat API key | - |
| `AI4BHARAT_USER_ID` | AI4Bharat user ID | - |
| `HUGGINGFACE_API_KEY` | Hugging Face API key | - |
| `CACHE_TTL` | Cache TTL in seconds | 3600 |
| `RATE_LIMIT_MAX` | Max requests per window | 100 |
| `AI_RATE_LIMIT_MAX` | Max AI requests per window | 20 |

### Supported Languages

#### AI4Bharat Languages
- English (en)
- Hindi (hi)
- Tamil (ta)
- Telugu (te)
- Bengali (bn)
- Gujarati (gu)
- Kannada (kn)
- Malayalam (ml)
- Marathi (mr)
- Odia (or)
- Punjabi (pa)
- Urdu (ur)

## 🧪 Testing

Run the test suite:
```bash
npm test
```

Run tests in watch mode:
```bash
npm run test:watch
```

## 🏗️ Architecture

```
EasyMed/
├── backend/
│   ├── src/
│   │   ├── controllers/      # API controllers
│   │   ├── services/         # AI service integrations
│   │   ├── routes/           # API routes
│   │   ├── config/           # Configuration
│   │   ├── middleware/       # Custom middleware
│   │   └── utils/            # Utility functions
│   └── server.js             # Entry point
├── frontend/                 # React frontend (future)
├── tests/                    # Test files
├── docs/                     # Documentation
└── Dockerfile               # Docker configuration
```

### Service Architecture

1. **AI Service Layer**: Orchestrates between AI4Bharat and Hugging Face
2. **Cache Service**: Implements intelligent caching for API responses
3. **Rate Limiting**: Protects against API abuse
4. **Error Handling**: Comprehensive error handling and logging
5. **Fallback Mechanisms**: Automatic failover between services

## 🔒 Security Features

- Rate limiting on all endpoints
- Input validation and sanitization
- File upload restrictions
- Helmet.js security headers
- Environment variable protection
- Non-root Docker container

## 📊 Performance Features

- Intelligent caching with configurable TTL
- Request/response compression
- Optimized API call batching
- Memory-efficient file handling
- Cache statistics and monitoring

## 🚦 Error Handling

The API returns consistent error responses:

```json
{
  "error": "Error type",
  "message": "Human-readable error message",
  "details": "Additional error details (development only)"
}
```

Common HTTP status codes:
- `200`: Success
- `400`: Bad Request (validation errors)
- `429`: Too Many Requests (rate limiting)
- `500`: Internal Server Error

## 🔄 Development

### Development Server
```bash
npm run dev
```

### Code Style
The project follows standard Node.js conventions. Use ESLint for code consistency:
```bash
npm run lint
```

### Adding New Features

1. Create service in `backend/src/services/`
2. Add controller in `backend/src/controllers/`
3. Define routes in `backend/src/routes/`
4. Add tests in `tests/`
5. Update documentation

## 📈 Monitoring

### Health Endpoints
- `GET /health`: Basic server health
- `GET /api/ai/health`: AI services health
- Cache statistics available via API

### Logging
Comprehensive logging with configurable levels:
- Request/response logging
- Error tracking
- Performance metrics
- Cache hit/miss ratios

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

For support, please:
1. Check the documentation
2. Search existing issues
3. Create a new issue with detailed information

## 🙏 Acknowledgments

- [AI4Bharat](https://ai4bharat.org/) for Indic language AI models
- [Hugging Face](https://huggingface.co/) for medical AI models
- Node.js and Express.js communities
- All contributors to this project