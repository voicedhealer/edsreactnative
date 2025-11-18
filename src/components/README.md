# Components

Ce dossier contient tous les composants réutilisables de l'application.

## Structure recommandée

- Créez un dossier par composant
- Chaque composant devrait avoir son propre fichier TypeScript/TSX
- Utilisez des composants fonctionnels avec TypeScript

## Exemple

```typescript
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface MyComponentProps {
  title: string;
}

export const MyComponent: React.FC<MyComponentProps> = ({ title }) => {
  return (
    <View style={styles.container}>
      <Text>{title}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
});
```
