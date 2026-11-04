import { readFileSync } from 'node:fs';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

interface VercelConfig {
  headers?: Array<{ source: string; headers: Array<{ key: string; value: string }> }>;
}

const VERCEL_CONFIG = new URL('./vercel.json', import.meta.url);
const ALL_PATHS = '/(.*)';

// O vite preview serve o build com os mesmos headers da Vercel, para uma CSP quebrada aparecer antes do deploy.
function readVercelHeadersForAllPaths(): Record<string, string> {
  // O vercel.json é validado pelo schema oficial da Vercel, então o formato é confiável aqui.
  const { headers = [] }: VercelConfig = JSON.parse(readFileSync(VERCEL_CONFIG, 'utf8'));
  const rule = headers.find(({ source }) => source === ALL_PATHS);
  return Object.fromEntries(rule?.headers.map(({ key, value }) => [key, value]) ?? []);
}

export default defineConfig({
  plugins: [react()],
  preview: {
    headers: readVercelHeadersForAllPaths(),
  },
});
