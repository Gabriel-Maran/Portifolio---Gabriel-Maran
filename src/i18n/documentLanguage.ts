import { LANGUAGE_OPTIONS, type Language } from '../globals/constants.ts';
import { messages } from '../globals/messages/index.ts';

// Só o que este módulo usa do document, para os testes passarem um objeto simples no lugar.
export interface DocumentLanguageTarget {
  documentElement: { lang: string };
  title: string;
  querySelector(selectors: string): { setAttribute(name: string, value: string): void } | null;
}

/** Mantém o lang, o título e a descrição da página no idioma escolhido. */
export function applyDocumentLanguage(target: DocumentLanguageTarget, language: Language): void {
  const { meta } = messages[language];
  target.documentElement.lang = LANGUAGE_OPTIONS[language].tag;
  target.title = meta.title;
  target.querySelector('meta[name="description"]')?.setAttribute('content', meta.description);
}
