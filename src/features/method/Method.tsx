import { Label } from '../../components/label/Label.tsx';
import { RichText } from '../../components/rich-text/RichText.tsx';
import { Section } from '../../components/section/Section.tsx';
import { SECTION_IDS } from '../../globals/constants.ts';
import { useMessages } from '../../i18n/useLanguage.ts';
import styles from './Method.module.css';

export function Method() {
  const { method } = useMessages();

  return (
    <Section
      id={SECTION_IDS.approach}
      title={method.title}
      subtitle={method.subtitle}
      theme="light"
    >
      <ol className={styles.steps}>
        {method.steps.map((step, index) => (
          <li key={step.title} className={styles.step}>
            <Label>{method.stepLabel(index + 1)}</Label>
            <h3 className={styles.title}>{step.title}</h3>
            <p className={styles.text}>
              <RichText text={step.text} />
            </p>
          </li>
        ))}
      </ol>
    </Section>
  );
}
