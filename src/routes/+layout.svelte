<script lang="ts">
  import '../app.css';
  import ThemeSwitcher from '$lib/components/ui/ThemeSwitcher.svelte';
  import Navigation from '$lib/components/layout/Navigation.svelte';
  import Footer from '$lib/components/layout/Footer.svelte';
  import { page } from '$app/stores';
  import Analytics from '$lib/components/util/Analytics.svelte';
  import CookieBanner from '$lib/components/ui/CookieBanner.svelte';
  import { settingsStore } from '$lib/state/SettingsStore';
  import type { LayoutData } from './$types';

  let { children, data } = $props<{
    children: any;
    data: LayoutData;
  }>();

  // Apply theme from the layout data
  $effect(() => {
    if (data.theme) {
      // Update store to keep it in sync
      settingsStore.update({ theme: data.theme as 'light' | 'dark' });

      // Set theme on body
      if (typeof document !== 'undefined') {
        document.body.setAttribute('data-theme', data.theme);
      }
    }
  });

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
</svelte:head>

<!-- Include Analytics component (doesn't render anything visible) -->
<Analytics />

<div class="flex min-h-screen flex-col transition-colors">
  <header class="bg-base-100 border-base-300 border-b shadow-sm">
    <div class="container-custom">
      <div class="navbar">
        <div class="navbar-start">
          <a href="/" class="btn btn-ghost text-primary text-xl font-bold">EV Estimator Hub</a>
        </div>

        <Navigation />

        <div class="navbar-end">
          <ThemeSwitcher currentTheme={data.theme as 'light' | 'dark'} />
        </div>
      </div>
    </div>
  </header>

  <main class="container-custom flex-grow">
    {#if $page.url.pathname === '/'}
      <div class="hero bg-base-200 min-h-[70vh] min-w-full">
        <div class="hero-content glass text-center">
          <div class=" max-w-md p-8">
            <h1 class="text-primary text-5xl font-bold">EV Estimator Hub</h1>
            <p class="py-6">
              Simplify your electric vehicle experience with our suite of easy-to-use calculators for charging
              frequency, time, and cost estimation.
            </p>
            <div class="flex flex-col gap-4 sm:flex-row sm:justify-center">
              <a href="/frequency" class="btn btn-primary">Charge Frequency</a>
              <a href="/charging-time" class="btn btn-outline">Charging Time</a>
            </div>
          </div>
        </div>
      </div>
    {/if}

    <div class="mx-auto w-full max-w-3xl py-8">
      {@render children()}
    </div>
  </main>

  <Footer />

  <!-- Cookie banner -->
  <CookieBanner />
</div>
