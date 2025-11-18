import { NavigatorScreenParams } from '@react-navigation/native';
import type { SearchFilters } from '@types';

// Types pour la navigation d'authentification
export type AuthStackParamList = {
  Login: undefined;
  Register: undefined;
  ForgotPassword: undefined;
};

// Types pour les tabs principales
export type MainTabParamList = {
  Home: undefined;
  Search: undefined;
  Favorites: undefined;
  Profile: undefined;
};

// Types pour la stack principale (après authentification)
export type AppStackParamList = {
  MainTabs: NavigatorScreenParams<MainTabParamList>;
  EventDetails: { eventId: string };
  EstablishmentDetails: { establishmentId: string };
  CreateEvent: undefined;
  EditProfile: undefined;
  Settings: undefined;
  SearchResults: {
    city?: string;
    activity?: string;
    category?: string;
    filters?: SearchFilters;
  };
  Map: undefined;
  Favorites: undefined;
  Login: undefined;
  Register: undefined;
  ForgotPassword: undefined;
};

// Type racine combinant auth et app
export type RootStackParamList = {
  Auth: NavigatorScreenParams<AuthStackParamList>;
  App: NavigatorScreenParams<AppStackParamList>;
};

// Déclaration globale pour useNavigation hook
declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList {}
  }
}
