import { ErrorBoundary } from '../errors/ErrorBoundary.tsx';
import { LanguageProvider } from '../i18n/LanguageProvider.tsx';
import { HomePage } from '../pages/home/HomePage.tsx';

// O ErrorBoundary fica por fora, para também pegar falhas do provider de idioma.
export function App() {
  return (
    <ErrorBoundary>
      <LanguageProvider>
        <HomePage />
      </LanguageProvider>
    </ErrorBoundary>
  );
}
