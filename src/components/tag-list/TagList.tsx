import { cx } from '../../utils/classNames.ts';
import styles from './TagList.module.css';

interface TagListProps {
  items: readonly string[];
  className?: string;
}

export function TagList({ items, className }: TagListProps) {
  return (
    <ul className={cx(styles.tags, className)}>
      {items.map((item) => (
        <li key={item} className={styles.tag}>
          {item}
        </li>
      ))}
    </ul>
  );
}
