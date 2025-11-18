# ❤️ Système de Favoris

## Description

Le système de favoris permet aux utilisateurs d'ajouter des établissements et événements à leurs favoris avec des mises à jour optimistes pour une UX fluide.

## Fonctionnalités

- ✅ Optimistic updates pour une réactivité immédiate
- ✅ Synchronisation automatique avec le backend
- ✅ Rollback automatique en cas d'erreur
- ✅ Support établissements et événements
- ✅ Boutons favoris réutilisables avec animations

## Hooks disponibles

### `useFavorites(userId?: string)`

Récupère la liste paginée infinie des favoris d'un utilisateur.

```typescript
const { data, isLoading, fetchNextPage, hasNextPage } = useFavorites();
```

### `useIsFavorite(type, id)`

Vérifie si un établissement ou événement est en favoris.

```typescript
const { data: isFavorite } = useIsFavorite('establishment', establishmentId);
```

### `useToggleFavorite()`

Toggle un favori (ajouter ou supprimer) avec optimistic updates.

```typescript
const toggleFavorite = useToggleFavorite();

await toggleFavorite.mutateAsync({
  type: 'establishment',
  id: establishmentId,
  favoriteId: currentFavoriteId,
  isCurrentlyFavorite: isFavorite,
});
```

## Optimistic Updates

Le système utilise des optimistic updates pour une UX fluide :

1. **onMutate** : Met à jour immédiatement l'UI avant la requête API
2. **onSuccess** : Invalide les queries pour synchroniser avec le backend
3. **onError** : Rollback automatique en cas d'erreur

### Exemple de flow

```typescript
// 1. Utilisateur clique sur le bouton favoris
// 2. UI se met à jour immédiatement (optimistic)
// 3. Requête API en arrière-plan
// 4. Si succès : synchronisation avec backend
// 5. Si erreur : rollback automatique
```

## Composants

### `FavoriteButton`

Bouton réutilisable pour ajouter/retirer des favoris.

```typescript
<FavoriteButton
  establishmentId={establishment.id}
  size="small"
  variant="icon"
  onToggle={(isFavorite) => console.log(isFavorite)}
/>
```

**Props:**
- `establishmentId?: string` - ID de l'établissement
- `eventId?: string` - ID de l'événement
- `size?: 'small' | 'medium' | 'large'` - Taille du bouton
- `variant?: 'icon' | 'filled' | 'outline'` - Style du bouton
- `onToggle?: (isFavorite: boolean) => void` - Callback au toggle

## Intégration

### Sur EstablishmentCard

Le bouton favoris est automatiquement ajouté en haut à droite de la carte.

### Sur EstablishmentDetailScreen

Le bouton favoris est intégré dans `ActionButtons` avec les autres actions.

## API Backend

### Endpoints utilisés

- `GET /api/favorites/user/:userId` - Liste des favoris
- `GET /api/favorites/check/:type/:id` - Vérifier si favori
- `POST /api/favorites` - Ajouter un favori
- `DELETE /api/favorites/:id` - Supprimer un favori

## Notes

- Les optimistic updates garantissent une UX fluide
- Le rollback automatique préserve la cohérence des données
- Le favoriteId est automatiquement récupéré depuis la liste des favoris
- Les animations améliorent le feedback visuel

