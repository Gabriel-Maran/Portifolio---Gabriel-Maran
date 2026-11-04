import type { ReactNode } from 'react';
import styles from './SkipLink.module.css';

/** Primeiro link da página. Só aparece com o foco do teclado e pula a navegação. */
export function SkipLink({ href, children }: { href: string; children: ReactNode }) {
  return (
    <a className={styles.skip} href={href}>
      {children}
    </a>
  );
}
