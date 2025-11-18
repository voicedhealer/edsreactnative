# Hooks

Ce dossier contient les hooks React personnalisés.

## Structure recommandée

- Un fichier par hook
- Utilisez le préfixe `use` pour les noms de hooks
- Exportez les hooks depuis `index.ts` si nécessaire

## Hooks disponibles

### useTokenRefresh

Hook pour gérer le refresh automatique des tokens d'authentification.

```typescript
import { useTokenRefresh } from '@hooks/useTokenRefresh';

// Dans votre composant App
useTokenRefresh(); // Active le refresh automatique
```

**Fonctionnalités :**

- Refresh automatique toutes les 5 minutes
- Refresh quand l'app revient au premier plan
- Vérification au démarrage de l'app

### useEstablishments

Hooks pour gérer les établissements avec pagination infinie.

```typescript
import { useEstablishments, useEstablishment, usePopularEstablishments } from '@hooks';

// Liste paginée infinie
const { data, fetchNextPage, hasNextPage, isFetchingNextPage } = useEstablishments(filters);

// Un établissement
const { data: establishment } = useEstablishment('123');

// Établissements populaires
const { data: popular } = usePopularEstablishments(10);

// Établissements à proximité
const { data, fetchNextPage } = useNearbyEstablishments(latitude, longitude, radius);
```

**Pagination infinie :**

```typescript
const { data, fetchNextPage, hasNextPage, isFetchingNextPage } = useEstablishments();

// Aplatir les pages
const establishments = data?.pages.flatMap(page => page.data) ?? [];

// Charger plus
if (hasNextPage && !isFetchingNextPage) {
  fetchNextPage();
}
```

### useEvents

Hooks pour gérer les événements avec pagination infinie.

```typescript
import { useEvents, useEvent, useUpcomingEvents } from '@hooks';

// Liste paginée infinie
const { data, fetchNextPage, hasNextPage } = useEvents(filters);

// Un événement
const { data: event } = useEvent('123');

// Événements à venir
const { data, fetchNextPage } = useUpcomingEvents();

// Événements d'un établissement
const { data, fetchNextPage } = useEventsByEstablishment('establishment-id');
```

### useSearch

Hooks pour rechercher établissements et événements.

```typescript
import { useSearchEstablishments, useSearchEvents, useSearchAll } from '@hooks';

// Recherche établissements
const { data, fetchNextPage } = useSearchEstablishments({
  query: 'restaurant',
  city: 'Paris',
  category: 'food',
});

// Recherche événements
const { data, fetchNextPage } = useSearchEvents({
  query: 'concert',
  dateFrom: '2024-01-01',
});

// Recherche globale
const { data } = useSearchAll({ query: 'paris' });
```

### useFavorites

Hooks pour gérer les favoris de l'utilisateur.

```typescript
import { useFavorites, useToggleFavorite, useIsFavorite } from '@hooks';

// Liste des favoris avec pagination infinie
const { data, fetchNextPage } = useFavorites();

// Vérifier si favori
const { data: isFavorite } = useIsFavorite('establishment', '123');

// Toggle favori
const toggleFavorite = useToggleFavorite();
await toggleFavorite.mutateAsync({
  type: 'establishment',
  id: '123',
  favoriteId: 'favorite-id', // optionnel
  isCurrentlyFavorite: false,
});
```

## Pagination infinie

Tous les hooks de liste utilisent `useInfiniteQuery` pour la pagination infinie :

```typescript
const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading } = useEstablishments();

// Aplatir les données de toutes les pages
const allItems = data?.pages.flatMap(page => page.data) ?? [];

// Charger la page suivante
const loadMore = () => {
  if (hasNextPage && !isFetchingNextPage) {
    fetchNextPage();
  }
};
```

## Exemple complet

```typescript
import { FlatList } from 'react-native';
import { useEstablishments } from '@hooks';

const EstablishmentsScreen = () => {
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage } = useEstablishments();

  const establishments = data?.pages.flatMap(page => page.data) ?? [];

  return (
    <FlatList
      data={establishments}
      renderItem={({ item }) => <EstablishmentCard establishment={item} />}
      onEndReached={() => {
        if (hasNextPage && !isFetchingNextPage) {
          fetchNextPage();
        }
      }}
      onEndReachedThreshold={0.5}
      ListFooterComponent={isFetchingNextPage ? <LoadingSpinner /> : null}
    />
  );
};
```
