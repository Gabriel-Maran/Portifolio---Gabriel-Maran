import type { SectionKey } from '../globals/constants.ts';
import { FaceGlyph } from './FaceGlyph.tsx';
import { GLYPH_CELLS } from './glyph.ts';
import { useCube } from './useCube.ts';

/** Miniatura do título da seção: embaralhada até a pessoa visitar a seção. */
export function SectionGlyph({ section }: { section: SectionKey }) {
  const { faceBySection, visited } = useCube();
  const face = faceBySection[section];
  if (!face) return null;

  return <FaceGlyph face={face} solvedCells={visited.has(face) ? GLYPH_CELLS : 0} />;
}
