import { Arrow } from '../../components/arrow/Arrow.tsx';
import { ButtonLink } from '../../components/button/Button.tsx';
import { Card } from '../../components/card/Card.tsx';
import { Label } from '../../components/label/Label.tsx';
import { RichText } from '../../components/rich-text/RichText.tsx';
import { TagList } from '../../components/tag-list/TagList.tsx';
import styles from './ProjectCard.module.css';

interface ProjectLink {
  href: string;
  label: string;
}

export interface ProjectCardProps {
  category: string;
  name: string;
  description: string;
  /** O que o Gabriel fez no projeto. Aceita a marcação de destaque. */
  contribution: string;
  stats: ReadonlyArray<{ label: string; value: number }>;
  tags: readonly string[];
  primaryLink: ProjectLink;
  secondaryLink: ProjectLink;
  /** Âncora para um caso contado em outra seção, como o passo a passo. */
  caseStudyLink?: ProjectLink;
  image: { src: string; alt: string; width: number; height: number; caption: string };
}

/** Molde único de projeto: cada projeto novo entra preenchendo estas props. */
export function ProjectCard({
  category,
  name,
  description,
  contribution,
  stats,
  tags,
  primaryLink,
  secondaryLink,
  caseStudyLink,
  image,
}: ProjectCardProps) {
  return (
    <Card className={styles.project}>
      <div className={styles.layout}>
        <div className={styles.copy}>
          <Label>{category}</Label>
          <h3 className={styles.name}>{name}</h3>
          <p className={styles.description}>{description}</p>
          <p className={styles.contribution}>
            <RichText text={contribution} />
          </p>
          <dl className={styles.stats}>
            {stats.map((stat) => (
              <div key={stat.label} className={styles.stat}>
                <dt className={styles.statLabel}>{stat.label}</dt>
                <dd className={styles.statValue}>{stat.value}</dd>
              </div>
            ))}
          </dl>
          <TagList items={tags} />
          <div className={styles.actions}>
            <ButtonLink variant="primary" size="small" href={primaryLink.href} external>
              {primaryLink.label} <Arrow />
            </ButtonLink>
            <ButtonLink size="small" href={secondaryLink.href} external>
              {secondaryLink.label} <Arrow />
            </ButtonLink>
          </div>
          {caseStudyLink ? (
            <a className={styles.caseStudy} href={caseStudyLink.href}>
              {caseStudyLink.label} <Arrow direction="down" />
            </a>
          ) : null}
        </div>
        <figure>
          <div className={styles.shot}>
            <img
              src={image.src}
              alt={image.alt}
              width={image.width}
              height={image.height}
              loading="lazy"
              decoding="async"
            />
          </div>
          <figcaption className={styles.caption}>{image.caption}</figcaption>
        </figure>
      </div>
    </Card>
  );
}
