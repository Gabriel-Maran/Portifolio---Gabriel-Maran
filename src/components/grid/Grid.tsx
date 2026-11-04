import type { ReactNode } from 'react';
import { cx } from '../../utils/classNames.ts';
import styles from './Grid.module.css';

interface GridProps {
  columns: 2 | 3;
  children: ReactNode;
  className?: string;
}

/** Grade simétrica que vira uma coluna em telas estreitas. */
export function Grid({ columns, children, className }: GridProps) {
  return (
    <div className={cx(styles.grid, columns === 2 ? styles.two : styles.three, className)}>
      {children}
    </div>
  );
}
