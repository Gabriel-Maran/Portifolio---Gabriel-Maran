import { readFileSync } from 'node:fs';
import type { HtmlTagDescriptor, Plugin } from 'vite';

// Só o que o build lê do vercel.json. Os testes conferem o resto do arquivo pelo objeto inteiro.
interface VercelConfig {
  headers?: Array<{ source: string; headers: Array<{ key: string; value: string }> }>;
}

const VERCEL_CONFIG = new URL('../vercel.json', import.meta.url);
const ALL_PATHS = '/(.*)';

// O vercel.json é validado pelo schema oficial da Vercel, então o formato é confiável aqui.
export const readVercelConfig = (): VercelConfig => JSON.parse(readFileSync(VERCEL_CONFIG, 'utf8'));

// Caminhos padrão da Vercel, os mesmos que @vercel/analytics e @vercel/speed-insights usam por dentro.
export const VERCEL_INSIGHTS_SCRIPTS = [
  '/_vercel/insights/script.js',
  '/_vercel/speed-insights/script.js',
] as const;

/** Headers que o vercel.json aplica a todas as rotas. O vite preview usa os mesmos. */
export function readVercelHeadersForAllPaths(): Record<string, string> {
  const { headers = [] } = readVercelConfig();
  const rule = headers.find(({ source }) => source === ALL_PATHS);
  return Object.fromEntries(rule?.headers.map(({ key, value }) => [key, value]) ?? []);
}

// A Vercel define VERCEL=1 nos builds dela. Fora dela, as rotas /_vercel não existem e os scripts dariam 404.
export function isVercelBuild(env: NodeJS.ProcessEnv): boolean {
  return env.VERCEL === '1';
}

/** Web Analytics e Speed Insights sem pacote: os scripts entram no HTML só no build da Vercel. */
export function vercelInsights(): Plugin {
  return {
    name: 'vercel-insights',
    apply: (_config, { command }) => command === 'build' && isVercelBuild(process.env),
    transformIndexHtml: () =>
      VERCEL_INSIGHTS_SCRIPTS.map((src): HtmlTagDescriptor => ({
        tag: 'script',
        attrs: { src, defer: true },
        injectTo: 'body',
      })),
  };
}
