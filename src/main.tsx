import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { App } from './app/App.tsx';
import { AppError } from './errors/AppError.ts';
import { installGlobalErrorHandlers } from './errors/installGlobalErrorHandlers.ts';
import { rootErrorHandlers } from './errors/rootErrorHandlers.ts';
import { ROOT_ELEMENT_ID } from './globals/constants.ts';
import './theme/index.css';

installGlobalErrorHandlers();

const rootElement = document.getElementById(ROOT_ELEMENT_ID);
if (!rootElement) throw new AppError('ROOT_NOT_FOUND');

createRoot(rootElement, rootErrorHandlers).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
