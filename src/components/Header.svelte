<script lang="ts">
  import type { Locale } from '$lib/i18n';
  import SearchButton from './SearchButton.svelte';

  let { t, lang }: { t: any; lang: Locale } = $props();

  const navLinks = $derived([
    { href: `/${lang}/reviews`, label: t.nav.reviews },
    { href: `/${lang}/tutorials`, label: t.nav.tutorials },
    { href: `/${lang}/courses`, label: t.nav.courses },
    { href: `/${lang}/gear`, label: t.nav.gear },
    { href: `/${lang}/streaming`, label: t.nav.streaming }
  ]);

  const langSwitcher = [
    { code: 'es', label: 'ES' },
    { code: 'en', label: 'EN' },
    { code: 'pt', label: 'PT' }
  ];
  
  let mobileMenuOpen = $state(false);
</script>

<header class="bg-white border-b border-gray-200 sticky top-0 z-50">
  <div class="container">
    <div class="flex items-center justify-between h-16">
      <!-- Logo -->
      <a href="/{lang}/" class="flex items-center gap-2">
        <div class="flex items-center">
          <span class="text-2xl font-black text-primary-600 tracking-tight">mp3</span>
          <span class="text-2xl font-light text-gray-600">-musica</span>
        </div>
      </a>

      <!-- Navigation - Desktop -->
      <nav class="hidden lg:flex items-center gap-8">
        {#each navLinks as link}
          <a href={link.href} class="text-sm font-medium text-gray-700 hover:text-primary-600 transition-colors uppercase tracking-wide">
            {link.label}
          </a>
        {/each}
      </nav>

      <!-- Right Side -->
      <div class="flex items-center gap-3">
        <!-- Search -->
        <SearchButton {t} {lang} />

        <!-- Lang Switcher -->
        <div class="hidden sm:flex items-center gap-1 bg-gray-100 rounded-lg p-1">
          {#each langSwitcher as l}
            <a
              href="/{l.code}/"
              class="px-2 py-1 text-xs font-semibold rounded transition-colors {lang === l.code ? 'bg-white text-primary-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'}"
            >
              {l.label}
            </a>
          {/each}
        </div>

        <!-- Mobile Menu Button -->
        <button 
          onclick={() => mobileMenuOpen = !mobileMenuOpen}
          aria-label="Menu" 
          class="lg:hidden p-2 text-gray-500"
        >
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            {#if mobileMenuOpen}
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            {:else}
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
            {/if}
          </svg>
        </button>
      </div>
    </div>
    
    <!-- Mobile Menu -->
    {#if mobileMenuOpen}
      <nav class="lg:hidden py-4 border-t border-gray-100">
        {#each navLinks as link}
          <a href={link.href} class="block py-2 text-gray-700 hover:text-primary-600 font-medium">
            {link.label}
          </a>
        {/each}
        <div class="flex gap-2 mt-4">
          {#each langSwitcher as l}
            <a
              href="/{l.code}/"
              class="px-3 py-1 text-sm font-medium rounded bg-gray-100 text-gray-600 hover:bg-gray-200"
            >
              {l.label}
            </a>
          {/each}
        </div>
      </nav>
    {/if}
  </div>
</header>
