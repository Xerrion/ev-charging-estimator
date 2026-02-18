<script lang="ts">
  import { onMount, onDestroy } from 'svelte';
  import {
    Chart,
    LineController,
    LineElement,
    PointElement,
    LinearScale,
    CategoryScale,
    Title,
    Tooltip,
    Legend,
    Filler,
    BarController,
    BarElement,
    type ChartConfiguration
  } from 'chart.js';

  // Register Chart.js components
  Chart.register(
    LineController,
    LineElement,
    PointElement,
    LinearScale,
    CategoryScale,
    BarController,
    BarElement,
    Title,
    Tooltip,
    Legend,
    Filler
  );

  let { config, height = '300px' } = $props<{
    config: ChartConfiguration;
    height?: string;
  }>();

  let canvas: HTMLCanvasElement;
  let chart: Chart | null = null;

  onMount(() => {
    if (canvas) {
      // Deep clone the config to avoid Svelte reactivity issues with Chart.js
      const chartConfig = structuredClone(config);
      chart = new Chart(canvas, chartConfig);
    }
  });

  // Update chart when config changes
  $effect(() => {
    if (chart && config) {
      // Deep clone to break Svelte's reactivity and avoid property descriptor errors
      const newData = structuredClone(config.data);
      const newOptions = structuredClone(config.options || {});

      chart.data = newData;
      chart.options = newOptions;
      chart.update('none'); // Update without animation for real-time feel
    }
  });

  onDestroy(() => {
    if (chart) {
      chart.destroy();
    }
  });
</script>

<div class="w-full" style="height: {height}">
  <canvas bind:this={canvas}></canvas>
</div>
