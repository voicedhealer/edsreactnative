import { useInfiniteQuery, useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient, getApiError } from '@services/apiClient';
import { API_ENDPOINTS } from '@constants';
import type { Establishment, PaginatedResponse, SearchFilters } from '@types';

// Query keys
export const establishmentKeys = {
  all: ['establishments'] as const,
  lists: () => [...establishmentKeys.all, 'list'] as const,
  list: (filters: string) => [...establishmentKeys.lists(), { filters }] as const,
  details: () => [...establishmentKeys.all, 'detail'] as const,
  detail: (id: string) => [...establishmentKeys.details(), id] as const,
  popular: () => [...establishmentKeys.all, 'popular'] as const,
  nearby: (lat: number, lng: number) => [...establishmentKeys.all, 'nearby', lat, lng] as const,
};

/**
 * Hook pour récupérer un établissement par ID
 */
export const useEstablishment = (id: string) => {
  return useQuery({
    queryKey: establishmentKeys.detail(id),
    queryFn: async () => {
      const { data } = await apiClient.get<Establishment>(API_ENDPOINTS.ESTABLISHMENTS.BY_ID(id));
      return data;
    },
    enabled: !!id,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

/**
 * Hook pour récupérer la liste paginée infinie des établissements
 */
export const useEstablishments = (filters?: SearchFilters) => {
  return useInfiniteQuery({
    queryKey: establishmentKeys.list(JSON.stringify(filters || {})),
    queryFn: async ({ pageParam = 1 }) => {
      const { data } = await apiClient.get<PaginatedResponse<Establishment>>(
        API_ENDPOINTS.ESTABLISHMENTS.BASE,
        {
          params: {
            ...filters,
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
 * Hook pour rechercher des établissements avec pagination infinie
 */
export const useSearchEstablishments = (filters: SearchFilters) => {
  return useInfiniteQuery({
    queryKey: [...establishmentKeys.lists(), 'search', JSON.stringify(filters)],
    queryFn: async ({ pageParam = 1 }) => {
      const { data } = await apiClient.get<PaginatedResponse<Establishment>>(
        API_ENDPOINTS.ESTABLISHMENTS.SEARCH,
        {
          params: {
            ...filters,
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
    enabled: !!filters.query || Object.keys(filters).length > 0,
    staleTime: 1 * 60 * 1000, // 1 minute pour les recherches
  });
};

/**
 * Hook pour récupérer les établissements populaires
 */
export const usePopularEstablishments = (limit = 10) => {
  return useQuery({
    queryKey: [...establishmentKeys.popular(), limit],
    queryFn: async () => {
      const { data } = await apiClient.get<Establishment[]>(API_ENDPOINTS.ESTABLISHMENTS.POPULAR, {
        params: { limit },
      });
      return data;
    },
    staleTime: 10 * 60 * 1000, // 10 minutes
  });
};

/**
 * Hook pour récupérer les établissements à proximité
 */
export const useNearbyEstablishments = (
  latitude: number,
  longitude: number,
  radius = 5, // km
  enabled = true
) => {
  return useInfiniteQuery({
    queryKey: establishmentKeys.nearby(latitude, longitude),
    queryFn: async ({ pageParam = 1 }) => {
      const { data } = await apiClient.get<PaginatedResponse<Establishment>>(
        API_ENDPOINTS.ESTABLISHMENTS.NEARBY,
        {
          params: {
            latitude,
            longitude,
            radius,
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
    enabled: enabled && !!latitude && !!longitude,
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
};
