// Utilitaires et fonctions helper

/**
 * Formate une date au format français
 */
export const formatDate = (date: Date): string => {
  return date.toLocaleDateString('fr-FR');
};

/**
 * Valide un email
 */
export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// Ajoutez vos fonctions utilitaires ici
