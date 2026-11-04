// Valores iguais em todos os idiomas. Os dicionários usam estes, para não repetir nem divergir.
export const SHARED = {
  jobs: {
    grupoItalo: {
      isCurrent: true,
      tags: ['Node.js', 'Express', 'React', 'TypeScript', 'PostgreSQL'],
    },
    lpd: {
      isCurrent: false,
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
  },
  stack: {
    frontend: {
      title: 'Front-end',
      main: ['React', 'TypeScript', 'JavaScript'],
      also: ['React Native (Expo)', 'HTML', 'CSS'],
    },
    backend: {
      title: 'Back-end',
      also: ['Java', 'Kotlin', 'Spring', 'Maven', 'JDBC'],
    },
    data: {
      main: ['PostgreSQL', 'AWS', 'Git'],
      also: ['MySQL', 'Docker'],
    },
  },
} as const;

export type RinhaStat = keyof typeof SHARED.projects.rinha.stats;
