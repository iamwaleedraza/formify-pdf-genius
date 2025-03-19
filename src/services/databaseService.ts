
// This is a simple client-side database implementation using localStorage
// In a real application, this would be replaced with a proper backend database

import { Patient, PatientFormData, Medication, User } from "@/types";

// Storage keys
const PATIENTS_KEY = "dna_health_patients";
const FORM_DATA_KEY = "dna_health_form_data";
const MEDICATIONS_KEY = "dna_health_medications";
const USERS_KEY = "dna_health_users";
const CURRENT_USER_KEY = "dna_health_current_user";

// Initialize storage with mock data if empty
const initializeStorage = () => {
  // Import mock data
  import("@/lib/mockData").then((mockData) => {
    if (!localStorage.getItem(PATIENTS_KEY)) {
      localStorage.setItem(PATIENTS_KEY, JSON.stringify(mockData.mockPatients));
    }
    
    if (!localStorage.getItem(MEDICATIONS_KEY)) {
      localStorage.setItem(MEDICATIONS_KEY, JSON.stringify(mockData.mockMedications));
    }
    
    if (!localStorage.getItem(USERS_KEY)) {
      localStorage.setItem(USERS_KEY, JSON.stringify(mockData.mockUsers));
    }
    
    if (!localStorage.getItem(CURRENT_USER_KEY)) {
      localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(mockData.mockUsers[1])); // Default to nurse
    }
    
    // Initialize form data for each patient if not exists
    const patients = JSON.parse(localStorage.getItem(PATIENTS_KEY) || "[]");
    patients.forEach((patient: Patient) => {
      const formDataKey = `${FORM_DATA_KEY}_${patient.id}`;
      if (!localStorage.getItem(formDataKey)) {
        mockData.getPatientFormData(patient.id).then((formData) => {
          localStorage.setItem(formDataKey, JSON.stringify(formData));
        });
      }
    });
  });
};

// Initialize on module import
initializeStorage();

// Patient operations
export const getPatients = async (): Promise<Patient[]> => {
  const patients = localStorage.getItem(PATIENTS_KEY);
  return patients ? JSON.parse(patients) : [];
};

export const getPatientById = async (id: string): Promise<Patient | null> => {
  const patients = await getPatients();
  return patients.find(p => p.id === id) || null;
};

export const addPatient = async (patient: Patient): Promise<Patient> => {
  const patients = await getPatients();
  const newPatients = [...patients, patient];
  localStorage.setItem(PATIENTS_KEY, JSON.stringify(newPatients));
  return patient;
};

export const updatePatient = async (patient: Patient): Promise<Patient> => {
  const patients = await getPatients();
  const updatedPatients = patients.map(p => p.id === patient.id ? patient : p);
  localStorage.setItem(PATIENTS_KEY, JSON.stringify(updatedPatients));
  return patient;
};

export const deletePatient = async (id: string): Promise<void> => {
  const patients = await getPatients();
  const filteredPatients = patients.filter(p => p.id !== id);
  localStorage.setItem(PATIENTS_KEY, JSON.stringify(filteredPatients));
  
  // Also delete related form data
  localStorage.removeItem(`${FORM_DATA_KEY}_${id}`);
};

// Form data operations
export const getPatientFormData = async (patientId: string): Promise<PatientFormData | null> => {
  const formDataKey = `${FORM_DATA_KEY}_${patientId}`;
  const formData = localStorage.getItem(formDataKey);
  return formData ? JSON.parse(formData) : null;
};

export const savePatientFormData = async (patientId: string, formData: PatientFormData): Promise<PatientFormData> => {
  const formDataKey = `${FORM_DATA_KEY}_${patientId}`;
  localStorage.setItem(formDataKey, JSON.stringify(formData));
  
  // Update last updated time on patient
  const patient = await getPatientById(patientId);
  if (patient) {
    patient.lastUpdated = new Date().toISOString();
    await updatePatient(patient);
  }
  
  return formData;
};

// Medication operations
export const getMedications = async (): Promise<Medication[]> => {
  const medications = localStorage.getItem(MEDICATIONS_KEY);
  return medications ? JSON.parse(medications) : [];
};

export const addMedication = async (medication: Medication): Promise<Medication> => {
  const medications = await getMedications();
  const newMedications = [...medications, medication];
  localStorage.setItem(MEDICATIONS_KEY, JSON.stringify(newMedications));
  return medication;
};

export const updateMedication = async (medication: Medication): Promise<Medication> => {
  const medications = await getMedications();
  const updatedMedications = medications.map(m => m.id === medication.id ? medication : m);
  localStorage.setItem(MEDICATIONS_KEY, JSON.stringify(updatedMedications));
  return medication;
};

export const deleteMedication = async (id: string): Promise<void> => {
  const medications = await getMedications();
  const filteredMedications = medications.filter(m => m.id !== id);
  localStorage.setItem(MEDICATIONS_KEY, JSON.stringify(filteredMedications));
};

// User operations
export const getUsers = async (): Promise<User[]> => {
  const users = localStorage.getItem(USERS_KEY);
  return users ? JSON.parse(users) : [];
};

export const getCurrentUser = async (): Promise<User | null> => {
  const user = localStorage.getItem(CURRENT_USER_KEY);
  return user ? JSON.parse(user) : null;
};

export const setCurrentUser = async (user: User): Promise<User> => {
  localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user));
  return user;
};

// Generate a unique MRN
export const generateMRN = (): string => {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let mrn = "MRN-";
  for (let i = 0; i < 8; i++) {
    mrn += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return mrn;
};
