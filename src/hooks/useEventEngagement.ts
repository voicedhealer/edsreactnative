import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient, getApiError } from '@services/apiClient';
import { API_ENDPOINTS } from '@constants';
import { useAuthStore } from '@store';
import type { EngagementType, EventEngagement, EventBadge } from '@types';

// Query keys
export const engagementKeys = {
  all: ['engagements'] as const,
  event: (eventId: string) => [...engagementKeys.all, 'event', eventId] as const,
};

/**
 * Hook pour récupérer les statistiques d'engagement d'un événement
 */
export const useEventEngagement = (eventId: string) => {
  const { user } = useAuthStore();

  return useQuery({
    queryKey: engagementKeys.event(eventId),
    queryFn: async () => {
      const { data } = await apiClient.get<EventEngagement>(
        API_ENDPOINTS.EVENTS.ENGAGEMENT_STATS(eventId)
      );
      return data;
    },
    enabled: !!eventId,
    staleTime: 1 * 60 * 1000, // 1 minute
  });
};

/**
 * Hook pour créer ou mettre à jour un engagement avec optimistic updates
 */
export const useEngageEvent = () => {
  const queryClient = useQueryClient();
  const { user } = useAuthStore();

  return useMutation({
    mutationFn: async ({
      eventId,
      type,
    }: {
      eventId: string;
      type: EngagementType;
    }) => {
      const { data } = await apiClient.post<EventEngagement>(
        API_ENDPOINTS.EVENTS.ENGAGE(eventId),
        { type }
      );
      return data;
    },
    onMutate: async ({ eventId, type }) => {
      // Annuler les requêtes en cours
      await queryClient.cancelQueries({ queryKey: engagementKeys.event(eventId) });

      // Snapshot de la valeur précédente
      const previousEngagement = queryClient.getQueryData<EventEngagement>(
        engagementKeys.event(eventId)
      );

      // Optimistic update
      if (previousEngagement) {
        const newStats = { ...previousEngagement.stats };
        const previousType = previousEngagement.userEngagement;

        // Retirer l'ancien engagement si présent
        if (previousType && previousType !== type) {
          if (previousType === 'envie') newStats.envie = Math.max(0, newStats.envie - 1);
          if (previousType === 'grande-envie') newStats['grande-envie'] = Math.max(0, newStats['grande-envie'] - 1);
          if (previousType === 'decouvrir') newStats.decouvrir = Math.max(0, newStats.decouvrir - 1);
          if (previousType === 'pas-envie') newStats['pas-envie'] = Math.max(0, newStats['pas-envie'] - 1);
        }

        // Ajouter le nouvel engagement
        if (type === 'envie') newStats.envie += 1;
        if (type === 'grande-envie') newStats['grande-envie'] += 1;
        if (type === 'decouvrir') newStats.decouvrir += 1;
        if (type === 'pas-envie') newStats['pas-envie'] += 1;

        // Calculer le nouveau score et pourcentage
        const newScore =
          newStats.envie * 1 +
          newStats['grande-envie'] * 3 +
          newStats.decouvrir * 2 +
          newStats['pas-envie'] * -1;
        const newPercentage = Math.min((newScore / 15) * 100, 150);

        // Déterminer le badge
        const newBadge = getBadgeForPercentage(newPercentage);

        const optimisticEngagement: EventEngagement = {
          ...previousEngagement,
          stats: newStats,
          score: newScore,
          percentage: newPercentage,
          badge: newBadge,
          userEngagement: type,
          totalEngagements:
            newStats.envie +
            newStats['grande-envie'] +
            newStats.decouvrir +
            newStats['pas-envie'],
        };

        queryClient.setQueryData(engagementKeys.event(eventId), optimisticEngagement);
      }

      return { previousEngagement };
    },
    onError: (error, variables, context) => {
      // Rollback en cas d'erreur
      if (context?.previousEngagement) {
        queryClient.setQueryData(
          engagementKeys.event(variables.eventId),
          context.previousEngagement
        );
      }

      const apiError = getApiError(error);
      throw apiError;
    },
    onSuccess: (data, variables) => {
      // Invalider pour synchroniser avec le backend
      queryClient.invalidateQueries({ queryKey: engagementKeys.event(variables.eventId) });
    },
  });
};

/**
 * Fonction helper pour déterminer le badge selon le pourcentage
 */
function getBadgeForPercentage(percentage: number): EventBadge | null {
  if (percentage >= 150) {
    return {
      type: 'violet',
      label: "C'EST LE FEU !",
      color: '#9C27B0',
      emoji: '🔥',
    };
  }
  if (percentage >= 100) {
    return {
      type: 'gold',
      label: 'Coup de Cœur',
      color: '#FFD700',
      emoji: '🏆',
    };
  }
  if (percentage >= 75) {
    return {
      type: 'silver',
      label: 'Populaire',
      color: '#C0C0C0',
      emoji: '⭐',
    };
  }
  if (percentage >= 50) {
    return {
      type: 'bronze',
      label: 'Apprécié',
      color: '#CD7F32',
      emoji: '👍',
    };
  }
  return null;
}

