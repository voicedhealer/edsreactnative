import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Platform,
  PermissionsAndroid,
  Alert,
} from 'react-native';
import { Marker, PROVIDER_GOOGLE, Region, LatLng } from 'react-native-maps';
import MapView from 'react-native-map-clustering';
import * as Location from 'expo-location';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { LinearGradient } from 'expo-linear-gradient';
import { BottomSheet } from '@components/map/BottomSheet';
import { CustomMarker } from '@components/map/CustomMarker';
import { useEstablishments, useNearbyEstablishments } from '@hooks';
import { COLORS, SPACING, BORDER_RADIUS, Shadows, ButtonGradient, Typography } from '@constants';
import type { Establishment } from '@types';
import type { AppStackParamList } from '@navigation/types';

type NavigationProp = NativeStackNavigationProp<AppStackParamList>;

// Région par défaut (France - centre)
const DEFAULT_REGION: Region = {
  latitude: 46.6034,
  longitude: 1.8883,
  latitudeDelta: 5.0,
  longitudeDelta: 5.0,
};

// Région pour zoom initial après géolocalisation
const INITIAL_ZOOM_REGION: Region = {
  latitude: 0,
  longitude: 0,
  latitudeDelta: 0.1,
  longitudeDelta: 0.1,
};

export const MapScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();
  const mapRef = useRef<MapView>(null);
  const [region, setRegion] = useState<Region>(DEFAULT_REGION);
  const [userLocation, setUserLocation] = useState<LatLng | null>(null);
  const [selectedEstablishment, setSelectedEstablishment] = useState<Establishment | null>(null);
  const [isLoadingLocation, setIsLoadingLocation] = useState(false);
  const [hasLocationPermission, setHasLocationPermission] = useState(false);

  // Récupérer les établissements pour la carte
  // Si géolocalisation activée, utiliser nearby, sinon utiliser tous les établissements
  const {
    data: nearbyData,
    isLoading: isLoadingNearby,
  } = useNearbyEstablishments(
    userLocation?.latitude || 0,
    userLocation?.longitude || 0,
    50, // Rayon large pour la carte
    hasLocationPermission && !!userLocation
  );

  const {
    data: allEstablishmentsData,
    isLoading: isLoadingAll,
  } = useEstablishments();

  // Combiner les établissements
  const establishments: Establishment[] = hasLocationPermission && userLocation
    ? (nearbyData?.pages.flatMap(page => page.data) || [])
    : (allEstablishmentsData?.pages.flatMap(page => page.data) || []);

  const isLoading = isLoadingNearby || isLoadingAll;

  // Demander les permissions de géolocalisation
  const requestLocationPermission = useCallback(async () => {
    try {
      setIsLoadingLocation(true);

      if (Platform.OS === 'android') {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION
        );
        if (granted !== PermissionsAndroid.RESULTS.GRANTED) {
          Alert.alert(
            'Permission refusée',
            'La géolocalisation est nécessaire pour afficher les établissements près de vous.',
            [{ text: 'OK' }]
          );
          setIsLoadingLocation(false);
          return false;
        }
      }

      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert(
          'Permission refusée',
          'La géolocalisation est nécessaire pour afficher les établissements près de vous.',
          [{ text: 'OK' }]
        );
        setIsLoadingLocation(false);
        return false;
      }

      setHasLocationPermission(true);
      return true;
    } catch (error) {
      console.error('Erreur lors de la demande de permission:', error);
      setIsLoadingLocation(false);
      return false;
    }
  }, []);

  // Obtenir la position actuelle de l'utilisateur
  const getCurrentLocation = useCallback(async () => {
    const hasPermission = await requestLocationPermission();
    if (!hasPermission) {
      setIsLoadingLocation(false);
      return;
    }

    try {
      const location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
      });

      const newLocation: LatLng = {
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      };

      setUserLocation(newLocation);

      // Centrer la carte sur la position de l'utilisateur
      const newRegion: Region = {
        ...INITIAL_ZOOM_REGION,
        latitude: newLocation.latitude,
        longitude: newLocation.longitude,
      };

      setRegion(newRegion);
      mapRef.current?.animateToRegion(newRegion, 1000);
      setIsLoadingLocation(false);
    } catch (error) {
      console.error('Erreur lors de la récupération de la position:', error);
      Alert.alert(
        'Erreur',
        'Impossible de récupérer votre position. Veuillez réessayer.',
        [{ text: 'OK' }]
      );
      setIsLoadingLocation(false);
    }
  }, [requestLocationPermission]);

  // Vérifier les permissions au chargement
  useEffect(() => {
    const checkPermissions = async () => {
      const { status } = await Location.getForegroundPermissionsAsync();
      if (status === 'granted') {
        setHasLocationPermission(true);
        getCurrentLocation();
      }
    };
    checkPermissions();
  }, [getCurrentLocation]);

  // Gérer le tap sur un marqueur
  const handleMarkerPress = useCallback((establishment: Establishment) => {
    setSelectedEstablishment(establishment);
  }, []);

  // Fermer le bottom sheet
  const handleCloseBottomSheet = useCallback(() => {
    setSelectedEstablishment(null);
  }, []);

  // Naviguer vers les détails de l'établissement
  const handleViewDetails = useCallback(() => {
    if (selectedEstablishment) {
      navigation.navigate('EstablishmentDetails', {
        establishmentId: selectedEstablishment.id,
      });
      setSelectedEstablishment(null);
    }
  }, [selectedEstablishment, navigation]);

  // Gérer le changement de région de la carte
  const handleRegionChangeComplete = useCallback((newRegion: Region) => {
    setRegion(newRegion);
  }, []);

  return (
    <View style={styles.container}>
      {/* Carte */}
      <MapView
        ref={mapRef}
        provider={PROVIDER_GOOGLE}
        style={styles.map}
        initialRegion={DEFAULT_REGION}
        region={region}
        onRegionChangeComplete={handleRegionChangeComplete}
        showsUserLocation={hasLocationPermission}
        showsMyLocationButton={false}
        showsCompass={true}
        mapType="standard"
        clusterColor={COLORS.brandOrange}
        clusterTextColor={COLORS.textLight}
        clusterFontFamily={Typography.fontFamily}
        radius={50}
        maxZoom={15}
        minZoom={3}
      >
        {establishments
          .filter(est => est.latitude && est.longitude)
          .map(establishment => (
            <Marker
              key={establishment.id}
              coordinate={{
                latitude: establishment.latitude!,
                longitude: establishment.longitude!,
              }}
              onPress={() => handleMarkerPress(establishment)}
            >
              <CustomMarker establishment={establishment} />
            </Marker>
          ))}
      </MapView>

      {/* Bouton géolocalisation */}
      <TouchableOpacity
        style={styles.locationButton}
        onPress={getCurrentLocation}
        disabled={isLoadingLocation}
      >
        <LinearGradient
          colors={ButtonGradient.colors}
          start={ButtonGradient.start}
          end={ButtonGradient.end}
          style={styles.locationButtonGradient}
        >
          {isLoadingLocation ? (
            <ActivityIndicator color={COLORS.textLight} size="small" />
          ) : (
            <Text style={styles.locationButtonText}>📍</Text>
          )}
        </LinearGradient>
      </TouchableOpacity>

      {/* Indicateur de chargement */}
      {isLoading && (
        <View style={styles.loadingContainer}>
          <View style={styles.loadingBox}>
            <ActivityIndicator size="large" color={COLORS.brandOrange} />
            <Text style={styles.loadingText}>Chargement des établissements...</Text>
          </View>
        </View>
      )}

      {/* Bottom Sheet pour aperçu établissement */}
      {selectedEstablishment && (
        <BottomSheet
          establishment={selectedEstablishment}
          onClose={handleCloseBottomSheet}
          onViewDetails={handleViewDetails}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  map: {
    flex: 1,
  },
  locationButton: {
    position: 'absolute',
    bottom: SPACING.xl + 100, // Au-dessus du bottom sheet
    right: SPACING.md,
    ...Shadows.buttonGradient,
  },
  locationButtonGradient: {
    width: 56,
    height: 56,
    borderRadius: BORDER_RADIUS.full,
    justifyContent: 'center',
    alignItems: 'center',
  },
  locationButtonText: {
    fontSize: 24,
  },
  loadingContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
  },
  loadingBox: {
    backgroundColor: COLORS.background,
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.lg,
    alignItems: 'center',
    ...Shadows.card,
  },
  loadingText: {
    marginTop: SPACING.sm,
    fontSize: 14,
    color: COLORS.textSecondary,
  },
});

