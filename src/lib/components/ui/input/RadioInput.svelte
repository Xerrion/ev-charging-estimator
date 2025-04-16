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
	<div class="mb-3"> 
		<label for={`${id}-option-0`} id={`${id}-group-label`} class="text-base-content text-sm font-medium">
			{label}{required ? ' *' : ''}
		</label>
	</div>
	<div 
		class="mt-1 flex flex-wrap gap-4" 
		role="radiogroup" 
		aria-labelledby={`${id}-group-label`}
		aria-describedby={ariaDescribedBy}
	>
		{#each options as option, i}
			<label 
				class="flex items-center" 
				class:cursor-pointer={!disabled}
				class:opacity-60={disabled}
			>
				<input
					type="radio"
					name={id}
					id={`${id}-option-${i}`}
					value={option.value}
					checked={value === option.value}
					{disabled}
					{required}
					onchange={() => onChange(option.value)}
					onkeydown={(e) => {
						if (e.key === 'Enter') {
							e.preventDefault();
							onChange(option.value);
						}
					}}
					class="radio radio-primary mr-2 h-4 w-4"
					class:cursor-not-allowed={disabled}
				/>
				<span>{option.label}</span>
			</label>
		{/each}
	</div>
</div>