import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, RefreshControl } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { usePopularEstablishments, useNearbyEstablishments } from '@hooks';
import { SearchBar } from '@components/home/SearchBar';
import { CategoryGrid, type Category } from '@components/home/CategoryGrid';
import { FeaturedCarousel } from '@components/home/FeaturedCarousel';
import { GeolocationButton } from '@components/home/GeolocationButton';
import { COLORS, SPACING, Typography, HeroGradient, Shadows, BORDER_RADIUS } from '@constants';
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
    navigation.navigate('EstablishmentDetails', { establishmentId: establishment.id });
  };

  const handleGeolocationFound = (latitude: number, longitude: number) => {
    setUserLocation({ lat: latitude, lng: longitude });
  };

  return (
    <View style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.contentContainer}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            tintColor={COLORS.textLight}
          />
        }
        showsVerticalScrollIndicator={false}
      >
        {/* Hero Section avec Gradient */}
        <LinearGradient
          colors={HeroGradient.colors}
          start={HeroGradient.start}
          end={HeroGradient.end}
          locations={HeroGradient.locations}
          style={styles.heroSection}
        >
          <Text style={styles.heroTitle}>Envie2Sortir</Text>
          <Text style={styles.heroSubtitle}>Trouvez votre prochaine sortie</Text>
        </LinearGradient>

        {/* Search Bar */}
        <View style={styles.searchBarContainer}>
          <SearchBar onSubmit={handleSearch} initialEnvie={activity} initialCity={city} />
        </View>

        {/* Geolocation Button */}
        <View style={styles.geoContainer}>
          <GeolocationButton onLocationFound={handleGeolocationFound} variant="outline" />
        </View>

        {/* Categories Section */}
        <View style={styles.section}>
          <CategoryGrid onCategoryPress={handleCategoryPress} />
        </View>

        {/* Featured Establishments Carousel */}
        <View style={styles.section}>
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
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  scrollView: {
    flex: 1,
  },
  contentContainer: {
    paddingBottom: SPACING.xl,
  },
  heroSection: {
    paddingTop: SPACING.xxl + SPACING.md,
    paddingBottom: SPACING.xl,
    paddingHorizontal: SPACING.lg,
    alignItems: 'center',
  },
  heroTitle: {
    ...Typography.h1,
    fontSize: 36, // Légèrement réduit pour mobile
    color: COLORS.textLight,
    marginBottom: SPACING.xs,
    textAlign: 'center',
  },
  heroSubtitle: {
    ...Typography.body,
    fontSize: 16,
    color: COLORS.textLight,
    opacity: 0.95,
    textAlign: 'center',
  },
  searchBarContainer: {
    paddingHorizontal: SPACING.md,
    marginTop: -SPACING.lg,
    marginBottom: SPACING.md,
  },
  geoContainer: {
    paddingHorizontal: SPACING.md,
    marginBottom: SPACING.md,
  },
  section: {
    marginTop: SPACING.lg,
  },
});
