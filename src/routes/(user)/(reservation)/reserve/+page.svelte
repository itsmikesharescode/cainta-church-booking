<script lang="ts">
  import ReservationForm from './reservation-form/reservation-form.svelte';
  import Calendar from '$lib/components/general/calendar.svelte';
  import RequestForm from './request-form/request-form.svelte';
  import * as Tabs from '$lib/components/ui/tabs/index.js';
  import { page } from '$app/state';
  import { goto } from '$app/navigation';

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

<main class="container grid min-h-screen gap-10 py-10 md:grid-cols-[3fr,2fr]">
  <section class="">
    <Calendar reservations={[]} />
  </section>

  <section>
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
        <ReservationForm reservationForm={data.reservationForm} />
      </Tabs.Content>
      <Tabs.Content value="request">
        <RequestForm requestForm={data.requestForm} />
      </Tabs.Content>
    </Tabs.Root>
  </section>
</main>
