# 🔔 Service de Notifications Push

## Description

Le service de notifications push permet de gérer les notifications push avec Expo Notifications, incluant l'enregistrement des tokens, la gestion des permissions et les handlers de notifications.

## Fonctionnalités

- ✅ Gestion des permissions iOS/Android
- ✅ Enregistrement du device token auprès du backend
- ✅ Handlers pour les notifications reçues et tapées
- ✅ Support des notifications locales programmées
- ✅ Gestion des badges
- ✅ Canaux Android personnalisés

## Structure

```
src/services/
├── notificationService.ts    # Service principal
└── notifications/
    └── README.md             # Documentation
```

## Utilisation

### Initialisation automatique

Le service s'initialise automatiquement via le hook `useNotifications` dans `App.tsx` :

```typescript
import { useNotifications } from '@hooks/useNotifications';

export default function App() {
  useNotifications(); // Initialise automatiquement les notifications
  // ...
}
```

### Utilisation manuelle

```typescript
import { notificationService } from '@services/notificationService';

// Demander les permissions
const hasPermission = await notificationService.requestPermissions();

// Obtenir le token
const token = await notificationService.getDeviceToken();

// Enregistrer le token auprès du backend
await notificationService.registerDeviceToken(token);

// Programmer une notification locale
await notificationService.scheduleLocalNotification({
  title: 'Nouvel événement',
  body: 'Un nouvel événement est disponible près de chez vous',
  data: {
    type: 'event',
    eventId: '123',
  },
}, {
  seconds: 3600, // Dans 1 heure
});
```

### Gérer les notifications tapées

```typescript
import { notificationService } from '@services/notificationService';
import { useNavigation } from '@react-navigation/native';

const navigation = useNavigation();

// Définir le handler pour les notifications tapées
notificationService.setNotificationTapHandler((data) => {
  switch (data.type) {
    case 'event':
      if (data.eventId) {
        navigation.navigate('EventDetails', { eventId: data.eventId });
      }
      break;
    case 'badge':
      navigation.navigate('Profile');
      break;
    // ...
  }
});
```

## API Backend

### Endpoints

- `POST /api/notifications/register` : Enregistrer un device token
- `POST /api/notifications/unregister` : Désenregistrer un device token
- `POST /api/notifications/update` : Mettre à jour un device token

### Payload d'enregistrement

```typescript
{
  token: string;        // Expo push token
  platform: 'ios' | 'android';
  deviceId: string;    // ID de l'appareil
}
```

## Types de notifications

### Types supportés

- `event` : Notification sur un événement
- `message` : Notification de message
- `badge` : Notification de badge débloqué
- `engagement` : Notification d'engagement
- `general` : Notification générale

### Structure des données

```typescript
interface NotificationData {
  type: 'event' | 'message' | 'badge' | 'engagement' | 'general';
  eventId?: string;
  establishmentId?: string;
  badgeId?: string;
  [key: string]: unknown;
}
```

## Configuration

### iOS

Les permissions sont configurées dans `app.json` :

```json
{
  "ios": {
    "plugins": [
      [
        "expo-notifications",
        {
          "icon": "./assets/icon.png",
          "color": "#ff751f"
        }
      ]
    ]
  }
}
```

### Android

Les permissions et canaux sont configurés dans `app.json` :

```json
{
  "android": {
    "permissions": [
      "RECEIVE_BOOT_COMPLETED",
      "VIBRATE"
    ]
  },
  "plugins": [
    [
      "expo-notifications",
      {
        "icon": "./assets/icon.png",
        "color": "#ff751f"
      }
    ]
  ]
}
```

### Canaux Android

Le service crée automatiquement 3 canaux :
- **default** : Notifications par défaut (importance MAX)
- **events** : Notifications d'événements (importance HIGH)
- **messages** : Notifications de messages (importance HIGH)
- **badges** : Notifications de badges (importance DEFAULT)

## Variables d'environnement

Assurez-vous d'avoir configuré `EXPO_PUBLIC_PROJECT_ID` dans votre `.env` :

```env
EXPO_PUBLIC_PROJECT_ID=your-expo-project-id
```

## Notes

- Le token est automatiquement enregistré lors de la connexion
- Le token est automatiquement désenregistré lors de la déconnexion
- Les notifications sont gérées même quand l'app est en background
- Les badges sont automatiquement mis à jour

