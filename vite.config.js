// vite.config.js
import { defineConfig } from 'vite';

export default defineConfig(({ mode }) => ({
  base: mode === 'production' ? '/word-search/' : '/', // Nur für Build!
}));

