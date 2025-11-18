// Types globaux de l'application

// Types d'authentification
export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface AuthResponse {
  user: User;
  token: string;
  refreshToken?: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  name: string;
  email: string;
  password: string;
}

// Types d'API
export interface ApiResponse<T> {
  data: T;
  message?: string;
  success: boolean;
}

export interface ApiError {
  message: string;
  code?: string;
  status?: number;
}

// Types de navigation sont maintenant dans @navigation/types
// Importez-les depuis '@navigation/types' si nécessaire

// Types génériques
export type Status = 'idle' | 'loading' | 'success' | 'error';

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  hasMore: boolean;
}

// Types pour les établissements
export interface Establishment {
  id: string;
  name: string;
  description?: string;
  address: string;
  city: string;
  postalCode: string;
  latitude?: number;
  longitude?: number;
  phone?: string;
  email?: string;
  website?: string;
  images?: string[];
  rating?: number;
  avgRating?: number; // Note moyenne
  priceRange?: '€' | '€€' | '€€€' | '€€€€';
  priceMin?: number; // Prix minimum
  prixMoyen?: number; // Prix moyen
  category: string;
  tags?: string[];
  openingHours?: Record<string, string>;
  createdAt: string;
  updatedAt: string;
  // Propriétés étendues pour filtres et badges
  subscription?: 'FREE' | 'PREMIUM'; // Type d'abonnement
  viewsCount?: number; // Nombre de vues (pour filtre popular)
  likesCount?: number; // Nombre de likes (pour filtre wanted)
  score?: number; // Score de l'établissement
  isHot?: boolean; // Badge tendance
  activeDeal?: boolean; // Badge bon plan actif
  isOpen?: boolean; // Statut ouvert/fermé
  distance?: number; // Distance en km (calculée côté client)
}

// Types pour les événements
export interface Event {
  id: string;
  title: string;
  description: string;
  establishmentId: string;
  establishment?: Establishment;
  startDate: string;
  endDate?: string;
  price?: number;
  images?: string[];
  category: string;
  tags?: string[];
  maxParticipants?: number;
  currentParticipants?: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

// Types pour les favoris
export interface Favorite {
  id: string;
  userId: string;
  establishmentId?: string;
  eventId?: string;
  establishment?: Establishment;
  event?: Event;
  createdAt: string;
}

// Types pour la recherche
export interface SearchFilters {
  query?: string;
  category?: string;
  city?: string;
  priceRange?: string;
  tags?: string[];
  latitude?: number;
  longitude?: number;
  radius?: number; // en km
  minRating?: number;
  dateFrom?: string;
  dateTo?: string;
}

export interface SearchParams extends SearchFilters {
  page?: number;
  limit?: number;
  sortBy?: 'relevance' | 'rating' | 'distance' | 'date' | 'price';
  sortOrder?: 'asc' | 'desc';
}

// Types pour la gamification
export interface UserBadge {
  id: string;
  type: 'curieux' | 'explorateur' | 'ambassadeur' | 'feu-artifice';
  label: string;
  emoji: string;
  description: string;
  unlockedAt?: string;
}

export interface UserGamification {
  karmaPoints: number;
  badges: UserBadge[];
  totalEngagements: number;
}

// Ajoutez vos types personnalisés ici
