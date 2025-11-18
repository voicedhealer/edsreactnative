# Services

Ce dossier contient les services et appels API.

## Structure recommandée

- Un fichier par service (ex: `supabase.ts`, `api.ts`, `auth.ts`, `storage.ts`)
- Utilisez des fonctions async/await
- Gérez les erreurs de manière appropriée
- Exportez les services depuis `index.ts` pour faciliter les imports

## Supabase Client

Le client Supabase est configuré dans `supabase.ts` avec :

- **Authentification persistante** : Les sessions sont sauvegardées dans AsyncStorage
- **Auto-refresh des tokens** : Les tokens sont automatiquement rafraîchis
- **Détection de session** : La session est automatiquement restaurée au démarrage

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
