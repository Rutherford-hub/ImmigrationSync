import { Platform } from 'react-native';

// Switch this to true when Spring Boot backend is running!
export const USE_BACKEND = true;

// NOTE: your AuthController is mapped to /api/v1/auth, not /api/auth — this was the
// #1 reason nothing worked. Base URL now includes /v1.
export const BACKEND_URL = Platform.select({
  ios: 'http://localhost:8080/api/v1',
  android: 'http://10.0.2.2:8080/api/v1',
  default: 'http://localhost:8080/api/v1',
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
}

// In-memory JWT store. Swap this for @react-native-async-storage/async-storage
// if you want the session to survive an app restart — see note at bottom of file.
let currentToken: string | null = null;

export function getAuthToken(): string | null {
  return currentToken;
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
          email: cleanEmail,
          password,
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

      // TODO: once you confirm the User-service profile endpoint (e.g. GET /api/v1/users/me
      // with `Authorization: Bearer ${data.token}`), replace this block with a real fetch
      // for name / appId / ghanaCard / age / avatar / isVerified. Right now AuthResponse only
      // returns { token, username, roles }, so we fill the rest from what the person typed
      // client-side as a stopgap — it will NOT reflect the true database record.
      const fallbackAppId = 'GHA-APP-' + Math.floor(100000 + Math.random() * 900000);
      return {
        name: name || data.email,
        appId: fallbackAppId,
        email: cleanEmail,
        ghanaCard: extra?.ghanaCard || 'GHA-000000000-0',
        age: extra?.age,
        isVerified: true,
        avatar: '',
        role: mapRoles(data.roles),
      };
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
        return fallbackUser;
      }
      return user;
    }
  },

  logout() {
    currentToken = null;
  },
};

/**
 * PERSISTING THE SESSION ACROSS APP RESTARTS
 * Right now `currentToken` lives only in memory — closing the app logs the user out.
 * To persist it:
 *   npx expo install @react-native-async-storage/async-storage
 * Then swap the in-memory variable for AsyncStorage.getItem/setItem('auth_token', ...).
 * Ask me and I'll wire this in once the rest of auth is confirmed working end-to-end.
 */