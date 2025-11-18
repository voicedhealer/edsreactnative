# Services

Ce dossier contient les services et appels API.

## Structure recommandée

- Un fichier par service (ex: `api.ts`, `auth.ts`, `storage.ts`)
- Utilisez des fonctions async/await
- Gérez les erreurs de manière appropriée

## Exemple

```typescript
import { User } from '@types';

const API_BASE_URL = 'https://api.example.com';

export const fetchUser = async (id: string): Promise<User> => {
  const response = await fetch(`${API_BASE_URL}/users/${id}`);
  if (!response.ok) {
    throw new Error('Failed to fetch user');
  }
  return response.json();
};
```
