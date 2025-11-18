import { createClient } from '@supabase/supabase-js';
import Constants from 'expo-constants';
import { keychainStorage } from './keychainStorage';

// Charger les variables d'environnement depuis expo-constants (méthode recommandée)
const supabaseUrl =
  Constants.expoConfig?.extra?.supabaseUrl ||
  process.env.SUPABASE_URL ||
  process.env.EXPO_PUBLIC_SUPABASE_URL ||
  process.env.NEXT_PUBLIC_SUPABASE_URL;

const supabaseAnonKey =
  Constants.expoConfig?.extra?.supabaseAnonKey ||
  process.env.SUPABASE_ANON_KEY ||
  process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY ||
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// Debug: vérifier les valeurs finales
console.log('[Supabase Config] URL:', supabaseUrl ? `${supabaseUrl.substring(0, 30)}...` : 'NOT SET');
console.log('[Supabase Config] Key:', supabaseAnonKey ? 'SET (hidden)' : 'NOT SET');

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
