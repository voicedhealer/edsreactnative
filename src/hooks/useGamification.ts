import { useQuery } from '@tanstack/react-query';
import { apiClient } from '@services/apiClient';
import { API_ENDPOINTS } from '@constants';
import { useAuthStore } from '@store';
import type { UserGamification } from '@types';

// Query keys
export const gamificationKeys = {
  all: ['gamification'] as const,
  user: (userId: string) => [...gamificationKeys.all, 'user', userId] as const,
};

/**
 * Hook pour récupérer les données de gamification d'un utilisateur
 * (badges et karma points)
 */
export const useGamification = (userId?: string) => {
  const { user } = useAuthStore();
  const targetUserId = userId || user?.id;

  return useQuery({
    queryKey: gamificationKeys.user(targetUserId || ''),
    queryFn: async () => {
      if (!targetUserId) {
        throw new Error('User ID is required');
      }
      const { data } = await apiClient.get<UserGamification>(API_ENDPOINTS.GAMIFICATION.BASE);
      return data;
    },
    enabled: !!targetUserId,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

