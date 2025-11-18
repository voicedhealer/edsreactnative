# Store (Zustand)

Ce dossier contient les stores Zustand pour la gestion d'état globale.

## Installation

Zustand est déjà installé dans le projet.

## Structure

- `authStore.ts` - Store d'authentification avec Supabase
- `index.ts` - Export centralisé des stores

## Auth Store

Le store d'authentification (`useAuthStore`) gère :

- **État** : `user`, `session`, `isLoading`, `error`
- **Actions** : `login`, `logout`, `register`, `checkSession`, `clearError`
- **Persistance** : Les données sont sauvegardées dans AsyncStorage
- **Synchronisation** : Écoute les changements d'état Supabase en temps réel

### Utilisation

```typescript
import { useAuthStore } from '@store';

// Dans un composant
const { user, isLoading, login, logout } = useAuthStore();

// Connexion
await login('user@example.com', 'password');

// Déconnexion
await logout();

// Vérifier la session au démarrage
useEffect(() => {
  checkSession();
}, []);
```

### Fonctionnalités

- **Persistance** : La session est sauvegardée automatiquement
- **Auto-refresh** : Les tokens sont rafraîchis automatiquement par Supabase
- **Gestion d'erreurs** : Les erreurs sont stockées dans `error`
- **Loading state** : `isLoading` indique les opérations en cours

### Exemple complet

```typescript
import { useAuthStore } from '@store';
import { useEffect } from 'react';

const MyComponent = () => {
  const { user, isLoading, error, login, checkSession } = useAuthStore();

  useEffect(() => {
    checkSession();
  }, [checkSession]);

  const handleLogin = async () => {
    try {
      await login('user@example.com', 'password');
      // Navigation automatique après connexion
    } catch (err) {
      console.error('Erreur de connexion:', err);
    }
  };

  if (isLoading) return <Loading />;
  if (error) return <Error message={error} />;
  if (user) return <Welcome user={user} />;

  return <LoginForm onLogin={handleLogin} />;
};
```
