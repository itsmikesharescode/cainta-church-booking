<script lang="ts">
  import PhotoUploader from '$lib/components/general/photo-uploader.svelte';
  import ReservationForm from './reservation-form/reservation-form.svelte';

  const { data } = $props();
</script>

<main class="container grid min-h-screen gap-5 py-10 md:grid-cols-[3fr,2fr]">
  <section class="bg-red-500"></section>

  <section>
    <ReservationForm reservationForm={data.reservationForm} />
  </section>
</main>
