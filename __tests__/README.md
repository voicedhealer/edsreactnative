# Tests

Ce dossier contient tous les tests de l'application.

## Structure recommandée

- Miroir la structure de `src/` pour faciliter la navigation
- Utilisez des noms descriptifs avec le suffixe `.test.ts` ou `.test.tsx`
- Exemple: `src/components/Button.tsx` → `__tests__/components/Button.test.tsx`

## Installation

Pour configurer les tests, installez les dépendances nécessaires :

```bash
npm install --save-dev jest @testing-library/react-native @testing-library/jest-native
```

## Configuration Jest

Ajoutez la configuration Jest dans `package.json` :

```json
{
  "jest": {
    "preset": "jest-expo",
    "transformIgnorePatterns": [
      "node_modules/(?!((jest-)?react-native|@react-native(-community)?)|expo(nent)?|@expo(nent)?/.*|@expo-ng/.*|react-clone-referenced-element|@react-navigation/.*|@unimodules/.*|unimodules|sentry-expo|native-base|react-native-svg)"
    ],
    "testMatch": ["**/__tests__/**/*.test.ts", "**/__tests__/**/*.test.tsx"]
  }
}
```

## Exemple

```typescript
import React from 'react';
import { render, screen } from '@testing-library/react-native';
import { MyComponent } from '../src/components/MyComponent';

describe('MyComponent', () => {
  it('renders correctly', () => {
    render(<MyComponent title="Test" />);
    expect(screen.getByText('Test')).toBeTruthy();
  });
});
```
