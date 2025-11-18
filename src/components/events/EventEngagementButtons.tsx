import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
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
  ButtonGradient,
} from '@constants';
import { useEventEngagement, useEngageEvent } from '@hooks/useEventEngagement';
import { useAuthStore } from '@store';
import type { EngagementType } from '@types';

interface EventEngagementButtonsProps {
  eventId: string;
  isCompact?: boolean;
  onEngagementUpdate?: (data: any) => void;
}

interface EngagementButton {
  type: EngagementType;
  icon: string;
  label: string;
  shortLabel: string;
  score: number;
  color: string;
}

const ENGAGEMENT_BUTTONS: EngagementButton[] = [
  {
    type: 'envie',
    icon: '🌟',
    label: "Envie d'y être !",
    shortLabel: 'Envie',
    score: 1,
    color: COLORS.brandOrange,
  },
  {
    type: 'grande-envie',
    icon: '🔥',
    label: 'Grande envie !',
    shortLabel: 'Ultra envie',
    score: 3,
    color: COLORS.brandRed,
  },
  {
    type: 'decouvrir',
    icon: '🔍',
    label: 'Envie de découvrir',
    shortLabel: 'Découvrir',
    score: 2,
    color: COLORS.brandPink,
  },
  {
    type: 'pas-envie',
    icon: '❌',
    label: 'Pas mon envie',
    shortLabel: 'Pas envie',
    score: -1,
    color: COLORS.gray500,
  },
];

export const EventEngagementButtons: React.FC<EventEngagementButtonsProps> = ({
  eventId,
  isCompact = false,
  onEngagementUpdate,
}) => {
  const { user } = useAuthStore();
  const { data: engagement, isLoading } = useEventEngagement(eventId);
  const engageEvent = useEngageEvent();

  const [scaleAnims] = useState(
    ENGAGEMENT_BUTTONS.map(() => new Animated.Value(1))
  );

  const handleEngagement = async (type: EngagementType) => {
    if (!user) {
      // Rediriger vers la page de connexion si non connecté
      return;
    }

    if (engageEvent.isPending || isLoading) {
      return;
    }

    const buttonIndex = ENGAGEMENT_BUTTONS.findIndex(btn => btn.type === type);
    const scaleAnim = scaleAnims[buttonIndex];

    // Animation de scale au press
    Animated.sequence([
      Animated.spring(scaleAnim, {
        toValue: 1.2,
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
      const result = await engageEvent.mutateAsync({
        eventId,
        type,
      });

      onEngagementUpdate?.(result);

      // Afficher notification si nouveau badge
      if (result.badge && engagement?.badge?.type !== result.badge.type) {
        // Vous pouvez ajouter ici une notification toast
        console.log('Nouveau badge débloqué:', result.badge.label);
      }
    } catch (error) {
      console.error('Erreur lors de l\'engagement:', error);
    }
  };

  const stats = engagement?.stats || {
    envie: 0,
    'grande-envie': 0,
    decouvrir: 0,
    'pas-envie': 0,
  };

  const userEngagement = engagement?.userEngagement || null;
  const isPending = engageEvent.isPending || isLoading;

  return (
    <View style={styles.container}>
      <View style={[styles.buttonsContainer, isCompact && styles.buttonsContainerCompact]}>
        {ENGAGEMENT_BUTTONS.map((button, index) => {
          const count = stats[button.type] || 0;
          const isActive = userEngagement === button.type;
          const scaleAnim = scaleAnims[index];

          return (
            <Animated.View
              key={button.type}
              style={[
                styles.buttonWrapper,
                { transform: [{ scale: scaleAnim }] },
              ]}
            >
              <TouchableOpacity
                style={[
                  styles.button,
                  isCompact && styles.buttonCompact,
                  isActive && styles.buttonActive,
                  isPending && styles.buttonDisabled,
                ]}
                onPress={() => handleEngagement(button.type)}
                disabled={isPending}
                activeOpacity={0.8}
              >
                {isActive ? (
                  <LinearGradient
                    colors={ButtonGradient.colors}
                    start={ButtonGradient.start}
                    end={ButtonGradient.end}
                    style={styles.buttonGradient}
                  >
                    <View style={styles.buttonContent}>
                      <Text style={styles.buttonIcon}>{button.icon}</Text>
                      {!isCompact && (
                        <Text style={styles.buttonLabelActive} numberOfLines={1}>
                          {button.label}
                        </Text>
                      )}
                      <View style={styles.countBadgeActive}>
                        <Text style={styles.countTextActive}>{count}</Text>
                      </View>
                    </View>
                  </LinearGradient>
                ) : (
                  <View style={styles.buttonContent}>
                    <Text style={styles.buttonIcon}>{button.icon}</Text>
                    {!isCompact && (
                      <Text style={styles.buttonLabel} numberOfLines={1}>
                        {button.label}
                      </Text>
                    )}
                    <View style={styles.countBadge}>
                      <Text style={styles.countText}>{count}</Text>
                    </View>
                  </View>
                )}
              </TouchableOpacity>
              {isCompact && (
                <Text style={styles.shortLabel} numberOfLines={1}>
                  {button.shortLabel}
                </Text>
              )}
            </Animated.View>
          );
        })}
      </View>

      {!user && (
        <View style={styles.authHint}>
          <Text style={styles.authIcon}>ℹ️</Text>
          <Text style={styles.authText}>Connectez-vous pour participer !</Text>
        </View>
      )}

      {isPending && (
        <View style={styles.loadingOverlay}>
          <ActivityIndicator size="small" color={COLORS.brandOrange} />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: SPACING.md,
  },
  buttonsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: SPACING.sm,
  },
  buttonsContainerCompact: {
    gap: SPACING.xs,
  },
  buttonWrapper: {
    flex: 1,
    minWidth: '45%',
    maxWidth: '48%',
  },
  button: {
    backgroundColor: COLORS.background,
    borderWidth: 2,
    borderColor: COLORS.gray200,
    borderRadius: BORDER_RADIUS.md,
    padding: SPACING.sm,
    ...Shadows.card,
  },
  buttonCompact: {
    padding: SPACING.xs,
    minHeight: 60,
    justifyContent: 'center',
  },
  buttonActive: {
    borderColor: COLORS.brandOrange,
    overflow: 'hidden',
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonGradient: {
    borderRadius: BORDER_RADIUS.md,
    padding: SPACING.sm,
  },
  buttonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.xs,
  },
  buttonIcon: {
    fontSize: FONT_SIZES.lg,
  },
  buttonLabel: {
    flex: 1,
    fontSize: FONT_SIZES.sm,
    fontWeight: '500',
    color: COLORS.textPrimary,
  },
  buttonLabelActive: {
    flex: 1,
    fontSize: FONT_SIZES.sm,
    fontWeight: '600',
    color: COLORS.textLight,
  },
  countBadge: {
    backgroundColor: COLORS.gray100,
    borderRadius: BORDER_RADIUS.full,
    paddingHorizontal: SPACING.xs,
    paddingVertical: 2,
    minWidth: 24,
    alignItems: 'center',
  },
  countBadgeActive: {
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    borderRadius: BORDER_RADIUS.full,
    paddingHorizontal: SPACING.xs,
    paddingVertical: 2,
    minWidth: 24,
    alignItems: 'center',
  },
  countText: {
    fontSize: FONT_SIZES.xs,
    fontWeight: '600',
    color: COLORS.textPrimary,
  },
  countTextActive: {
    fontSize: FONT_SIZES.xs,
    fontWeight: '700',
    color: COLORS.textLight,
  },
  shortLabel: {
    marginTop: SPACING.xs / 2,
    fontSize: FONT_SIZES.xs,
    color: COLORS.textSecondary,
    textAlign: 'center',
    fontWeight: '500',
  },
  authHint: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: SPACING.sm,
    gap: SPACING.xs,
    paddingHorizontal: SPACING.sm,
  },
  authIcon: {
    fontSize: FONT_SIZES.sm,
  },
  authText: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.textSecondary,
  },
  loadingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
    borderRadius: BORDER_RADIUS.md,
  },
});

