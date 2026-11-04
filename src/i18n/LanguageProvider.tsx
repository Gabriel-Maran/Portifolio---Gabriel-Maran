import { useCallback, useEffect, useMemo, useState, type ReactNode } from 'react';
import { LANGUAGE_STORAGE_KEY, type Language } from '../globals/constants.ts';
import { messages } from '../globals/messages/index.ts';
import { resolveInitialLanguage, withLanguageParam } from '../utils/language.ts';
import { getLocalStorage, readStorage, writeStorage } from '../utils/storage.ts';
import { applyDocumentLanguage } from './documentLanguage.ts';
import { LanguageContext, type LanguageContextValue } from './LanguageContext.ts';

function readInitialLanguage(): Language {
  return resolveInitialLanguage({
    search: window.location.search,
    stored: readStorage(getLocalStorage(), LANGUAGE_STORAGE_KEY),
  });
}

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState(readInitialLanguage);

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
