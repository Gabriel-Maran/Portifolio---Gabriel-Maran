import {
  CONTACT_EMAIL,
  CONTACT_MAILTO,
  DEFAULT_LANGUAGE,
  EXTERNAL_LINK_PROPS,
  SOCIAL_LINKS,
} from '../globals/constants.ts';
import { messages } from '../globals/messages/index.ts';
import { parseLanguage } from '../utils/language.ts';
import styles from './ErrorFallback.module.css';

/**
 * Tela exibida quando a página quebra. Não depende de nenhum outro componente nem do contexto
 * de idioma, que podem ser a causa da falha: lê o idioma do atributo lang do documento.
 */
export function ErrorFallback() {
  const language = parseLanguage(document.documentElement.lang) ?? DEFAULT_LANGUAGE;
  const text = messages[language].errors;

  return (
    <main className={styles.fallback}>
      <h1 className={styles.title}>{text.title}</h1>
      <p className={styles.description}>{text.description}</p>
      <button className={styles.reload} type="button" onClick={() => window.location.reload()}>
        {text.reload}
      </button>
      <p className={styles.contactLabel}>{text.contact}</p>
      <ul className={styles.contacts}>
        <li>
          <a href={CONTACT_MAILTO}>{CONTACT_EMAIL}</a>
        </li>
        {SOCIAL_LINKS.map((link) => (
          <li key={link.id}>
            <a href={link.href} {...EXTERNAL_LINK_PROPS}>
              {link.label}
            </a>
          </li>
        ))}
      </ul>
    </main>
  );
}
