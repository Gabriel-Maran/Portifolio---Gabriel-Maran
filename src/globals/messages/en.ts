import type { Messages } from './pt.ts';
import { SHARED } from './shared.ts';

export const en: Messages = {
  meta: {
    title: 'Gabriel Maran · Full Stack Developer',
    description: 'Gabriel Maran, Junior Full Stack Developer at Grupo Ítalo.',
  },

  navigation: {
    skipToContent: 'Skip to content',
    sectionsLabel: 'Sections',
    menu: 'Menu',
    links: {
      whatIDo: 'What I do',
      experience: 'Experience',
      projects: 'Projects',
      approach: 'My approach',
      stack: 'Stack',
      contact: 'Contact',
    },
  },

  language: {
    label: 'Language',
  },

  tracker: {
    title: 'Each section you visit solves one face',
    progress: (solved, total) => `${solved} of ${total} sections solved`,
  },

  cube: {
    hint: 'Drag the cube. It solves itself as you read.',
    scramble: 'Scramble',
    solve: 'Solve',
    movesLeft: (count) => (count === 1 ? '1 move left' : `${count} moves left`),
    solvedIn: (count) => (count === 1 ? 'Solved in 1 move' : `Solved in ${count} moves`),
    algorithm: (moves) => `This page’s algorithm: ${moves}, one move per section.`,
  },

  hero: {
    role: 'Junior Full Stack Developer *at Grupo Ítalo*',
    lead: 'Before writing code, I understand the problem and plan the solution. Then I build it end to end: web systems, APIs, dashboards and apps.',
    seeProjects: 'See projects',
    facts: [
      'Francisco Beltrão, Brazil',
      'Intermediate English',
      'Not actively looking, open to a conversation',
    ],
  },

  copyEmail: {
    action: 'Copy email',
    copied: 'Email copied',
    selected: 'Selected, press Ctrl+C',
  },

  whatIDo: {
    title: 'What I do',
    subtitle: 'Four areas, each with a real example.',
    items: [
      {
        title: 'Web systems',
        description:
          'Complete systems with login, permissions, dashboards and a database. The same foundation works for a SaaS.',
        example: 'Example: the internal systems I build and maintain',
      },
      {
        title: 'APIs and integrations',
        description: 'REST APIs that connect systems, databases and external services.',
        example: 'Example: the Rinha de Ratos back-end',
      },
      {
        title: 'Dashboards and reports',
        description:
          'Charts, tables and comparisons by period and by unit, to make decisions with data.',
        example: 'Example: management reports at work',
      },
      {
        title: 'Websites, landing pages and apps',
        description: 'Fast, responsive pages, and apps built with React Native and Expo.',
        example: 'Examples: this website and an [academic app that consumes APIs](academicApp)',
      },
    ],
  },

  experience: {
    title: 'Experience',
    subtitle: 'I started by automating processes and now I build full stack systems.',
    current: 'Current',
    jobs: [
      {
        ...SHARED.jobs.grupoItalo,
        period: 'Jul 2026 to present',
        role: 'Junior Full Stack Developer',
        organization: 'Grupo Ítalo · Francisco Beltrão, Brazil · Full time',
        highlights: [
          'I build and maintain internal systems: a tools portal, management reports, engineering file management and goal tracking.',
          'I created a feature-based architecture for the reports. Every new report starts with colors, components, error handling and API calls ready.',
          'In file management, large uploads go straight to the cloud without passing through the server, and nothing is deleted for good: there is a recoverable trash.',
          'I standardized back-end error handling, helped define the internal stack and document every project, including the architecture context for AI-assisted development.',
        ],
      },
      {
        ...SHARED.jobs.lpd,
        period: 'Jun 2025 to Jun 2026',
        role: 'Automation and development assistant',
        organization: 'LPD Negócios Internacional e Logística · Apprentice',
        highlights: [
          'I built the incoming loads tracker, with atomic pallet reservations, to sell cargo in transit without double bookings.',
          'I improved the fruit quality app, with reports in up to 4 languages, soft delete and connection checks so inspections aren’t lost.',
          'I made people and vehicles independent in the entry and exit control and simplified registration.',
          'I automated the sending of compliance forms and documents.',
        ],
      },
    ],
    uploadFlow: {
      ...SHARED.uploadFlow,
      label:
        'Upload sequence: the browser asks the API for permission, receives a pre-signed URL, sends the file straight to the cloud, confirms the upload, the API checks the file and it becomes available.',
      browser: 'Browser',
      cloud: 'Cloud',
      steps: [
        '1 · asks to upload',
        '2 · pre-signed URL',
        '3 · file goes direct',
        '4 · confirms upload',
        '5 · checks the file',
        '6 · file available',
      ],
      directNote: 'skipping the API',
      caption:
        'Large file uploads: the API only authorizes, confirms and checks, and the file goes straight to the cloud.',
    },
    educationTitle: 'Education',
    education: [
      {
        period: 'Feb 2024 to Jul 2026',
        title: 'Systems Analysis and Development',
        organization: 'Unipar · Undergraduate technology degree (2.5 years) · Completed',
      },
      {
        period: '2021 to 2023',
        title: 'Federal Institute of Paraná',
        organization: 'Barracão, Brazil',
      },
    ],
  },

  projects: {
    title: 'Projects',
    subtitle: 'Public code you can check.',
    rinha: {
      ...SHARED.projects.rinha,
      category: 'Academic project',
      description:
        'Rinha de Ratos (“Rat Brawl”) is a web game of automatic battles between rats, with accounts, a pack store, ranking, history and PDF reports.',
      myPart:
        '**My part:** I planned the features and built the entire back-end in Kotlin and Spring Boot.',
      statLabels: {
        endpoints: 'REST endpoints',
        days: 'days of work',
        people: 'people on the team',
      },
      watchVideo: 'Watch the video on LinkedIn',
      seeCode: 'See the code',
      howISolved: 'How I solved it, step by step',
      imageAlt:
        'Battle history in the game, showing the damage of each attack and both rats’ health in round 6.',
      imageCaption: 'Round-by-round history, generated by the battle engine I built',
    },
  },

  method: {
    title: 'How I solve problems',
    subtitle:
      'Finding and planning the solution is my main strength. One real case from start to finish: the Rinha de Ratos battle engine.',
    stepLabel: (step) => `Step ${step}`,
    steps: [
      {
        title: 'I understand the problem',
        text: 'The game depended on a battle engine with attacks, powers driven by luck and attributes, and a 38-day deadline left no room for live battles over WebSockets.',
      },
      {
        title: 'I plan the solution',
        text: 'I planned the features and organized the back-end in layers: controllers, services and repositories. The fight would be simulated entirely on the server, in one go.',
      },
      {
        title: 'I build',
        text: 'The engine keeps health and effects in memory and records the history of each round. Abilities are written as text, like `+18%PASSEU`, and read by a parser.',
      },
      {
        title: 'I deliver and review',
        text: 'The game shipped with automatic battles, ranking and PDF reports. Looking back, I would do it differently: hashed passwords, real authentication, error-handling middleware and cleaner layers.',
      },
    ],
  },

  stack: {
    title: 'Stack',
    subtitle: 'What I use every day and what I am also familiar with.',
    alsoKnown: 'Also familiar with',
    groups: [
      { ...SHARED.stack.frontend },
      { ...SHARED.stack.backend, main: ['Node.js', 'Express', 'REST APIs', 'JWT'] },
      { ...SHARED.stack.data, title: 'Data and infrastructure' },
    ],
  },

  contact: {
    title: 'Every problem has an algorithm.',
    availability:
      'I am currently a Junior Full Stack Developer at Grupo Ítalo. I am not actively looking, but I am open to a conversation: on-site or hybrid in Francisco Beltrão, or remote from anywhere.',
    emailLabel: 'Email',
    socialLabels: {
      linkedin: 'Connect',
      github: 'See the code',
    },
  },

  errors: {
    title: 'Something went wrong.',
    description: 'The page did not load as expected. Reload to try again.',
    reload: 'Reload the page',
    contact: 'If the error persists, reach me at:',
  },
};
