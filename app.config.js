require('dotenv').config();

module.exports = {
  expo: {
    name: 'edsreactnative',
    slug: 'edsreactnative',
    version: '1.0.0',
    orientation: 'portrait',
    icon: './assets/icon.png',
    userInterfaceStyle: 'light',
    newArchEnabled: true,
    scheme: 'envie2sortir',
    splash: {
      image: './assets/splash-icon.png',
      resizeMode: 'contain',
      backgroundColor: '#ffffff',
    },
    ios: {
      supportsTablet: true,
      bundleIdentifier: 'com.envie2sortir.app',
      infoPlist: {
        NSLocationWhenInUseUsageDescription:
          'Cette application a besoin de votre localisation pour trouver les établissements à proximité.',
        NSLocationAlwaysAndWhenInUseUsageDescription:
          'Cette application a besoin de votre localisation pour trouver les établissements à proximité.',
      },
      plugins: [
        [
          'expo-notifications',
          {
            icon: './assets/icon.png',
            color: '#ff751f',
            sounds: [],
          },
        ],
      ],
    },
    android: {
      adaptiveIcon: {
        foregroundImage: './assets/adaptive-icon.png',
        backgroundColor: '#ffffff',
      },
      edgeToEdgeEnabled: true,
      predictiveBackGestureEnabled: false,
      package: 'com.envie2sortir.app',
      permissions: [
        'ACCESS_FINE_LOCATION',
        'ACCESS_COARSE_LOCATION',
        'RECEIVE_BOOT_COMPLETED',
        'VIBRATE',
      ],
      intentFilters: [
        {
          action: 'VIEW',
          autoVerify: true,
          data: [
            {
              scheme: 'https',
              host: '*.envie2sortir.com',
              pathPrefix: '/',
            },
            {
              scheme: 'envie2sortir',
            },
          ],
          category: ['BROWSABLE', 'DEFAULT'],
        },
      ],
    },
    web: {
      favicon: './assets/favicon.png',
    },
    plugins: [
      'expo-secure-store',
      [
        'expo-notifications',
        {
          icon: './assets/icon.png',
          color: '#ff751f',
          sounds: [],
        },
      ],
    ],
    notification: {
      icon: './assets/icon.png',
      color: '#ff751f',
      iosDisplayInForeground: true,
      androidMode: 'default',
      androidCollapsedTitle: '#{unread_notifications} nouvelles notifications',
    },
    extra: {
      // Exposer les variables d'environnement via expo-constants
      supabaseUrl:
        process.env.SUPABASE_URL ||
        process.env.EXPO_PUBLIC_SUPABASE_URL ||
        process.env.NEXT_PUBLIC_SUPABASE_URL,
      supabaseAnonKey:
        process.env.SUPABASE_ANON_KEY ||
        process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY ||
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
      apiBaseUrl: process.env.EXPO_PUBLIC_API_BASE_URL || 'https://envie2sortir.railway.app/api',
    },
  },
};

