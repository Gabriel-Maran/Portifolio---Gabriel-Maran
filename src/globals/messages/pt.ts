import type { SectionKey, SocialLinkId } from '../constants.ts';
import { SHARED, type RinhaStat } from './shared.ts';

/*
 * Textos com destaque usam uma marcação mínima, lida por utils/richText.ts:
 * **forte**, *ênfase*, `código` e [texto](chave), com a chave em EXTERNAL_URLS.
 */
export const pt = {
  meta: {
    title: 'Gabriel Maran · Desenvolvedor Full Stack',
    description: 'Gabriel Maran, Desenvolvedor Full Stack Júnior no Grupo Ítalo.',
  },

  navigation: {
    skipToContent: 'Pular para o conteúdo',
    sectionsLabel: 'Seções',
    menu: 'Menu',
    links: {
      whatIDo: 'O que faço',
      experience: 'Experiência',
      projects: 'Projetos',
      approach: 'Como resolvo',
      stack: 'Stack',
      contact: 'Contato',
    } satisfies Record<SectionKey, string>,
  },

  language: {
    label: 'Idioma',
  },

  tracker: {
    title: 'Cada seção visitada resolve uma face',
    progress: (solved: number, total: number) => `${solved} de ${total} seções resolvidas`,
  },

  cube: {
    label: 'Cubo mágico interativo. Use as setas para girar.',
    hint: 'Arraste o cubo. Ele se resolve enquanto você lê.',
    scramble: 'Embaralhar',
    solve: 'Resolver',
    movesLeft: (count: number) =>
      count === 1 ? 'Falta 1 movimento' : `Faltam ${count} movimentos`,
    solvedIn: (count: number) =>
      count === 1 ? 'Resolvido em 1 movimento' : `Resolvido em ${count} movimentos`,
    algorithm: (moves: string) => `Algoritmo desta página: ${moves}, um movimento por seção.`,
  },

  hero: {
    role: 'Desenvolvedor Full Stack Júnior *no Grupo Ítalo*',
    lead: 'Antes de escrever código, entendo o problema e planejo a solução. Depois construo de ponta a ponta: sistemas web, APIs, dashboards e apps.',
    seeProjects: 'Ver projetos',
    facts: ['Francisco Beltrão, PR', 'Inglês intermediário', 'Sem busca ativa, aberto a conversar'],
  },

  copyEmail: {
    action: 'Copiar e-mail',
    copied: 'E-mail copiado',
    selected: 'Selecionado, use Ctrl+C',
  },

  whatIDo: {
    title: 'O que eu faço',
    subtitle: 'Quatro frentes, cada uma com um exemplo real.',
    items: [
      {
        title: 'Sistemas web',
        description:
          'Sistemas completos, com login, permissões, painéis e banco de dados. A mesma base serve para um SaaS.',
        example: 'Exemplo: os sistemas internos que desenvolvo e mantenho',
      },
      {
        title: 'APIs e integrações',
        description: 'APIs REST que conectam sistemas, bancos de dados e serviços externos.',
        example: 'Exemplo: o back-end do Rinha de Ratos',
      },
      {
        title: 'Dashboards e relatórios',
        description:
          'Gráficos, tabelas e comparativos por período e por unidade, para decidir com dados.',
        example: 'Exemplo: relatórios gerenciais no trabalho',
      },
      {
        title: 'Sites, landing pages e apps',
        description: 'Páginas rápidas e responsivas, e apps com React Native e Expo.',
        example: 'Exemplos: este site e um [app acadêmico que consome APIs](academicApp)',
      },
    ],
  },

  experience: {
    title: 'Experiência',
    subtitle: 'Comecei automatizando processos e hoje construo sistemas full stack.',
    current: 'Atual',
    jobs: [
      {
        ...SHARED.jobs.grupoItalo,
        period: 'Jul 2026 até hoje',
        role: 'Desenvolvedor Full Stack Júnior',
        organization: 'Grupo Ítalo · Francisco Beltrão, PR · Tempo integral',
        highlights: [
          'Desenvolvo e mantenho sistemas internos: portal de ferramentas, relatórios gerenciais, gestão de arquivos da engenharia e acompanhamento de metas.',
          'Criei uma arquitetura por features para os relatórios. Cada relatório novo já nasce com cores, componentes, tratamento de erros e chamadas de API prontos.',
          'Na gestão de arquivos, envios grandes vão direto para a nuvem, sem passar pelo servidor, e nada é apagado de vez: há lixeira com recuperação.',
          'Padronizei o tratamento de erros no back-end, ajudei a definir a stack interna e documento cada projeto, inclusive o contexto de arquitetura para desenvolvimento com IA.',
        ],
      },
      {
        ...SHARED.jobs.lpd,
        period: 'Jun 2025 a jun 2026',
        role: 'Assistente de automação e desenvolvimento',
        organization: 'LPD Negócios Internacional e Logística · Aprendiz',
        highlights: [
          'Criei o controle de cargas a caminho, com reserva de pallets por validação atômica, para vender carga em trânsito sem reserva dupla.',
          'Melhorei o app de qualidade de frutas, com relatórios em até 4 idiomas, soft delete e controle de conexão para não perder vistorias.',
          'Tornei pessoa e veículo independentes no controle de entrada e saída e facilitei o cadastro.',
          'Automatizei o envio de formulários e documentos de conformidade.',
        ],
      },
    ],
    uploadFlow: {
      ...SHARED.uploadFlow,
      label:
        'Sequência de envio: o navegador pede autorização à API, recebe uma URL pré-assinada, envia o arquivo direto para a nuvem, confirma o envio, a API confere o arquivo e ele fica disponível.',
      browser: 'Navegador',
      cloud: 'Nuvem',
      steps: [
        '1 · pede para enviar',
        '2 · URL pré-assinada',
        '3 · arquivo direto',
        '4 · confirma o envio',
        '5 · confere o arquivo',
        '6 · arquivo liberado',
      ],
      directNote: 'sem passar pela API',
      caption:
        'Envio de arquivos grandes: a API só autoriza, confirma e confere, e o arquivo vai direto para a nuvem.',
    },
    educationTitle: 'Formação',
    education: [
      {
        period: 'Fev 2024 a jul 2026',
        title: 'Análise e Desenvolvimento de Sistemas',
        organization: 'Unipar · Curso superior de tecnologia · Concluído',
      },
      {
        period: '2021 a 2023',
        title: 'Instituto Federal do Paraná',
        organization: 'Barracão, PR',
      },
    ],
  },

  projects: {
    title: 'Projetos',
    subtitle: 'Código público para você conferir.',
    rinha: {
      ...SHARED.projects.rinha,
      category: 'Projeto acadêmico',
      description:
        'Jogo web de batalhas automáticas entre ratos, com contas, loja de pacotes, ranking, histórico e relatórios em PDF.',
      myPart:
        '**Minha parte:** planejei as funcionalidades e construí todo o back-end em Kotlin e Spring Boot.',
      statLabels: {
        endpoints: 'endpoints REST',
        days: 'dias de projeto',
        people: 'pessoas na equipe',
      } satisfies Record<RinhaStat, string>,
      watchVideo: 'Ver o vídeo no LinkedIn',
      seeCode: 'Ver o código',
      howISolved: 'Como resolvi, passo a passo',
      imageAlt:
        'Histórico de uma batalha no jogo, com o dano causado em cada ataque e a vida dos dois ratos na rodada 6.',
      imageCaption: 'Histórico por rodada, gerado pelo motor de batalha que construí',
    },
  },

  method: {
    title: 'Como eu resolvo problemas',
    subtitle:
      'Encontrar e planejar a solução é minha principal capacidade. Um caso real do começo ao fim: o motor de batalha do Rinha de Ratos.',
    stepLabel: (step: number) => `Passo ${step}`,
    steps: [
      {
        title: 'Entendo o problema',
        text: 'O jogo dependia de um motor de batalha com ataques, poderes por sorte e atributos, e o prazo de 38 dias não comportava batalhas ao vivo por WebSockets.',
      },
      {
        title: 'Planejo a solução',
        text: 'Planejei as funcionalidades e organizei o back-end em camadas: controllers, services e repositories. A luta seria simulada inteira no servidor, de uma vez.',
      },
      {
        title: 'Construo',
        text: 'O motor guarda vida e efeitos na memória e grava o histórico de cada rodada. As habilidades são escritas como texto, como `+18%PASSEU`, e lidas por um parser.',
      },
      {
        title: 'Entrego e reviso',
        text: 'O jogo foi entregue com batalhas automáticas, ranking e relatórios em PDF. Revendo hoje, eu faria diferente: senhas com hash, autenticação de verdade, middlewares de tratamento de erros e camadas mais bem separadas.',
      },
    ],
  },

  stack: {
    title: 'Stack',
    subtitle: 'O que uso no dia a dia e o que também conheço.',
    alsoKnown: 'Também conheço',
    groups: [
      { ...SHARED.stack.frontend },
      { ...SHARED.stack.backend, main: ['Node.js', 'Express', 'APIs REST', 'JWT'] },
      { ...SHARED.stack.data, title: 'Dados e infraestrutura' },
    ],
  },

  contact: {
    title: 'Todo problema tem um algoritmo.',
    availability:
      'Hoje sou Desenvolvedor Full Stack Júnior no Grupo Ítalo. Não estou em busca ativa, mas estou aberto a conversar: presencial ou híbrido em Francisco Beltrão, ou remoto de qualquer lugar.',
    emailLabel: 'E-mail',
    socialLabels: {
      linkedin: 'Conecte',
      github: 'Veja o código',
    } satisfies Record<SocialLinkId, string>,
  },

  errors: {
    title: 'Algo deu errado.',
    description: 'A página não carregou como deveria. Recarregue para tentar de novo.',
    reload: 'Recarregar a página',
    contact: 'Se o erro continuar, fale comigo:',
  },
};

// O português é a fonte do tipo: os outros idiomas precisam ter exatamente as mesmas chaves.
export type Messages = typeof pt;
