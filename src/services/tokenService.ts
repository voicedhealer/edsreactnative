import * as SecureStore from 'expo-secure-store';
import { createClient } from '@supabase/supabase-js';
import type { Session, SupabaseClient } from '@supabase/supabase-js';

// Importer les variables d'environnement avec gestion d'erreur
let SUPABASE_URL: string | undefined;
let SUPABASE_ANON_KEY: string | undefined;

try {
  const envModule = require('@env');
  // Essayer d'abord sans préfixe, puis avec préfixe NEXT_PUBLIC_
  SUPABASE_URL =
    envModule.SUPABASE_URL ||
    envModule.NEXT_PUBLIC_SUPABASE_URL ||
    envModule.EXPO_PUBLIC_SUPABASE_URL;
  SUPABASE_ANON_KEY =
    envModule.SUPABASE_ANON_KEY ||
    envModule.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
    envModule.EXPO_PUBLIC_SUPABASE_ANON_KEY;
} catch (error) {
  // Fallback sur process.env avec plusieurs formats possibles
  SUPABASE_URL =
    process.env.SUPABASE_URL ||
    process.env.EXPO_PUBLIC_SUPABASE_URL ||
    process.env.NEXT_PUBLIC_SUPABASE_URL;
  SUPABASE_ANON_KEY =
    process.env.SUPABASE_ANON_KEY ||
    process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY ||
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
}

const ACCESS_TOKEN_KEY = 'supabase_access_token';
const REFRESH_TOKEN_KEY = 'supabase_refresh_token';
const SESSION_KEY = 'supabase_session';

export interface TokenStorage {
  accessToken: string | null;
  refreshToken: string | null;
  expiresAt: number | null;
}

/**
 * Service de gestion sécurisée des tokens avec SecureStore (Expo)
 */
export class TokenService {
  /**
   * Sauvegarde les tokens de manière sécurisée dans SecureStore
   */
  static async saveTokens(session: Session): Promise<void> {
    try {
      const accessToken = session.access_token;
      const refreshToken = session.refresh_token;
      const expiresAt = session.expires_at ? session.expires_at * 1000 : null; // Convertir en millisecondes

      // Sauvegarder l'access token dans SecureStore
      await SecureStore.setItemAsync(ACCESS_TOKEN_KEY, accessToken);

      // Sauvegarder le refresh token dans SecureStore
      await SecureStore.setItemAsync(REFRESH_TOKEN_KEY, refreshToken);

      // Sauvegarder les métadonnées de session (expiresAt)
      if (expiresAt) {
        await SecureStore.setItemAsync(SESSION_KEY, JSON.stringify({ expiresAt }));
      }
    } catch (error) {
      console.error('Erreur lors de la sauvegarde des tokens:', error);
      throw error;
    }
  }

  /**
   * Récupère les tokens depuis SecureStore
   */
  static async getTokens(): Promise<TokenStorage | null> {
    try {
      const accessToken = await SecureStore.getItemAsync(ACCESS_TOKEN_KEY);
      const refreshToken = await SecureStore.getItemAsync(REFRESH_TOKEN_KEY);
      const sessionData = await SecureStore.getItemAsync(SESSION_KEY);

      if (!accessToken || !refreshToken) {
        return null;
      }

      let expiresAt: number | null = null;
      if (sessionData) {
        try {
          const parsed = JSON.parse(sessionData);
          expiresAt = parsed.expiresAt || null;
        } catch (e) {
          // Ignorer l'erreur de parsing
        }
      }

      return {
        accessToken,
        refreshToken,
        expiresAt,
      };
    } catch (error) {
      console.error('Erreur lors de la récupération des tokens:', error);
      return null;
    }
  }

  /**
   * Supprime tous les tokens stockés
   */
  static async clearTokens(): Promise<void> {
    try {
      await SecureStore.deleteItemAsync(ACCESS_TOKEN_KEY);
      await SecureStore.deleteItemAsync(REFRESH_TOKEN_KEY);
      await SecureStore.deleteItemAsync(SESSION_KEY);
    } catch (error) {
      console.error('Erreur lors de la suppression des tokens:', error);
      throw error;
    }
  }

  /**
   * Vérifie si le token d'accès est expiré
   */
  static async isTokenExpired(): Promise<boolean> {
    try {
      const tokens = await this.getTokens();
      if (!tokens || !tokens.expiresAt) {
        return true;
      }
      // Ajouter une marge de sécurité de 5 minutes avant expiration
      const bufferTime = 5 * 60 * 1000; // 5 minutes en millisecondes
      return Date.now() >= tokens.expiresAt - bufferTime;
    } catch (error) {
      console.error("Erreur lors de la vérification de l'expiration du token:", error);
      return true;
    }
  }

  /**
   * Rafraîchit le token d'accès en utilisant le refresh token
   */
  static async refreshAccessToken(
    supabaseClient?: SupabaseClient
  ): Promise<{ accessToken: string; refreshToken: string } | null> {
    try {
      const tokens = await this.getTokens();
      if (!tokens || !tokens.refreshToken) {
        return null;
      }

      // Créer un client Supabase temporaire si non fourni
      let client = supabaseClient;
      if (!client) {
        if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
          throw new Error('Supabase credentials not available');
        }
        client = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
      }

      // Rafraîchir la session
      const { data, error } = await client.auth.refreshSession({
        refresh_token: tokens.refreshToken,
      });

      if (error || !data.session) {
        console.error('Erreur lors du rafraîchissement du token:', error);
        await this.clearTokens();
        return null;
      }

      // Sauvegarder la nouvelle session
      await this.saveTokens(data.session);

      return {
        accessToken: data.session.access_token,
        refreshToken: data.session.refresh_token,
      };
    } catch (error) {
      console.error('Erreur lors du rafraîchissement du token:', error);
      await this.clearTokens();
      return null;
    }
  }
}

/**
 * Fonction pour gérer le refresh automatique des tokens
 */
export const setupTokenRefresh = () => {
  let refreshInterval: NodeJS.Timeout | null = null;

  const startAutoRefresh = () => {
    // Vérifier toutes les 5 minutes si le token doit être rafraîchi
    refreshInterval = setInterval(
      async () => {
        const isExpired = await TokenService.isTokenExpired();
        if (isExpired) {
          await TokenService.refreshAccessToken();
        }
      },
      5 * 60 * 1000
    ); // 5 minutes
  };

  const stopAutoRefresh = () => {
    if (refreshInterval) {
      clearInterval(refreshInterval);
      refreshInterval = null;
    }
  };

  return {
    startAutoRefresh,
    stopAutoRefresh,
  };
};
