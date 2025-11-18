import React, { useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ScrollView,
  Animated,
  Dimensions,
  PanResponder,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import {
  COLORS,
  SPACING,
  BORDER_RADIUS,
  FONT_SIZES,
  Shadows,
  ButtonGradient,
  PremiumBorderGradient,
} from '@constants';
import type { Establishment } from '@types';
import type { AppStackParamList } from '@navigation/types';

type NavigationProp = NativeStackNavigationProp<AppStackParamList>;

interface BottomSheetProps {
  establishment: Establishment;
  onClose: () => void;
  onViewDetails: () => void;
}

const { height: SCREEN_HEIGHT } = Dimensions.get('window');
const SHEET_HEIGHT = SCREEN_HEIGHT * 0.4; // 40% de l'écran
const MIN_SHEET_HEIGHT = 100; // Hauteur minimale

export const BottomSheet: React.FC<BottomSheetProps> = ({
  establishment,
  onClose,
  onViewDetails,
}) => {
  const navigation = useNavigation<NavigationProp>();
  const translateY = useRef(new Animated.Value(SHEET_HEIGHT)).current;
  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: (_, gestureState) => {
        return Math.abs(gestureState.dy) > 5;
      },
      onPanResponderMove: (_, gestureState) => {
        if (gestureState.dy > 0) {
          translateY.setValue(gestureState.dy);
        }
      },
      onPanResponderRelease: (_, gestureState) => {
        if (gestureState.dy > SHEET_HEIGHT / 3) {
          // Fermer si glissé vers le bas de plus d'un tiers
          closeSheet();
        } else {
          // Revenir à la position initiale
          Animated.spring(translateY, {
            toValue: 0,
            useNativeDriver: true,
            tension: 50,
            friction: 8,
          }).start();
        }
      },
    })
  ).current;

  useEffect(() => {
    // Animation d'ouverture
    Animated.spring(translateY, {
      toValue: 0,
      useNativeDriver: true,
      tension: 50,
      friction: 8,
    }).start();
  }, [translateY]);

  const closeSheet = () => {
    Animated.timing(translateY, {
      toValue: SHEET_HEIGHT,
      duration: 300,
      useNativeDriver: true,
    }).start(() => {
      onClose();
    });
  };

  // Propriétés étendues
  const subscription = (establishment as any).subscription as 'FREE' | 'PREMIUM' | undefined;
  const isPremium = subscription === 'PREMIUM';
  const isHot = (establishment as any).isHot as boolean | undefined;
  const activeDeal = (establishment as any).activeDeal as boolean | undefined;
  const distance = (establishment as any).distance as number | undefined;
  const isOpen = (establishment as any).isOpen as boolean | undefined;

  return (
    <>
      {/* Overlay */}
      <TouchableOpacity
        style={styles.overlay}
        activeOpacity={1}
        onPress={closeSheet}
      />

      {/* Bottom Sheet */}
      <Animated.View
        style={[
          styles.sheet,
          {
            transform: [{ translateY }],
          },
        ]}
        {...panResponder.panHandlers}
      >
        {/* Handle bar */}
        <View style={styles.handleContainer}>
          <View style={styles.handle} />
        </View>

        <ScrollView
          style={styles.content}
          contentContainerStyle={styles.contentContainer}
          showsVerticalScrollIndicator={false}
        >
          {/* Image */}
          <View style={styles.imageContainer}>
            {establishment.images && establishment.images.length > 0 ? (
              <Image
                source={{ uri: establishment.images[0] }}
                style={styles.image}
                resizeMode="cover"
              />
            ) : (
              <View style={styles.placeholderImage}>
                <Text style={styles.placeholderText}>📷</Text>
              </View>
            )}

            {/* Badges */}
            {activeDeal && (
              <View style={styles.bonPlanBadge}>
                <Text style={styles.bonPlanText}>🎁 Bon Plan</Text>
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

            {/* Statut ouvert/fermé */}
            {isOpen !== undefined && (
              <View style={[styles.statusBadge, isOpen ? styles.statusOpen : styles.statusClosed]}>
                <View style={[styles.statusDot, isOpen && styles.statusDotOpen]} />
                <Text style={styles.statusText}>{isOpen ? 'Ouvert' : 'Fermé'}</Text>
              </View>
            )}
          </View>

          {/* Contenu */}
          <View style={styles.infoContainer}>
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
              <Text style={styles.description} numberOfLines={3}>
                {establishment.description}
              </Text>
            )}

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
        </ScrollView>

        {/* Bouton action */}
        <View style={styles.actionContainer}>
          <TouchableOpacity
            style={styles.closeButton}
            onPress={closeSheet}
          >
            <Text style={styles.closeButtonText}>Fermer</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.detailsButton}
            onPress={onViewDetails}
          >
            <LinearGradient
              colors={ButtonGradient.colors}
              start={ButtonGradient.start}
              end={ButtonGradient.end}
              style={styles.detailsButtonGradient}
            >
              <Text style={styles.detailsButtonText}>Voir les détails</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </Animated.View>
    </>
  );
};

const styles = StyleSheet.create({
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  sheet: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: SHEET_HEIGHT,
    backgroundColor: COLORS.background,
    borderTopLeftRadius: BORDER_RADIUS.xl,
    borderTopRightRadius: BORDER_RADIUS.xl,
    ...Shadows.cardHover,
  },
  handleContainer: {
    alignItems: 'center',
    paddingVertical: SPACING.sm,
  },
  handle: {
    width: 40,
    height: 4,
    backgroundColor: COLORS.gray400,
    borderRadius: BORDER_RADIUS.full,
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    paddingBottom: SPACING.md,
  },
  imageContainer: {
    width: '100%',
    height: 180,
    position: 'relative',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  placeholderImage: {
    width: '100%',
    height: '100%',
    backgroundColor: COLORS.gray100,
    justifyContent: 'center',
    alignItems: 'center',
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
  },
  bonPlanText: {
    color: COLORS.textLight,
    fontSize: FONT_SIZES.sm,
    fontWeight: '600',
    textAlign: 'center',
  },
  trendingBadge: {
    position: 'absolute',
    bottom: SPACING.sm,
    right: SPACING.sm,
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
  infoContainer: {
    padding: SPACING.md,
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
  locationRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.xs,
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
  description: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.textSecondary,
    marginBottom: SPACING.xs,
    lineHeight: 20,
  },
  priceContainer: {
    marginBottom: SPACING.xs,
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
  actionContainer: {
    flexDirection: 'row',
    padding: SPACING.md,
    gap: SPACING.sm,
    borderTopWidth: 1,
    borderTopColor: COLORS.gray200,
  },
  closeButton: {
    flex: 1,
    paddingVertical: SPACING.md,
    borderRadius: BORDER_RADIUS.md,
    backgroundColor: COLORS.gray100,
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeButtonText: {
    fontSize: FONT_SIZES.md,
    fontWeight: '600',
    color: COLORS.textPrimary,
  },
  detailsButton: {
    flex: 2,
    borderRadius: BORDER_RADIUS.button,
    overflow: 'hidden',
    ...Shadows.buttonGradient,
  },
  detailsButtonGradient: {
    paddingVertical: SPACING.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  detailsButtonText: {
    fontSize: FONT_SIZES.md,
    fontWeight: '700',
    color: COLORS.textLight,
  },
});

