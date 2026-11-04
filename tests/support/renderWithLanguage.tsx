import { render } from '@testing-library/react';
import type { ReactNode } from 'react';
import { LanguageProvider } from '../../src/i18n/LanguageProvider.tsx';

/** Monta o componente dentro do LanguageProvider, na URL pedida (ex.: "/?lang=en"). */
export function renderWithLanguage(ui: ReactNode, { url = '/' }: { url?: string } = {}) {
  window.history.replaceState(null, '', url);
  return render(<LanguageProvider>{ui}</LanguageProvider>);
}
