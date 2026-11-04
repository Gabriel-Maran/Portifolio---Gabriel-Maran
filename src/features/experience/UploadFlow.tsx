import { useId } from 'react';
import { VisuallyHidden } from '../../components/visually-hidden/VisuallyHidden.tsx';
import { useMessages } from '../../i18n/useLanguage.ts';
import styles from './UploadFlow.module.css';

// Três participantes do envio, lado a lado. O x é a borda esquerda da caixa de cada um.
const PARTICIPANTS = [
  { key: 'browser', x: 10 },
  { key: 'api', x: 240 },
  { key: 'cloud', x: 470 },
] as const;
const BOX_WIDTH = 120;
const centerOf = (x: number) => x + BOX_WIDTH / 2;

// Setas comuns, na ordem dos passos 1, 2, 4, 5 e 6. A do passo 3 é a de destaque.
const ARROWS = [
  { x1: 72, y1: 84, x2: 296, y2: 84 },
  { x1: 298, y1: 128, x2: 74, y2: 128 },
  { x1: 72, y1: 216, x2: 296, y2: 216 },
  { x1: 302, y1: 260, x2: 526, y2: 260 },
  { x1: 298, y1: 304, x2: 74, y2: 304 },
];
const DIRECT_ARROW = { x1: 72, y1: 172, x2: 526, y2: 172 };

// Onde fica o rótulo de cada passo. O passo 3, de índice 2, é o arquivo indo direto para a nuvem.
const STEP_POSITIONS = [
  { x: 185, y: 74 },
  { x: 185, y: 118 },
  { x: 185, y: 162 },
  { x: 185, y: 206 },
  { x: 415, y: 250 },
  { x: 185, y: 294 },
];
const DIRECT_STEP_INDEX = 2;
const DIRECT_NOTE_POSITION = { x: 415, y: 162 };

// Ids de SVG precisam ser únicos na página; o useId pode trazer caracteres que o url() não aceita.
const useSvgId = () => useId().replace(/[^\w-]/g, '');

/** Diagrama de sequência do envio de arquivos grandes, com os textos no idioma atual. */
export function UploadFlow() {
  const { uploadFlow: flow } = useMessages().experience;
  const arrowId = useSvgId();
  const directArrowId = useSvgId();
  const participantLabels = { browser: flow.browser, api: flow.api, cloud: flow.cloud };

  return (
    <figure className={styles.flow}>
      {/* O leitor de tela lê a sequência por extenso; os textos soltos do desenho ficam de fora. */}
      <VisuallyHidden>{flow.label}</VisuallyHidden>
      <svg className={styles.diagram} viewBox="0 0 600 340" aria-hidden="true" focusable="false">
        <defs>
          <marker
            id={arrowId}
            viewBox="0 0 10 10"
            refX="9"
            refY="5"
            markerWidth="7"
            markerHeight="7"
            orient="auto-start-reverse"
          >
            <path d="M0,0 L10,5 L0,10 z" fill="currentColor" />
          </marker>
          <marker
            id={directArrowId}
            viewBox="0 0 10 10"
            refX="9"
            refY="5"
            markerWidth="6"
            markerHeight="6"
            orient="auto-start-reverse"
          >
            <path className={styles.accent} d="M0,0 L10,5 L0,10 z" />
          </marker>
        </defs>

        <g className={styles.boxes}>
          {PARTICIPANTS.map(({ key, x }) => (
            <rect key={key} x={x} y="8" width={BOX_WIDTH} height="36" rx="8" />
          ))}
        </g>
        <g className={styles.participantLabels}>
          {PARTICIPANTS.map(({ key, x }) => (
            <text key={key} x={centerOf(x)} y="32">
              {participantLabels[key]}
            </text>
          ))}
        </g>
        <g className={styles.lifelines}>
          {PARTICIPANTS.map(({ key, x }) => (
            <line key={key} x1={centerOf(x)} y1="44" x2={centerOf(x)} y2="326" />
          ))}
        </g>

        <g className={styles.arrows} markerEnd={`url(#${arrowId})`}>
          {ARROWS.map((arrow) => (
            <line key={`${arrow.x1}-${arrow.y1}`} {...arrow} />
          ))}
        </g>
        <line
          className={styles.directArrow}
          {...DIRECT_ARROW}
          markerEnd={`url(#${directArrowId})`}
        />

        <g className={styles.stepLabels}>
          {flow.steps.map((step, index) => {
            const position = STEP_POSITIONS[index];
            if (!position) return null;
            return (
              <text
                key={step}
                className={index === DIRECT_STEP_INDEX ? styles.accent : undefined}
                {...position}
              >
                {step}
              </text>
            );
          })}
          <text className={styles.accent} {...DIRECT_NOTE_POSITION}>
            {flow.directNote}
          </text>
        </g>
      </svg>
      <figcaption className={styles.caption}>{flow.caption}</figcaption>
    </figure>
  );
}
