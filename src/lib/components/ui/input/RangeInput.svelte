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
		allowDecimals = false,
		disabled = false,
		required = false,
		// Removed unused ariaDescribedBy
	} = $props<{
		label: string;
		value: number;
		min: number;
		max: number;
		step?: number;
		unit?: string;
		onChange: (value: number) => void;
		id: string;
		allowDecimals?: boolean;
		disabled?: boolean;
		required?: boolean;
		ariaDescribedBy?: string;
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
	
	// Calculate the percentage for aria-valuetext
	function getPercentage(val: number): number {
		return Math.round(((val - min) / (max - min)) * 100);
	}
	
	// Generate a human-readable description for screen readers
	function getValueText(val: number): string {
		return `${val}${unit} (${getPercentage(val)}%)`;
	}
	
	const valueDescription = `Adjustable range from ${min} to ${max}${unit}`;
	const rangeId = `${id}-range-description`;
</script>

<div class="mb-4">
	<div class="mb-3 flex items-center justify-between">
		<div id={`${id}-label`} class="text-base-content text-sm font-medium">
			{label}{required ? ' *' : ''}
		</div>
		<label
			class="input input-sm input-bordered flex h-8 min-h-8 w-36 items-center gap-2 rounded-md px-2 shadow-sm"
			class:cursor-not-allowed={disabled}
			for={`${id}-number-input`}
		>
			<input
				type="number"
				id={`${id}-number-input`}
				value={formatDisplayValue(inputValue)}
				oninput={handleInputChange}
				onblur={handleBlur}
				{min}
				{max}
				{step}
				{disabled}
				aria-label={`Manual input for ${label}`}
				aria-describedby={rangeId}
				class="grow border-none text-right text-sm focus:border-none focus:outline-none"
				class:opacity-60={disabled}
			/>
			<span class="text-base-content/70 text-xs font-medium" aria-hidden="true">{unit}</span>
		</label>
	</div>
	<div class="pt-1">
		<div id={rangeId} class="sr-only">{valueDescription}</div>
		<input
			{id}
			type="range"
			{min}
			{max}
			{step}
			{value}
			{disabled}
			oninput={handleSliderChange}
			onkeydown={(e) => {
				// Make Home and End keys work
				if (e.key === 'Home') {
					e.preventDefault();
					onChange(min);
				} else if (e.key === 'End') {
					e.preventDefault();
					onChange(max);
				} else if (e.key === 'PageUp') {
					e.preventDefault();
					const newValue = Math.min(max, value + (max - min) / 10);
					onChange(newValue);
				} else if (e.key === 'PageDown') {
					e.preventDefault();
					const newValue = Math.max(min, value - (max - min) / 10);
					onChange(newValue);
				}
			}}
			class="range range-primary w-full"
			class:cursor-not-allowed={disabled}
			class:opacity-60={disabled}
			aria-labelledby={`${id}-label`}
			aria-valuemin={min}
			aria-valuemax={max}
			aria-valuenow={value}
			aria-valuetext={getValueText(value)}
			tabindex={disabled ? -1 : 0}
		/>
		<div class="text-base-content/60 mt-1 flex justify-between text-xs">
			<span>{min}{unit}</span>
			<span>{max}{unit}</span>
		</div>
	</div>
</div>
