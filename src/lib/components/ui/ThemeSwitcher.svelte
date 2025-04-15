<script lang="ts">
	import { saveData, getData } from '$lib/utils/storage';
	import { onMount } from 'svelte';
	import SunIcon from '$lib/assets/icons/sun.svg?raw';
	import MoonIcon from '$lib/assets/icons/moon.svg?raw';

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

<label class="flex cursor-pointer gap-2">
	{@html SunIcon}
	<input
		type="checkbox"
		class="toggle theme-controller"
		checked={theme === 'dark'}
		onclick={toggleTheme}
		aria-label={theme === 'light' ? 'Switch to dark theme' : 'Switch to light theme'}
	/>
	{@html MoonIcon}
</label>
