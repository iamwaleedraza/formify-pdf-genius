
export interface Patient {
  id: string;
  name: string;
  dateOfBirth: string;
  gender: string;
  medicalRecordNumber: string;
  lastUpdated: string;
  status: 'nurse-pending' | 'doctor-pending' | 'completed';
}

export interface Medication {
  id: string;
  name: string;
  dosage: string;
  frequency: string;
  notes?: string;
  type: 'medication' | 'supplement';
  link?: string;
}

export interface Vital {
  bloodPressure: string;
  height: string;
  weight: string;
  heartRate?: string;
  temperature?: string;
  respiratoryRate?: string;
  oxygenSaturation?: string;
}

export interface SummaryFinding {
  glucoseMetabolism: string;
  lipidProfile: string;
  inflammation: string;
  uricAcid: string;
  vitamins: string;
  minerals: string;
  sexHormones: string;
  renalLiverFunction: string;
  cancerMarkers: string;
}

export interface NutritionRecommendation {
  nutritionalPlan: string;
  proteinConsumption: string;
  omissions: string;
  additionalConsiderations: string;
}

export interface ExerciseRecommendation {
  focusOn: string;
  walking: string;
  avoid: string;
  tracking: string;
}

export interface SleepStressRecommendation {
  sleep: string;
  stress: string;
}

export interface FollowUp {
  withDoctor: string;
  forReason: string;
  date: string;
}

export interface PatientFormData {
  patientInfo: {
    name: string;
    dateOfBirth: string;
    gender: string;
    medicalRecordNumber: string;
  };
  vitals: Vital;
  summaryFindings: SummaryFinding;
  medications: {
    id: string;
    medicationId: string;
    dosage: string;
    frequency: string;
    notes?: string;
  }[];
  supplements?: {
    id: string;
    supplementId: string;
    dosage: string;
    source: string;
  }[];
  exerciseRecommendations: string;
  nurseNotes: string;
  doctorNotes: string;
  diagnosis: string;
  treatmentPlan: string;
  showInsulinResistance: boolean;
  nutritionRecommendations: NutritionRecommendation;
  exerciseDetail: ExerciseRecommendation;
  sleepStressRecommendations: SleepStressRecommendation;
  followUps: FollowUp[];
}

export interface User {
  id: string;
  name: string;
  role: 'nurse' | 'doctor' | 'admin';
  email: string;
}

export type FormTemplate = {
  id: string;
  name: string;
  description: string;
  fields: FormField[];
};

export type FormField = {
  id: string;
  type: 'text' | 'select' | 'number' | 'date' | 'textarea' | 'medication';
  label: string;
  placeholder?: string;
  required: boolean;
  options?: string[];
  section: 'patient' | 'vitals' | 'medications' | 'nurse' | 'doctor' | 'summaryFindings';
};
