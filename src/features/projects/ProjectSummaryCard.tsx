import { Arrow } from '../../components/arrow/Arrow.tsx';
import { BulletList } from '../../components/bullet-list/BulletList.tsx';
import { ButtonLink } from '../../components/button/Button.tsx';
import { Card, CardText, CardTitle } from '../../components/card/Card.tsx';
import { Disclosure } from '../../components/disclosure/Disclosure.tsx';
import { Label } from '../../components/label/Label.tsx';
import { TagList } from '../../components/tag-list/TagList.tsx';
import styles from './ProjectSummaryCard.module.css';

interface ProjectLink {
  href: string;
  label: string;
}

export interface ProjectSummaryCardProps {
  category: string;
  name: string;
  description: string;
  /** Pontos técnicos do projeto. Aceitam a marcação de destaque. */
  highlights: readonly string[];
  /** Texto do controle que abre os pontos técnicos. */
  highlightsToggle: string;
  tags: readonly string[];
  /** Onde o projeto está agora, como "Etapa 4 de 10". */
  status: string;
  /** Links externos, como o código e o post do projeto. */
  links: readonly ProjectLink[];
  /** Aviso mostrado no lugar dos links quando o código ainda é privado. */
  privateNote?: string;
}

/**
 * Card de projeto em andamento: sem imagem nem números, com o estado atual no rodapé. Os
 * pontos técnicos ficam num bloco que abre, para os quatro cards não alongarem a página.
 */
export function ProjectSummaryCard({
  category,
  name,
  description,
  highlights,
  highlightsToggle,
  tags,
  status,
  links,
  privateNote,
}: ProjectSummaryCardProps) {
  return (
    <Card className={styles.card}>
      <Label>{category}</Label>
      <CardTitle as="h4">{name}</CardTitle>
      <CardText>{description}</CardText>
      <TagList items={tags} />
      <Disclosure summary={highlightsToggle} hiddenContext={name}>
        <BulletList items={highlights} />
      </Disclosure>
      <footer className={styles.footer}>
        <p className={styles.status}>{status}</p>
        {links.length > 0 ? (
          <div className={styles.links}>
            {links.map((link) => (
              <ButtonLink key={link.href} size="small" href={link.href} external>
                {link.label} <Arrow />
              </ButtonLink>
            ))}
          </div>
        ) : null}
        {privateNote ? <p className={styles.privateNote}>{privateNote}</p> : null}
      </footer>
    </Card>
  );
}
