export const pt = {
  home: {
    placeholder: 'Parte 1 · base do projeto',
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
