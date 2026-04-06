<script lang="ts">
  import { page } from '$app/stores';

  let { children, data } = $props();

  const navItems = [
    { href: '/admin', label: 'Dashboard', icon: '📊' },
    { href: '/admin/content', label: 'Contenido', icon: '📝' },
    { href: '/admin/search-insights', label: 'Búsquedas', icon: '🔍' },
    { href: '/admin/gsc', label: 'GSC', icon: '📈' },
    { href: '/admin/ai', label: 'IA Editorial', icon: '🤖' },
    { href: '/admin/settings', label: 'Configuración', icon: '⚙️' }
  ];
</script>

<div class="min-h-screen bg-gray-100">
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
                class="text-sm text-gray-600 hover:text-gray-900 {$page.url.pathname === item.href ? 'text-primary-600 font-medium' : ''}"
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

  <div class="py-6">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {@render children()}
    </div>
  </div>
</div>
