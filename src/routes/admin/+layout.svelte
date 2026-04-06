<script lang="ts">
  import { page } from '$app/stores'
  import { onDestroy } from 'svelte'

  export let data
  export let children

  let currentPath = ''
  let pathParts = []
  let isLoginPage = false
  let useLang = 'es'

  const unsubscribe = page.subscribe((p: any) => {
    const cp = p?.url?.pathname ?? ''
    currentPath = cp
    pathParts = cp.split('/')
    const langFromPath = pathParts[1] && ['es','en','pt'].includes(pathParts[1] as string) ? (pathParts[1] as string) : null
    isLoginPage = cp.includes('/admin/login') || (pathParts.length > 2 && pathParts[2] === 'login' && !!langFromPath)
    useLang = langFromPath ?? 'es'
  })
  onDestroy(() => unsubscribe())

  function hrefFor(base: string) {
    return `/${useLang}/admin${base}`
  }

  const navItems = [
    { href: hrefFor(''), label: 'Dashboard' },
    { href: hrefFor('/content'), label: 'Contenido' },
    { href: hrefFor('/search-insights'), label: 'Búsquedas' },
    { href: hrefFor('/gsc'), label: 'GSC' },
    { href: hrefFor('/ai'), label: 'IA Editorial' },
    { href: hrefFor('/settings'), label: 'Configuración' }
  ];
</script>

<div class="min-h-screen bg-gray-100">
  {#if !isLoginPage}
    <nav class="bg-white border-b border-gray-200">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between h-16">
          <div class="flex items-center gap-6">
            <a href="/admin" class="text-xl font-bold text-gray-900">mp3-musica</a>
            <span class="text-sm text-gray-500">Admin</span>
            
            <div class="hidden md:flex gap-4 ml-6">
              {#each navItems as item}
                <a 
                  href={item.href} 
                  class="text-sm text-gray-600 hover:text-gray-900 {currentPath === item.href ? 'text-primary-600 font-medium' : ''}"
                >
                  {item.label}
                </a>
              {/each}
            </div>
          </div>
          
          <div class="flex items-center gap-4">
            <span class="text-sm text-gray-600">{data.user?.email}</span>
            <form action="/admin/logout" method="POST">
              <button type="submit" class="text-sm text-red-600 hover:text-red-700">
                Cerrar Sesión
              </button>
            </form>
          </div>
        </div>
      </div>
    </nav>
  {/if}

  <div class="py-6">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {@render children()}
    </div>
  </div>
</div>
