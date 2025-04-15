<script lang="ts">
	import '../app.css';
	import ThemeSwitcher from '$lib/components/ui/ThemeSwitcher.svelte';
	import Navigation from '$lib/components/layout/Navigation.svelte';
	import { page } from '$app/state';
	import Analytics from '$lib/components/util/Analytics.svelte';

	let { children } = $props();

	// Default SEO data
	const defaultSeo = {
		title: 'EV Calculator Hub',
		description:
			'Tools to calculate EV charging frequency, time and costs for electric vehicle owners',
		type: 'website',
		image: '/images/ev-calculator-social.png',
		twitterCard: 'summary_large_image'
	};

	// Page-specific SEO data based on route
	$effect(() => {
		const path = page.url.pathname;

		// Update page title based on the current route
		if (path === '/') {
			seoData.title = 'EV Charge Frequency Calculator | EV Calculator Hub';
			seoData.description =
				'Calculate how many times you need to charge your electric vehicle per week based on your driving habits';
		} else if (path === '/charging-time') {
			seoData.title = 'EV Charging Time Calculator | EV Calculator Hub';
			seoData.description =
				'Calculate how long it will take to charge your electric vehicle from any state of charge';
		} else if (path === '/cost') {
			seoData.title = 'EV Charging Cost Calculator | EV Calculator Hub';
			seoData.description =
				'Calculate the cost of charging your electric vehicle at home or at public stations';
		}
	});

	// Combine default and page-specific SEO data
	let seoData = $state({ ...defaultSeo });
</script>

<svelte:head>
	<title>{seoData.title}</title>
	<meta name="description" content={seoData.description} />

	<!-- Open Graph / Facebook -->
	<meta property="og:type" content={seoData.type} />
	<meta property="og:url" content={page.url.href} />
	<meta property="og:title" content={seoData.title} />
	<meta property="og:description" content={seoData.description} />
	<meta property="og:image" content={seoData.image} />

	<!-- Twitter -->
	<meta name="twitter:card" content={seoData.twitterCard} />
	<meta name="twitter:title" content={seoData.title} />
	<meta name="twitter:description" content={seoData.description} />
	<meta name="twitter:image" content={seoData.image} />

	<!-- Canonical URL -->
	<link rel="canonical" href={page.url.href} />
</svelte:head>

<!-- Include Analytics component (doesn't render anything visible) -->
<Analytics />

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
