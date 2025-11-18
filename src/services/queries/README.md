# React Query Hooks

Ce dossier contient les hooks React Query pour les appels API.

## Structure

- `authQueries.ts` - Hooks pour l'authentification
- `userQueries.ts` - Hooks pour les utilisateurs
- `index.ts` - Export centralisé

## Utilisation

### Queries (lecture de données)

```typescript
import { useUserProfile, useUser } from '@services/queries';

// Dans un composant
const { data: profile, isLoading, error } = useUserProfile();
const { data: user } = useUser(userId);
```

### Mutations (modification de données)

```typescript
import { useUpdateUser, useDeleteUser } from '@services/queries';

const updateUser = useUpdateUser();
const deleteUser = useDeleteUser();

// Utilisation
await updateUser.mutateAsync({ id: '123', data: { name: 'Nouveau nom' } });
await deleteUser.mutateAsync('123');
```

## Gestion des erreurs

Les erreurs sont automatiquement gérées par React Query et peuvent être accédées via :

```typescript
const { error } = useUserProfile();
if (error) {
  const apiError = getApiError(error);
  console.error(apiError.message);
}
```

## Retry Logic

- **Queries** : Retry jusqu'à 3 fois avec exponential backoff
- **Mutations** : Retry 1 fois
- Les erreurs 4xx (sauf 401) ne sont pas retry
- Le 401 déclenche automatiquement un refresh de token

## Cache

- **Stale Time** : 5 minutes par défaut
- **Cache Time** : 10 minutes par défaut
- **Refetch** : Automatique au focus de la fenêtre et reconnexion

## Ajouter une nouvelle query

1. Créer un nouveau fichier dans `src/services/queries/`
2. Définir les query keys
3. Créer les hooks avec `useQuery` ou `useMutation`
4. Exporter depuis `index.ts`

### Exemple

```typescript
import { useQuery } from '@tanstack/react-query';
import { apiClient } from '../apiClient';

export const eventKeys = {
  all: ['events'] as const,
  detail: (id: string) => [...eventKeys.all, id] as const,
};

export const useEvent = (id: string) => {
  return useQuery({
    queryKey: eventKeys.detail(id),
    queryFn: async () => {
      const { data } = await apiClient.get(`/events/${id}`);
      return data;
    },
  });
};
```
