# Providers

Ce dossier contient les providers React pour l'application.

## QueryProvider

Provider React Query pour la gestion des requêtes API et du cache.

### Fonctionnalités

- **Retry automatique** : Retry intelligent avec exponential backoff
- **Cache management** : Gestion automatique du cache
- **DevTools** : Outils de développement en mode dev
- **Error handling** : Gestion centralisée des erreurs

### Configuration

- **Retry** : 3 tentatives pour les queries, 1 pour les mutations
- **Stale Time** : 5 minutes
- **Cache Time** : 10 minutes
- **Refetch** : Automatique au focus et reconnexion

### Utilisation

Le provider est déjà intégré dans `App.tsx`. Tous les composants enfants peuvent utiliser les hooks React Query.
