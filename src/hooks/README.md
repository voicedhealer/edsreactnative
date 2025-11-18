# Hooks

Ce dossier contient les hooks React personnalisés.

## Structure recommandée

- Un fichier par hook
- Utilisez le préfixe `use` pour les noms de hooks
- Exportez les hooks depuis `index.ts` si nécessaire

## Exemple

```typescript
import { useState, useEffect } from 'react';

export const useDebounce = <T>(value: T, delay: number): T => {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
};
```
