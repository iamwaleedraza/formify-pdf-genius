
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
}

export interface Vital {
  bloodPressure: string;
  heartRate: string;
  temperature: string;
  respiratoryRate: string;
  oxygenSaturation: string;
  height: string;
  weight: string;
}

export interface PatientFormData {
  patientInfo: {
    name: string;
    dateOfBirth: string;
    gender: string;
    medicalRecordNumber: string;
  };
  vitals: Vital;
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
}

export interface User {
  id: string;
  name: string;
  role: 'nurse' | 'doctor';
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
  section: 'patient' | 'vitals' | 'medications' | 'nurse' | 'doctor';
};
