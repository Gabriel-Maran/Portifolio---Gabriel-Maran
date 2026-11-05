import { readdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { basename, join, resolve } from 'node:path';
import { pathToFileURL } from 'node:url';
import { build, type Plugin, type ResolvedConfig } from 'vite';
import {
  DEFAULT_LANGUAGE,
  LANGUAGE_OPTIONS,
  LANGUAGES,
  ROOT_ELEMENT_ID,
  type Language,
} from '../src/globals/constants.ts';
import { messages } from '../src/globals/messages/index.ts';
import { pageUrl } from './seo.ts';
import { SITE_URL } from './site.ts';

/** O ponto de montagem vazio do index.html, onde o HTML gerado entra. */
export const ROOT_PLACEHOLDER = `<div id="${ROOT_ELEMENT_ID}"></div>`;

// Fica dentro do projeto para o build de servidor achar o react no node_modules.
const SERVER_OUT_DIR = 'node_modules/.tmp/prerender';

/**
 * Arquivo da página de cada idioma no build: o idioma da raiz sai no index.html, e o de "/en", no
 * "en.html". O cleanUrls do vercel.json, e o próprio vite preview, servem "/en" com o "en.html".
 */
export function pageFileName(language: Language): string {
  const { path } = LANGUAGE_OPTIONS[language];
  return path === '/' ? 'index.html' : `${path.slice(1)}.html`;
}

/** Põe o HTML da página dentro do ponto de montagem. Falha se ele não aparecer uma vez só. */
export function injectAppHtml(indexHtml: string, appHtml: string): string {
  const occurrences = indexHtml.split(ROOT_PLACEHOLDER).length - 1;
  if (occurrences !== 1) {
    throw new Error(`O index.html precisa ter ${ROOT_PLACEHOLDER} uma vez, e tem ${occurrences}.`);
  }
  // Com função, um "$&" no HTML gerado não vira padrão de substituição.
  return indexHtml.replace(ROOT_PLACEHOLDER, () => `<div id="${ROOT_ELEMENT_ID}">${appHtml}</div>`);
}

/** O que muda no <head> de um idioma para outro, incluindo a prévia de link (Open Graph). */
export interface PageHead {
  htmlLang: string;
  title: string;
  description: string;
  url: string;
  locale: string;
  localeAlternate: string;
  imageAlt: string;
}

export function pageHead(language: Language, siteUrl: string = SITE_URL): PageHead {
  const { meta } = messages[language];
  // Com dois idiomas, o alternativo é o outro.
  const alternate = LANGUAGES.find((candidate) => candidate !== language) ?? language;
  return {
    htmlLang: LANGUAGE_OPTIONS[language].tag,
    title: meta.title,
    description: meta.description,
    url: pageUrl(siteUrl, language),
    locale: LANGUAGE_OPTIONS[language].ogLocale,
    localeAlternate: LANGUAGE_OPTIONS[alternate].ogLocale,
    imageAlt: meta.imageAlt,
  };
}

const escapeAttribute = (value: string) =>
  value
    .replaceAll('&', '&amp;')
    .replaceAll('"', '&quot;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;');

/** Troca um trecho exato, conferindo quantas vezes ele aparece. Sem regex nem padrões de "$". */
function replaceExact(html: string, search: string, replacement: string, expected: number): string {
  const parts = html.split(search);
  if (parts.length - 1 !== expected) {
    throw new Error(`Esperava ${expected}× "${search}" no index.html, e há ${parts.length - 1}.`);
  }
  return parts.join(replacement);
}

/**
 * Passa o <head> do index.html de um idioma para outro: lang, título, descrição e as tags de
 * prévia de link. Falha se algum valor não estiver onde se espera, para o build não sair com
 * metade da página em outro idioma.
 */
export function localizeHead(html: string, from: PageHead, to: PageHead): string {
  const value = escapeAttribute;
  const steps: Array<[search: string, replacement: string, expected: number]> = [
    // Com o "<html", porque os links de hreflang="pt-BR" também contêm lang="pt-BR".
    [`<html lang="${from.htmlLang}"`, `<html lang="${to.htmlLang}"`, 1],
    [`<title>${value(from.title)}</title>`, `<title>${value(to.title)}</title>`, 1],
    // og:title
    [`content="${value(from.title)}"`, `content="${value(to.title)}"`, 1],
    // description e og:description
    [`content="${value(from.description)}"`, `content="${value(to.description)}"`, 2],
    [`content="${value(from.url)}"`, `content="${value(to.url)}"`, 1],
    [`content="${value(from.imageAlt)}"`, `content="${value(to.imageAlt)}"`, 1],
    [
      `property="og:locale" content="${from.locale}"`,
      `property="og:locale" content="${to.locale}"`,
      1,
    ],
    [
      `property="og:locale:alternate" content="${from.localeAlternate}"`,
      `property="og:locale:alternate" content="${to.localeAlternate}"`,
      1,
    ],
  ];
  return steps.reduce(
    (current, [search, replacement, expected]) =>
      replaceExact(current, search, replacement, expected),
    html,
  );
}

interface PrerenderModule {
  renderPage: (language: Language) => string;
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
 * Depois do build do navegador, faz um build de servidor da entrada e gera uma página por idioma
 * a partir do index.html: o HTML de cada idioma dentro do #root e o <head> traduzido. O navegador
 * então hidrata esse HTML em vez de montar a página do zero. Cada idioma tem o próprio caminho
 * (ver pageFileName), e nenhuma regra depende da query.
 */
export function prerender(entry: string, siteUrl: string = SITE_URL): Plugin {
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
        const outDir = resolve(config.root, config.build.outDir);
        // O modelo é lido antes do laço, porque a página do idioma padrão sobrescreve o index.html.
        const template = readFileSync(join(outDir, 'index.html'), 'utf8');
        const defaultHead = pageHead(DEFAULT_LANGUAGE, siteUrl);

        for (const language of LANGUAGES) {
          const page = injectAppHtml(template, serverModule.renderPage(language));
          const localized = localizeHead(page, defaultHead, pageHead(language, siteUrl));
          writeFileSync(join(outDir, pageFileName(language)), localized);
        }
      } finally {
        rmSync(serverOutDir, { recursive: true, force: true });
      }
    },
  };
}
