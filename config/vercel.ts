import { readFileSync } from 'node:fs';
import type { HtmlTagDescriptor, Plugin } from 'vite';

interface VercelCondition {
  type: 'header' | 'cookie' | 'host' | 'query';
  key: string;
  value?: string;
}

export interface VercelRewrite {
  source: string;
  destination: string;
  has?: VercelCondition[];
}

interface VercelConfig {
  headers?: Array<{ source: string; headers: Array<{ key: string; value: string }> }>;
  rewrites?: VercelRewrite[];
}

const VERCEL_CONFIG = new URL('../vercel.json', import.meta.url);
const ALL_PATHS = '/(.*)';

// O vercel.json é validado pelo schema oficial da Vercel, então o formato é confiável aqui.
const readVercelConfig = (): VercelConfig => JSON.parse(readFileSync(VERCEL_CONFIG, 'utf8'));

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

export const readVercelRewrites = (): VercelRewrite[] => readVercelConfig().rewrites ?? [];

/**
 * Destino da primeira reescrita que serve para o caminho e a query, como a Vercel faz. Cobre só o
 * que o site usa: caminho exato e condições de query. Outros tipos de condição nunca casam aqui.
 */
export function resolveRewrite(
  rewrites: readonly VercelRewrite[],
  pathname: string,
  search: string,
): string | undefined {
  const params = new URLSearchParams(search);
  const matches = (condition: VercelCondition) =>
    condition.type === 'query' &&
    (condition.value === undefined
      ? params.has(condition.key)
      : params.get(condition.key) === condition.value);

  return rewrites.find(
    (rewrite) => rewrite.source === pathname && (rewrite.has ?? []).every(matches),
  )?.destination;
}

/** O vite preview segue as mesmas reescritas do vercel.json, para o build local servir igual. */
export function vercelRewritesInPreview(): Plugin {
  return {
    name: 'vercel-rewrites-preview',
    configurePreviewServer(server) {
      const rewrites = readVercelRewrites();
      server.middlewares.use((request, _response, next) => {
        const url = new URL(request.url ?? '/', 'http://localhost');
        const destination = resolveRewrite(rewrites, url.pathname, url.search);
        if (destination) request.url = `${destination}${url.search}`;
        next();
      });
    },
  };
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
