import { useEffect } from 'react';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { notificationService, type NotificationData } from '@services/notificationService';
import type { AppStackParamList } from '@navigation/types';

type NavigationProp = StackNavigationProp<AppStackParamList>;

/**
 * Hook pour gérer la navigation depuis les notifications
 * À utiliser dans le composant RootNavigator ou AppNavigator
 */
export const useNotificationNavigation = () => {
  const navigation = useNavigation<NavigationProp>();

  useEffect(() => {
    // Définir le handler pour les notifications tapées
    notificationService.setNotificationTapHandler((data: NotificationData) => {
      handleNotificationTap(data);
    });

    return () => {
      // Nettoyer le handler lors du démontage
      notificationService.setNotificationTapHandler(() => {});
    };
  }, [navigation]);

  const handleNotificationTap = (data: NotificationData) => {
    switch (data.type) {
      case 'event':
        if (data.eventId) {
          navigation.navigate('EventDetails', { eventId: data.eventId as string });
        }
        break;

      case 'badge':
        // Navigation vers le profil pour voir le badge
        navigation.navigate('MainTabs', {
          screen: 'Profile',
        });
        break;

      case 'engagement':
        if (data.eventId) {
          navigation.navigate('EventDetails', { eventId: data.eventId as string });
        }
        break;

      case 'message':
        // Navigation vers les messages (si l'écran existe)
        // navigation.navigate('Messages');
        break;

      case 'general':
      default:
        // Pour les notifications générales, on peut naviguer vers l'accueil
        navigation.navigate('MainTabs', {
          screen: 'Home',
        });
        break;
    }
  };
};

