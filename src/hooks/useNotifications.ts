import { useEffect, useState } from 'react';
import { notificationService } from '@services/notificationService';
import { useAuthStore } from '@store';

/**
 * Hook pour gérer les notifications push
 */
export const useNotifications = () => {
  const { user } = useAuthStore();
  const [isInitialized, setIsInitialized] = useState(false);
  const [hasPermission, setHasPermission] = useState(false);

  useEffect(() => {
    let mounted = true;

    const initializeNotifications = async () => {
      if (!user) {
        // Si l'utilisateur n'est pas connecté, désenregistrer le token
        await notificationService.unregisterDeviceToken();
        if (mounted) {
          setIsInitialized(false);
          setHasPermission(false);
        }
        return;
      }

      try {
        // Initialiser les notifications
        const initialized = await notificationService.initialize();
        if (mounted) {
          setIsInitialized(initialized);
          setHasPermission(initialized);
        }
      } catch (error) {
        console.error('Erreur lors de l\'initialisation des notifications:', error);
        if (mounted) {
          setIsInitialized(false);
          setHasPermission(false);
        }
      }
    };

    initializeNotifications();

    return () => {
      mounted = false;
    };
  }, [user]);

  // Nettoyer les listeners lors du démontage
  useEffect(() => {
    return () => {
      notificationService.cleanup();
    };
  }, []);

  return {
    isInitialized,
    hasPermission,
    requestPermissions: notificationService.requestPermissions.bind(notificationService),
    getDeviceToken: notificationService.getDeviceToken.bind(notificationService),
    scheduleNotification: notificationService.scheduleLocalNotification.bind(notificationService),
    cancelNotification: notificationService.cancelNotification.bind(notificationService),
    cancelAllNotifications: notificationService.cancelAllNotifications.bind(notificationService),
    getBadgeCount: notificationService.getBadgeCount.bind(notificationService),
    setBadgeCount: notificationService.setBadgeCount.bind(notificationService),
  };
};

