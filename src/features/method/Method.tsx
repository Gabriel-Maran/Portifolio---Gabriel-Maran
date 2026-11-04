import { Label } from '../../components/label/Label.tsx';
import { RichText } from '../../components/rich-text/RichText.tsx';
import { Section } from '../../components/section/Section.tsx';
import { CubeScene } from '../../cube/CubeScene.tsx';
import { FaceGlyph } from '../../cube/FaceGlyph.tsx';
import { GLYPH_CELLS } from '../../cube/glyph.ts';
import { SectionGlyph } from '../../cube/SectionGlyph.tsx';
import { useCube } from '../../cube/useCube.ts';
import { SECTION_IDS } from '../../globals/constants.ts';
import { useMessages } from '../../i18n/useLanguage.ts';
import styles from './Method.module.css';

// Outra vista do cubo, com as faces verde e laranja à frente.
const METHOD_TILT = [-20, 30] as const;

/** A miniatura de cada passo vai se completando, até a face ficar inteira no último. */
const cellsForStep = (index: number, total: number) =>
  Math.round(((index + 1) / total) * GLYPH_CELLS);

export function Method() {
  const { method } = useMessages();
  const { faceBySection } = useCube();
  const face = faceBySection.approach;

  return (
    <Section
      id={SECTION_IDS.approach}
      title={method.title}
      subtitle={method.subtitle}
      adornment={<SectionGlyph section="approach" />}
      theme="light"
    >
      <div className={styles.layout}>
        <div className={styles.cubeColumn}>
          <CubeScene className={styles.cube} tilt={METHOD_TILT} draggable orbitOnScroll />
        </div>
        <ol className={styles.steps}>
          {method.steps.map((step, index) => (
            <li key={step.title} className={styles.step}>
              {face ? (
                <FaceGlyph
                  className={styles.stepGlyph}
                  face={face}
                  solvedCells={cellsForStep(index, method.steps.length)}
                />
              ) : null}
              <Label>{method.stepLabel(index + 1)}</Label>
              <h3 className={styles.title}>{step.title}</h3>
              <p className={styles.text}>
                <RichText text={step.text} />
              </p>
            </li>
          ))}
        </ol>
      </div>
    </Section>
  );
}
