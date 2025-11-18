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
 * Hook pour ajouter un favori avec optimistic updates
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
      return { data, establishmentId, eventId };
    },
    onMutate: async ({ establishmentId, eventId }) => {
      // Annuler les requêtes en cours pour éviter les conflits
      const type = establishmentId ? 'establishment' : 'event';
      const id = establishmentId || eventId || '';
      
      await queryClient.cancelQueries({ queryKey: favoriteKeys.check(type, id) });
      await queryClient.cancelQueries({ queryKey: favoriteKeys.list(user?.id || '') });

      // Snapshot de la valeur précédente
      const previousCheck = queryClient.getQueryData(favoriteKeys.check(type, id));
      const previousList = queryClient.getQueryData(favoriteKeys.list(user?.id || ''));

      // Optimistic update : mettre à jour immédiatement
      queryClient.setQueryData(favoriteKeys.check(type, id), true);

      // Optimistic update de la liste des favoris
      if (user?.id && previousList) {
        const optimisticFavorite: Favorite = {
          id: `temp-${Date.now()}`,
          userId: user.id,
          establishmentId,
          eventId,
          createdAt: new Date().toISOString(),
        };

        queryClient.setQueryData(favoriteKeys.list(user.id), (old: any) => {
          if (!old) return old;
          return {
            ...old,
            pages: old.pages.map((page: any, index: number) => {
              if (index === 0) {
                return {
                  ...page,
                  data: [optimisticFavorite, ...page.data],
                };
              }
              return page;
            }),
          };
        });
      }

      return { previousCheck, previousList };
    },
    onError: (error, variables, context) => {
      // Rollback en cas d'erreur
      const type = variables.establishmentId ? 'establishment' : 'event';
      const id = variables.establishmentId || variables.eventId || '';

      if (context?.previousCheck) {
        queryClient.setQueryData(favoriteKeys.check(type, id), context.previousCheck);
      }
      if (context?.previousList && user?.id) {
        queryClient.setQueryData(favoriteKeys.list(user.id), context.previousList);
      }

      const apiError = getApiError(error);
      throw apiError;
    },
    onSuccess: (data, variables) => {
      // Invalider pour récupérer les vraies données
      if (user?.id) {
        queryClient.invalidateQueries({ queryKey: favoriteKeys.list(user.id) });
      }
      const type = variables.establishmentId ? 'establishment' : 'event';
      const id = variables.establishmentId || variables.eventId || '';
      queryClient.invalidateQueries({ queryKey: favoriteKeys.check(type, id) });
    },
  });
};

/**
 * Hook pour supprimer un favori avec optimistic updates
 */
export const useRemoveFavorite = () => {
  const queryClient = useQueryClient();
  const { user } = useAuthStore();

  return useMutation({
    mutationFn: async ({
      favoriteId,
      establishmentId,
      eventId,
    }: {
      favoriteId: string;
      establishmentId?: string;
      eventId?: string;
    }) => {
      await apiClient.delete(API_ENDPOINTS.FAVORITES.REMOVE(favoriteId));
      return { favoriteId, establishmentId, eventId };
    },
    onMutate: async ({ favoriteId, establishmentId, eventId }) => {
      // Annuler les requêtes en cours
      const type = establishmentId ? 'establishment' : 'event';
      const id = establishmentId || eventId || '';

      await queryClient.cancelQueries({ queryKey: favoriteKeys.check(type, id) });
      await queryClient.cancelQueries({ queryKey: favoriteKeys.list(user?.id || '') });

      // Snapshot de la valeur précédente
      const previousCheck = queryClient.getQueryData(favoriteKeys.check(type, id));
      const previousList = queryClient.getQueryData(favoriteKeys.list(user?.id || ''));

      // Optimistic update : mettre à jour immédiatement
      queryClient.setQueryData(favoriteKeys.check(type, id), false);

      // Optimistic update de la liste : supprimer le favori
      if (user?.id && previousList) {
        queryClient.setQueryData(favoriteKeys.list(user.id), (old: any) => {
          if (!old) return old;
          return {
            ...old,
            pages: old.pages.map((page: any) => ({
              ...page,
              data: page.data.filter((fav: Favorite) => fav.id !== favoriteId),
            })),
          };
        });
      }

      return { previousCheck, previousList };
    },
    onError: (error, variables, context) => {
      // Rollback en cas d'erreur
      const type = variables.establishmentId ? 'establishment' : 'event';
      const id = variables.establishmentId || variables.eventId || '';

      if (context?.previousCheck) {
        queryClient.setQueryData(favoriteKeys.check(type, id), context.previousCheck);
      }
      if (context?.previousList && user?.id) {
        queryClient.setQueryData(favoriteKeys.list(user.id), context.previousList);
      }

      const apiError = getApiError(error);
      throw apiError;
    },
    onSuccess: (_, variables) => {
      // Invalider pour récupérer les vraies données
      if (user?.id) {
        queryClient.invalidateQueries({ queryKey: favoriteKeys.list(user.id) });
      }
      const type = variables.establishmentId ? 'establishment' : 'event';
      const id = variables.establishmentId || variables.eventId || '';
      queryClient.invalidateQueries({ queryKey: favoriteKeys.check(type, id) });
      queryClient.removeQueries({ queryKey: favoriteKeys.detail(variables.favoriteId) });
    },
  });
};

/**
 * Hook pour toggle un favori (ajouter ou supprimer) avec optimistic updates
 */
export const useToggleFavorite = () => {
  const addFavorite = useAddFavorite();
  const removeFavorite = useRemoveFavorite();
  const queryClient = useQueryClient();
  const { user } = useAuthStore();

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
        const result = await removeFavorite.mutateAsync({
          favoriteId,
          establishmentId: type === 'establishment' ? id : undefined,
          eventId: type === 'event' ? id : undefined,
        });
        return { isFavorite: false, favoriteId: undefined };
      } else {
        const result =
          type === 'establishment'
            ? await addFavorite.mutateAsync({ establishmentId: id })
            : await addFavorite.mutateAsync({ eventId: id });
        return { isFavorite: true, favoriteId: result.data.id };
      }
    },
    onMutate: async ({ type, id, isCurrentlyFavorite }) => {
      // Annuler les requêtes en cours
      await queryClient.cancelQueries({ queryKey: favoriteKeys.check(type, id) });
      await queryClient.cancelQueries({ queryKey: favoriteKeys.list(user?.id || '') });

      // Snapshot
      const previousCheck = queryClient.getQueryData(favoriteKeys.check(type, id));
      const previousList = queryClient.getQueryData(favoriteKeys.list(user?.id || ''));

      // Optimistic update
      queryClient.setQueryData(favoriteKeys.check(type, id), !isCurrentlyFavorite);

      return { previousCheck, previousList };
    },
    onError: (error, variables, context) => {
      // Rollback
      if (context?.previousCheck) {
        queryClient.setQueryData(
          favoriteKeys.check(variables.type, variables.id),
          context.previousCheck
        );
      }
      if (context?.previousList && user?.id) {
        queryClient.setQueryData(favoriteKeys.list(user.id), context.previousList);
      }
    },
    onSuccess: (data, variables) => {
      // Invalider pour synchroniser avec le backend
      queryClient.invalidateQueries({ queryKey: favoriteKeys.check(variables.type, variables.id) });
      if (user?.id) {
        queryClient.invalidateQueries({ queryKey: favoriteKeys.list(user.id) });
      }
    },
  });
};
