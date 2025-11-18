# 👤 Écrans Profil Utilisateur

## Description

Les écrans de profil permettent aux utilisateurs de gérer leur compte, consulter leurs favoris, voir leurs badges de gamification et configurer leurs paramètres.

## Écrans

### ProfileScreen.tsx

Écran principal du profil utilisateur avec :
- ✅ Informations utilisateur (nom, email, avatar)
- ✅ Affichage des karma points
- ✅ Liste des badges de gamification avec gradients
- ✅ Statistiques (engagements, badges, karma)
- ✅ Actions rapides (Favoris, Paramètres, Modifier profil)
- ✅ Bouton de déconnexion

### FavoritesScreen.tsx

Écran de gestion des favoris avec :
- ✅ Liste paginée infinie des favoris (établissements et événements)
- ✅ Suppression de favoris
- ✅ Navigation vers les détails d'établissement/événement
- ✅ Pull-to-refresh
- ✅ État vide avec message encourageant

### SettingsScreen.tsx

Écran de paramètres avec :
- ✅ Paramètres de notifications
- ✅ Paramètres de géolocalisation
- ✅ Paramètres d'apparence (mode sombre - bientôt disponible)
- ✅ Informations du compte
- ✅ Liens vers les informations légales
- ✅ Support et contact

## Structure

```
src/app/profile/
├── ProfileScreen.tsx      # Écran principal du profil
├── FavoritesScreen.tsx    # Écran des favoris
├── SettingsScreen.tsx     # Écran des paramètres
├── index.ts               # Exports
└── README.md              # Documentation
```

## Hooks utilisés

- `useAuthStore` : Gestion de l'authentification et de l'utilisateur
- `useGamification` : Récupération des badges et karma points
- `useFavorites` : Gestion des favoris
- `useRemoveFavorite` : Suppression d'un favori

## API utilisée

- `GET /api/user/gamification` : Récupération des badges et karma
- `GET /api/favorites/user/:userId` : Liste des favoris
- `DELETE /api/favorites/:id` : Suppression d'un favori

## Design System

### Badges de gamification

Les badges utilisent des gradients selon leur type :
- **🔍 Curieux** : Gradient orange (`#fb923c` → `#f97316`)
- **🗺️ Explorateur** : Gradient pink (`#f472b6` → `#ec4899`)
- **👑 Ambassadeur** : Gradient orange→pink (`#ff751f` → `#ff1fa9`)
- **🎆 Feu d'artifice** : Gradient triple (`#ff751f` → `#ff1fa9` → `#ff3a3a`)

### Header ProfileScreen

Le header utilise le gradient Hero (`#ff751f` → `#ff1fa9` → `#ff3a3a`) avec :
- Avatar utilisateur (ou initiale si pas d'avatar)
- Nom et email
- Karma points dans un badge semi-transparent

### Statistiques

Les statistiques sont affichées dans une carte avec 3 colonnes :
- Engagements totaux
- Nombre de badges
- Karma points

## Navigation

- **ProfileScreen** : Accessible via l'onglet "Profil" dans les tabs principales
- **FavoritesScreen** : Accessible via l'onglet "Favoris" ou depuis ProfileScreen
- **SettingsScreen** : Accessible depuis ProfileScreen

## Notes

- Les badges sont récupérés depuis l'API `/api/user/gamification`
- La déconnexion demande une confirmation avant de procéder
- Les favoris supportent la pagination infinie avec pull-to-refresh
- Le mode sombre est prévu mais pas encore implémenté

