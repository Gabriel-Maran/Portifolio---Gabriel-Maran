import { render } from '@testing-library/react';
import type { ReactNode } from 'react';
import { CubeProvider } from '../../src/cube/CubeProvider.tsx';
import { useCubeState } from '../../src/cube/useCubeState.ts';
import { LanguageProvider } from '../../src/i18n/LanguageProvider.tsx';
import { FACE_BY_SECTION, HOME_SOLUTION } from '../../src/pages/home/sections.ts';

function PageCube({ children }: { children: ReactNode }) {
  const state = useCubeState(HOME_SOLUTION);
  return (
    <CubeProvider state={state} faceBySection={FACE_BY_SECTION}>
      {children}
    </CubeProvider>
  );
}

/** Monta o componente com os providers da página (idioma e cubo), na URL pedida. */
export function renderWithProviders(ui: ReactNode, { url = '/' }: { url?: string } = {}) {
  window.history.replaceState(null, '', url);
  return render(
    <LanguageProvider>
      <PageCube>{ui}</PageCube>
    </LanguageProvider>,
  );
}
