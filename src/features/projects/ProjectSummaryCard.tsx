import { BulletList } from '../../components/bullet-list/BulletList.tsx';
import { Card, CardText, CardTitle } from '../../components/card/Card.tsx';
import { Label } from '../../components/label/Label.tsx';
import { TagList } from '../../components/tag-list/TagList.tsx';
import styles from './ProjectSummaryCard.module.css';

export interface ProjectSummaryCardProps {
  category: string;
  name: string;
  description: string;
  /** Pontos técnicos do projeto. Aceitam a marcação de destaque. */
  highlights: readonly string[];
  tags: readonly string[];
  /** Onde o projeto está agora, como "Etapa 4 de 10". */
  status: string;
  /** Aviso no lugar do link do código enquanto o repositório for privado. */
  codeNote: string;
}

/** Card de projeto em andamento: sem imagem nem números, com o estado atual no rodapé. */
export function ProjectSummaryCard({
  category,
  name,
  description,
  highlights,
  tags,
  status,
  codeNote,
}: ProjectSummaryCardProps) {
  return (
    <Card className={styles.card}>
      <Label>{category}</Label>
      <CardTitle as="h4">{name}</CardTitle>
      <CardText>{description}</CardText>
      <BulletList items={highlights} />
      <TagList items={tags} />
      <footer className={styles.footer}>
        <p className={styles.status}>{status}</p>
        <p className={styles.codeNote}>{codeNote}</p>
      </footer>
    </Card>
  );
}
