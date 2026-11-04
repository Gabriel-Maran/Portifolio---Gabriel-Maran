import type { ReactNode } from 'react';
import { cx } from '../../utils/classNames.ts';
import styles from './Container.module.css';

interface ContainerProps {
  children: ReactNode;
  className?: string;
}

/** Coluna central da página, com respiro lateral e respeito ao entalhe do celular. */
export function Container({ children, className }: ContainerProps) {
  return <div className={cx(styles.container, className)}>{children}</div>;
}
