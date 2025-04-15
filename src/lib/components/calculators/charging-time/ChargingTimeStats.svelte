<script lang="ts">
  import Stats from '$lib/components/ui/Stats.svelte';
  import { formatTime, generateChargingTimeStats } from '$lib/utils/calculations';
  import Alert from '$lib/components/ui/Alert.svelte';
  import Card from '$lib/components/ui/Card.svelte';

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
    };
    title?: string;
  }>();

  let stats = $state<StatItem[]>([]);

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

  <Stats {stats} />
</Card>
