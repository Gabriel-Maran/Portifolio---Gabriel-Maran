import {
  DEFAULT_LANGUAGE,
  LANGUAGE_OPTIONS,
  LANGUAGE_QUERY_PARAM,
  LANGUAGES,
  type Language,
} from '../globals/constants.ts';

/**
 * Lê um idioma vindo de fora (atributo lang, URL ou armazenamento).
 * Aceita variações como "EN", "pt-BR" e "en_US"; devolve null para o que o site não oferece.
 */
export function parseLanguage(value: string | null | undefined): Language | null {
  const base = value?.trim().toLowerCase().split(/[-_]/)[0];
  return LANGUAGES.find((language) => language === base) ?? null;
}

/** O idioma pedido pelo caminho da URL, como "/en". Devolve null na raiz e em caminhos sem idioma. */
export function languageFromPath(pathname: string): Language | null {
  // Sem a barra do fim, a raiz vira "" e não casa com nenhum idioma: nela, vale a escolha salva.
  const path = pathname.replace(/\/+$/, '');
  return LANGUAGES.find((language) => LANGUAGE_OPTIONS[language].path === path) ?? null;
}

/** Diz se a query traz o ?lang dos links de antes do /en. */
export const hasLanguageParam = (search: string) =>
  new URLSearchParams(search).has(LANGUAGE_QUERY_PARAM);

interface LanguageSources {
  /** O location.pathname, como "/en". */
  pathname: string;
  /** O location.search, como "?lang=en", dos links antigos. */
  search: string;
  /** O idioma salvo na última visita, se houver. */
  stored: string | null;
}

/**
 * A URL vence, porque um link para /en pede aquele idioma: primeiro o caminho, depois o ?lang dos
 * links antigos. Depois vem a escolha salva e, por fim, o idioma padrão.
 */
export function resolveInitialLanguage({ pathname, search, stored }: LanguageSources): Language {
  const fromPath = languageFromPath(pathname);
  const fromQuery = parseLanguage(new URLSearchParams(search).get(LANGUAGE_QUERY_PARAM));
  return fromPath ?? fromQuery ?? parseLanguage(stored) ?? DEFAULT_LANGUAGE;
}

/**
 * Devolve a URL no endereço do idioma, mantendo os outros parâmetros e a âncora. O ?lang dos links
 * antigos sai, para não contradizer o caminho.
 */
export function withLanguagePath(href: string, language: Language): string {
  const url = new URL(href);
  url.pathname = LANGUAGE_OPTIONS[language].path;
  url.searchParams.delete(LANGUAGE_QUERY_PARAM);
  return url.toString();
}
