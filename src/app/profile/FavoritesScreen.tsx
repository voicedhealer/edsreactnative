import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import {
  COLORS,
  SPACING,
  BORDER_RADIUS,
  FONT_SIZES,
  Shadows,
} from '@constants';
import { useFavorites, useRemoveFavorite } from '@hooks/useFavorites';
import { EstablishmentCard } from '@components/search/EstablishmentCard';
import type { AppStackParamList } from '@navigation/types';
import type { Favorite, Establishment, Event } from '@types';

type FavoritesScreenNavigationProp = StackNavigationProp<AppStackParamList>;

export const FavoritesScreen: React.FC = () => {
  const navigation = useNavigation<FavoritesScreenNavigationProp>();
  const {
    data: favoritesData,
    isLoading,
    isFetchingNextPage,
    fetchNextPage,
    hasNextPage,
    refetch,
    isRefetching,
  } = useFavorites();
  const removeFavorite = useRemoveFavorite();

  // Flatten des favoris depuis toutes les pages
  const favorites = React.useMemo(() => {
    if (!favoritesData) return [];
    return favoritesData.pages.flatMap((page) => page.data);
  }, [favoritesData]);

  const handleRemoveFavorite = async (favoriteId: string) => {
    try {
      await removeFavorite.mutateAsync(favoriteId);
    } catch (error) {
      console.error('Erreur lors de la suppression du favori:', error);
    }
  };

  const handleEstablishmentPress = (establishment: Establishment) => {
    navigation.navigate('EstablishmentDetails', {
      establishmentId: establishment.id,
    });
  };

  const handleEventPress = (event: Event) => {
    navigation.navigate('EventDetails', {
      eventId: event.id,
    });
  };

  const renderFavoriteItem = ({ item }: { item: Favorite }) => {
    if (item.establishment) {
      return (
        <View style={styles.favoriteItem}>
          <EstablishmentCard
            establishment={item.establishment}
            onPress={handleEstablishmentPress}
            variant="default"
          />
          <TouchableOpacity
            style={styles.removeButton}
            onPress={() => handleRemoveFavorite(item.id)}
            activeOpacity={0.8}
          >
            <Text style={styles.removeButtonText}>Retirer des favoris</Text>
          </TouchableOpacity>
        </View>
      );
    }

    if (item.event) {
      return (
        <View style={styles.favoriteItem}>
          <TouchableOpacity
            style={styles.eventCard}
            onPress={() => handleEventPress(item.event!)}
            activeOpacity={0.9}
          >
            <View style={styles.eventHeader}>
              <Text style={styles.eventTitle}>{item.event.title}</Text>
              {item.event.establishment && (
                <Text style={styles.eventEstablishment}>
                  📍 {item.event.establishment.name}
                </Text>
              )}
            </View>
            {item.event.description && (
              <Text style={styles.eventDescription} numberOfLines={2}>
                {item.event.description}
              </Text>
            )}
            <View style={styles.eventFooter}>
              <Text style={styles.eventCategory}>{item.event.category}</Text>
              {item.event.price && (
                <Text style={styles.eventPrice}>{item.event.price}€</Text>
              )}
            </View>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.removeButton}
            onPress={() => handleRemoveFavorite(item.id)}
            activeOpacity={0.8}
          >
            <Text style={styles.removeButtonText}>Retirer des favoris</Text>
          </TouchableOpacity>
        </View>
      );
    }

    return null;
  };

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={COLORS.brandOrange} />
        <Text style={styles.loadingText}>Chargement de vos favoris...</Text>
      </View>
    );
  }

  if (favorites.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyEmoji}>❤️</Text>
        <Text style={styles.emptyTitle}>Aucun favori</Text>
        <Text style={styles.emptyText}>
          Commencez à ajouter des établissements et événements à vos favoris pour les retrouver
          facilement !
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={favorites}
        renderItem={renderFavoriteItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={isRefetching}
            onRefresh={refetch}
            tintColor={COLORS.brandOrange}
          />
        }
        onEndReached={() => {
          if (hasNextPage && !isFetchingNextPage) {
            fetchNextPage();
          }
        }}
        onEndReachedThreshold={0.5}
        ListFooterComponent={
          isFetchingNextPage ? (
            <View style={styles.footerLoader}>
              <ActivityIndicator size="small" color={COLORS.brandOrange} />
            </View>
          ) : null
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  listContent: {
    padding: SPACING.md,
  },
  favoriteItem: {
    marginBottom: SPACING.md,
  },
  eventCard: {
    backgroundColor: COLORS.background,
    borderRadius: BORDER_RADIUS.card,
    padding: SPACING.md,
    ...Shadows.card,
    marginBottom: SPACING.sm,
  },
  eventHeader: {
    marginBottom: SPACING.sm,
  },
  eventTitle: {
    fontSize: FONT_SIZES.lg,
    fontWeight: '700',
    color: COLORS.textPrimary,
    marginBottom: SPACING.xs / 2,
  },
  eventEstablishment: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.textSecondary,
  },
  eventDescription: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.textSecondary,
    marginBottom: SPACING.sm,
    lineHeight: 20,
  },
  eventFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  eventCategory: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.brandOrange,
    fontWeight: '600',
  },
  eventPrice: {
    fontSize: FONT_SIZES.md,
    fontWeight: '700',
    color: COLORS.textPrimary,
  },
  removeButton: {
    backgroundColor: COLORS.gray100,
    borderRadius: BORDER_RADIUS.md,
    paddingVertical: SPACING.sm,
    paddingHorizontal: SPACING.md,
    alignItems: 'center',
  },
  removeButtonText: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.error,
    fontWeight: '600',
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
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: SPACING.xl,
    backgroundColor: COLORS.background,
  },
  emptyEmoji: {
    fontSize: 64,
    marginBottom: SPACING.md,
  },
  emptyTitle: {
    fontSize: FONT_SIZES.xl,
    fontWeight: '700',
    color: COLORS.textPrimary,
    marginBottom: SPACING.sm,
  },
  emptyText: {
    fontSize: FONT_SIZES.md,
    color: COLORS.textSecondary,
    textAlign: 'center',
    lineHeight: 24,
  },
  footerLoader: {
    paddingVertical: SPACING.md,
    alignItems: 'center',
  },
});

