import { Arrow } from '../../components/arrow/Arrow.tsx';
import { Card, LinkCard } from '../../components/card/Card.tsx';
import { CopyEmailButton } from '../../components/copy-email-button/CopyEmailButton.tsx';
import { Grid } from '../../components/grid/Grid.tsx';
import { Label } from '../../components/label/Label.tsx';
import { Section } from '../../components/section/Section.tsx';
import {
  CONTACT_EMAIL,
  CONTACT_MAILTO,
  SECTION_IDS,
  SOCIAL_LINKS,
} from '../../globals/constants.ts';
import { useMessages } from '../../i18n/useLanguage.ts';
import { cx } from '../../utils/classNames.ts';
import styles from './Contact.module.css';

export function Contact() {
  const { contact } = useMessages();

  return (
    <Section id={SECTION_IDS.contact} title={contact.title} subtitle={contact.availability}>
      <Grid columns={3}>
        <Card className={styles.card}>
          <Label>{contact.emailLabel}</Label>
          <a className={styles.email} href={CONTACT_MAILTO}>
            {CONTACT_EMAIL}
          </a>
          <div className={styles.bottom}>
            <CopyEmailButton size="small" />
          </div>
        </Card>
        {SOCIAL_LINKS.map((link) => (
          <LinkCard key={link.id} href={link.href} className={styles.card}>
            <Label>{contact.socialLabels[link.id]}</Label>
            <p className={cx(styles.channel, styles.bottom)}>
              {link.label} <Arrow />
            </p>
          </LinkCard>
        ))}
      </Grid>
    </Section>
  );
}
