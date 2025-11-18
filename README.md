# Envie2Sortir Mobile

Projet React Native avec Expo et TypeScript pour l'application mobile Envie2Sortir.

## 🚀 Démarrage rapide

### Prérequis

- Node.js (version 18 ou supérieure)
- npm ou yarn
- Expo CLI (installé globalement ou via npx)

### Installation

```bash
npm install
```

### Configuration de l'environnement

1. Copiez le fichier `env.example` vers `.env` :

```bash
cp env.example .env
```

2. Modifiez les variables d'environnement dans `.env` selon vos besoins.

### Lancer l'application

```bash
# Démarrer le serveur de développement
npm start

# Lancer sur iOS
npm run ios

# Lancer sur Android
npm run android

# Lancer sur le web
npm run web
```

## 📁 Structure du projet

```
envie2sortir-mobile/
├── src/
│   ├── app/              # Navigation screens
│   ├── components/       # Composants réutilisables
│   ├── services/         # API clients, services
│   ├── store/            # Zustand stores
│   ├── hooks/            # Custom hooks
│   ├── utils/            # Utilitaires
│   ├── types/            # Types TypeScript
│   ├── constants/        # Constantes (colors, API endpoints)
│   └── navigation/       # Configuration navigation
├── assets/               # Images, fonts, etc.
├── __tests__/            # Tests
├── app.json              # Config Expo
├── tsconfig.json
└── package.json
```

## 🔧 Configuration TypeScript

Le projet utilise **TypeScript en mode strict** avec des vérifications complètes :

- ✅ `strict: true` - Active toutes les vérifications strictes
- ✅ `noUnusedLocals` - Détecte les variables locales non utilisées
- ✅ `noUnusedParameters` - Détecte les paramètres non utilisés
- ✅ `noImplicitReturns` - Exige un return explicite dans toutes les fonctions
- ✅ `noUncheckedIndexedAccess` - Accès sécurisé aux tableaux/objets
- ✅ Et bien d'autres vérifications de sécurité

### Alias de chemins

Des chemins d'alias sont configurés pour faciliter les imports :

- `@/*` → `src/*`
- `@components/*` → `src/components/*`
- `@app/*` → `src/app/*`
- `@navigation/*` → `src/navigation/*`
- `@utils/*` → `src/utils/*`
- `@types/*` → `src/types/*`
- `@hooks/*` → `src/hooks/*`
- `@services/*` → `src/services/*`
- `@store/*` → `src/store/*`
- `@constants/*` → `src/constants/*`
- `@assets/*` → `assets/*`

### Exemple d'utilisation

```typescript
import { User } from '@types';
import { formatDate } from '@utils';
import { COLORS, API_ENDPOINTS } from '@constants';
import { MyComponent } from '@components/MyComponent';
import { useAuthStore } from '@store/useAuthStore';
```

## 🎨 Palette de couleurs

Les couleurs principales de l'application sont définies dans `src/constants/colors.ts` :

- **Primary**: `#ff751f` (Orange)
- **Secondary**: `#ff1fa9` (Rose/Magenta)
- **Accent**: `#ff3a3a` (Rouge)

## 📝 Scripts disponibles

### Développement

- `npm start` - Démarre le serveur de développement Expo
- `npm run android` - Lance l'application sur Android
- `npm run ios` - Lance l'application sur iOS
- `npm run web` - Lance l'application sur le web

### Qualité de code

- `npm run lint` - Vérifie le code avec ESLint
- `npm run lint:fix` - Corrige automatiquement les erreurs ESLint
- `npm run format` - Formate le code avec Prettier
- `npm run format:check` - Vérifie le formatage sans modifier les fichiers
- `npm run type-check` - Vérifie les types TypeScript

## 🛠️ Technologies utilisées

- **React Native** - Framework mobile
- **Expo** - Outils et services pour React Native
- **TypeScript** - Typage statique pour JavaScript (mode strict)
- **React** - Bibliothèque UI
- **ESLint** - Linter pour la qualité du code
- **Prettier** - Formateur de code
- **Zustand** - Gestion d'état (à installer: `npm install zustand`)

## 🎯 Qualité de code

Le projet est configuré avec :

### ESLint

- Règles TypeScript strictes
- Règles React et React Hooks
- Règles spécifiques React Native
- Intégration avec Prettier pour éviter les conflits

### Prettier

- Formatage automatique du code
- Configuration cohérente pour tout le projet
- Formatage à la sauvegarde (si configuré dans votre IDE)

### TypeScript Strict Mode

- Vérifications de type complètes
- Détection des erreurs à la compilation
- Meilleure autocomplétion et refactoring

### Configuration VS Code

Le projet inclut une configuration VS Code (`.vscode/settings.json`) pour :

- Formatage automatique à la sauvegarde
- Correction automatique ESLint
- Utilisation de TypeScript du workspace

## 📚 Documentation

Consultez les fichiers README dans chaque dossier pour plus d'informations sur la structure et les conventions du projet :

- `src/app/README.md` - Écrans de navigation
- `src/components/README.md` - Composants réutilisables
- `src/store/README.md` - Stores Zustand
- `src/services/README.md` - Services et API
- `src/hooks/README.md` - Hooks personnalisés
- `__tests__/README.md` - Tests

## 📄 Licence

Ce projet est privé.
