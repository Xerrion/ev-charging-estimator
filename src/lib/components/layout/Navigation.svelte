<script lang="ts">
  import { page } from '$app/state';
  import ThemeSwitcher from '$lib/components/ui/ThemeSwitcher.svelte';

  const currentPath = $derived(page.url.pathname);

  // Track drawer state
  let drawerOpen = $state(false);

  // Toggle drawer function
  function toggleDrawer() {
    drawerOpen = !drawerOpen;
  }

  // Close drawer when selecting a link on mobile
  function closeDrawer() {
    if (window.innerWidth < 768) {
      drawerOpen = false;
    }
  }
</script>

<!-- DaisyUI Drawer Component -->
<div class="drawer drawer-end">
  <input id="drawer-nav" type="checkbox" class="drawer-toggle" bind:checked={drawerOpen} />

  <!-- Drawer Content -->
  <div class="drawer-content">
    <!-- Navbar -->
    <div class="navbar bg-base-100">
      <div class="navbar-start">
        <a href="/" class="text-lg font-semibold">EV Estimator Hub</a>
      </div>

      <!-- Desktop Navigation (hidden on mobile) -->
      <div class="navbar-center hidden md:flex">
        <ul class="menu menu-horizontal px-1">
          <li>
            <a
              href="/calculators/frequency"
              class="link-hover {currentPath === '/calculators/frequency' ? 'text-primary font-medium' : ''}"
              aria-current={currentPath === '/calculators/frequency' ? 'page' : undefined}
              onclick={closeDrawer}
            >
              Charge Frequency
            </a>
          </li>
          <li>
            <a
              href="/calculators/charging-time"
              class="link-hover {currentPath === '/calculators/charging-time' ? 'text-primary font-medium' : ''}"
              aria-current={currentPath === '/calculators/charging-time' ? 'page' : undefined}
              onclick={closeDrawer}
            >
              Charging Time
            </a>
          </li>
          <li>
            <a
              href="/calculators/cost"
              class="link-hover {currentPath === '/calculators/cost' ? 'text-primary font-medium' : ''}"
              aria-current={currentPath === '/calculators/cost' ? 'page' : undefined}
              onclick={closeDrawer}
            >
              Cost
            </a>
          </li>
        </ul>
      </div>

      <div class="navbar-end">
        <!-- Theme Switcher (visible only on desktop) -->
        <div class="hidden md:block">
          <ThemeSwitcher />
        </div>

        <!-- Drawer Toggle Button (mobile only) -->
        <div class="md:hidden">
          <label for="drawer-nav" class="btn btn-square btn-ghost drawer-button">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              class="inline-block h-6 w-6 stroke-current"
            >
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"></path>
            </svg>
          </label>
        </div>
      </div>
    </div>
  </div>

  <!-- Drawer Side (Mobile Navigation) -->
  <div class="drawer-side z-10">
    <label for="drawer-nav" aria-label="close sidebar" class="drawer-overlay"></label>
    <div class="menu bg-base-200 text-base-content min-h-full w-80 p-4">
      <div class="mb-6 flex items-center justify-between">
        <span class="text-lg font-bold">Navigation</span>
        <label for="drawer-nav" class="btn btn-sm btn-circle btn-ghost">✕</label>
      </div>

      <ul>
        <li>
          <a
            href="/"
            class="mb-2 rounded-lg p-3 {currentPath === '/' ? 'bg-primary/10 text-primary font-medium' : ''}"
            aria-current={currentPath === '/' ? 'page' : undefined}
            onclick={closeDrawer}
          >
            Home
          </a>
        </li>
        <li>
          <a
            href="/calculators/frequency"
            class="mb-2 rounded-lg p-3 {currentPath === '/calculators/frequency'
              ? 'bg-primary/10 text-primary font-medium'
              : ''}"
            aria-current={currentPath === '/calculators/frequency' ? 'page' : undefined}
            onclick={closeDrawer}
          >
            Charge Frequency
          </a>
        </li>
        <li>
          <a
            href="/calculators/charging-time"
            class="mb-2 rounded-lg p-3 {currentPath === '/calculators/charging-time'
              ? 'bg-primary/10 text-primary font-medium'
              : ''}"
            aria-current={currentPath === '/calculators/charging-time' ? 'page' : undefined}
            onclick={closeDrawer}
          >
            Charging Time
          </a>
        </li>
        <li>
          <a
            href="/calculators/cost"
            class="mb-2 rounded-lg p-3 {currentPath === '/calculators/cost'
              ? 'bg-primary/10 text-primary font-medium'
              : ''}"
            aria-current={currentPath === '/calculators/cost' ? 'page' : undefined}
            onclick={closeDrawer}
          >
            Cost
          </a>
        </li>
        <div class="divider"></div>
        <li>
          <a
            href="/contact"
            class="mb-2 rounded-lg p-3 {currentPath === '/contact' ? 'bg-primary/10 text-primary font-medium' : ''}"
            aria-current={currentPath === '/contact' ? 'page' : undefined}
            onclick={closeDrawer}
          >
            Contact
          </a>
        </li>
      </ul>

      <div class="border-base-300 mt-auto border-t pt-6">
        <div class="flex items-center justify-between">
          <span>Theme</span>
          <ThemeSwitcher />
        </div>
      </div>
    </div>
  </div>
</div>
