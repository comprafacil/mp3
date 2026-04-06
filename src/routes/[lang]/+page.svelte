<script lang="ts">
  import type { PageData } from './$types';
  import NewsletterCTA from '$components/NewsletterCTA.svelte';

  let { data }: { data: PageData } = $props();
</script>

<svelte:head>
  <title>{data.meta.title}</title>
  <meta name="description" content={data.meta.description} />
  <link rel="alternate" hreflang="es" href="https://mp3.com/es/" />
  <link rel="alternate" hreflang="en" href="https://mp3.com/en/" />
  <link rel="alternate" hreflang="pt" href="https://mp3.com/pt/" />
  <link rel="alternate" hreflang="x-default" href="https://mp3.com/es/" />
</svelte:head>

<!-- Hero Section -->
<section class="bg-gradient-to-br from-primary-50 to-white py-16 md:py-24">
  <div class="container">
    <div class="max-w-3xl mx-auto text-center">
      <h1 class="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
        {data.t.home.title}
      </h1>
      <p class="text-xl text-gray-600 mb-8">
        {data.t.home.subtitle}
      </p>
      <a
        href="/{data.lang}/reviews"
        class="inline-block bg-primary-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-primary-700 transition-colors"
      >
        {data.t.home.cta}
      </a>
    </div>
  </div>
</section>

<!-- Categories Section -->
<section class="py-16 bg-gray-50">
  <div class="container">
    <h2 class="text-2xl font-bold text-gray-900 mb-8 text-center">
      {data.lang === 'es' ? 'Explora nuestras categorías' : data.lang === 'en' ? 'Explore our categories' : 'Explore nossas categorias'}
    </h2>
    
    <div class="grid grid-cols-2 md:grid-cols-5 gap-4">
      {#each data.silos as silo}
        <a
          href="/{data.lang}/{silo.slug}"
          class="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow text-center"
        >
          <div class="text-3xl mb-2">
            {#if silo.slug === 'reviews'}⭐
            {:else if silo.slug === 'tutorials'}📚
            {:else if silo.slug === 'courses'}🎓
            {:else if silo.slug === 'gear'}🎸
            {:else if silo.slug === 'streaming'}🎵
            {/if}
          </div>
          <h3 class="font-semibold text-gray-900">
            {silo[`name_${data.lang}` as keyof typeof silo]}
          </h3>
        </a>
      {/each}
    </div>
  </div>
</section>

<!-- Latest Articles -->
{#if data.latestArticles.length > 0}
<section class="py-16">
  <div class="container">
    <h2 class="text-2xl font-bold text-gray-900 mb-8 text-center">
      {data.lang === 'es' ? 'Últimos artículos' : data.lang === 'en' ? 'Latest articles' : 'Últimos artigos'}
    </h2>
    
    <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
      {#each data.latestArticles as article}
        <article class="bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow">
          {#if article.featured_image}
            <img src={article.featured_image} alt={article.title} class="w-full h-48 object-cover" />
          {/if}
          <div class="p-6">
            <span class="text-sm text-primary-600 font-medium">
              {article.silo_slug}
            </span>
            <h3 class="text-lg font-semibold text-gray-900 mt-2 mb-2">
              <a href="/{data.lang}/{article.silo_slug}/{article.slug}" class="hover:text-primary-600">
                {article.title}
              </a>
            </h3>
            <p class="text-gray-600 text-sm mb-4">{article.excerpt}</p>
            <div class="flex items-center text-sm text-gray-500">
              <span>{article.read_time} {data.t.article.readTime}</span>
              <span class="mx-2">•</span>
              <span>{new Date(article.published_at).toLocaleDateString()}</span>
            </div>
          </div>
        </article>
      {/each}
    </div>
  </div>
</section>
{/if}

<!-- Newsletter -->
<NewsletterCTA {t} lang={data.lang} />

<!-- SEO Schemas -->
{@html `<script type="application/ld+json">${data.schemas.organization}</script>`}
{@html `<script type="application/ld+json">${data.schemas.website}</script>`}
