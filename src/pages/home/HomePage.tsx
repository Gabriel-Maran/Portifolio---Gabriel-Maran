import { LanguageSwitcher } from '../../components/language-switcher/LanguageSwitcher.tsx';
import { RichText } from '../../components/rich-text/RichText.tsx';
import { OWNER_NAME } from '../../globals/constants.ts';
import { useMessages } from '../../i18n/useLanguage.ts';
import styles from './HomePage.module.css';

// Tela provisória da Parte 2: mostra a troca de idioma. As seções entram como features na Parte 3.
export function HomePage() {
  const { hero, whatIDo } = useMessages();

  return (
    <main className={styles.shell}>
      <LanguageSwitcher />
      <h1 className={styles.name}>{OWNER_NAME}</h1>
      <p className={styles.role}>
        <RichText text={hero.role} />
      </p>
      <p className={styles.lead}>{hero.lead}</p>
      <p className={styles.example}>
        <RichText text={whatIDo.items[3]?.example ?? ''} />
      </p>
    </main>
  );
}
