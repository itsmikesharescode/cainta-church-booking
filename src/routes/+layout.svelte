<script lang="ts">
  import '../app.css';
  import { invalidate } from '$app/navigation';
  import UserNav from '$lib/components/general/user-nav/user-nav.svelte';
  import Footer from '$lib/components/general/footer.svelte';
  import { ModeWatcher } from 'mode-watcher';
  import { Toaster } from '$lib/components/ui/sonner/index.js';
  import ChatBot from '$lib/components/general/chat-bot/chat-bot.svelte';
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
</script>

<Toaster />
<ModeWatcher />
<UserNav />
<div class="pointer-events-none fixed bottom-5 left-0 right-0">
  <div class="container pointer-events-auto flex justify-end">
    <ChatBot />
  </div>
</div>
{@render children()}
<Footer />
