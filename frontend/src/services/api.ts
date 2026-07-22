import { Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Switch this to true when Spring Boot backend is running!
export const USE_BACKEND = false;

// NOTE: your AuthController is mapped to /api/v1/auth, not /api/auth — this was the
// #1 reason nothing worked. Base URL now includes /v1.
export const BACKEND_URL = Platform.select({
  ios: 'http://172.20.10.2:8080/api/v1',
  android: 'http://10.0.2.2:8080/api/v1',
  default: 'http://172.20.10.2:8080/api/v1',
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

// Shape actually returned by AuthController#login -> AuthResponse(token, email, roles)
interface BackendAuthResponse {
  token: string;
  email: string;
  roles: string[];
  name: string;
  appId: string;
  phone?: string;
  ghanaCard?: string;
  age?: number;
  isVerified: boolean;
  avatar?: string;
}

let currentToken: string | null = null;

export function getAuthToken(): string | null {
  return currentToken;
}

export function setMemoryAuthToken(token: string | null) {
  currentToken = token;
}

function mapRoles(roles: string[]): ApiUser['role'] {
  if (roles?.some((r) => r.includes('ADMIN'))) return 'admin';
  if (roles?.some((r) => r.includes('OFFICER'))) return 'officer';
  return 'applicant';
}

// In-memory store representing database for live update mock flow (used when USE_BACKEND = false)
const mockUsers: Record<string, ApiUser> = {};

export const apiService = {
  async register(
    name: string,
    email: string,
    password?: string,
    ghanaCard?: string,
    age?: number
  ): Promise<ApiUser> {
    const cleanEmail = email.trim().toLowerCase();
    const cleanGhanaCard = ghanaCard?.trim().toUpperCase() || 'GHA-000000000-0';

    if (USE_BACKEND) {
      // Your RegisterRequest DTO (as seen in AuthService.register) only reads
      // username/email/password. There's currently no backend field for name,
      // ghanaCard, or age — sending them is harmless (Jackson ignores unknown
      // JSON fields by default) but they will NOT be persisted until the DTO
      // and User entity are extended. Flagging this so it's not a silent surprise.
      const response = await fetch(`${BACKEND_URL}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: name,
          email: cleanEmail,
          password: password,
          ghanaCard: cleanGhanaCard,
          age: age
        }),
      });

      if (!response.ok) {
        const errorText = await response.text().catch(() => 'Registration failed');
        throw new Error(errorText || 'Registration failed');
      }

      // AuthController#register currently returns a plain success string, not a user object.
      // So immediately log in to get a token + then build the ApiUser client-side from what
      // the person entered, until a /users/me profile endpoint is confirmed (see TODO below).
      return apiService.login(cleanEmail, name, password, { ghanaCard: cleanGhanaCard, age });
    } else {
      // Mock live database update
      await new Promise((resolve) => setTimeout(resolve, 800));
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

  async login(
    email: string,
    name?: string,
    password?: string,
    extra?: { ghanaCard?: string; age?: number }
  ): Promise<ApiUser> {
    const cleanEmail = email.trim().toLowerCase();

    if (USE_BACKEND) {
      const response = await fetch(`${BACKEND_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: cleanEmail,
          password,
        }),
      });

      if (!response.ok) {
        const errorText = await response.text().catch(() => 'Invalid email or password');
        throw new Error(errorText || 'Invalid email or password');
      }

      const data: BackendAuthResponse = await response.json();
      currentToken = data.token;

      const apiUser = {
        name: data.name,
        appId: data.appId,
        email: data.email,
        phone: data.phone,
        ghanaCard: data.ghanaCard,
        age: data.age,
        isVerified: data.isVerified,
        avatar: data.avatar || '',
        role: mapRoles(data.roles),
      };
      
      await AsyncStorage.setItem('auth_token', data.token);
      await AsyncStorage.setItem('auth_user', JSON.stringify(apiUser));
      
      return apiUser;
    } else {
      await new Promise((resolve) => setTimeout(resolve, 800));
      const user = mockUsers[cleanEmail];
      if (!user) {
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
        await AsyncStorage.setItem('auth_token', 'mock_token');
        await AsyncStorage.setItem('auth_user', JSON.stringify(fallbackUser));
        return fallbackUser;
      }
      await AsyncStorage.setItem('auth_token', 'mock_token');
      await AsyncStorage.setItem('auth_user', JSON.stringify(user));
      return user;
    }
  },

  async forgotPassword(identifier: string): Promise<string> {
    if (USE_BACKEND) {
      const response = await fetch(`${BACKEND_URL}/auth/forgot-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ identifier }),
      });
      if (!response.ok) {
        const err = await response.text().catch(() => 'Failed to send reset code');
        throw new Error(err || 'Failed to send reset code');
      }
      return await response.text();
    } else {
      await new Promise((resolve) => setTimeout(resolve, 800));
      return "Mock OTP sent";
    }
  },

  async verifyOtp(identifier: string, otp: string): Promise<string> {
    if (USE_BACKEND) {
      const response = await fetch(`${BACKEND_URL}/auth/verify-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ identifier, otp }),
      });
      if (!response.ok) {
        const err = await response.text().catch(() => 'Invalid OTP');
        throw new Error(err || 'Invalid OTP');
      }
      return await response.text();
    } else {
      await new Promise((resolve) => setTimeout(resolve, 800));
      if (otp !== '123456') throw new Error("Mock invalid OTP");
      return "Mock OTP verified";
    }
  },

  async resetPassword(identifier: string, otp: string, newPassword: string): Promise<string> {
    if (USE_BACKEND) {
      const response = await fetch(`${BACKEND_URL}/auth/reset-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ identifier, otp, newPassword }),
      });
      if (!response.ok) {
        const err = await response.text().catch(() => 'Password reset failed');
        throw new Error(err || 'Password reset failed');
      }
      return await response.text();
    } else {
      await new Promise((resolve) => setTimeout(resolve, 800));
      return "Mock Password reset";
    }
  },

  async logout() {
    currentToken = null;
    await AsyncStorage.removeItem('auth_token');
    await AsyncStorage.removeItem('auth_user');
  },
};