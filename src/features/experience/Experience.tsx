import { Label } from '../../components/label/Label.tsx';
import { Section } from '../../components/section/Section.tsx';
import { TagList } from '../../components/tag-list/TagList.tsx';
import { SECTION_IDS } from '../../globals/constants.ts';
import { useMessages } from '../../i18n/useLanguage.ts';
import styles from './Experience.module.css';
import { TimelineEntry } from './TimelineEntry.tsx';
import { UploadFlow } from './UploadFlow.tsx';

export function Experience() {
  const { experience } = useMessages();

  return (
    <Section id={SECTION_IDS.experience} title={experience.title} subtitle={experience.subtitle}>
      <div className={styles.timeline}>
        {experience.jobs.map((job) => (
          <TimelineEntry
            key={job.role}
            period={job.period}
            badge={job.isCurrent ? experience.current : undefined}
          >
            <h3 className={styles.role}>{job.role}</h3>
            <p className={styles.organization}>{job.organization}</p>
            <ul className={styles.highlights}>
              {job.highlights.map((highlight) => (
                <li key={highlight}>{highlight}</li>
              ))}
            </ul>
            {job.showsUploadFlow ? <UploadFlow /> : null}
            <TagList className={styles.tags} items={job.tags} />
          </TimelineEntry>
        ))}

        <Label as="h3" className={styles.educationTitle}>
          {experience.educationTitle}
        </Label>
        {experience.education.map((entry) => (
          <TimelineEntry key={entry.title} period={entry.period}>
            <h4 className={styles.course}>{entry.title}</h4>
            <p className={styles.organization}>{entry.organization}</p>
          </TimelineEntry>
        ))}
      </div>
    </Section>
  );
}
