<script lang="ts">
	import { onMount } from 'svelte';
	import { page, navigating } from '$app/state';

	// Analytics configuration
	const ANALYTICS_CONFIG = {
		enabled: true,
		provider: 'umami', // Options: 'umami', 'plausible', 'ga4', 'none'
		websiteId: 'your-website-id', // Umami website ID or measurement ID for other services
		scriptUrl: 'https://analytics.yourdomain.com/script.js' // URL to your analytics script
	};

	// Flag to track if analytics is loaded
	let analyticsLoaded = $state(false);

	// Page state values
	const getPath = () => page.url.pathname;
	const isNavigationComplete = () => !navigating.complete;

	// Track page views when route changes
	$effect(() => {
		if (analyticsLoaded && ANALYTICS_CONFIG.enabled) {
			const path = getPath();
			const title = document.title;

			// Only track when navigation is complete
			if (isNavigationComplete()) {
				// Track page view in analytics
				trackPageView(path, title);
			}
		}
	});

	// Initialize analytics
	onMount(() => {
		if (ANALYTICS_CONFIG.enabled && ANALYTICS_CONFIG.provider !== 'none') {
			// Load analytics script
			loadAnalytics().then(() => {
				analyticsLoaded = true;
				// Track initial page view
				trackPageView(getPath(), document.title);
			});
		}

		// Clean up function
		return () => {
			// Any cleanup code if needed
		};
	});

	// Function to load analytics script
	async function loadAnalytics() {
		try {
			const script = document.createElement('script');
			script.defer = true;
			script.async = true;

			// Configure based on provider
			switch (ANALYTICS_CONFIG.provider) {
				case 'umami':
					script.src = ANALYTICS_CONFIG.scriptUrl;
					script.setAttribute('data-website-id', ANALYTICS_CONFIG.websiteId);
					script.setAttribute('data-auto-track', 'false'); // We'll handle tracking manually
					break;

				case 'plausible':
					script.src = ANALYTICS_CONFIG.scriptUrl || 'https://plausible.io/js/script.js';
					script.dataset.domain = window.location.hostname;
					break;

				case 'ga4':
					// For Google Analytics, we need to load two scripts
					const gaScript = document.createElement('script');
					gaScript.async = true;
					gaScript.src = `https://www.googletagmanager.com/gtag/js?id=${ANALYTICS_CONFIG.websiteId}`;
					document.head.appendChild(gaScript);

					// Set up the gtag function
					window.dataLayer = window.dataLayer || [];
					window.gtag = function (...args: any[]) {
						window.dataLayer?.push(arguments);
					};
					window.gtag('js', new Date() as any);
					break;

				default:
					return Promise.resolve(false);
			}

			document.head.appendChild(script);

			// Wait for script to load
			return new Promise((resolve) => {
				script.onload = () => resolve(true);
			});
		} catch (error) {
			console.error('Failed to load analytics:', error);
			return Promise.resolve(false);
		}
	}

	// Track page views
	function trackPageView(path: string, title: string) {
		try {
			switch (ANALYTICS_CONFIG.provider) {
				case 'umami':
					if (window.umami) {
						// Track page view with Umami's trackView function
						window.umami.trackView(path);

						// Track additional page data
						window.umami.track('page_view', {
							path,
							title,
							referrer: document.referrer || 'direct'
						});
					}
					break;

				case 'plausible':
					if (typeof window.plausible === 'function') {
						window.plausible('pageview', { props: { path, title } });
					}
					break;

				case 'ga4':
					if (typeof window.gtag === 'function') {
						window.gtag('config', ANALYTICS_CONFIG.websiteId, {
							page_path: path,
							page_title: title
						});
					}
					break;
			}
		} catch (error) {
			console.error('Error tracking page view:', error);
		}
	}
</script>

<!-- This component doesn't render anything visible -->
