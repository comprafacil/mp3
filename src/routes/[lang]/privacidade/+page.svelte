<script lang="ts">
  import type { PageData } from './$types';

  let { data }: { data: PageData } = $props();
</script>

<svelte:head>
  <title>{data.meta.title}</title>
  <meta name="description" content={data.meta.description} />
  <link rel="canonical" href="https://www.mp3-musica.com/{data.lang}/privacidade" />
  <link rel="alternate" hreflang="es" href="https://www.mp3-musica.com/es/privacidad" />
  <link rel="alternate" hreflang="en" href="https://www.mp3-musica.com/en/privacy" />
  <link rel="alternate" hreflang="pt" href="https://www.mp3-musica.com/pt/privacidade" />
</svelte:head>

<section class="py-12">
  <div class="container">
    <div class="max-w-3xl mx-auto">
      <h1 class="text-3xl font-bold mb-8">{data.page.title}</h1>
      <div class="prose max-w-none">
        {@html data.page.content}
      </div>
    </div>
  </div>
</section>
