export const ROOT_ELEMENT_ID = 'root';
export const MAIN_CONTENT_ID = 'topo';

// Âncoras das seções. As features linkam umas para as outras por aqui, sem se importarem.
export const SECTION_IDS = {
  whatIDo: 'o-que-faco',
  experience: 'experiencia',
  projects: 'projetos',
  approach: 'como-resolvo',
  stack: 'stack',
  contact: 'contato',
} as const;

export type SectionKey = keyof typeof SECTION_IDS;

export const OWNER_NAME = 'Gabriel Maran';

export const CONTACT_EMAIL = 'gabriel.enzo.libero.maran@gmail.com';
export const CONTACT_MAILTO = `mailto:${CONTACT_EMAIL}`;

// Os textos citam estes links pela chave, como [texto](academicApp), e nunca pela URL.
export const EXTERNAL_URLS = {
  linkedin: 'https://www.linkedin.com/in/gabriel-enzo-libero-maran-b386b824b/',
  github: 'https://github.com/Gabriel-Maran',
  rinhaVideo: 'https://www.linkedin.com/feed/update/urn:li:activity:7402519894996684800/',
  rinhaCode: 'https://github.com/Gabriel-Maran/rinha-de-ratos-Web',
  petShopCode: 'https://github.com/Gabriel-Maran/PetShopManager',
  petShopPost: 'https://www.linkedin.com/feed/update/urn:li:activity:7486355663841943552/',
  miniReactCode: 'https://github.com/Gabriel-Maran/Mini-React',
} as const;

export type ExternalUrlKey = keyof typeof EXTERNAL_URLS;

// Links que um projeto em andamento pode ter, na ordem em que aparecem no card.
export const PROJECT_LINK_KINDS = ['code', 'post'] as const;
export type ProjectLinkKind = (typeof PROJECT_LINK_KINDS)[number];

// Link externo abre em outra aba sem dar à página nova acesso a esta (window.opener) nem a origem.
export const EXTERNAL_LINK_PROPS = { target: '_blank', rel: 'noopener noreferrer' } as const;

export const SOCIAL_LINKS = [
  { id: 'linkedin', label: 'LinkedIn', href: EXTERNAL_URLS.linkedin },
  { id: 'github', label: 'GitHub', href: EXTERNAL_URLS.github },
] as const;

export type SocialLinkId = (typeof SOCIAL_LINKS)[number]['id'];

export const LANGUAGES = ['pt', 'en'] as const;
export type Language = (typeof LANGUAGES)[number];
export const DEFAULT_LANGUAGE: Language = 'pt';

// O nome de cada idioma fica na própria língua, então não muda com o idioma da página.
// `tag` vai no atributo lang e no hreflang; `ogLocale` é o formato do Open Graph.
// `path` é o endereço da página do idioma: o padrão fica na raiz. É pelo caminho, e não pela query,
// porque o cache da Vercel ignora a query e serviria a mesma página para os dois idiomas.
export const LANGUAGE_OPTIONS = {
  pt: { short: 'PT', name: 'Português', tag: 'pt-BR', ogLocale: 'pt_BR', path: '/' },
  en: { short: 'EN', name: 'English', tag: 'en', ogLocale: 'en_US', path: '/en' },
} as const satisfies Record<
  Language,
  { short: string; name: string; tag: string; ogLocale: string; path: string }
>;

// Os links de antes do /en usavam ?lang=en. O navegador ainda lê esse parâmetro, para eles não quebrarem.
export const LANGUAGE_QUERY_PARAM = 'lang';
export const LANGUAGE_STORAGE_KEY = 'language';
