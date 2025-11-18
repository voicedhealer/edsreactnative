# Store (Zustand)

Ce dossier contient les stores Zustand pour la gestion d'état globale.

## Installation

Pour utiliser Zustand, installez-le d'abord :

```bash
npm install zustand
```

## Structure recommandée

- Un fichier par store (ex: `useAuthStore.ts`, `useUserStore.ts`)
- Utilisez le préfixe `use` pour les noms de stores
- Exportez les stores depuis `index.ts` si nécessaire

## Exemple

```typescript
import { create } from 'zustand';
import { User } from '@types';

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  login: (user: User, token: string) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>(set => ({
  user: null,
  token: null,
  isAuthenticated: false,
  login: (user, token) => set({ user, token, isAuthenticated: true }),
  logout: () => set({ user: null, token: null, isAuthenticated: false }),
}));
```
