// Palette de couleurs exacte du site web

export const COLORS = {
  // Couleurs principales (EXACTES du site)
  brandOrange: '#ff751f', // Orange principal
  brandPink: '#ff1fa9', // Pink principal
  brandRed: '#ff3a3a', // Rouge principal

  // Alias pour compatibilité
  primary: '#ff751f',
  secondary: '#ff1fa9',
  accent: '#ff3a3a',

  // Couleurs système
  background: '#ffffff', // Fond blanc pur
  foreground: '#171717', // Texte principal (noir)
  textPrimary: '#171717', // Texte principal
  textSecondary: '#6b7280', // Texte secondaire (gris)

  // Alias pour compatibilité
  text: '#171717',
  textLight: '#FFFFFF',
  backgroundSecondary: '#f3f4f6', // gray-100

  // Couleurs UI (gris)
  gray50: '#f9fafb',
  gray100: '#f3f4f6',
  gray200: '#e5e7eb',
  gray400: '#9ca3af',
  gray500: '#6b7280',
  gray600: '#4b5563',
  gray700: '#374151',
  gray900: '#111827',

  // Couleurs fonctionnelles
  success: '#16a34a', // Vert succès
  error: '#dc2626', // Rouge erreur
  warning: '#fbbf24', // Jaune warning
  info: '#2563eb', // Bleu info

  // Couleurs spécifiques
  orange200: '#fed7aa',
  orange400: '#fb923c',
  orange500: '#f97316',
  orange600: '#ea580c',
  pink400: '#f472b6',
  pink500: '#ec4899',
  red500: '#ef4444',

  // Couleurs de bordure (alias)
  border: '#e5e7eb', // gray-200
  borderLight: '#f3f4f6', // gray-100

  // Couleurs d'overlay
  overlay: 'rgba(0, 0, 0, 0.5)',
  overlayLight: 'rgba(0, 0, 0, 0.1)',

  // Couleurs legacy (pour compatibilité)
  backgroundDark: '#000000',
};

export const SPACING = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
};

export const FONT_SIZES = {
  xs: 12,
  sm: 14,
  md: 16,
  lg: 18,
  xl: 24,
  xxl: 32,
};

export const BORDER_RADIUS = {
  sm: 4,
  md: 8,
  lg: 12, // rounded-xl (cartes)
  xl: 16, // rounded-2xl (modals)
  full: 9999, // rounded-full (pills, badges)
  // Spécifiques selon design system
  card: 12, // rounded-xl
  button: 24, // rounded-full (pills)
  input: 8, // rounded-lg
  badge: 9999, // rounded-full
  modal: 16, // rounded-2xl
  image: 12, // rounded-xl
};
