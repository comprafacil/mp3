<script lang="ts">
  import type { PageData } from './$types';

  let { data }: { data: PageData } = $props();
</script>

<svelte:head>
  <title>{data.meta.title}</title>
  <meta name="description" content={data.meta.description} />
</svelte:head>

<section class="py-12">
  <div class="container">
    <h1 class="text-3xl font-bold mb-8">
      {data.lang === 'es' ? 'Resultados de búsqueda' : data.lang === 'en' ? 'Search results' : 'Resultados da busca'}: {data.query}
    </h1>
    
    {#if data.results.length > 0}
      <div class="space-y-6">
        {#each data.results as article}
          <article class="border rounded-lg p-6 hover:shadow-md transition-shadow">
            <a href="/{data.lang}/{article.silo_slug}/{article.slug}">
              <h2 class="text-xl font-semibold mb-2">{article.title}</h2>
              <p class="text-gray-600 mb-4">{article.excerpt}</p>
              <div class="flex items-center gap-4 text-sm text-gray-500">
                <span>{article.read_time} {data.t.article.readTime}</span>
              </div>
            </a>
          </article>
        {/each}
      </div>
    {:else}
      <p class="text-gray-500">
        {data.t.search.noResults}
      </p>
    {/if}
  </div>
</section>
