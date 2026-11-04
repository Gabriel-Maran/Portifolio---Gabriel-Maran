// Mensagens internas, para o console. O que o visitante vê fica em messages/.
export const ERROR_MESSAGES = {
  ROOT_NOT_FOUND: 'Elemento raiz não encontrado no index.html.',
  RENDER_FAILED: 'Um componente falhou ao renderizar e o fallback foi exibido.',
  UNCAUGHT: 'Erro não tratado na página.',
  UNHANDLED_REJECTION: 'Promise rejeitada sem tratamento.',
  RECOVERABLE: 'O React se recuperou sozinho de um erro.',
  UNEXPECTED: 'Erro inesperado.',
} as const;

export type ErrorCode = keyof typeof ERROR_MESSAGES;
