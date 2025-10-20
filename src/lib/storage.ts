import { Medication, MedicationLog, UserProfile } from '@/types/medication';

const MEDICATIONS_KEY = 'medications';
const LOGS_KEY = 'medication_logs';
const PROFILE_KEY = 'user_profile';

export const storage = {
  // Medications
  getMedications: (): Medication[] => {
    const data = localStorage.getItem(MEDICATIONS_KEY);
    return data ? JSON.parse(data) : [];
  },

  saveMedications: (medications: Medication[]) => {
    localStorage.setItem(MEDICATIONS_KEY, JSON.stringify(medications));
  },

  addMedication: (medication: Medication) => {
    const medications = storage.getMedications();
    medications.push(medication);
    storage.saveMedications(medications);
  },

  deleteMedication: (id: string) => {
    const medications = storage.getMedications().filter(m => m.id !== id);
    storage.saveMedications(medications);
  },

  // Logs
  getLogs: (): MedicationLog[] => {
    const data = localStorage.getItem(LOGS_KEY);
    return data ? JSON.parse(data) : [];
  },

  saveLogs: (logs: MedicationLog[]) => {
    localStorage.setItem(LOGS_KEY, JSON.stringify(logs));
  },

  addLog: (log: MedicationLog) => {
    const logs = storage.getLogs();
    logs.push(log);
    storage.saveLogs(logs);
  },

  updateLog: (id: string, updates: Partial<MedicationLog>) => {
    const logs = storage.getLogs();
    const index = logs.findIndex(l => l.id === id);
    if (index !== -1) {
      logs[index] = { ...logs[index], ...updates };
      storage.saveLogs(logs);
    }
  },

  // Profile
  getProfile: (): UserProfile | null => {
    const data = localStorage.getItem(PROFILE_KEY);
    return data ? JSON.parse(data) : null;
  },

  saveProfile: (profile: UserProfile) => {
    localStorage.setItem(PROFILE_KEY, JSON.stringify(profile));
  },
};
