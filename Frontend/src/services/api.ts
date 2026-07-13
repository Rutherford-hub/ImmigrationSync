import { Platform } from 'react-native';

// Switch this to true when Spring Boot backend is running!
export const USE_BACKEND = false;

export const BACKEND_URL = Platform.select({
  ios: 'http://localhost:8080/api',
  android: 'http://10.0.2.2:8080/api',
  default: 'http://localhost:8080/api',
});

export interface ApiUser {
  name: string;
  appId: string;
  email: string;
  phone?: string;
  ghanaCard?: string;
  age?: number;
  isVerified: boolean;
  avatar: string;
  role: 'applicant' | 'officer' | 'admin';
}

// In-memory store representing database for live update mock flow
const mockUsers: Record<string, ApiUser> = {};

export const apiService = {
  async register(name: string, email: string, password?: string, ghanaCard?: string, age?: number): Promise<ApiUser> {
    const cleanEmail = email.trim().toLowerCase();
    const cleanGhanaCard = ghanaCard?.trim().toUpperCase() || 'GHA-000000000-0';
    if (USE_BACKEND) {
      const response = await fetch(`${BACKEND_URL}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password, ghanaCard: cleanGhanaCard, age }),
      });
      if (!response.ok) throw new Error('Registration failed');
      return await response.json();
    } else {
      // Mock live database update
      await new Promise(resolve => setTimeout(resolve, 800));
      const uniqueAppId = 'GHA-APP-' + Math.floor(100000 + Math.random() * 900000);
      const newUser: ApiUser = {
        name: name || 'Applicant',
        appId: uniqueAppId,
        email: cleanEmail,
        ghanaCard: cleanGhanaCard,
        age: age || 25,
        isVerified: true,
        avatar: '',
        role: 'applicant',
      };
      mockUsers[cleanEmail] = newUser;
      return newUser;
    }
  },

  async login(email: string, name?: string, password?: string): Promise<ApiUser> {
    const cleanEmail = email.trim().toLowerCase();
    if (USE_BACKEND) {
      const response = await fetch(`${BACKEND_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, name, password }),
      });
      if (!response.ok) throw new Error('Login failed');
      return await response.json();
    } else {
      await new Promise(resolve => setTimeout(resolve, 800));
      const user = mockUsers[cleanEmail];
      if (!user) {
        // Fallback: if user is not found, dynamically seed them to allow smooth onboarding
        const fallbackAppId = 'GHA-APP-' + Math.floor(100000 + Math.random() * 900000);
        const fallbackUser: ApiUser = {
          name: name || 'Applicant',
          appId: fallbackAppId,
          email: cleanEmail,
          ghanaCard: 'GHA-000012345-6',
          age: 28,
          isVerified: true,
          avatar: '',
          role: 'applicant',
        };
        mockUsers[cleanEmail] = fallbackUser;
        return fallbackUser;
      }
      return user;
    }
  }
};
