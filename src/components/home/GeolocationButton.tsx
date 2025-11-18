import React from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ActivityIndicator,
  ViewStyle,
} from 'react-native';
import { useLocation } from '@hooks';
import { COLORS, SPACING, BORDER_RADIUS, FONT_SIZES } from '@constants';

interface GeolocationButtonProps {
  onLocationFound: (latitude: number, longitude: number) => void;
  style?: ViewStyle;
  variant?: 'primary' | 'secondary' | 'outline';
}

export const GeolocationButton: React.FC<GeolocationButtonProps> = ({
  onLocationFound,
  style,
  variant = 'primary',
}) => {
  const { getCurrentLocation, isLoading, error } = useLocation();

  const handlePress = async () => {
    const location = await getCurrentLocation();
    if (location) {
      onLocationFound(location.latitude, location.longitude);
    }
    // Les erreurs sont gérées par le service (alertes affichées automatiquement)
  };

  const getButtonStyle = () => {
    switch (variant) {
      case 'secondary':
        return styles.secondaryButton;
      case 'outline':
        return styles.outlineButton;
      default:
        return styles.primaryButton;
    }
  };

  const getTextStyle = () => {
    switch (variant) {
      case 'outline':
        return styles.outlineButtonText;
      default:
        return styles.buttonText;
    }
  };

  return (
    <TouchableOpacity
      style={[getButtonStyle(), style, isLoading && styles.buttonDisabled]}
      onPress={handlePress}
      disabled={isLoading}
      activeOpacity={0.7}
    >
      {isLoading ? (
        <ActivityIndicator color={variant === 'outline' ? COLORS.primary : COLORS.textLight} />
      ) : (
        <>
          <Text style={styles.icon}>📍</Text>
          <Text style={getTextStyle()}>Autour de moi</Text>
        </>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  primaryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.secondary,
    borderRadius: BORDER_RADIUS.md,
    padding: SPACING.md,
    gap: SPACING.xs,
  },
  secondaryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.accent,
    borderRadius: BORDER_RADIUS.md,
    padding: SPACING.md,
    gap: SPACING.xs,
  },
  outlineButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'transparent',
    borderWidth: 2,
    borderColor: COLORS.primary,
    borderRadius: BORDER_RADIUS.md,
    padding: SPACING.md,
    gap: SPACING.xs,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonText: {
    color: COLORS.textLight,
    fontSize: FONT_SIZES.md,
    fontWeight: '600',
  },
  outlineButtonText: {
    color: COLORS.primary,
    fontSize: FONT_SIZES.md,
    fontWeight: '600',
  },
  icon: {
    fontSize: FONT_SIZES.md,
  },
});
