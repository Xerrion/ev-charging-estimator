<script lang="ts">
	import { onMount } from 'svelte';
	import successIcon from '$lib/assets/icons/success.svg';
	import infoIcon from '$lib/assets/icons/info.svg';
	import warningIcon from '$lib/assets/icons/warning.svg';
	import errorIcon from '$lib/assets/icons/error.svg';
	import xIcon from '$lib/assets/icons/x.svg';

	type AlertType = 'info' | 'success' | 'warning' | 'error';
	type AlertStyle = 'default' | 'soft' | 'outline';

	let {
		type = 'info',
		style = 'default',
		message = '',
		className = '',
		dismissible = false,
		onDismiss = () => {}
	} = $props<{
		type?: AlertType;
		style?: AlertStyle;
		message?: string;
		className?: string;
		dismissible?: boolean;
		onDismiss?: () => void;
	}>();

	let visible = $state(true);
	let icon = $state('');

	$effect(() => {
		// Set icon based on alert type
		switch (type) {
			case 'success':
				icon = successIcon;
				break;
			case 'info':
				icon = infoIcon;
				break;
			case 'warning':
				icon = warningIcon;
				break;
			case 'error':
				icon = errorIcon;
				break;
		}
	});

	// Define style class based on the style prop
	let styleClass = $derived(() => {
		switch (style) {
			case 'soft':
				return 'alert-soft';
			case 'outline':
				return 'alert-outline';
			default:
				return '';
		}
	});

	function dismiss() {
		visible = false;
		onDismiss();
	}
</script>

{#if visible}
	<div class="alert alert-{type} {styleClass} {className}">
		<div class="flex items-center">
			<img src={icon} alt="{type} icon" class="mr-2 h-5 w-5" />
			<span>{message}</span>
		</div>
		{#if dismissible}
			<button class="btn btn-ghost btn-sm" onclick={dismiss}>
				<img src={xIcon} alt="Close" class="h-5 w-5" />
			</button>
		{/if}
	</div>
{/if}
