📊 PLAN CHIFFRÉ & DÉPENDANCES
Estimation temps par phase
Phase	Durée	Dépendances
Phase 1: Setup	3-5 jours	Backend API live, Supabase configuré
Phase 2: Auth	5-7 jours	Phase 1, API auth endpoints fonctionnels
Phase 3: API Client	4-5 jours	Phase 2, Documentation API complète
Phase 4: Écrans principaux	10-12 jours	Phase 3, Maquettes UI validées
Phase 5: Fonctionnalités avancées	8-10 jours	Phase 4, Backend notifications configuré
Phase 6: Dashboard Pro	7-9 jours	Phase 2, API dashboard fonctionnelle
Phase 7: Messagerie	5-6 jours	Phase 2, API messaging fonctionnelle
Phase 8: Tests	6-8 jours	Phase 4-7 complètes
Phase 9: Performance	4-5 jours	Phase 8, App fonctionnelle
Phase 10: CI/CD	5-7 jours	Phase 9, Comptes stores créés
TOTAL	57-74 jours	~2.5-3 mois (1 dev)
Dépendances critiques
Backend API live sur Railway avec endpoints documentés
Supabase configuré avec RLS policies
Variables d'environnement (API_URL, SUPABASE_URL, SUPABASE_KEY)
Maquettes UI validées (Figma/Sketch)
Comptes App Store Connect & Google Play Console
Certificats iOS/Android pour builds
🎨 UX/UI DESIGN - INSPIRATION THEFORK
Composants clés à implémenter
1. Barre de recherche
Double input (ville + activité) avec autocomplete
Bouton géolocalisation "📍 Autour de moi"
Suggestions dynamiques pendant la saisie
2. Filtres avancés (TheFork style)
Barre filtres horizontale scrollable
Filtres: Populaire, Désirés ++, Les - cher, Notre sélection, Nouveaux, Mieux notés
Badges compteurs sur chaque filtre
Animation au changement de filtre
3. Cartes établissements
Image principale avec overlay gradient
Badge "Notre sélection" si premium
Note moyenne + nombre avis
Tags activités (VR, Escape, etc.)
Bouton favoris (coeur)
Distance depuis position actuelle
4. Onboarding
3-4 écrans avec illustrations
Demande permissions (géolocalisation, notifications)
Sélection ville favorite
CTA "Commencer"
5. Détail établissement
Image hero avec parallax scroll
Onglets: Infos, Événements, Avis, Carte
Bouton CTA fixe en bas (Réserver / Contacter)
Partage social
⚠️ POINTS DE VIGILANCE
Performance
Limiter nombre de composants re-rendus avec React.memo
Utiliser FlatList au lieu de ScrollView pour longues listes
Implémenter pagination infinie pour éviter chargement initial trop lourd
Optimiser images (WebP, lazy loading, cache)
Éviter animations sur listes scrollables
Sécurité
Ne jamais stocker tokens en clair (utiliser Keychain)
Valider toutes les données API avec Zod
Implémenter refresh token automatique
Gérer déconnexion automatique sur token expiré
Chiffrer données sensibles en local (MMKV avec encryption)
Compatibilité
Tester sur iOS 15+ et Android 8+ (API level 26+)
Gérer différences iOS/Android (SafeArea, permissions, etc.)
Tester sur différentes tailles d'écran (iPhone SE à iPad, Android petits/grands)
Gérer dark mode (si applicable)
Réseau
Gérer mode offline avec cache React Query
Afficher indicateur de chargement pour toutes requêtes
Implémenter retry automatique sur erreurs réseau
Gérer timeouts API (10s recommandé)
Stores
Respecter guidelines App Store & Play Store
Préparer screenshots pour tous formats requis
Rédiger descriptions optimisées SEO
Gérer reviews et feedback utilisateurs
📚 STACK & LIBS RECOMMANDÉES 2025
Alternatives modernes à considérer
Navigation
Expo Router (file-based routing) - Alternative moderne à React Navigation si vous utilisez Expo managed
State Management
Jotai - Alternative légère à Zustand avec atoms
Valtio - Proxy-based state (très performant)
UI Libraries
Tamagui - UI kit ultra-performant avec compilation native
Gluestack UI - Alternative moderne à NativeBase
Forms
React Hook Form + Zod - Combinaison recommandée
Formik - Alternative (moins recommandée en 2025)
Animations
React Native Reanimated 3 - Standard pour animations performantes
React Native Skia - Pour animations complexes (dessins, graphiques)
Testing
Maestro - Alternative moderne à Detox (plus simple à configurer)
Appium - Pour tests cross-platform avancés
🏆 MEILLEURES PRATIQUES
Architecture
Séparer logique métier (services) de présentation (composants)
Utiliser custom hooks pour logique réutilisable
Centraliser gestion erreurs avec Error Boundary
Utiliser TypeScript strict mode partout
Code Quality
Respecter conventions de nommage (PascalCase composants, camelCase fonctions)
Documenter fonctions complexes avec JSDoc
Limiter taille fichiers (< 300 lignes)
Utiliser ESLint + Prettier automatiquement
Git Workflow
Branches par feature (feature/search-screen)
Commits atomiques avec messages clairs
Pull requests avec review obligatoire
Tags de version pour releases
Performance
Profiler régulièrement avec React DevTools
Monitorer bundle size avec react-native-bundle-visualizer
Utiliser why-did-you-render en dev pour détecter re-renders inutiles
🚀 COMMANDES UTILES
Développement
# Démarrer Metro bundlernpm start# Démarrer sur iOSnpm run ios# Démarrer sur Androidnpm run android# Lancer testsnpm test# Lancer tests avec coveragenpm run test:coverage# Linternpm run lint# Formatternpm run format
Build
# Build iOS developmenteas build --platform ios --profile development# Build Android productioneas build --platform android --profile production# Soumettre à App Storeeas submit --platform ios# Soumettre à Play Storeeas submit --platform android
📝 CHECKLIST FINALE AVANT RELEASE
[ ] Tous les tests passent (unitaires + E2E)
[ ] Coverage > 70%
[ ] Pas d'erreurs ESLint
[ ] Performance validée (60 FPS, temps chargement < 2s)
[ ] Sécurité validée (tokens sécurisés, validation données)
[ ] Compatibilité iOS 15+ et Android 8+ testée
[ ] Dark mode géré (si applicable)
[ ] Mode offline fonctionnel
[ ] Notifications push testées
[ ] Géolocalisation testée avec permissions
[ ] Deep linking fonctionnel
[ ] Analytics intégrés et testés
[ ] Monitoring Sentry configuré
[ ] Screenshots stores préparés
[ ] Descriptions stores rédigées
[ ] Politique confidentialité publiée
[ ] Version number incrémentée
[ ] Changelog mis à jour
Ce prompt structuré couvre les étapes nécessaires pour développer l'application mobile React Native d'envie2sortir.fr. Chaque étape inclut des cursorrules précises pour guider le développement avec Composer.