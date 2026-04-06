<script lang="ts">
  import type { ActionData, PageData } from './$types';

  let { data, form }: { data: PageData; form: ActionData } = $props();

  const types = [
    { value: 'article', label: 'Artículo' },
    { value: 'review', label: 'Review' },
    { value: 'tutorial', label: 'Tutorial' },
    { value: 'course', label: 'Curso' },
    { value: 'guide', label: 'Guía' },
    { value: 'faq', label: 'FAQ' }
  ];

  const intents = [
    { value: 'informational', label: 'Informacional' },
    { value: 'navigational', label: 'Navegacional' },
    { value: 'transactional', label: 'Transaccional' },
    { value: 'commercial', label: 'Comercial' }
  ];

  const musicianProfiles = [
    { value: '', label: 'General / Todos' },
    { value: 'beginner', label: 'Principiante' },
    { value: 'intermediate', label: 'Intermedio' },
    { value: 'advanced', label: 'Avanzado' },
    { value: 'professional', label: 'Profesional' },
    { value: 'producer', label: 'Productor' },
    { value: 'songwriter', label: 'Compositor' },
    { value: 'band', label: 'Banda' }
  ];

  const seasons = [
    { value: '', label: 'Evergreen (sin fecha)' },
    { value: 'black-friday', label: 'Black Friday (Noviembre)' },
    { value: 'christmas', label: 'Navidad (Diciembre)' },
    { value: 'new-year', label: 'Año Nuevo (Enero)' },
    { value: 'back-to-school', label: 'Vuelta al cole (Septiembre)' },
    { value: 'summer', label: 'Verano (Junio-Agosto)' },
    { value: 'festival-season', label: 'Temporada de Festivales (Summer)' },
    { value: ' releases', label: 'Lanzamientos (Otoño)' }
  ];
</script>

<svelte:head>
  <title>{data.meta.title}</title>
</svelte:head>

<div class="p-8 max-w-4xl mx-auto">
  <div class="mb-8">
    <a href="/admin/ai" class="text-primary-600 hover:text-primary-700 flex items-center gap-2 mb-4">
      ← Volver a IA Editorial
    </a>
    <h1 class="text-3xl font-bold text-gray-900">Generar Contenido con IA</h1>
    <p class="text-gray-600">Crea nuevo contenido optimizado para SEO usando Cloudflare Workers AI</p>
  </div>

  {#if form?.error}
    <div class="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-6">
      {form.error}
    </div>
  {/if}

  {#if form?.success}
    <div class="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded mb-6">
      <p class="font-medium">{form.message}</p>
      <div class="mt-4 p-4 bg-white rounded border">
        <h3 class="font-bold text-lg">{form.content.title}</h3>
        <p class="text-sm text-gray-600 mt-1">Slug: {form.content.slug}</p>
        <p class="text-sm text-gray-600 mt-1">SEO Title: {form.content.seoTitle}</p>
        <p class="mt-2 text-gray-700">{form.content.excerpt}</p>
        {#if form.content.confidence > 0}
          <p class="mt-2 text-sm text-gray-500">Confianza: {form.content.confidence}%</p>
        {/if}
        {#if form.content.warnings?.length}
          <div class="mt-2 text-yellow-600 text-sm">
            Warnings: {form.content.warnings.join(', ')}
          </div>
        {/if}
      </div>
    </div>
  {/if}

  <div class="bg-white rounded-lg shadow p-6">
    <form method="POST" class="space-y-6">
      <div>
        <label for="topic" class="block text-sm font-medium text-gray-700 mb-2">
          Tema / Título del contenido *
        </label>
        <input
          type="text"
          id="topic"
          name="topic"
          required
          value={form?.topic || ''}
          class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          placeholder="Ej: Las mejores guitarras eléctricas para principiantes 2025"
        />
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label for="lang" class="block text-sm font-medium text-gray-700 mb-2">
            Idioma *
          </label>
          <select
            id="lang"
            name="lang"
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          >
            <option value="es">Español</option>
            <option value="en">English</option>
            <option value="pt">Português</option>
          </select>
        </div>

        <div>
          <label for="type" class="block text-sm font-medium text-gray-700 mb-2">
            Tipo de contenido *
          </label>
          <select
            id="type"
            name="type"
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          >
            {#each types as t}
              <option value={t.value}>{t.label}</option>
            {/each}
          </select>
        </div>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label for="intent" class="block text-sm font-medium text-gray-700 mb-2">
            Intención de búsqueda
          </label>
          <select
            id="intent"
            name="intent"
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          >
            {#each intents as i}
              <option value={i.value}>{i.label}</option>
            {/each}
          </select>
        </div>

        <div>
          <label for="commercialIntent" class="block text-sm font-medium text-gray-700 mb-2">
            Intención comercial (0-10)
          </label>
          <input
            type="number"
            id="commercialIntent"
            name="commercialIntent"
            min="0"
            max="10"
            value="5"
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          />
          <p class="text-xs text-gray-500 mt-1">10 = alto potencial de monetización</p>
        </div>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label for="musicianProfile" class="block text-sm font-medium text-gray-700 mb-2">
            Perfil de músico objetivo
          </label>
          <select
            id="musicianProfile"
            name="musicianProfile"
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          >
            {#each musicianProfiles as p}
              <option value={p.value}>{p.label}</option>
            {/each}
          </select>
        </div>

        <div>
          <label for="seasonalRelevance" class="block text-sm font-medium text-gray-700 mb-2">
            Relevancia estacional
          </label>
          <select
            id="seasonalRelevance"
            name="seasonalRelevance"
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          >
            {#each seasons as s}
              <option value={s.value}>{s.label}</option>
            {/each}
          </select>
        </div>
      </div>

      <div class="border-t pt-6">
        <button
          type="submit"
          class="w-full bg-primary-600 text-white py-3 px-4 rounded-lg hover:bg-primary-700 font-medium flex items-center justify-center gap-2"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
          Generar Contenido con IA
        </button>
        <p class="text-xs text-gray-500 text-center mt-2">
          Usa Cloudflare Workers AI (Llama 3.1 8B) para generar el contenido
        </p>
      </div>
    </form>
  </div>

  <div class="mt-8 bg-blue-50 rounded-lg p-4">
    <h3 class="font-medium text-blue-900 mb-2">¿Cómo funciona?</h3>
    <ol class="list-decimal list-inside text-sm text-blue-800 space-y-1">
      <li>Ingresa un tema o título para el contenido</li>
      <li>Selecciona el idioma, tipo y perfil de público</li>
      <li>La IA analiza el tema y genera contenido optimizado para SEO</li>
      <li>El contenido se guarda como borrador para revisión</li>
      <li>Puedes editar y publicar desde el panel de contenido</li>
    </ol>
  </div>
</div>