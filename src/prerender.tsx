import { StrictMode } from 'react';
import { renderToString } from 'react-dom/server';
import { App } from './app/App.tsx';
import type { Language } from './globals/constants.ts';

/**
 * Entrada de servidor, usada só no build (config/prerender.ts): gera o HTML da página num idioma,
 * que vai para dentro do #root. Sem esperar o JavaScript, quem lê, os robôs e a primeira pintura
 * já veem o conteúdo. Roda no Node, então nada aqui pode depender do navegador.
 */
export function renderPage(language: Language): string {
  return renderToString(
    <StrictMode>
      <App initialLanguage={language} />
    </StrictMode>,
  );
}
