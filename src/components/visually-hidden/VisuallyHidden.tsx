import type { ReactNode } from 'react';
import styles from './VisuallyHidden.module.css';

interface VisuallyHiddenProps {
  children: ReactNode;
  /** "legend" dá nome a um fieldset sem mostrar o texto. */
  as?: 'span' | 'legend';
}

/** Texto que o leitor de tela lê, mas que não aparece na tela. */
export function VisuallyHidden({ children, as: Element = 'span' }: VisuallyHiddenProps) {
  return <Element className={styles.hidden}>{children}</Element>;
}
