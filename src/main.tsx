import { StrictMode } from 'react';
import { createRoot, hydrateRoot } from 'react-dom/client';
import { App } from './app/App.tsx';
import { AppError } from './errors/AppError.ts';
import { installGlobalErrorHandlers } from './errors/installGlobalErrorHandlers.ts';
import { rootErrorHandlers } from './errors/rootErrorHandlers.ts';
import { PRERENDERED_LANGUAGE, ROOT_ELEMENT_ID } from './globals/constants.ts';
import { readInitialLanguage } from './i18n/initialLanguage.ts';
import './theme/index.css';

installGlobalErrorHandlers();

const rootElement = document.getElementById(ROOT_ELEMENT_ID);
if (!rootElement) throw new AppError('ROOT_NOT_FOUND');

const language = readInitialLanguage();
const app = (
  <StrictMode>
    <App initialLanguage={language} />
  </StrictMode>
);

/*
 * O build deixa a página pronta no HTML, em PRERENDERED_LANGUAGE. Se a visita é nesse idioma, o
 * React só liga os eventos no que já está na tela. Em outro idioma (ou no dev, com o #root
 * vazio), ele desenha a página do zero no lugar do HTML gerado.
 */
if (rootElement.hasChildNodes() && language === PRERENDERED_LANGUAGE) {
  hydrateRoot(rootElement, app, rootErrorHandlers);
} else {
  createRoot(rootElement, rootErrorHandlers).render(app);
}
