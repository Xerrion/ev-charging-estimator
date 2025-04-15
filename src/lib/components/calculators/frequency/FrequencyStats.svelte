<script lang="ts">
  import { generateFrequencyStats, isSafetyChargeAdded } from '$lib/utils/calculations';
  import Stats from '$lib/components/ui/Stats.svelte';
  import Card from '$lib/components/ui/Card.svelte';

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
  });
</script>

<Card {title}>
  <Stats {stats} />
</Card>
