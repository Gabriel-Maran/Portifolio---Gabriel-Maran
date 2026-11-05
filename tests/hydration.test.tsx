import { act, StrictMode } from 'react';
import { hydrateRoot } from 'react-dom/client';
import { expect, test, vi } from 'vitest';
import { App } from '../src/app/App.tsx';
import { PRERENDERED_LANGUAGE } from '../src/globals/constants.ts';
import { renderPage } from '../src/prerender.tsx';

/*
 * O navegador hidrata o HTML gerado no build. Se a primeira renderização do cliente diferir do
 * HTML, o React avisa por onRecoverableError e desenha tudo de novo: este teste barra isso.
 */
test('o HTML gerado no build hidrata sem nenhuma diferença', async () => {
  const container = document.createElement('div');
  // Faz o papel do navegador recebendo o index.html: o HTML é o que o próprio React gerou.
  container.innerHTML = renderPage();
  document.body.append(container);
  const onRecoverableError = vi.fn();
  const consoleError = vi.spyOn(console, 'error');

  let root: ReturnType<typeof hydrateRoot> | undefined;
  await act(async () => {
    root = hydrateRoot(
      container,
      <StrictMode>
        <App initialLanguage={PRERENDERED_LANGUAGE} />
      </StrictMode>,
      { onRecoverableError },
    );
  });

  expect(onRecoverableError).not.toHaveBeenCalled();
  expect(consoleError).not.toHaveBeenCalled();

  act(() => root?.unmount());
  container.remove();
});
