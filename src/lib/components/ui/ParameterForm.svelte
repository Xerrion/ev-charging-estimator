<script lang="ts">
  import RangeInput from '$lib/components/ui/RangeInput.svelte';
  import Card from '$lib/components/ui/Card.svelte';

  type InputConfig = {
    id: string;
    label: string;
    min: number;
    max: number;
    step: number;
    unit: string;
    allowDecimals: boolean;
    getValue: () => number;
    setValue: (val: number) => void;
  };

  let { inputs, title } = $props<{
    inputs: InputConfig[];
    title: string;
  }>();
</script>

<Card {title}>
  <svelte:fragment>
    <div class="flex flex-col gap-4">
      {#each inputs as input (input.id)}
        <RangeInput
          label={input.label}
          value={input.getValue()}
          min={input.min}
          max={input.max}
          step={input.step}
          unit={input.unit}
          onChange={input.setValue}
          id={input.id}
          allowManualInput={true}
          allowDecimals={input.allowDecimals}
        />
      {/each}
    </div>
  </svelte:fragment>
</Card>
