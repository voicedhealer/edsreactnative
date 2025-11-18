import * as Keychain from 'react-native-keychain';
import { supabase } from './supabase';
import type { Session } from '@supabase/supabase-js';

const ACCESS_TOKEN_KEY = 'supabase_access_token';
const REFRESH_TOKEN_KEY = 'supabase_refresh_token';
const SESSION_KEY = 'supabase_session';

export interface TokenStorage {
  accessToken: string | null;
  refreshToken: string | null;
  expiresAt: number | null;
}

/**
 * Service de gestion sécurisée des tokens avec Keychain
 */
export class TokenService {
  /**
   * Sauvegarde les tokens de manière sécurisée dans Keychain
   */
  static async saveTokens(session: Session): Promise<void> {
    try {
      const accessToken = session.access_token;
      const refreshToken = session.refresh_token;
      const expiresAt = session.expires_at ? session.expires_at * 1000 : null; // Convertir en millisecondes

      // Sauvegarder l'access token dans Keychain
      await Keychain.setGenericPassword(ACCESS_TOKEN_KEY, accessToken, {
        service: ACCESS_TOKEN_KEY,
        accessible: Keychain.ACCESSIBLE.WHEN_UNLOCKED_THIS_DEVICE_ONLY,
      });

      // Sauvegarder le refresh token dans Keychain (plus sensible)
      await Keychain.setGenericPassword(REFRESH_TOKEN_KEY, refreshToken, {
        service: REFRESH_TOKEN_KEY,
        accessible: Keychain.ACCESSIBLE.WHEN_UNLOCKED_THIS_DEVICE_ONLY,
        accessControl: Keychain.ACCESS_CONTROL.BIOMETRY_ANY_OR_DEVICE_PASSCODE, // Optionnel : biométrie
      });

      // Sauvegarder les métadonnées de session (expiresAt)
      if (expiresAt) {
        await Keychain.setGenericPassword(SESSION_KEY, JSON.stringify({ expiresAt }), {
          service: SESSION_KEY,
          accessible: Keychain.ACCESSIBLE.WHEN_UNLOCKED_THIS_DEVICE_ONLY,
        });
      }
    } catch (error) {
      console.error('Erreur lors de la sauvegarde des tokens:', error);
      throw error;
    }
  }

  /**
   * Récupère les tokens depuis Keychain
   */
  static async getTokens(): Promise<TokenStorage | null> {
    try {
      const accessTokenCreds = await Keychain.getGenericPassword({
        service: ACCESS_TOKEN_KEY,
      });
      const refreshTokenCreds = await Keychain.getGenericPassword({
        service: REFRESH_TOKEN_KEY,
        authenticationPrompt: {
          title: 'Authentification requise',
          subtitle: 'Veuillez vous authentifier pour accéder à votre compte',
          description: 'Utilisez votre empreinte digitale ou votre code PIN',
          cancel: 'Annuler',
        },
      });
      const sessionCreds = await Keychain.getGenericPassword({
        service: SESSION_KEY,
      });

      if (!accessTokenCreds || !refreshTokenCreds) {
        return null;
      }

      let expiresAt: number | null = null;
      if (sessionCreds) {
        try {
          const sessionData = JSON.parse(sessionCreds.password);
          expiresAt = sessionData.expiresAt;
        } catch {
          // Ignorer l'erreur de parsing
        }
      }

      return {
        accessToken: accessTokenCreds.password,
        refreshToken: refreshTokenCreds.password,
        expiresAt,
      };
    } catch (error) {
      console.error('Erreur lors de la récupération des tokens:', error);
      return null;
    }
  }

  /**
   * Vérifie si les tokens sont expirés
   */
  static async isTokenExpired(): Promise<boolean> {
    const tokens = await this.getTokens();
    if (!tokens || !tokens.expiresAt) {
      return true;
    }

    // Ajouter une marge de sécurité de 5 minutes avant expiration
    const bufferTime = 5 * 60 * 1000; // 5 minutes en millisecondes
    return Date.now() >= tokens.expiresAt - bufferTime;
  }

  /**
   * Rafraîchit le token d'accès en utilisant le refresh token
   */
  static async refreshAccessToken(): Promise<Session | null> {
    try {
      const tokens = await this.getTokens();
      if (!tokens || !tokens.refreshToken) {
        return null;
      }

      const { data, error } = await supabase.auth.refreshSession({
        refresh_token: tokens.refreshToken,
      });

      if (error) {
        console.error('Erreur lors du refresh du token:', error);
        return null;
      }

      if (data.session) {
        await this.saveTokens(data.session);
        return data.session;
      }

      return null;
    } catch (error) {
      console.error('Erreur lors du refresh du token:', error);
      return null;
    }
  }

  /**
   * Supprime tous les tokens de Keychain
   */
  static async clearTokens(): Promise<void> {
    try {
      await Promise.all([
        Keychain.resetGenericPassword({ service: ACCESS_TOKEN_KEY }),
        Keychain.resetGenericPassword({ service: REFRESH_TOKEN_KEY }),
        Keychain.resetGenericPassword({ service: SESSION_KEY }),
      ]);
    } catch (error) {
      console.error('Erreur lors de la suppression des tokens:', error);
      throw error;
    }
  }

  /**
   * Vérifie si l'authentification biométrique est disponible
   */
  static async isBiometricAvailable(): Promise<boolean> {
    try {
      const biometryType = await Keychain.getSupportedBiometryType();
      return biometryType !== null;
    } catch {
      return false;
    }
  }

  /**
   * Configure l'authentification biométrique pour les tokens
   */
  static async enableBiometricAuth(): Promise<boolean> {
    try {
      const isAvailable = await this.isBiometricAvailable();
      if (!isAvailable) {
        return false;
      }

      // Re-sauvegarder le refresh token avec biométrie
      const tokens = await this.getTokens();
      if (tokens && tokens.refreshToken) {
        await Keychain.setGenericPassword(REFRESH_TOKEN_KEY, tokens.refreshToken, {
          service: REFRESH_TOKEN_KEY,
          accessible: Keychain.ACCESSIBLE.WHEN_UNLOCKED_THIS_DEVICE_ONLY,
          accessControl: Keychain.ACCESS_CONTROL.BIOMETRY_ANY_OR_DEVICE_PASSCODE,
        });
        return true;
      }
      return false;
    } catch (error) {
      console.error("Erreur lors de l'activation de la biométrie:", error);
      return false;
    }
  }

  /**
   * Désactive l'authentification biométrique
   */
  static async disableBiometricAuth(): Promise<void> {
    try {
      const tokens = await this.getTokens();
      if (tokens && tokens.refreshToken) {
        await Keychain.setGenericPassword(REFRESH_TOKEN_KEY, tokens.refreshToken, {
          service: REFRESH_TOKEN_KEY,
          accessible: Keychain.ACCESSIBLE.WHEN_UNLOCKED_THIS_DEVICE_ONLY,
          // Pas d'accessControl = pas de biométrie
        });
      }
    } catch (error) {
      console.error('Erreur lors de la désactivation de la biométrie:', error);
    }
  }

  /**
   * Récupère le type de biométrie disponible
   */
  static async getBiometryType(): Promise<string | null> {
    try {
      return await Keychain.getSupportedBiometryType();
    } catch {
      return null;
    }
  }
}

/**
 * Hook pour gérer le refresh automatique des tokens
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
