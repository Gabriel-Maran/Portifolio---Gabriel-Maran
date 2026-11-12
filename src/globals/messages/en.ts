import type { Messages } from './pt.ts';
import { SHARED } from './shared.ts';

export const en: Messages = {
  meta: {
    title: 'Gabriel Maran · Full Stack Developer',
    description: 'Gabriel Maran, Junior Full Stack Developer at Grupo Ítalo.',
    imageAlt:
      'Gabriel Maran, Junior Full Stack Developer at Grupo Ítalo, next to the six solved faces of a Rubik’s cube.',
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
    lead: 'I build and maintain management reports, goal tracking and file management, from the database to the interface. Before the code, I understand the problem and plan the solution.',
    seeProjects: 'See projects',
    facts: [
      'Francisco Beltrão, Brazil',
      'Intermediate English',
      'Degree in Systems Analysis and Development',
    ],
  },

  copyEmail: {
    action: 'Copy email',
    copied: 'Email copied',
    selected: "Couldn't copy it. The email is selected in the field, ready to copy.",
  },

  whatIDo: {
    title: 'What I do',
    subtitle: 'From the database to the interface, with a real example in each area.',
    items: [
      {
        title: 'Web systems and SaaS',
        description:
          'Systems with login, roles and permissions, business rules on the server and dashboards for everyday users.',
        example: 'Examples: the internal systems I maintain at work and Controle de Gastos',
      },
      {
        title: 'APIs and back-end',
        description:
          'REST APIs that validate every input, check permissions on the server, standardize errors and ship with automated tests.',
        example:
          'Examples: Controle de Gastos, with over 300 tests, and Rinha de Ratos, with 48 endpoints',
      },
      {
        title: 'Dashboards and reports',
        description:
          'I turn scattered data into charts, tables and comparisons (month over month, year over year, by unit) for the people who make decisions.',
        example: 'Examples: the management reports at work and the six in PetShop Manager',
      },
      {
        title: 'Apps and landing pages',
        description:
          'React Native and Expo apps, including ones that work offline, and fast, accessible, bilingual landing pages.',
        example: 'Example: [PetShop Manager](petShopCode)',
      },
    ],
  },

  experience: {
    title: 'Experience',
    subtitle: 'I started by automating processes and now I build full stack systems.',
    current: 'Current',
    detailsToggle: 'See deliverables and lessons',
    highlightsTitle: { current: 'What I do', past: 'What I did' },
    learnedTitle: 'What I learned',
    jobs: [
      {
        ...SHARED.jobs.grupoItalo,
        period: 'Jul 2026 to present',
        role: 'Junior Full Stack Developer',
        organization: 'Grupo Ítalo · Francisco Beltrão, Brazil · Full time',
        summary:
          'I build and maintain the company’s internal systems, from the database to the interface: a tools portal, management reports, engineering file management and goal tracking.',
        highlights: [
          'I created a feature-based architecture for the reports. Every new report starts with colors, components, error handling and API calls ready.',
          'In file management, large uploads go straight to the cloud without passing through the server, and nothing is deleted for good: there is a recoverable trash (known as *soft delete*).',
          'I standardized back-end error handling, helped define the internal stack and document every project, including the architecture context for AI-assisted development.',
        ],
        learned: [
          'Architecture pays for itself: with colors, components, errors and API calls centralized, a new report no longer starts from scratch.',
          'Documenting why decisions were made saves rework and helps whoever comes next, AI included.',
        ],
      },
      {
        ...SHARED.jobs.lpd,
        period: 'Jun 2025 to Jun 2026',
        role: 'Automation and development assistant',
        organization: 'LPD Negócios Internacional e Logística · Apprentice',
        summary:
          'As an apprentice, I automated processes and built internal apps with Power Automate, Power Apps and SharePoint, for logistics and fruit quality control.',
        highlights: [
          'I built the incoming loads tracker, with atomic pallet reservations, to sell cargo in transit without double bookings.',
          'I improved the fruit quality app, with reports in up to 4 languages, soft delete and connection checks so inspections aren’t lost.',
          'I made people and vehicles independent in the entry and exit control and simplified registration.',
          'I automated the sending of compliance forms and documents.',
        ],
        learned: [
          'Good data modeling fixes what the screen can’t: the one-vehicle-per-person limit came from the data, not the interface.',
          'Plan for failure before it happens: connections drop and two people book at the same time, so the system has to handle both.',
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
    subtitle: 'Two shipped projects with open code, and the ones I am building now.',
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
    petShop: {
      ...SHARED.projects.petShop,
      category: 'Mobile app · Built for a pet shop',
      description:
        'An Android app for a pet shop to manage owners, pets and the grooming schedule, with packages that book the next visit on their own. It works offline, with the database on the phone itself.',
      myPart:
        '**My part:** I built the app’s foundation (Expo, SQLite and the layers), the automatic rebooking, the reports and the backup. Later, I reviewed the code with tests, migrations, validation and navigation.',
      statLabels: {
        tests: 'automated tests',
        reports: 'reports',
        people: 'people on the team',
      },
      imageAlt:
        'Three app screens: the calendar with the day’s appointments, a pet’s monthly package with automatic rebooking and the list of the six reports.',
      imageCaption: 'Calendar, package with automatic rebooking and reports, with sample data',
    },
    inProgressTitle: 'Ongoing',
    privateCode: 'Code is private for now',
    highlightsToggle: 'See technical highlights',
    linkLabels: {
      code: 'See the code',
      post: 'See the LinkedIn post',
    },
    inProgress: [
      {
        ...SHARED.projects.inProgress.expenses,
        category: 'API · Personal project',
        description:
          'Controle de Gastos (“Expense Control”) is an API for expenses shared by couples, travel buddies or roommates: who paid, whose share is whose and who owes whom.',
        highlights: [
          'Equal, percentage or exact-amount splits, installments, settlements and budgets per person and per category.',
          'Roles with layered authorization, a change history and over 300 automated tests.',
        ],
        status: 'Back-end at part 6 of 7. The front-end comes next.',
      },
      {
        ...SHARED.projects.inProgress.tickets,
        category: 'API · Personal project',
        description:
          'Plataforma de Ingressos (“Ticketing Platform”) is an API to create in-person, hybrid or online events and sell tickets in batches, with one ticket and one QR code per attendee.',
        highlights: [
          'The database never oversells a batch: a trigger reserves the seat atomically and rejects the ticket once the batch sells out.',
          'The database stores only hashes of the password and the token, login never reveals whether an email exists and the payment webhook compares its secret in constant time.',
        ],
        status: 'In development: the API comes first.',
      },
      {
        ...SHARED.projects.inProgress.miniReact,
        category: 'Study · In progress',
        description:
          'React written from scratch, in plain JavaScript with no dependencies, to understand from the inside the tool I use every day.',
        highlights: [
          'Done: `createElement`, Virtual DOM, `render` and function components.',
          'Next: state, reconciliation, keyed lists, effects and Fiber.',
        ],
        status: 'Stage 4 of 10.',
      },
    ],
  },

  method: {
    title: 'How I solve problems',
    subtitle: 'One real case, from the problem to the review: the Rinha de Ratos battle engine.',
    stepLabel: (step) => `Step ${step}`,
    steps: [
      {
        title: 'I understand the problem and its limits',
        text: 'The game needed battles with attacks each round, powers driven by luck and attributes, and abilities with their own effects. The limits: 38 days, a team of 4 and no time to learn WebSockets.',
      },
      {
        title: 'I choose the path',
        text: 'I swapped live fights for a full simulation on the server: the battle runs in one go, and the screen shows the history round by round. I lost real time and gained an engine that fit the deadline.',
      },
      {
        title: 'I build',
        text: 'I organized the back-end in layers: controllers, services and repositories. The engine keeps health and effects in memory and records every round in the history. Abilities are text, like `+18%PASSEU`, read by a parser.',
      },
      {
        title: 'I deliver and review',
        text: 'The game shipped with automatic battles, ranking and PDF reports. Looking back, I would change: hashed passwords, real authentication, error and validation middleware and better-divided layers. That is what I already do in Controle de Gastos.',
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
      'I enjoy talking about hard problems, architecture and code. If you want to exchange ideas, reach out.',
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
