import React from 'react';
import { View, TextInput, StyleSheet, TouchableOpacity, Text, ViewStyle } from 'react-native';
import { COLORS, SPACING, BORDER_RADIUS, FONT_SIZES } from '@constants';

interface SearchBarProps {
  city: string;
  activity: string;
  onCityChange: (city: string) => void;
  onActivityChange: (activity: string) => void;
  onSearch: () => void;
  onGeolocationPress?: () => void;
  style?: ViewStyle;
}

export const SearchBar: React.FC<SearchBarProps> = ({
  city,
  activity,
  onCityChange,
  onActivityChange,
  onSearch,
  onGeolocationPress,
  style,
}) => {
  return (
    <View style={[styles.container, style]}>
      <View style={styles.inputsContainer}>
        <View style={styles.inputWrapper}>
          <Text style={styles.label}>📍 Ville</Text>
          <TextInput
            style={styles.input}
            placeholder="Paris, Lyon, Marseille..."
            placeholderTextColor={COLORS.textSecondary}
            value={city}
            onChangeText={onCityChange}
            onSubmitEditing={onSearch}
            returnKeyType="next"
          />
        </View>

        <View style={styles.inputWrapper}>
          <Text style={styles.label}>🎯 Activité</Text>
          <TextInput
            style={styles.input}
            placeholder="Restaurant, bar, concert..."
            placeholderTextColor={COLORS.textSecondary}
            value={activity}
            onChangeText={onActivityChange}
            onSubmitEditing={onSearch}
            returnKeyType="search"
          />
        </View>
      </View>

      <View style={styles.actionsContainer}>
        {onGeolocationPress && (
          <TouchableOpacity style={styles.geoButton} onPress={onGeolocationPress}>
            <Text style={styles.geoButtonText}>📍 Autour de moi</Text>
          </TouchableOpacity>
        )}
        <TouchableOpacity style={styles.searchButton} onPress={onSearch}>
          <Text style={styles.searchButtonText}>Rechercher</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.background,
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.md,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  inputsContainer: {
    flexDirection: 'row',
    gap: SPACING.sm,
    marginBottom: SPACING.md,
  },
  inputWrapper: {
    flex: 1,
  },
  label: {
    fontSize: FONT_SIZES.xs,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: SPACING.xs,
  },
  input: {
    backgroundColor: COLORS.backgroundSecondary,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: BORDER_RADIUS.md,
    padding: SPACING.sm,
    fontSize: FONT_SIZES.md,
    color: COLORS.text,
  },
  actionsContainer: {
    flexDirection: 'row',
    gap: SPACING.sm,
  },
  geoButton: {
    flex: 1,
    backgroundColor: COLORS.secondary,
    borderRadius: BORDER_RADIUS.md,
    padding: SPACING.sm,
    alignItems: 'center',
    justifyContent: 'center',
  },
  geoButtonText: {
    color: COLORS.textLight,
    fontSize: FONT_SIZES.sm,
    fontWeight: '600',
  },
  searchButton: {
    flex: 1,
    backgroundColor: COLORS.primary,
    borderRadius: BORDER_RADIUS.md,
    padding: SPACING.sm,
    alignItems: 'center',
    justifyContent: 'center',
  },
  searchButtonText: {
    color: COLORS.textLight,
    fontSize: FONT_SIZES.sm,
    fontWeight: '600',
  },
});
