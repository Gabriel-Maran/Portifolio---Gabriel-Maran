import { ErrorBoundary } from '../errors/ErrorBoundary.tsx';
import type { Language } from '../globals/constants.ts';
import { LanguageProvider } from '../i18n/LanguageProvider.tsx';
import { HomePage } from '../pages/home/HomePage.tsx';

interface AppProps {
  /** Idioma da primeira renderização. Sem ele, vale o da visita (URL e escolha salva). */
  initialLanguage?: Language;
}

// O ErrorBoundary fica por fora, para também pegar falhas do provider de idioma.
export function App({ initialLanguage }: AppProps) {
  return (
    <ErrorBoundary>
      <LanguageProvider initialLanguage={initialLanguage}>
        <HomePage />
      </LanguageProvider>
    </ErrorBoundary>
  );
}
