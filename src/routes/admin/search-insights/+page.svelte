<script lang="ts">
  import type { PageData } from './$types';

  let { data }: { data: PageData } = $props();
</script>

<svelte:head>
  <title>{data.meta.title}</title>
</svelte:head>

<div class="p-8">
  <div class="mb-8">
    <h1 class="text-3xl font-bold text-gray-900">Análisis de Búsquedas</h1>
    <p class="text-gray-600">Inteligencia de búsquedas del sitio</p>
  </div>

  <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
    <div class="bg-white rounded-lg shadow p-6">
      <div class="text-sm text-gray-500">Total Búsquedas</div>
      <div class="text-3xl font-bold text-gray-900">{data.stats.total}</div>
    </div>
    <div class="bg-white rounded-lg shadow p-6">
      <div class="text-sm text-gray-500">Sin Resultados</div>
      <div class="text-3xl font-bold text-red-600">{data.stats.zeroResults}</div>
    </div>
    <div class="bg-white rounded-lg shadow p-6">
      <div class="text-sm text-gray-500">Queries Únicas</div>
      <div class="text-3xl font-bold text-gray-900">{data.stats.uniqueQueries}</div>
    </div>
  </div>

  <div class="bg-white rounded-lg shadow mb-6">
    <div class="p-4 border-b border-gray-200">
      <form method="get" class="flex gap-4 flex-wrap">
        <select name="days" class="px-3 py-2 border rounded-lg">
          <option value="7" selected={data.filters.days === 7}>Últimos 7 días</option>
          <option value="14" selected={data.filters.days === 14}>Últimos 14 días</option>
          <option value="30" selected={data.filters.days === 30}>Últimos 30 días</option>
        </select>
        <select name="lang" class="px-3 py-2 border rounded-lg">
          <option value="">Todos los idiomas</option>
          <option value="es" selected={data.filters.lang === 'es'}>Español</option>
          <option value="en" selected={data.filters.lang === 'en'}>English</option>
          <option value="pt" selected={data.filters.lang === 'pt'}>Português</option>
        </select>
        <label class="flex items-center gap-2">
          <input type="checkbox" name="zero" value="true" checked={data.filters.zeroResults} class="rounded" />
          Solo sin resultados
        </label>
        <button type="submit" class="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700">
          Filtrar
        </button>
      </form>
    </div>

    <div class="overflow-x-auto">
      <table class="w-full">
        <thead class="bg-gray-50">
          <tr>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Query</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Idioma</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Veces</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Últimos resultados</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Primera búsqueda</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-gray-200">
          {#each data.searches as search}
            <tr>
              <td class="px-6 py-4">
                <div class="font-medium text-gray-900">{search.normalized_query}</div>
              </td>
              <td class="px-6 py-4">
                <span class="uppercase text-gray-500">{search.lang}</span>
              </td>
              <td class="px-6 py-4">
                <span class="font-medium text-gray-900">{search.count}</span>
              </td>
              <td class="px-6 py-4">
                <span class="{search.last_results === 0 ? 'text-red-600 font-medium' : 'text-gray-900'}">
                  {search.last_results}
                </span>
              </td>
              <td class="px-6 py-4">
                <span class="text-gray-500 text-sm">{search.first_search}</span>
              </td>
            </tr>
          {/each}
        </tbody>
      </table>
    </div>
  </div>
</div>
