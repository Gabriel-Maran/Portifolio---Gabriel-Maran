import type { ProjectLinkKind, SectionKey, SocialLinkId } from '../constants.ts';
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
    lead: 'Desenvolvo e mantenho relatórios gerenciais, metas e gestão de arquivos, do banco de dados à interface. Antes do código, entendo o problema e planejo a solução.',
    seeProjects: 'Ver projetos',
    facts: ['Francisco Beltrão, PR', 'Inglês intermediário', 'Formado em ADS pela Unipar'],
  },

  copyEmail: {
    action: 'Copiar e-mail',
    copied: 'E-mail copiado',
    selected: 'Não foi possível copiar. O e-mail está selecionado no campo, pronto para copiar.',
  },

  whatIDo: {
    title: 'O que eu faço',
    subtitle: 'Do banco de dados à interface, com um exemplo real em cada frente.',
    items: [
      {
        title: 'Sistemas web e SaaS',
        description:
          'Sistemas com login, papéis e permissões, regras de negócio no servidor e painéis para quem usa no dia a dia.',
        example: 'Exemplos: os sistemas internos que mantenho no trabalho e o Controle de Gastos',
      },
      {
        title: 'APIs e back-end',
        description:
          'APIs REST que validam toda entrada, checam a permissão no servidor, padronizam os erros e vêm com testes automatizados.',
        example:
          'Exemplos: o Controle de Gastos, com mais de 300 testes, e o Rinha de Ratos, com 48 endpoints',
      },
      {
        title: 'Dashboards e relatórios',
        description:
          'Transformo dados espalhados em gráficos, tabelas e comparativos (mês a mês, ano a ano, por unidade) para quem precisa decidir.',
        example: 'Exemplos: os relatórios gerenciais do trabalho e os seis do PetShop Manager',
      },
      {
        title: 'Apps e landing pages',
        description:
          'Apps com React Native e Expo, inclusive para uso sem internet, e landing pages rápidas, acessíveis e em dois idiomas.',
        example: 'Exemplo: o [PetShop Manager](petShopCode)',
      },
    ],
  },

  experience: {
    title: 'Experiência',
    subtitle: 'Comecei automatizando processos e hoje construo sistemas full stack.',
    current: 'Atual',
    detailsToggle: 'Ver entregas e aprendizados',
    highlightsTitle: { current: 'O que faço', past: 'O que fiz' },
    learnedTitle: 'O que aprendi',
    jobs: [
      {
        ...SHARED.jobs.grupoItalo,
        period: 'Jul 2026 até hoje',
        role: 'Desenvolvedor Full Stack Júnior',
        organization: 'Grupo Ítalo · Francisco Beltrão, PR · Tempo integral',
        summary:
          'Desenvolvo e mantenho, do banco de dados à interface, os sistemas internos da empresa: portal de ferramentas, relatórios gerenciais, gestão de arquivos da engenharia e acompanhamento de metas.',
        highlights: [
          'Criei uma arquitetura por features para os relatórios. Cada relatório novo já nasce com cores, componentes, tratamento de erros e chamadas de API prontos.',
          'Na gestão de arquivos, envios grandes vão direto para a nuvem, sem passar pelo servidor, e nada é apagado de vez: há lixeira com recuperação (o chamado *soft delete*).',
          'Padronizei o tratamento de erros no back-end, ajudei a definir a stack interna e documento cada projeto, inclusive o contexto de arquitetura para desenvolvimento com IA.',
        ],
        learned: [
          'Arquitetura se paga: com cores, componentes, erros e chamadas de API centralizados, um relatório novo deixou de começar do zero.',
          'Documentar o porquê das decisões poupa retrabalho e ajuda quem chega depois, inclusive a IA.',
        ],
      },
      {
        ...SHARED.jobs.lpd,
        period: 'Jun 2025 a jun 2026',
        role: 'Assistente de automação e desenvolvimento',
        organization: 'LPD Negócios Internacional e Logística · Aprendiz',
        summary:
          'Como aprendiz, automatizei processos e criei apps internos com Power Automate, Power Apps e SharePoint, para a logística e o controle de qualidade de frutas.',
        highlights: [
          'Criei o controle de cargas a caminho, com reserva de pallets por validação atômica, para vender carga em trânsito sem reserva dupla.',
          'Melhorei o app de qualidade de frutas, com relatórios em até 4 idiomas, soft delete e controle de conexão para não perder vistorias.',
          'Tornei pessoa e veículo independentes no controle de entrada e saída e facilitei o cadastro.',
          'Automatizei o envio de formulários e documentos de conformidade.',
        ],
        learned: [
          'Modelar bem os dados resolve o que a tela não resolve: o limite de um veículo por pessoa vinha do cadastro, não da interface.',
          'Pensar na falha antes dela: a conexão cai e duas pessoas reservam ao mesmo tempo, então o sistema precisa aguentar as duas coisas.',
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
    subtitle: 'Um projeto entregue, com código aberto, e os que estou construindo agora.',
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
    inProgressTitle: 'Em andamento',
    privateCode: 'Código privado por enquanto',
    highlightsToggle: 'Ver destaques técnicos',
    linkLabels: {
      code: 'Ver o código',
      post: 'Ver o post no LinkedIn',
    } satisfies Record<ProjectLinkKind, string>,
    inProgress: [
      {
        ...SHARED.projects.inProgress.petShop,
        category: 'Projeto acadêmico · App mobile',
        description:
          'App para um pet shop organizar donos, pets e agenda sem depender de internet. Os planos remarcam o próximo atendimento sozinhos.',
        highlights: [
          'Banco no próprio celular, com 8 triggers no SQLite para a remarcação automática e para ativar ou desativar dono e pets em cascata.',
          'Seis relatórios, como dias e horários mais atendidos e pets há mais tempo sem visita, com o telefone do dono.',
        ],
        status: 'Próximo passo: reorganizar a arquitetura em pull requests públicos.',
      },
      {
        ...SHARED.projects.inProgress.expenses,
        category: 'API · Projeto pessoal',
        description:
          'API para gastos divididos entre casal, amigos de viagem ou república: quem pagou, de quem é cada parte e quem deve para quem.',
        highlights: [
          'Divisão igual, por porcentagem ou por valor exato, parcelamento, acertos e orçamentos por pessoa e por categoria.',
          'Papéis com autorização em camadas, histórico de alterações e mais de 300 testes automatizados.',
        ],
        status: 'Back-end em 6 de 7 partes. O front-end vem depois.',
      },
      {
        ...SHARED.projects.inProgress.tickets,
        category: 'API · Projeto pessoal',
        description:
          'API para criar eventos presenciais, híbridos ou online e vender ingressos por lotes, com um ingresso e um QR code por participante.',
        highlights: [
          'O banco nunca vende além do lote: um trigger reserva a vaga de forma atômica e recusa o ingresso quando o lote esgota.',
          'O banco guarda só o hash da senha e do token, o login não revela se o e-mail existe e o webhook de pagamento compara o segredo em tempo constante.',
        ],
        status: 'Em desenvolvimento: a API vem primeiro.',
      },
      {
        ...SHARED.projects.inProgress.miniReact,
        category: 'Estudo · Em andamento',
        description:
          'Um React escrito do zero, em JavaScript puro e sem dependências, para entender por dentro a ferramenta que uso todo dia.',
        highlights: [
          'Prontos: `createElement`, Virtual DOM, `render` e componentes de função.',
          'Próximos: estado, reconciliação, listas com `key`, efeitos e Fiber.',
        ],
        status: 'Etapa 4 de 10.',
      },
    ],
  },

  method: {
    title: 'Como eu resolvo problemas',
    subtitle: 'Um caso real, do problema à revisão: o motor de batalha do Rinha de Ratos.',
    stepLabel: (step: number) => `Passo ${step}`,
    steps: [
      {
        title: 'Entendo o problema e os limites',
        text: 'O jogo precisava de batalhas com ataques por rodada, poderes que dependem de sorte e atributos, e habilidades com efeitos próprios. Os limites: 38 dias, equipe de 4 e nenhum tempo para aprender WebSockets.',
      },
      {
        title: 'Escolho o caminho',
        text: 'Troquei a luta ao vivo por uma simulação completa no servidor: a batalha roda de uma vez, e a tela mostra o histórico rodada a rodada. Perdi o tempo real e ganhei um motor que cabia no prazo.',
      },
      {
        title: 'Construo',
        text: 'Organizei o back-end em camadas: controllers, services e repositories. O motor guarda vida e efeitos na memória e grava cada rodada no histórico. As habilidades são texto, como `+18%PASSEU`, lido por um parser.',
      },
      {
        title: 'Entrego e reviso',
        text: 'O jogo foi entregue com batalhas automáticas, ranking e relatórios em PDF. Revendo hoje, eu mudaria: senhas com hash, autenticação de verdade, middlewares de erro e de validação e camadas mais bem divididas. É o que já aplico no Controle de Gastos.',
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
      'Gosto de conversar sobre problemas difíceis, arquitetura e código. Se quiser trocar uma ideia, me chame.',
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
