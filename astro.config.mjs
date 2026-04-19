import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://blog.schaermu.ch',
  output: 'static',
  integrations: [sitemap()],
  vite: {
    plugins: [tailwindcss()],
  },
  image: {
    remotePatterns: [
      {
        hostname: 'storage.schaermu.ch',
        protocol: 'https',
      },
    ],
    service: {
      entrypoint: 'astro/assets/services/noop',
    },
  },
});
