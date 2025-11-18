import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Linking, Platform } from 'react-native';
import { COLORS, SPACING, BORDER_RADIUS, Typography, Shadows } from '@constants';
import type { Establishment } from '@types';

interface EstablishmentMapProps {
  establishment: Establishment;
  onPress?: () => void;
}

export const EstablishmentMap: React.FC<EstablishmentMapProps> = ({ establishment, onPress }) => {
  if (!establishment.latitude || !establishment.longitude) {
    return (
      <View style={styles.container}>
        <View style={styles.placeholder}>
          <Text style={styles.placeholderIcon}>📍</Text>
          <Text style={styles.placeholderText}>Localisation non disponible</Text>
        </View>
      </View>
    );
  }

  const handleMapPress = async () => {
    const lat = establishment.latitude!;
    const lng = establishment.longitude!;
    const name = encodeURIComponent(establishment.name);
    const address = encodeURIComponent(`${establishment.address}, ${establishment.city}`);

    // Ouvrir dans l'application de cartes native
    const url =
      Platform.OS === 'ios'
        ? `maps://maps.apple.com/?q=${lat},${lng}&ll=${lat},${lng}`
        : `geo:${lat},${lng}?q=${lat},${lng}(${name})`;

    try {
      const supported = await Linking.canOpenURL(url);
      if (supported) {
        await Linking.openURL(url);
      } else {
        // Fallback vers Google Maps web
        const webUrl = `https://www.google.com/maps/search/?api=1&query=${lat},${lng}`;
        await Linking.openURL(webUrl);
      }
    } catch (error) {
      console.error("Erreur lors de l'ouverture de la carte:", error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.sectionTitle}>📍 Localisation</Text>
      <TouchableOpacity style={styles.mapContainer} onPress={handleMapPress} activeOpacity={0.9}>
        <View style={styles.mapPlaceholder}>
          <View style={styles.markerContainer}>
            <View style={styles.marker}>
              <Text style={styles.markerText}>📍</Text>
            </View>
          </View>
          <Text style={styles.mapHint}>Appuyez pour ouvrir dans Maps</Text>
        </View>
      </TouchableOpacity>
      <View style={styles.addressContainer}>
        <Text style={styles.addressText}>
          {establishment.address}, {establishment.postalCode} {establishment.city}
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: SPACING.md,
  },
  sectionTitle: {
    fontSize: Typography.h3.fontSize,
    fontWeight: Typography.h3.fontWeight,
    color: COLORS.textPrimary,
    marginBottom: SPACING.md,
  },
  mapContainer: {
    height: 200,
    borderRadius: BORDER_RADIUS.card,
    overflow: 'hidden',
    ...Shadows.card,
    backgroundColor: COLORS.gray100,
  },
  mapPlaceholder: {
    width: '100%',
    height: '100%',
    backgroundColor: COLORS.gray100,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  markerContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: SPACING.md,
  },
  marker: {
    backgroundColor: COLORS.brandOrange,
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: COLORS.textLight,
    ...Shadows.card,
  },
  markerText: {
    fontSize: 20,
  },
  mapHint: {
    fontSize: Typography.small.fontSize,
    color: COLORS.textSecondary,
    textAlign: 'center',
  },
  addressContainer: {
    marginTop: SPACING.sm,
    padding: SPACING.md,
    backgroundColor: COLORS.gray50,
    borderRadius: BORDER_RADIUS.md,
  },
  addressText: {
    fontSize: Typography.body.fontSize,
    color: COLORS.textPrimary,
    textAlign: 'center',
  },
  placeholder: {
    height: 200,
    backgroundColor: COLORS.gray100,
    borderRadius: BORDER_RADIUS.card,
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeholderIcon: {
    fontSize: 48,
    marginBottom: SPACING.sm,
  },
  placeholderText: {
    fontSize: Typography.body.fontSize,
    color: COLORS.textSecondary,
  },
});
