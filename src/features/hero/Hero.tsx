import { useId } from 'react';
import { ButtonLink } from '../../components/button/Button.tsx';
import { Container } from '../../components/container/Container.tsx';
import { CopyEmailButton } from '../../components/copy-email-button/CopyEmailButton.tsx';
import { RichText } from '../../components/rich-text/RichText.tsx';
import { OWNER_NAME, SECTION_IDS, SOCIAL_LINKS } from '../../globals/constants.ts';
import { useMessages } from '../../i18n/useLanguage.ts';
import styles from './Hero.module.css';

export function Hero() {
  const { hero } = useMessages();
  const titleId = useId();

  return (
    <section className={styles.hero} aria-labelledby={titleId}>
      <Container className={styles.inner}>
        <h1 id={titleId} className={styles.name}>
          {OWNER_NAME}
        </h1>
        <p className={styles.role}>
          <RichText text={hero.role} />
        </p>
        <p className={styles.lead}>{hero.lead}</p>
        <div className={styles.actions}>
          <ButtonLink variant="primary" href={`#${SECTION_IDS.projects}`}>
            {hero.seeProjects}
          </ButtonLink>
          <CopyEmailButton />
          {SOCIAL_LINKS.map((link) => (
            <ButtonLink key={link.id} href={link.href} external>
              {link.label}
            </ButtonLink>
          ))}
        </div>
        <ul className={styles.facts}>
          {hero.facts.map((fact) => (
            <li key={fact}>{fact}</li>
          ))}
        </ul>
      </Container>
    </section>
  );
}
