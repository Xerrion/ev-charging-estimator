<script lang="ts">
  import Alert from '$lib/components/ui/Alert.svelte';
  import Card from '$lib/components/ui/Card.svelte';
  import Stats from '$lib/components/ui/Stats.svelte';
  import Chart from '$lib/components/ui/Chart.svelte';
  import { generateFrequencyStats, isSafetyChargeAdded } from '$lib/utils/calculations';
  import type { ChartConfiguration } from 'chart.js';

  type Result = {
    effectiveRangeKm: number;
    weeklyCharges: number;
    co2Savings: number;
  };

  type StatItem = {
    title: string;
    value: number | string;
    unit?: string;
    description?: string;
    color?: 'primary' | 'secondary' | 'accent' | 'info' | 'success' | 'warning' | 'error';
  };

  let {
    results,
    formData,
    title = 'Frequency Results'
  } = $props<{
    results: Result;
    formData: {
      weeklyDistanceKm: number;
      batteryKwh: number;
      consumptionKwhPer100km: number;
      usableFraction: number;
    };
    title?: string;
  }>();

  let stats = $state<StatItem[]>([]);
  let safetyChargeAdded = $state(false);
  let chartConfig = $state<ChartConfiguration>({
    type: 'bar',
    data: {
      labels: [],
      datasets: []
    },
    options: {}
  });

  $effect(() => {
    // Check if a safety charge was added
    safetyChargeAdded = isSafetyChargeAdded({
      weeklyDistanceKm: formData.weeklyDistanceKm,
      effectiveRangeKm: results.effectiveRangeKm
    });

    // Generate stats data
    stats = generateFrequencyStats({
      effectiveRangeKm: results.effectiveRangeKm,
      weeklyCharges: results.weeklyCharges,
      co2Savings: results.co2Savings,
      safetyChargeAdded
    });

    // Generate chart data
    const dailyDistanceKm = formData.weeklyDistanceKm / 7;
    const rangePerCharge = results.effectiveRangeKm;

    chartConfig = {
      type: 'bar',
      data: {
        labels: ['Weekly Distance', 'Vehicle Range', 'Range per Charge'],
        datasets: [
          {
            label: 'Kilometers',
            data: [
              formData.weeklyDistanceKm,
              results.effectiveRangeKm,
              results.effectiveRangeKm / results.weeklyCharges
            ],
            backgroundColor: ['rgba(255, 99, 132, 0.6)', 'rgba(75, 192, 192, 0.6)', 'rgba(54, 162, 235, 0.6)'],
            borderColor: ['rgb(255, 99, 132)', 'rgb(75, 192, 192)', 'rgb(54, 162, 235)'],
            borderWidth: 2
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: false
          },
          tooltip: {
            callbacks: {
              label: (context) => {
                return `${context.parsed.y?.toFixed(1) ?? 0} km`;
              }
            }
          }
        },
        scales: {
          y: {
            beginAtZero: true,
            title: {
              display: true,
              text: 'Distance (km)'
            },
            ticks: {
              callback: function (value) {
                return value + ' km';
              }
            }
          }
        }
      }
    };
  });
</script>

<Card {title}>
  <Stats {stats} />

  <!-- Range Comparison Graph -->
  <div class="mt-6">
    <h3 class="mb-3 text-lg font-semibold">Distance and Range Comparison</h3>
    <Chart config={chartConfig} height="300px" />
  </div>

  {#if safetyChargeAdded}
    <Alert
      type="warning"
      message="An extra safety charge has been added because your driving distance is very close to your vehicle's range"
      className="mb-4"
    />
  {/if}
</Card>
