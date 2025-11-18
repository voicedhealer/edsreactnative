import { z } from 'zod';

// Schéma de validation pour le login
export const loginSchema = z.object({
  email: z.string().email('Email invalide').min(1, 'Email requis'),
  password: z.string().min(6, 'Le mot de passe doit contenir au moins 6 caractères'),
});

export type LoginFormData = z.infer<typeof loginSchema>;

// Schéma de validation pour l'inscription
export const registerSchema = z
  .object({
    name: z.string().min(2, 'Le nom doit contenir au moins 2 caractères'),
    email: z.string().email('Email invalide').min(1, 'Email requis'),
    password: z.string().min(6, 'Le mot de passe doit contenir au moins 6 caractères'),
    confirmPassword: z.string().min(1, 'Confirmation du mot de passe requise'),
  })
  .refine(data => data.password === data.confirmPassword, {
    message: 'Les mots de passe ne correspondent pas',
    path: ['confirmPassword'],
  });

export type RegisterFormData = z.infer<typeof registerSchema>;

// Schéma de validation pour le mot de passe oublié
export const forgotPasswordSchema = z.object({
  email: z.string().email('Email invalide').min(1, 'Email requis'),
});

export type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>;
