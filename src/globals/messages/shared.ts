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
    // Em andamento e com código ainda privado: entram sem link, cada um com o estado atual.
    inProgress: {
      petShop: {
        name: 'PetShop Manager',
        tags: ['React Native', 'Expo', 'TypeScript', 'SQLite'],
      },
      expenses: {
        name: 'Controle de Gastos',
        tags: ['Node.js', 'Express', 'TypeScript', 'Zod', 'Prisma', 'PostgreSQL'],
      },
      tickets: {
        name: 'Plataforma de Ingressos',
        tags: ['Node.js', 'Express', 'TypeScript', 'PostgreSQL', 'JWT'],
      },
      miniReact: {
        name: 'Mini React',
        tags: ['JavaScript', 'Virtual DOM'],
      },
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
