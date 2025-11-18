import React, { useState, useEffect, useRef, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Platform,
  Alert,
  Dimensions,
} from 'react-native';
import { Marker, PROVIDER_GOOGLE, Region } from 'react-native-maps';
import MapView from 'react-native-map-clustering';
import * as Location from 'expo-location';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS, SPACING, BORDER_RADIUS, FONT_SIZES, Shadows, ButtonGradient } from '@constants';
import { useNearbyEstablishments } from '@hooks/useEstablishments';
import { EstablishmentBottomSheet } from '@components/map/BottomSheet';
import type { Establishment } from '@types';
import type { AppStackParamList } from '@navigation/types';

type MapScreenNavigationProp = StackNavigationProp<AppStackParamList>;

const { width, height } = Dimensions.get('window');

// Région par défaut (France)
const DEFAULT_REGION: Region = {
  latitude: 46.6034,
  longitude: 1.8883,
  latitudeDelta: 5.0,
  longitudeDelta: 5.0,
};

// Région initiale pour Paris (si pas de géolocalisation)
const PARIS_REGION: Region = {
  latitude: 48.8566,
  longitude: 2.3522,
  latitudeDelta: 0.1,
  longitudeDelta: 0.1,
};

export const MapScreen: React.FC = () => {
  const navigation = useNavigation<MapScreenNavigationProp>();
  const mapRef = useRef<MapView>(null);
  
  const [userLocation, setUserLocation] = useState<{ latitude: number; longitude: number } | null>(null);
  const [region, setRegion] = useState<Region>(DEFAULT_REGION);
  const [selectedEstablishment, setSelectedEstablishment] = useState<Establishment | null>(null);
  const [locationPermissionGranted, setLocationPermissionGranted] = useState(false);
  const [isLoadingLocation, setIsLoadingLocation] = useState(true);

  // Récupérer les établissements à proximité
  const {
    data: establishmentsData,
    isLoading: isLoadingEstablishments,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useNearbyEstablishments(
    userLocation?.latitude || region.latitude,
    userLocation?.longitude || region.longitude,
    10, // rayon de 10km
    !!userLocation || !isLoadingLocation
  );

  // Flatten des établissements depuis toutes les pages
  const establishments = useMemo(() => {
    if (!establishmentsData) return [];
    return establishmentsData.pages.flatMap((page) => page.data);
  }, [establishmentsData]);

  // Demander la permission de géolocalisation
  useEffect(() => {
    requestLocationPermission();
  }, []);

  const requestLocationPermission = async () => {
    try {
      setIsLoadingLocation(true);
      
      const { status: existingStatus } = await Location.getForegroundPermissionsAsync();
      
      if (existingStatus === 'granted') {
        setLocationPermissionGranted(true);
        getCurrentLocation();
        return;
      }

      const { status } = await Location.requestForegroundPermissionsAsync();
      
      if (status === 'granted') {
        setLocationPermissionGranted(true);
        getCurrentLocation();
      } else {
        setLocationPermissionGranted(false);
        // Utiliser région par défaut (Paris)
        setRegion(PARIS_REGION);
        Alert.alert(
          'Permission refusée',
          'La géolocalisation est désactivée. Vous pouvez toujours explorer la carte manuellement.',
          [{ text: 'OK' }]
        );
      }
    } catch (error) {
      console.error('Erreur lors de la demande de permission:', error);
      setLocationPermissionGranted(false);
      setRegion(PARIS_REGION);
    } finally {
      setIsLoadingLocation(false);
    }
  };

  const getCurrentLocation = async () => {
    try {
      const location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
      });

      const newLocation = {
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      };

      setUserLocation(newLocation);

      // Centrer la carte sur la position de l'utilisateur
      const newRegion: Region = {
        ...newLocation,
        latitudeDelta: 0.05,
        longitudeDelta: 0.05,
      };

      setRegion(newRegion);
      mapRef.current?.animateToRegion(newRegion, 1000);
    } catch (error) {
      console.error('Erreur lors de la récupération de la position:', error);
      setRegion(PARIS_REGION);
    }
  };

  const handleMarkerPress = (establishment: Establishment) => {
    setSelectedEstablishment(establishment);
  };

  const handleBottomSheetClose = () => {
    setSelectedEstablishment(null);
  };

  const handleEstablishmentPress = (establishment: Establishment) => {
    navigation.navigate('EstablishmentDetails', {
      establishmentId: establishment.id,
    });
    setSelectedEstablishment(null);
  };

  const handleCenterOnUser = () => {
    if (userLocation) {
      const newRegion: Region = {
        ...userLocation,
        latitudeDelta: 0.05,
        longitudeDelta: 0.05,
      };
      mapRef.current?.animateToRegion(newRegion, 1000);
    } else {
      requestLocationPermission();
    }
  };

  const renderMarker = (establishment: Establishment) => {
    const subscription = (establishment as any).subscription as 'FREE' | 'PREMIUM' | undefined;
    const isPremium = subscription === 'PREMIUM';
    const isHot = (establishment as any).isHot as boolean | undefined;

    return (
      <Marker
        key={establishment.id}
        coordinate={{
          latitude: establishment.latitude || 0,
          longitude: establishment.longitude || 0,
        }}
        onPress={() => handleMarkerPress(establishment)}
        tracksViewChanges={false}
      >
        <View style={styles.markerContainer}>
          {isPremium ? (
            <LinearGradient
              colors={ButtonGradient.colors}
              start={ButtonGradient.start}
              end={ButtonGradient.end}
              style={styles.markerPremium}
            >
              <Text style={styles.markerText}>👑</Text>
            </LinearGradient>
          ) : (
            <View style={[styles.marker, isHot && styles.markerHot]}>
              <View style={styles.markerInner}>
                <Text style={styles.markerEmoji}>📍</Text>
              </View>
            </View>
          )}
        </View>
      </Marker>
    );
  };

  const renderCluster = (cluster: any) => {
    const { pointCount, coordinate, clusterId } = cluster;
    const pointCountFormatted = pointCount > 99 ? '99+' : pointCount.toString();

    return (
      <Marker
        key={`cluster-${clusterId}`}
        coordinate={coordinate}
        tracksViewChanges={false}
      >
        <View style={styles.clusterContainer}>
          <LinearGradient
            colors={ButtonGradient.colors}
            start={ButtonGradient.start}
            end={ButtonGradient.end}
            style={styles.cluster}
          >
            <Text style={styles.clusterText}>{pointCountFormatted}</Text>
          </LinearGradient>
        </View>
      </Marker>
    );
  };

  if (isLoadingLocation) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={COLORS.brandOrange} />
        <Text style={styles.loadingText}>Chargement de la carte...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <MapViewClustering
        ref={mapRef}
        provider={Platform.OS === 'android' ? PROVIDER_GOOGLE : undefined}
        style={styles.map}
        initialRegion={region}
        region={region}
        onRegionChangeComplete={setRegion}
        showsUserLocation={locationPermissionGranted}
        showsMyLocationButton={false}
        showsCompass={true}
        toolbarEnabled={false}
        radius={50}
        minZoom={10}
        maxZoom={18}
        extent={512}
        nodeSize={64}
        renderCluster={renderCluster}
      >
        {establishments
          .filter((est) => est.latitude && est.longitude)
          .map((establishment) => renderMarker(establishment))}
      </MapViewClustering>

      {/* Bouton centrer sur utilisateur */}
      <TouchableOpacity
        style={styles.centerButton}
        onPress={handleCenterOnUser}
        activeOpacity={0.8}
      >
        <LinearGradient
          colors={ButtonGradient.colors}
          start={ButtonGradient.start}
          end={ButtonGradient.end}
          style={styles.centerButtonGradient}
        >
          <Text style={styles.centerButtonText}>📍</Text>
        </LinearGradient>
      </TouchableOpacity>

      {/* Indicateur de chargement */}
      {isLoadingEstablishments && (
        <View style={styles.loadingOverlay}>
          <ActivityIndicator size="small" color={COLORS.brandOrange} />
          <Text style={styles.loadingOverlayText}>Chargement des établissements...</Text>
        </View>
      )}

      {/* Bottom Sheet */}
      <EstablishmentBottomSheet
        establishment={selectedEstablishment}
        onClose={handleBottomSheetClose}
        onPress={handleEstablishmentPress}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    width: '100%',
    height: '100%',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.background,
  },
  loadingText: {
    marginTop: SPACING.md,
    fontSize: FONT_SIZES.md,
    color: COLORS.textSecondary,
  },
  markerContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  marker: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.background,
    borderWidth: 3,
    borderColor: COLORS.brandOrange,
    alignItems: 'center',
    justifyContent: 'center',
    ...Shadows.card,
  },
  markerHot: {
    borderColor: COLORS.brandRed,
  },
  markerInner: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: COLORS.brandOrange,
    alignItems: 'center',
    justifyContent: 'center',
  },
  markerPremium: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    ...Shadows.buttonGradient,
  },
  markerText: {
    fontSize: 20,
  },
  markerEmoji: {
    fontSize: 16,
  },
  clusterContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  cluster: {
    width: 50,
    height: 50,
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 3,
    borderColor: COLORS.background,
    ...Shadows.buttonGradient,
  },
  clusterText: {
    fontSize: FONT_SIZES.md,
    fontWeight: '700',
    color: COLORS.textLight,
  },
  centerButton: {
    position: 'absolute',
    bottom: 120,
    right: SPACING.md,
    borderRadius: BORDER_RADIUS.full,
    overflow: 'hidden',
    ...Shadows.buttonGradient,
  },
  centerButtonGradient: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
  },
  centerButtonText: {
    fontSize: 24,
  },
  loadingOverlay: {
    position: 'absolute',
    top: SPACING.lg,
    left: 0,
    right: 0,
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    paddingVertical: SPACING.sm,
    paddingHorizontal: SPACING.md,
    borderRadius: BORDER_RADIUS.md,
    marginHorizontal: SPACING.md,
    flexDirection: 'row',
    justifyContent: 'center',
    gap: SPACING.sm,
    ...Shadows.card,
  },
  loadingOverlayText: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.textSecondary,
  },
});

