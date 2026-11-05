import type { ReactNode } from 'react';
import { EXTERNAL_LINK_PROPS } from '../../globals/constants.ts';
import { cx } from '../../utils/classNames.ts';
import styles from './Card.module.css';

interface CardProps {
  children: ReactNode;
  className?: string;
}

export function Card({ children, className }: CardProps) {
  return <article className={cx(styles.card, className)}>{children}</article>;
}

/** O card inteiro é o link, para um alvo de clique grande. Abre em outra aba. */
export function LinkCard({ href, children, className }: CardProps & { href: string }) {
  return (
    <a className={cx(styles.card, styles.link, className)} href={href} {...EXTERNAL_LINK_PROPS}>
      {children}
    </a>
  );
}

interface CardTitleProps {
  children: ReactNode;
  /** "h4" quando o card fica dentro de um bloco que já tem título h3. */
  as?: 'h3' | 'h4';
}

export function CardTitle({ children, as: Heading = 'h3' }: CardTitleProps) {
  return <Heading className={styles.title}>{children}</Heading>;
}

export function CardText({ children }: { children: ReactNode }) {
  return <p className={styles.text}>{children}</p>;
}
