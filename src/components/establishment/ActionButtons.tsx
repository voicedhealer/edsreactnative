import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, Animated } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import * as Sharing from 'expo-sharing';
import * as Linking from 'expo-linking';
import {
  COLORS,
  SPACING,
  BORDER_RADIUS,
  FONT_SIZES,
  ButtonGradient,
  Shadows,
  Typography,
} from '@constants';
import { useToggleFavorite, useIsFavorite, useFavorites } from '@hooks/useFavorites';

interface ActionButtonsProps {
  establishmentId: string;
  establishmentName: string;
  isFavorite?: boolean;
  favoriteId?: string;
  onFavoriteChange?: (isFavorite: boolean) => void;
}

export const ActionButtons: React.FC<ActionButtonsProps> = ({
  establishmentId,
  establishmentName,
  isFavorite: initialIsFavorite,
  favoriteId: propFavoriteId,
  onFavoriteChange,
}) => {
  const [scaleAnim] = useState(new Animated.Value(1));
  const toggleFavorite = useToggleFavorite();
  const { data: isFavorite = false } = useIsFavorite('establishment', establishmentId);
  const { data: favoritesData } = useFavorites();

  // Trouver le favoriteId dans la liste des favoris
  const currentFavoriteId = React.useMemo(() => {
    if (propFavoriteId) return propFavoriteId;
    if (!favoritesData || !isFavorite) return undefined;
    
    const allFavorites = favoritesData.pages.flatMap(page => page.data);
    const favorite = allFavorites.find(
      fav => fav.establishmentId === establishmentId
    );
    return favorite?.id;
  }, [propFavoriteId, favoritesData, isFavorite, establishmentId]);

  const handleFavorite = async () => {
    try {
      // Animation
      Animated.sequence([
        Animated.spring(scaleAnim, {
          toValue: 1.2,
          useNativeDriver: true,
          friction: 3,
        }),
        Animated.spring(scaleAnim, {
          toValue: 1,
          useNativeDriver: true,
          friction: 3,
        }),
      ]).start();

      await toggleFavorite.mutateAsync({
        type: 'establishment',
        id: establishmentId,
        favoriteId: currentFavoriteId,
        isCurrentlyFavorite: isFavorite,
      });

      onFavoriteChange?.(!isFavorite);
    } catch (error) {
      Alert.alert('Erreur', 'Impossible de modifier les favoris');
    }
  };

  const handleShare = async () => {
    try {
      // Créer l'URL de deep linking selon la configuration
      const shareUrl = Linking.createURL(`establishment/${establishmentId}`, {
        scheme: 'envie2sortir',
      });

      // URL web de fallback
      const webUrl = `https://envie2sortir.com/establishment/${establishmentId}`;

      if (await Sharing.isAvailableAsync()) {
        await Sharing.shareAsync(shareUrl, {
          message: `Découvrez ${establishmentName} sur Envie2Sortir !\n${webUrl}`,
          url: shareUrl,
        });
      } else {
        Alert.alert('Partage non disponible', "Le partage n'est pas disponible sur cet appareil");
      }
    } catch (error) {
      Alert.alert('Erreur', 'Impossible de partager');
    }
  };

  const handleNavigation = () => {
    // Ouvrir l'application de navigation avec les coordonnées
    // Cette fonctionnalité nécessiterait les coordonnées de l'établissement
    Alert.alert('Navigation', 'Fonctionnalité de navigation à implémenter');
  };

  return (
    <View style={styles.container}>
      {/* Bouton Favoris */}
      <TouchableOpacity style={styles.actionButton} onPress={handleFavorite} activeOpacity={0.8}>
        <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
          <View style={[styles.favoriteButton, isFavorite && styles.favoriteButtonActive]}>
            <Text style={styles.favoriteIcon}>{isFavorite ? '❤️' : '🤍'}</Text>
            <Text style={[styles.favoriteText, isFavorite && styles.favoriteTextActive]}>
              {isFavorite ? 'Favori' : 'Ajouter'}
            </Text>
          </View>
        </Animated.View>
      </TouchableOpacity>

      {/* Bouton Partager */}
      <TouchableOpacity style={styles.actionButton} onPress={handleShare} activeOpacity={0.8}>
        <View style={styles.shareButton}>
          <Text style={styles.shareIcon}>📤</Text>
          <Text style={styles.shareText}>Partager</Text>
        </View>
      </TouchableOpacity>

      {/* Bouton Navigation */}
      <TouchableOpacity style={styles.actionButton} onPress={handleNavigation} activeOpacity={0.8}>
        <LinearGradient
          colors={ButtonGradient.colors}
          start={ButtonGradient.start}
          end={ButtonGradient.end}
          locations={ButtonGradient.locations}
          style={styles.navigationButton}
        >
          <Text style={styles.navigationIcon}>🧭</Text>
          <Text style={styles.navigationText}>Y aller</Text>
        </LinearGradient>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    gap: SPACING.sm,
    padding: SPACING.md,
    backgroundColor: COLORS.background,
  },
  actionButton: {
    flex: 1,
  },
  favoriteButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.gray100,
    borderRadius: BORDER_RADIUS.md,
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.sm,
    gap: SPACING.xs,
    ...Shadows.card,
  },
  favoriteButtonActive: {
    backgroundColor: COLORS.brandPink + '20',
  },
  favoriteIcon: {
    fontSize: FONT_SIZES.lg,
  },
  favoriteText: {
    fontSize: Typography.small.fontSize,
    fontWeight: '600',
    color: COLORS.textPrimary,
  },
  favoriteTextActive: {
    color: COLORS.brandPink,
  },
  shareButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.gray100,
    borderRadius: BORDER_RADIUS.md,
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.sm,
    gap: SPACING.xs,
    ...Shadows.card,
  },
  shareIcon: {
    fontSize: FONT_SIZES.lg,
  },
  shareText: {
    fontSize: Typography.small.fontSize,
    fontWeight: '600',
    color: COLORS.textPrimary,
  },
  navigationButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: BORDER_RADIUS.md,
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.sm,
    gap: SPACING.xs,
    ...Shadows.buttonGradient,
  },
  navigationIcon: {
    fontSize: FONT_SIZES.lg,
  },
  navigationText: {
    fontSize: Typography.small.fontSize,
    fontWeight: '600',
    color: COLORS.textLight,
  },
});
