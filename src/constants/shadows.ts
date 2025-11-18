// Ombres exactes du site web
import { Platform } from 'react-native';

export const Shadows = {
  // Ombre carte normale
  card: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    ...Platform.select({
      android: {
        elevation: 2,
      },
    }),
  },

  // Ombre carte hover (translateY(-4px))
  cardHover: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.1,
    shadowRadius: 20,
    ...Platform.select({
      android: {
        elevation: 8,
      },
    }),
  },

  // Ombre bouton gradient
  buttonGradient: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    ...Platform.select({
      android: {
        elevation: 4,
      },
    }),
  },

  // Ombre filtre actif
  filterActive: {
    shadowColor: '#f97316',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    ...Platform.select({
      android: {
        elevation: 6,
      },
    }),
  },
};
