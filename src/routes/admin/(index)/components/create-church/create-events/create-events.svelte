<script lang="ts" module>
  export type EventList = {
    id: string;
    name: string;
    description: string;
    price: number;
  };
</script>

<script lang="ts">
  import * as DropdownMenu from '$lib/components/ui/dropdown-menu/index.js';
  import { Input } from '$lib/components/ui/input/index.js';
  import { Label } from '$lib/components/ui/label/index.js';
  import Button from '$lib/components/ui/button/button.svelte';
  import { ScrollArea } from '$lib/components/ui/scroll-area/index.js';
  import { fly } from 'svelte/transition';
  import { eventsSchema } from './schema';
  import { toast } from 'svelte-sonner';
  import Badge from '$lib/components/ui/badge/badge.svelte';
  interface Props {
    stringValue: string;
  }

  let { stringValue = $bindable() }: Props = $props();

  let listEventsBinder = $state<HTMLElement>();

  class EventListState {
    #eventList = $state<EventList[]>([
      {
        id: crypto.randomUUID(),
        name: '',
        description: '',
        price: 0
      }
    ]);

    set(v: EventList[]) {
      this.#eventList = v;
    }

    add() {
      this.#eventList.push({
        id: crypto.randomUUID(),
        name: '',
        description: '',
        price: 0
      });

      setTimeout(() => {
        listEventsBinder?.scrollIntoView({ behavior: 'smooth' });
      }, 0);
    }

    remove(id: string) {
      if (this.#eventList.length > 1)
        this.#eventList = this.#eventList.filter((item) => item.id !== id);
    }

    removeAll() {
      this.#eventList = this.#eventList.slice(0, 1);
    }

    getEvents() {
      return this.#eventList;
    }
  }
  let open = $state(false);
  const eventLists = new EventListState();

  const handleSave = () => {
    const result = eventsSchema.safeParse(eventLists.getEvents());
    if (result.success) {
      stringValue = JSON.stringify(eventLists.getEvents());
      open = false;
    } else {
      const errorMessages = Object.entries(result.error.format())
        .flatMap(([_, eventErrors]) => {
          return Object.entries(eventErrors).flatMap(([field, fieldErrors]) => {
            return fieldErrors?._errors
              ? fieldErrors._errors.map((error: any) => `${field}: ${error}`)
              : [];
          });
        })
        .join(', ');

      toast.error(`Errors: ${errorMessages}`);
    }
  };
</script>

<DropdownMenu.Root bind:open>
  <DropdownMenu.Trigger
    class="flex min-h-9 w-full flex-wrap items-center gap-2.5 rounded-md border border-input bg-transparent px-3 py-1 text-left text-base shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
  >
    {#if stringValue}
      {#each JSON.parse(stringValue) as event}
        <Badge>{event.name}</Badge>
      {/each}
    {:else}
      <span class="text-muted-foreground">Enter names</span>
    {/if}
  </DropdownMenu.Trigger>
  <DropdownMenu.Content class="flex w-[300px] flex-col p-0 sm:w-[400px]">
    <ScrollArea class=" relative h-[400px] px-5">
      <section class="my-5 flex flex-col gap-2.5">
        {#each eventLists.getEvents() as event, index (event)}
          <div
            class="relative flex flex-col gap-2.5 border-2 p-2 sm:p-4"
            bind:this={listEventsBinder}
            out:fly={{ x: 100, duration: 200 }}
          >
            <div class="grid w-full max-w-sm items-center gap-1.5">
              <Label for={event.id}>Event Name</Label>
              <Input
                id={event.id}
                placeholder="Enter event name {index + 1}"
                bind:value={event.name}
              />
            </div>

            <div class="grid w-full max-w-sm items-center gap-1.5">
              <Label for="email">Description</Label>
              <Input
                id={event.id}
                placeholder="Enter event description {index + 1}"
                bind:value={event.description}
              />
            </div>

            <div class="grid w-full max-w-sm items-center gap-1.5">
              <Label for="email">Price</Label>
              <Input
                type="number"
                id={event.id}
                placeholder="Enter event price {index + 1}"
                bind:value={event.price}
              />
            </div>
            {#if eventLists.getEvents().length > 1}
              <Button
                onclick={() => eventLists.remove(event.id)}
                size="sm"
                variant="destructive"
                class="pointer-events-auto relative max-w-fit">Remove</Button
              >
            {/if}
          </div>
        {/each}
      </section>
      <div
        class="pointer-events-none absolute bottom-4 left-5 right-5 flex items-center justify-between"
      >
        <Button onclick={handleSave} size="sm" class="pointer-events-auto">Save</Button>
        <div class="flex items-center gap-2.5">
          {#if eventLists.getEvents().length > 3}
            <Button
              size="sm"
              variant="destructive"
              class="pointer-events-auto"
              onclick={() => eventLists.removeAll()}
              >Delete All ({eventLists.getEvents().length})</Button
            >
          {/if}
          <Button size="sm" class="pointer-events-auto" onclick={() => eventLists.add()}>Add</Button
          >
        </div>
      </div>
    </ScrollArea>
  </DropdownMenu.Content>
</DropdownMenu.Root>
