<script lang="ts">
	let {
		label,
		value,
		min,
		max,
		step = 1,
		unit = '',
		onChange,
		id,
		allowManualInput = true,
		allowDecimals = false
	} = $props<{
		label: string;
		value: number;
		min: number;
		max: number;
		step?: number;
		unit?: string;
		onChange: (value: number) => void;
		id: string;
		allowManualInput?: boolean;
		allowDecimals?: boolean;
		inputWidth?: string;
	}>();

	// Local state for manual input value
	let inputValue = $state(value.toString());

	// Update local input value when prop value changes
	$effect(() => {
		inputValue = value.toString();
	});

	// Format the display value with appropriate number of decimal places
	function formatDisplayValue(val: string): string {
		const numValue = parseFloat(val);
		if (isNaN(numValue)) return val;

		if (allowDecimals && step < 1) {
			// Determine decimal places based on step
			const decimalPlaces = step.toString().split('.')[1]?.length || 1;
			return numValue.toFixed(decimalPlaces);
		}

		return numValue.toString();
	}

	// Handle manual input change
	function handleInputChange(e: Event) {
		const target = e.target as HTMLInputElement;
		inputValue = target.value;

		const numValue = parseFloat(inputValue);
		if (!isNaN(numValue)) {
			// Clamp the value to min/max
			const clampedValue = Math.max(min, Math.min(max, numValue));
			onChange(clampedValue);
		}
	}

	// Handle range slider input
	function handleSliderChange(e: Event) {
		const target = e.target as HTMLInputElement;
		const numValue = Number(target.value);
		onChange(numValue);
	}
</script>

<div class="mb-4">
	<div class="mb-3 flex items-center justify-between">
		<div class="text-base-content text-sm font-medium">{label}</div>
		{#if allowManualInput}
			<label
				class="input input-sm input-bordered flex h-8 min-h-8 w-36 items-center gap-2 rounded-md px-2 shadow-sm"
			>
				<input
					type="number"
					value={formatDisplayValue(inputValue)}
					oninput={handleInputChange}
					{min}
					{max}
					{step}
					aria-label={`Manual input for ${label}`}
					class="grow border-none text-right text-sm focus:border-none focus:outline-none"
				/>
				<span class="text-base-content/70 text-xs font-medium">{unit}</span>
			</label>
		{:else}
			<span class="text-base-content text-sm font-medium"
				>{formatDisplayValue(value.toString())}{unit}</span
			>
		{/if}
	</div>
	<div class="pt-1">
		<input
			{id}
			type="range"
			{min}
			{max}
			{step}
			{value}
			oninput={handleSliderChange}
			class="range range-primary w-full"
		/>
		<div class="text-base-content/60 mt-1 flex justify-between text-xs">
			<span>{min}{unit}</span>
			<span>{max}{unit}</span>
		</div>
	</div>
</div>
