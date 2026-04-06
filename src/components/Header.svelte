<script lang="ts">
  import type { Locale } from '$lib/i18n';

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
</script>

<header class="bg-white border-b border-gray-200 sticky top-0 z-50">
  <div class="container">
    <div class="flex items-center justify-between h-16">
      <!-- Logo -->
      <a href="/{lang}/" class="flex items-center gap-2">
        <span class="text-2xl font-bold text-primary-600">mp3</span>
      </a>

      <!-- Navigation - Desktop -->
      <nav class="hidden md:flex items-center gap-6">
        {#each navLinks as link}
          <a href={link.href} class="text-gray-700 hover:text-primary-600 font-medium transition-colors">
            {link.label}
          </a>
        {/each}
      </nav>

      <!-- Lang Switcher + Search -->
      <div class="flex items-center gap-4">
        <!-- Search -->
        <button aria-label="Search" class="p-2 text-gray-500 hover:text-primary-600 transition-colors">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </button>

        <!-- Lang Switcher -->
        <div class="flex items-center gap-1">
          {#each langSwitcher as l}
            <a
              href="/{l.code}/"
              class="px-2 py-1 text-sm rounded transition-colors {lang === l.code ? 'bg-primary-100 text-primary-700 font-medium' : 'text-gray-500 hover:text-gray-700'}"
            >
              {l.label}
            </a>
          {/each}
        </div>

        <!-- Mobile Menu Button -->
        <button aria-label="Menu" class="md:hidden p-2 text-gray-500">
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
      </div>
    </div>
  </div>
</header>
