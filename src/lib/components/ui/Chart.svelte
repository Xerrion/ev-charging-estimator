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

  let {
    config,
    height = '300px'
  } = $props<{
    config: ChartConfiguration;
    height?: string;
  }>();

  let canvas: HTMLCanvasElement;
  let chart: Chart | null = null;

  // Custom clone function that preserves functions (unlike structuredClone)
  // This is needed because Chart.js configs contain callback functions
  function cloneConfig(obj: any): any {
    if (obj === null || typeof obj !== 'object') {
      return obj;
    }
    if (typeof obj === 'function') {
      return obj; // Preserve functions
    }
    if (Array.isArray(obj)) {
      return obj.map(item => cloneConfig(item));
    }
    const cloned: any = {};
    for (const key in obj) {
      if (obj.hasOwnProperty(key)) {
        cloned[key] = cloneConfig(obj[key]);
      }
    }
    return cloned;
  }

  onMount(() => {
    if (canvas) {
      // Clone the config to avoid Svelte reactivity issues with Chart.js
      // We use a custom clone that preserves functions (callbacks)
      const chartConfig = cloneConfig(config);
      chart = new Chart(canvas, chartConfig);
    }
  });

  // Update chart when config changes
  $effect(() => {
    if (chart && config) {
      // Clone to break Svelte's reactivity while preserving callback functions
      const newData = cloneConfig(config.data);
      const newOptions = cloneConfig(config.options || {});
      
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
