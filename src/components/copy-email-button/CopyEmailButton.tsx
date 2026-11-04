import { useEffect, useRef, useState } from 'react';
import { CONTACT_EMAIL } from '../../globals/constants.ts';
import { useMessages } from '../../i18n/useLanguage.ts';
import { copyToClipboard } from '../../utils/clipboard.ts';
import { Button, type ButtonSize } from '../button/Button.tsx';
import { VisuallyHidden } from '../visually-hidden/VisuallyHidden.tsx';
import styles from './CopyEmailButton.module.css';

const COPIED_FEEDBACK_MS = 2500;

type CopyStatus = 'idle' | 'copied' | 'failed';

/**
 * Copia o e-mail. Se o navegador não deixar, troca o botão por um campo com o e-mail já
 * selecionado, para a pessoa copiar na mão. O contato nunca fica sem saída.
 */
export function CopyEmailButton({ size }: { size?: ButtonSize }) {
  const { copyEmail, contact } = useMessages();
  const [status, setStatus] = useState<CopyStatus>('idle');
  const fallbackRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (status === 'failed') fallbackRef.current?.select();
    if (status !== 'copied') return;
    const timer = window.setTimeout(() => setStatus('idle'), COPIED_FEEDBACK_MS);
    return () => window.clearTimeout(timer);
  }, [status]);

  const copy = async () => {
    setStatus((await copyToClipboard(CONTACT_EMAIL)) ? 'copied' : 'failed');
  };

  const announcement = { idle: '', copied: copyEmail.copied, failed: copyEmail.selected }[status];

  return (
    <>
      {status === 'failed' ? (
        <input
          ref={fallbackRef}
          className={styles.fallback}
          type="text"
          value={CONTACT_EMAIL}
          aria-label={contact.emailLabel}
          readOnly
          onFocus={(event) => event.currentTarget.select()}
        />
      ) : (
        <Button size={size} onClick={() => void copy()}>
          {status === 'copied' ? copyEmail.copied : copyEmail.action}
        </Button>
      )}
      {/* Sempre presente, para o leitor de tela anunciar quando o texto muda. */}
      <VisuallyHidden>
        <output>{announcement}</output>
      </VisuallyHidden>
    </>
  );
}
