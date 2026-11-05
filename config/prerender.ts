import { readdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { basename, join, resolve } from 'node:path';
import { pathToFileURL } from 'node:url';
import { build, type Plugin, type ResolvedConfig } from 'vite';
import { ROOT_ELEMENT_ID } from '../src/globals/constants.ts';

/** O ponto de montagem vazio do index.html, onde o HTML gerado entra. */
export const ROOT_PLACEHOLDER = `<div id="${ROOT_ELEMENT_ID}"></div>`;

// Fica dentro do projeto para o build de servidor achar o react no node_modules.
const SERVER_OUT_DIR = 'node_modules/.tmp/prerender';

/** Põe o HTML da página dentro do ponto de montagem. Falha se ele não aparecer uma vez só. */
export function injectAppHtml(indexHtml: string, appHtml: string): string {
  const occurrences = indexHtml.split(ROOT_PLACEHOLDER).length - 1;
  if (occurrences !== 1) {
    throw new Error(`O index.html precisa ter ${ROOT_PLACEHOLDER} uma vez, e tem ${occurrences}.`);
  }
  // Com função, um "$&" no HTML gerado não vira padrão de substituição.
  return indexHtml.replace(ROOT_PLACEHOLDER, () => `<div id="${ROOT_ELEMENT_ID}">${appHtml}</div>`);
}

interface PrerenderModule {
  renderPage: () => string;
}

const isPrerenderModule = (value: unknown): value is PrerenderModule =>
  typeof value === 'object' &&
  value !== null &&
  'renderPage' in value &&
  typeof value.renderPage === 'function';

/** Acha o arquivo gerado para a entrada, como "prerender.js" para "src/prerender.tsx". */
function findServerEntry(outDir: string, entry: string): string {
  const name = basename(entry).replace(/\.[jt]sx?$/, '');
  const file = readdirSync(outDir).find(
    (candidate) => candidate === `${name}.js` || candidate === `${name}.mjs`,
  );
  if (!file) throw new Error(`O build de servidor não gerou ${name}.js em ${outDir}.`);
  return join(outDir, file);
}

/**
 * Depois do build do navegador, faz um build de servidor da entrada, gera o HTML da página e o
 * põe no index.html. O navegador então hidrata esse HTML em vez de montar a página do zero.
 */
export function prerender(entry: string): Plugin {
  let config: ResolvedConfig | undefined;

  return {
    name: 'prerender',
    apply: 'build',
    configResolved(resolved) {
      config = resolved;
    },
    async closeBundle() {
      // O build de servidor disparado aqui também carrega este plugin; nele, não há o que fazer.
      if (!config || config.build.ssr) return;

      const serverOutDir = resolve(config.root, SERVER_OUT_DIR);
      await build({
        configFile: config.configFile,
        mode: config.mode,
        logLevel: 'warn',
        build: { ssr: entry, outDir: serverOutDir, emptyOutDir: true, copyPublicDir: false },
      });

      try {
        const serverModule: unknown = await import(
          pathToFileURL(findServerEntry(serverOutDir, entry)).href
        );
        if (!isPrerenderModule(serverModule)) {
          throw new Error(`${entry} precisa exportar a função renderPage.`);
        }
        const indexPath = resolve(config.root, config.build.outDir, 'index.html');
        const indexHtml = readFileSync(indexPath, 'utf8');
        writeFileSync(indexPath, injectAppHtml(indexHtml, serverModule.renderPage()));
      } finally {
        rmSync(serverOutDir, { recursive: true, force: true });
      }
    },
  };
}
