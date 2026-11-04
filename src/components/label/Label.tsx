import type { ReactNode } from 'react';
import { cx } from '../../utils/classNames.ts';
import styles from './Label.module.css';

interface LabelProps {
  children: ReactNode;
  /** "h3" quando o rótulo abre um bloco, para a hierarquia de títulos não pular nível. */
  as?: 'p' | 'span' | 'h3';
  className?: string;
}

/** Texto pequeno em caixa alta e fonte mono, para categorias e rótulos. */
export function Label({ children, as: Element = 'p', className }: LabelProps) {
  return <Element className={cx(styles.label, className)}>{children}</Element>;
}
