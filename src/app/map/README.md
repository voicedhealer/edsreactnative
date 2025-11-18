# 📍 Écran Carte Interactive (MapScreen)

## Description

L'écran de carte interactive permet aux utilisateurs de visualiser les établissements sur une carte avec clustering pour optimiser les performances. Il inclut la géolocalisation, des marqueurs personnalisés et un bottom sheet pour afficher les détails des établissements.

## Fonctionnalités

- ✅ Carte interactive avec `react-native-maps`
- ✅ Clustering automatique des marqueurs avec `react-native-map-clustering`
- ✅ Géolocalisation avec `expo-location`
- ✅ Marqueurs personnalisés avec couleurs de la marque
- ✅ Badges premium et tendance sur les marqueurs
- ✅ Bottom sheet pour aperçu des établissements
- ✅ Bouton pour centrer la carte sur la position de l'utilisateur
- ✅ Gestion des permissions de géolocalisation

## Structure

```
src/app/map/
├── MapScreen.tsx      # Écran principal de la carte
├── index.ts          # Export
└── README.md         # Documentation

src/components/map/
├── BottomSheet.tsx   # Composant bottom sheet pour aperçu établissement
└── index.ts         # Export
```

## Utilisation

### Navigation

```typescript
navigation.navigate('Map');
```

### Composants utilisés

- `MapScreen` : Écran principal de la carte
- `EstablishmentBottomSheet` : Bottom sheet pour afficher les détails d'un établissement

## Configuration

### Permissions

L'application demande automatiquement les permissions de géolocalisation au démarrage. Si l'utilisateur refuse, la carte s'affiche centrée sur Paris par défaut.

### Régions par défaut

- **France** : `latitude: 46.6034, longitude: 1.8883` (delta: 5.0)
- **Paris** : `latitude: 48.8566, longitude: 2.3522` (delta: 0.1)

### Clustering

- **Rayon** : 50 pixels
- **Zoom min** : 10
- **Zoom max** : 18
- **Extent** : 512
- **Node size** : 64

## Design System

Les marqueurs et clusters utilisent les couleurs de la marque :
- **Marqueur normal** : Bordure orange (`#ff751f`)
- **Marqueur premium** : Gradient orange→pink (`#ff751f` → `#ff1fa9`)
- **Marqueur tendance** : Bordure rouge (`#ff3a3a`)
- **Cluster** : Gradient orange→pink avec texte blanc

## API utilisée

- `useNearbyEstablishments` : Hook pour récupérer les établissements à proximité
- Endpoint : `/api/establishments/nearby`

## Notes

- Le clustering améliore les performances avec de nombreux marqueurs
- Les marqueurs sont filtrés pour n'afficher que ceux avec des coordonnées valides
- Le bottom sheet s'ouvre automatiquement lorsqu'un marqueur est sélectionné

