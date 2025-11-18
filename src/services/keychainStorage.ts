import * as Keychain from 'react-native-keychain';
import type { Session } from '@supabase/supabase-js';
import { TokenService } from './tokenService';

/**
 * Storage personnalisé pour Supabase utilisant Keychain au lieu d'AsyncStorage
 * pour une meilleure sécurité des tokens
 */
export const keychainStorage = {
  getItem: async (key: string): Promise<string | null> => {
    try {
      if (key.includes('session')) {
        // Pour les sessions, utiliser Keychain
        const tokens = await TokenService.getTokens();
        if (tokens && tokens.accessToken && tokens.refreshToken) {
          // Reconstruire la session depuis les tokens
          const session: Partial<Session> = {
            access_token: tokens.accessToken,
            refresh_token: tokens.refreshToken,
            expires_at: tokens.expiresAt ? Math.floor(tokens.expiresAt / 1000) : undefined,
          };
          return JSON.stringify(session);
        }
        return null;
      }
      // Pour les autres clés, utiliser Keychain générique
      const creds = await Keychain.getGenericPassword({ service: key });
      return creds ? creds.password : null;
    } catch (error) {
      console.error(`Erreur lors de la récupération de ${key}:`, error);
      return null;
    }
  },

  setItem: async (key: string, value: string): Promise<void> => {
    try {
      if (key.includes('session')) {
        // Pour les sessions, parser et sauvegarder dans Keychain
        const session: Session = JSON.parse(value);
        await TokenService.saveTokens(session);
      } else {
        // Pour les autres clés, utiliser Keychain générique
        await Keychain.setGenericPassword(key, value, {
          service: key,
          accessible: Keychain.ACCESSIBLE.WHEN_UNLOCKED_THIS_DEVICE_ONLY,
        });
      }
    } catch (error) {
      console.error(`Erreur lors de la sauvegarde de ${key}:`, error);
      throw error;
    }
  },

  removeItem: async (key: string): Promise<void> => {
    try {
      if (key.includes('session')) {
        await TokenService.clearTokens();
      } else {
        await Keychain.resetGenericPassword({ service: key });
      }
    } catch (error) {
      console.error(`Erreur lors de la suppression de ${key}:`, error);
    }
  },
};
