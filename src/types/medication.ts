export interface Medication {
  id: string;
  name: string;
  dose: string;
  frequency: string;
  times: string[];
  instructions?: string;
  startDate: string;
  createdAt: string;
}

export interface MedicationLog {
  id: string;
  medicationId: string;
  scheduledTime: string;
  takenAt?: string;
  status: 'pending' | 'taken' | 'missed';
  missedNotificationSent?: boolean;
}

export interface UserProfile {
  name: string;
  age: number;
  caregiverName?: string;
  caregiverContact?: string;
  timezone: string;
}
