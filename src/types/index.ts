
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
  exerciseRecommendations: string;
  nurseNotes: string;
  doctorNotes: string;
  diagnosis: string;
  treatmentPlan: string;
  showInsulinResistance?: boolean;  // New field to control insulin resistance section visibility
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
