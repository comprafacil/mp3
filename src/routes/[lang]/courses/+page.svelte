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
    <div class="max-w-3xl mx-auto">
      <h1 class="text-3xl font-bold mb-4">{data.silo[`name_${data.lang}` as keyof typeof data.silo]}</h1>
      <p class="text-gray-600 mb-8">{data.silo[`description_${data.lang}` as keyof typeof data.silo]}</p>

      {#if data.articles.length > 0}
        <div class="space-y-6">
          {#each data.articles as article}
            <article class="border rounded-lg p-6 hover:shadow-md transition-shadow">
              <a href="/{data.lang}/courses/{article.slug}">
                <h2 class="text-xl font-semibold mb-2">{article.title}</h2>
                <p class="text-gray-600 mb-4">{article.excerpt}</p>
                <div class="flex items-center gap-4 text-sm text-gray-500">
                  <span>{article.read_time} {data.t.article.readTime}</span>
                  <span>•</span>
                  <time>{new Date(article.published_at).toLocaleDateString()}</time>
                </div>
              </a>
            </article>
          {/each}
        </div>
      {:else}
        <p class="text-gray-500">
          {data.lang === 'es' ? 'No hay cursos disponibles aún.' : data.lang === 'en' ? 'No courses available yet.' : 'Nenhum curso disponível ainda.'}
        </p>
      {/if}
    </div>
  </div>
</section>
