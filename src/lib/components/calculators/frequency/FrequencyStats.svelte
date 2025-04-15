<script lang="ts">
  import { calculateCO2Savings, isSafetyChargeAdded, generateFrequencyStats } from '$lib/utils/calculations';
  import Stats from '$lib/components/ui/Stats.svelte';

  type Result = {
    effectiveRangeKm: number;
    weeklyCharges: number;
  };

  type StatItem = {
    title: string;
    value: number | string;
    unit?: string;
    description?: string;
    color?: 'primary' | 'secondary' | 'accent' | 'info' | 'success' | 'warning' | 'error';
  };

  let { results, formData } = $props<{
    results: Result;
    formData: {
      weeklyDistanceKm: number;
      batteryKwh: number;
      usableFraction: number;
    };
  }>();

  let co2Savings = $state(0);
  let stats = $state<StatItem[]>([]);
  let safetyChargeAdded = $state(false);

  $effect(() => {
    if (results.weeklyCharges > 0) {
      co2Savings = calculateCO2Savings({
        weeklyDistanceKm: formData.weeklyDistanceKm
      });

      // Check if a safety charge was added using the utility function
      safetyChargeAdded = isSafetyChargeAdded({
        weeklyDistanceKm: formData.weeklyDistanceKm,
        effectiveRangeKm: results.effectiveRangeKm
      });
    } else {
      co2Savings = 0;
      safetyChargeAdded = false;
    }
  });

  $effect(() => {
    stats = generateFrequencyStats({
      effectiveRangeKm: results.effectiveRangeKm,
      weeklyCharges: results.weeklyCharges,
      co2Savings,
      safetyChargeAdded
    });
  });
</script>

<Stats {stats} />
