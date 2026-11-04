import { LANGUAGES, type Language } from '../globals/constants.ts';

/**
 * Lê um idioma vindo de fora (atributo lang, URL ou armazenamento).
 * Aceita variações como "EN", "pt-BR" e "en_US"; devolve null para o que o site não oferece.
 */
export function parseLanguage(value: string | null | undefined): Language | null {
  const base = value?.trim().toLowerCase().split(/[-_]/)[0];
  return LANGUAGES.find((language) => language === base) ?? null;
}
