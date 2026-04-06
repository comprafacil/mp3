<script lang="ts">
  import type { Locale } from '$lib/i18n';

  let { t, lang }: { t: any; lang: Locale } = $props();

  let email = $state('');
  let status = $state<'idle' | 'loading' | 'success' | 'error'>('idle');
  let errorMessage = $state('');

  const TURNSTILE_SITE_KEY = '0x4AAAAAAC1GBYPT9A_A4N4k';

  async function handleSubmit(event: Event) {
    event.preventDefault();
    status = 'loading';

    try {
      const response = await fetch(`/${lang}/api/subscribe`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      });

      const data = await response.json();

      if (data.success) {
        status = 'success';
        email = '';
      } else {
        status = 'error';
        errorMessage = data.error || t.newsletter.error;
      }
    } catch (e) {
      status = 'error';
      errorMessage = t.newsletter.error;
    }
  }
</script>

<section class="bg-gray-900 text-white py-16">
  <div class="container">
    <div class="max-w-2xl mx-auto text-center">
      <h2 class="text-3xl font-bold mb-4">{t.newsletter.title}</h2>
      <p class="text-gray-400 mb-8">{t.newsletter.description}</p>

      {#if status === 'success'}
        <div class="bg-green-900/50 border border-green-700 rounded-lg p-6">
          <svg class="w-12 h-12 text-green-500 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
          </svg>
          <p class="text-green-200">{t.newsletter.success}</p>
        </div>
      {:else}
        <form onsubmit={handleSubmit} class="flex flex-col sm:flex-row gap-4">
          <input
            type="email"
            bind:value={email}
            placeholder={t.newsletter.placeholder}
            required
            class="flex-1 px-6 py-3 rounded-lg bg-gray-800 border border-gray-700 text-white placeholder-gray-400 focus:outline-none focus:border-primary-500"
          />
          <button
            type="submit"
            disabled={status === 'loading'}
            class="px-8 py-3 bg-primary-600 hover:bg-primary-700 rounded-lg font-semibold transition-colors disabled:opacity-50"
          >
            {status === 'loading' ? '...' : t.newsletter.subscribe}
          </button>
        </form>

        {#if status === 'error'}
          <p class="text-red-400 mt-4">{errorMessage}</p>
        {/if}
      {/if}

      <p class="text-gray-500 text-sm mt-4">
        {lang === 'es' ? 'No spam, solo contenido de calidad.' : lang === 'en' ? 'No spam, just quality content.' : 'Sem spam, apenas conteúdo de qualidade.'}
      </p>
    </div>
  </div>
</section>
