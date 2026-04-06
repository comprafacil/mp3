<script lang="ts">
  import { onMount } from 'svelte';
  import { goto } from '$app/navigation';

  onMount(() => {
    goto('/es/', { replaceState: true });
  });
</script>

<svelte:head>
  <title>mp3 - Music Content Platform</title>
</svelte:head>

<div class="min-h-screen flex items-center justify-center">
  <div class="text-center">
    <div class="w-12 h-12 border-4 border-primary-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
    <p class="text-gray-600">Redirecting...</p>
  </div>
</div>
