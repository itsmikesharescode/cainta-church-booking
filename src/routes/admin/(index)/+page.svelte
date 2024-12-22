<script lang="ts">
  import LineChart from './components/charts/line-chart.svelte';
  import Table from './components/table/components/table.svelte';
  import { columns } from './components/table/components/columns';
  import { Skeleton } from '$lib/components/ui/skeleton/index.js';

  const { data } = $props();

  const generateRandomData = (numEntries: number) => {
    const data = [];
    const startDate = new Date('2024-10-22');

    for (let i = 0; i < numEntries; i++) {
      const date = new Date(startDate);
      date.setDate(startDate.getDate() + i);
      data.push({ date: date.toLocaleDateString('en-US'), value: Math.floor(Math.random() * 100) });
    }

    return data;
  };

  const sampleData = generateRandomData(100);
</script>

<main class="container flex min-h-screen flex-col gap-10 py-10">
  <section class="grid grid-cols-2">
    <div class="relative max-h-[30dvh]">
      <LineChart title="Reservation this month" data={sampleData} />
    </div>

    <div class="relative max-h-[30dvh]">
      <LineChart title="Request this month" data={sampleData} />
    </div>
  </section>

  <section>
    {#await data.getChurches}
      <div class="flex flex-col gap-2">
        <div class="flex justify-between">
          <Skeleton class="h-9 w-[110px]" />
          <div class="flex items-center gap-2.5">
            <Skeleton class="h-9 w-[300px]" />
            <Skeleton class="h-9 w-[110px]" />
          </div>
        </div>

        <div class="flex justify-end">
          <Skeleton class="h-9 w-[450px]" />
        </div>

        <Skeleton class="h-9 w-full" />
      </div>
    {:then churches}
      <Table data={churches ?? []} {columns} createChurchForm={data.createChurchForm} />
    {/await}
  </section>
</main>
