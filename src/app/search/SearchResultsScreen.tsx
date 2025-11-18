import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useSearchEstablishments, useEstablishments } from '@hooks';
import { EstablishmentCard } from '@components/search/EstablishmentCard';
import { FilterBar, type FilterType } from '@components/search/FilterBar';
import { COLORS, SPACING, FONT_SIZES } from '@constants';
import type { Establishment, SearchFilters } from '@types';
import type { AppStackParamList } from '@navigation/types';

type NavigationProp = NativeStackNavigationProp<AppStackParamList>;
type RouteProp = {
  params?: {
    city?: string;
    activity?: string;
    category?: string;
    filters?: SearchFilters;
  };
};

export const SearchResultsScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();
  const route = useRoute<RouteProp>();
  const [selectedFilter, setSelectedFilter] = useState<FilterType | undefined>();
  const [viewMode, setViewMode] = useState<'list' | 'map'>('list');

  const { city, activity, category, filters: routeFilters } = route.params || {};

  // Construire les filtres de recherche selon les spécifications exactes
  const searchFilters: SearchFilters = useMemo(() => {
    const baseFilters: SearchFilters = {
      ...routeFilters,
      query: activity,
      city,
      category,
    };

    // Appliquer le filtre sélectionné selon la logique exacte du backend
    switch (selectedFilter) {
      case 'popular':
        // Tri par viewsCount (décroissant)
        return { ...baseFilters, sortBy: 'relevance', sortOrder: 'desc' };
      case 'wanted':
        // Tri par likesCount (décroissant)
        return { ...baseFilters, sortBy: 'relevance', sortOrder: 'desc' }; // Le backend gère ça
      case 'cheap':
        // Tri par priceMin/prixMoyen (croissant)
        return { ...baseFilters, sortBy: 'price', sortOrder: 'asc' };
      case 'premium':
        // Tri par subscription (PREMIUM > FREE) puis score
        return { ...baseFilters, sortBy: 'relevance', sortOrder: 'desc' }; // Le backend gère ça
      case 'newest':
        // Tri par createdAt (décroissant)
        return { ...baseFilters, sortBy: 'date', sortOrder: 'desc' };
      case 'rating':
        // Tri par avgRating (décroissant)
        return { ...baseFilters, sortBy: 'rating', sortOrder: 'desc' };
      default:
        return baseFilters;
    }
  }, [city, activity, category, routeFilters, selectedFilter]);

  // Utiliser la recherche si on a des critères, sinon la liste générale
  const hasSearchCriteria = !!(city || activity || category || routeFilters);

  const {
    data: searchData,
    fetchNextPage: fetchNextSearchPage,
    hasNextPage: hasNextSearchPage,
    isFetchingNextPage: isFetchingNextSearchPage,
    isLoading: isLoadingSearch,
  } = useSearchEstablishments(searchFilters);

  const {
    data: listData,
    fetchNextPage: fetchNextListPage,
    hasNextPage: hasNextListPage,
    isFetchingNextPage: isFetchingNextListPage,
    isLoading: isLoadingList,
  } = useEstablishments(searchFilters);

  // Utiliser les données de recherche ou de liste selon les critères
  const data = hasSearchCriteria ? searchData : listData;
  const fetchNextPage = hasSearchCriteria ? fetchNextSearchPage : fetchNextListPage;
  const hasNextPage = hasSearchCriteria ? hasNextSearchPage : hasNextListPage;
  const isFetchingNextPage = hasSearchCriteria ? isFetchingNextSearchPage : isFetchingNextListPage;
  const isLoading = hasSearchCriteria ? isLoadingSearch : isLoadingList;

  // Aplatir les données de toutes les pages
  const establishments = useMemo(() => data?.pages.flatMap(page => page.data) ?? [], [data]);

  const handleFilterPress = (filter: FilterType) => {
    setSelectedFilter(selectedFilter === filter ? undefined : filter);
  };

  const handleEstablishmentPress = (establishment: Establishment) => {
    navigation.navigate('EstablishmentDetails', { establishmentId: establishment.id });
  };

  const renderEstablishment = ({ item }: { item: Establishment }) => (
    <EstablishmentCard establishment={item} onPress={handleEstablishmentPress} />
  );

  const renderFooter = () => {
    if (!isFetchingNextPage) return null;
    return (
      <View style={styles.footer}>
        <ActivityIndicator size="small" color={COLORS.primary} />
      </View>
    );
  };

  const renderEmpty = () => (
    <View style={styles.emptyContainer}>
      <Text style={styles.emptyIcon}>🔍</Text>
      <Text style={styles.emptyTitle}>Aucun résultat</Text>
      <Text style={styles.emptyText}>
        Essayez de modifier vos critères de recherche ou vos filtres.
      </Text>
    </View>
  );

  if (viewMode === 'map') {
    // TODO: Implémenter la vue carte avec une carte interactive
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>
            {city ? `Recherche à ${city}` : 'Résultats de recherche'}
          </Text>
          <TouchableOpacity style={styles.viewToggle} onPress={() => setViewMode('list')}>
            <Text style={styles.viewToggleText}>📋 Liste</Text>
          </TouchableOpacity>
        </View>
        <FilterBar selectedFilter={selectedFilter} onFilterPress={handleFilterPress} />
        <View style={styles.mapPlaceholder}>
          <Text style={styles.mapPlaceholderText}>🗺️ Vue carte à implémenter</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <Text style={styles.headerTitle} numberOfLines={1}>
            {city ? `Recherche à ${city}` : 'Résultats de recherche'}
            {activity && ` • ${activity}`}
          </Text>
          <Text style={styles.resultCount}>
            {establishments.length} {establishments.length > 1 ? 'résultats' : 'résultat'}
          </Text>
        </View>
        <TouchableOpacity style={styles.viewToggle} onPress={() => setViewMode('map')}>
          <Text style={styles.viewToggleText}>🗺️ Carte</Text>
        </TouchableOpacity>
      </View>

      {/* Filter Bar */}
      <FilterBar selectedFilter={selectedFilter} onFilterPress={handleFilterPress} />

      {/* Results List */}
      {isLoading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={COLORS.primary} />
        </View>
      ) : (
        <FlatList
          data={establishments}
          renderItem={renderEstablishment}
          keyExtractor={item => item.id}
          contentContainerStyle={styles.listContent}
          onEndReached={() => {
            if (hasNextPage && !isFetchingNextPage) {
              fetchNextPage();
            }
          }}
          onEndReachedThreshold={0.5}
          ListFooterComponent={renderFooter}
          ListEmptyComponent={renderEmpty}
          showsVerticalScrollIndicator={false}
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
  header: {
    backgroundColor: COLORS.background,
    padding: SPACING.md,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  headerContent: {
    flex: 1,
    marginRight: SPACING.md,
  },
  headerTitle: {
    fontSize: FONT_SIZES.lg,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: SPACING.xs,
  },
  resultCount: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.textSecondary,
  },
  viewToggle: {
    backgroundColor: COLORS.primary,
    borderRadius: 8,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.xs,
  },
  viewToggleText: {
    color: COLORS.textLight,
    fontSize: FONT_SIZES.sm,
    fontWeight: '600',
  },
  listContent: {
    padding: SPACING.md,
  },
  footer: {
    padding: SPACING.md,
    alignItems: 'center',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: SPACING.xl,
  },
  emptyIcon: {
    fontSize: 64,
    marginBottom: SPACING.md,
  },
  emptyTitle: {
    fontSize: FONT_SIZES.xl,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: SPACING.sm,
  },
  emptyText: {
    fontSize: FONT_SIZES.md,
    color: COLORS.textSecondary,
    textAlign: 'center',
  },
  mapPlaceholder: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.backgroundSecondary,
  },
  mapPlaceholderText: {
    fontSize: FONT_SIZES.lg,
    color: COLORS.textSecondary,
  },
});
