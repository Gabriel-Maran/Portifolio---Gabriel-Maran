import { cleanup } from '@testing-library/react';
import { afterEach } from 'vitest';

// Cada teste de componente começa com a página limpa: nada montado, nada salvo e na URL raiz.
afterEach(() => {
  cleanup();
  window.localStorage.clear();
  window.history.replaceState(null, '', '/');
  document.documentElement.lang = '';
  document.title = '';
  document.head.replaceChildren();
});
