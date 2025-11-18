import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Animated,
  Easing,
  Dimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import {
  COLORS,
  SPACING,
  BORDER_RADIUS,
  FONT_SIZES,
  Shadows,
} from '@constants';
import type { EventBadge } from '@types';

interface EventEngagementGaugeProps {
  percentage: number;
  badge: EventBadge | null;
  isVertical?: boolean;
}

// Gradient pour la jauge (vert → jaune → orange → rouge → violet)
const GAUGE_GRADIENT_COLORS = [
  '#4CAF50', // Vert début
  '#8BC34A', // Vert clair
  '#FFC107', // Jaune
  '#FF9800', // Orange
  '#F44336', // Rouge
  '#9C27B0', // Violet début
  '#6A1B9A', // Violet intense
];

const GAUGE_GRADIENT_LOCATIONS = [0, 0.166, 0.333, 0.5, 0.666, 0.833, 1];

export const EventEngagementGauge: React.FC<EventEngagementGaugeProps> = ({
  percentage,
  badge,
  isVertical = false,
}) => {
  const animatedValue = useRef(new Animated.Value(0)).current;
  const fireModeAnim = useRef(new Animated.Value(1)).current;

  // Calculer la taille de la jauge (max 100% même si valeur va à 150%)
  const gaugeSize = Math.min((percentage / 150) * 100, 100);

  // Animation progressive de la jauge au montage
  useEffect(() => {
    Animated.timing(animatedValue, {
      toValue: gaugeSize,
      duration: 800,
      easing: Easing.bezier(0.4, 0, 0.2, 1),
      useNativeDriver: false,
    }).start();
  }, [gaugeSize, animatedValue]);

  // Animation "fire mode" pour 150%+
  useEffect(() => {
    if (percentage >= 150) {
      Animated.loop(
        Animated.sequence([
          Animated.timing(fireModeAnim, {
            toValue: 1.05,
            duration: 1000,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true,
          }),
          Animated.timing(fireModeAnim, {
            toValue: 1,
            duration: 1000,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true,
          }),
        ])
      ).start();
    } else {
      fireModeAnim.setValue(1);
    }
  }, [percentage, fireModeAnim]);

  const animatedWidth = animatedValue.interpolate({
    inputRange: [0, 100],
    outputRange: ['0%', '100%'],
  });

  const animatedHeight = animatedValue.interpolate({
    inputRange: [0, 100],
    outputRange: ['0%', '100%'],
  });

  const isFireMode = percentage >= 150;

  return (
    <View style={[styles.container, isVertical && styles.containerVertical]}>
      {/* Barre de jauge */}
      <View style={[styles.gaugeBackground, isVertical && styles.gaugeBackgroundVertical]}>
        <Animated.View
          style={[
            styles.gaugeFill,
            isVertical && styles.gaugeFillVertical,
            isFireMode && styles.gaugeFillFireMode,
            {
              width: isVertical ? '100%' : animatedWidth,
              height: isVertical ? animatedHeight : '100%',
              transform: [{ scale: fireModeAnim }],
            },
          ]}
        >
          <LinearGradient
            colors={GAUGE_GRADIENT_COLORS}
            locations={GAUGE_GRADIENT_LOCATIONS}
            start={isVertical ? { x: 0, y: 0 } : { x: 0, y: 0 }}
            end={isVertical ? { x: 0, y: 1 } : { x: 1, y: 0 }}
            style={styles.gradient}
          >
            {!isVertical && (
              <View style={styles.percentageTextContainer}>
                <Text style={styles.percentageText}>{Math.round(percentage)}%</Text>
              </View>
            )}
          </LinearGradient>
        </Animated.View>
      </View>

      {/* Labels de référence - seulement en horizontal */}
      {!isVertical && (
        <View style={styles.labels}>
          <Text style={styles.label}>0%</Text>
          <Text style={styles.label}>50%</Text>
          <Text style={[styles.label, styles.labelHot]}>100%</Text>
          <Text style={[styles.label, styles.labelFire]}>150%</Text>
        </View>
      )}

      {/* Badge de l'événement */}
      {badge && (
        <View
          style={[
            styles.badge,
            { backgroundColor: badge.color },
            isVertical && styles.badgeVertical,
          ]}
        >
          <Text style={styles.badgeEmoji}>{badge.emoji}</Text>
          <Text style={styles.badgeLabel}>{badge.label}</Text>
        </View>
      )}

      {/* Affichage du pourcentage en vertical */}
      {isVertical && (
        <View style={styles.verticalPercentage}>
          <Text style={styles.verticalPercentageText}>{Math.round(percentage)}%</Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: SPACING.md,
  },
  containerVertical: {
    marginVertical: SPACING.sm,
    height: 100,
    alignItems: 'center',
    justifyContent: 'center',
  },
  gaugeBackground: {
    height: 24,
    backgroundColor: COLORS.gray100,
    borderRadius: BORDER_RADIUS.full,
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: COLORS.gray200,
  },
  gaugeBackgroundVertical: {
    width: 16,
    height: 100,
    borderRadius: 8,
  },
  gaugeFill: {
    height: '100%',
    borderRadius: BORDER_RADIUS.full,
    overflow: 'hidden',
  },
  gaugeFillVertical: {
    width: '100%',
  },
  gaugeFillFireMode: {
    shadowColor: '#9C27B0',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 10,
    elevation: 8,
  },
  gradient: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  percentageTextContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  percentageText: {
    color: COLORS.textLight,
    fontWeight: '700',
    fontSize: FONT_SIZES.sm,
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  labels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: SPACING.xs,
    paddingHorizontal: SPACING.xs,
  },
  label: {
    fontSize: FONT_SIZES.xs,
    color: COLORS.textSecondary,
  },
  labelHot: {
    color: COLORS.brandRed,
    fontWeight: '600',
  },
  labelFire: {
    color: '#9C27B0',
    fontWeight: '700',
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'center',
    marginTop: SPACING.sm,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.xs,
    borderRadius: BORDER_RADIUS.full,
    gap: SPACING.xs,
    ...Shadows.buttonGradient,
  },
  badgeVertical: {
    marginTop: SPACING.xs,
  },
  badgeEmoji: {
    fontSize: FONT_SIZES.md,
  },
  badgeLabel: {
    fontSize: FONT_SIZES.sm,
    fontWeight: '700',
    color: COLORS.textLight,
  },
  verticalPercentage: {
    marginTop: SPACING.xs,
    alignItems: 'center',
  },
  verticalPercentageText: {
    fontSize: FONT_SIZES.sm,
    fontWeight: '700',
    color: COLORS.textSecondary,
  },
});

