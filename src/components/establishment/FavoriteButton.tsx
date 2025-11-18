import React, { useState, useEffect } from 'react';
import { TouchableOpacity, StyleSheet, Animated, ActivityIndicator, Platform, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS, SPACING, BORDER_RADIUS, Shadows, ButtonGradient } from '@constants';
import { useIsFavorite, useToggleFavorite, useFavorites } from '@hooks/useFavorites';
import { useAuthStore } from '@store';

interface FavoriteButtonProps {
  establishmentId?: string;
  eventId?: string;
  size?: 'small' | 'medium' | 'large';
  variant?: 'icon' | 'filled' | 'outline';
  onToggle?: (isFavorite: boolean) => void;
}

export const FavoriteButton: React.FC<FavoriteButtonProps> = ({
  establishmentId,
  eventId,
  size = 'medium',
  variant = 'icon',
  onToggle,
}) => {
  const { user } = useAuthStore();
  const type = establishmentId ? 'establishment' : 'event';
  const id = establishmentId || eventId || '';

  const { data: isFavorite = false, isLoading } = useIsFavorite(type as 'establishment' | 'event', id);
  const toggleFavorite = useToggleFavorite();
  const { data: favoritesData } = useFavorites();

  const [scaleAnim] = useState(new Animated.Value(1));
  const [heartAnim] = useState(new Animated.Value(isFavorite ? 1 : 0));

  // Trouver le favoriteId dans la liste des favoris (pour la suppression)
  const favoriteId = React.useMemo(() => {
    if (!favoritesData || !isFavorite) return undefined;
    
    const allFavorites = favoritesData.pages.flatMap(page => page.data);
    const favorite = allFavorites.find(
      fav => (establishmentId && fav.establishmentId === establishmentId) ||
             (eventId && fav.eventId === eventId)
    );
    return favorite?.id;
  }, [favoritesData, isFavorite, establishmentId, eventId]);

  useEffect(() => {
    // Animation du cœur quand le statut change
    Animated.spring(heartAnim, {
      toValue: isFavorite ? 1 : 0,
      useNativeDriver: true,
      tension: 100,
      friction: 7,
    }).start();
  }, [isFavorite, heartAnim]);

  const handlePress = async () => {
    if (!user) {
      // Rediriger vers la page de connexion si non connecté
      return;
    }

    // Animation de scale au press
    Animated.sequence([
      Animated.spring(scaleAnim, {
        toValue: 0.9,
        useNativeDriver: true,
        tension: 300,
        friction: 10,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        useNativeDriver: true,
        tension: 300,
        friction: 10,
      }),
    ]).start();

    try {
      await toggleFavorite.mutateAsync({
        type: type as 'establishment' | 'event',
        id,
        favoriteId,
        isCurrentlyFavorite: isFavorite,
      });

      onToggle?.(!isFavorite);
    } catch (error) {
      console.error('Erreur lors du toggle favori:', error);
    }
  };

  const sizeStyles = {
    small: { width: 32, height: 32, iconSize: 16 },
    medium: { width: 44, height: 44, iconSize: 22 },
    large: { width: 56, height: 56, iconSize: 28 },
  };

  const currentSize = sizeStyles[size];

  if (!user) {
    return null; // Ne pas afficher le bouton si non connecté
  }

  const heartScale = heartAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0.8, 1.2],
  });

  const heartOpacity = heartAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0.5, 1],
  });

  if (variant === 'filled') {
    return (
      <TouchableOpacity
        onPress={handlePress}
        disabled={toggleFavorite.isPending || isLoading}
        activeOpacity={0.8}
        style={styles.container}
      >
        <Animated.View style={[{ transform: [{ scale: scaleAnim }] }]}>
          <LinearGradient
            colors={isFavorite ? ButtonGradient.colors : [COLORS.gray200, COLORS.gray300]}
            start={ButtonGradient.start}
            end={ButtonGradient.end}
            style={[
              styles.filledButton,
              {
                width: currentSize.width,
                height: currentSize.height,
                borderRadius: currentSize.width / 2,
              },
            ]}
          >
            {toggleFavorite.isPending || isLoading ? (
              <ActivityIndicator size="small" color={COLORS.textLight} />
            ) : (
              <Animated.Text
                style={[
                  styles.heartIcon,
                  {
                    fontSize: currentSize.iconSize,
                    transform: [{ scale: heartScale }],
                    opacity: heartOpacity,
                  },
                ]}
              >
                {isFavorite ? '❤️' : '🤍'}
              </Animated.Text>
            )}
          </LinearGradient>
        </Animated.View>
      </TouchableOpacity>
    );
  }

  if (variant === 'outline') {
    return (
      <TouchableOpacity
        onPress={handlePress}
        disabled={toggleFavorite.isPending || isLoading}
        activeOpacity={0.8}
        style={[
          styles.outlineButton,
          {
            width: currentSize.width,
            height: currentSize.height,
            borderRadius: currentSize.width / 2,
            borderWidth: isFavorite ? 2 : 1,
            borderColor: isFavorite ? COLORS.brandOrange : COLORS.gray300,
          },
        ]}
      >
        {toggleFavorite.isPending || isLoading ? (
          <ActivityIndicator size="small" color={COLORS.brandOrange} />
        ) : (
          <Animated.Text
            style={[
              styles.heartIcon,
              {
                fontSize: currentSize.iconSize,
                transform: [{ scale: heartScale }],
                opacity: heartOpacity,
                color: isFavorite ? COLORS.brandOrange : COLORS.gray500,
              },
            ]}
          >
            {isFavorite ? '❤️' : '🤍'}
          </Animated.Text>
        )}
      </TouchableOpacity>
    );
  }

  // Variant 'icon' par défaut
  return (
    <TouchableOpacity
      onPress={handlePress}
      disabled={toggleFavorite.isPending || isLoading}
      activeOpacity={0.8}
      style={styles.container}
    >
      <Animated.View style={[{ transform: [{ scale: scaleAnim }] }]}>
        <View
          style={[
            styles.iconButton,
            {
              width: currentSize.width,
              height: currentSize.height,
              borderRadius: currentSize.width / 2,
            },
          ]}
        >
          {toggleFavorite.isPending || isLoading ? (
            <ActivityIndicator size="small" color={COLORS.brandOrange} />
          ) : (
            <Animated.Text
              style={[
                styles.heartIcon,
                {
                  fontSize: currentSize.iconSize,
                  transform: [{ scale: heartScale }],
                  opacity: heartOpacity,
                },
              ]}
            >
              {isFavorite ? '❤️' : '🤍'}
            </Animated.Text>
          )}
        </View>
      </Animated.View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    alignItems: 'center',
    justifyContent: 'center',
    ...Shadows.card,
    ...Platform.select({
      ios: {
        shadowOpacity: 0.2,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  filledButton: {
    alignItems: 'center',
    justifyContent: 'center',
    ...Shadows.buttonGradient,
  },
  outlineButton: {
    backgroundColor: COLORS.background,
    alignItems: 'center',
    justifyContent: 'center',
    ...Shadows.card,
  },
  heartIcon: {
    textAlign: 'center',
  },
});

