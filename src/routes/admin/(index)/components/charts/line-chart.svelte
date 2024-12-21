<script lang="ts">
  import { tick } from 'svelte';
  import { browser } from '$app/environment';
  import type { Chart } from 'chart.js';

  type ChartDataPoint = {
    date: string;
    value: number;
  };

  interface Props {
    data: ChartDataPoint[];
  }

  const { data }: Props = $props();

  let chartContainer: HTMLCanvasElement | null = null;
  let chart: Chart | null = null;

  $effect(() => {
    tick().then(async () => {
      if (!browser || !chartContainer) return;

      const {
        Chart,
        LineController,
        LineElement,
        PointElement,
        LinearScale,
        Title,
        CategoryScale,
        Tooltip,
        Legend,
        Filler
      } = await import('chart.js');

      const zoomPlugin = (await import('chartjs-plugin-zoom')).default;
      const annotationPlugin = (await import('chartjs-plugin-annotation')).default;

      Chart.register(
        LineController,
        LineElement,
        PointElement,
        LinearScale,
        Title,
        CategoryScale,
        Tooltip,
        Legend,
        zoomPlugin,
        annotationPlugin,
        Filler
      );

      const ctx = chartContainer.getContext('2d');
      if (!ctx) return;

      const labels = data.map((item) => item.date);
      const values = data.map((item) => item.value);

      // Variable to store the current vertical line position
      let verticalLineIndex = -1;

      chart = new Chart(ctx, {
        type: 'line',
        data: {
          labels: labels,
          datasets: [
            {
              label: 'Values',
              data: values,
              borderColor: 'rgba(75, 192, 192, 1)',
              backgroundColor: 'rgba(75, 192, 192, 0.2)',
              tension: 0.4
            }
          ]
        },
        options: {
          responsive: true,
          interaction: {
            intersect: false,
            mode: 'index'
          },
          plugins: {
            legend: {
              display: true,
              position: 'top'
            },
            title: {
              display: true,
              text: 'Sample Line Chart'
            },
            tooltip: {
              enabled: true,
              callbacks: {
                label: (context) => `Value: ${context.raw}`
              }
            },
            zoom: {
              pan: {
                enabled: true,
                mode: 'x'
              },
              zoom: {
                wheel: {
                  enabled: true
                },
                pinch: {
                  enabled: true
                },
                mode: 'x'
              }
            },
            annotation: {
              annotations: {
                verticalLine: {
                  type: 'line',
                  xMin: 0,
                  xMax: 0,
                  borderColor: 'rgb(169, 169, 169)',
                  borderWidth: 1,
                  display: false
                }
              }
            }
          },
          scales: {
            x: {
              title: {
                display: true,
                text: 'Date'
              }
            },
            y: {
              title: {
                display: true,
                text: 'Value'
              }
            }
          },
          onHover: (event, activeElements, chartInstance) => {
            if (!event || !chartInstance) return;

            const points = chartInstance.getElementsAtEventForMode(
              event as unknown as Event,
              'index',
              { intersect: false },
              true
            );

            if (points.length > 0) {
              const firstPoint = points[0];
              const index = firstPoint.index;

              if (verticalLineIndex !== index) {
                verticalLineIndex = index;

                // Update vertical line position
                const annotation = chartInstance.options.plugins?.annotation?.annotations as Record<
                  string,
                  any
                >;
                if (annotation) {
                  annotation.verticalLine.display = true;
                  annotation.verticalLine.xMin = index;
                  annotation.verticalLine.xMax = index;
                  chartInstance.update('none'); // Update without animation
                }
              }
            } else {
              // Hide the line when not hovering over data
              const annotation = chartInstance.options.plugins?.annotation?.annotations as Record<
                string,
                any
              >;
              if (annotation) {
                annotation.verticalLine.display = false;
                chartInstance.update('none');
              }
              verticalLineIndex = -1;
            }
          }
        }
      });

      return () => {
        if (chart) {
          chart.destroy();
          chart = null;
        }
      };
    });
  });
</script>

<canvas bind:this={chartContainer}></canvas>

<style>
  canvas {
    width: 100% !important;
    height: 100% !important;
  }
</style>
