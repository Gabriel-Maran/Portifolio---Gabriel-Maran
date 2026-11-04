import { cx } from '../../utils/classNames.ts';
import styles from './Arrow.module.css';

const GLYPHS = { right: '→', down: '↓' } as const;

/** Seta decorativa que anda quando o link em volta recebe o mouse. O leitor de tela a ignora. */
export function Arrow({ direction = 'right' }: { direction?: keyof typeof GLYPHS }) {
  return (
    <span className={cx(styles.arrow, styles[direction])} aria-hidden="true">
      {GLYPHS[direction]}
    </span>
  );
}
