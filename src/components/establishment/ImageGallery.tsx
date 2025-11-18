import React, { useState, useRef } from 'react';
import {
  View,
  Image,
  StyleSheet,
  Dimensions,
  FlatList,
  NativeScrollEvent,
  NativeSyntheticEvent,
  ActivityIndicator,
  Platform,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS, SPACING, BORDER_RADIUS, Shadows } from '@constants';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const GALLERY_HEIGHT = 300;

interface ImageGalleryProps {
  images: string[];
  establishmentName?: string;
}

export const ImageGallery: React.FC<ImageGalleryProps> = ({ images, establishmentName }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const flatListRef = useRef<FlatList>(null);

  if (!images || images.length === 0) {
    return (
      <View style={styles.container}>
        <View style={styles.placeholder}>
          <View style={styles.placeholderContent}>
            <View style={styles.placeholderIcon}>📷</View>
            {establishmentName && (
              <View style={styles.placeholderText}>
                <View style={styles.placeholderLine} />
                <View style={[styles.placeholderLine, { width: '60%' }]} />
              </View>
            )}
          </View>
        </View>
      </View>
    );
  }

  const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const scrollPosition = event.nativeEvent.contentOffset.x;
    const index = Math.round(scrollPosition / SCREEN_WIDTH);
    setCurrentIndex(index);
  };

  const renderImage = ({ item, index }: { item: string; index: number }) => {
    return (
      <View style={styles.imageContainer}>
        <Image source={{ uri: item }} style={styles.image} resizeMode="cover" />
        {/* Gradient overlay en bas */}
        <LinearGradient
          colors={['transparent', 'rgba(0,0,0,0.3)']}
          style={styles.gradientOverlay}
        />
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <FlatList
        ref={flatListRef}
        data={images}
        renderItem={renderImage}
        keyExtractor={(item, index) => `${item}-${index}`}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={handleScroll}
        scrollEventThrottle={16}
        snapToInterval={SCREEN_WIDTH}
        decelerationRate="fast"
      />
      {/* Indicateurs de pagination */}
      {images.length > 1 && (
        <View style={styles.pagination}>
          {images.map((_, index) => (
            <View
              key={index}
              style={[styles.paginationDot, currentIndex === index && styles.paginationDotActive]}
            />
          ))}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: SCREEN_WIDTH,
    height: GALLERY_HEIGHT,
    backgroundColor: COLORS.gray100,
  },
  imageContainer: {
    width: SCREEN_WIDTH,
    height: GALLERY_HEIGHT,
    position: 'relative',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  gradientOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 100,
  },
  pagination: {
    position: 'absolute',
    bottom: SPACING.md,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'center',
    gap: SPACING.xs,
  },
  paginationDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
  },
  paginationDotActive: {
    backgroundColor: COLORS.brandOrange,
    width: 24,
  },
  placeholder: {
    width: '100%',
    height: '100%',
    backgroundColor: COLORS.gray100,
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeholderContent: {
    alignItems: 'center',
    gap: SPACING.md,
  },
  placeholderIcon: {
    fontSize: 64,
    opacity: 0.3,
  },
  placeholderText: {
    alignItems: 'center',
    gap: SPACING.xs,
  },
  placeholderLine: {
    height: 12,
    width: '80%',
    backgroundColor: COLORS.gray200,
    borderRadius: BORDER_RADIUS.sm,
  },
});
