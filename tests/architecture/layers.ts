import { readFileSync, readdirSync } from 'node:fs';
import { posix, resolve, sep } from 'node:path';

// De cima para baixo: um módulo só importa da própria camada ou das que vêm depois dela.
export const LAYERS = [
  'main',
  'app',
  'pages',
  'features',
  'cube',
  'components',
  'i18n',
  'errors',
  'utils',
  'globals',
  'theme',
] as const;

type Layer = (typeof LAYERS)[number];

// Em pages e features, cada pasta é uma fatia isolada: uma feature não importa outra.
const SLICED_LAYERS: ReadonlySet<Layer> = new Set(['pages', 'features']);

// Sem pacotes, utils e globals rodam no Node e servem a qualquer camada.
const PACKAGE_FREE_LAYERS: ReadonlySet<Layer> = new Set(['utils', 'globals']);

// As entradas ficam na raiz do src: a do navegador e a de servidor, que gera o HTML no build.
const ENTRY_FILES: ReadonlySet<string> = new Set(['main.tsx', 'prerender.tsx']);
const SOURCE_FILE = /\.tsx?$/;
const IMPORT_SPECIFIER = /(?:\bfrom\s*|\bimport\s*\(?\s*)['"]([^'"]+)['"]/g;

interface ModuleLocation {
  layer: Layer;
  slice: string | undefined;
}

/** Recebe um caminho relativo a src, com barras, como "features/hero/Hero.tsx". */
export function locate(path: string): ModuleLocation | undefined {
  if (ENTRY_FILES.has(path)) return { layer: 'main', slice: undefined };

  const [folder, slice] = path.split('/');
  const layer = LAYERS.find((candidate) => candidate !== 'main' && candidate === folder);
  if (!layer) return undefined;

  return { layer, slice: SLICED_LAYERS.has(layer) ? slice : undefined };
}

export function checkLocation(path: string): string | undefined {
  return locate(path) ? undefined : `${path} está fora das camadas: ${LAYERS.join(', ')}.`;
}

export function checkImport(from: string, to: string): string | undefined {
  const source = locate(from);
  const target = locate(to);
  if (!source) return checkLocation(from);
  if (!target) return `${from} importa ${to}, que está fora das camadas.`;

  if (source.layer === target.layer) {
    return source.slice === target.slice
      ? undefined
      : `${from} importa ${to}: as fatias de ${source.layer} não se importam entre si.`;
  }

  const importsDownward = LAYERS.indexOf(target.layer) > LAYERS.indexOf(source.layer);
  return importsDownward
    ? undefined
    : `${from} importa ${to}: ${source.layer} não pode depender de ${target.layer}.`;
}

export function checkPackageImport(from: string, specifier: string): string | undefined {
  const source = locate(from);
  return source && PACKAGE_FREE_LAYERS.has(source.layer)
    ? `${from} importa o pacote ${specifier}, mas ${source.layer} não depende de pacotes.`
    : undefined;
}

export function extractImports(code: string): string[] {
  return [...code.matchAll(IMPORT_SPECIFIER)].flatMap(([, specifier]) =>
    specifier ? [specifier] : [],
  );
}

function checkFile(srcDir: string, path: string): string[] {
  const code = readFileSync(resolve(srcDir, path), 'utf8');
  const importViolations = extractImports(code).map((specifier) =>
    specifier.startsWith('.')
      ? checkImport(path, posix.join(posix.dirname(path), specifier))
      : checkPackageImport(path, specifier),
  );
  return [checkLocation(path), ...importViolations].filter((violation) => violation !== undefined);
}

export function findViolations(srcDir: string): string[] {
  return readdirSync(srcDir, { recursive: true, encoding: 'utf8' })
    .map((path) => path.split(sep).join('/'))
    .filter((path) => SOURCE_FILE.test(path))
    .flatMap((path) => checkFile(srcDir, path));
}
