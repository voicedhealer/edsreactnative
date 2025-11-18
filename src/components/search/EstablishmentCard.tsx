import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ViewStyle,
  Animated,
  Platform,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import {
  COLORS,
  SPACING,
  BORDER_RADIUS,
  FONT_SIZES,
  Shadows,
  PremiumBorderGradient,
} from '@constants';
import { FavoriteButton } from '@components/establishment/FavoriteButton';
import type { Establishment } from '@types';

interface EstablishmentCardProps {
  establishment: Establishment;
  onPress: (establishment: Establishment) => void;
  style?: ViewStyle;
  variant?: 'default' | 'compact';
}

export const EstablishmentCard: React.FC<EstablishmentCardProps> = ({
  establishment,
  onPress,
  style,
  variant = 'default',
}) => {
  const [scaleAnim] = useState(new Animated.Value(1));
  const isCompact = variant === 'compact';

  // Propriétés étendues (si disponibles dans le type)
  const subscription = (establishment as any).subscription as 'FREE' | 'PREMIUM' | undefined;
  const isHot = (establishment as any).isHot as boolean | undefined;
  const activeDeal = (establishment as any).activeDeal as boolean | undefined;
  const distance = (establishment as any).distance as number | undefined;
  const isOpen = (establishment as any).isOpen as boolean | undefined;

  const handlePressIn = () => {
    Animated.spring(scaleAnim, {
      toValue: 0.98,
      useNativeDriver: true,
      friction: 8,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      useNativeDriver: true,
      friction: 8,
    }).start();
  };

  const isPremium = subscription === 'PREMIUM';

  return (
    <Animated.View
      style={[
        styles.cardContainer,
        { transform: [{ scale: scaleAnim }] },
        isPremium && styles.premiumCard,
        style,
      ]}
    >
      <TouchableOpacity
        style={[styles.card, isCompact && styles.compactCard]}
        onPress={() => onPress(establishment)}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        activeOpacity={0.9}
      >
        {/* Image Container */}
        <View style={[styles.imageContainer, isCompact && styles.compactImageContainer]}>
          {establishment.images && establishment.images.length > 0 ? (
            <Image
              source={{ uri: establishment.images[0] }}
              style={styles.image}
              resizeMode="cover"
            />
          ) : (
            <View style={[styles.image, styles.placeholderImage]}>
              <Text style={styles.placeholderText}>📷</Text>
            </View>
          )}

          {/* Badge Bon Plan (si actif) */}
          {activeDeal && (
            <View style={styles.bonPlanBadge}>
              <Text style={styles.bonPlanText}>🎁 Bon Plan</Text>
            </View>
          )}

          {/* Statut ouvert/fermé */}
          {isOpen !== undefined && (
            <View style={[styles.statusBadge, isOpen ? styles.statusOpen : styles.statusClosed]}>
              <View style={[styles.statusDot, isOpen && styles.statusDotOpen]} />
              <Text style={styles.statusText}>{isOpen ? 'Ouvert' : 'Fermé'}</Text>
            </View>
          )}

          {/* Badge Tendance (si hot) */}
          {isHot && (
            <View style={styles.trendingBadge}>
              <Text style={styles.trendingIcon}>🔥</Text>
              <Text style={styles.trendingText}>Tendance</Text>
            </View>
          )}

          {/* Badge Premium */}
          {isPremium && (
            <View style={styles.premiumBadge}>
              <LinearGradient
                colors={PremiumBorderGradient.colors}
                start={PremiumBorderGradient.start}
                end={PremiumBorderGradient.end}
                locations={PremiumBorderGradient.locations}
                style={styles.premiumBadgeGradient}
              >
                <Text style={styles.premiumBadgeText}>👑 Premium</Text>
              </LinearGradient>
            </View>
          )}

          {/* Bouton Favoris */}
          <View style={styles.favoriteButtonContainer}>
            <FavoriteButton establishmentId={establishment.id} size="small" variant="icon" />
          </View>
        </View>

        {/* Content */}
        <View style={styles.content}>
          <View style={styles.header}>
            <Text style={styles.name} numberOfLines={1}>
              {establishment.name}
            </Text>
            {establishment.rating && (
              <View style={styles.ratingContainer}>
                <Text style={styles.ratingIcon}>⭐</Text>
                <Text style={styles.rating}>{establishment.rating.toFixed(1)}</Text>
              </View>
            )}
          </View>

          <Text style={styles.category}>{establishment.category}</Text>

          {!isCompact && establishment.description && (
            <Text style={styles.description} numberOfLines={2}>
              {establishment.description}
            </Text>
          )}

          <View style={styles.footer}>
            <Text style={styles.location}>
              📍 {establishment.city}
              {establishment.address && ` • ${establishment.address}`}
            </Text>
            {distance !== undefined && (
              <Text style={styles.distance}>{distance.toFixed(1)} km</Text>
            )}
          </View>

          {/* Price Range */}
          {establishment.priceRange && (
            <View style={styles.priceContainer}>
              <Text style={styles.priceRange}>{establishment.priceRange}</Text>
            </View>
          )}

          {/* Tags */}
          {establishment.tags && establishment.tags.length > 0 && (
            <View style={styles.tagsContainer}>
              {establishment.tags.slice(0, 3).map((tag, index) => (
                <View key={index} style={styles.tag}>
                  <Text style={styles.tagText}>{tag}</Text>
                </View>
              ))}
            </View>
          )}
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  cardContainer: {
    marginBottom: SPACING.md,
  },
  premiumCard: {
    borderRadius: BORDER_RADIUS.card,
    padding: 2, // Pour la bordure gradient
    backgroundColor: COLORS.background,
  },
  card: {
    backgroundColor: COLORS.background,
    borderRadius: BORDER_RADIUS.card,
    overflow: 'hidden',
    ...Shadows.card,
  },
  compactCard: {
    flexDirection: 'row',
    height: 120,
  },
  imageContainer: {
    width: '100%',
    height: 192, // h-48 (mobile)
    position: 'relative',
  },
  compactImageContainer: {
    width: 120,
    height: '100%',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  placeholderImage: {
    backgroundColor: COLORS.gray100,
    alignItems: 'center',
    justifyContent: 'center',
  },
  placeholderText: {
    fontSize: 48,
  },
  // Badge Bon Plan
  bonPlanBadge: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(127, 0, 254, 0.6)', // violet avec transparence
    paddingVertical: SPACING.sm,
    paddingHorizontal: SPACING.md,
    borderTopLeftRadius: BORDER_RADIUS.card,
    borderTopRightRadius: BORDER_RADIUS.card,
    ...Platform.select({
      ios: {
        backdropFilter: 'blur(2px)',
      },
    }),
  },
  bonPlanText: {
    color: COLORS.textLight,
    fontSize: FONT_SIZES.sm,
    fontWeight: '600',
    textAlign: 'center',
  },
  // Statut ouvert/fermé
  statusBadge: {
    position: 'absolute',
    top: SPACING.sm,
    left: SPACING.sm,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: BORDER_RADIUS.full,
    paddingHorizontal: SPACING.sm,
    paddingVertical: SPACING.xs,
    gap: SPACING.xs / 2,
  },
  statusOpen: {},
  statusClosed: {},
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: COLORS.error,
  },
  statusDotOpen: {
    backgroundColor: COLORS.success,
  },
  statusText: {
    fontSize: FONT_SIZES.xs,
    fontWeight: '600',
    color: COLORS.text,
  },
  // Badge Tendance
  trendingBadge: {
    position: 'absolute',
    bottom: SPACING.sm,
    right: SPACING.sm,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 117, 31, 0.9)', // orange avec transparence
    borderRadius: BORDER_RADIUS.full,
    paddingHorizontal: SPACING.sm,
    paddingVertical: SPACING.xs,
    gap: SPACING.xs / 2,
  },
  trendingIcon: {
    fontSize: FONT_SIZES.sm,
  },
  trendingText: {
    fontSize: FONT_SIZES.xs,
    fontWeight: '600',
    color: COLORS.textLight,
  },
  // Badge Premium
  premiumBadge: {
    position: 'absolute',
    top: SPACING.sm,
    right: SPACING.sm,
  },
  premiumBadgeGradient: {
    borderRadius: BORDER_RADIUS.full,
    paddingHorizontal: SPACING.sm,
    paddingVertical: SPACING.xs,
  },
  premiumBadgeText: {
    fontSize: FONT_SIZES.xs,
    fontWeight: '700',
    color: COLORS.textLight,
  },
  content: {
    padding: SPACING.md,
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: SPACING.xs,
  },
  name: {
    fontSize: FONT_SIZES.lg,
    fontWeight: '700',
    color: COLORS.textPrimary,
    flex: 1,
    marginRight: SPACING.xs,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.gray100,
    borderRadius: BORDER_RADIUS.sm,
    paddingHorizontal: SPACING.xs,
    paddingVertical: 2,
    gap: SPACING.xs / 2,
  },
  ratingIcon: {
    fontSize: FONT_SIZES.xs,
  },
  rating: {
    fontSize: FONT_SIZES.xs,
    fontWeight: '600',
    color: COLORS.textPrimary,
  },
  category: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.brandOrange,
    fontWeight: '600',
    marginBottom: SPACING.xs,
  },
  description: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.textSecondary,
    marginBottom: SPACING.xs,
    lineHeight: 20,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: SPACING.xs,
  },
  location: {
    fontSize: FONT_SIZES.xs,
    color: COLORS.textSecondary,
    flex: 1,
  },
  distance: {
    fontSize: FONT_SIZES.xs,
    color: COLORS.textSecondary,
    fontWeight: '600',
    marginLeft: SPACING.xs,
  },
  priceContainer: {
    marginTop: SPACING.xs,
  },
  priceRange: {
    fontSize: FONT_SIZES.sm,
    fontWeight: '600',
    color: COLORS.brandOrange,
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: SPACING.xs,
    marginTop: SPACING.xs,
  },
  tag: {
    backgroundColor: COLORS.gray100,
    borderRadius: BORDER_RADIUS.sm,
    paddingHorizontal: SPACING.xs,
    paddingVertical: 2,
  },
  tagText: {
    fontSize: FONT_SIZES.xs,
    color: COLORS.textSecondary,
  },
  favoriteButtonContainer: {
    position: 'absolute',
    top: SPACING.md,
    right: SPACING.md,
    zIndex: 10,
  },
});
