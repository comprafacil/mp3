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

  const typeLabels: Record<string, string> = {
    article: 'Artículo',
    review: 'Review',
    tutorial: 'Tutorial',
    course: 'Curso',
    guide: 'Guía',
    faq: 'FAQ',
    landing: 'Landing'
  };
</script>

<svelte:head>
  <title>{data.meta.title}</title>
</svelte:head>

<div class="p-8">
  <div class="mb-8 flex items-center justify-between">
    <div>
      <h1 class="text-3xl font-bold text-gray-900">Contenido</h1>
      <p class="text-gray-600">Gestiona todo el contenido del sitio</p>
    </div>
    <a href="/admin/content/new" class="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700">
      Nuevo Contenido
    </a>
  </div>

  <div class="bg-white rounded-lg shadow mb-6">
    <div class="p-4 border-b border-gray-200">
      <form method="get" class="flex gap-4">
        <select name="status" class="px-3 py-2 border rounded-lg">
          <option value="">Todos los estados</option>
          <option value="draft" selected={data.filters.status === 'draft'}>Borrador</option>
          <option value="review" selected={data.filters.status === 'review'}>En revisión</option>
          <option value="approved" selected={data.filters.status === 'approved'}>Aprobado</option>
          <option value="published" selected={data.filters.status === 'published'}>Publicado</option>
          <option value="archived" selected={data.filters.status === 'archived'}>Archivado</option>
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

    <div class="overflow-x-auto">
      <table class="w-full">
        <thead class="bg-gray-50">
          <tr>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Título</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Tipo</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Estado</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Idioma</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Fecha</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Acciones</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-gray-200">
          {#each data.content as item}
            <tr>
              <td class="px-6 py-4">
                <div class="font-medium text-gray-900">{item.title}</div>
                <div class="text-sm text-gray-500">/{item.lang}/{item.slug}</div>
              </td>
              <td class="px-6 py-4">
                <span class="text-gray-900">{typeLabels[item.type] || item.type}</span>
              </td>
              <td class="px-6 py-4">
                <span class="px-2 py-1 text-xs rounded-full {statusColors[item.status] || 'bg-gray-100'}">
                  {item.status}
                </span>
              </td>
              <td class="px-6 py-4">
                <span class="text-gray-900 uppercase">{item.lang}</span>
              </td>
              <td class="px-6 py-4">
                <span class="text-gray-500 text-sm">{item.created_at}</span>
              </td>
              <td class="px-6 py-4">
                <a href="/{item.lang}/{item.slug}" target="_blank" class="text-primary-600 hover:text-primary-700 mr-3">
                  Ver
                </a>
                <a href="/admin/content/{item.id}" class="text-gray-600 hover:text-gray-700">
                  Editar
                </a>
              </td>
            </tr>
          {/each}
        </tbody>
      </table>
    </div>

    {#if data.totalPages > 1}
      <div class="p-4 border-t border-gray-200 flex gap-2">
        {#each Array(data.totalPages) as _, i}
          <a 
            href="/admin/content?page={i + 1}&status={data.filters.status}&lang={data.filters.lang}"
            class="px-3 py-1 rounded {data.page === i + 1 ? 'bg-primary-600 text-white' : 'bg-gray-100 hover:bg-gray-200'}"
          >
            {i + 1}
          </a>
        {/each}
      </div>
    {/if}
  </div>
</div>
