<script lang="ts">
  import { consentStore } from '$lib/state/ConsentStore';
  import { calculatorStore } from '$lib/state/CalculatorStore';
  import { themeStore } from '$lib/state/ThemeStore';
  import { browser } from '$app/environment';

  let bannerVisible = $state(false);
  let showDetails = $state(false);
  let showTechnicalDetails = $state(false);

  // Check consent status when component is mounted
  $effect(() => {
    if (browser) {
      const unsubscribe = consentStore.subscribe((consent) => {
        bannerVisible = !consent.analytics;
      });
      return unsubscribe;
    }
  });

  // Handle consent
  function acceptStorage() {
    consentStore.updateConsent('analytics', true);
    bannerVisible = false;
  }

  function rejectStorage() {
    consentStore.updateConsent('analytics', false);
    // Reset all stores when consent is rejected
    calculatorStore.resetToDefaults();
    themeStore.resetToDefaults();
    consentStore.resetToDefaults();
    bannerVisible = false;
  }

  function toggleDetails() {
    showDetails = !showDetails;
  }

  function toggleTechnicalDetails() {
    showTechnicalDetails = !showTechnicalDetails;
  }
</script>

{#if bannerVisible}
  <div class="fixed right-0 bottom-0 left-0 z-50 p-4">
    <div class="container mx-auto max-w-4xl">
      <div class="bg-base-100 rounded-box border shadow-lg">
        <div class="p-4">
          <h3 class="text-base-content mb-2 text-lg font-semibold">Privacy Preferences</h3>
          <p class="text-base-content/80 mb-4">
            We value your privacy. This website uses essential storage mechanisms (cookies and local storage) to
            remember your preferences and provide basic functionality.
          </p>

          {#if showDetails}
            <div class="bg-base-200 mb-4 rounded-lg p-4">
              <h4 class="text-base-content mb-2 font-medium">Essential Storage</h4>
              <ul class="text-base-content/70 ml-4 list-disc space-y-1">
                <li>Privacy preferences (Remembers your consent choice)</li>
                <li>Theme preference (Stores your light/dark mode choice)</li>
                <li>Calculator inputs (Saves your most recent calculations)</li>
              </ul>

              {#if showTechnicalDetails}
                <div class="bg-base-300/50 mt-4 rounded p-3">
                  <h5 class="text-base-content mb-2 text-sm font-medium">Technical Details</h5>
                  <ul class="text-base-content/70 ml-4 list-disc space-y-1 text-sm">
                    <li>Cookies: Used for consent management (365-day expiry)</li>
                    <li>Local Storage: Used for theme and calculator data (persistent until cleared)</li>
                    <li>No third-party storage or tracking</li>
                    <li>All data stays on your device</li>
                  </ul>
                </div>
              {/if}

              <div class="mt-3 text-right">
                <button class="btn btn-ghost btn-xs" onclick={toggleTechnicalDetails}>
                  {showTechnicalDetails ? 'Hide Technical Details' : 'Show Technical Details'}
                </button>
              </div>

              <p class="text-base-content/70 mt-4 text-sm">
                This storage is necessary for the website to function properly. Rejecting will clear all stored data and
                may affect your experience.
              </p>
            </div>
          {/if}

          <div class="flex flex-wrap items-center gap-3">
            <button class="btn btn-primary" onclick={acceptStorage}>Accept Essential Storage</button>
            <button class="btn" onclick={rejectStorage}>Reject & Clear Data</button>
            <button class="btn btn-ghost btn-sm" onclick={toggleDetails}>
              {showDetails ? 'Hide Details' : 'Show Details'}
            </button>
          </div>
        </div>

        <div class="bg-base-200/50 border-base-300 rounded-b-box border-t p-3 text-center">
          <p class="text-base-content/70 text-sm">
            By using this site, you acknowledge our <a href="/privacy" class="link link-primary">Privacy Policy</a>
          </p>
        </div>
      </div>
    </div>
  </div>
{/if}
