import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient, getApiError } from '../apiClient';
import { API_ENDPOINTS } from '@constants';
import type { User } from '@types';

// Query keys
export const userKeys = {
  all: ['users'] as const,
  lists: () => [...userKeys.all, 'list'] as const,
  list: (filters: string) => [...userKeys.lists(), { filters }] as const,
  details: () => [...userKeys.all, 'detail'] as const,
  detail: (id: string) => [...userKeys.details(), id] as const,
};

/**
 * Hook pour récupérer un utilisateur par ID
 */
export const useUser = (id: string) => {
  return useQuery({
    queryKey: userKeys.detail(id),
    queryFn: async () => {
      const { data } = await apiClient.get<User>(API_ENDPOINTS.USERS.BY_ID(id));
      return data;
    },
    enabled: !!id, // Seulement si l'ID est fourni
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

/**
 * Hook pour récupérer la liste des utilisateurs
 */
export const useUsers = (filters?: Record<string, unknown>) => {
  return useQuery({
    queryKey: userKeys.list(JSON.stringify(filters || {})),
    queryFn: async () => {
      const { data } = await apiClient.get<User[]>(API_ENDPOINTS.USERS.BASE, {
        params: filters,
      });
      return data;
    },
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
};

/**
 * Hook pour mettre à jour un utilisateur
 */
export const useUpdateUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<User> }) => {
      const response = await apiClient.put<User>(API_ENDPOINTS.USERS.UPDATE(id), data);
      return response.data;
    },
    onSuccess: (data, variables) => {
      // Mettre à jour le cache pour cet utilisateur
      queryClient.setQueryData(userKeys.detail(variables.id), data);
      // Invalider la liste pour refléter les changements
      queryClient.invalidateQueries({ queryKey: userKeys.lists() });
    },
    onError: error => {
      const apiError = getApiError(error);
      throw apiError;
    },
  });
};

/**
 * Hook pour supprimer un utilisateur
 */
export const useDeleteUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      await apiClient.delete(API_ENDPOINTS.USERS.DELETE(id));
      return { id };
    },
    onSuccess: (_, id) => {
      // Supprimer de la cache
      queryClient.removeQueries({ queryKey: userKeys.detail(id) });
      // Invalider la liste
      queryClient.invalidateQueries({ queryKey: userKeys.lists() });
    },
    onError: error => {
      const apiError = getApiError(error);
      throw apiError;
    },
  });
};
