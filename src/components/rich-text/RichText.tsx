import { EXTERNAL_URLS } from '../../globals/constants.ts';
import { hasKey } from '../../utils/object.ts';
import { parseRichText, type RichTextToken } from '../../utils/richText.ts';
import styles from './RichText.module.css';

interface RichTextProps {
  text: string;
}

function renderToken(token: RichTextToken, key: number) {
  switch (token.type) {
    case 'strong':
      return <strong key={key}>{token.text}</strong>;
    case 'emphasis':
      return <em key={key}>{token.text}</em>;
    case 'code':
      return (
        <code key={key} className={styles.code}>
          {token.text}
        </code>
      );
    case 'link':
      // Chave desconhecida vira texto comum. O teste das mensagens barra esse caso antes do deploy.
      return hasKey(EXTERNAL_URLS, token.target) ? (
        <a
          key={key}
          className={styles.link}
          href={EXTERNAL_URLS[token.target]}
          target="_blank"
          rel="noopener noreferrer"
        >
          {token.text}
        </a>
      ) : (
        token.text
      );
    case 'text':
      return token.text;
  }
}

/** Mostra um texto das mensagens com os destaques da marcação, sem innerHTML. */
export function RichText({ text }: RichTextProps) {
  return <>{parseRichText(text).map(renderToken)}</>;
}
