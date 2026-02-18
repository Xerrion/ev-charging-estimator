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

	// Just update the local input value without triggering onChange
	function handleInputChange(e: Event) {
		const target = e.target as HTMLInputElement;
		inputValue = target.value;
	}

	// Handle range slider input - this should update immediately
	function handleSliderChange(e: Event) {
		const target = e.target as HTMLInputElement;
		const numValue = Number(target.value);
		onChange(numValue);
	}

	// Handle blur event to apply changes when focus is lost
	function handleBlur() {
		let numValue = parseFloat(inputValue);

		// If the input is empty or not a number, default to minimum value
		if (inputValue === '' || isNaN(numValue)) {
			numValue = min;
			inputValue = min.toString();
		}

		// Clamp the value to min/max
		const clampedValue = Math.max(min, Math.min(max, numValue));
		onChange(clampedValue);
	}
</script>

<div class="mb-4">
	<div class="mb-3 flex items-center justify-between">
		<div class="text-base-content text-sm font-medium">{label}</div>
		<label
			class="input input-sm input-bordered flex h-8 min-h-8 w-36 items-center gap-2 rounded-md px-2 shadow-sm"
		>
			<input
				type="number"
				value={formatDisplayValue(inputValue)}
				oninput={handleInputChange}
				onblur={handleBlur}
				{min}
				{max}
				{step}
				aria-label={`Manual input for ${label}`}
				class="grow border-none text-right text-sm focus:border-none focus:outline-none"
			/>
			<span class="text-base-content/70 text-xs font-medium">{unit}</span>
		</label>
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
