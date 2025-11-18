// Configuration des URLs API backend

const API_BASE_URL: string =
  (process.env.EXPO_PUBLIC_API_BASE_URL as string) || 'https://envie2sortir.railway.app/api';

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

  // Établissements
  ESTABLISHMENTS: {
    BASE: `${API_BASE_URL}/establishments`,
    BY_ID: (id: string) => `${API_BASE_URL}/establishments/${id}`,
    SEARCH: `${API_BASE_URL}/establishments/search`,
    POPULAR: `${API_BASE_URL}/establishments/popular`,
    NEARBY: `${API_BASE_URL}/establishments/nearby`,
  },

  // Événements
  EVENTS: {
    BASE: `${API_BASE_URL}/events`,
    BY_ID: (id: string) => `${API_BASE_URL}/events/${id}`,
    SEARCH: `${API_BASE_URL}/events/search`,
    UPCOMING: `${API_BASE_URL}/events/upcoming`,
    BY_ESTABLISHMENT: (id: string) => `${API_BASE_URL}/events/establishment/${id}`,
    ENGAGE: (id: string) => `${API_BASE_URL}/events/${id}/engage`,
    ENGAGEMENT_STATS: (id: string) => `${API_BASE_URL}/events/${id}/engage`,
  },

  // Favoris
  FAVORITES: {
    BASE: `${API_BASE_URL}/favorites`,
    BY_USER: (userId: string) => `${API_BASE_URL}/favorites/user/${userId}`,
    ADD: `${API_BASE_URL}/favorites`,
    REMOVE: (id: string) => `${API_BASE_URL}/favorites/${id}`,
    CHECK: (type: 'establishment' | 'event', id: string) =>
      `${API_BASE_URL}/favorites/check/${type}/${id}`,
  },

  // Recherche
  SEARCH: {
    BASE: `${API_BASE_URL}/search`,
    ESTABLISHMENTS: `${API_BASE_URL}/search/establishments`,
    EVENTS: `${API_BASE_URL}/search/events`,
    ALL: `${API_BASE_URL}/search/all`,
  },

  // Gamification
  GAMIFICATION: {
    BASE: `${API_BASE_URL}/user/gamification`,
  },

  // Notifications
  NOTIFICATIONS: {
    REGISTER_TOKEN: `${API_BASE_URL}/notifications/register`,
    UNREGISTER_TOKEN: `${API_BASE_URL}/notifications/unregister`,
    UPDATE_TOKEN: `${API_BASE_URL}/notifications/update`,
  },
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
