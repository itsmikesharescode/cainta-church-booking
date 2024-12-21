<script lang="ts">
  import LineChart from './components/charts/line-chart.svelte';

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

  const sampleData = generateRandomData(5);
</script>

<main class="container min-h-screen">
  <div class="h-[30dvh]">
    <LineChart data={sampleData} />
  </div>
</main>
