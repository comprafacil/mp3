<script lang="ts">
  import type { PageData } from './$types';

  let { data }: { data: PageData } = $props();
</script>

<svelte:head>
  <title>{data.article.meta_title || data.article.title}</title>
  <meta name="description" content={data.article.meta_description || data.article.excerpt} />
  
  <!-- Open Graph -->
  <meta property="og:title" content={data.article.title} />
  <meta property="og:description" content={data.article.excerpt} />
  <meta property="og:type" content="article" />
  <meta property="og:url" content="https://mp3.com/{data.lang}/reviews/{data.article.slug}" />
  {#if data.article.og_image}
    <meta property="og:image" content={data.article.og_image} />
  {/if}
  
  <!-- Twitter Card -->
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content={data.article.title} />
  <meta name="twitter:description" content={data.article.excerpt} />
  {#if data.article.og_image}
    <meta name="twitter:image" content={data.article.og_image} />
  {/if}
  
  <!-- hreflang -->
  <link rel="alternate" hreflang="es" href="https://mp3.com/es/reviews/{data.article.slug}" />
  <link rel="alternate" hreflang="en" href="https://mp3.com/en/reviews/{data.article.slug}" />
  <link rel="alternate" hreflang="pt" href="https://mp3.com/pt/reviews/{data.article.slug}" />
  <link rel="alternate" hreflang="x-default" href="https://mp3.com/es/reviews/{data.article.slug}" />
  
  <!-- Canonical -->
  <link rel="canonical" href="https://mp3.com/{data.lang}/reviews/{data.article.slug}" />
</svelte:head>

<!-- Breadcrumb -->
<nav class="bg-gray-50 py-3">
  <div class="container">
    <ol class="flex items-center gap-2 text-sm text-gray-500">
      <li><a href="/{data.lang}/" class="hover:text-primary-600">{data.t.nav.home}</a></li>
      <li>/</li>
      <li><a href="/{data.lang}/reviews" class="hover:text-primary-600">{data.t.nav.reviews}</a></li>
      <li>/</li>
      <li class="text-gray-900">{data.article.title}</li>
    </ol>
  </div>
</nav>

<!-- Article -->
<article class="py-12">
  <div class="container">
    <div class="max-w-3xl mx-auto">
      <!-- Header -->
      <header class="mb-8">
        <h1 class="text-4xl font-bold text-gray-900 mb-4">{data.article.title}</h1>
        
        <div class="flex items-center gap-4 text-gray-500 text-sm mb-6">
          <span>{data.article.author_name}</span>
          <span>•</span>
          <time datetime={data.article.published_at}>
            {new Date(data.article.published_at).toLocaleDateString()}
          </time>
          <span>•</span>
          <span>{data.article.read_time} {data.t.article.readTime}</span>
        </div>

        {#if data.article.featured_image}
          <img 
            src={data.article.featured_image} 
            alt={data.article.title}
            class="w-full h-auto rounded-lg mb-8"
          />
        {/if}
      </header>

      <!-- Content -->
      <div class="prose max-w-none">
        {@html data.article.content}
      </div>

      <!-- Share -->
      <div class="mt-12 pt-8 border-t">
        <h3 class="font-semibold mb-4">{data.t.article.share}</h3>
        <div class="flex gap-4">
          <a 
            href="https://twitter.com/intent/tweet?text={encodeURIComponent(data.article.title)}&url={encodeURIComponent(`https://mp3.com/${data.lang}/reviews/${data.article.slug}`)}"
            target="_blank"
            rel="noopener"
            class="px-4 py-2 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
          >
            Twitter
          </a>
          <a 
            href="https://www.facebook.com/sharer/sharer.php?u={encodeURIComponent(`https://mp3.com/${data.lang}/reviews/${data.article.slug}`)}"
            target="_blank"
            rel="noopener"
            class="px-4 py-2 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
          >
            Facebook
          </a>
          <a 
            href="https://www.linkedin.com/sharing/share-offsite/?url={encodeURIComponent(`https://mp3.com/${data.lang}/reviews/${data.article.slug}`)}"
            target="_blank"
            rel="noopener"
            class="px-4 py-2 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
          >
            LinkedIn
          </a>
        </div>
      </div>

      <!-- Related Articles -->
      {#if data.relatedArticles.length > 0}
        <div class="mt-12">
          <h2 class="text-2xl font-bold mb-6">{data.t.article.related}</h2>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            {#each data.relatedArticles as related}
              <a href="/{data.lang}/reviews/{related.slug}" class="block p-4 border rounded-lg hover:shadow-md transition-shadow">
                <h3 class="font-semibold">{related.title}</h3>
                <p class="text-sm text-gray-500 mt-2">{related.excerpt}</p>
              </a>
            {/each}
          </div>
        </div>
      {/if}
    </div>
  </div>
</article>

<!-- SEO Schemas -->
{@html `<script type="application/ld+json">${data.schemas.article}</script>`}
{@html `<script type="application/ld+json">${data.schemas.breadcrumb}</script>`}
