import { useMemo, type ReactNode } from 'react';
import type { SectionKey } from '../globals/constants.ts';
import { CubeContext, type CubeContextValue } from './CubeContext.ts';
import type { Face } from './model.ts';
import type { CubeState } from './useCubeState.ts';

interface CubeProviderProps {
  /** Vem de useCubeState, que fica com quem também precisa chamar visit(), como a página. */
  state: CubeState;
  faceBySection: Readonly<Partial<Record<SectionKey, Face>>>;
  children: ReactNode;
}

/** Entrega o cubo da página para hero, navegação, seções e fechamento. */
export function CubeProvider({ state, faceBySection, children }: CubeProviderProps) {
  const value = useMemo<CubeContextValue>(
    () => ({ ...state, faceBySection }),
    [state, faceBySection],
  );

  return <CubeContext value={value}>{children}</CubeContext>;
}
