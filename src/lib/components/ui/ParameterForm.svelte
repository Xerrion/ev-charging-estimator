<script lang="ts">
  import RangeInput from '$lib/components/ui/RangeInput.svelte';
  import Card from '$lib/components/ui/Card.svelte';

  type RangeInputConfig = {
    id: string;
    label: string;
    min: number;
    max: number;
    step: number;
    unit: string;
    allowDecimals: boolean;
    getValue: () => number;
    setValue: (val: number) => void;
    type?: 'range';
  };

  type SelectOption = {
    value: string;
    label: string;
  };

  type SelectInputConfig = {
    id: string;
    label: string;
    options: SelectOption[];
    getValue: () => string;
    setValue: (val: string) => void;
    type: 'select';
  };

  type RadioInputConfig = {
    id: string;
    label: string;
    options: SelectOption[];
    getValue: () => string;
    setValue: (val: string) => void;
    type: 'radio';
  };

  type InputConfig = RangeInputConfig | SelectInputConfig | RadioInputConfig;

  let { inputs, title } = $props<{
    inputs: InputConfig[];
    title: string;
  }>();

  function isSelectInput(input: InputConfig): input is SelectInputConfig {
    return input.type === 'select';
  }

  function isRadioInput(input: InputConfig): input is RadioInputConfig {
    return input.type === 'radio';
  }
</script>

<Card {title}>
  <svelte:fragment>
    <div class="flex flex-col gap-4">
      {#each inputs as input (input.id)}
        {#if isSelectInput(input)}
          <div class="flex flex-col gap-2">
            <label for={input.id} class="text-sm font-medium">{input.label}</label>
            <select
              id={input.id}
              class="w-full rounded border border-gray-300 p-2 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              value={input.getValue()}
              onchange={(e) => input.setValue(e.currentTarget.value)}
            >
              {#each input.options as option}
                <option value={option.value}>{option.label}</option>
              {/each}
            </select>
          </div>
        {:else if isRadioInput(input)}
          <div class="flex flex-col gap-2">
            <label class="text-sm font-medium">{input.label}</label>
            <div class="mt-1 flex flex-wrap gap-4">
              {#each input.options as option}
                <label class="flex cursor-pointer items-center">
                  <input
                    type="radio"
                    name={input.id}
                    value={option.value}
                    checked={input.getValue() === option.value}
                    onchange={() => input.setValue(option.value)}
                    class="mr-2 h-4 w-4 text-blue-600"
                  />
                  <span>{option.label}</span>
                </label>
              {/each}
            </div>
          </div>
        {:else}
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
        {/if}
      {/each}
    </div>
  </svelte:fragment>
</Card>
