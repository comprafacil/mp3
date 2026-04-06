<script lang="ts">
  import type { PageData } from './$types';

  let { data }: { data: PageData } = $props();
</script>

<svelte:head>
  <title>Admin Dashboard | mp3-musica.com</title>
</svelte:head>

<div class="min-h-screen bg-gray-100">
  <header class="bg-white shadow">
    <div class="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
      <h1 class="text-2xl font-bold text-gray-900">Admin Dashboard - mp3-musica.com</h1>
      <a href="/{data.lang}/" class="text-primary-600 hover:text-primary-700">Ver sitio</a>
    </div>
  </header>

  <main class="max-w-7xl mx-auto px-4 py-8">
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      <!-- Stats Cards -->
      <div class="bg-white rounded-lg shadow p-6">
        <div class="text-3xl font-bold text-primary-600">{data.stats.totalArticles}</div>
        <div class="text-gray-500">Artículos</div>
      </div>
      <div class="bg-white rounded-lg shadow p-6">
        <div class="text-3xl font-bold text-green-600">{data.stats.publishedArticles}</div>
        <div class="text-gray-500">Publicados</div>
      </div>
      <div class="bg-white rounded-lg shadow p-6">
        <div class="text-3xl font-bold text-blue-600">{data.stats.totalSubscribers}</div>
        <div class="text-gray-500">Suscriptores</div>
      </div>
      <div class="bg-white rounded-lg shadow p-6">
        <div class="text-3xl font-bold text-purple-600">{data.stats.totalSilos}</div>
        <div class="text-gray-500">Categorías</div>
      </div>
    </div>

    <!-- Quick Actions -->
    <div class="bg-white rounded-lg shadow p-6 mb-8">
      <h2 class="text-xl font-semibold mb-4">Acciones Rápidas</h2>
      <div class="flex flex-wrap gap-4">
        <a href="/{data.lang}/admin/articulos/nuevo" class="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700">
          + Nuevo Artículo
        </a>
        <a href="/{data.lang}/admin/subscribers" class="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700">
          Ver Suscriptores
        </a>
        <a href="/{data.lang}/admin/analytics" class="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700">
          Analytics
        </a>
        <a href="/{data.lang}/admin/configuracion" class="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700">
          Configuración
        </a>
      </div>
    </div>

    <!-- Recent Articles -->
    <div class="bg-white rounded-lg shadow p-6">
      <h2 class="text-xl font-semibold mb-4">Últimos Artículos</h2>
      <div class="overflow-x-auto">
        <table class="min-w-full">
          <thead>
            <tr class="border-b">
              <th class="text-left py-3 px-4">Título</th>
              <th class="text-left py-3 px-4">Categoría</th>
              <th class="text-left py-3 px-4">Estado</th>
              <th class="text-left py-3 px-4">Fecha</th>
              <th class="text-left py-3 px-4">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {#each data.recentArticles as article}
              <tr class="border-b">
                <td class="py-3 px-4">{article.title}</td>
                <td class="py-3 px-4">{article.silo_slug}</td>
                <td class="py-3 px-4">
                  <span class="px-2 py-1 rounded text-xs {article.status === 'published' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}">
                    {article.status}
                  </span>
                </td>
                <td class="py-3 px-4">{article.published_at}</td>
                <td class="py-3 px-4">
                  <a href="/{data.lang}/admin/articulos/{article.id}" class="text-primary-600 hover:text-primary-700 mr-3">Editar</a>
                  <a href="/{data.lang}/{article.silo_slug}/{article.slug}" class="text-gray-600 hover:text-gray-700" target="_blank">Ver</a>
                </td>
              </tr>
            {/each}
          </tbody>
        </table>
      </div>
    </div>
  </main>
</div>
