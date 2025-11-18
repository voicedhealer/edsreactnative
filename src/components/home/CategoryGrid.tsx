import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, ViewStyle } from 'react-native';
import { COLORS, SPACING, BORDER_RADIUS, FONT_SIZES } from '@constants';

export interface Category {
  id: string;
  name: string;
  icon: string;
  color?: string;
}

interface CategoryGridProps {
  categories: Category[];
  onCategoryPress: (category: Category) => void;
  style?: ViewStyle;
}

const defaultCategories: Category[] = [
  { id: '1', name: 'Restaurants', icon: '🍽️', color: COLORS.primary },
  { id: '2', name: 'Bars', icon: '🍺', color: COLORS.secondary },
  { id: '3', name: 'Concerts', icon: '🎵', color: COLORS.accent },
  { id: '4', name: 'Événements', icon: '🎉', color: COLORS.primary },
  { id: '5', name: 'Sport', icon: '⚽', color: COLORS.secondary },
  { id: '6', name: 'Culture', icon: '🎭', color: COLORS.accent },
  { id: '7', name: 'Shopping', icon: '🛍️', color: COLORS.primary },
  { id: '8', name: 'Bien-être', icon: '🧘', color: COLORS.secondary },
];

export const CategoryGrid: React.FC<CategoryGridProps> = ({
  categories = defaultCategories,
  onCategoryPress,
  style,
}) => {
  return (
    <View style={[styles.container, style]}>
      <Text style={styles.title}>Catégories</Text>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {categories.map(category => (
          <TouchableOpacity
            key={category.id}
            style={styles.categoryCard}
            onPress={() => onCategoryPress(category)}
            activeOpacity={0.7}
          >
            <View
              style={[
                styles.iconContainer,
                { backgroundColor: category.color || COLORS.primary + '20' },
              ]}
            >
              <Text style={styles.icon}>{category.icon}</Text>
            </View>
            <Text style={styles.categoryName}>{category.name}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: SPACING.md,
    zIndex: 1,
  },
  title: {
    fontSize: FONT_SIZES.lg,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: SPACING.md,
    paddingHorizontal: SPACING.md,
  },
  scrollContent: {
    paddingHorizontal: SPACING.md,
    gap: SPACING.md,
  },
  categoryCard: {
    alignItems: 'center',
    width: 80,
  },
  iconContainer: {
    width: 64,
    height: 64,
    borderRadius: BORDER_RADIUS.full,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: SPACING.xs,
  },
  icon: {
    fontSize: 32,
  },
  categoryName: {
    fontSize: FONT_SIZES.xs,
    color: COLORS.text,
    textAlign: 'center',
    fontWeight: '500',
  },
});
