export const ROOT_ELEMENT_ID = 'root';

export const OWNER_NAME = 'Gabriel Maran';

export const CONTACT_EMAIL = 'gabriel.enzo.libero.maran@gmail.com';
export const CONTACT_MAILTO = `mailto:${CONTACT_EMAIL}`;

// Os textos citam estes links pela chave, como [texto](academicApp), e nunca pela URL.
export const EXTERNAL_URLS = {
  linkedin: 'https://www.linkedin.com/in/gabriel-enzo-libero-maran-b386b824b/',
  github: 'https://github.com/Gabriel-Maran',
  academicApp: 'https://github.com/Gabriel-Maran/Projeto_GeraPerfilRandom_ChatBot-Unipar',
  rinhaVideo: 'https://www.linkedin.com/feed/update/urn:li:activity:7402519894996684800/',
  rinhaCode: 'https://github.com/Gabriel-Maran/rinha-de-ratos-Web',
} as const;

export type ExternalUrlKey = keyof typeof EXTERNAL_URLS;

export const SOCIAL_LINKS = [
  { id: 'linkedin', label: 'LinkedIn', href: EXTERNAL_URLS.linkedin },
  { id: 'github', label: 'GitHub', href: EXTERNAL_URLS.github },
] as const;

export const LANGUAGES = ['pt', 'en'] as const;
export type Language = (typeof LANGUAGES)[number];
export const DEFAULT_LANGUAGE: Language = 'pt';

// O nome de cada idioma fica na própria língua, então não muda com o idioma da página.
export const LANGUAGE_OPTIONS = {
  pt: { short: 'PT', name: 'Português', tag: 'pt-BR' },
  en: { short: 'EN', name: 'English', tag: 'en' },
} as const satisfies Record<Language, { short: string; name: string; tag: string }>;

export const LANGUAGE_QUERY_PARAM = 'lang';
export const LANGUAGE_STORAGE_KEY = 'language';
