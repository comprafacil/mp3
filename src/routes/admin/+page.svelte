<script lang="ts">
  import type { PageData } from './$types';

  let { data }: { data: PageData } = $props();

  const statusColors: Record<string, string> = {
    draft: 'bg-gray-100 text-gray-800',
    review: 'bg-yellow-100 text-yellow-800',
    approved: 'bg-blue-100 text-blue-800',
    published: 'bg-green-100 text-green-800',
    archived: 'bg-red-100 text-red-800'
  };

  const priorityLabels: Record<number, string> = {
    1: 'Muy Baja',
    2: 'Baja',
    3: 'BajaMedia',
    4: 'Media',
    5: 'MediaAlta',
    6: 'Alta',
    7: 'Muy Alta',
    8: 'Urgente',
    9: 'Critica',
    10: 'Maxima'
  };
</script>

<svelte:head>
  <title>{data.meta.title}</title>
</svelte:head>

<div class="p-8">
  <div class="mb-8">
    <h1 class="text-3xl font-bold text-gray-900">Dashboard</h1>
    <p class="text-gray-600">Panel de administración de mp3-musica.com</p>
  </div>

  <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
    <div class="bg-white rounded-lg shadow p-6">
      <div class="text-sm text-gray-500">Total Contenido</div>
      <div class="text-3xl font-bold text-gray-900">{data.stats.totalContent}</div>
      <div class="text-sm text-green-600">{data.stats.publishedContent} publicado</div>
    </div>

    <div class="bg-white rounded-lg shadow p-6">
      <div class="text-sm text-gray-500">Suscriptores</div>
      <div class="text-3xl font-bold text-gray-900">{data.stats.totalSubscribers}</div>
    </div>

    <div class="bg-white rounded-lg shadow p-6">
      <div class="text-sm text-gray-500">Búsquedas Hoy</div>
      <div class="text-3xl font-bold text-gray-900">{data.stats.searchQueriesToday}</div>
      <div class="text-sm text-red-600">{data.stats.zeroResultSearches} sin resultados</div>
    </div>

    <div class="bg-white rounded-lg shadow p-6">
      <div class="text-sm text-gray-500">Categorías</div>
      <div class="text-3xl font-bold text-gray-900">{data.stats.totalCategories}</div>
    </div>
  </div>

  <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
    <div class="bg-white rounded-lg shadow p-6">
      <h2 class="text-xl font-semibold text-gray-900 mb-4">Contenido Reciente</h2>
      {#if data.recentContent.length > 0}
        <div class="space-y-3">
          {#each data.recentContent as item}
            <div class="flex items-center justify-between py-2 border-b border-gray-100 last:border-0">
              <div>
                <div class="font-medium text-gray-900">{item.title}</div>
                <div class="text-sm text-gray-500">{item.lang} • {item.type}</div>
              </div>
              <span class="px-2 py-1 text-xs rounded-full {statusColors[item.status] || 'bg-gray-100'}">
                {item.status}
              </span>
            </div>
          {/each}
        </div>
      {:else}
        <p class="text-gray-500">No hay contenido reciente</p>
      {/if}
    </div>

    <div class="bg-white rounded-lg shadow p-6">
      <h2 class="text-xl font-semibold text-gray-900 mb-4">Oportunidades Editoriales</h2>
      {#if data.opportunities.length > 0}
        <div class="space-y-3">
          {#each data.opportunities as opp}
            <div class="flex items-center justify-between py-2 border-b border-gray-100 last:border-0">
              <div>
                <div class="font-medium text-gray-900">{opp.topic}</div>
                <div class="text-sm text-gray-500">{opp.lang} • {opp.source}</div>
              </div>
              <div class="text-right">
                <div class="text-sm font-medium text-gray-900">Prio: {priorityLabels[opp.priority]}</div>
                <div class="text-sm text-gray-500">Comercial: {opp.commercial_intent}/10</div>
              </div>
            </div>
          {/each}
        </div>
      {:else}
        <p class="text-gray-500">No hay oportunidades identificadas</p>
      {/if}
    </div>
  </div>

  <div class="mt-6 bg-white rounded-lg shadow p-6">
    <h2 class="text-xl font-semibold text-gray-900 mb-4">Top Búsquedas (7 días)</h2>
    {#if data.topSearches.length > 0}
      <div class="space-y-2">
        {#each data.topSearches as search}
          <div class="flex items-center justify-between py-2 border-b border-gray-100 last:border-0">
            <span class="text-gray-900">{search.normalized_query}</span>
            <div class="flex items-center gap-4">
              <span class="text-sm text-gray-500">{search.count} búsquedas</span>
              <span class="text-sm text-gray-500">{search.last_results} resultados</span>
            </div>
          </div>
        {/each}
      </div>
    {:else}
      <p class="text-gray-500">No hay búsquedas registradas</p>
    {/if}
  </div>

  <div class="mt-6 flex gap-4">
    <a href="/admin/content" class="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700">
      Gestionar Contenido
    </a>
    <a href="/admin/search-insights" class="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700">
      Análisis de Búsquedas
    </a>
    <a href="/admin/gsc" class="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700">
      Google Search Console
    </a>
    <a href="/admin/ai" class="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700">
      IA Editorial
    </a>
  </div>
</div>
