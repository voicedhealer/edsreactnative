import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import {
  COLORS,
  SPACING,
  BORDER_RADIUS,
  FONT_SIZES,
  HeroGradient,
  Typography,
  Shadows,
} from '@constants';
import type { Establishment } from '@types';

interface EstablishmentInfoProps {
  establishment: Establishment;
}

export const EstablishmentInfo: React.FC<EstablishmentInfoProps> = ({ establishment }) => {
  const isPremium = establishment.subscription === 'PREMIUM';
  const isOpen = establishment.isOpen;

  return (
    <View style={styles.container}>
      {/* Hero Section avec gradient */}
      <LinearGradient
        colors={HeroGradient.colors}
        start={HeroGradient.start}
        end={HeroGradient.end}
        locations={HeroGradient.locations}
        style={styles.heroSection}
      >
        <View style={styles.heroContent}>
          {/* Badge Premium */}
          {isPremium && (
            <View style={styles.premiumBadge}>
              <Text style={styles.premiumBadgeText}>👑 Notre sélection</Text>
            </View>
          )}

          {/* Nom établissement */}
          <Text style={styles.name}>{establishment.name}</Text>

          {/* Catégorie */}
          <Text style={styles.category}>{establishment.category}</Text>

          {/* Rating et Prix */}
          <View style={styles.metaRow}>
            {establishment.avgRating && (
              <View style={styles.ratingContainer}>
                <Text style={styles.ratingIcon}>⭐</Text>
                <Text style={styles.ratingText}>{establishment.avgRating.toFixed(1)}</Text>
              </View>
            )}
            {establishment.priceRange && (
              <View style={styles.priceContainer}>
                <Text style={styles.priceText}>{establishment.priceRange}</Text>
              </View>
            )}
            {isOpen !== undefined && (
              <View style={styles.statusContainer}>
                <View style={[styles.statusDot, isOpen && styles.statusDotOpen]} />
                <Text style={styles.statusText}>{isOpen ? 'Ouvert' : 'Fermé'}</Text>
              </View>
            )}
          </View>
        </View>
      </LinearGradient>

      {/* Informations détaillées */}
      <ScrollView style={styles.infoSection} showsVerticalScrollIndicator={false}>
        {/* Description */}
        {establishment.description && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Description</Text>
            <Text style={styles.description}>{establishment.description}</Text>
          </View>
        )}

        {/* Adresse */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>📍 Adresse</Text>
          <Text style={styles.address}>
            {establishment.address}
            {'\n'}
            {establishment.postalCode} {establishment.city}
          </Text>
        </View>

        {/* Contact */}
        {(establishment.phone || establishment.email || establishment.website) && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Contact</Text>
            {establishment.phone && (
              <TouchableOpacity style={styles.contactItem}>
                <Text style={styles.contactLabel}>📞 Téléphone</Text>
                <Text style={styles.contactValue}>{establishment.phone}</Text>
              </TouchableOpacity>
            )}
            {establishment.email && (
              <TouchableOpacity style={styles.contactItem}>
                <Text style={styles.contactLabel}>✉️ Email</Text>
                <Text style={styles.contactValue}>{establishment.email}</Text>
              </TouchableOpacity>
            )}
            {establishment.website && (
              <TouchableOpacity style={styles.contactItem}>
                <Text style={styles.contactLabel}>🌐 Site web</Text>
                <Text style={styles.contactValue}>{establishment.website}</Text>
              </TouchableOpacity>
            )}
          </View>
        )}

        {/* Horaires */}
        {establishment.openingHours && Object.keys(establishment.openingHours).length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>🕐 Horaires</Text>
            {Object.entries(establishment.openingHours).map(([day, hours]) => (
              <View key={day} style={styles.hoursRow}>
                <Text style={styles.hoursDay}>{day}</Text>
                <Text style={styles.hoursTime}>{hours}</Text>
              </View>
            ))}
          </View>
        )}

        {/* Tags */}
        {establishment.tags && establishment.tags.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Tags</Text>
            <View style={styles.tagsContainer}>
              {establishment.tags.map((tag, index) => (
                <View key={index} style={styles.tag}>
                  <Text style={styles.tagText}>{tag}</Text>
                </View>
              ))}
            </View>
          </View>
        )}

        {/* Stats */}
        <View style={styles.section}>
          <View style={styles.statsRow}>
            {establishment.viewsCount !== undefined && (
              <View style={styles.statItem}>
                <Text style={styles.statValue}>{establishment.viewsCount}</Text>
                <Text style={styles.statLabel}>Vues</Text>
              </View>
            )}
            {establishment.likesCount !== undefined && (
              <View style={styles.statItem}>
                <Text style={styles.statValue}>{establishment.likesCount}</Text>
                <Text style={styles.statLabel}>Likes</Text>
              </View>
            )}
            {establishment.distance !== undefined && (
              <View style={styles.statItem}>
                <Text style={styles.statValue}>{establishment.distance.toFixed(1)} km</Text>
                <Text style={styles.statLabel}>Distance</Text>
              </View>
            )}
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.background,
  },
  heroSection: {
    padding: SPACING.xl,
    paddingTop: SPACING.xxl,
    paddingBottom: SPACING.lg,
  },
  heroContent: {
    alignItems: 'center',
  },
  premiumBadge: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: BORDER_RADIUS.full,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.xs,
    marginBottom: SPACING.md,
    ...Shadows.card,
  },
  premiumBadgeText: {
    color: COLORS.textLight,
    fontSize: FONT_SIZES.sm,
    fontWeight: '700',
  },
  name: {
    fontSize: Typography.h2.fontSize,
    fontWeight: Typography.h2.fontWeight,
    color: COLORS.textLight,
    textAlign: 'center',
    marginBottom: SPACING.xs,
  },
  category: {
    fontSize: Typography.h3.fontSize,
    fontWeight: Typography.h3.fontWeight,
    color: COLORS.textLight,
    opacity: 0.9,
    marginBottom: SPACING.md,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.md,
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: BORDER_RADIUS.full,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.xs,
    gap: SPACING.xs,
  },
  ratingIcon: {
    fontSize: FONT_SIZES.md,
  },
  ratingText: {
    color: COLORS.textLight,
    fontSize: FONT_SIZES.md,
    fontWeight: '600',
  },
  priceContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: BORDER_RADIUS.full,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.xs,
  },
  priceText: {
    color: COLORS.textLight,
    fontSize: FONT_SIZES.md,
    fontWeight: '600',
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: BORDER_RADIUS.full,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.xs,
    gap: SPACING.xs,
  },
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
    color: COLORS.textLight,
    fontSize: FONT_SIZES.sm,
    fontWeight: '600',
  },
  infoSection: {
    padding: SPACING.md,
  },
  section: {
    marginBottom: SPACING.lg,
  },
  sectionTitle: {
    fontSize: Typography.h3.fontSize,
    fontWeight: Typography.h3.fontWeight,
    color: COLORS.textPrimary,
    marginBottom: SPACING.sm,
  },
  description: {
    fontSize: Typography.body.fontSize,
    lineHeight: Typography.body.lineHeight * Typography.body.fontSize,
    color: COLORS.textSecondary,
  },
  address: {
    fontSize: Typography.body.fontSize,
    color: COLORS.textPrimary,
    lineHeight: Typography.body.lineHeight * Typography.body.fontSize,
  },
  contactItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: SPACING.sm,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.borderLight,
  },
  contactLabel: {
    fontSize: Typography.body.fontSize,
    color: COLORS.textSecondary,
  },
  contactValue: {
    fontSize: Typography.body.fontSize,
    color: COLORS.textPrimary,
    fontWeight: '500',
  },
  hoursRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: SPACING.xs,
  },
  hoursDay: {
    fontSize: Typography.body.fontSize,
    color: COLORS.textPrimary,
    fontWeight: '500',
  },
  hoursTime: {
    fontSize: Typography.body.fontSize,
    color: COLORS.textSecondary,
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: SPACING.sm,
  },
  tag: {
    backgroundColor: COLORS.gray100,
    borderRadius: BORDER_RADIUS.full,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.xs,
  },
  tagText: {
    fontSize: Typography.small.fontSize,
    color: COLORS.textSecondary,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: SPACING.md,
    backgroundColor: COLORS.gray50,
    borderRadius: BORDER_RADIUS.md,
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: Typography.h3.fontSize,
    fontWeight: Typography.h3.fontWeight,
    color: COLORS.brandOrange,
  },
  statLabel: {
    fontSize: Typography.small.fontSize,
    color: COLORS.textSecondary,
    marginTop: SPACING.xs / 2,
  },
});
