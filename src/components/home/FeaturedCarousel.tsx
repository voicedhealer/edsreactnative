import React, { useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Dimensions,
  ViewStyle,
} from 'react-native';
import { COLORS, SPACING, BORDER_RADIUS, FONT_SIZES } from '@constants';
import type { Establishment } from '@types';

interface FeaturedCarouselProps {
  establishments: Establishment[];
  onEstablishmentPress: (establishment: Establishment) => void;
  style?: ViewStyle;
  title?: string;
}

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const CARD_WIDTH = SCREEN_WIDTH * 0.8;
const CARD_SPACING = SPACING.md;

export const FeaturedCarousel: React.FC<FeaturedCarouselProps> = ({
  establishments,
  onEstablishmentPress,
  style,
  title = 'En vedette',
}) => {
  const scrollViewRef = useRef<ScrollView>(null);

  if (establishments.length === 0) {
    return null;
  }

  return (
    <View style={[styles.container, style]}>
      <Text style={styles.title}>{title}</Text>
      <ScrollView
        ref={scrollViewRef}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
        snapToInterval={CARD_WIDTH + CARD_SPACING}
        decelerationRate="fast"
        pagingEnabled={false}
      >
        {establishments.map(establishment => (
          <TouchableOpacity
            key={establishment.id}
            style={styles.card}
            onPress={() => onEstablishmentPress(establishment)}
            activeOpacity={0.9}
          >
            {establishment.images && establishment.images.length > 0 ? (
              <Image
                source={{ uri: establishment.images[0] }}
                style={styles.image}
                resizeMode="cover"
              />
            ) : (
              <View style={[styles.image, styles.placeholderImage]}>
                <Text style={styles.placeholderText}>📷</Text>
              </View>
            )}
            <View style={styles.overlay}>
              <View style={styles.content}>
                <Text style={styles.name} numberOfLines={1}>
                  {establishment.name}
                </Text>
                <Text style={styles.category}>{establishment.category}</Text>
                <View style={styles.footer}>
                  <Text style={styles.location}>📍 {establishment.city}</Text>
                  {establishment.rating && (
                    <Text style={styles.rating}>⭐ {establishment.rating.toFixed(1)}</Text>
                  )}
                </View>
              </View>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: SPACING.md,
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
    gap: CARD_SPACING,
  },
  card: {
    width: CARD_WIDTH,
    height: 200,
    borderRadius: BORDER_RADIUS.lg,
    overflow: 'hidden',
    backgroundColor: COLORS.backgroundSecondary,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
  },
  image: {
    width: '100%',
    height: '100%',
  },
  placeholderImage: {
    backgroundColor: COLORS.backgroundSecondary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  placeholderText: {
    fontSize: 48,
  },
  overlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    padding: SPACING.md,
  },
  content: {
    gap: SPACING.xs,
  },
  name: {
    fontSize: FONT_SIZES.lg,
    fontWeight: 'bold',
    color: COLORS.textLight,
  },
  category: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.primary,
    fontWeight: '600',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: SPACING.xs,
  },
  location: {
    fontSize: FONT_SIZES.xs,
    color: COLORS.textLight,
  },
  rating: {
    fontSize: FONT_SIZES.xs,
    color: COLORS.textLight,
    fontWeight: '600',
  },
});
