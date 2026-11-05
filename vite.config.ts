import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';
import { prerender } from './config/prerender.ts';
import { seo } from './config/seo.ts';
import { readVercelHeadersForAllPaths, vercelInsights } from './config/vercel.ts';

export default defineConfig({
  plugins: [react(), seo(), vercelInsights(), prerender('src/prerender.tsx')],
  // O vite preview serve o build com os headers da Vercel, para uma CSP quebrada aparecer antes do deploy.
  preview: {
    headers: readVercelHeadersForAllPaths(),
  },
});
