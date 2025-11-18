declare module '@env' {
  export const SUPABASE_URL: string;
  export const SUPABASE_ANON_KEY: string;
  // Support pour les variables avec préfixe NEXT_PUBLIC_ ou EXPO_PUBLIC_
  export const NEXT_PUBLIC_SUPABASE_URL: string;
  export const NEXT_PUBLIC_SUPABASE_ANON_KEY: string;
  export const EXPO_PUBLIC_SUPABASE_URL: string;
  export const EXPO_PUBLIC_SUPABASE_ANON_KEY: string;
}
