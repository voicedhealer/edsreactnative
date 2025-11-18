# Navigation

Ce dossier contient la configuration de navigation de l'application avec React Navigation.

## Structure

- `types.ts` - Types TypeScript pour toutes les routes de navigation
- `index.tsx` - Navigateur racine avec logique d'authentification
- `AppNavigator.tsx` - Navigation principale (après authentification)
- `AuthNavigator.tsx` - Navigation d'authentification
- `linking.ts` - Configuration du deep linking

## Types de navigation

Les types sont définis dans `types.ts` et incluent :

- `AuthStackParamList` - Routes d'authentification (Login, Register, ForgotPassword)
- `MainTabParamList` - Routes des tabs principales (Home, Search, Favorites, Profile)
- `AppStackParamList` - Routes de l'application principale
- `RootStackParamList` - Type racine combinant auth et app

## Utilisation

### Navigation typée

```typescript
import { useNavigation } from '@react-navigation/native';
import { AppStackParamList } from '@navigation/types';

const navigation = useNavigation<NavigationProp<AppStackParamList>>();

// Navigation typée
navigation.navigate('EventDetails', { eventId: '123' });
```

### Deep Linking

Le deep linking est configuré dans `linking.ts` et `app.json`. Les URLs suivantes sont supportées :

- `envie2sortir://home` - Accueil
- `envie2sortir://event/123` - Détails d'un événement
- `envie2sortir://create-event` - Créer un événement
- `https://envie2sortir.com/event/123` - Deep link web

### Navigation conditionnelle

Le `RootNavigator` vérifie l'état d'authentification et affiche soit :

- `AuthNavigator` si l'utilisateur n'est pas connecté
- `AppNavigator` si l'utilisateur est connecté

Pour activer la navigation conditionnelle, modifiez `index.tsx` :

```typescript
import { useAuthStore } from '@store/useAuthStore';

const { isAuthenticated } = useAuthStore();
```

## Configuration

### Bottom Tabs

Les tabs principales sont configurées dans `AppNavigator.tsx` avec :

- Home
- Search
- Favorites
- Profile

### Stack Navigation

Les écrans modaux et de détails utilisent une stack navigation :

- EventDetails
- CreateEvent
- EditProfile
- Settings

## Ajouter un nouvel écran

1. Ajoutez le type dans `types.ts` :

```typescript
export type AppStackParamList = {
  // ... autres routes
  NewScreen: { param1: string };
};
```

2. Créez l'écran dans `src/app/`

3. Ajoutez la route dans `AppNavigator.tsx` :

```typescript
<Stack.Screen
  name="NewScreen"
  component={NewScreen}
  options={{ title: 'Nouvel écran' }}
/>
```

4. Ajoutez le deep linking dans `linking.ts` si nécessaire
