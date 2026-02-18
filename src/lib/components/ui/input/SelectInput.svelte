<script lang="ts">
	import type { InputOption } from '$lib/types/input';

	let {
		label,
		options,
		value,
		onChange,
		id,
		required = false,
		disabled = false,
		ariaDescribedBy = undefined
	} = $props<{
		label: string;
		options: InputOption[];
		value: string;
		onChange: (value: string) => void;
		id: string;
		required?: boolean;
		disabled?: boolean;
		ariaDescribedBy?: string;
	}>();
</script>

<div class="mb-4">
	<div class="mb-3 flex items-center justify-between">
		<label for={id} class="text-base-content text-sm font-medium">
			{label}{required ? ' *' : ''}
		</label>
	</div>
	<select
		{id}
		class="select select-bordered w-full rounded-md shadow-sm"
		class:cursor-not-allowed={disabled}
		class:opacity-60={disabled}
		value={value}
		{required}
		{disabled}
		aria-describedby={ariaDescribedBy}
		onchange={(e) => onChange(e.currentTarget.value)}
	>
		{#each options as option}
			<option value={option.value}>{option.label}</option>
		{/each}
	</select>
</div>