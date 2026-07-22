import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { apiService, setMemoryAuthToken } from '@/services/api';

export type UserType = {
  name: string;
  appId: string;
  email: string;
  phone: string;
  ghanaCard?: string;
  age?: number;
  isVerified: boolean;
  avatar: string;
  role: 'applicant' | 'officer' | 'admin';
};

export type CaseStage = {
  title: string;
  description: string;
  status: 'completed' | 'in_progress' | 'pending';
  date?: string;
  estimatedCompletion?: string;
};

export type CaseType = {
  appNumber: string;
  applicantName: string;
  visaType: string;
  status: 'Active' | 'Approved' | 'Rejected' | 'Pending';
  stages: CaseStage[];
  progressPercent: number;
};

export type AppointmentType = {
  id: string;
  office: string;
  date: string;
  time: string;
  type: string;
  supportingDocUri?: string;
};

type AppContextType = {
  user: UserType | null;
  login: (email: string, name?: string, password?: string) => Promise<boolean>;
  logout: () => void;
  registerUser: (name: string, email: string, password?: string, ghanaCard?: string, age?: number) => Promise<boolean>;
  activeCase: CaseType | null;
  setActiveCase: (activeCase: CaseType | null) => void;
  appointments: AppointmentType[];
  bookAppointment: (office: string, date: string, time: string, supportingDocUri?: string) => void;
  deleteAppointment: (id: string) => void;
  updateAppointment: (id: string, updated: Partial<AppointmentType>) => void;
  passportPicUri: string | null;
  uploadPassportPic: (uri: string) => void;
  ghanaCardFrontUri: string | null;
  uploadGhanaCardFront: (uri: string) => void;
  ghanaCardBackUri: string | null;
  uploadGhanaCardBack: (uri: string) => void;
  biometricsVerified: boolean;
  setBiometricsVerified: (verified: boolean) => void;
};

const defaultStages: CaseStage[] = [
  {
    title: 'Submitted',
    description: 'Application successfully received by the central registry.',
    status: 'completed',
    date: 'Oct 12, 2023 • 10:30 AM',
  },
  {
    title: 'Document Verification',
    description: 'All uploaded credentials and supporting documents verified.',
    status: 'completed',
    date: 'Oct 15, 2023 • 02:15 PM',
  },
  {
    title: 'Under Review',
    description: 'Your case is being evaluated by an Immigration Officer.',
    status: 'in_progress',
    estimatedCompletion: 'Oct 28, 2023',
  },
  {
    title: 'Approval Decision',
    description: 'Final decision will be communicated via the portal.',
    status: 'pending',
  },
  {
    title: 'Issuance',
    description: 'Digital visa and physical biometric permit dispatch.',
    status: 'pending',
  },
];

const defaultCase: CaseType = {
  appNumber: 'APP-88234',
  applicantName: 'John Doe',
  visaType: 'Skilled Worker Visa',
  status: 'Active',
  stages: defaultStages,
  progressPercent: 65,
};

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<UserType | null>(null);
  const [appointments, setAppointments] = useState<AppointmentType[]>([]);
  const [passportPicUri, setPassportPicUri] = useState<string | null>(null);
  const [ghanaCardFrontUri, setGhanaCardFrontUri] = useState<string | null>(null);
  const [ghanaCardBackUri, setGhanaCardBackUri] = useState<string | null>(null);
  const [biometricsVerified, setBiometricsVerified] = useState(false);
  const [activeCase, setActiveCase] = useState<CaseType | null>(null);
  const [isRestoring, setIsRestoring] = useState(true);

  useEffect(() => {
    const restoreSession = async () => {
      try {
        const token = await AsyncStorage.getItem('auth_token');
        const userStr = await AsyncStorage.getItem('auth_user');
        if (token && userStr) {
          setMemoryAuthToken(token);
          setUser(JSON.parse(userStr));
        }
      } catch (e) {
        console.error('Failed to restore session:', e);
      } finally {
        setIsRestoring(false);
      }
    };
    restoreSession();
  }, []);

  const login = async (email: string, name?: string, password?: string) => {
    try {
      const apiUser = await apiService.login(email, name, password);
      // Map ApiUser to UserType
      setUser({
        name: apiUser.name,
        appId: apiUser.appId,
        email: apiUser.email,
        phone: apiUser.phone || '',
        ghanaCard: apiUser.ghanaCard,
        age: apiUser.age,
        isVerified: apiUser.isVerified,
        avatar: apiUser.avatar,
        role: apiUser.role,
      });
      return true;
    } catch (e) {
      console.error(e);
      throw e;
    }
  };

  const logout = async () => {
    try {
      await apiService.logout();
    } catch (e) {
      console.error(e);
    }
    setUser(null);
    setPassportPicUri(null);
    setGhanaCardFrontUri(null);
    setGhanaCardBackUri(null);
    setBiometricsVerified(false);
    setActiveCase(null);
    setAppointments([]);
  };

  const registerUser = async (name: string, email: string, password?: string, ghanaCard?: string, age?: number) => {
    try {
      const apiUser = await apiService.register(name, email, password, ghanaCard, age);
      // Map ApiUser to UserType
      setUser({
        name: apiUser.name,
        appId: apiUser.appId,
        email: apiUser.email,
        phone: apiUser.phone || '',
        ghanaCard: apiUser.ghanaCard,
        age: apiUser.age,
        isVerified: apiUser.isVerified,
        avatar: apiUser.avatar,
        role: apiUser.role,
      });
      return true;
    } catch (e) {
      console.error(e);
      throw e;
    }
  };

  const bookAppointment = (office: string, date: string, time: string, supportingDocUri?: string) => {
    const newAppointment: AppointmentType = {
      id: Math.random().toString(36).substring(2, 9).toUpperCase(),
      office,
      date,
      time,
      type: 'Biometric & Document verification',
      supportingDocUri,
    };
    setAppointments([newAppointment, ...appointments]);
  };

  const deleteAppointment = (id: string) => {
    setAppointments(appointments.filter(appt => appt.id !== id));
  };

  const updateAppointment = (id: string, updated: Partial<AppointmentType>) => {
    setAppointments(appointments.map(appt => appt.id === id ? { ...appt, ...updated } : appt));
  };

  const uploadPassportPic = (uri: string) => {
    setPassportPicUri(uri);
  };

  const uploadGhanaCardFront = (uri: string) => {
    setGhanaCardFrontUri(uri);
  };

  const uploadGhanaCardBack = (uri: string) => {
    setGhanaCardBackUri(uri);
  };

  return (
    <AppContext.Provider
      value={{
        user,
        login,
        logout,
        registerUser,
        activeCase,
        setActiveCase,
        appointments,
        bookAppointment,
        deleteAppointment,
        updateAppointment,
        passportPicUri,
        uploadPassportPic,
        ghanaCardFrontUri,
        uploadGhanaCardFront,
        ghanaCardBackUri,
        uploadGhanaCardBack,
        biometricsVerified,
        setBiometricsVerified,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}
