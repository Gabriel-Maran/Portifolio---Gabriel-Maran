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

// Posição da casa na espiral. O CSS usa para atrasar cada casa, e a cor corre em espiral.
const spiralOrderOf = (cell: number) => SPIRAL_ORDER.findIndex((position) => position === cell);

/**
 * Miniatura de uma face do cubo. Decorativa: o progresso é dito em texto em outro lugar.
 * Sem `style` inline: a página vem pronta no HTML, e a CSP bloqueia atributo de estilo.
 */
export function FaceGlyph({ face, solvedCells, className }: FaceGlyphProps) {
  const cells = Math.max(0, Math.min(GLYPH_CELLS, solvedCells));

  return (
    <span className={cx(styles.glyph, className)} aria-hidden="true">
      {glyphColors(face, cells).map((color, cell) => (
        <span
          key={cell}
          className={styles.cell}
          data-face-color={color}
          data-order={spiralOrderOf(cell)}
        />
      ))}
    </span>
  );
}
