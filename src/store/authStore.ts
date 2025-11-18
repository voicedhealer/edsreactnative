import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { supabase } from '@services/supabase';
import { TokenService } from '@services/tokenService';
import type { User as SupabaseUser, Session } from '@supabase/supabase-js';
import type { User, RegisterData } from '@types';

interface AuthState {
  user: User | null;
  session: Session | null;
  isLoading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  checkSession: () => Promise<void>;
  clearError: () => void;
}

// Fonction helper pour convertir Supabase User en User de l'app
const mapSupabaseUserToUser = (supabaseUser: SupabaseUser): User => {
  return {
    id: supabaseUser.id,
    email: supabaseUser.email || '',
    name: supabaseUser.user_metadata?.name || supabaseUser.email?.split('@')[0] || 'User',
    avatar: supabaseUser.user_metadata?.avatar_url || supabaseUser.user_metadata?.avatar,
    createdAt: supabaseUser.created_at,
    updatedAt: supabaseUser.updated_at,
  };
};

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      session: null,
      isLoading: true,
      error: null,

      login: async (email: string, password: string) => {
        try {
          set({ isLoading: true, error: null });

          const { data, error: authError } = await supabase.auth.signInWithPassword({
            email,
            password,
          });

          if (authError) {
            throw authError;
          }

          if (data.user && data.session) {
            // Sauvegarder les tokens dans Keychain
            await TokenService.saveTokens(data.session);
            const user = mapSupabaseUserToUser(data.user);
            set({
              user,
              session: data.session,
              isLoading: false,
              error: null,
            });
          } else {
            throw new Error('No user or session returned');
          }
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : 'Erreur de connexion';
          set({
            isLoading: false,
            error: errorMessage,
            user: null,
            session: null,
          });
          throw error;
        }
      },

      register: async (data: RegisterData) => {
        try {
          set({ isLoading: true, error: null });

          const { data: authData, error: authError } = await supabase.auth.signUp({
            email: data.email,
            password: data.password,
            options: {
              data: {
                name: data.name,
              },
            },
          });

          if (authError) {
            throw authError;
          }

          if (authData.user && authData.session) {
            // Sauvegarder les tokens dans Keychain
            await TokenService.saveTokens(authData.session);
            const user = mapSupabaseUserToUser(authData.user);
            set({
              user,
              session: authData.session,
              isLoading: false,
              error: null,
            });
          } else {
            // L'utilisateur doit confirmer son email
            set({
              isLoading: false,
              error: null,
            });
            throw new Error('Veuillez vérifier votre email pour confirmer votre compte');
          }
        } catch (error) {
          const errorMessage =
            error instanceof Error ? error.message : "Erreur lors de l'inscription";
          set({
            isLoading: false,
            error: errorMessage,
            user: null,
            session: null,
          });
          throw error;
        }
      },

      logout: async () => {
        try {
          set({ isLoading: true, error: null });

          const { error: signOutError } = await supabase.auth.signOut();

          if (signOutError) {
            throw signOutError;
          }

          // Supprimer les tokens de Keychain
          await TokenService.clearTokens();

          set({
            user: null,
            session: null,
            isLoading: false,
            error: null,
          });
        } catch (error) {
          const errorMessage =
            error instanceof Error ? error.message : 'Erreur lors de la déconnexion';
          set({
            isLoading: false,
            error: errorMessage,
          });
          throw error;
        }
      },

      checkSession: async () => {
        try {
          set({ isLoading: true });

          const {
            data: { session },
            error: sessionError,
          } = await supabase.auth.getSession();

          if (sessionError) {
            throw sessionError;
          }

          if (session?.user) {
            const user = mapSupabaseUserToUser(session.user);
            set({
              user,
              session,
              isLoading: false,
              error: null,
            });
          } else {
            set({
              user: null,
              session: null,
              isLoading: false,
              error: null,
            });
          }
        } catch (error) {
          const errorMessage =
            error instanceof Error ? error.message : 'Erreur lors de la vérification de la session';
          set({
            isLoading: false,
            error: errorMessage,
            user: null,
            session: null,
          });
        }
      },

      clearError: () => {
        set({ error: null });
      },
    }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: state => ({
        user: state.user,
        session: state.session,
      }),
    }
  )
);

// Écouter les changements d'authentification Supabase
supabase.auth.onAuthStateChange(async (event, session) => {
  const store = useAuthStore.getState();

  if (event === 'SIGNED_IN' && session?.user) {
    // Sauvegarder les tokens dans Keychain
    await TokenService.saveTokens(session);
    const user = mapSupabaseUserToUser(session.user);
    store.user = user;
    store.session = session;
  } else if (event === 'SIGNED_OUT') {
    // Supprimer les tokens de Keychain
    await TokenService.clearTokens();
    store.user = null;
    store.session = null;
  } else if (event === 'TOKEN_REFRESHED' && session?.user) {
    // Sauvegarder les nouveaux tokens dans Keychain
    await TokenService.saveTokens(session);
    const user = mapSupabaseUserToUser(session.user);
    store.user = user;
    store.session = session;
  }
});
