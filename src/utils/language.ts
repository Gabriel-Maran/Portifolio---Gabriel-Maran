import {
  DEFAULT_LANGUAGE,
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

interface LanguageSources {
  /** O location.search, como "?lang=en". */
  search: string;
  /** O idioma salvo na última visita, se houver. */
  stored: string | null;
}

/** A URL vence, porque um link com ?lang=en pede aquele idioma. Depois vem a escolha salva. */
export function resolveInitialLanguage({ search, stored }: LanguageSources): Language {
  const fromUrl = parseLanguage(new URLSearchParams(search).get(LANGUAGE_QUERY_PARAM));
  return fromUrl ?? parseLanguage(stored) ?? DEFAULT_LANGUAGE;
}

/** Devolve a URL com o idioma no parâmetro. O idioma padrão não aparece, para a URL ficar limpa. */
export function withLanguageParam(href: string, language: Language): string {
  const url = new URL(href);
  if (language === DEFAULT_LANGUAGE) url.searchParams.delete(LANGUAGE_QUERY_PARAM);
  else url.searchParams.set(LANGUAGE_QUERY_PARAM, language);
  return url.toString();
}
