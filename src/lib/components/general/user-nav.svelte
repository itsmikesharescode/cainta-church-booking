<script lang="ts">
  import { goto } from '$app/navigation';
  import { page } from '$app/state';
  import Button from '../ui/button/button.svelte';
  import { userRoutes } from '$lib';
  import Logout from './logout.svelte';

  const routes = $derived.by(() => {
    if (page.data.user) {
      return userRoutes;
    }

    return [{ url: '/', name: 'Home' }];
  });
</script>

<nav class="sticky top-0 z-50 border-b-2 bg-secondary/80 p-2 backdrop-blur-sm">
  <div class="container flex items-center justify-between">
    <div class="flex items-center gap-5">
      {#each routes as route}
        <a
          href={route.url}
          class="text-sm transition-all hover:underline {page.url.pathname === route.url
            ? 'text-primary'
            : 'text-muted-foreground'}">{route.name}</a
        >
      {/each}
    </div>

    <div class="flex justify-end gap-2.5">
      {#if page.data.user}
        <Logout />
      {:else}
        <Button size="sm" onclick={() => goto('/?auth=login')}>Log in</Button>
        <Button size="sm" onclick={() => goto('/?auth=register')}>Register</Button>
      {/if}
    </div>
  </div>
</nav>
