import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS, SPACING, BORDER_RADIUS, Shadows, PremiumBorderGradient } from '@constants';
import type { Establishment } from '@types';

interface CustomMarkerProps {
  establishment: Establishment;
}

export const CustomMarker: React.FC<CustomMarkerProps> = ({ establishment }) => {
  const subscription = (establishment as any).subscription as 'FREE' | 'PREMIUM' | undefined;
  const isPremium = subscription === 'PREMIUM';
  const isHot = (establishment as any).isHot as boolean | undefined;

  return (
    <View style={styles.container}>
      {/* Marqueur principal */}
      <View style={[styles.marker, isPremium && styles.premiumMarker]}>
        {isPremium ? (
          <LinearGradient
            colors={PremiumBorderGradient.colors}
            start={PremiumBorderGradient.start}
            end={PremiumBorderGradient.end}
            locations={PremiumBorderGradient.locations}
            style={styles.markerGradient}
          >
            {establishment.images && establishment.images.length > 0 ? (
              <Image
                source={{ uri: establishment.images[0] }}
                style={styles.markerImage}
                resizeMode="cover"
              />
            ) : (
              <View style={styles.markerPlaceholder}>
                <Text style={styles.markerPlaceholderText}>
                  {establishment.name.charAt(0).toUpperCase()}
                </Text>
              </View>
            )}
          </LinearGradient>
        ) : (
          <View style={styles.markerContent}>
            {establishment.images && establishment.images.length > 0 ? (
              <Image
                source={{ uri: establishment.images[0] }}
                style={styles.markerImage}
                resizeMode="cover"
              />
            ) : (
              <View style={styles.markerPlaceholder}>
                <Text style={styles.markerPlaceholderText}>
                  {establishment.name.charAt(0).toUpperCase()}
                </Text>
              </View>
            )}
          </View>
        )}

        {/* Badge tendance */}
        {isHot && (
          <View style={styles.hotBadge}>
            <Text style={styles.hotBadgeText}>🔥</Text>
          </View>
        )}

        {/* Badge Premium */}
        {isPremium && (
          <View style={styles.premiumBadge}>
            <Text style={styles.premiumBadgeText}>👑</Text>
          </View>
        )}
      </View>

      {/* Pointe du marqueur */}
      <View style={[styles.pointer, isPremium && styles.premiumPointer]} />
    </View>
  );
};

const MARKER_SIZE = 48;
const POINTER_SIZE = 12;

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  marker: {
    width: MARKER_SIZE,
    height: MARKER_SIZE,
    borderRadius: MARKER_SIZE / 2,
    overflow: 'hidden',
    borderWidth: 3,
    borderColor: COLORS.background,
    ...Shadows.card,
  },
  premiumMarker: {
    borderWidth: 0,
    padding: 2,
  },
  markerGradient: {
    width: '100%',
    height: '100%',
    borderRadius: MARKER_SIZE / 2,
    overflow: 'hidden',
  },
  markerContent: {
    width: '100%',
    height: '100%',
    backgroundColor: COLORS.brandOrange,
  },
  markerImage: {
    width: '100%',
    height: '100%',
  },
  markerPlaceholder: {
    width: '100%',
    height: '100%',
    backgroundColor: COLORS.brandOrange,
    justifyContent: 'center',
    alignItems: 'center',
  },
  markerPlaceholderText: {
    color: COLORS.textLight,
    fontSize: 20,
    fontWeight: '700',
  },
  pointer: {
    width: 0,
    height: 0,
    backgroundColor: 'transparent',
    borderStyle: 'solid',
    borderTopWidth: POINTER_SIZE,
    borderRightWidth: POINTER_SIZE / 2,
    borderBottomWidth: 0,
    borderLeftWidth: POINTER_SIZE / 2,
    borderTopColor: COLORS.brandOrange,
    borderRightColor: 'transparent',
    borderBottomColor: 'transparent',
    borderLeftColor: 'transparent',
    marginTop: -1,
  },
  premiumPointer: {
    borderTopColor: COLORS.brandOrange,
  },
  hotBadge: {
    position: 'absolute',
    top: -4,
    right: -4,
    backgroundColor: COLORS.brandRed,
    borderRadius: BORDER_RADIUS.full,
    width: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: COLORS.background,
  },
  hotBadgeText: {
    fontSize: 10,
  },
  premiumBadge: {
    position: 'absolute',
    bottom: -4,
    right: -4,
    backgroundColor: COLORS.brandOrange,
    borderRadius: BORDER_RADIUS.full,
    width: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: COLORS.background,
  },
  premiumBadgeText: {
    fontSize: 10,
  },
});

