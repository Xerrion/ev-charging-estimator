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
    type ChartConfiguration
  } from 'chart.js';

  // Register Chart.js components
  Chart.register(
    LineController,
    LineElement,
    PointElement,
    LinearScale,
    CategoryScale,
    Title,
    Tooltip,
    Legend,
    Filler
  );

  let {
    config,
    height = '300px'
  } = $props<{
    config: ChartConfiguration;
    height?: string;
  }>();

  let canvas: HTMLCanvasElement;
  let chart: Chart | null = null;

  onMount(() => {
    if (canvas) {
      chart = new Chart(canvas, config);
    }
  });

  // Update chart when config changes
  $effect(() => {
    if (chart && config) {
      chart.data = config.data;
      chart.options = config.options || {};
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
