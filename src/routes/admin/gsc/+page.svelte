<script lang="ts">
  import type { PageData } from './$types';

  let { data }: { data: PageData } = $props();
</script>

<svelte:head>
  <title>{data.meta.title}</title>
</svelte:head>

<div class="p-8">
  <div class="mb-8">
    <h1 class="text-3xl font-bold text-gray-900">Google Search Console</h1>
    <p class="text-gray-600">Análisis de rendimiento orgánico</p>
  </div>

  <div class="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
    <div class="bg-white rounded-lg shadow p-6">
      <div class="text-sm text-gray-500">Clicks</div>
      <div class="text-3xl font-bold text-gray-900">{data.stats.totalClicks.toLocaleString()}</div>
    </div>
    <div class="bg-white rounded-lg shadow p-6">
      <div class="text-sm text-gray-500">Impresiones</div>
      <div class="text-3xl font-bold text-gray-900">{data.stats.totalImpressions.toLocaleString()}</div>
    </div>
    <div class="bg-white rounded-lg shadow p-6">
      <div class="text-sm text-gray-500">CTR Promedio</div>
      <div class="text-3xl font-bold text-gray-900">{(data.stats.avgCTR * 100).toFixed(2)}%</div>
    </div>
    <div class="bg-white rounded-lg shadow p-6">
      <div class="text-sm text-gray-500">Posición Promedio</div>
      <div class="text-3xl font-bold text-gray-900">{data.stats.avgPosition.toFixed(1)}</div>
    </div>
  </div>

  <div class="bg-white rounded-lg shadow mb-6">
    <div class="p-4 border-b border-gray-200">
      <form method="get" class="flex gap-4">
        <select name="days" class="px-3 py-2 border rounded-lg">
          <option value="28" selected={data.filters.days === 28}>Últimos 28 días</option>
          <option value="7" selected={data.filters.days === 7}>Últimos 7 días</option>
          <option value="90" selected={data.filters.days === 90}>Últimos 90 días</option>
        </select>
        <select name="lang" class="px-3 py-2 border rounded-lg">
          <option value="">Todos los idiomas</option>
          <option value="es" selected={data.filters.lang === 'es'}>Español</option>
          <option value="en" selected={data.filters.lang === 'en'}>English</option>
          <option value="pt" selected={data.filters.lang === 'pt'}>Português</option>
        </select>
        <button type="submit" class="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700">
          Filtrar
        </button>
      </form>
    </div>
  </div>

  <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
    <div class="bg-white rounded-lg shadow p-6">
      <h2 class="text-xl font-semibold text-gray-900 mb-4">Top Queries</h2>
      <div class="overflow-x-auto">
        <table class="w-full">
          <thead class="bg-gray-50">
            <tr>
              <th class="px-4 py-2 text-left text-xs font-medium text-gray-500">Query</th>
              <th class="px-4 py-2 text-left text-xs font-medium text-gray-500">Clicks</th>
              <th class="px-4 py-2 text-left text-xs font-medium text-gray-500">Impresiones</th>
              <th class="px-4 py-2 text-left text-xs font-medium text-gray-500">CTR</th>
              <th class="px-4 py-2 text-left text-xs font-medium text-gray-500">Posición</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-200">
            {#each data.queries as q}
              <tr>
                <td class="px-4 py-2 text-gray-900">{q.query}</td>
                <td class="px-4 py-2 text-gray-900">{q.clicks}</td>
                <td class="px-4 py-2 text-gray-500">{q.impressions}</td>
                <td class="px-4 py-2 text-gray-900">{(q.ctr * 100).toFixed(1)}%</td>
                <td class="px-4 py-2 text-gray-900">{q.position.toFixed(1)}</td>
              </tr>
            {/each}
          </tbody>
        </table>
      </div>
    </div>

    <div class="bg-white rounded-lg shadow p-6">
      <h2 class="text-xl font-semibold text-gray-900 mb-4">Top Páginas</h2>
      <div class="overflow-x-auto">
        <table class="w-full">
          <thead class="bg-gray-50">
            <tr>
              <th class="px-4 py-2 text-left text-xs font-medium text-gray-500">Página</th>
              <th class="px-4 py-2 text-left text-xs font-medium text-gray-500">Clicks</th>
              <th class="px-4 py-2 text-left text-xs font-medium text-gray-500">Posición</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-200">
            {#each data.pages as p}
              <tr>
                <td class="px-4 py-2 text-gray-900 text-sm truncate max-w-xs">{p.page}</td>
                <td class="px-4 py-2 text-gray-900">{p.clicks}</td>
                <td class="px-4 py-2 text-gray-900">{p.position.toFixed(1)}</td>
              </tr>
            {/each}
          </tbody>
        </table>
      </div>
    </div>
  </div>
</div>
