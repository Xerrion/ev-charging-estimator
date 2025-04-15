<script lang="ts">
  import { generateCostStats } from '$lib/utils/calculations';
  import Stats from '$lib/components/ui/Stats.svelte';

  type CostResult = {
    costPerCharge: number;
    weeklyCost: number;
    monthlyCost: number;
    annualCost: number;
    energyPerCharge: number;
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

  $effect(() => {
    if (!hasError && results.costPerCharge > 0) {
      stats = generateCostStats({
        costPerCharge: results.costPerCharge,
        weeklyCost: results.weeklyCost,
        monthlyCost: results.monthlyCost,
        annualCost: results.annualCost,
        energyPerCharge: results.energyPerCharge,
        currency,
        chargeProvider
      });
    } else {
      // Default empty stats with N/A values when there's an error
      stats = [
        {
          title: 'Cost Per Charge',
          value: 'N/A',
          unit: currency,
          description: 'Estimated cost for a single charging session',
          color: 'accent'
        },
        {
          title: 'Weekly Cost',
          value: 'N/A',
          unit: currency,
          description: 'Projected weekly charging expenses',
          color: 'primary'
        },
        {
          title: 'Monthly Cost',
          value: 'N/A',
          unit: currency,
          description: 'Projected monthly charging expenses',
          color: 'info'
        },
        {
          title: 'Annual Cost',
          value: 'N/A',
          unit: currency,
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

<Stats {stats} {title} />
