import { createClient } from '@supabase/supabase-js';
import { keychainStorage } from './keychainStorage';

// Importer les variables d'environnement avec gestion d'erreur
let SUPABASE_URL: string | undefined;
let SUPABASE_ANON_KEY: string | undefined;

try {
  // Essayer d'importer depuis @env (react-native-dotenv)
  const envModule = require('@env');
  // Essayer d'abord sans préfixe, puis avec préfixe NEXT_PUBLIC_
  SUPABASE_URL =
    envModule.SUPABASE_URL ||
    envModule.NEXT_PUBLIC_SUPABASE_URL ||
    envModule.EXPO_PUBLIC_SUPABASE_URL;
  SUPABASE_ANON_KEY =
    envModule.SUPABASE_ANON_KEY ||
    envModule.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
    envModule.EXPO_PUBLIC_SUPABASE_ANON_KEY;
} catch (error) {
  // Si l'import échoue, utiliser process.env comme fallback
  console.warn('Could not load @env module, using process.env fallback');
}

// Vérifier que les variables d'environnement sont définies (accepter plusieurs formats)
const supabaseUrl =
  SUPABASE_URL ||
  process.env.SUPABASE_URL ||
  process.env.EXPO_PUBLIC_SUPABASE_URL ||
  process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey =
  SUPABASE_ANON_KEY ||
  process.env.SUPABASE_ANON_KEY ||
  process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY ||
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  const errorMessage = `
Missing Supabase environment variables. Please check your .env file.

Required variables:
- SUPABASE_URL
- SUPABASE_ANON_KEY

Make sure:
1. You have a .env file in the root directory
2. The variables are defined (copy from env.example if needed)
3. You've restarted the Expo server after creating/modifying .env
4. Clear cache: npx expo start -c
  `.trim();
  throw new Error(errorMessage);
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: keychainStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});
