<script lang="ts">
  import ReservationForm from './reservation-form/reservation-form.svelte';
  import Calendar from '$lib/components/general/calendar.svelte';
  const { data } = $props();
</script>

<main class="container grid min-h-screen gap-5 py-10 md:grid-cols-[3fr,2fr]">
  <section class="">
    <Calendar reservations={[]} />
  </section>

  <section>
    <ReservationForm reservationForm={data.reservationForm} />
  </section>
</main>
