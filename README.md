# EasyMed - AI-Powered Mobile Healthcare Platform

## Overview
EasyMed is a next-generation AI-integrated mobile-first healthcare platform designed specifically for India's healthcare landscape. The platform combines advanced AI technology with comprehensive healthcare management tools.

## 🌟 Key Features

### 🤖 AI-Powered Health Assistant
- Advanced symptom analysis with natural language processing
- Health risk assessment with predictive analytics
- Personalized health insights based on patient data
- Medical content generation in multiple languages

### 🗣️ Multilingual Voice Assistant
- One-click voice commands with floating voice button
- Support for 4 languages: English, Hindi, Tamil, Telugu
- Natural language navigation throughout the app
- Healthcare-specific voice commands ("Call 108", "Check symptoms", "Book appointment")
- Smart intent recognition powered by AI

### 📱 Comprehensive Healthcare Management
- Patient dashboard with real-time health overview
- Smart appointment booking system
- Secure digital health records storage
- Family health management with multi-member profiles
- Digital prescription management with medication reminders
- Emergency services integration (108 ambulance access)

## 🛠️ Technical Stack
- **Frontend**: React 18 + TypeScript
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **Database**: MongoDB with connection string URL support
- **AI Integration**: OpenAI API
- **Build Tool**: Vite
- **Development**: Hot reload with React Refresh

## 📁 Project Structure
```
├── src/
│   ├── components/        # Reusable UI components
│   │   ├── Layout.tsx     # Main layout with navigation
│   │   └── VoiceAssistant.tsx  # Multilingual voice assistant
│   ├── pages/            # Application pages
│   │   ├── Dashboard.tsx      # Main health dashboard
│   │   ├── AIAssistant.tsx    # AI health analysis
│   │   ├── Appointments.tsx   # Appointment management
│   │   ├── HealthRecords.tsx  # Medical records
│   │   ├── FamilyHealth.tsx   # Family member health
│   │   ├── Emergency.tsx      # Emergency services
│   │   └── Profile.tsx        # User profile
│   ├── hooks/            # Custom React hooks
│   ├── utils/            # Utility functions
│   ├── types/            # TypeScript type definitions
│   └── styles/           # Global styles
├── public/               # Static assets
├── package.json          # Dependencies and scripts
├── tailwind.config.js    # Tailwind configuration
├── tsconfig.json         # TypeScript configuration
├── vite.config.ts        # Vite build configuration
└── README.md            # Project documentation
```

## 🚀 Installation & Setup

### Prerequisites
- Node.js 18+ and npm
- MongoDB database
- OpenAI API key

### Installation
```bash
# Clone the repository
git clone <repository-url>
cd EasyMed

# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## 🔧 Environment Variables Required
Create a `.env` file in the root directory:
```
VITE_MONGODB_URI=your_mongodb_connection_string
VITE_OPENAI_API_KEY=your_openai_api_key
```

## 🎯 Development Commands
```bash
# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Lint code
npm run lint

# Type check
npm run type-check
```

## 🚀 Deployment

### Deploy to Vercel
The application is configured for deployment on Vercel with:
- Automatic SPA routing configuration
- Optimized build settings
- Environment variable support for API keys
- CDN integration for static assets

```bash
# Install Vercel CLI (if not already installed)
npm i -g vercel

# Deploy to Vercel
vercel --prod
```

The project includes a `vercel.json` configuration file that handles:
- Static build configuration using Vite
- Single Page Application routing
- Environment variable setup
- API function runtime configuration

## 🌐 Language Support
- **English**: Full feature support
- **Hindi (हिन्दी)**: Voice commands and UI
- **Tamil (தமிழ்)**: Voice commands and UI
- **Telugu (తెలుగు)**: Voice commands and UI

## 🔒 Security & Privacy
- Secure data encryption
- HIPAA-compliant data handling
- Privacy-first design
- Local storage for sensitive data

## 🤝 Contributing
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new features
5. Submit a pull request

## 📄 License
This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments
- OpenAI for AI capabilities
- Lucide React for beautiful icons
- Tailwind CSS for styling
- React community for excellent ecosystem

---

This implementation provides a solid foundation for India's healthcare digitization with AI-powered features, multilingual support, and comprehensive healthcare management capabilities.