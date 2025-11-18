import React, { useState } from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ActivityIndicator,
  Alert,
  ViewStyle,
} from 'react-native';
import * as Location from 'expo-location';
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
  const [isLoading, setIsLoading] = useState(false);

  const requestLocationPermission = async () => {
    try {
      setIsLoading(true);

      // Vérifier les permissions
      const { status: foregroundStatus } = await Location.requestForegroundPermissionsAsync();

      if (foregroundStatus !== 'granted') {
        Alert.alert(
          'Permission refusée',
          'La géolocalisation est nécessaire pour trouver les établissements à proximité.',
          [{ text: 'OK' }]
        );
        setIsLoading(false);
        return;
      }

      // Obtenir la position actuelle
      const location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
      });

      const { latitude, longitude } = location.coords;
      onLocationFound(latitude, longitude);
    } catch (error) {
      console.error('Erreur de géolocalisation:', error);
      Alert.alert('Erreur', "Impossible d'obtenir votre position. Veuillez réessayer.", [
        { text: 'OK' },
      ]);
    } finally {
      setIsLoading(false);
    }
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
      onPress={requestLocationPermission}
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
