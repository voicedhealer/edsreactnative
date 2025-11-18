import { useInfiniteQuery, useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient, getApiError } from '@services/apiClient';
import { API_ENDPOINTS } from '@constants';
import type { Event, PaginatedResponse, SearchFilters } from '@types';

// Query keys
export const eventKeys = {
  all: ['events'] as const,
  lists: () => [...eventKeys.all, 'list'] as const,
  list: (filters: string) => [...eventKeys.lists(), { filters }] as const,
  details: () => [...eventKeys.all, 'detail'] as const,
  detail: (id: string) => [...eventKeys.details(), id] as const,
  upcoming: () => [...eventKeys.all, 'upcoming'] as const,
  byEstablishment: (id: string) => [...eventKeys.all, 'establishment', id] as const,
};

/**
 * Hook pour récupérer un événement par ID
 */
export const useEvent = (id: string) => {
  return useQuery({
    queryKey: eventKeys.detail(id),
    queryFn: async () => {
      const { data } = await apiClient.get<Event>(API_ENDPOINTS.EVENTS.BY_ID(id));
      return data;
    },
    enabled: !!id,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

/**
 * Hook pour récupérer la liste paginée infinie des événements
 */
export const useEvents = (filters?: SearchFilters) => {
  return useInfiniteQuery({
    queryKey: eventKeys.list(JSON.stringify(filters || {})),
    queryFn: async ({ pageParam = 1 }) => {
      const { data } = await apiClient.get<PaginatedResponse<Event>>(API_ENDPOINTS.EVENTS.BASE, {
        params: {
          ...filters,
          page: pageParam,
          limit: 20,
        },
      });
      return data;
    },
    getNextPageParam: (lastPage, allPages) => {
      if (lastPage.hasMore) {
        return allPages.length + 1;
      }
      return undefined;
    },
    initialPageParam: 1,
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
};

/**
 * Hook pour rechercher des événements avec pagination infinie
 */
export const useSearchEvents = (filters: SearchFilters) => {
  return useInfiniteQuery({
    queryKey: [...eventKeys.lists(), 'search', JSON.stringify(filters)],
    queryFn: async ({ pageParam = 1 }) => {
      const { data } = await apiClient.get<PaginatedResponse<Event>>(API_ENDPOINTS.EVENTS.SEARCH, {
        params: {
          ...filters,
          page: pageParam,
          limit: 20,
        },
      });
      return data;
    },
    getNextPageParam: (lastPage, allPages) => {
      if (lastPage.hasMore) {
        return allPages.length + 1;
      }
      return undefined;
    },
    initialPageParam: 1,
    enabled: !!filters.query || Object.keys(filters).length > 0,
    staleTime: 1 * 60 * 1000, // 1 minute pour les recherches
  });
};

/**
 * Hook pour récupérer les événements à venir
 */
export const useUpcomingEvents = () => {
  return useInfiniteQuery({
    queryKey: eventKeys.upcoming(),
    queryFn: async ({ pageParam = 1 }) => {
      const { data } = await apiClient.get<PaginatedResponse<Event>>(
        API_ENDPOINTS.EVENTS.UPCOMING,
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
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
};

/**
 * Hook pour récupérer les événements d'un établissement
 */
export const useEventsByEstablishment = (establishmentId: string) => {
  return useInfiniteQuery({
    queryKey: eventKeys.byEstablishment(establishmentId),
    queryFn: async ({ pageParam = 1 }) => {
      const { data } = await apiClient.get<PaginatedResponse<Event>>(
        API_ENDPOINTS.EVENTS.BY_ESTABLISHMENT(establishmentId),
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
    enabled: !!establishmentId,
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
};
