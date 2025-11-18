import React, { useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ScrollView,
  Dimensions,
  Platform,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import BottomSheet from '@gorhom/bottom-sheet';
import { COLORS, SPACING, BORDER_RADIUS, FONT_SIZES, Shadows, PremiumBorderGradient } from '@constants';
import type { Establishment } from '@types';

interface EstablishmentBottomSheetProps {
  establishment: Establishment | null;
  onClose: () => void;
  onPress: (establishment: Establishment) => void;
  snapPoints?: (string | number)[];
}

export const EstablishmentBottomSheet: React.FC<EstablishmentBottomSheetProps> = ({
  establishment,
  onClose,
  onPress,
  snapPoints = ['25%', '50%', '90%'],
}) => {
  const bottomSheetRef = React.useRef<BottomSheet>(null);

  React.useEffect(() => {
    if (establishment) {
      bottomSheetRef.current?.expand();
    } else {
      bottomSheetRef.current?.close();
    }
  }, [establishment]);

  const handleSheetChanges = useCallback((index: number) => {
    if (index === -1 && establishment) {
      onClose();
    }
  }, [establishment, onClose]);

  if (!establishment) {
    return null;
  }

  const subscription = (establishment as any).subscription as 'FREE' | 'PREMIUM' | undefined;
  const isHot = (establishment as any).isHot as boolean | undefined;
  const activeDeal = (establishment as any).activeDeal as boolean | undefined;
  const distance = (establishment as any).distance as number | undefined;
  const isOpen = (establishment as any).isOpen as boolean | undefined;
  const isPremium = subscription === 'PREMIUM';

  return (
    <BottomSheet
      ref={bottomSheetRef}
      index={-1}
      snapPoints={snapPoints}
      onChange={handleSheetChanges}
      enablePanDownToClose
      backgroundStyle={styles.bottomSheetBackground}
      handleIndicatorStyle={styles.handleIndicator}
    >
      <View style={styles.contentContainer}>
        <ScrollView showsVerticalScrollIndicator={false}>
          {/* Image Header */}
          <View style={styles.imageContainer}>
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

            {/* Badges overlay */}
            {activeDeal && (
              <View style={styles.bonPlanBadge}>
                <Text style={styles.bonPlanText}>🎁 Bon Plan</Text>
              </View>
            )}

            {isOpen !== undefined && (
              <View style={[styles.statusBadge, isOpen ? styles.statusOpen : styles.statusClosed]}>
                <View style={[styles.statusDot, isOpen && styles.statusDotOpen]} />
                <Text style={styles.statusText}>{isOpen ? 'Ouvert' : 'Fermé'}</Text>
              </View>
            )}

            {isHot && (
              <View style={styles.trendingBadge}>
                <Text style={styles.trendingIcon}>🔥</Text>
                <Text style={styles.trendingText}>Tendance</Text>
              </View>
            )}

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
          </View>

          {/* Content */}
          <View style={styles.content}>
            <View style={styles.header}>
              <Text style={styles.name} numberOfLines={2}>
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

            <View style={styles.locationRow}>
              <Text style={styles.location}>
                📍 {establishment.city}
                {establishment.address && ` • ${establishment.address}`}
              </Text>
              {distance !== undefined && (
                <Text style={styles.distance}>{distance.toFixed(1)} km</Text>
              )}
            </View>

            {establishment.description && (
              <Text style={styles.description}>{establishment.description}</Text>
            )}

            {/* Price Range */}
            {establishment.priceRange && (
              <View style={styles.priceContainer}>
                <Text style={styles.priceLabel}>Prix moyen:</Text>
                <Text style={styles.priceRange}>{establishment.priceRange}</Text>
              </View>
            )}

            {/* Tags */}
            {establishment.tags && establishment.tags.length > 0 && (
              <View style={styles.tagsContainer}>
                {establishment.tags.map((tag, index) => (
                  <View key={index} style={styles.tag}>
                    <Text style={styles.tagText}>{tag}</Text>
                  </View>
                ))}
              </View>
            )}

            {/* Action Button */}
            <TouchableOpacity
              style={styles.actionButton}
              onPress={() => onPress(establishment)}
              activeOpacity={0.9}
            >
              <LinearGradient
                colors={['#ff751f', '#ff1fa9']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.actionButtonGradient}
              >
                <Text style={styles.actionButtonText}>Voir les détails</Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </View>
    </BottomSheet>
  );
};

const styles = StyleSheet.create({
  bottomSheetBackground: {
    backgroundColor: COLORS.background,
    borderTopLeftRadius: BORDER_RADIUS.modal,
    borderTopRightRadius: BORDER_RADIUS.modal,
    ...Shadows.cardHover,
  },
  handleIndicator: {
    backgroundColor: COLORS.gray400,
    width: 40,
    height: 4,
  },
  contentContainer: {
    flex: 1,
  },
  imageContainer: {
    width: '100%',
    height: 200,
    position: 'relative',
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
  bonPlanBadge: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(127, 0, 254, 0.6)',
    paddingVertical: SPACING.sm,
    paddingHorizontal: SPACING.md,
    borderTopLeftRadius: BORDER_RADIUS.modal,
    borderTopRightRadius: BORDER_RADIUS.modal,
  },
  bonPlanText: {
    color: COLORS.textLight,
    fontSize: FONT_SIZES.sm,
    fontWeight: '600',
    textAlign: 'center',
  },
  statusBadge: {
    position: 'absolute',
    top: SPACING.md,
    left: SPACING.md,
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
  trendingBadge: {
    position: 'absolute',
    bottom: SPACING.md,
    right: SPACING.md,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 117, 31, 0.9)',
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
  premiumBadge: {
    position: 'absolute',
    top: SPACING.md,
    right: SPACING.md,
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
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: SPACING.xs,
  },
  name: {
    fontSize: FONT_SIZES.xl,
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
    paddingVertical: 4,
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
    fontSize: FONT_SIZES.md,
    color: COLORS.brandOrange,
    fontWeight: '600',
    marginBottom: SPACING.sm,
  },
  locationRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.sm,
  },
  location: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.textSecondary,
    flex: 1,
  },
  distance: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.textSecondary,
    fontWeight: '600',
    marginLeft: SPACING.xs,
  },
  description: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.textSecondary,
    lineHeight: 20,
    marginBottom: SPACING.sm,
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.sm,
    gap: SPACING.xs,
  },
  priceLabel: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.textSecondary,
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
    marginBottom: SPACING.md,
  },
  tag: {
    backgroundColor: COLORS.gray100,
    borderRadius: BORDER_RADIUS.sm,
    paddingHorizontal: SPACING.sm,
    paddingVertical: 4,
  },
  tagText: {
    fontSize: FONT_SIZES.xs,
    color: COLORS.textSecondary,
  },
  actionButton: {
    marginTop: SPACING.sm,
    borderRadius: BORDER_RADIUS.button,
    overflow: 'hidden',
    ...Shadows.buttonGradient,
  },
  actionButtonGradient: {
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.lg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionButtonText: {
    fontSize: FONT_SIZES.md,
    fontWeight: '700',
    color: COLORS.textLight,
  },
});

