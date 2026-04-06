<script lang="ts">
  import type { ActionData, PageData } from './$types';
  import { page } from '$app/stores';

  let { data, form }: { data: PageData; form: ActionData } = $props();

  const oauthEnabled = $derived(data.settings?.oauth_google_enabled === 'true');
</script>

<svelte:head>
  <title>{data.meta.title}</title>
</svelte:head>

<div class="p-8">
  <div class="mb-8">
    <h1 class="text-3xl font-bold text-gray-900">Configuración</h1>
    <p class="text-gray-600">Configuración general del sitio</p>
  </div>

  {#if form?.success}
    <div class="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded mb-4">
      ✓ Configuración guardada correctamente
    </div>
  {/if}

  {#if form?.error}
    <div class="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
      {form.error}
    </div>
  {/if}

  <form method="POST">
    <div class="bg-white rounded-lg shadow mb-6">
      <div class="p-6 border-b border-gray-200">
        <h2 class="text-xl font-semibold text-gray-900">OAuth - Google</h2>
        <p class="text-sm text-gray-500 mt-1">Configura el login con Google</p>
      </div>

      <div class="p-6 space-y-4">
        <div class="flex items-center gap-3">
          <input
            type="checkbox"
            id="oauth_google_enabled"
            name="oauth_google_enabled"
            checked={oauthEnabled}
            class="w-4 h-4 text-primary-600 rounded border-gray-300 focus:ring-primary-500"
          />
          <label for="oauth_google_enabled" class="text-sm font-medium text-gray-700">
            Habilitar login con Google
          </label>
        </div>

        <div>
          <label for="oauth_google_client_id" class="block text-sm font-medium text-gray-700 mb-1">
            Client ID
          </label>
          <input
            type="text"
            id="oauth_google_client_id"
            name="oauth_google_client_id"
            value={data.settings?.oauth_google_client_id || ''}
            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
            placeholder="xxxxx.apps.googleusercontent.com"
          />
        </div>

        <div>
          <label for="oauth_google_client_secret" class="block text-sm font-medium text-gray-700 mb-1">
            Client Secret
          </label>
          <input
            type="password"
            id="oauth_google_client_secret"
            name="oauth_google_client_secret"
            value={data.settings?.oauth_google_client_secret || ''}
            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
            placeholder="••••••••••••••••"
          />
        </div>

        <div class="text-sm text-gray-500 bg-gray-50 p-3 rounded">
          <strong>Nota:</strong> El Client Secret debe configurarse en Cloudflare como secret:
          <code class="bg-gray-100 px-1 rounded">wrangler secret put GOOGLE_CLIENT_SECRET</code>
        </div>
      </div>
    </div>

    <div class="bg-white rounded-lg shadow mb-6">
      <div class="p-6 border-b border-gray-200">
        <h2 class="text-xl font-semibold text-gray-900">Información del Sitio</h2>
      </div>

      <div class="p-6 space-y-4">
        <div>
          <label for="site_title" class="block text-sm font-medium text-gray-700 mb-1">
            Título del sitio
          </label>
          <input
            type="text"
            id="site_title"
            name="site_title"
            value={data.settings?.site_title || 'mp3-musica.com'}
            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
          />
        </div>

        <div>
          <label for="site_description" class="block text-sm font-medium text-gray-700 mb-1">
            Descripción
          </label>
          <textarea
            id="site_description"
            name="site_description"
            rows="2"
            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
          >{data.settings?.site_description || ''}</textarea>
        </div>
      </div>
    </div>

    <div class="bg-white rounded-lg shadow mb-6">
      <div class="p-6 border-b border-gray-200">
        <h2 class="text-xl font-semibold text-gray-900">Google Analytics & Search Console</h2>
      </div>

      <div class="p-6 space-y-4">
        <div>
          <label for="google_analytics_id" class="block text-sm font-medium text-gray-700 mb-1">
            Measurement ID (GA4)
          </label>
          <input
            type="text"
            id="google_analytics_id"
            name="google_analytics_id"
            value={data.settings?.google_analytics_id || ''}
            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
            placeholder="G-XXXXXXXXXX"
          />
        </div>

        <div>
          <label for="google_site_verification" class="block text-sm font-medium text-gray-700 mb-1">
            Google Site Verification
          </label>
          <input
            type="text"
            id="google_site_verification"
            name="google_site_verification"
            value={data.settings?.google_site_verification || ''}
            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
            placeholder="xxxxx"
          />
        </div>
      </div>
    </div>

    <button
      type="submit"
      class="bg-primary-600 text-white px-6 py-2 rounded-lg hover:bg-primary-700 transition-colors font-medium"
    >
      Guardar Configuración
    </button>
  </form>
</div>
