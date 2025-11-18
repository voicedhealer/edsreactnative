# 🎯 Système d'Engagement Événements

## Description

Le système d'engagement permet aux utilisateurs d'exprimer leur intérêt pour les événements avec 4 types d'engagement différents, affichant une jauge visuelle et des badges selon le niveau d'engagement.

## Fonctionnalités

- ✅ 4 types d'engagement : envie, grande-envie, découvrir, pas-envie
- ✅ Scores différenciés : +1, +3, +2, -1
- ✅ Jauge avec gradient multi-couleurs (vert→jaune→orange→rouge→violet)
- ✅ Badges selon le pourcentage (bronze, argent, or, violet)
- ✅ Animation "fire mode" pour 150%+
- ✅ Optimistic updates pour UX fluide
- ✅ Synchronisation avec le backend

## Composants

### EventEngagementButtons

Boutons d'engagement avec compteurs et animations.

```typescript
<EventEngagementButtons
  eventId={event.id}
  isCompact={false}
  onEngagementUpdate={(data) => console.log(data)}
/>
```

**Props:**
- `eventId: string` - ID de l'événement
- `isCompact?: boolean` - Mode compact
- `onEngagementUpdate?: (data: EventEngagement) => void` - Callback au changement

### EventEngagementGauge

Jauge visuelle avec gradient et badges.

```typescript
<EventEngagementGauge
  percentage={engagement.percentage}
  badge={engagement.badge}
  isVertical={false}
/>
```

**Props:**
- `percentage: number` - Pourcentage d'engagement (0-150)
- `badge: EventBadge | null` - Badge de l'événement
- `isVertical?: boolean` - Mode vertical

## Types d'engagement

### Scores

- **envie** : +1 point, +1 karma
- **grande-envie** : +3 points, +3 karma
- **découvrir** : +2 points, +2 karma
- **pas-envie** : -1 point, -1 karma

### Calcul du score

```typescript
score = (envie × 1) + (grande-envie × 3) + (decouvrir × 2) + (pas-envie × -1)
percentage = min((score / 15) × 100, 150)
```

## Badges

### Seuils

- **50-74%** : 👍 Apprécié (Bronze) - `#CD7F32`
- **75-99%** : ⭐ Populaire (Argent) - `#C0C0C0`
- **100-149%** : 🏆 Coup de Cœur (Or) - `#FFD700`
- **150%+** : 🔥 C'EST LE FEU ! (Violet) - `#9C27B0` - Animation spéciale

## Jauge

### Gradient

La jauge utilise un gradient multi-couleurs :
- Vert (`#4CAF50`) → 0%
- Vert clair (`#8BC34A`) → 16.66%
- Jaune (`#FFC107`) → 33.33%
- Orange (`#FF9800`) → 50%
- Rouge (`#F44336`) → 66.66%
- Violet (`#9C27B0`) → 83.33%
- Violet intense (`#6A1B9A`) → 100%

### Animation Fire Mode

Pour les événements à 150%+, la jauge utilise une animation pulsante avec ombre violette.

## Hooks

### `useEventEngagement(eventId)`

Récupère les statistiques d'engagement d'un événement.

```typescript
const { data: engagement, isLoading } = useEventEngagement(eventId);
```

### `useEngageEvent()`

Crée ou met à jour un engagement avec optimistic updates.

```typescript
const engageEvent = useEngageEvent();

await engageEvent.mutateAsync({
  eventId: '123',
  type: 'grande-envie',
});
```

## API Backend

### Endpoints

- `GET /api/events/:eventId/engage` - Récupérer les statistiques d'engagement
- `POST /api/events/:eventId/engage` - Créer ou mettre à jour un engagement

### Payload POST

```typescript
{
  type: 'envie' | 'grande-envie' | 'decouvrir' | 'pas-envie'
}
```

### Réponse

```typescript
{
  eventId: string;
  stats: {
    envie: number;
    'grande-envie': number;
    decouvrir: number;
    'pas-envie': number;
  };
  score: number;
  percentage: number;
  badge: EventBadge | null;
  userEngagement: EngagementType | null;
  totalEngagements: number;
  newBadge?: EventBadge; // Si nouveau badge débloqué
}
```

## Optimistic Updates

Le système utilise des optimistic updates pour une UX fluide :

1. **onMutate** : Met à jour immédiatement les stats et le badge
2. **onSuccess** : Invalide pour synchroniser avec le backend
3. **onError** : Rollback automatique en cas d'erreur

## Design System

- **Couleurs** : Respect des couleurs de la marque (#ff751f, #ff1fa9, #ff3a3a)
- **Gradients** : ButtonGradient pour boutons actifs
- **Border-radius** : 12px pour cartes, 24px pour boutons
- **Animations** : Spring avec tension/friction pour feedback visuel

## Exemple d'utilisation complète

```typescript
import { EventEngagementButtons, EventEngagementGauge } from '@components/events';
import { useEventEngagement } from '@hooks/useEventEngagement';

const EventDetails = ({ eventId }) => {
  const { data: engagement } = useEventEngagement(eventId);

  return (
    <View>
      <EventEngagementGauge
        percentage={engagement?.percentage || 0}
        badge={engagement?.badge || null}
      />
      <EventEngagementButtons
        eventId={eventId}
        onEngagementUpdate={(data) => {
          // Mettre à jour la jauge si nécessaire
        }}
      />
    </View>
  );
};
```

