# 📱 GUIDE DE COHÉRENCE MAXIMALE - ENVIE2SORTIR MOBILE

## Référence absolue pour développer l'app identique au site web

---

## 🎨 DESIGN SYSTEM EXACT DU SITE

### 1. COULEURS (à reproduire à l'identique)

```typescript
// src/constants/colors.ts
export const Colors = {
  // Couleurs principales (EXACTES du site)
  brandOrange: '#ff751f', // Orange principal
  brandPink: '#ff1fa9', // Pink principal
  brandRed: '#ff3a3a', // Rouge principal

  // Couleurs système
  background: '#ffffff', // Fond blanc pur
  foreground: '#171717', // Texte principal (noir)
  textPrimary: '#171717', // Texte principal
  textSecondary: '#6b7280', // Texte secondaire (gris)

  // Couleurs UI
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
};
```

### 2. TYPOGRAPHIE (Inter - Google Fonts)

```typescript
// src/constants/typography.ts
export const Typography = {
  fontFamily: 'Inter', // EXACT - Google Fonts Inter
  fontFamilyFallback: 'Arial, Helvetica, sans-serif',

  // Hiérarchie exacte du site
  h1: {
    fontSize: 48, // text-6xl sur web
    fontWeight: '800', // font-extrabold
    lineHeight: 1.2,
    letterSpacing: -0.025, // tracking-tight
  },
  h2: {
    fontSize: 30, // text-3xl
    fontWeight: '700', // font-bold
    lineHeight: 1.3,
  },
  h3: {
    fontSize: 20, // text-xl
    fontWeight: '600', // font-semibold
    lineHeight: 1.4,
  },
  body: {
    fontSize: 16, // text-base
    fontWeight: '400', // font-normal
    lineHeight: 1.5,
  },
  small: {
    fontSize: 14, // text-sm
    fontWeight: '400',
    lineHeight: 1.4,
  },
  caption: {
    fontSize: 12, // text-xs
    fontWeight: '400',
    lineHeight: 1.3,
  },
};
```

### 3. GRADIENTS (à reproduire exactement)

```typescript
// src/constants/gradients.ts
import { LinearGradient } from 'expo-linear-gradient';

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
```

### 4. OMBRES & EFFETS

```typescript
// src/constants/shadows.ts
export const Shadows = {
  // Ombre carte normale
  card: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2, // Android
  },

  // Ombre carte hover (translateY(-4px))
  cardHover: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.1,
    shadowRadius: 20,
    elevation: 8,
  },

  // Ombre bouton gradient
  buttonGradient: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 4,
  },

  // Ombre filtre actif
  filterActive: {
    shadowColor: '#f97316',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
};
```

### 5. BORDER RADIUS

```typescript
export const BorderRadius = {
  card: 12, // rounded-xl
  button: 24, // rounded-full (pills)
  input: 8, // rounded-lg
  badge: 9999, // rounded-full
  modal: 16, // rounded-2xl
  image: 12, // rounded-xl
};
```

---

## 🧩 COMPOSANTS À REPRODUIRE À L'IDENTIQUE

### 1. BARRE DE RECHERCHE (EnvieSearchBar)

#### Structure exacte

```typescript
// src/components/SearchBar.tsx
// DOIT REPRODUIRE EXACTEMENT EnvieSearchBar.tsx du site

interface SearchBarProps {
  onSubmit: (
    envie: string,
    city: string,
    radius: number,
    coords?: { lat: number; lng: number }
  ) => void;
}

// Structure:
// [Label "Envie de"] [Input avec typewriter] | [📍] [Input ville avec dropdown] | [Select rayon] [Bouton gradient]

// Détails critiques:
// 1. Label "Envie de" en orange (#ff751f), taille text-l
// 2. Input avec border-b-2 border-gray-200, focus:border-orange-500
// 3. Typewriter effect avec phrases exactes:
//    - "manger une crêpe au nutella"
//    - "boire une bière artisanale"
//    - "faire un laser game"
//    - etc. (12 phrases au total)
// 4. Curseur clignotant orange (#f97316) avec animation blink
// 5. Dropdown ville avec option "Autour de moi" en premier
// 6. Bouton "Trouve-moi ça !" avec gradient orange→pink
// 7. Rayon par défaut: 5km
```

#### Typewriter effect (exact)

```typescript
const typewriterPhrases = [
  'manger une crêpe au nutella',
  'boire une bière artisanale',
  'faire un laser game',
  'faire du patin à roulettes',
  'manger un tacos 3 viandes',
  "découvrir un bar d'ambiance",
  'manger une pizza au fromage',
  'faire du karting en famille',
  'boire un cocktail mojito',
  'faire un escape game',
  'manger un burger extra',
  'danser en boîte de nuit',
];

// Vitesses:
const typingSpeed = 80; // ms par caractère
const erasingSpeed = 50; // ms par caractère
const initialDelay = 500; // ms avant début
const newTextDelay = 2000; // ms entre phrases
```

### 2. CARTE ÉTABLISSEMENT (EstablishmentCard)

#### Structure exacte

```typescript
// src/components/EstablishmentCard.tsx
// DOIT REPRODUIRE EXACTEMENT EstablishmentCard.tsx du site

// Structure:
// [Image h-48 md:h-52]
//   [Badge Bon Plan si actif]
//   [Boutons Like/Share en haut droite]
//   [Statut ouvert/fermé coin gauche]
//   [Badge événement si présent]
//   [Badge tendance si hot]
// [Contenu]
//   [Nom établissement]
//   [Catégorie principale]
//   [Adresse/Ville]
//   [Distance si géolocalisation]
//   [Note si disponible]
//   [Prix si disponible]
//   [Badge Premium si PREMIUM]

// Détails critiques:
// 1. Image: h-48 (mobile) / h-52 (desktop), object-cover
// 2. Border-radius: 12px (rounded-xl)
// 3. Shadow: shadow-sm, hover:shadow-lg
// 4. Hover effect: translateY(-4px) + shadow augmentée
// 5. Premium border: ring-2 ring-orange-400 ring-opacity-80
// 6. Badge tendance: absolu bottom-2 right-2 avec gradient
// 7. Boutons Like/Share: absolu top-10 right-2, transparents
// 8. Statut ouvert: point vert/rouge top-2 left-2
```

#### Badges à reproduire

```typescript
// Badge Tendance (si isHot)
{
  position: 'absolute',
  bottom: 8,
  right: 8,
  backgroundColor: 'rgba(255, 117, 31, 0.9)', // orange avec transparence
  paddingHorizontal: 8,
  paddingVertical: 4,
  borderRadius: 9999,
  flexDirection: 'row',
  alignItems: 'center',
  gap: 4,
}

// Badge Premium (si subscription === 'PREMIUM')
{
  borderWidth: 2,
  borderColor: '#fb923c', // orange-400
  borderOpacity: 0.8,
  // + animation gradient border si possible
}

// Badge Bon Plan (si activeDeal)
{
  position: 'absolute',
  top: 0,
  left: 0,
  right: 0,
  backgroundColor: 'rgba(127, 0, 254, 0.6)', // violet avec transparence
  backdropFilter: 'blur(2px)',
  borderTopLeftRadius: 12,
  borderTopRightRadius: 12,
  padding: 16,
}
```

### 3. FILTRES DE RECHERCHE (SearchFilters)

#### Structure exacte

```typescript
// src/components/FilterBar.tsx
// DOIT REPRODUIRE EXACTEMENT SearchFilters.tsx du site

const filters = [
  { id: 'popular', label: 'Populaire', icon: TrendingUp, description: 'Les plus visités' },
  { id: 'wanted', label: 'Désirés ++', icon: Heart, description: 'Les plus aimés' },
  { id: 'cheap', label: 'Les - cher', icon: DollarSign, description: 'Prix abordables' },
  { id: 'premium', label: 'Notre sélection', icon: Crown, description: 'Établissements premium' },
  { id: 'newest', label: 'Nouveaux', icon: Clock, description: 'Derniers ajouts' },
  { id: 'rating', label: 'Mieux notés', icon: Star, description: 'Meilleures notes' },
];

// Style filtre INACTIF:
{
  backgroundColor: '#f3f4f6', // gray-100
  color: '#374151',            // gray-700
  paddingHorizontal: 16,
  paddingVertical: 12,
  borderRadius: 9999,
  fontSize: 14,
  fontWeight: '500',
}

// Style filtre ACTIF:
{
  // Gradient orange→pink
  backgroundColor: 'transparent',
  background: LinearGradient({ colors: ['#f97316', '#ec4899'] }),
  color: '#ffffff',
  shadowColor: '#f97316',
  shadowOffset: { width: 0, height: 4 },
  shadowOpacity: 0.3,
  shadowRadius: 8,
  transform: [{ scale: 1.05 }], // scale-105
}
```

### 4. ÉTATS DE CHARGEMENT

#### Loading spinner (exact)

```typescript
// src/components/LoadingSpinner.tsx
// DOIT REPRODUIRE EXACTEMENT le spinner du site

{
  width: 48,
  height: 48,
  borderRadius: 9999,
  borderWidth: 2,
  borderColor: '#f97316',      // orange-500
  borderTopColor: 'transparent',
  // Animation: rotate 360deg infinite
}

// Usage dans pages:
<View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', height: 256 }}>
  <LoadingSpinner />
</View>
```

#### États vides (exact)

```typescript
// Pattern exact du site pour "Aucun résultat"
{
  backgroundColor: '#ffffff',
  borderRadius: 16,
  padding: 48,
  alignItems: 'center',
}

// Icône dans cercle gradient
{
  width: 96,
  height: 96,
  borderRadius: 9999,
  backgroundColor: 'rgba(255, 117, 31, 0.1)', // orange-100
  justifyContent: 'center',
  alignItems: 'center',
  marginBottom: 24,
}

// Message
{
  fontSize: 24,
  fontWeight: '700',
  color: '#111827',
  marginBottom: 12,
  textAlign: 'center',
}
```

#### États d'erreur (exact)

```typescript
// Pattern exact du site pour erreurs
{
  alignItems: 'center',
  padding: 32,
}

// Titre erreur
{
  fontSize: 24,
  fontWeight: '700',
  color: '#dc2626', // red-600
  marginBottom: 16,
}

// Message erreur
{
  fontSize: 16,
  color: '#6b7280',
  marginBottom: 24,
  textAlign: 'center',
}

// Bouton retour
{
  backgroundColor: '#f97316', // orange-500
  color: '#ffffff',
  paddingHorizontal: 24,
  paddingVertical: 12,
  borderRadius: 8,
  fontSize: 16,
  fontWeight: '500',
}
```

---

## 🎯 PATTERNS D'INTERACTION EXACTS

### 1. Hover effects (mobile = press)

```typescript
// Cartes établissement
onPressIn: {
  transform: [{ translateY: -4 }], // translateY(-4px)
  shadowOpacity: 0.15,
  shadowRadius: 20,
}

// Boutons
onPressIn: {
  transform: [{ scale: 0.98 }],
  opacity: 0.9,
}

// Filtres
onPressIn: {
  transform: [{ scale: 1.05 }], // scale-105
}
```

### 2. Transitions

```typescript
// Durée standard
const TRANSITION_DURATION = 300; // ms

// Easing
const EASING = Easing.bezier(0.4, 0, 0.2, 1); // cubic-bezier(0.4, 0, 0.2, 1)

// Usage
Animated.timing(animatedValue, {
  toValue: 1,
  duration: TRANSITION_DURATION,
  easing: EASING,
  useNativeDriver: true,
});
```

### 3. Animations spécifiques

#### Typewriter cursor blink

```typescript
// Animation curseur clignotant orange
Animated.loop(
  Animated.sequence([
    Animated.timing(cursorOpacity, {
      toValue: 0,
      duration: 500,
    }),
    Animated.timing(cursorOpacity, {
      toValue: 1,
      duration: 500,
    }),
  ])
);
```

#### Shimmer loading (images)

```typescript
// Effet shimmer pour images en chargement
const shimmerAnimation = Animated.loop(
  Animated.sequence([
    Animated.timing(shimmerPosition, {
      toValue: 1,
      duration: 1500,
      easing: Easing.linear,
    }),
    Animated.timing(shimmerPosition, {
      toValue: 0,
      duration: 0,
    }),
  ])
);
```

---

## 📐 LAYOUTS EXACTS

### 1. Page d'accueil

```typescript
// Structure exacte:
// 1. Hero Section
//    - Fond avec gradient hero-gradient opacity-16
//    - Badge "La plateforme ultra-locale de TOUS les divertissements"
//    - H1 "DÉCOUVREZ TOUTES VOS ENVIES, PRÈS DE CHEZ VOUS"
//    - EnvieSearchBar
//    - (Optionnel: vidéo danse à droite sur desktop)

// 2. DynamicEstablishmentsSection
//    - Carousel établissements avec scroll horizontal

// 3. EventsCarousel
//    - Section "Événements à venir"

// 4. Section "Comment ça marche ?"
//    - 3 étapes avec cercles gradient
//    - Gradient étape 1: orange→pink
//    - Gradient étape 2: pink→red
//    - Gradient étape 3: red→orange

// 5. DailyDealsCarousel
//    - Section "Bons Plans du Jour"

// 6. Témoignages
//    - Grille 3 colonnes (desktop) / 1 colonne (mobile)
//    - Cartes blanches avec shadow-sm, hover:shadow-md
```

### 2. Page résultats recherche

```typescript
// Structure exacte:
// 1. Header
//    - Titre "Résultats de recherche"
//    - Compteur résultats
//    - Lien "Nouvelle recherche" (orange)

// 2. SearchFilters
//    - Titre "Trier par :"
//    - Barre filtres horizontale scrollable

// 3. Layout grille + carte (desktop)
//    - Grille 2/3 largeur (établissements)
//    - Carte 1/3 largeur (map), sticky top-24

// 4. Pagination
//    - Bouton "Voir plus" avec compteur
//    - 15 résultats par page
```

---

## 🔍 DÉTAILS CRITIQUES À RESPECTER

### 1. Espacements

```typescript
export const Spacing = {
  xs: 4, // gap-1
  sm: 8, // gap-2
  md: 12, // gap-3
  lg: 16, // gap-4
  xl: 24, // gap-6
  '2xl': 32, // gap-8
  '3xl': 48, // gap-12
};
```

### 2. Tailles d'images

```typescript
export const ImageSizes = {
  cardHeight: 192, // h-48 (mobile)
  cardHeightDesktop: 208, // h-52 (desktop)
  avatar: 40,
  icon: 16,
  iconSmall: 12,
};
```

### 3. Z-index

```typescript
export const ZIndex = {
  base: 0,
  dropdown: 50,
  sticky: 100,
  modal: 200,
  toast: 300,
};
```

---

## ✅ CHECKLIST DE COHÉRENCE

Pour chaque composant créé, vérifier:

- [ ] Couleurs exactes (#ff751f, #ff1fa9, #ff3a3a)
- [ ] Police Inter chargée et appliquée
- [ ] Gradients identiques (angles, couleurs, locations)
- [ ] Border-radius identiques (12px cartes, 24px boutons)
- [ ] Ombres identiques (shadow-sm → shadow-lg au hover)
- [ ] Transitions identiques (300ms, cubic-bezier)
- [ ] Espacements identiques (gap-3, gap-4, etc.)
- [ ] Tailles de texte identiques (h1: 48px, h2: 30px, etc.)
- [ ] États identiques (loading, error, empty)
- [ ] Animations identiques (typewriter, shimmer, hover)

---

## 500 à 600 lignes maximum avant refactorisation du code

Ce guide garantit une cohérence maximale entre le site web et l'application mobile. Chaque composant doit respecter ces spécifications exactes pour une expérience utilisateur identique.
