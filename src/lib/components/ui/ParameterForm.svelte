<script lang="ts">
  import Card from '$lib/components/ui/Card.svelte';
  import RangeInput from '$lib/components/ui/input/RangeInput.svelte';
  import SelectInput from '$lib/components/ui/input/SelectInput.svelte';
  import RadioInput from '$lib/components/ui/input/RadioInput.svelte';
  import CheckboxInput from '$lib/components/ui/input/CheckboxInput.svelte';
  import TextInput from '$lib/components/ui/input/TextInput.svelte';
  import NumberInput from '$lib/components/ui/input/NumberInput.svelte';
  import type {
    InputConfig,
    SelectInputConfig,
    RadioInputConfig,
    CheckboxInputConfig,
    TextInputConfig,
    NumberInputConfig
  } from '$lib/types/input';

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

  function isCheckboxInput(input: InputConfig): input is CheckboxInputConfig {
    return input.type === 'checkbox';
  }

  function isTextInput(input: InputConfig): input is TextInputConfig {
    return input.type === 'text';
  }

  function isNumberInput(input: InputConfig): input is NumberInputConfig {
    return input.type === 'number';
  }
</script>

<Card {title}>
  <div class="flex flex-col gap-4">
    {#each inputs as input (input.id)}
      {#if isSelectInput(input)}
        <SelectInput
          label={input.label}
          options={input.options}
          value={input.getValue()}
          onChange={input.setValue}
          id={input.id}
        />
      {:else if isRadioInput(input)}
        <RadioInput
          label={input.label}
          options={input.options}
          value={input.getValue()}
          onChange={input.setValue}
          id={input.id}
        />
      {:else if isCheckboxInput(input)}
        <CheckboxInput label={input.label} value={input.getValue()} onChange={input.setValue} id={input.id} />
      {:else if isTextInput(input)}
        <TextInput
          label={input.label}
          value={input.getValue()}
          onChange={input.setValue}
          id={input.id}
          placeholder={input.placeholder}
        />
      {:else if isNumberInput(input)}
        <NumberInput
          label={input.label}
          value={input.getValue()}
          onChange={input.setValue}
          id={input.id}
          min={input.min}
          max={input.max}
          step={input.step}
          unit={input.unit}
        />
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
          allowDecimals={input.allowDecimals}
        />
      {/if}
    {/each}
  </div>
</Card>
