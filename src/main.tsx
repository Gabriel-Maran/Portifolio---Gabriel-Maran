import { StrictMode } from 'react';
import { createRoot, hydrateRoot } from 'react-dom/client';
import { App } from './app/App.tsx';
import { AppError } from './errors/AppError.ts';
import { installGlobalErrorHandlers } from './errors/installGlobalErrorHandlers.ts';
import { rootErrorHandlers } from './errors/rootErrorHandlers.ts';
import { ROOT_ELEMENT_ID } from './globals/constants.ts';
import { readInitialLanguage } from './i18n/initialLanguage.ts';
import { parseLanguage } from './utils/language.ts';
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
 * O build deixa a página pronta no HTML, um arquivo por idioma, e o lang do <html> diz qual é.
 * Se a visita é nesse idioma, o React só liga os eventos no que já está na tela. Se não (como o
 * inglês salvo de uma visita anterior, abrindo a página em português) ou no dev, com o #root
 * vazio, ele desenha a página do zero no lugar do HTML gerado.
 */
const htmlLanguage = parseLanguage(document.documentElement.lang);
if (rootElement.hasChildNodes() && language === htmlLanguage) {
  hydrateRoot(rootElement, app, rootErrorHandlers);
} else {
  createRoot(rootElement, rootErrorHandlers).render(app);
}
