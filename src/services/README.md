# Services

Ce dossier contient les services et appels API.

## Structure recommandée

- Un fichier par service (ex: `supabase.ts`, `api.ts`, `auth.ts`, `storage.ts`)
- Utilisez des fonctions async/await
- Gérez les erreurs de manière appropriée
- Exportez les services depuis `index.ts` pour faciliter les imports

## Supabase Client

Le client Supabase est configuré dans `supabase.ts` avec :

- **Authentification persistante** : Les sessions sont sauvegardées dans Keychain (stockage sécurisé)
- **Auto-refresh des tokens** : Les tokens sont automatiquement rafraîchis
- **Détection de session** : La session est automatiquement restaurée au démarrage
- **Stockage sécurisé** : Utilise React Native Keychain au lieu d'AsyncStorage pour une meilleure sécurité

### Configuration

Assurez-vous d'avoir configuré vos variables d'environnement dans `.env` :

```env
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your-anon-key-here
```

### Utilisation

```typescript
import { supabase } from '@services/supabase';

// Exemple d'authentification
const { data, error } = await supabase.auth.signInWithPassword({
  email: 'user@example.com',
  password: 'password',
});

// Exemple de requête
const { data, error } = await supabase.from('users').select('*').eq('id', userId);
```

## Token Service

Le service de gestion des tokens (`tokenService.ts`) fournit un stockage sécurisé avec Keychain :

### Fonctionnalités

- **Stockage sécurisé** : Utilise React Native Keychain au lieu d'AsyncStorage
- **Refresh automatique** : Rafraîchit les tokens avant expiration
- **Authentification biométrique** : Option pour protéger les tokens avec biométrie
- **Gestion de session** : Suit l'expiration des tokens

### Utilisation

```typescript
import { TokenService } from '@services/tokenService';

// Sauvegarder les tokens
await TokenService.saveTokens(session);

// Récupérer les tokens
const tokens = await TokenService.getTokens();

// Vérifier si le token est expiré
const isExpired = await TokenService.isTokenExpired();

// Rafraîchir le token
const newSession = await TokenService.refreshAccessToken();

// Supprimer les tokens
await TokenService.clearTokens();

// Vérifier la disponibilité biométrique
const isAvailable = await TokenService.isBiometricAvailable();

// Activer la biométrie
await TokenService.enableBiometricAuth();
```

### Authentification biométrique

```typescript
import { TokenService } from '@services/tokenService';

// Vérifier si disponible
const isAvailable = await TokenService.isBiometricAvailable();
const biometryType = await TokenService.getBiometryType(); // 'FaceID', 'TouchID', etc.

if (isAvailable) {
  // Activer la biométrie pour les tokens
  await TokenService.enableBiometricAuth();
}
```

## Exemple de service API

```typescript
import { User } from '@types';
import { API_ENDPOINTS } from '@constants';

export const fetchUser = async (id: string): Promise<User> => {
  const response = await fetch(API_ENDPOINTS.USERS.BY_ID(id));
  if (!response.ok) {
    throw new Error('Failed to fetch user');
  }
  return response.json();
};
```
