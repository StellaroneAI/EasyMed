import React, { useState, useRef, useEffect } from 'react';
import { Mic, MicOff, VolumeX, Globe } from 'lucide-react';
import type { LanguageOption } from '../types';

const VoiceAssistant: React.FC = () => {
  const [isListening, setIsListening] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentLanguage, setCurrentLanguage] = useState<LanguageOption>({
    code: 'en',
    name: 'English',
    nativeName: 'English',
    flag: '🇺🇸'
  });
  const [showLanguageMenu, setShowLanguageMenu] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [response, setResponse] = useState('');
  
  const recognitionRef = useRef<unknown>(null);
  const speechSynthesisRef = useRef<SpeechSynthesisUtterance | null>(null);

  const languages: LanguageOption[] = [
    { code: 'en', name: 'English', nativeName: 'English', flag: '🇺🇸' },
    { code: 'hi', name: 'Hindi', nativeName: 'हिन्दी', flag: '🇮🇳' },
    { code: 'ta', name: 'Tamil', nativeName: 'தமிழ்', flag: '🇮🇳' },
    { code: 'te', name: 'Telugu', nativeName: 'తెలుగు', flag: '🇮🇳' }
  ];

  const handleEmergencyCall = (number: string) => {
    setResponse(`Calling ${number} emergency services...`);
    speakResponse(`Calling ${number} emergency services`, currentLanguage.code);
    window.open(`tel:${number}`, '_self');
  };

  const navigateToPage = (path: string) => {
    setResponse(`Navigating to ${path.replace('/', '').replace('-', ' ')}...`);
    speakResponse(`Navigating to ${path.replace('/', '').replace('-', ' ')}`, currentLanguage.code);
    window.location.href = path;
  };

  const handleMedicineReminder = () => {
    setResponse('Checking your medicine schedule...');
    speakResponse('Checking your medicine schedule', currentLanguage.code);
  };

  const speakResponse = (text: string, language: string) => {
    if ('speechSynthesis' in window) {
      setIsPlaying(true);
      speechSynthesisRef.current = new SpeechSynthesisUtterance(text);
      speechSynthesisRef.current.lang = language === 'en' ? 'en-US' : 
                                       language === 'hi' ? 'hi-IN' :
                                       language === 'ta' ? 'ta-IN' :
                                       language === 'te' ? 'te-IN' : 'en-US';
      
      speechSynthesisRef.current.onend = () => setIsPlaying(false);
      window.speechSynthesis.speak(speechSynthesisRef.current);
    }
  };

  const processVoiceCommand = (command: string) => {
    const healthcareCommands = {
      en: {
        'call ambulance': () => handleEmergencyCall('108'),
        'emergency help': () => handleEmergencyCall('108'),
        'call 108': () => handleEmergencyCall('108'),
        'check symptoms': () => navigateToPage('/ai-assistant'),
        'book appointment': () => navigateToPage('/appointments'),
        'view health records': () => navigateToPage('/health-records'),
        'family health': () => navigateToPage('/family'),
        'go to dashboard': () => navigateToPage('/'),
        'medicine reminder': () => handleMedicineReminder(),
      },
      hi: {
        'एम्बुलेंस बुलाओ': () => handleEmergencyCall('108'),
        'आपातकाल': () => handleEmergencyCall('108'),
        '108 कॉल करो': () => handleEmergencyCall('108'),
        'लक्षण जांचो': () => navigateToPage('/ai-assistant'),
        'अपॉइंटमेंट बुक करो': () => navigateToPage('/appointments'),
        'स्वास्थ्य रिकॉर्ड देखो': () => navigateToPage('/health-records'),
      },
      ta: {
        'ஆம்புலன்ஸ் அழை': () => handleEmergencyCall('108'),
        'அவசரம்': () => handleEmergencyCall('108'),
        '108 கூப்பிடு': () => handleEmergencyCall('108'),
        'அறிகுறிகள் சரிபார்': () => navigateToPage('/ai-assistant'),
      },
      te: {
        'అంబులెన్స్ పిలవండి': () => handleEmergencyCall('108'),
        'అత్యవసరం': () => handleEmergencyCall('108'),
        '108 కాల్ చేయండి': () => handleEmergencyCall('108'),
        'లక్షణాలు చూడండి': () => navigateToPage('/ai-assistant'),
      }
    };

    const commands = healthcareCommands[currentLanguage.code as keyof typeof healthcareCommands] || healthcareCommands.en;
    const matchedCommand = Object.keys(commands).find(cmd => 
      command.includes(cmd) || cmd.includes(command)
    );

    if (matchedCommand && commands[matchedCommand as keyof typeof commands]) {
      (commands[matchedCommand as keyof typeof commands] as () => void)();
    } else {
      const fallbackResponse = currentLanguage.code === 'hi' ? 'मुझे समझ नहीं आया। कृपया फिर से कहें।' :
                              currentLanguage.code === 'ta' ? 'எனக்கு புरியவில்லை. மீண்டும் சொல்லுங்கள்.' :
                              currentLanguage.code === 'te' ? 'నాకు అర్థం కాలేదు. దయచేसి మళ్లీ చెప্పండి.' :
                              'I didn\'t understand that. Please try again.';
      setResponse(fallbackResponse);
      speakResponse(fallbackResponse, currentLanguage.code);
    }
  };

  useEffect(() => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = (window as { webkitSpeechRecognition?: unknown; SpeechRecognition?: unknown }).webkitSpeechRecognition || (window as { webkitSpeechRecognition?: unknown; SpeechRecognition?: unknown }).SpeechRecognition;
      
      if (SpeechRecognition) {
        recognitionRef.current = new (SpeechRecognition as new () => unknown)();
        const recognition = recognitionRef.current as {
          continuous: boolean;
          interimResults: boolean;
          lang: string;
          onresult: (event: { results: { [key: number]: { [key: number]: { transcript: string } } } }) => void;
          onend: () => void;
          start: () => void;
          stop: () => void;
        };
        
        recognition.continuous = false;
        recognition.interimResults = false;
        
        recognition.onresult = (event: { results: { [key: number]: { [key: number]: { transcript: string } } } }) => {
          const command = event.results[0][0].transcript.toLowerCase();
          setTranscript(command);
          processVoiceCommand(command);
        };

        recognition.onend = () => {
          setIsListening(false);
        };
      }
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentLanguage]);

  const startListening = () => {
    const recognition = recognitionRef.current as {
      lang: string;
      start: () => void;
    } | null;
    
    if (recognition) {
      setIsListening(true);
      setTranscript('');
      setResponse('');
      recognition.lang = currentLanguage.code === 'en' ? 'en-US' : 
                        currentLanguage.code === 'hi' ? 'hi-IN' :
                        currentLanguage.code === 'ta' ? 'ta-IN' :
                        currentLanguage.code === 'te' ? 'te-IN' : 'en-US';
      recognition.start();
    }
  };

  const stopListening = () => {
    const recognition = recognitionRef.current as {
      stop: () => void;
    } | null;
    
    if (recognition) {
      recognition.stop();
    }
    setIsListening(false);
  };

  const stopSpeaking = () => {
    if (window.speechSynthesis) {
      window.speechSynthesis.cancel();
      setIsPlaying(false);
    }
  };

  return (
    <>
      {/* Floating Voice Button */}
      <div className="fixed bottom-6 right-6 z-50">
        <div className="flex flex-col items-end space-y-2">
          {/* Language Selector */}
          {showLanguageMenu && (
            <div className="bg-white rounded-lg shadow-lg border p-2 min-w-[160px]">
              {languages.map((lang) => (
                <button
                  key={lang.code}
                  onClick={() => {
                    setCurrentLanguage(lang);
                    setShowLanguageMenu(false);
                  }}
                  className={`w-full text-left px-3 py-2 rounded-md text-sm hover:bg-gray-100 flex items-center space-x-2 ${
                    currentLanguage.code === lang.code ? 'bg-primary-50 text-primary-700' : 'text-gray-700'
                  }`}
                >
                  <span>{lang.flag}</span>
                  <span>{lang.nativeName}</span>
                </button>
              ))}
            </div>
          )}

          {/* Response Display */}
          {(transcript || response) && (
            <div className="bg-white rounded-lg shadow-lg border p-3 max-w-xs">
              {transcript && (
                <p className="text-sm text-gray-600 mb-1">
                  <strong>You said:</strong> {transcript}
                </p>
              )}
              {response && (
                <p className="text-sm text-primary-700">
                  <strong>Response:</strong> {response}
                </p>
              )}
            </div>
          )}

          {/* Control Buttons */}
          <div className="flex space-x-2">
            <button
              onClick={() => setShowLanguageMenu(!showLanguageMenu)}
              className="bg-gray-600 hover:bg-gray-700 text-white p-3 rounded-full shadow-lg transition-colors"
              title="Change Language"
            >
              <Globe className="h-5 w-5" />
            </button>

            {isPlaying && (
              <button
                onClick={stopSpeaking}
                className="bg-orange-500 hover:bg-orange-600 text-white p-3 rounded-full shadow-lg transition-colors"
                title="Stop Speaking"
              >
                <VolumeX className="h-5 w-5" />
              </button>
            )}

            <button
              onClick={isListening ? stopListening : startListening}
              className={`${
                isListening 
                  ? 'bg-red-500 hover:bg-red-600 animate-pulse' 
                  : 'bg-primary-500 hover:bg-primary-600'
              } text-white p-4 rounded-full shadow-lg transition-colors`}
              title={isListening ? 'Stop Listening' : 'Start Voice Command'}
            >
              {isListening ? <MicOff className="h-6 w-6" /> : <Mic className="h-6 w-6" />}
            </button>
          </div>

          {/* Current Language Indicator */}
          <div className="text-xs text-gray-500 text-center">
            {currentLanguage.flag} {currentLanguage.nativeName}
          </div>
        </div>
      </div>
    </>
  );
};

export default VoiceAssistant;