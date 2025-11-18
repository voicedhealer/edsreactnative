import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, RefreshControl, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { usePopularEstablishments, useNearbyEstablishments } from '@hooks';
import { SearchBar } from '@components/home/SearchBar';
import { CategoryGrid, type Category } from '@components/home/CategoryGrid';
import { FeaturedCarousel } from '@components/home/FeaturedCarousel';
import { GeolocationButton } from '@components/home/GeolocationButton';
import { COLORS, SPACING, FONT_SIZES } from '@constants';
import type { Establishment } from '@types';
import type { AppStackParamList } from '@navigation/types';

type NavigationProp = NativeStackNavigationProp<AppStackParamList, 'MainTabs'>;

export const HomeScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();
  const [city, setCity] = useState('');
  const [activity, setActivity] = useState('');
  const [refreshing, setRefreshing] = useState(false);
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [searchRadius, setSearchRadius] = useState(5);

  // Récupérer les établissements populaires
  const {
    data: popularEstablishments,
    isLoading: isLoadingPopular,
    refetch: refetchPopular,
  } = usePopularEstablishments(10);

  // Récupérer les établissements à proximité si la géolocalisation est activée
  const {
    data: nearbyData,
    isLoading: isLoadingNearby,
    refetch: refetchNearby,
  } = useNearbyEstablishments(userLocation?.lat || 0, userLocation?.lng || 0, 5, !!userLocation);

  const nearbyEstablishments =
    nearbyData?.pages.flatMap(page => page.data) || popularEstablishments || [];

  const handleRefresh = async () => {
    setRefreshing(true);
    await Promise.all([refetchPopular(), refetchNearby()]);
    setRefreshing(false);
  };

  const handleSearch = (
    envie: string,
    cityValue: string,
    radius: number,
    coords?: { lat: number; lng: number }
  ) => {
    setSearchRadius(radius);
    if (coords) {
      setUserLocation(coords);
    }
    navigation.navigate('SearchResults', {
      city: cityValue,
      activity: envie,
      filters: coords
        ? {
            latitude: coords.lat,
            longitude: coords.lng,
            radius,
          }
        : undefined,
    });
  };

  const handleCategoryPress = (category: Category) => {
    navigation.navigate('SearchResults', {
      category: category.name,
    });
  };

  const handleEstablishmentPress = (establishment: Establishment) => {
    // Navigation vers les détails de l'établissement
    // navigation.navigate('EventDetails', { eventId: establishment.id });
    console.log('Établissement sélectionné:', establishment);
  };

  const handleGeolocationFound = (latitude: number, longitude: number) => {
    setUserLocation({ lat: latitude, lng: longitude });
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={handleRefresh}
          tintColor={COLORS.primary}
        />
      }
    >
      {/* Hero Section */}
      <View style={styles.heroSection}>
        <Text style={styles.heroTitle}>Envie2Sortir</Text>
        <Text style={styles.heroSubtitle}>Trouvez votre prochaine sortie</Text>
      </View>

      {/* Search Bar */}
      <SearchBar
        onSubmit={handleSearch}
        initialEnvie={activity}
        initialCity={city}
        style={styles.searchBar}
      />

      {/* Geolocation Button */}
      <View style={styles.geoContainer}>
        <GeolocationButton
          onLocationFound={handleGeolocationFound}
          variant="outline"
          style={styles.geoButton}
        />
      </View>

      {/* Categories Grid */}
      <CategoryGrid onCategoryPress={handleCategoryPress} style={styles.categories} />

      {/* Featured Establishments Carousel */}
      {userLocation ? (
        <FeaturedCarousel
          establishments={nearbyEstablishments}
          onEstablishmentPress={handleEstablishmentPress}
          title="📍 Près de vous"
        />
      ) : (
        <FeaturedCarousel
          establishments={popularEstablishments || []}
          onEstablishmentPress={handleEstablishmentPress}
          title="⭐ En vedette"
        />
      )}

      {/* Quick Actions */}
      <View style={styles.quickActions}>
        <Text style={styles.sectionTitle}>Actions rapides</Text>
        <View style={styles.actionsGrid}>
          <TouchableOpacity
            style={[styles.actionCard, { backgroundColor: COLORS.primary + '20' }]}
            onPress={() => console.log('Événements à venir')}
          >
            <Text style={styles.actionIcon}>📅</Text>
            <Text style={styles.actionText}>Événements</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.actionCard, { backgroundColor: COLORS.secondary + '20' }]}
            onPress={() => console.log('Mes favoris')}
          >
            <Text style={styles.actionIcon}>❤️</Text>
            <Text style={styles.actionText}>Favoris</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.actionCard, { backgroundColor: COLORS.accent + '20' }]}
            onPress={() => console.log('Recherche avancée')}
          >
            <Text style={styles.actionIcon}>🔍</Text>
            <Text style={styles.actionText}>Recherche</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  contentContainer: {
    paddingBottom: SPACING.xl,
  },
  heroSection: {
    backgroundColor: COLORS.primary,
    padding: SPACING.xl,
    paddingTop: SPACING.xxl,
    alignItems: 'center',
  },
  heroTitle: {
    fontSize: FONT_SIZES.xxl,
    fontWeight: 'bold',
    color: COLORS.textLight,
    marginBottom: SPACING.xs,
  },
  heroSubtitle: {
    fontSize: FONT_SIZES.md,
    color: COLORS.textLight,
    opacity: 0.9,
  },
  searchBar: {
    margin: SPACING.md,
    marginTop: -SPACING.lg,
  },
  geoContainer: {
    paddingHorizontal: SPACING.md,
    marginBottom: SPACING.sm,
  },
  geoButton: {
    width: '100%',
  },
  categories: {
    marginTop: SPACING.md,
  },
  quickActions: {
    padding: SPACING.md,
    marginTop: SPACING.md,
  },
  sectionTitle: {
    fontSize: FONT_SIZES.lg,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: SPACING.md,
  },
  actionsGrid: {
    flexDirection: 'row',
    gap: SPACING.md,
  },
  actionCard: {
    flex: 1,
    borderRadius: 12,
    padding: SPACING.md,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 100,
  },
  actionIcon: {
    fontSize: 32,
    marginBottom: SPACING.xs,
  },
  actionText: {
    fontSize: FONT_SIZES.sm,
    fontWeight: '600',
    color: COLORS.text,
    textAlign: 'center',
  },
});
