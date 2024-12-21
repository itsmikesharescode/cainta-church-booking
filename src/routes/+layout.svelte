<script lang="ts">
  import '../app.css';
  import { invalidate } from '$app/navigation';
  import UserNav from '$lib/components/general/user-nav/user-nav.svelte';
  import Footer from '$lib/components/general/footer.svelte';
  import { ModeWatcher } from 'mode-watcher';
  import { Toaster } from '$lib/components/ui/sonner/index.js';
  import { page } from '$app/state';
  import AdminNav from '$lib/components/general/admin-nav.svelte';

  let { data, children } = $props();
  let { session, supabase } = $derived(data);

  $effect(() => {
    const { data } = supabase.auth.onAuthStateChange((_, newSession) => {
      if (newSession?.expires_at !== session?.expires_at) {
        invalidate('supabase:auth');
      }
    });

    return () => data.subscription.unsubscribe();
  });

  const role = $derived(page.data.user?.user_metadata.role);
</script>

<Toaster />
<ModeWatcher />
<UserNav />

{@render children()}
<Footer />
