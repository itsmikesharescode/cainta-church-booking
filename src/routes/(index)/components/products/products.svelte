<script lang="ts">
  import { page } from '$app/state';
  import Button from '$lib/components/ui/button/button.svelte';
  import CalendarCheck from 'lucide-svelte/icons/calendar-check';
  import { PUBLIC_SUPABASE_STORAGE } from '$env/static/public';
</script>

<section class="grid grid-cols-2 gap-x-5 gap-y-10">
  {#await page.data.getChurches}
    loading
  {:then churches}
    {#if !churches?.length}
      <span class="text-center text-lg font-medium text-muted-foreground">
        No churches uploaded yet.
      </span>
    {/if}

    {#each churches ?? [] as church}
      <section class="flex flex-col gap-5">
        <img
          src="{PUBLIC_SUPABASE_STORAGE}/{church.photo_link}"
          alt="church_photo"
          class="h-[300px] w-full rounded-lg object-cover"
        />
        <div class="flex flex-col gap-2.5">
          <div class="flex flex-col">
            <span class="text-xl">{church.name}</span>
            <span class="line-clamp-3 font-light italic text-muted-foreground"
              >{church.address}</span
            >
            <span class="line-clamp-3 text-muted-foreground">{church.description}</span>
          </div>

          <div class="flex items-center justify-end gap-2.5">
            <Button href="/reserve?id={church.id}" size="sm">
              <CalendarCheck />
              Reveserve Now!
            </Button>
          </div>
        </div>
      </section>
    {/each}
  {/await}
</section>
