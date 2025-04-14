<script lang="ts">
	import '../app.css';
	import ThemeSwitcher from '$lib/components/ui/ThemeSwitcher.svelte';
	import Navigation from '$lib/components/layout/Navigation.svelte';

	let { children } = $props();
</script>

<div class="flex min-h-screen flex-col transition-colors">
	<header class="bg-base-100 border-base-300 border-b px-7 shadow-sm">
		<div class="container-custom flex items-center justify-between py-4">
			<h1 class="text-primary text-xl font-bold">EV Calculator Hub</h1>
			<Navigation />
			<ThemeSwitcher />
		</div>
	</header>

	<main class="container-custom flex-grow py-8">
		<div class="mx-auto w-full max-w-3xl">
			{@render children()}
		</div>
	</main>
</div>
