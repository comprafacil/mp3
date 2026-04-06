<script lang="ts">
  import type { ActionData, PageData } from './$types';

  let { form }: { form: ActionData } = $props();
  let jsonInput = $state('');
  let submitting = $state(false);
</script>

<svelte:head>
  <title>Importar GSC | Admin</title>
</svelte:head>

<div class="p-8">
  <div class="mb-8">
    <h1 class="text-3xl font-bold text-gray-900">Importar Datos GSC</h1>
    <p class="text-gray-600">Importar datos desde Google Search Console (export CSV/JSON)</p>
  </div>

  <div class="mb-6">
    <a href="/admin/gsc" class="text-primary-600 hover:text-primary-700">← Volver a GSC</a>
  </div>

  {#if form?.success}
    <div class="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded mb-4">
      ✓ Importados {form.count} registros correctamente
    </div>
  {/if}

  {#if form?.error}
    <div class="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
      {form.error}
    </div>
  {/if}

  <div class="bg-white rounded-lg shadow p-6">
    <h2 class="text-xl font-semibold text-gray-900 mb-4">Formato esperado</h2>
    
    <div class="bg-gray-50 p-4 rounded mb-4 text-sm font-mono">
      <pre>{`[{
  "query": "guitarra electrica",
  "page": "/es/reviews",
  "clicks": 150,
  "impressions": 5000,
  "ctr": 0.03,
  "position": 4.5,
  "country": "MX",
  "device": "DESKTOP"
}]`}</pre>
    </div>

    <form method="POST" enctype="multipart/form-data">
      <div class="mb-4">
        <label for="data" class="block text-sm font-medium text-gray-700 mb-1">
          Datos JSON
        </label>
        <textarea
          id="data"
          name="data"
          bind:value={jsonInput}
          rows="12"
          class="w-full px-3 py-2 border border-gray-300 rounded-lg font-mono text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
          placeholder={"[{'query': '...', 'page': '...', 'clicks': 0, 'impressions': 0, 'ctr': 0, 'position': 0}]"}
        ></textarea>
      </div>

      <button
        type="submit"
        disabled={submitting || !jsonInput}
        class="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {submitting ? 'Importando...' : 'Importar Datos'}
      </button>
    </form>
  </div>

  <div class="mt-6 bg-white rounded-lg shadow p-6">
    <h2 class="text-xl font-semibold text-gray-900 mb-4">Notas</h2>
    <ul class="list-disc list-inside text-gray-600 space-y-2">
      <li>Los datos deben ser un array JSON válido</li>
      <li>Idioma por defecto: español (es) - cambiar manualmente si es necesario</li>
      <li> CTR y position deben ser valores decimales (ej: 0.05 para 5%)</li>
      <li>Para importar en otros idiomas, modifica el código del endpoint</li>
    </ul>
  </div>
</div>
