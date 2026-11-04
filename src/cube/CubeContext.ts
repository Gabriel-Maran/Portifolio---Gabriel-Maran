import { createContext } from 'react';
import type { SectionKey } from '../globals/constants.ts';
import type { Face } from './model.ts';
import type { CubeState } from './useCubeState.ts';

export interface CubeContextValue extends CubeState {
  /** Face de cada seção, para a miniatura do título saber qual cor mostrar. */
  faceBySection: Readonly<Partial<Record<SectionKey, Face>>>;
}

export const CubeContext = createContext<CubeContextValue | null>(null);
