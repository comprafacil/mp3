<script lang="ts">
  import type { PageData } from './$types';

  let { data }: { data: PageData } = $props();

  const priorityLabels: Record<number, string> = {
    1: 'Muy Baja', 2: 'Baja', 3: 'Media-Baja', 4: 'Media',
    5: 'Media-Alta', 6: 'Alta', 7: 'Muy Alta', 8: 'Urgente',
    9: 'Crítica', 10: 'Máxima'
  };

  const statusColors: Record<string, string> = {
    identified: 'bg-gray-100 text-gray-800',
    researching: 'bg-blue-100 text-blue-800',
    drafting: 'bg-yellow-100 text-yellow-800',
    review: 'bg-purple-100 text-purple-800',
    approved: 'bg-green-100 text-green-800',
    published: 'bg-green-600 text-white',
    rejected: 'bg-red-100 text-red-800'
  };
</script>

<svelte:head>
  <title>{data.meta.title}</title>
</svelte:head>

<div class="p-8">
  <div class="mb-8 flex items-center justify-between">
    <div>
      <h1 class="text-3xl font-bold text-gray-900">IA Editorial</h1>
      <p class="text-gray-600">Sistema de generación de contenido asistido por IA</p>
    </div>
    <a href="/admin/ai/generate" class="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700">
      Nueva Oportunidad
    </a>
  </div>

  <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
    <div class="bg-white rounded-lg shadow p-6">
      <div class="text-sm text-gray-500">Oportunidades Pendientes</div>
      <div class="text-3xl font-bold text-gray-900">{data.pendingCount}</div>
    </div>
    <div class="bg-white rounded-lg shadow p-6">
      <div class="text-sm text-gray-500">En Progreso</div>
      <div class="text-3xl font-bold text-blue-600">{data.inProgressCount}</div>
    </div>
    <div class="bg-white rounded-lg shadow p-6">
      <div class="text-sm text-gray-500">Total Mostrada</div>
      <div class="text-3xl font-bold text-gray-900">{data.opportunities.length}</div>
    </div>
  </div>

  <div class="bg-white rounded-lg shadow mb-6">
    <div class="p-4 border-b border-gray-200">
      <form method="get" class="flex gap-4">
        <select name="lang" class="px-3 py-2 border rounded-lg">
          <option value="">Todos los idiomas</option>
          <option value="es" selected={data.filters.lang === 'es'}>Español</option>
          <option value="en" selected={data.filters.lang === 'en'}>English</option>
          <option value="pt" selected={data.filters.lang === 'pt'}>Português</option>
        </select>
        <select name="status" class="px-3 py-2 border rounded-lg">
          <option value="">Todos los estados</option>
          <option value="identified" selected={data.filters.status === 'identified'}>Identificada</option>
          <option value="researching" selected={data.filters.status === 'researching'}>Investigando</option>
          <option value="drafting" selected={data.filters.status === 'drafting'}>Borrador</option>
          <option value="review" selected={data.filters.status === 'review'}>En Revisión</option>
          <option value="approved" selected={data.filters.status === 'approved'}>Aprobada</option>
          <option value="published" selected={data.filters.status === 'published'}>Publicada</option>
        </select>
        <button type="submit" class="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700">
          Filtrar
        </button>
      </form>
    </div>

    <div class="overflow-x-auto">
      <table class="w-full">
        <thead class="bg-gray-50">
          <tr>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Tema</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Fuente</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Prioridad</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Intención Comercial</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Estado</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Acciones</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-gray-200">
          {#each data.opportunities as opp}
            <tr>
              <td class="px-6 py-4">
                <div class="font-medium text-gray-900">{opp.topic}</div>
                <div class="text-sm text-gray-500">{opp.seasonal_relevance || 'Evergreen'} • {opp.musician_profile || 'General'}</div>
              </td>
              <td class="px-6 py-4">
                <span class="text-gray-500">{opp.source}</span>
              </td>
              <td class="px-6 py-4">
                <span class="font-medium text-gray-900">{priorityLabels[opp.priority]}</span>
              </td>
              <td class="px-6 py-4">
                <div class="w-full bg-gray-200 rounded-full h-2">
                  <div class="bg-primary-600 h-2 rounded-full" style="width: {opp.commercial_intent * 10}%"></div>
                </div>
                <span class="text-sm text-gray-500">{opp.commercial_intent}/10</span>
              </td>
              <td class="px-6 py-4">
                <span class="px-2 py-1 text-xs rounded-full {statusColors[opp.status] || 'bg-gray-100'}">
                  {opp.status}
                </span>
              </td>
              <td class="px-6 py-4">
                <button class="text-primary-600 hover:text-primary-700 mr-3">Editar</button>
                {#if opp.status === 'identified'}
                  <button class="text-blue-600 hover:text-blue-700">Investigarr</button>
                {/if}
              </td>
            </tr>
          {/each}
        </tbody>
      </table>
    </div>
  </div>
</div>
