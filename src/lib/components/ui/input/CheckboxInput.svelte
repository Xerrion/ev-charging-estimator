<script lang="ts">
	let {
		label,
		value,
		onChange,
		id,
		required = false,
		disabled = false,
		ariaDescribedBy = undefined
	} = $props<{
		label: string;
		value: boolean;
		onChange: (value: boolean) => void;
		id: string;
		required?: boolean;
		disabled?: boolean;
		ariaDescribedBy?: string;
	}>();
</script>

<div class="mb-4 flex items-center gap-2">
	<input
		type="checkbox"
		{id}
		class="checkbox checkbox-primary"
		class:cursor-not-allowed={disabled}
		class:opacity-60={disabled}
		checked={value}
		{required}
		{disabled}
		aria-describedby={ariaDescribedBy}
		onchange={(e) => onChange(e.currentTarget.checked)}
		onkeydown={(e) => {
			if (e.key === 'Enter' || e.key === ' ') {
				e.preventDefault();
				onChange(!value);
			}
		}}
	/>
	<label 
		for={id} 
		class="text-base-content text-sm font-medium"
		class:cursor-pointer={!disabled}
		class:opacity-60={disabled}
	>
		{label}{required ? ' *' : ''}
	</label>
</div>