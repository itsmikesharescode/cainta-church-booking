<script lang="ts">
  import * as AlertDialog from '$lib/components/ui/alert-dialog';
  import Button from '$lib/components/ui/button/button.svelte';
  import { MessageCircle, X, Send, Loader } from 'lucide-svelte';
  import { toast } from 'svelte-sonner';
  import { page } from '$app/state';

  let open = $state(false);
  let chatContainer = $state('');
  let sendingLoader = $state(false);
  let userRef = $derived(page.data.user);

  type ChatType = {
    id: string;
    chat: string;
    displayName: string;
    timeStamp: string;
  };

  let chats: ChatType[] = $state([]);

  let scrollAreaContent: HTMLDivElement;

  // Watch for changes to chats array and scroll to bottom
  $effect(() => {
    if (chats.length && scrollAreaContent) {
      setTimeout(() => {
        scrollAreaContent.scrollTo({
          top: scrollAreaContent.scrollHeight,
          behavior: 'smooth'
        });
      }, 100);
    }
  });

  const handleSubmitChat = async () => {
    if (!userRef) return;
    chats.push({
      id: userRef.id,
      chat: chatContainer,
      displayName: userRef.user_metadata.firstName,
      timeStamp: new Date().toISOString()
    });

    chatContainer = '';

    sendingLoader = true;

    const response = await fetch('/chat-bot', {
      method: 'POST',
      body: JSON.stringify({ chats: chats.map((item) => item.chat) })
    });

    if (response.status === 401) {
      toast.error('You are not authorized to ask this question');
      sendingLoader = false;
      return;
    }

    const { message } = await response.json();
    console.log(message);
    chats.push({
      id: 'bot',
      chat: message,
      displayName: 'Church Bot',
      timeStamp: new Date().toISOString()
    });

    sendingLoader = false;
  };
</script>

<Button onclick={() => (open = true)} class="gap-1.5">
  <MessageCircle />
  <span class="hidden md:block">Church Bot</span>
</Button>

<AlertDialog.Root bind:open>
  <AlertDialog.Content
    preventScroll={false}
    class="flex max-h-screen min-h-[50dvh] max-w-[800px] flex-col"
  >
    <button
      onclick={() => (open = false)}
      class="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground"
    >
      <X class="h-4 w-4" />
      <span class="sr-only">Close</span>
    </button>

    <AlertDialog.Header>
      <AlertDialog.Title>Church Bot</AlertDialog.Title>
    </AlertDialog.Header>

    <!--Screen area-->

    <div
      bind:this={scrollAreaContent}
      class="flex h-[70dvh] w-full flex-col gap-2.5 overflow-auto px-5"
    >
      {#each chats as chat}
        <div class="flex flex-col gap-2.5">
          <div
            class={userRef?.id === chat.id
              ? 'flex w-full flex-row-reverse items-center gap-1.5'
              : 'flex items-center gap-1.5'}
          >
            <div class="">
              <p
                class="line-clamp-1 text-sm {userRef?.id === chat.id ? 'text-right' : 'text-left'}"
              >
                {chat.displayName}
              </p>

              <p class="text-sm text-muted-foreground">
                {new Date(chat.timeStamp).toLocaleDateString()} @ {new Date(
                  chat.timeStamp
                ).toLocaleTimeString()}
              </p>
            </div>
          </div>

          <div class="flex {userRef?.id === chat.id ? 'justify-end' : 'justify-start'}">
            <div class="max-w-fit rounded-lg bg-secondary p-2">
              <pre class="text-wrap font-sans text-sm">{chat.chat}</pre>
            </div>
          </div>
        </div>
      {/each}
    </div>

    <div class="relative flex items-center gap-2.5">
      {#if !userRef}
        <div
          class="absolute bottom-0 left-0 right-0 top-0 z-30 flex flex-wrap items-center justify-center gap-2.5 bg-secondary p-4"
        >
          <p class="text-sm">You have to log in first to ask bot.</p>
          <Button href="?auth=login" onclick={() => (open = false)}>Log in</Button>
        </div>
      {/if}

      <textarea
        placeholder="Ask something..."
        class="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
        bind:value={chatContainer}
      ></textarea>
      <button
        class="rounded-lg bg-secondary p-2 disabled:opacity-50"
        disabled={sendingLoader || !(chatContainer.length > 3)}
        onclick={handleSubmitChat}
      >
        {#if sendingLoader}
          <Loader class="h-[20px] w-[20px] animate-spin " />
        {:else}
          <Send class="h-[20px] w-[20px]" />
        {/if}
      </button>
    </div>
  </AlertDialog.Content>
</AlertDialog.Root>
