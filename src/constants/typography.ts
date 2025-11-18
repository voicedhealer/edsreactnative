// Typographie exacte du site web - Inter font
export const Typography = {
  fontFamily: 'Inter',
  fontFamilyFallback: 'Arial, Helvetica, sans-serif',

  // Hiérarchie exacte du site
  h1: {
    fontSize: 48, // text-6xl
    fontWeight: '800' as const, // font-extrabold
    lineHeight: 1.2,
    letterSpacing: -0.025, // tracking-tight
  },
  h2: {
    fontSize: 30, // text-3xl
    fontWeight: '700' as const, // font-bold
    lineHeight: 1.3,
  },
  h3: {
    fontSize: 20, // text-xl
    fontWeight: '600' as const, // font-semibold
    lineHeight: 1.4,
  },
  body: {
    fontSize: 16, // text-base
    fontWeight: '400' as const, // font-normal
    lineHeight: 1.5,
  },
  small: {
    fontSize: 14, // text-sm
    fontWeight: '400' as const,
    lineHeight: 1.4,
  },
  caption: {
    fontSize: 12, // text-xs
    fontWeight: '400' as const,
    lineHeight: 1.3,
  },
};
