<script lang="ts">
  import { generateCostStats } from '$lib/utils/calculations';
  import Stats from '$lib/components/ui/Stats.svelte';
  import Chart from '$lib/components/ui/Chart.svelte';
  import Card from '$lib/components/ui/Card.svelte';
  import type { ChartConfiguration } from 'chart.js';

  type CostResult = {
    costPerCharge: number;
    weeklyCost: number;
    monthlyCost: number;
    annualCost: number;
    energyPerCharge: number;
    currency?: string;
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
    title = '',
    currency = 'USD',
    chargeProvider = '',
    hasError = false
  } = $props<{
    results: CostResult;
    title?: string;
    currency?: string;
    chargeProvider?: string;
    hasError?: boolean;
  }>();

  let stats = $state<StatItem[]>([]);
  let chartConfig = $state<ChartConfiguration>({
    type: 'bar',
    data: {
      labels: [],
      datasets: []
    },
    options: {}
  });

  $effect(() => {
    if (!hasError && results.costPerCharge > 0) {
      stats = generateCostStats({
        costPerCharge: results.costPerCharge,
        weeklyCost: results.weeklyCost,
        monthlyCost: results.monthlyCost,
        annualCost: results.annualCost,
        energyPerCharge: results.energyPerCharge,
        currency: results.currency || currency,
        chargeProvider
      });

      // Generate chart data for cost breakdown over time
      const displayCurrency = results.currency || currency;
      chartConfig = {
        type: 'bar',
        data: {
          labels: ['Weekly', 'Monthly', 'Annual'],
          datasets: [
            {
              label: `Cost (${displayCurrency})`,
              data: [results.weeklyCost, results.monthlyCost, results.annualCost],
              backgroundColor: ['rgba(54, 162, 235, 0.6)', 'rgba(75, 192, 192, 0.6)', 'rgba(153, 102, 255, 0.6)'],
              borderColor: ['rgb(54, 162, 235)', 'rgb(75, 192, 192)', 'rgb(153, 102, 255)'],
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
                  return `${displayCurrency} ${context.parsed.y?.toFixed(2) ?? 0}`;
                }
              }
            }
          },
          scales: {
            y: {
              beginAtZero: true,
              title: {
                display: true,
                text: `Cost (${displayCurrency})`
              },
              ticks: {
                callback: function (value) {
                  return displayCurrency + ' ' + value;
                }
              }
            }
          }
        }
      };
    } else {
      // Default empty stats with N/A values when there's an error
      const displayCurrency = results.currency || currency;
      stats = [
        {
          title: 'Cost Per Charge',
          value: 'N/A',
          unit: displayCurrency,
          description: 'Estimated cost for a single charging session',
          color: 'accent'
        },
        {
          title: 'Weekly Cost',
          value: 'N/A',
          unit: displayCurrency,
          description: 'Projected weekly charging expenses',
          color: 'primary'
        },
        {
          title: 'Monthly Cost',
          value: 'N/A',
          unit: displayCurrency,
          description: 'Projected monthly charging expenses',
          color: 'info'
        },
        {
          title: 'Annual Cost',
          value: 'N/A',
          unit: displayCurrency,
          description: 'Projected annual charging expenses',
          color: 'success'
        },
        {
          title: 'Energy Per Charge',
          value: 'N/A',
          unit: 'kWh',
          description: 'Energy consumed per charging session including efficiency losses',
          color: 'warning'
        }
      ];
    }
  });
</script>

{#if title}
  <Card {title}>
    <Stats {stats} />

    {#if !hasError && results.costPerCharge > 0}
      <!-- Cost Breakdown Graph -->
      <div class="mt-6">
        <h3 class="mb-3 text-lg font-semibold">Cost Breakdown Over Time</h3>
        <Chart config={chartConfig} height="300px" />
      </div>
    {/if}
  </Card>
{:else}
  <Stats {stats} />

  {#if !hasError && results.costPerCharge > 0}
    <!-- Cost Breakdown Graph -->
    <div class="mt-6">
      <h3 class="mb-3 text-lg font-semibold">Cost Breakdown Over Time</h3>
      <Chart config={chartConfig} height="300px" />
    </div>
  {/if}
{/if}
