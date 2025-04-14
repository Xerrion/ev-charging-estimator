<script lang="ts">
	import { saveData, getData } from '$lib/utils/storage';
	import { onMount } from 'svelte';

	let theme = $state<'light' | 'dark'>(getData().theme);
	let isInitialized = $state(false);

	// Apply theme changes and save to storage
	$effect(() => {
		// Skip the initial theme application since we handle it in onMount
		if (!isInitialized) return;

		if (typeof document !== 'undefined') {
			// Use data-theme on body element as required by DaisyUI
			document.body.setAttribute('data-theme', theme);

			// Save theme preference to localStorage
			saveData({ theme });
		}
	});

	// Initialize theme on component mount
	onMount(() => {
		// Get the theme from storage
		const savedData = getData();
		theme = savedData.theme;

		// Apply theme on mount
		document.body.setAttribute('data-theme', theme);

		// Set initialized flag to allow the effect to run on future changes
		isInitialized = true;
	});

	// Toggle between light and dark theme
	function toggleTheme() {
		theme = theme === 'light' ? 'dark' : 'light';
	}
</script>

<button
	type="button"
	class="hover:bg-base-200 flex items-center justify-center rounded-full p-2 text-sm transition-colors"
	onclick={toggleTheme}
	aria-label={theme === 'light' ? 'Switch to dark theme' : 'Switch to light theme'}
>
	{#if theme === 'light'}
		<!-- Sun icon -->
		<svg
			xmlns="http://www.w3.org/2000/svg"
			width="20"
			height="20"
			viewBox="0 0 24 24"
			fill="none"
			stroke="currentColor"
			stroke-width="2"
			stroke-linecap="round"
			stroke-linejoin="round"
			class="text-warning"
		>
			<circle cx="12" cy="12" r="5"></circle>
			<line x1="12" y1="1" x2="12" y2="3"></line>
			<line x1="12" y1="21" x2="12" y2="23"></line>
			<line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
			<line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
			<line x1="1" y1="12" x2="3" y2="12"></line>
			<line x1="21" y1="12" x2="23" y2="12"></line>
			<line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
			<line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
		</svg>
	{:else}
		<!-- Moon icon -->
		<svg
			xmlns="http://www.w3.org/2000/svg"
			width="20"
			height="20"
			viewBox="0 0 24 24"
			fill="none"
			stroke="currentColor"
			stroke-width="2"
			stroke-linecap="round"
			stroke-linejoin="round"
			class="text-primary"
		>
			<path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
		</svg>
	{/if}
</button>
