import { Card, CardText, CardTitle } from '../../components/card/Card.tsx';
import { Grid } from '../../components/grid/Grid.tsx';
import { RichText } from '../../components/rich-text/RichText.tsx';
import { Section } from '../../components/section/Section.tsx';
import { SectionGlyph } from '../../cube/SectionGlyph.tsx';
import { SECTION_IDS } from '../../globals/constants.ts';
import { useMessages } from '../../i18n/useLanguage.ts';
import styles from './WhatIDo.module.css';

export function WhatIDo() {
  const { whatIDo } = useMessages();

  return (
    <Section
      id={SECTION_IDS.whatIDo}
      title={whatIDo.title}
      subtitle={whatIDo.subtitle}
      adornment={<SectionGlyph section="whatIDo" />}
    >
      <Grid columns={2}>
        {whatIDo.items.map((item) => (
          <Card key={item.title}>
            <CardTitle>{item.title}</CardTitle>
            <CardText>{item.description}</CardText>
            <p className={styles.example}>
              <RichText text={item.example} />
            </p>
          </Card>
        ))}
      </Grid>
    </Section>
  );
}
