<script lang="ts">
	let {
		label,
		value,
		onChange,
		id,
		placeholder = '',
		required = false,
		disabled = false,
		pattern = undefined,
		min = undefined,
		max = undefined,
		maxlength = undefined,
		minlength = undefined,
		autocomplete = undefined,
		ariaDescribedBy = undefined,
		errorMessage = ''
	} = $props<{
		label: string;
		value: string;
		onChange: (value: string) => void;
		id: string;
		placeholder?: string;
		required?: boolean;
		disabled?: boolean;
		pattern?: string;
		min?: number;
		max?: number;
		maxlength?: number;
		minlength?: number;
		autocomplete?: string;
		ariaDescribedBy?: string;
		errorMessage?: string;
	}>();

	let hasError = $state(false);
	let touched = $state(false);

	function validateInput(inputValue: string): boolean {
		if (required && inputValue.trim() === '') return false;
		if (pattern && inputValue) {
			const regex = new RegExp(pattern);
			if (!regex.test(inputValue)) return false;
		}
		if (maxlength && inputValue.length > maxlength) return false;
		if (minlength && inputValue.length < minlength) return false;

		return true;
	}

	function handleInput(e: Event) {
		const target = e.target as HTMLInputElement;
		onChange(target.value);
		
		if (touched) {
			hasError = !validateInput(target.value);
		}
	}

	function handleBlur() {
		touched = true;
		hasError = !validateInput(value);
	}

	$effect(() => {
		if (touched) {
			hasError = !validateInput(value);
		}
	});

	const errorId = `${id}-error`;
</script>

<div class="mb-4">
	<div class="mb-3 flex items-center justify-between">
		<label for={id} class="text-base-content text-sm font-medium">
			{label}{required ? ' *' : ''}
		</label>
	</div>
	<input
		type="text"
		{id}
		class="input input-bordered w-full rounded-md shadow-sm"
		class:input-error={hasError}
		class:cursor-not-allowed={disabled}
		class:opacity-60={disabled}
		{placeholder}
		{required}
		{disabled}
		{pattern}
		{maxlength}
		{minlength}
		{autocomplete}
		aria-invalid={hasError}
		aria-describedby={hasError ? errorId : ariaDescribedBy}
		value={value}
		oninput={handleInput}
		onblur={handleBlur}
	/>
	{#if hasError && errorMessage}
		<div id={errorId} class="mt-2 text-sm text-error">
			{errorMessage}
		</div>
	{/if}
</div>