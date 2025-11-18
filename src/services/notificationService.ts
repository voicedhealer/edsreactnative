import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';
import { apiClient } from './apiClient';
import { API_ENDPOINTS } from '@constants';
import { useAuthStore } from '@store';

// Configuration des notifications
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

export interface NotificationData {
  type: 'event' | 'message' | 'badge' | 'engagement' | 'general';
  eventId?: string;
  establishmentId?: string;
  badgeId?: string;
  [key: string]: unknown;
}

export interface NotificationPayload {
  title: string;
  body: string;
  data?: NotificationData;
}

class NotificationService {
  private deviceToken: string | null = null;
  private notificationListener: Notifications.Subscription | null = null;
  private responseListener: Notifications.Subscription | null = null;
  private onNotificationTapped?: (data: NotificationData) => void;

  /**
   * Demander les permissions de notification
   */
  async requestPermissions(): Promise<boolean> {
    try {
      const { status: existingStatus } = await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;

      if (existingStatus !== 'granted') {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }

      if (finalStatus !== 'granted') {
        console.warn('Permissions de notification refusées');
        return false;
      }

      // Configuration spécifique Android
      if (Platform.OS === 'android') {
        await Notifications.setNotificationChannelAsync('default', {
          name: 'Notifications par défaut',
          importance: Notifications.AndroidImportance.MAX,
          vibrationPattern: [0, 250, 250, 250],
          lightColor: '#ff751f',
        });

        // Canal pour les événements
        await Notifications.setNotificationChannelAsync('events', {
          name: 'Événements',
          description: 'Notifications sur les nouveaux événements',
          importance: Notifications.AndroidImportance.HIGH,
          vibrationPattern: [0, 250, 250, 250],
          lightColor: '#ff751f',
        });

        // Canal pour les messages
        await Notifications.setNotificationChannelAsync('messages', {
          name: 'Messages',
          description: 'Notifications de messages',
          importance: Notifications.AndroidImportance.HIGH,
          vibrationPattern: [0, 250, 250, 250],
          lightColor: '#ff1fa9',
        });

        // Canal pour les badges
        await Notifications.setNotificationChannelAsync('badges', {
          name: 'Badges',
          description: 'Notifications de badges débloqués',
          importance: Notifications.AndroidImportance.DEFAULT,
          vibrationPattern: [0, 250],
          lightColor: '#ff3a3a',
        });
      }

      return true;
    } catch (error) {
      console.error('Erreur lors de la demande de permissions:', error);
      return false;
    }
  }

  /**
   * Obtenir le token de l'appareil
   */
  async getDeviceToken(): Promise<string | null> {
    try {
      const token = await Notifications.getExpoPushTokenAsync({
        projectId: process.env.EXPO_PUBLIC_PROJECT_ID,
      });
      this.deviceToken = token.data;
      return token.data;
    } catch (error) {
      console.error('Erreur lors de la récupération du token:', error);
      return null;
    }
  }

  /**
   * Enregistrer le token auprès du backend
   */
  async registerDeviceToken(token: string): Promise<boolean> {
    try {
      const { user } = useAuthStore.getState();
      if (!user) {
        console.warn('Utilisateur non connecté, impossible d\'enregistrer le token');
        return false;
      }

      await apiClient.post(API_ENDPOINTS.NOTIFICATIONS.REGISTER_TOKEN, {
        token,
        platform: Platform.OS,
        deviceId: await this.getDeviceId(),
      });

      this.deviceToken = token;
      return true;
    } catch (error) {
      console.error('Erreur lors de l\'enregistrement du token:', error);
      return false;
    }
  }

  /**
   * Désenregistrer le token auprès du backend
   */
  async unregisterDeviceToken(): Promise<boolean> {
    try {
      if (!this.deviceToken) {
        return false;
      }

      await apiClient.post(API_ENDPOINTS.NOTIFICATIONS.UNREGISTER_TOKEN, {
        token: this.deviceToken,
      });

      this.deviceToken = null;
      return true;
    } catch (error) {
      console.error('Erreur lors du désenregistrement du token:', error);
      return false;
    }
  }

  /**
   * Mettre à jour le token auprès du backend
   */
  async updateDeviceToken(oldToken: string, newToken: string): Promise<boolean> {
    try {
      await apiClient.post(API_ENDPOINTS.NOTIFICATIONS.UPDATE_TOKEN, {
        oldToken,
        newToken,
        platform: Platform.OS,
      });

      this.deviceToken = newToken;
      return true;
    } catch (error) {
      console.error('Erreur lors de la mise à jour du token:', error);
      return false;
    }
  }

  /**
   * Initialiser le service de notifications
   */
  async initialize(): Promise<boolean> {
    try {
      // Demander les permissions
      const hasPermission = await this.requestPermissions();
      if (!hasPermission) {
        return false;
      }

      // Obtenir le token
      const token = await this.getDeviceToken();
      if (!token) {
        return false;
      }

      // Enregistrer le token auprès du backend
      await this.registerDeviceToken(token);

      // Configurer les listeners
      this.setupNotificationListeners();

      return true;
    } catch (error) {
      console.error('Erreur lors de l\'initialisation des notifications:', error);
      return false;
    }
  }

  /**
   * Configurer les listeners de notifications
   */
  private setupNotificationListeners(): void {
    // Listener pour les notifications reçues en foreground
    this.notificationListener = Notifications.addNotificationReceivedListener(
      notification => {
        this.handleNotificationReceived(notification);
      }
    );

    // Listener pour les interactions avec les notifications
    this.responseListener = Notifications.addNotificationResponseReceivedListener(
      response => {
        this.handleNotificationResponse(response);
      }
    );
  }

  /**
   * Gérer la réception d'une notification
   */
  private handleNotificationReceived(
    notification: Notifications.Notification
  ): void {
    const { title, body, data } = notification.request.content;
    console.log('Notification reçue:', { title, body, data });

    // Vous pouvez ajouter ici une logique pour afficher une notification locale
    // ou mettre à jour l'état de l'application
  }

  /**
   * Gérer l'interaction avec une notification
   */
  private handleNotificationResponse(
    response: Notifications.NotificationResponse
  ): void {
    const { notification } = response;
    const { data } = notification.request.content;

    console.log('Interaction avec notification:', data);

    // Appeler le callback si défini
    if (data && typeof data === 'object') {
      const notificationData = data as NotificationData;
      this.onNotificationTapped?.(notificationData);
    }
  }

  /**
   * Obtenir l'ID de l'appareil (simplifié)
   */
  private async getDeviceId(): Promise<string> {
    // Pour une implémentation complète, utilisez expo-device
    return Platform.OS === 'ios' ? 'ios-device' : 'android-device';
  }

  /**
   * Programmer une notification locale
   */
  async scheduleLocalNotification(
    payload: NotificationPayload,
    trigger?: Notifications.NotificationTriggerInput
  ): Promise<string> {
    try {
      const identifier = await Notifications.scheduleNotificationAsync({
        content: {
          title: payload.title,
          body: payload.body,
          data: payload.data,
          sound: true,
          priority: Notifications.AndroidNotificationPriority.HIGH,
        },
        trigger: trigger || null,
      });

      return identifier;
    } catch (error) {
      console.error('Erreur lors de la programmation de la notification:', error);
      throw error;
    }
  }

  /**
   * Annuler une notification locale
   */
  async cancelNotification(identifier: string): Promise<void> {
    await Notifications.cancelScheduledNotificationAsync(identifier);
  }

  /**
   * Annuler toutes les notifications locales
   */
  async cancelAllNotifications(): Promise<void> {
    await Notifications.cancelAllScheduledNotificationsAsync();
  }

  /**
   * Obtenir les notifications non lues
   */
  async getBadgeCount(): Promise<number> {
    return await Notifications.getBadgeCountAsync();
  }

  /**
   * Définir le badge count
   */
  async setBadgeCount(count: number): Promise<void> {
    await Notifications.setBadgeCountAsync(count);
  }

  /**
   * Définir le callback pour les notifications tapées
   */
  setNotificationTapHandler(handler: (data: NotificationData) => void): void {
    this.onNotificationTapped = handler;
  }

  /**
   * Nettoyer les listeners
   */
  cleanup(): void {
    if (this.notificationListener) {
      Notifications.removeNotificationSubscription(this.notificationListener);
      this.notificationListener = null;
    }

    if (this.responseListener) {
      Notifications.removeNotificationSubscription(this.responseListener);
      this.responseListener = null;
    }
  }
}

// Instance singleton
export const notificationService = new NotificationService();

