<script lang="ts">
  import { page } from '$app/state';
  import Button from '$lib/components/ui/button/button.svelte';
  import CalendarCheck from 'lucide-svelte/icons/calendar-check';
  import { Image } from '@unpic/svelte';
  import { PUBLIC_SUPABASE_STORAGE } from '$env/static/public';
</script>

<section class="grid grid-cols-2 gap-x-5 gap-y-10">
  {#await page.data.getChurches}
    loading
  {:then churches}
    {#each churches ?? [] as church}
      <section class="flex flex-col gap-5">
        <img
          src="{PUBLIC_SUPABASE_STORAGE}/{church.photo_link}"
          alt="church_photo"
          class="h-[300px] w-full rounded-lg object-cover"
        />
        <!-- <Image
          src="http://127.0.0.1:54321/storage/v1/object/public/church_bucket/80f8b3a1-671f-4b14-b508-539fe1a63040"
          layout="constrained"
          width={800}
          height={600}
          alt="A lovely bath"
        /> -->
        <div class="flex flex-col gap-2.5">
          <div class="flex flex-col">
            <span class="text-xl">{church.name}</span>
            <span class="line-clamp-3 text-muted-foreground">{church.address}</span>
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
