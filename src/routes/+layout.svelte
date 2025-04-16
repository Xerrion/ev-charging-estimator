<script lang="ts">
  import '../app.css';
  import Navigation from '$lib/components/layout/Navigation.svelte';
  import Footer from '$lib/components/layout/Footer.svelte';
  import { page } from '$app/stores';
  import Analytics from '$lib/components/util/Analytics.svelte';
  import CookieBanner from '$lib/components/ui/CookieBanner.svelte';
  import { effectiveTheme } from '$lib/state/ThemeStore';
  import type { LayoutData } from './$types';
  import Header from '$lib/components/ui/Header.svelte';

  let { children, data } = $props<{
    children: any;
    data: LayoutData;
  }>();

  // Default SEO data
  const defaultSeo = {
    title: 'EV Estimator Hub',
    description: 'Tools to calculate EV charging frequency, time and costs for electric vehicle owners',
    type: 'website',
    image: '/images/ev-calculator-social.png',
    twitterCard: 'summary_large_image'
  };

  // Page-specific SEO data based on route
  $effect(() => {
    const pathname = $page.url.pathname;

    // Update page title based on the current route
    if (pathname === '/') {
      seoData.title = 'EV Charge Frequency Calculator | EV Estimator Hub';
      seoData.description =
        'Calculate how many times you need to charge your electric vehicle per week based on your driving habits';
    } else if (pathname === '/charging-time') {
      seoData.title = 'EV Charging Time Calculator | EV Estimator Hub';
      seoData.description = 'Calculate how long it will take to charge your electric vehicle from any state of charge';
    } else if (pathname === '/cost') {
      seoData.title = 'EV Charging Cost Calculator | EV Estimator Hub';
      seoData.description = 'Calculate the cost of charging your electric vehicle at home or at public stations';
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
  <meta property="og:url" content={$page.url.href} />
  <meta property="og:title" content={seoData.title} />
  <meta property="og:description" content={seoData.description} />
  <meta property="og:image" content={seoData.image} />

  <!-- Twitter -->
  <meta name="twitter:card" content={seoData.twitterCard} />
  <meta name="twitter:title" content={seoData.title} />
  <meta name="twitter:description" content={seoData.description} />
  <meta name="twitter:image" content={seoData.image} />

  <!-- Canonical URL -->
  <link rel="canonical" href={$page.url.href} />

  <!-- Include Analytics component (doesn't render anything visible) -->
  <Analytics />
</svelte:head>
<div class="flex min-h-screen flex-col transition-colors" data-theme={$effectiveTheme}>
  <Header />
  <main class="flex-grow">
    {@render children()}
  </main>

  <Footer />
  <CookieBanner />
</div>
