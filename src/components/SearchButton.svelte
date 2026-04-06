<script lang="ts">
  let { t, lang }: { t: any; lang: string } = $props();
  
  let searchQuery = $state('');
  let isOpen = $state(false);
  
  function toggleSearch() {
    isOpen = !isOpen;
    if (!isOpen) searchQuery = '';
  }
  
  function handleSearch(e: Event) {
    e.preventDefault();
    if (searchQuery.trim()) {
      window.location.href = `/${lang}/buscar?q=${encodeURIComponent(searchQuery)}`;
    }
  }
</script>

<button 
  onclick={toggleSearch}
  aria-label="Search"
  class="p-2 text-gray-500 hover:text-primary-600 transition-colors"
>
  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
  </svg>
</button>

{#if isOpen}
  <div class="absolute right-0 top-full mt-2 w-72 bg-white rounded-lg shadow-lg p-3 z-50">
    <form onsubmit={handleSearch} class="flex gap-2">
      <input
        type="text"
        bind:value={searchQuery}
        placeholder={t.search.placeholder}
        class="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-primary-500 text-sm"
      />
      <button 
        type="submit"
        class="px-3 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 transition-colors"
      >
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
      </button>
    </form>
  </div>
{/if}
