import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';
import { seo } from './config/seo.ts';
import { readVercelHeadersForAllPaths, vercelInsights } from './config/vercel.ts';

export default defineConfig({
  plugins: [react(), seo(), vercelInsights()],
  // O vite preview serve o build com os headers da Vercel, para uma CSP quebrada aparecer antes do deploy.
  preview: {
    headers: readVercelHeadersForAllPaths(),
  },
});
