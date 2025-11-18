# Services

Ce dossier contient tous les services de l'application.

## LocationService

Service centralisé pour gérer la géolocalisation et les permissions.

### Utilisation

```typescript
import { LocationService } from '@services';

// Obtenir la position actuelle
const location = await LocationService.getCurrentLocation();

// Filtrer des établissements par rayon
const nearby = LocationService.filterByRadius(establishments, location, 5); // 5km

// Calculer la distance entre deux points
const distance = LocationService.calculateDistance(point1, point2); // en km
```

### Hook useLocation

```typescript
import { useLocation } from '@hooks';

const { location, getCurrentLocation, isLoading, error } = useLocation({
  autoTrack: false,
  defaultRadius: 5,
  accuracy: 'balanced',
});
```

### Permissions

Les permissions sont déjà configurées dans `app.json` :
- iOS: `NSLocationWhenInUseUsageDescription`
- Android: `ACCESS_FINE_LOCATION`, `ACCESS_COARSE_LOCATION`

Le service gère automatiquement la demande de permissions avec des messages appropriés.
