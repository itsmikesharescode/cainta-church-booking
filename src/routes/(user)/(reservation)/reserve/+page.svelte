<script lang="ts">
  import ReservationForm from './reservation-form/reservation-form.svelte';
  import Calendar from '$lib/components/general/calendar.svelte';
  import RequestForm from './request-form/request-form.svelte';
  import * as Tabs from '$lib/components/ui/tabs/index.js';
  import { page } from '$app/state';
  import { goto } from '$app/navigation';
  import { format24hrTo12hrAMPM } from '$lib/utils';

  const { data } = $props();

  interface NewParam {
    key: string;
    value: string;
  }

  function updateUrl(newParam: NewParam) {
    const currentUrl = new URL(page.url.href);
    currentUrl.searchParams.set(newParam.key, newParam.value);
    goto(currentUrl.href);
  }
</script>

{#if data.getChurch}
  <main class="container flex min-h-screen flex-col gap-10 py-10">
    <section class="flex flex-col">
      <span class="text-4xl">{data.getChurch?.name}</span>
      <span class="text-sm text-muted-foreground">
        Open everyday: {format24hrTo12hrAMPM(data.getChurch?.open_time)} - {format24hrTo12hrAMPM(
          data.getChurch?.close_time
        )}
      </span>
    </section>
    <section class="grid gap-10 md:grid-cols-[3fr,2fr]">
      <div class="overflow-auto">
        <!--Should fetch specific id;s from reservations_tb-->
        <Calendar reservations={[]} />
      </div>

      <div>
        <Tabs.Root value="reservation" class="">
          <Tabs.List>
            <Tabs.Trigger
              value="reservation"
              onclick={() => updateUrl({ key: 'forward', value: 'reservation' })}
              >Reservation</Tabs.Trigger
            >
            <Tabs.Trigger
              value="request"
              onclick={() => updateUrl({ key: 'forward', value: 'request' })}>Request</Tabs.Trigger
            >
          </Tabs.List>

          <Tabs.Content value="reservation">
            <ReservationForm churchData={data.getChurch} reservationForm={data.reservationForm} />
          </Tabs.Content>
          <Tabs.Content value="request">
            <RequestForm churchData={data.getChurch} requestForm={data.requestForm} />
          </Tabs.Content>
        </Tabs.Root>
      </div>
    </section>
  </main>
{:else}
  <p>No data</p>
{/if}
