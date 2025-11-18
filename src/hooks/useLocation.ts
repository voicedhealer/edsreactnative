/**
 * Hook personnalisé pour la géolocalisation
 * Utilise LocationService pour gérer les permissions et la localisation
 */

import { useState, useEffect, useCallback, useRef } from 'react';
import { LocationService, type Coordinates, type LocationPermissionStatus } from '@services';

interface UseLocationOptions {
  /**
   * Activer le suivi automatique de la position au montage
   */
  autoTrack?: boolean;
  /**
   * Rayon de recherche par défaut (en km)
   */
  defaultRadius?: number;
  /**
   * Précision de la localisation
   */
  accuracy?: 'lowest' | 'low' | 'balanced' | 'high' | 'highest' | 'bestForNavigation';
}

interface UseLocationReturn {
  /**
   * Position actuelle de l'utilisateur
   */
  location: Coordinates | null;
  /**
   * Statut des permissions
   */
  permissionStatus: LocationPermissionStatus | null;
  /**
   * Indique si la localisation est en cours de chargement
   */
  isLoading: boolean;
  /**
   * Indique si une erreur s'est produite
   */
  error: string | null;
  /**
   * Obtenir la position actuelle
   */
  getCurrentLocation: () => Promise<Coordinates | null>;
  /**
   * Demander les permissions
   */
  requestPermissions: () => Promise<LocationPermissionStatus>;
  /**
   * Démarrer le suivi de la position
   */
  startTracking: () => Promise<void>;
  /**
   * Arrêter le suivi de la position
   */
  stopTracking: () => void;
  /**
   * Vérifier si les services de localisation sont activés
   */
  checkLocationEnabled: () => Promise<boolean>;
}

/**
 * Hook pour gérer la géolocalisation
 */
export const useLocation = (options: UseLocationOptions = {}): UseLocationReturn => {
  const {
    autoTrack = false,
    defaultRadius = 5,
    accuracy = 'balanced',
  } = options;

  const [location, setLocation] = useState<Coordinates | null>(null);
  const [permissionStatus, setPermissionStatus] = useState<LocationPermissionStatus | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const stopTrackingRef = useRef<(() => void) | null>(null);

  // Mapper les options de précision
  const getAccuracy = useCallback((): Location.Accuracy => {
    switch (accuracy) {
      case 'lowest':
        return Location.Accuracy.Lowest;
      case 'low':
        return Location.Accuracy.Low;
      case 'balanced':
        return Location.Accuracy.Balanced;
      case 'high':
        return Location.Accuracy.High;
      case 'highest':
        return Location.Accuracy.Highest;
      case 'bestForNavigation':
        return Location.Accuracy.BestForNavigation;
      default:
        return Location.Accuracy.Balanced;
    }
  }, [accuracy]);

  // Vérifier les permissions au montage
  useEffect(() => {
    const checkPermissions = async () => {
      const status = await LocationService.checkPermissions();
      setPermissionStatus(status);
    };
    checkPermissions();
  }, []);

  // Obtenir la position actuelle
  const getCurrentLocation = useCallback(async (): Promise<Coordinates | null> => {
    setIsLoading(true);
    setError(null);

    try {
      // Vérifier si les services sont activés
      const enabled = await LocationService.isLocationEnabled();
      if (!enabled) {
        LocationService.showLocationServicesAlert();
        setError('Les services de localisation sont désactivés');
        setIsLoading(false);
        return null;
      }

      const coords = await LocationService.getCurrentLocation({
        accuracy: getAccuracy(),
      });

      setLocation(coords);
      setIsLoading(false);
      return coords;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erreur de géolocalisation';
      setError(errorMessage);
      setIsLoading(false);
      return null;
    }
  }, [getAccuracy]);

  // Demander les permissions
  const requestPermissions = useCallback(async (): Promise<LocationPermissionStatus> => {
    setIsLoading(true);
    setError(null);

    try {
      const status = await LocationService.requestForegroundPermissions();
      setPermissionStatus(status);
      setIsLoading(false);
      return status;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erreur lors de la demande de permission';
      setError(errorMessage);
      setIsLoading(false);
      return {
        granted: false,
        canAskAgain: false,
        status: 'denied' as Location.PermissionStatus,
      };
    }
  }, []);

  // Démarrer le suivi de la position
  const startTracking = useCallback(async (): Promise<void> => {
    // Arrêter le suivi précédent s'il existe
    if (stopTrackingRef.current) {
      stopTrackingRef.current();
      stopTrackingRef.current = null;
    }

    setIsLoading(true);
    setError(null);

    try {
      // Vérifier les permissions
      const status = await LocationService.checkPermissions();
      if (!status.granted) {
        const requestedStatus = await LocationService.requestForegroundPermissions();
        if (!requestedStatus.granted) {
          setError('Permission de géolocalisation refusée');
          setIsLoading(false);
          return;
        }
      }

      // Vérifier si les services sont activés
      const enabled = await LocationService.isLocationEnabled();
      if (!enabled) {
        LocationService.showLocationServicesAlert();
        setError('Les services de localisation sont désactivés');
        setIsLoading(false);
        return;
      }

      // Démarrer le suivi
      const stopFn = await LocationService.watchPosition(
        (coords) => {
          setLocation(coords);
          setIsLoading(false);
        },
        {
          accuracy: getAccuracy(),
          timeInterval: 5000,
          distanceInterval: 10,
        }
      );

      stopTrackingRef.current = stopFn;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erreur lors du suivi de la position';
      setError(errorMessage);
      setIsLoading(false);
    }
  }, [getAccuracy]);

  // Arrêter le suivi
  const stopTracking = useCallback(() => {
    if (stopTrackingRef.current) {
      stopTrackingRef.current();
      stopTrackingRef.current = null;
    }
    LocationService.stopWatching();
  }, []);

  // Vérifier si les services de localisation sont activés
  const checkLocationEnabled = useCallback(async (): Promise<boolean> => {
    return await LocationService.isLocationEnabled();
  }, []);

  // Auto-track si activé
  useEffect(() => {
    if (autoTrack && permissionStatus?.granted) {
      getCurrentLocation();
    }
  }, [autoTrack, permissionStatus?.granted, getCurrentLocation]);

  // Nettoyer le suivi au démontage
  useEffect(() => {
    return () => {
      if (stopTrackingRef.current) {
        stopTrackingRef.current();
      }
      LocationService.stopWatching();
    };
  }, []);

  return {
    location,
    permissionStatus,
    isLoading,
    error,
    getCurrentLocation,
    requestPermissions,
    startTracking,
    stopTracking,
    checkLocationEnabled,
  };
};

/**
 * Hook simplifié pour obtenir la position actuelle une seule fois
 */
export const useCurrentLocation = (options?: { accuracy?: UseLocationOptions['accuracy'] }) => {
  const { getCurrentLocation, isLoading, error, location } = useLocation({
    ...options,
    autoTrack: false,
  });

  return {
    location,
    isLoading,
    error,
    getCurrentLocation,
  };
};

