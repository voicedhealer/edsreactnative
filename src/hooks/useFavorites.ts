import { useInfiniteQuery, useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient, getApiError } from '@services/apiClient';
import { API_ENDPOINTS } from '@constants';
import { useAuthStore } from '@store';
import type { Favorite, PaginatedResponse } from '@types';

// Query keys
export const favoriteKeys = {
  all: ['favorites'] as const,
  lists: () => [...favoriteKeys.all, 'list'] as const,
  list: (userId: string) => [...favoriteKeys.lists(), userId] as const,
  details: () => [...favoriteKeys.all, 'detail'] as const,
  detail: (id: string) => [...favoriteKeys.details(), id] as const,
  check: (type: string, id: string) => [...favoriteKeys.all, 'check', type, id] as const,
};

/**
 * Hook pour récupérer les favoris d'un utilisateur avec pagination infinie
 */
export const useFavorites = (userId?: string) => {
  const { user } = useAuthStore();
  const targetUserId = userId || user?.id;

  return useInfiniteQuery({
    queryKey: favoriteKeys.list(targetUserId || ''),
    queryFn: async ({ pageParam = 1 }) => {
      if (!targetUserId) {
        throw new Error('User ID is required');
      }
      const { data } = await apiClient.get<PaginatedResponse<Favorite>>(
        API_ENDPOINTS.FAVORITES.BY_USER(targetUserId),
        {
          params: {
            page: pageParam,
            limit: 20,
          },
        }
      );
      return data;
    },
    getNextPageParam: (lastPage, allPages) => {
      if (lastPage.hasMore) {
        return allPages.length + 1;
      }
      return undefined;
    },
    initialPageParam: 1,
    enabled: !!targetUserId,
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
};

/**
 * Hook pour vérifier si un établissement ou événement est en favoris
 */
export const useIsFavorite = (type: 'establishment' | 'event', id: string) => {
  const { user } = useAuthStore();

  return useQuery({
    queryKey: favoriteKeys.check(type, id),
    queryFn: async () => {
      const { data } = await apiClient.get<{ isFavorite: boolean }>(
        API_ENDPOINTS.FAVORITES.CHECK(type, id)
      );
      return data.isFavorite;
    },
    enabled: !!user && !!id,
    staleTime: 1 * 60 * 1000, // 1 minute
  });
};

/**
 * Hook pour ajouter un favori
 */
export const useAddFavorite = () => {
  const queryClient = useQueryClient();
  const { user } = useAuthStore();

  return useMutation({
    mutationFn: async ({
      establishmentId,
      eventId,
    }: {
      establishmentId?: string;
      eventId?: string;
    }) => {
      const { data } = await apiClient.post<Favorite>(API_ENDPOINTS.FAVORITES.ADD, {
        establishmentId,
        eventId,
      });
      return data;
    },
    onSuccess: (data, variables) => {
      // Invalider la liste des favoris
      if (user?.id) {
        queryClient.invalidateQueries({ queryKey: favoriteKeys.list(user.id) });
      }
      // Mettre à jour le statut de favori
      if (variables.establishmentId) {
        queryClient.setQueryData(
          favoriteKeys.check('establishment', variables.establishmentId),
          true
        );
      }
      if (variables.eventId) {
        queryClient.setQueryData(favoriteKeys.check('event', variables.eventId), true);
      }
    },
    onError: error => {
      const apiError = getApiError(error);
      throw apiError;
    },
  });
};

/**
 * Hook pour supprimer un favori
 */
export const useRemoveFavorite = () => {
  const queryClient = useQueryClient();
  const { user } = useAuthStore();

  return useMutation({
    mutationFn: async (favoriteId: string) => {
      await apiClient.delete(API_ENDPOINTS.FAVORITES.REMOVE(favoriteId));
      return { id: favoriteId };
    },
    onSuccess: (_, favoriteId) => {
      // Invalider la liste des favoris
      if (user?.id) {
        queryClient.invalidateQueries({ queryKey: favoriteKeys.list(user.id) });
      }
      // Supprimer de la cache
      queryClient.removeQueries({ queryKey: favoriteKeys.detail(favoriteId) });
    },
    onError: error => {
      const apiError = getApiError(error);
      throw apiError;
    },
  });
};

/**
 * Hook pour toggle un favori (ajouter ou supprimer)
 */
export const useToggleFavorite = () => {
  const addFavorite = useAddFavorite();
  const removeFavorite = useRemoveFavorite();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      type,
      id,
      favoriteId,
      isCurrentlyFavorite,
    }: {
      type: 'establishment' | 'event';
      id: string;
      favoriteId?: string;
      isCurrentlyFavorite: boolean;
    }) => {
      if (isCurrentlyFavorite && favoriteId) {
        await removeFavorite.mutateAsync(favoriteId);
        return { isFavorite: false };
      } else {
        const data =
          type === 'establishment'
            ? await addFavorite.mutateAsync({ establishmentId: id })
            : await addFavorite.mutateAsync({ eventId: id });
        return { isFavorite: true, favoriteId: data.id };
      }
    },
    onSuccess: (data, variables) => {
      // Mettre à jour le statut de favori immédiatement
      queryClient.setQueryData(favoriteKeys.check(variables.type, variables.id), data.isFavorite);
    },
  });
};
