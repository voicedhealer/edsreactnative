import { useInfiniteQuery, useQuery } from '@tanstack/react-query';
import { apiClient } from '@services/apiClient';
import { API_ENDPOINTS } from '@constants';
import type { Establishment, Event, PaginatedResponse, SearchParams } from '@types';

// Query keys
export const searchKeys = {
  all: ['search'] as const,
  establishments: (params: string) => [...searchKeys.all, 'establishments', params] as const,
  events: (params: string) => [...searchKeys.all, 'events', params] as const,
  all: (params: string) => [...searchKeys.all, 'all', params] as const,
};

/**
 * Hook pour rechercher des établissements avec pagination infinie
 */
export const useSearchEstablishments = (params: SearchParams) => {
  return useInfiniteQuery({
    queryKey: searchKeys.establishments(JSON.stringify(params)),
    queryFn: async ({ pageParam = 1 }) => {
      const { data } = await apiClient.get<PaginatedResponse<Establishment>>(
        API_ENDPOINTS.SEARCH.ESTABLISHMENTS,
        {
          params: {
            ...params,
            page: pageParam,
            limit: params.limit || 20,
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
    enabled: !!params.query || Object.keys(params).length > 0,
    staleTime: 1 * 60 * 1000, // 1 minute
  });
};

/**
 * Hook pour rechercher des événements avec pagination infinie
 */
export const useSearchEvents = (params: SearchParams) => {
  return useInfiniteQuery({
    queryKey: searchKeys.events(JSON.stringify(params)),
    queryFn: async ({ pageParam = 1 }) => {
      const { data } = await apiClient.get<PaginatedResponse<Event>>(API_ENDPOINTS.SEARCH.EVENTS, {
        params: {
          ...params,
          page: pageParam,
          limit: params.limit || 20,
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
    enabled: !!params.query || Object.keys(params).length > 0,
    staleTime: 1 * 60 * 1000, // 1 minute
  });
};

/**
 * Hook pour rechercher établissements et événements ensemble
 */
export const useSearchAll = (params: SearchParams) => {
  return useQuery({
    queryKey: searchKeys.all(JSON.stringify(params)),
    queryFn: async () => {
      const { data } = await apiClient.get<{
        establishments: PaginatedResponse<Establishment>;
        events: PaginatedResponse<Event>;
      }>(API_ENDPOINTS.SEARCH.ALL, {
        params: {
          ...params,
          limit: params.limit || 10,
        },
      });
      return data;
    },
    enabled: !!params.query || Object.keys(params).length > 0,
    staleTime: 1 * 60 * 1000, // 1 minute
  });
};
