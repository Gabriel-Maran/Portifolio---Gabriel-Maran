import { Card } from '../../components/card/Card.tsx';
import { Grid } from '../../components/grid/Grid.tsx';
import { Label } from '../../components/label/Label.tsx';
import { Section } from '../../components/section/Section.tsx';
import { TagList } from '../../components/tag-list/TagList.tsx';
import { SectionGlyph } from '../../cube/SectionGlyph.tsx';
import { SECTION_IDS } from '../../globals/constants.ts';
import { useMessages } from '../../i18n/useLanguage.ts';
import styles from './Stack.module.css';

export function Stack() {
  const { stack } = useMessages();

  return (
    <Section
      id={SECTION_IDS.stack}
      title={stack.title}
      subtitle={stack.subtitle}
      adornment={<SectionGlyph section="stack" />}
    >
      <Grid columns={3}>
        {stack.groups.map((group) => (
          <Card key={group.title} className={styles.card}>
            <Label as="h3">{group.title}</Label>
            <ul className={styles.main}>
              {group.main.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
            <div className={styles.also}>
              <Label>{stack.alsoKnown}</Label>
              <TagList items={group.also} />
            </div>
          </Card>
        ))}
      </Grid>
    </Section>
  );
}
