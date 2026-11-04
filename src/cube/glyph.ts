import { FACES, type Face } from './model.ts';

export const GLYPH_CELLS = 9;
const CENTER_CELL = 4;

// Ordem em que as casas se resolvem: do centro para fora, em espiral.
export const SPIRAL_ORDER = [4, 0, 1, 2, 5, 8, 7, 6, 3] as const;

/**
 * Cor da casa enquanto a face não está resolvida. O centro já tem a cor da face, como num cubo
 * de verdade; as outras seguem uma mistura fixa, para a miniatura não mudar a cada visita.
 */
export function scrambledColor(cell: number, face: Face): Face {
  if (cell === CENTER_CELL) return face;
  const offset = FACES.indexOf(face);
  return FACES[(cell * 4 + offset * 3 + 1) % FACES.length] ?? face;
}

/** As nove casas da miniatura, com as primeiras `solvedCells` da espiral já na cor da face. */
export function glyphColors(face: Face, solvedCells: number): Face[] {
  return Array.from({ length: GLYPH_CELLS }, (_, cell) => {
    const order = SPIRAL_ORDER.findIndex((position) => position === cell);
    return order < solvedCells ? face : scrambledColor(cell, face);
  });
}
