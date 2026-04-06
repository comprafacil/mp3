import adapter from '@sveltejs/adapter-cloudflare';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';

/** @type {import('@sveltejs/kit').Config} */
const config = {
  preprocess: vitePreprocess(),
  kit: {
    adapter: adapter({
      routes: {
        include: ['/*'],
        exclude: ['_headers', '_redirects', 'robots.txt', 'favicon.ico']
      }
    }),
    alias: {
      '$lib': 'src/lib',
      '$components': 'src/components',
      '$lib/seo': 'src/lib/seo',
      '$lib/i18n': 'src/lib/i18n',
      '$lib/db': 'src/lib/db'
    }
  }
};

export default config;
