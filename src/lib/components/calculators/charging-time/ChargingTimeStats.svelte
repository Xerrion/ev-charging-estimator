<script lang="ts">
  import Stats from '$lib/components/ui/Stats.svelte';
  import { formatTime, generateChargingTimeStats, generateChargingCurveData } from '$lib/utils/calculations';
  import Alert from '$lib/components/ui/Alert.svelte';
  import Card from '$lib/components/ui/Card.svelte';
  import Chart from '$lib/components/ui/Chart.svelte';
  import type { ChartConfiguration } from 'chart.js';

  type Result = {
    chargingTimeHours: number;
    chargingTimeMinutes: number;
    energyNeeded: number;
    technicalLimitExceeded?: boolean;
    actualChargingPower?: number;
    limitingFactor?: 'c-rate' | 'phases' | 'temperature' | 'connector' | null;
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
    title = 'Charging Results'
  } = $props<{
    results: Result;
    formData: {
      batteryKwh: number;
      initialCharge: number;
      targetCharge: number;
      chargingPower: number;
      chargingEfficiency: number;
      phases: number;
      temperatureC: number;
      chargingType: 'AC' | 'DC';
    };
    title?: string;
  }>();

  let stats = $state<StatItem[]>([]);
  let chartConfig = $state<ChartConfiguration>({
    type: 'line',
    data: {
      labels: [],
      datasets: []
    },
    options: {}
  });

  $effect(() => {
    // Generate the standard stats
    const baseStats = generateChargingTimeStats({
      chargingTimeHours: results.chargingTimeHours,
      chargingTimeMinutes: results.chargingTimeMinutes,
      energyNeeded: results.energyNeeded,
      initialCharge: formData.initialCharge,
      targetCharge: formData.targetCharge,
      technicalLimitExceeded: results.technicalLimitExceeded
    });

    // Add actual charging power if available
    if (results.actualChargingPower) {
      baseStats.push({
        title: 'Actual Charging Power',
        value: results.actualChargingPower,
        unit: ' kW',
        description: getLimitingFactorDescription(results.limitingFactor, formData.chargingPower),
        color: results.technicalLimitExceeded ? 'warning' : 'info'
      });
    }

    stats = baseStats;

    // Generate charging curve data for the graph
    const curveData = generateChargingCurveData({
      batteryKwh: formData.batteryKwh,
      initialCharge: formData.initialCharge,
      targetCharge: formData.targetCharge,
      chargingPower: formData.chargingPower,
      chargingEfficiency: formData.chargingEfficiency,
      temperatureC: formData.temperatureC,
      phases: formData.phases,
      chargingType: formData.chargingType
    });

    // Update chart configuration
    chartConfig = {
      type: 'line',
      data: {
        labels: curveData.map(d => d.time.toString()),
        datasets: [
          {
            label: 'Battery Charge Level (%)',
            data: curveData.map(d => d.charge),
            borderColor: 'rgb(75, 192, 192)',
            backgroundColor: 'rgba(75, 192, 192, 0.1)',
            tension: 0.4,
            fill: true,
            pointRadius: 0,
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
              title: (items) => {
                const minutes = parseInt(items[0].label);
                const hours = Math.floor(minutes / 60);
                const mins = minutes % 60;
                if (hours > 0) {
                  return `${hours}h ${mins}m`;
                }
                return `${mins} minutes`;
              },
              label: (context) => {
                const value = context.parsed.y;
                if (value === null || value === undefined) return '';
                return `${value.toFixed(1)}% charged`;
              }
            }
          }
        },
        scales: {
          x: {
            title: {
              display: true,
              text: 'Time (minutes)'
            },
            ticks: {
              callback: function(value, index) {
                const minutes = parseInt(this.getLabelForValue(value as number));
                if (minutes === 0) return '0';
                if (minutes % 60 === 0) {
                  return `${minutes / 60}h`;
                }
                return '';
              },
              maxTicksLimit: 10
            }
          },
          y: {
            title: {
              display: true,
              text: 'Battery Charge (%)'
            },
            min: Math.max(0, formData.initialCharge - 5),
            max: Math.min(100, formData.targetCharge + 5),
            ticks: {
              callback: function(value) {
                return value + '%';
              }
            }
          }
        }
      }
    };
  });

  // Helper function to generate a description based on the limiting factor
  function getLimitingFactorDescription(
    factor?: 'c-rate' | 'phases' | 'temperature' | 'connector' | null,
    requestedPower?: number
  ): string {
    if (!factor || factor === null) return 'Maximum available power';

    switch (factor) {
      case 'c-rate':
        return 'Limited by battery capacity';
      case 'phases':
        return 'Limited by charging phases';
      case 'temperature':
        return 'Limited by battery temperature';
      case 'connector':
        return 'Limited by charging connector';
      default:
        return 'Limited by unknown factor';
    }
  }
</script>

<Card {title}>
  <Stats {stats} />

  <!-- Charging Curve Graph -->
  <div class="mt-6">
    <h3 class="text-lg font-semibold mb-3">Charging Progress Over Time</h3>
    <Chart config={chartConfig} height="300px" />
  </div>

  {#if results.technicalLimitExceeded}
    <Alert
      type="warning"
      message="The charging power exceeds technical limits for this battery size. The calculator has adjusted to a safer maximum charging rate."
    />
  {/if}

  {#if results.limitingFactor === 'temperature'}
    <Alert
      type="info"
      message="Battery temperature affects charging speed. Cold batteries charge significantly slower."
    />
  {/if}

  {#if results.limitingFactor === 'phases'}
    <Alert
      type="info"
      message={formData.phases >= 3
        ? 'Your charging power exceeds what a typical home installation can deliver even with maximum phases.'
        : 'Charging is limited by the available phases. Multi-phase charging enables faster charging.'}
    />
  {/if}

  {#if results.limitingFactor === 'connector'}
    <Alert type="info" message="Charging is limited by the DC connector's maximum power rating." />
  {/if}
</Card>
