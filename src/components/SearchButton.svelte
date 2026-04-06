<script lang="ts">
  import { translations, type Locale } from '$lib/i18n';

  let { t, lang }: { t: any; lang: Locale } = $props();
  
  let searchQuery = $state('');
  let isOpen = $state(false);
  let suggestions = $state<Array<{title: string, slug: string, silo: string}>>([]);
  let loading = $state(false);
  
  const TURNSTILE_SITE_KEY = '0x4AAAAAAC1GBYPT9A_A4N4k';
  
  async function search(query: string) {
    if (query.length < 2) {
      suggestions = [];
      return;
    }
    
    loading = true;
    try {
      const response = await fetch(`/${lang}/api/search?q=${encodeURIComponent(query)}`);
      const data = await response.json();
      suggestions = data.results?.slice(0, 5) || [];
    } catch (e) {
      console.error('Search error:', e);
      suggestions = [];
    } finally {
      loading = false;
    }
  }
  
  let debounceTimer: ReturnType<typeof setTimeout>;
  
  function handleInput(e: Event) {
    const value = (e.target as HTMLInputElement).value;
    searchQuery = value;
    
    clearTimeout(debounceTimer);
    if (value.length >= 2) {
      isOpen = true;
      debounceTimer = setTimeout(() => search(value), 300);
    } else {
      suggestions = [];
      isOpen = false;
    }
  }
  
  function handleSubmit(e: Event) {
    e.preventDefault();
    if (searchQuery.trim()) {
      window.location.href = `/${lang}/buscar?q=${encodeURIComponent(searchQuery)}`;
    }
  }
  
  function selectSuggestion(suggestion: typeof suggestions[0]) {
    searchQuery = suggestion.title;
    isOpen = false;
    window.location.href = `/${lang}/${suggestion.silo}/${suggestion.slug}`;
  }
</script>

<div class="relative">
  <form onsubmit={handleSubmit} class="flex items-center">
    <div class="relative">
      <input
        type="text"
        value={searchQuery}
        oninput={handleInput}
        onfocus={() => searchQuery.length >= 2 && (isOpen = true)}
        placeholder={t.search.placeholder}
        class="w-48 md:w-64 px-4 py-2 pl-10 border border-gray-300 rounded-full focus:outline-none focus:border-primary-500 focus:w-64 transition-all text-sm"
      />
      <svg class="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
      </svg>
      
      {#if loading}
        <div class="absolute right-3 top-1/2 -translate-y-1/2">
          <div class="w-4 h-4 border-2 border-primary-600 border-t-transparent rounded-full animate-spin"></div>
        </div>
      {/if}
    </div>
  </form>
  
  {#if isOpen && suggestions.length > 0}
    <div class="absolute top-full mt-1 w-80 md:w-96 bg-white rounded-lg shadow-lg border border-gray-200 z-50 max-h-80 overflow-y-auto">
      {#each suggestions as suggestion}
        <button
          type="button"
          onclick={() => selectSuggestion(suggestion)}
          class="w-full text-left px-4 py-3 hover:bg-gray-50 border-b border-gray-100 last:border-0"
        >
          <div class="font-medium text-gray-900">{suggestion.title}</div>
          <div class="text-xs text-gray-500 mt-1 capitalize">{suggestion.silo}</div>
        </button>
      {/each}
      
      <div class="px-4 py-2 bg-gray-50 border-t">
        <a href="/{lang}/buscar?q={encodeURIComponent(searchQuery)}" class="text-sm text-primary-600 hover:text-primary-700">
          Ver todos los resultados →
        </a>
      </div>
    </div>
  {/if}
  
  {#if isOpen && searchQuery.length >= 2 && suggestions.length === 0 && !loading}
    <div class="absolute top-full mt-1 w-80 md:w-96 bg-white rounded-lg shadow-lg border border-gray-200 z-50 p-4 text-center text-gray-500">
      {t.search.noResults}
    </div>
  {/if}
</div>
