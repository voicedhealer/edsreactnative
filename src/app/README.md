# App (Navigation Screens)

Ce dossier contient tous les écrans de navigation de l'application.

## Structure recommandée

- Un fichier par écran
- Utilisez des noms descriptifs (ex: `HomeScreen.tsx`, `ProfileScreen.tsx`)
- Les écrans peuvent importer des composants depuis `@components/*`
- Utilisez les stores depuis `@store/*` pour l'état global

## Exemple

```typescript
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { MyComponent } from '@components/MyComponent';
import { useAuthStore } from '@store/useAuthStore';
import { COLORS } from '@constants';

export const HomeScreen: React.FC = () => {
  const { user } = useAuthStore();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Bienvenue {user?.name}</Text>
      <MyComponent title="Welcome" />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: COLORS.background,
  },
  title: {
    fontSize: 24,
    color: COLORS.text,
  },
});
```
