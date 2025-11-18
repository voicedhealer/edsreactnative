import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient, getApiError } from '../apiClient';
import { API_ENDPOINTS } from '@constants';
import type { User, LoginCredentials, RegisterData } from '@types';
import { useAuthStore } from '@store';

// Types pour les réponses API
interface LoginResponse {
  user: User;
  token: string;
}

interface RegisterResponse {
  user: User;
  message: string;
}

// Query keys
export const authKeys = {
  all: ['auth'] as const,
  profile: () => [...authKeys.all, 'profile'] as const,
};

/**
 * Hook pour récupérer le profil utilisateur
 */
export const useUserProfile = () => {
  const { session } = useAuthStore();

  return useQuery({
    queryKey: authKeys.profile(),
    queryFn: async () => {
      const { data } = await apiClient.get<User>(API_ENDPOINTS.AUTH.PROFILE);
      return data;
    },
    enabled: !!session, // Seulement si l'utilisateur est connecté
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

/**
 * Hook pour la mutation de login
 */
export const useLogin = () => {
  const queryClient = useQueryClient();
  const { login } = useAuthStore();

  return useMutation({
    mutationFn: async (credentials: LoginCredentials) => {
      // Utiliser le store auth au lieu de l'API directement
      await login(credentials.email, credentials.password);
      return { success: true };
    },
    onSuccess: () => {
      // Invalider les queries après login réussi
      queryClient.invalidateQueries({ queryKey: authKeys.all });
    },
    onError: error => {
      const apiError = getApiError(error);
      throw apiError;
    },
  });
};

/**
 * Hook pour la mutation de register
 */
export const useRegister = () => {
  const queryClient = useQueryClient();
  const { register } = useAuthStore();

  return useMutation({
    mutationFn: async (data: RegisterData) => {
      // Utiliser le store auth au lieu de l'API directement
      await register(data);
      return { success: true };
    },
    onSuccess: () => {
      // Invalider les queries après register réussi
      queryClient.invalidateQueries({ queryKey: authKeys.all });
    },
    onError: error => {
      const apiError = getApiError(error);
      throw apiError;
    },
  });
};

/**
 * Hook pour la mutation de logout
 */
export const useLogout = () => {
  const queryClient = useQueryClient();
  const { logout } = useAuthStore();

  return useMutation({
    mutationFn: async () => {
      await logout();
      return { success: true };
    },
    onSuccess: () => {
      // Nettoyer toutes les queries après logout
      queryClient.clear();
    },
    onError: error => {
      const apiError = getApiError(error);
      throw apiError;
    },
  });
};
