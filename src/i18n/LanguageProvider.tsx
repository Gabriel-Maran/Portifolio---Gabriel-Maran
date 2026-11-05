import { useCallback, useEffect, useMemo, useState, type ReactNode } from 'react';
import { LANGUAGE_STORAGE_KEY, type Language } from '../globals/constants.ts';
import { messages } from '../globals/messages/index.ts';
import { withLanguageParam } from '../utils/language.ts';
import { getLocalStorage, writeStorage } from '../utils/storage.ts';
import { applyDocumentLanguage } from './documentLanguage.ts';
import { readInitialLanguage } from './initialLanguage.ts';
import { LanguageContext, type LanguageContextValue } from './LanguageContext.ts';

interface LanguageProviderProps {
  /**
   * Idioma da primeira renderização. Sem ele, o provider lê a URL e a escolha salva, o que só
   * existe no navegador; o build, que gera o HTML no Node, passa o idioma direto.
   */
  initialLanguage?: Language;
  children: ReactNode;
}

export function LanguageProvider({ initialLanguage, children }: LanguageProviderProps) {
  const [language, setLanguageState] = useState(() => initialLanguage ?? readInitialLanguage());

  useEffect(() => {
    applyDocumentLanguage(document, language);
  }, [language]);

  const setLanguage = useCallback((next: Language) => {
    setLanguageState(next);
    // Sem armazenamento disponível, o idioma vale só nesta visita.
    writeStorage(getLocalStorage(), LANGUAGE_STORAGE_KEY, next);
    // A URL acompanha o idioma, para um link copiado abrir na mesma versão.
    window.history.replaceState(
      window.history.state,
      '',
      withLanguageParam(window.location.href, next),
    );
  }, []);

  const value = useMemo<LanguageContextValue>(
    () => ({ language, messages: messages[language], setLanguage }),
    [language, setLanguage],
  );

  return <LanguageContext value={value}>{children}</LanguageContext>;
}
