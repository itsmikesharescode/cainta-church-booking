<script lang="ts">
  import ComboBox from '$lib/components/general/combo-box.svelte';

  let selected = $state('');

  let selections = [
    {
      id: '1',
      label: 'Hi',
      value: 'HSDASD'
    },
    {
      id: '2',
      label: 'Hello',
      value: 'HELLO'
    },
    {
      id: '3',
      label: 'Greetings',
      value: 'GREETING'
    }
  ];
</script>

<main class="min-h-screen">
  <ComboBox hasLabel bind:selected {selections} />
  {selected}
</main>
