export const ROOT_ELEMENT_ID = 'root';

export const OWNER_NAME = 'Gabriel Maran';

export const CONTACT_EMAIL = 'gabriel.enzo.libero.maran@gmail.com';
export const CONTACT_MAILTO = `mailto:${CONTACT_EMAIL}`;

export const SOCIAL_LINKS = [
  {
    id: 'linkedin',
    label: 'LinkedIn',
    href: 'https://www.linkedin.com/in/gabriel-enzo-libero-maran-b386b824b/',
  },
  { id: 'github', label: 'GitHub', href: 'https://github.com/Gabriel-Maran' },
] as const;

export const LANGUAGES = ['pt', 'en'] as const;
export type Language = (typeof LANGUAGES)[number];
export const DEFAULT_LANGUAGE: Language = 'pt';
