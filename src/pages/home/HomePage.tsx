import { DEFAULT_LANGUAGE, OWNER_NAME } from '../../globals/constants.ts';
import { messages } from '../../globals/messages/index.ts';
import styles from './HomePage.module.css';

// Tela provisória: confirma tema, fontes e CSS Modules. As seções entram como features na Parte 3.
export function HomePage() {
  const text = messages[DEFAULT_LANGUAGE].home;

  return (
    <main className={styles.shell}>
      <h1 className={styles.name}>{OWNER_NAME}</h1>
      <p className={styles.note}>{text.placeholder}</p>
    </main>
  );
}
