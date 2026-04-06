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
</script>

<svelte:head>
  <meta name="google-site-verification" content="your-verification-code" />
</svelte:head>

<div class="min-h-screen flex flex-col">
  <Header {t} lang={lang} />

  <main class="flex-1">
    {@render children()}
  </main>

  <Footer {t} lang={lang} />
</div>
