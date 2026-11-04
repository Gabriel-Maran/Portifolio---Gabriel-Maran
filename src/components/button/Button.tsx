import type { ReactNode } from 'react';
import { EXTERNAL_LINK_PROPS } from '../../globals/constants.ts';
import { cx } from '../../utils/classNames.ts';
import styles from './Button.module.css';

export type ButtonVariant = 'primary' | 'ghost' | 'text';
export type ButtonSize = 'regular' | 'small';

interface ButtonStyleProps {
  children: ReactNode;
  /** "primary" é a ação principal, em amarelo, uma por bloco. "text" é uma ação discreta, sublinhada. */
  variant?: ButtonVariant;
  size?: ButtonSize;
}

const classFor = ({ variant = 'ghost', size = 'regular' }: Omit<ButtonStyleProps, 'children'>) =>
  cx(styles.button, styles[variant], size === 'small' && styles.small);

export function Button({
  children,
  onClick,
  ...style
}: ButtonStyleProps & { onClick: () => void }) {
  return (
    <button className={classFor(style)} type="button" onClick={onClick}>
      {children}
    </button>
  );
}

/** Tem cara de botão, mas navega. "external" abre em outra aba. */
export function ButtonLink({
  children,
  href,
  external = false,
  ...style
}: ButtonStyleProps & { href: string; external?: boolean }) {
  return (
    <a className={classFor(style)} href={href} {...(external ? EXTERNAL_LINK_PROPS : {})}>
      {children}
    </a>
  );
}
