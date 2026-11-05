import { BulletList } from '../../components/bullet-list/BulletList.tsx';
import { Label } from '../../components/label/Label.tsx';
import { Section } from '../../components/section/Section.tsx';
import { TagList } from '../../components/tag-list/TagList.tsx';
import { SectionGlyph } from '../../cube/SectionGlyph.tsx';
import { SECTION_IDS } from '../../globals/constants.ts';
import { useMessages } from '../../i18n/useLanguage.ts';
import styles from './Experience.module.css';
import { TimelineEntry } from './TimelineEntry.tsx';
import { UploadFlow } from './UploadFlow.tsx';

export function Experience() {
  const { experience } = useMessages();

  return (
    <Section
      id={SECTION_IDS.experience}
      title={experience.title}
      subtitle={experience.subtitle}
      adornment={<SectionGlyph section="experience" />}
    >
      <div className={styles.timeline}>
        {experience.jobs.map((job) => (
          <TimelineEntry
            key={job.role}
            period={job.period}
            badge={job.isCurrent ? experience.current : undefined}
          >
            <h3 className={styles.role}>{job.role}</h3>
            <p className={styles.organization}>{job.organization}</p>
            <BulletList items={job.highlights} />
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
