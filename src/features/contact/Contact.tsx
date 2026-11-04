import { Arrow } from '../../components/arrow/Arrow.tsx';
import { Card, LinkCard } from '../../components/card/Card.tsx';
import { CopyEmailButton } from '../../components/copy-email-button/CopyEmailButton.tsx';
import { Grid } from '../../components/grid/Grid.tsx';
import { Label } from '../../components/label/Label.tsx';
import { Section } from '../../components/section/Section.tsx';
import { CubeScene } from '../../cube/CubeScene.tsx';
import { FaceGlyph } from '../../cube/FaceGlyph.tsx';
import { GLYPH_CELLS } from '../../cube/glyph.ts';
import { useCube } from '../../cube/useCube.ts';
import {
  CONTACT_EMAIL,
  CONTACT_MAILTO,
  SECTION_IDS,
  SOCIAL_LINKS,
} from '../../globals/constants.ts';
import { useMessages } from '../../i18n/useLanguage.ts';
import { cx } from '../../utils/classNames.ts';
import styles from './Contact.module.css';

/** O fechamento: o cubo chega resolvido aqui, com as seis faces e a contagem de movimentos. */
function Finale() {
  const { cube } = useMessages();
  const { solution, visited, movesDone, isSolved } = useCube();

  return (
    <div className={styles.finale}>
      <CubeScene draggable />
      <div className={styles.solvedRow}>
        {solution.map((face) => (
          <FaceGlyph key={face} face={face} solvedCells={visited.has(face) ? GLYPH_CELLS : 0} />
        ))}
      </div>
      <p className={styles.status}>
        {isSolved ? cube.solvedIn(movesDone) : cube.movesLeft(solution.length - movesDone)}
      </p>
    </div>
  );
}

export function Contact() {
  const { contact, cube } = useMessages();
  const { solution } = useCube();

  return (
    <Section
      id={SECTION_IDS.contact}
      title={contact.title}
      subtitle={contact.availability}
      adornment={<Finale />}
    >
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
      <p className={styles.algorithm}>{cube.algorithm(solution.join(' '))}</p>
    </Section>
  );
}
