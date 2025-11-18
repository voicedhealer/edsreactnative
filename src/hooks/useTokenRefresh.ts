import { useEffect, useRef } from 'react';
import { AppState, AppStateStatus } from 'react-native';
import { TokenService, setupTokenRefresh } from '@services/tokenService';

/**
 * Hook pour gérer le refresh automatique des tokens
 * Rafraîchit les tokens quand l'app revient au premier plan
 */
export const useTokenRefresh = () => {
  const { startAutoRefresh, stopAutoRefresh } = setupTokenRefresh();
  const appState = useRef<AppStateStatus>(AppState.currentState);

  useEffect(() => {
    // Démarrer le refresh automatique
    startAutoRefresh();

    // Écouter les changements d'état de l'application
    const subscription = AppState.addEventListener('change', async nextAppState => {
      if (appState.current.match(/inactive|background/) && nextAppState === 'active') {
        // L'app revient au premier plan, vérifier et rafraîchir le token si nécessaire
        const isExpired = await TokenService.isTokenExpired();
        if (isExpired) {
          await TokenService.refreshAccessToken();
        }
      }
      appState.current = nextAppState;
    });

    // Vérifier le token au montage
    const checkTokenOnMount = async () => {
      const isExpired = await TokenService.isTokenExpired();
      if (isExpired) {
        await TokenService.refreshAccessToken();
      }
    };
    checkTokenOnMount();

    return () => {
      stopAutoRefresh();
      subscription.remove();
    };
  }, [startAutoRefresh, stopAutoRefresh]);
};
