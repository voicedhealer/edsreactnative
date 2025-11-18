import axios, { AxiosError, AxiosRequestConfig, InternalAxiosRequestConfig } from 'axios';
import { useAuthStore } from '@store';
import { TokenService } from './tokenService';
import { API_CONFIG } from '@constants';

// Créer l'instance Axios
export const apiClient = axios.create({
  baseURL: API_CONFIG.BASE_URL,
  timeout: API_CONFIG.TIMEOUT,
  headers: API_CONFIG.HEADERS,
});

// Flag pour éviter les boucles infinies de refresh
let isRefreshing = false;
let failedQueue: Array<{
  resolve: (value?: unknown) => void;
  reject: (reason?: unknown) => void;
}> = [];

const processQueue = (error: AxiosError | null, token: string | null = null) => {
  failedQueue.forEach(prom => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

// Interceptor pour ajouter le token d'authentification
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const { session } = useAuthStore.getState();
    const token = session?.access_token;

    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  error => {
    return Promise.reject(error);
  }
);

// Interceptor pour gérer les erreurs et refresh token
apiClient.interceptors.response.use(
  response => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };

    // Si l'erreur est 401 (Unauthorized) et qu'on n'a pas déjà tenté de refresh
    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        // Si un refresh est déjà en cours, mettre la requête en queue
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then(token => {
            if (originalRequest.headers && token) {
              originalRequest.headers.Authorization = `Bearer ${token}`;
            }
            return apiClient(originalRequest);
          })
          .catch(err => {
            return Promise.reject(err);
          });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        // Tenter de rafraîchir le token
        const newSession = await TokenService.refreshAccessToken();

        if (newSession?.access_token) {
          // Mettre à jour le store
          const { user, session: oldSession } = useAuthStore.getState();
          if (user && oldSession) {
            useAuthStore.setState({
              session: newSession,
            });
          }

          // Traiter la queue et retry la requête originale
          processQueue(null, newSession.access_token);
          if (originalRequest.headers) {
            originalRequest.headers.Authorization = `Bearer ${newSession.access_token}`;
          }

          return apiClient(originalRequest);
        } else {
          // Si le refresh échoue, déconnecter l'utilisateur
          processQueue(error, null);
          await useAuthStore.getState().logout();
          return Promise.reject(error);
        }
      } catch (refreshError) {
        // Si le refresh échoue, déconnecter l'utilisateur
        processQueue(refreshError as AxiosError, null);
        await useAuthStore.getState().logout();
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    // Pour les autres erreurs, rejeter directement
    return Promise.reject(error);
  }
);

// Types pour les réponses API
export interface ApiError {
  message: string;
  code?: string;
  status?: number;
}

export interface ApiResponse<T> {
  data: T;
  message?: string;
  success: boolean;
}

// Helper pour extraire les erreurs
export const getApiError = (error: unknown): ApiError => {
  if (axios.isAxiosError(error)) {
    const axiosError = error as AxiosError<{ message?: string; error?: string }>;
    return {
      message:
        axiosError.response?.data?.message ||
        axiosError.response?.data?.error ||
        axiosError.message ||
        'Une erreur est survenue',
      code: axiosError.code,
      status: axiosError.response?.status,
    };
  }

  if (error instanceof Error) {
    return {
      message: error.message,
    };
  }

  return {
    message: 'Une erreur inconnue est survenue',
  };
};
