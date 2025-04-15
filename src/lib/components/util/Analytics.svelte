<script lang="ts">
	import { onMount } from 'svelte';
	import { page, navigating } from '$app/state';
	import { browser } from '$app/environment';

	// Check if we're in production mode
	// Vite exposes this as import.meta.env.PROD (boolean)
	const isProd = import.meta.env.PROD;

	// Check if analytics should be enabled in development
	const enableInDev = import.meta.env.VITE_ENABLE_ANALYTICS_IN_DEV === 'true';

	// Analytics configuration
	const ANALYTICS_CONFIG = {
		// Only enable in production by default, or if explicitly enabled in development
		enabled: isProd || (enableInDev && !isProd),
		provider: 'umami', // Options: 'umami', 'plausible', 'ga4', 'none'
		websiteId: import.meta.env.VITE_ANALYTICS_ID || 'your-website-id',
		scriptUrl: import.meta.env.VITE_ANALYTICS_URL || 'https://analytics.yourdomain.com/script.js'
	};

	// Debug output in development
	if (!isProd && browser) {
		console.info('[Analytics] Running in development mode - tracking disabled');
		console.info('[Analytics] Config:', ANALYTICS_CONFIG);
	}

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
			loadAnalytics().then((success) => {
				analyticsLoaded = success;
				if (success) {
					// Track initial page view
					trackPageView(getPath(), document.title);

					if (!isProd) {
						console.info('[Analytics] Successfully loaded and initialized');
					}
				}
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
			// Skip if not in production and not explicitly forced
			if (!ANALYTICS_CONFIG.enabled) {
				return false;
			}

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
					return false;
			}

			document.head.appendChild(script);

			// Wait for script to load
			return new Promise<boolean>((resolve) => {
				script.onload = () => resolve(true);
				script.onerror = () => {
					console.error('[Analytics] Failed to load script');
					resolve(false);
				};
			});
		} catch (error) {
			console.error('[Analytics] Error:', error);
			return false;
		}
	}

	// Track page views
	function trackPageView(path: string, title: string) {
		try {
			// Skip tracking if not enabled
			if (!ANALYTICS_CONFIG.enabled) {
				return;
			}

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

						if (!isProd) {
							console.info('[Analytics] Tracked page view:', path);
						}
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
			console.error('[Analytics] Error tracking page view:', error);
		}
	}
</script>

<!-- This component doesn't render anything visible -->
