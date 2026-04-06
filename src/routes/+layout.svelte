<script lang="ts">
  import '../app.css';
  import Header from '$components/Header.svelte';
  import Footer from '$components/Footer.svelte';
  import { translations, type Locale } from '$lib/i18n';
  import { page } from '$app/stores';

  let { children } = $props();

  function getLang(pathname: string): Locale {
    const pathLang = pathname.split('/')[1];
    if (['es', 'en', 'pt'].includes(pathLang)) {
      return pathLang as Locale;
    }
    return 'es';
  }

  const lang = $derived(getLang($page.url.pathname));
  const t = $derived(translations[lang]);
  
  const currentPath = $derived($page.url.pathname);
  const basePath = $derived(currentPath.replace(/^\/(es|en|pt)/, '') || '/');
</script>

<svelte:head>
  <meta name="google-site-verification" content="your-verification-code" />
  <link rel="alternate" hreflang="es" href="https://mp3-musica.com/es{basePath}" />
  <link rel="alternate" hreflang="en" href="https://mp3-musica.com/en{basePath}" />
  <link rel="alternate" hreflang="pt" href="https://mp3-musica.com/pt{basePath}" />
  <link rel="alternate" hreflang="x-default" href="https://mp3-musica.com/es{basePath}" />
</svelte:head>

<div class="min-h-screen flex flex-col">
  <Header {t} lang={lang} />

  <main class="flex-1">
    {@render children()}
  </main>

  <Footer {t} lang={lang} />
</div>
