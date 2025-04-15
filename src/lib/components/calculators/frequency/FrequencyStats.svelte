<script lang="ts">
  import { generateFrequencyStats, isSafetyChargeAdded } from '$lib/utils/calculations';
  import Stats from '$lib/components/ui/Stats.svelte';
  import Card from '$lib/components/ui/Card.svelte';
  import Alert from '$lib/components/ui/Alert.svelte';

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
  {#if safetyChargeAdded}
    <Alert
      type="warning"
      message="An extra safety charge has been added because your driving distance is very close to your vehicle's range"
      className="mb-4"
    />
  {/if}
  <Stats {stats} />
</Card>
