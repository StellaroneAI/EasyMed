export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  dateOfBirth: string;
  gender: 'male' | 'female' | 'other';
  bloodGroup?: string;
  emergencyContact?: {
    name: string;
    phone: string;
    relation: string;
  };
  createdAt: string;
  updatedAt: string;
}

export interface HealthRecord {
  id: string;
  userId: string;
  type: 'checkup' | 'test' | 'prescription' | 'emergency' | 'consultation';
  title: string;
  description: string;
  date: string;
  doctorName?: string;
  hospitalName?: string;
  files?: FileAttachment[];
  medications?: Medication[];
  vitals?: HealthVitals;
  createdAt: string;
}

export interface FileAttachment {
  id: string;
  name: string;
  type: string;
  size: number;
  url: string;
  uploadedAt: string;
}

export interface Medication {
  id: string;
  name: string;
  dosage: string;
  frequency: string;
  duration: string;
  instructions?: string;
  startDate: string;
  endDate?: string;
  reminders: boolean;
}

export interface HealthVitals {
  bloodPressure?: {
    systolic: number;
    diastolic: number;
  };
  heartRate?: number;
  temperature?: number;
  weight?: number;
  height?: number;
  bmi?: number;
  oxygenSaturation?: number;
}

export interface Appointment {
  id: string;
  userId: string;
  doctorName: string;
  hospitalName: string;
  department: string;
  date: string;
  time: string;
  duration: number;
  type: 'consultation' | 'checkup' | 'follow-up' | 'emergency';
  status: 'scheduled' | 'confirmed' | 'in-progress' | 'completed' | 'cancelled';
  notes?: string;
  symptoms?: string;
  createdAt: string;
}

export interface FamilyMember {
  id: string;
  name: string;
  relation: string;
  dateOfBirth: string;
  gender: 'male' | 'female' | 'other';
  bloodGroup?: string;
  healthRecords: HealthRecord[];
  medications: Medication[];
  addedBy: string;
  createdAt: string;
}

export interface AIHealthAnalysis {
  id: string;
  userId: string;
  symptoms: string;
  analysis: {
    severity: 'low' | 'medium' | 'high' | 'critical';
    possibleConditions: string[];
    recommendations: string[];
    urgency: 'routine' | 'urgent' | 'emergency';
    confidence: number;
  };
  timestamp: string;
}

export interface VoiceCommand {
  id: string;
  command: string;
  intent: 'navigate' | 'emergency' | 'symptom_check' | 'appointment' | 'medication' | 'general';
  language: 'en' | 'hi' | 'ta' | 'te';
  processed: boolean;
  response?: string;
  timestamp: string;
}

export interface EmergencyContact {
  name: string;
  number: string;
  type: 'ambulance' | 'police' | 'fire' | 'hospital' | 'personal';
  location?: string;
}

export interface LanguageOption {
  code: 'en' | 'hi' | 'ta' | 'te';
  name: string;
  nativeName: string;
  flag: string;
}