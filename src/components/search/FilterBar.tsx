import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  ViewStyle,
  Platform,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import {
  COLORS,
  SPACING,
  BORDER_RADIUS,
  FONT_SIZES,
  FilterActiveGradient,
  Shadows,
} from '@constants';

export type FilterType =
  | 'popular' // Tri par viewsCount (décroissant)
  | 'wanted' // Tri par likesCount (décroissant)
  | 'cheap' // Tri par priceMin/prixMoyen (croissant)
  | 'premium' // Tri par subscription (PREMIUM > FREE) puis score
  | 'newest' // Tri par createdAt (décroissant)
  | 'rating'; // Tri par avgRating (décroissant)

export interface Filter {
  id: FilterType;
  label: string;
  icon: string;
  description: string;
}

// Filtres exacts selon les spécifications
export const FILTERS: Filter[] = [
  { id: 'popular', label: 'Populaire', icon: '🔥', description: 'Les plus visités' },
  { id: 'wanted', label: 'Désirés ++', icon: '❤️', description: 'Les plus aimés' },
  { id: 'cheap', label: 'Les - cher', icon: '💰', description: 'Prix abordables' },
  { id: 'premium', label: 'Notre sélection', icon: '👑', description: 'Établissements premium' },
  { id: 'newest', label: 'Nouveaux', icon: '🆕', description: 'Derniers ajouts' },
  { id: 'rating', label: 'Mieux notés', icon: '⭐', description: 'Meilleures notes' },
];

interface FilterBarProps {
  selectedFilter?: FilterType;
  onFilterPress: (filter: FilterType) => void;
  style?: ViewStyle;
}

export const FilterBar: React.FC<FilterBarProps> = ({ selectedFilter, onFilterPress, style }) => {
  return (
    <View style={[styles.container, style]}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {FILTERS.map(filter => {
          const isSelected = selectedFilter === filter.id;
          return (
            <TouchableOpacity
              key={filter.id}
              onPress={() => onFilterPress(filter.id)}
              activeOpacity={0.8}
              style={styles.touchable}
            >
              {isSelected ? (
                <LinearGradient
                  colors={FilterActiveGradient.colors}
                  start={FilterActiveGradient.start}
                  end={FilterActiveGradient.end}
                  locations={FilterActiveGradient.locations}
                  style={[styles.filterChip, styles.filterChipSelected]}
                >
                  <Text style={styles.icon}>{filter.icon}</Text>
                  <Text style={styles.labelSelected}>{filter.label}</Text>
                </LinearGradient>
              ) : (
                <View style={styles.filterChip}>
                  <Text style={styles.icon}>{filter.icon}</Text>
                  <Text style={styles.label}>{filter.label}</Text>
                </View>
              )}
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.background,
    paddingVertical: SPACING.sm,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.borderLight,
  },
  scrollContent: {
    paddingHorizontal: SPACING.md,
    gap: SPACING.sm,
  },
  touchable: {
    borderRadius: BORDER_RADIUS.full,
  },
  filterChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.gray100, // gray-100
    borderRadius: BORDER_RADIUS.full,
    paddingHorizontal: SPACING.md,
    paddingVertical: 12,
    gap: SPACING.xs,
  },
  filterChipSelected: {
    ...Shadows.filterActive,
    transform: [{ scale: 1.05 }], // scale-105
  },
  icon: {
    fontSize: FONT_SIZES.md,
  },
  label: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.gray700, // gray-700
    fontWeight: '500',
  },
  labelSelected: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.textLight,
    fontWeight: '600',
  },
});
