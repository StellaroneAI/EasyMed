import React, { useState } from 'react';
import { Send, Bot, User, AlertTriangle, CheckCircle, Clock, Loader } from 'lucide-react';

interface Message {
  id: string;
  type: 'user' | 'ai';
  content: string;
  timestamp: Date;
  severity?: 'low' | 'medium' | 'high' | 'critical';
}

interface HealthAnalysis {
  severity: 'low' | 'medium' | 'high' | 'critical';
  possibleConditions: string[];
  recommendations: string[];
  urgency: 'routine' | 'urgent' | 'emergency';
  confidence: number;
}

const AIAssistant: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      type: 'ai',
      content: 'Hello! I\'m your AI health assistant. I can help you analyze symptoms, provide health insights, and guide you to appropriate care. How are you feeling today?',
      timestamp: new Date(),
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const quickSymptoms = [
    'Headache',
    'Fever',
    'Cough',
    'Stomach pain',
    'Chest pain',
    'Fatigue',
    'Nausea',
    'Dizziness'
  ];

  const mockAnalyzeSymptoms = async (symptoms: string): Promise<HealthAnalysis> => {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Mock analysis based on symptoms
    const lowerSymptoms = symptoms.toLowerCase();
    
    if (lowerSymptoms.includes('chest pain') || lowerSymptoms.includes('heart')) {
      return {
        severity: 'critical',
        possibleConditions: ['Heart Attack', 'Angina', 'Panic Attack'],
        recommendations: ['Seek immediate emergency care', 'Call 108', 'Chew aspirin if available'],
        urgency: 'emergency',
        confidence: 85
      };
    } else if (lowerSymptoms.includes('fever') && lowerSymptoms.includes('cough')) {
      return {
        severity: 'medium',
        possibleConditions: ['Viral Infection', 'Flu', 'COVID-19'],
        recommendations: ['Rest and hydration', 'Monitor temperature', 'Consult doctor if symptoms worsen'],
        urgency: 'urgent',
        confidence: 75
      };
    } else if (lowerSymptoms.includes('headache')) {
      return {
        severity: 'low',
        possibleConditions: ['Tension Headache', 'Migraine', 'Dehydration'],
        recommendations: ['Rest in dark room', 'Stay hydrated', 'Over-the-counter pain relief'],
        urgency: 'routine',
        confidence: 70
      };
    } else {
      return {
        severity: 'low',
        possibleConditions: ['General discomfort', 'Stress-related symptoms'],
        recommendations: ['Rest and monitor symptoms', 'Stay hydrated', 'Consult doctor if persistent'],
        urgency: 'routine',
        confidence: 60
      };
    }
  };

  const sendMessage = async () => {
    if (!inputMessage.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: inputMessage,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsAnalyzing(true);

    try {
      const analysis = await mockAnalyzeSymptoms(inputMessage);
      
      const aiResponse = generateAIResponse(analysis);
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: 'ai',
        content: aiResponse,
        timestamp: new Date(),
        severity: analysis.severity,
      };

      setMessages(prev => [...prev, aiMessage]);
    } catch (err) {
      console.error('Error analyzing symptoms:', err);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: 'ai',
        content: 'I apologize, but I\'m having trouble analyzing your symptoms right now. Please try again or consult with a healthcare provider.',
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const generateAIResponse = (analysis: HealthAnalysis): string => {
    const { severity, possibleConditions, recommendations, urgency, confidence } = analysis;
    
    let response = `Based on your symptoms, I've completed an analysis with ${confidence}% confidence.\n\n`;
    
    response += `**Severity Level:** ${severity.toUpperCase()}\n`;
    response += `**Urgency:** ${urgency.toUpperCase()}\n\n`;
    
    response += `**Possible Conditions:**\n`;
    possibleConditions.forEach(condition => {
      response += `• ${condition}\n`;
    });
    
    response += `\n**Recommendations:**\n`;
    recommendations.forEach(rec => {
      response += `• ${rec}\n`;
    });
    
    if (severity === 'critical' || urgency === 'emergency') {
      response += `\n⚠️ **URGENT:** These symptoms may require immediate medical attention. Consider calling emergency services (108) or visiting the nearest emergency room.`;
    } else if (severity === 'medium' || urgency === 'urgent') {
      response += `\n⚠️ **Important:** Please consider scheduling an appointment with a healthcare provider within 24-48 hours.`;
    }
    
    response += `\n\n*This is an AI analysis and should not replace professional medical advice. Always consult with a qualified healthcare provider for proper diagnosis and treatment.*`;
    
    return response;
  };

  const addQuickSymptom = (symptom: string) => {
    setInputMessage(prev => prev ? `${prev}, ${symptom}` : symptom);
  };

  const getSeverityColor = (severity?: string) => {
    switch (severity) {
      case 'critical':
        return 'border-red-500 bg-red-50';
      case 'high':
        return 'border-orange-500 bg-orange-50';
      case 'medium':
        return 'border-yellow-500 bg-yellow-50';
      case 'low':
        return 'border-green-500 bg-green-50';
      default:
        return 'border-gray-200 bg-white';
    }
  };

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 p-4">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-2xl font-bold text-gray-900 flex items-center">
            <Bot className="h-8 w-8 text-primary-600 mr-3" />
            AI Health Assistant
          </h1>
          <p className="text-gray-600 mt-1">Describe your symptoms for instant health analysis</p>
        </div>
      </div>

      {/* Quick Symptoms */}
      <div className="bg-white border-b border-gray-200 p-4">
        <div className="max-w-4xl mx-auto">
          <p className="text-sm text-gray-600 mb-2">Quick symptoms:</p>
          <div className="flex flex-wrap gap-2">
            {quickSymptoms.map(symptom => (
              <button
                key={symptom}
                onClick={() => addQuickSymptom(symptom)}
                className="px-3 py-1 text-sm bg-primary-100 text-primary-700 rounded-full hover:bg-primary-200 transition-colors"
              >
                {symptom}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4">
        <div className="max-w-4xl mx-auto space-y-4">
          {messages.map(message => (
            <div
              key={message.id}
              className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-xs lg:max-w-md xl:max-w-lg px-4 py-3 rounded-lg border ${
                  message.type === 'user'
                    ? 'bg-primary-500 text-white border-primary-500'
                    : getSeverityColor(message.severity)
                }`}
              >
                <div className="flex items-start space-x-2">
                  {message.type === 'ai' && (
                    <Bot className="h-5 w-5 text-primary-600 mt-0.5 flex-shrink-0" />
                  )}
                  {message.type === 'user' && (
                    <User className="h-5 w-5 text-white mt-0.5 flex-shrink-0" />
                  )}
                  <div className="flex-1">
                    <div className="whitespace-pre-wrap text-sm">
                      {message.content}
                    </div>
                    <div className={`text-xs mt-2 ${
                      message.type === 'user' ? 'text-primary-100' : 'text-gray-500'
                    }`}>
                      {message.timestamp.toLocaleTimeString()}
                    </div>
                  </div>
                </div>
                {message.severity && (
                  <div className="mt-2 flex items-center space-x-1">
                    {message.severity === 'critical' && <AlertTriangle className="h-4 w-4 text-red-600" />}
                    {message.severity === 'high' && <AlertTriangle className="h-4 w-4 text-orange-600" />}
                    {message.severity === 'medium' && <Clock className="h-4 w-4 text-yellow-600" />}
                    {message.severity === 'low' && <CheckCircle className="h-4 w-4 text-green-600" />}
                    <span className="text-xs font-medium capitalize">{message.severity} Priority</span>
                  </div>
                )}
              </div>
            </div>
          ))}
          
          {isAnalyzing && (
            <div className="flex justify-start">
              <div className="bg-white border border-gray-200 px-4 py-3 rounded-lg">
                <div className="flex items-center space-x-2">
                  <Loader className="h-5 w-5 text-primary-600 animate-spin" />
                  <span className="text-sm text-gray-600">Analyzing your symptoms...</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Input */}
      <div className="bg-white border-t border-gray-200 p-4">
        <div className="max-w-4xl mx-auto">
          <div className="flex space-x-4">
            <input
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
              placeholder="Describe your symptoms in detail..."
              className="flex-1 border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              disabled={isAnalyzing}
            />
            <button
              onClick={sendMessage}
              disabled={!inputMessage.trim() || isAnalyzing}
              className="bg-primary-500 text-white px-6 py-2 rounded-lg hover:bg-primary-600 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
            >
              <Send className="h-4 w-4" />
              <span>Send</span>
            </button>
          </div>
          <p className="text-xs text-gray-500 mt-2">
            This AI assistant provides general health information and should not replace professional medical advice.
          </p>
        </div>
      </div>
    </div>
  );
};

export default AIAssistant;