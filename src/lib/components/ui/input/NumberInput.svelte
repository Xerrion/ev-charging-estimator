<script lang="ts">
	let {
		label,
		value,
		onChange,
		id,
		min = undefined,
		max = undefined,
		step = 1,
		unit = '',
		required = false,
		disabled = false,
		ariaDescribedBy = undefined,
		errorMessage = ''
	} = $props<{
		label: string;
		value: number;
		onChange: (value: number) => void;
		id: string;
		min?: number;
		max?: number;
		step?: number;
		unit?: string;
		required?: boolean;
		disabled?: boolean;
		ariaDescribedBy?: string;
		errorMessage?: string;
	}>();

	let hasError = $state(false);
	let touched = $state(false);
	let inputValue = $state(value.toString());

	function validateInput(val: number): boolean {
		if (min !== undefined && val < min) return false;
		if (max !== undefined && val > max) return false;
		return true;
	}

	function handleInput(e: Event) {
		const target = e.target as HTMLInputElement;
		inputValue = target.value;
		
		// Only update if the input is a valid number
		const numValue = Number(target.value);
		if (!isNaN(numValue)) {
			onChange(numValue);
			
			if (touched) {
				hasError = !validateInput(numValue);
			}
		}
	}

	function handleBlur() {
		touched = true;
		const numValue = Number(inputValue);
		
		if (isNaN(numValue)) {
			inputValue = value.toString();
			return;
		}
		
		hasError = !validateInput(numValue);
		
		// Format the display value when losing focus
		if (!hasError) {
			// Ensure the input reflects the actual value
			inputValue = value.toString();
		}
	}

	$effect(() => {
		// Update input value when the prop changes
		if (!isNaN(value)) {
			inputValue = value.toString();
		}
		
		if (touched) {
			hasError = !validateInput(value);
		}
	});

	const errorId = `${id}-error`;
	const valueDescription = min !== undefined && max !== undefined 
		? `Value must be between ${min} and ${max}${unit ? ' ' + unit : ''}`
		: min !== undefined 
			? `Value must be at least ${min}${unit ? ' ' + unit : ''}`
			: max !== undefined
				? `Value must be at most ${max}${unit ? ' ' + unit : ''}`
				: '';
</script>

<div class="mb-4">
	<div class="mb-3 flex items-center justify-between">
		<label for={id} class="text-base-content text-sm font-medium">
			{label}{required ? ' *' : ''}
		</label>
		{#if valueDescription}
			<span id={`${id}-range`} class="text-xs text-base-content/70">
				{valueDescription}
			</span>
		{/if}
	</div>
	<label
		class="input input-bordered flex items-center gap-2 rounded-md shadow-sm"
		class:input-error={hasError}
		class:cursor-not-allowed={disabled}
	>
		<input
			type="number"
			{id}
			{min}
			{max}
			{step}
			{required}
			{disabled}
			value={inputValue}
			aria-invalid={hasError}
			aria-describedby={[
				hasError && errorMessage ? errorId : null, 
				valueDescription ? `${id}-range` : null, 
				ariaDescribedBy
			].filter(Boolean).join(' ') || undefined}
			oninput={handleInput}
			onblur={handleBlur}
			class="grow border-none text-right focus:border-none focus:outline-none"
			class:opacity-60={disabled}
		/>
		{#if unit}
			<span class="text-base-content/70 text-xs font-medium" aria-hidden="true">{unit}</span>
		{/if}
	</label>
	{#if hasError && errorMessage}
		<div id={errorId} class="mt-2 text-sm text-error" role="alert">
			{errorMessage}
		</div>
	{/if}
</div>