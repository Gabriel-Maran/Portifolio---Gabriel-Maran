import { Grid } from '../../components/grid/Grid.tsx';
import { Label } from '../../components/label/Label.tsx';
import { Section } from '../../components/section/Section.tsx';
import { SectionGlyph } from '../../cube/SectionGlyph.tsx';
import {
  EXTERNAL_URLS,
  PROJECT_LINK_KINDS,
  SECTION_IDS,
  type ExternalUrlKey,
  type ProjectLinkKind,
} from '../../globals/constants.ts';
import { useMessages } from '../../i18n/useLanguage.ts';
import { hasKey } from '../../utils/object.ts';
import rinhaHistoryImage from './assets/rinha-historico.jpg';
import { ProjectCard } from './ProjectCard.tsx';
import styles from './Projects.module.css';
import { ProjectSummaryCard } from './ProjectSummaryCard.tsx';

// Tamanho real da imagem, para o navegador reservar o espaço e a página não pular ao carregar.
const RINHA_IMAGE_SIZE = { width: 860, height: 640 } as const;

/** Os links que o projeto tem, na ordem de PROJECT_LINK_KINDS, já com a URL e o texto. */
function projectLinks(
  urlKeys: Partial<Record<ProjectLinkKind, ExternalUrlKey>>,
  labels: Record<ProjectLinkKind, string>,
) {
  return PROJECT_LINK_KINDS.flatMap((kind) => {
    const urlKey = urlKeys[kind];
    return urlKey ? [{ href: EXTERNAL_URLS[urlKey], label: labels[kind] }] : [];
  });
}

export function Projects() {
  const { projects } = useMessages();
  const { rinha } = projects;
  const stats = Object.entries(rinha.stats).flatMap(([key, value]) =>
    hasKey(rinha.statLabels, key) ? [{ label: rinha.statLabels[key], value }] : [],
  );

  return (
    <Section
      id={SECTION_IDS.projects}
      title={projects.title}
      subtitle={projects.subtitle}
      adornment={<SectionGlyph section="projects" />}
    >
      <ProjectCard
        category={rinha.category}
        name={rinha.name}
        description={rinha.description}
        contribution={rinha.myPart}
        stats={stats}
        tags={rinha.tags}
        primaryLink={{ href: EXTERNAL_URLS.rinhaVideo, label: rinha.watchVideo }}
        secondaryLink={{ href: EXTERNAL_URLS.rinhaCode, label: rinha.seeCode }}
        caseStudyLink={{ href: `#${SECTION_IDS.approach}`, label: rinha.howISolved }}
        image={{
          src: rinhaHistoryImage,
          alt: rinha.imageAlt,
          caption: rinha.imageCaption,
          ...RINHA_IMAGE_SIZE,
        }}
      />

      <Label as="h3" className={styles.groupTitle}>
        {projects.inProgressTitle}
      </Label>
      <Grid columns={2}>
        {projects.inProgress.map((project) => (
          <ProjectSummaryCard
            key={project.name}
            category={project.category}
            name={project.name}
            description={project.description}
            highlights={project.highlights}
            highlightsToggle={projects.highlightsToggle}
            tags={project.tags}
            status={project.status}
            links={projectLinks(project.links, projects.linkLabels)}
            privateNote={project.links.code ? undefined : projects.privateCode}
          />
        ))}
      </Grid>
    </Section>
  );
}
