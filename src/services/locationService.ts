/**
 * Service de géolocalisation centralisé
 * Gère les permissions iOS/Android et les fonctionnalités de localisation
 */

import * as Location from 'expo-location';
import { Platform, PermissionsAndroid, Alert } from 'react-native';
import type { LocationObject, LocationAccuracy } from 'expo-location';

// Types
export interface Coordinates {
  latitude: number;
  longitude: number;
}

export interface LocationPermissionStatus {
  granted: boolean;
  canAskAgain: boolean;
  status: Location.PermissionStatus;
}

export interface LocationError {
  code: string;
  message: string;
}

// Constantes
const DEFAULT_RADIUS_KM = 5; // Rayon par défaut selon cursorrules.md
const DEFAULT_ACCURACY: LocationAccuracy = Location.Accuracy.Balanced;

/**
 * Service de géolocalisation
 */
export class LocationService {
  private static watchSubscription: Location.LocationSubscription | null = null;

  /**
   * Vérifier les permissions de géolocalisation
   */
  static async checkPermissions(): Promise<LocationPermissionStatus> {
    try {
      const { status, canAskAgain } = await Location.getForegroundPermissionsAsync();

      return {
        granted: status === Location.PermissionStatus.GRANTED,
        canAskAgain: canAskAgain ?? true,
        status,
      };
    } catch (error) {
      console.error('Erreur lors de la vérification des permissions:', error);
      return {
        granted: false,
        canAskAgain: false,
        status: Location.PermissionStatus.DENIED,
      };
    }
  }

  /**
   * Demander les permissions de géolocalisation (foreground)
   */
  static async requestForegroundPermissions(): Promise<LocationPermissionStatus> {
    try {
      // Gestion spécifique Android
      if (Platform.OS === 'android') {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
          {
            title: 'Permission de localisation',
            message: 'Cette application a besoin de votre localisation pour trouver les établissements à proximité.',
            buttonNeutral: 'Demander plus tard',
            buttonNegative: 'Annuler',
            buttonPositive: 'Autoriser',
          }
        );

        if (granted !== PermissionsAndroid.RESULTS.GRANTED) {
          return {
            granted: false,
            canAskAgain: granted === PermissionsAndroid.RESULTS.NEVER_ASK_AGAIN ? false : true,
            status: Location.PermissionStatus.DENIED,
          };
        }
      }

      // Demander via expo-location (iOS et Android)
      const { status, canAskAgain } = await Location.requestForegroundPermissionsAsync();

      return {
        granted: status === Location.PermissionStatus.GRANTED,
        canAskAgain: canAskAgain ?? true,
        status,
      };
    } catch (error) {
      console.error('Erreur lors de la demande de permission:', error);
      return {
        granted: false,
        canAskAgain: false,
        status: Location.PermissionStatus.DENIED,
      };
    }
  }

  /**
   * Demander les permissions de géolocalisation en arrière-plan (optionnel)
   */
  static async requestBackgroundPermissions(): Promise<LocationPermissionStatus> {
    try {
      // D'abord demander les permissions foreground
      const foregroundStatus = await this.requestForegroundPermissions();
      if (!foregroundStatus.granted) {
        return foregroundStatus;
      }

      // Ensuite demander les permissions background
      const { status, canAskAgain } = await Location.requestBackgroundPermissionsAsync();

      return {
        granted: status === Location.PermissionStatus.GRANTED,
        canAskAgain: canAskAgain ?? true,
        status,
      };
    } catch (error) {
      console.error('Erreur lors de la demande de permission background:', error);
      return {
        granted: false,
        canAskAgain: false,
        status: Location.PermissionStatus.DENIED,
      };
    }
  }

  /**
   * Obtenir la position actuelle de l'utilisateur
   */
  static async getCurrentLocation(
    options?: {
      accuracy?: LocationAccuracy;
      timeout?: number;
      maximumAge?: number;
    }
  ): Promise<Coordinates> {
    // Vérifier les permissions
    const permissionStatus = await this.checkPermissions();
    if (!permissionStatus.granted) {
      const requestedStatus = await this.requestForegroundPermissions();
      if (!requestedStatus.granted) {
        throw new Error('Permission de géolocalisation refusée');
      }
    }

    try {
      const location = await Location.getCurrentPositionAsync({
        accuracy: options?.accuracy || DEFAULT_ACCURACY,
        timeout: options?.timeout || 15000,
        maximumAge: options?.maximumAge || 10000,
      });

      return {
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      };
    } catch (error) {
      console.error('Erreur lors de la récupération de la position:', error);
      throw new Error("Impossible d'obtenir votre position. Veuillez réessayer.");
    }
  }

  /**
   * Suivre la position de l'utilisateur en continu
   */
  static async watchPosition(
    callback: (location: Coordinates) => void,
    options?: {
      accuracy?: LocationAccuracy;
      timeInterval?: number;
      distanceInterval?: number;
    }
  ): Promise<() => void> {
    // Vérifier les permissions
    const permissionStatus = await this.checkPermissions();
    if (!permissionStatus.granted) {
      const requestedStatus = await this.requestForegroundPermissions();
      if (!requestedStatus.granted) {
        throw new Error('Permission de géolocalisation refusée');
      }
    }

    try {
      // Arrêter le suivi précédent s'il existe
      if (this.watchSubscription) {
        this.watchSubscription.remove();
      }

      this.watchSubscription = await Location.watchPositionAsync(
        {
          accuracy: options?.accuracy || DEFAULT_ACCURACY,
          timeInterval: options?.timeInterval || 5000,
          distanceInterval: options?.distanceInterval || 10,
        },
        location => {
          callback({
            latitude: location.coords.latitude,
            longitude: location.coords.longitude,
          });
        }
      );

      // Retourner une fonction pour arrêter le suivi
      return () => {
        if (this.watchSubscription) {
          this.watchSubscription.remove();
          this.watchSubscription = null;
        }
      };
    } catch (error) {
      console.error('Erreur lors du suivi de la position:', error);
      throw new Error("Impossible de suivre votre position.");
    }
  }

  /**
   * Arrêter le suivi de la position
   */
  static stopWatching(): void {
    if (this.watchSubscription) {
      this.watchSubscription.remove();
      this.watchSubscription = null;
    }
  }

  /**
   * Calculer la distance entre deux points (formule Haversine)
   * Retourne la distance en kilomètres
   */
  static calculateDistance(
    point1: Coordinates,
    point2: Coordinates
  ): number {
    const R = 6371; // Rayon de la Terre en km
    const dLat = this.toRad(point2.latitude - point1.latitude);
    const dLon = this.toRad(point2.longitude - point1.longitude);

    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(this.toRad(point1.latitude)) *
        Math.cos(this.toRad(point2.latitude)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c;

    return distance;
  }

  /**
   * Convertir degrés en radians
   */
  private static toRad(degrees: number): number {
    return (degrees * Math.PI) / 180;
  }

  /**
   * Filtrer des établissements par rayon depuis une position
   */
  static filterByRadius<T extends Coordinates>(
    items: T[],
    center: Coordinates,
    radiusKm: number = DEFAULT_RADIUS_KM
  ): Array<T & { distance: number }> {
    return items
      .filter(item => item.latitude && item.longitude)
      .map(item => {
        const distance = this.calculateDistance(center, {
          latitude: item.latitude!,
          longitude: item.longitude!,
        });
        return {
          ...item,
          distance,
        };
      })
      .filter(item => item.distance <= radiusKm)
      .sort((a, b) => a.distance - b.distance);
  }

  /**
   * Obtenir les établissements dans un rayon donné (utilise l'API backend)
   * Cette fonction est un helper pour utiliser avec les hooks existants
   */
  static async getNearbyEstablishments(
    center: Coordinates,
    radiusKm: number = DEFAULT_RADIUS_KM
  ): Promise<{ latitude: number; longitude: number; radius: number }> {
    return {
      latitude: center.latitude,
      longitude: center.longitude,
      radius: radiusKm,
    };
  }

  /**
   * Vérifier si les services de localisation sont activés
   */
  static async isLocationEnabled(): Promise<boolean> {
    try {
      const enabled = await Location.hasServicesEnabledAsync();
      return enabled;
    } catch (error) {
      console.error('Erreur lors de la vérification des services:', error);
      return false;
    }
  }

  /**
   * Afficher une alerte pour demander d'activer les services de localisation
   */
  static showLocationServicesAlert(): void {
    Alert.alert(
      'Services de localisation désactivés',
      'Veuillez activer les services de localisation dans les paramètres de votre appareil pour utiliser cette fonctionnalité.',
      [
        { text: 'Annuler', style: 'cancel' },
        {
          text: 'Ouvrir les paramètres',
          onPress: () => {
            Location.enableNetworkProviderAsync().catch(() => {
              // Ignorer l'erreur si l'utilisateur annule
            });
          },
        },
      ]
    );
  }
}

// Export par défaut pour compatibilité
export default LocationService;

