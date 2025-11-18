// Configuration des URLs API backend

const API_BASE_URL: string =
  (process.env.EXPO_PUBLIC_API_BASE_URL as string) || 'https://api.example.com';

export const API_ENDPOINTS = {
  // Authentification
  AUTH: {
    LOGIN: `${API_BASE_URL}/auth/login`,
    REGISTER: `${API_BASE_URL}/auth/register`,
    LOGOUT: `${API_BASE_URL}/auth/logout`,
    REFRESH: `${API_BASE_URL}/auth/refresh`,
    PROFILE: `${API_BASE_URL}/auth/profile`,
  },

  // Utilisateurs
  USERS: {
    BASE: `${API_BASE_URL}/users`,
    BY_ID: (id: string) => `${API_BASE_URL}/users/${id}`,
    UPDATE: (id: string) => `${API_BASE_URL}/users/${id}`,
    DELETE: (id: string) => `${API_BASE_URL}/users/${id}`,
  },

  // Ajoutez vos endpoints ici
};

export const API_CONFIG: {
  BASE_URL: string;
  TIMEOUT: number;
  HEADERS: {
    'Content-Type': string;
    Accept: string;
  };
} = {
  BASE_URL: API_BASE_URL,
  TIMEOUT: 30000, // 30 secondes
  HEADERS: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
};
