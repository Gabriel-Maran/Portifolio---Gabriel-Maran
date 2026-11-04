import { cx } from '../utils/classNames.ts';
import styles from './FaceGlyph.module.css';
import { GLYPH_CELLS, glyphColors, SPIRAL_ORDER } from './glyph.ts';
import type { Face } from './model.ts';

interface FaceGlyphProps {
  face: Face;
  /** Quantas casas, em espiral a partir do centro, já mostram a cor da face (de 0 a 9). */
  solvedCells: number;
  className?: string;
}

// Atraso de cada casa ao resolver, para a cor correr em espiral em vez de trocar de uma vez.
const CELL_DELAY_MS = 45;
const delayOf = (cell: number) =>
  `${SPIRAL_ORDER.findIndex((position) => position === cell) * CELL_DELAY_MS}ms`;

/** Miniatura de uma face do cubo. Decorativa: o progresso é dito em texto em outro lugar. */
export function FaceGlyph({ face, solvedCells, className }: FaceGlyphProps) {
  const cells = Math.max(0, Math.min(GLYPH_CELLS, solvedCells));

  return (
    <span className={cx(styles.glyph, className)} aria-hidden="true">
      {glyphColors(face, cells).map((color, cell) => (
        <span
          key={cell}
          className={styles.cell}
          data-face-color={color}
          style={{ transitionDelay: delayOf(cell) }}
        />
      ))}
    </span>
  );
}
