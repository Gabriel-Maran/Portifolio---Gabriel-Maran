import type { ReactNode } from 'react';
import styles from './Experience.module.css';

interface TimelineEntryProps {
  period: string;
  /** Selo ao lado do período, como "Atual". */
  badge?: string;
  children: ReactNode;
}

/** Linha da linha do tempo: período à esquerda e conteúdo à direita. */
export function TimelineEntry({ period, badge, children }: TimelineEntryProps) {
  return (
    <article className={styles.entry}>
      <div className={styles.when}>
        <span>{period}</span>
        {badge ? <span className={styles.badge}>{badge}</span> : null}
      </div>
      <div className={styles.body}>{children}</div>
    </article>
  );
}
