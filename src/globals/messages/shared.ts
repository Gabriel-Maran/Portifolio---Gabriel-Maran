import type { ExternalUrlKey, ProjectLinkKind } from '../constants.ts';

interface OngoingProject {
  name: string;
  tags: readonly string[];
  /** Chave em EXTERNAL_URLS de cada link. Sem `code`, o card avisa que o código é privado. */
  links: Partial<Record<ProjectLinkKind, ExternalUrlKey>>;
}

// Tipado por fora do `as const` para todos os projetos terem a mesma forma, com ou sem link.
const ONGOING_PROJECTS: Readonly<
  Record<'petShop' | 'expenses' | 'tickets' | 'miniReact', OngoingProject>
> = {
  petShop: {
    name: 'PetShop Manager',
    tags: ['React Native', 'Expo', 'TypeScript', 'SQLite'],
    links: { code: 'petShopCode', post: 'petShopPost' },
  },
  expenses: {
    name: 'Controle de Gastos',
    tags: ['Node.js', 'Express', 'TypeScript', 'Zod', 'Prisma', 'PostgreSQL'],
    links: {},
  },
  tickets: {
    name: 'Plataforma de Ingressos',
    tags: ['Node.js', 'Express', 'TypeScript', 'PostgreSQL', 'JWT'],
    links: {},
  },
  miniReact: {
    name: 'Mini React',
    tags: ['JavaScript', 'Virtual DOM'],
    links: { code: 'miniReactCode' },
  },
};

// Valores iguais em todos os idiomas. Os dicionários usam estes, para não repetir nem divergir.
export const SHARED = {
  jobs: {
    grupoItalo: {
      isCurrent: true,
      showsUploadFlow: true,
      tags: ['Node.js', 'Express', 'React', 'TypeScript', 'PostgreSQL'],
    },
    lpd: {
      isCurrent: false,
      showsUploadFlow: false,
      tags: ['Power Automate', 'Power Apps', 'SharePoint'],
    },
  },
  uploadFlow: {
    api: 'API',
  },
  projects: {
    rinha: {
      name: 'Rinha de Ratos',
      tags: ['Kotlin', 'Spring Boot', 'PostgreSQL', 'PDFBox'],
      stats: { endpoints: 48, days: 38, people: 4 },
    },
    inProgress: ONGOING_PROJECTS,
  },
  // Cada item tem prova pública ou está no trabalho atual (ver docs/perfil-profissional.md).
  stack: {
    frontend: {
      title: 'Front-end',
      main: ['React', 'TypeScript', 'JavaScript', 'React Native (Expo)'],
      also: ['HTML', 'CSS', 'Vite', 'Vitest', 'Testing Library'],
    },
    backend: {
      title: 'Back-end',
      also: ['Prisma', 'Zod', 'Java', 'Kotlin', 'Spring', 'Maven', 'JDBC'],
    },
    data: {
      main: ['PostgreSQL', 'AWS', 'Git'],
      also: ['SQLite', 'MySQL', 'Docker', 'GitHub Actions', 'Vercel'],
    },
  },
} as const;

export type RinhaStat = keyof typeof SHARED.projects.rinha.stats;
