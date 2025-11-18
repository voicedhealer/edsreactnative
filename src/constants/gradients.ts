// Gradients exacts du site web
import type { LinearGradientProps } from 'expo-linear-gradient';

// Gradient Hero (135deg orange → pink → rouge)
export const HeroGradient = {
  colors: ['#ff751f', '#ff1fa9', '#ff3a3a'],
  start: { x: 0, y: 0 },
  end: { x: 1, y: 1 },
  locations: [0, 0.5, 1],
  angle: 135, // degrés
};

// Gradient Bouton (135deg orange → pink)
export const ButtonGradient = {
  colors: ['#ff751f', '#ff1fa9'],
  start: { x: 0, y: 0 },
  end: { x: 1, y: 1 },
  locations: [0, 1],
  angle: 135,
};

// Gradient Filtre actif (90deg orange → pink)
export const FilterActiveGradient = {
  colors: ['#f97316', '#ec4899'], // orange-500 → pink-500
  start: { x: 0, y: 0 },
  end: { x: 1, y: 0 },
  locations: [0, 1],
};

// Gradient Badge Premium (45deg orange → pink → rouge)
export const PremiumBorderGradient = {
  colors: ['#ff751f', '#ff1fa9', '#ff3a3a'],
  start: { x: 0, y: 0 },
  end: { x: 1, y: 1 },
  locations: [0, 0.5, 1],
  angle: 45,
};

// Helper pour convertir en props LinearGradient
export const getGradientProps = (
  gradient:
    | typeof HeroGradient
    | typeof ButtonGradient
    | typeof FilterActiveGradient
    | typeof PremiumBorderGradient
): Partial<LinearGradientProps> => ({
  colors: gradient.colors,
  start: gradient.start,
  end: gradient.end,
  locations: gradient.locations,
});
