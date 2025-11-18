import { createClient } from '@supabase/supabase-js';
import { SUPABASE_URL, SUPABASE_ANON_KEY } from '@env';
import { keychainStorage } from './keychainStorage';

// Vérifier que les variables d'environnement sont définies
const supabaseUrl = SUPABASE_URL || process.env.SUPABASE_URL;
const supabaseAnonKey = SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY;

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
