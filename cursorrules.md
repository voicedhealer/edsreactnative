# 📱 PROMPT STRUCTURÉ - DÉVELOPPEMENT MOBILE REACT NATIVE

## Envie2Sortir Mobile App (iOS & Android) - VERSION COMPLÈTE

---

## 🎨 CHARTE GRAPHIQUE & DESIGN SYSTEM

### Couleurs officielles

```typescript
// src/constants/colors.ts
export const Colors = {
  // Couleurs principales
  brandOrange: '#ff751f',
  brandPink: '#ff1fa9',
  brandRed: '#ff3a3a',

  // Couleurs système
  background: '#ffffff',
  foreground: '#171717',
  textPrimary: '#171717',
  textSecondary: '#6b7280',

  // Couleurs UI
  gray100: '#f3f4f6',
  gray200: '#e5e7eb',
  gray700: '#374151',
  gray900: '#111827',

  // Couleurs fonctionnelles
  success: '#16a34a',
  error: '#dc2626',
  warning: '#fbbf24',
};
```

### Typographie

```typescript
// src/constants/typography.ts
export const Typography = {
  // Police principale : Inter (Google Fonts)
  fontFamily: 'Inter',
  fontFamilyFallback: 'Arial, Helvetica, sans-serif',

  // Hiérarchie des tailles
  h1: { fontSize: 48, fontWeight: '700', lineHeight: 1.2 }, // 6xl
  h2: { fontSize: 30, fontWeight: '600', lineHeight: 1.3 }, // 3xl
  h3: { fontSize: 20, fontWeight: '600', lineHeight: 1.4 }, // xl
  body: { fontSize: 16, fontWeight: '400', lineHeight: 1.5 },
  small: { fontSize: 14, fontWeight: '400', lineHeight: 1.4 },
  caption: { fontSize: 12, fontWeight: '400', lineHeight: 1.3 },
};
```

### Gradients & effets visuels

#### Gradient principal (Hero, Boutons CTA)

```typescript
// Gradient 135deg orange → pink → rouge
const heroGradient = {
  colors: ['#ff751f', '#ff1fa9', '#ff3a3a'],
  start: { x: 0, y: 0 },
  end: { x: 1, y: 1 },
  locations: [0, 0.5, 1],
};

// Gradient bouton (135deg orange → pink)
const buttonGradient = {
  colors: ['#ff751f', '#ff1fa9'],
  start: { x: 0, y: 0 },
  end: { x: 1, y: 1 },
};
```

#### Animations & transitions

- Transitions: `cubic-bezier(0.4, 0, 0.2, 1)` (ease-out)
- Durée standard: `300ms`
- Hover cards: `translateY(-4px)` + `box-shadow` augmentée
- Shimmer loading: gradient animé pour images en chargement

### Composants UI patterns

#### Boutons

- Primary: gradient orange→pink, texte blanc, border-radius 24px (pills)
- Secondary: fond blanc, bordure grise, hover avec scale
- Action buttons: pills avec icônes, fond rgba(255,255,255,0.9), glassmorphism

#### Cartes établissements

- Border-radius: `12px`
- Hover effect: `translateY(-4px)` + shadow `0 20px 25px -5px rgba(0,0,0,0.1)`
- Transition: `all 0.3s cubic-bezier(0.4, 0, 0.2, 1)`
- Premium border: gradient animé `#ff751f → #ff1fa9 → #ff3a3a`

#### Navigation

- Glassmorphism: `rgba(255,255,255,0.85)` + `backdrop-filter: blur(12px)`
- Sticky avec shadow légère

---

## 🔍 LOGIQUE MÉTIER DÉTAILLÉE

### Système de filtres

#### Filtres disponibles

```typescript
// src/types/filters.ts
export type FilterType =
  | 'popular' // Tri par viewsCount (décroissant)
  | 'wanted' // Tri par likesCount (décroissant)
  | 'cheap' // Tri par priceMin/prixMoyen (croissant)
  | 'premium' // Tri par subscription (PREMIUM > FREE) puis score
  | 'newest' // Tri par createdAt (décroissant)
  | 'rating'; // Tri par avgRating (décroissant)

export const FILTERS = [
  { id: 'popular', label: 'Populaire', icon: 'TrendingUp', description: 'Les plus visités' },
  { id: 'wanted', label: 'Désirés ++', icon: 'Heart', description: 'Les plus aimés' },
  { id: 'cheap', label: 'Les - cher', icon: 'DollarSign', description: 'Prix abordables' },
  { id: 'premium', label: 'Notre sélection', icon: 'Crown', description: 'Établissements premium' },
  { id: 'newest', label: 'Nouveaux', icon: 'Clock', description: 'Derniers ajouts' },
  { id: 'rating', label: 'Mieux notés', icon: 'Star', description: 'Meilleures notes' },
];
```

#### Logique de tri (backend)

```typescript
// Implémentation côté mobile doit correspondre au backend
function applySorting(establishments: Establishment[], filter: FilterType) {
  switch (filter) {
    case 'popular':
      return establishments.sort((a, b) => (b.viewsCount || 0) - (a.viewsCount || 0));

    case 'wanted':
      return establishments.sort((a, b) => (b.likesCount || 0) - (a.likesCount || 0));

    case 'cheap':
      return establishments.sort((a, b) => {
        const priceA = a.priceMin || a.prixMoyen || 999;
        const priceB = b.priceMin || b.prixMoyen || 999;
        return priceA - priceB;
      });

    case 'premium':
      return establishments.sort((a, b) => {
        const subscriptionOrder = { PREMIUM: 2, FREE: 1 };
        const orderA = subscriptionOrder[a.subscription] || 0;
        const orderB = subscriptionOrder[b.subscription] || 0;
        if (orderA !== orderB) return orderB - orderA;
        return (b.score || 0) - (a.score || 0);
      });

    case 'newest':
      return establishments.sort(
        (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );

    case 'rating':
      return establishments.sort((a, b) => (b.avgRating || 0) - (a.avgRating || 0));

    default:
      return establishments.sort((a, b) => (b.score || 0) - (a.score || 0));
  }
}
```

### Recherche "envie"

#### Extraction de mots-clés

```typescript
// La recherche backend extrait intelligemment les mots-clés
// Côté mobile, on doit afficher les suggestions et gérer l'autocomplete

interface SearchKeywords {
  keywords: string[];
  primaryKeywords: string[]; // Mots d'action (escape, vr, restaurant, etc.)
  contextKeywords: string[]; // Mots de contexte (soir, après-midi, etc.)
}

// Exemple: "envie escape game ce soir"
// → primaryKeywords: ['escape', 'game']
// → contextKeywords: ['soir']
// → keywords: ['envie', 'escape', 'game', 'ce', 'soir']
```

#### Paramètres API recherche

```typescript
// GET /api/recherche/filtered
interface SearchParams {
  envie: string; // REQUIS - terme de recherche
  ville?: string; // Optionnel - ville de recherche
  filter?: FilterType; // Défaut: 'popular'
  page?: number; // Défaut: 1
  limit?: number; // Défaut: 15
  lat?: number; // Optionnel - latitude
  lng?: number; // Optionnel - longitude
  rayon?: number; // Défaut: 5 (km)
}
```

### Système d'engagement événements

#### Types d'engagement

```typescript
export type EngagementType =
  | 'envie' // Score: +1, Karma: +1
  | 'grande-envie' // Score: +3, Karma: +3
  | 'decouvrir' // Score: +2, Karma: +2
  | 'pas-envie'; // Score: -1, Karma: -1

// Calcul du score d'engagement
// Score = (envie × 1) + (grande-envie × 3) + (decouvrir × 2) + (pas-envie × -1)
// Pourcentage = min((Score / 15) × 100, 150)
```

#### Badges événements

```typescript
interface EventBadge {
  type: 'bronze' | 'silver' | 'gold' | 'violet';
  label: string;
  color: string;
}

// Seuils:
// 50-74%: 👍 Apprécié (Bronze)
// 75-99%: ⭐ Populaire (Argent)
// 100-149%: 🏆 Coup de Cœur (Or)
// 150%+: 🔥 C'EST LE FEU ! (Violet - animation spéciale)
```

#### Gamification utilisateur

```typescript
interface UserGamification {
  karmaPoints: number;
  badges: UserBadge[];
}

// Badges personnels:
// 🔍 Curieux: 5 engagements
// 🗺️ Explorateur: 15 engagements
// 👑 Ambassadeur: 50 engagements
// 🎆 Feu d'artifice: Contribuer à un événement 150%+
```

### Géolocalisation

#### Rayon de recherche

- Défaut: `5km`
- Paramètre API: `rayon` (en km)
- Calcul distance: formule Haversine

#### Permissions

- iOS: `NSLocationWhenInUseUsageDescription`
- Android: `ACCESS_FINE_LOCATION` + `ACCESS_COARSE_LOCATION`
- Gérer refus gracieusement avec fallback sur recherche par ville

---

## 📋 MISE À JOUR DES ÉTAPES DE DÉVELOPPEMENT

### PHASE 1: SETUP PROJET & INFRASTRUCTURE

#### Étape 1.1: Initialisation avec Design System

**Cursor Rule:**

```
cursor: create React Native project with Expo, setup TypeScript, create constants files for colors (brandOrange #ff751f, brandPink #ff1fa9, brandRed #ff3a3a), typography (Inter font), and design tokens (gradients, shadows, border-radius)
```

**Actions:**

1. Créer projet Expo
2. Créer `src/constants/colors.ts` avec palette exacte
3. Créer `src/constants/typography.ts` avec hiérarchie Inter
4. Créer `src/constants/designTokens.ts` pour gradients, shadows, animations
5. Configurer police Inter (via `expo-font` ou `@expo-google-fonts/inter`)

**Fichiers à créer:**

```typescript
// src/constants/colors.ts
export const Colors = {
  /* ... */
};

// src/constants/typography.ts
export const Typography = {
  /* ... */
};

// src/constants/designTokens.ts
export const Gradients = {
  hero: { colors: ['#ff751f', '#ff1fa9', '#ff3a3a'] /* ... */ },
  button: { colors: ['#ff751f', '#ff1fa9'] /* ... */ },
};

export const Shadows = {
  card: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
  },
  cardHover: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 20,
  },
};

export const BorderRadius = {
  card: 12,
  button: 24,
  input: 8,
};
```

**Résultat attendu:** Design system configuré avec couleurs, typographie et tokens

---

### PHASE 4: ÉCRANS PRINCIPAUX (MISE À JOUR)

#### Étape 4.2: Écran de recherche & résultats (DÉTAILLÉE)

**Cursor Rule:**

```
cursor: create SearchResultsScreen.tsx with FilterBar component implementing exact filter logic (popular=viewsCount desc, wanted=likesCount desc, cheap=priceMin asc, premium=subscription PREMIUM first, newest=createdAt desc, rating=avgRating desc), infinite scroll with 15 items per page, map/list toggle view, EstablishmentCard with exact design system (border-radius 12px, hover translateY(-4px), gradient borders for premium)
```

**Actions:**

1. Créer `src/components/FilterBar.tsx` avec les 6 filtres exacts
2. Implémenter logique de tri correspondant au backend
3. Créer `src/components/EstablishmentCard.tsx` avec:
   - Gradient border animé pour établissements premium
   - Hover effect: `translateY(-4px)` + shadow
   - Badge "Notre sélection" pour premium
   - Affichage distance si géolocalisation activée
4. Pagination infinie avec `FlatList` + `onEndReached`
5. Toggle vue liste/carte

**Composant FilterBar:**

```typescript
// src/components/FilterBar.tsx
import { FilterType, FILTERS } from '@/types/filters';

interface FilterBarProps {
  activeFilter: FilterType;
  onFilterChange: (filter: FilterType) => void;
}

export const FilterBar = ({ activeFilter, onFilterChange }: FilterBarProps) => {
  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false}>
      {FILTERS.map((filter) => (
        <TouchableOpacity
          key={filter.id}
          onPress={() => onFilterChange(filter.id)}
          style={[
            styles.filterButton,
            activeFilter === filter.id && styles.filterButtonActive,
          ]}
        >
          <Text style={activeFilter === filter.id ? styles.filterTextActive : styles.filterText}>
            {filter.label}
          </Text>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
};

// Styles avec gradient pour filtre actif
const styles = StyleSheet.create({
  filterButtonActive: {
    backgroundColor: '#ff751f', // Ou utiliser LinearGradient
    // ... gradient orange→pink
  },
});
```

**Résultat attendu:** Écran recherche avec filtres fonctionnels et design conforme

---

#### Étape 4.3: Écran détails établissement (DÉTAILLÉE)

**Cursor Rule:**

```
cursor: create EstablishmentDetailScreen.tsx with ImageGallery using swipeable carousel, hero gradient section, info sections matching web design, EventsList with engagement buttons (envie, grande-envie, découvrir, pas-envie), CommentsSection, favorite button with heart animation, share functionality, map integration with custom markers using brand colors
```

**Actions:**

1. Créer `ImageGallery.tsx` avec swipeable (react-native-snap-carousel ou FlatList horizontal)
2. Hero section avec gradient `#ff751f → #ff1fa9 → #ff3a3a`
3. Intégrer `EventEngagementButtons.tsx` avec API `/api/events/[eventId]/engage`
4. Afficher jauge d'engagement avec gradient (vert→jaune→orange→rouge→violet)
5. Badge premium avec bordure gradient animée

**Résultat attendu:** Écran détail conforme au design web

---

### PHASE 5: FONCTIONNALITÉS AVANCÉES (MISE À JOUR)

#### Étape 5.3: Système d'engagement événements (DÉTAILLÉE)

**Cursor Rule:**

```
cursor: create EventEngagementButtons.tsx with 4 buttons (envie +1, grande-envie +3, découvrir +2, pas-envie -1), EventEngagementGauge.tsx with gradient colors (green→yellow→orange→red→violet) and fire mode animation for 150%+, integrate with API /api/events/[eventId]/engage POST, display badges (bronze/silver/gold/violet), update user karma points, show new badge notifications
```

**Actions:**

1. Créer composants engagement avec scores exacts
2. Jauge avec gradient multi-couleurs et animation "fire mode" pour 150%+
3. Intégrer API avec gestion karma et badges
4. Notifications badges débloqués

**Résultat attendu:** Système engagement fonctionnel avec animations

---

## 🎯 COMPOSANTS UI À CRÉER (CHECKLIST)

### Composants de base

- [ ] `GradientButton.tsx` - Bouton avec gradient orange→pink
- [ ] `GradientCard.tsx` - Carte avec bordure gradient animée (premium)
- [ ] `FilterChip.tsx` - Chip filtre avec état actif (gradient)
- [ ] `EstablishmentCard.tsx` - Carte établissement avec hover effect
- [ ] `EventCard.tsx` - Carte événement avec engagement
- [ ] `ImageGallery.tsx` - Galerie swipeable avec placeholder shimmer

### Composants fonctionnels

- [ ] `SearchBar.tsx` - Double input (ville + activité) avec autocomplete
- [ ] `FilterBar.tsx` - Barre filtres horizontale scrollable
- [ ] `EventEngagementButtons.tsx` - 4 boutons engagement
- [ ] `EventEngagementGauge.tsx` - Jauge avec gradient et fire mode
- [ ] `UserBadges.tsx` - Affichage badges utilisateur
- [ ] `GeolocationButton.tsx` - Bouton "Autour de moi" avec permission

### Composants navigation

- [ ] `BottomTabBar.tsx` - Barre onglets avec glassmorphism
- [ ] `Header.tsx` - Header avec glassmorphism et logo

---

## 📐 SPÉCIFICATIONS DESIGN MOBILE

### Espacements

- Padding standard: `16px`
- Gap entre éléments: `12px` / `16px` / `24px`
- Border-radius: cartes `12px`, boutons `24px` (pills)

### Tailles d'écran

- Mobile: `375px` (iPhone SE) à `428px` (iPhone Pro Max)
- Tablet: `768px` à `1024px` (iPad)
- Breakpoints: `sm: 640px`, `md: 768px`, `lg: 1024px`

### Animations

- Durée standard: `300ms`
- Easing: `cubic-bezier(0.4, 0, 0.2, 1)`
- Hover cards: `translateY(-4px)` + shadow
- Shimmer: gradient animé pour loading

---

## 🔗 ENDPOINTS API À INTÉGRER

### Recherche

- `GET /api/recherche/filtered` - Recherche avec filtres
- `GET /api/recherche/envie` - Recherche "envie" intelligente
- `GET /api/geocode` - Géocodage adresses

### Établissements

- `GET /api/etablissements` - Liste établissements
- `GET /api/etablissements/[slug]` - Détail établissement
- `GET /api/etablissements/[slug]/events` - Événements établissement

### Engagement

- `POST /api/events/[eventId]/engage` - Créer engagement
- `GET /api/events/[eventId]/engage` - Stats engagement
- `GET /api/events/upcoming` - Événements à venir
- `GET /api/user/gamification` - Badges et karma utilisateur

### Utilisateur

- `GET /api/user/favorites` - Liste favoris
- `POST /api/user/favorites/[id]` - Ajouter favori
- `DELETE /api/user/favorites/[id]` - Retirer favori

---

Cette version intègre la charte graphique, la typographie Inter, les gradients, les filtres, l'engagement et la gamification. Chaque composant doit respecter ces spécifications pour rester cohérent avec le site web.
