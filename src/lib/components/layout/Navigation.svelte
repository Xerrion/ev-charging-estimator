<script lang="ts">
  import { page } from '$app/state';
  import ThemeSwitcher from '../ui/ThemeSwitcher.svelte';
  const { currentTheme } = $props<{ currentTheme: 'light' | 'dark' }>();

  const navItems = [
    {
      path: '/frequency',
      label: 'Charge Frequency'
    },
    {
      path: '/charging-time',
      label: 'Charging Time'
    },
    {
      path: '/cost',
      label: 'Cost Calculator'
    }
  ];
</script>

<div class="navbar">
  <div class="navbar-start">
    <a href="/" class="btn btn-ghost text-primary text-xl font-bold">EV Estimator Hub</a>
  </div>
  <div class="navbar-center flex-grow">
    <!-- Mobile menu -->
    <div class="dropdown order-first lg:hidden">
      <button class="btn btn-ghost order-first" aria-label="Open menu">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h8m-8 6h16" />
        </svg>
      </button>
      <ul class="menu menu-lg dropdown-content bg-base-100 rounded-box z-10 mt-3 w-52 border p-2 shadow">
        {#each navItems as item}
          {@const isActive = page.url.pathname === item.path}
          <li>
            <a
              href={item.path}
              class={isActive ? 'text-primary font-medium' : ''}
              aria-current={isActive ? 'page' : undefined}
            >
              {item.label}
            </a>
          </li>
        {/each}
      </ul>
    </div>

    <!-- Desktop menu -->
    <div class="hidden lg:flex">
      <ul class="menu menu-horizontal px-1">
        {#each navItems as item}
          {@const isActive = page.url.pathname === item.path}
          <li>
            <a
              href={item.path}
              class={isActive ? 'text-primary disabled font-medium' : ''}
              aria-current={isActive ? 'page' : undefined}
            >
              {item.label}
            </a>
          </li>
        {/each}
      </ul>
    </div>
  </div>
  <div class="navbar-end">
    <ThemeSwitcher currentTheme={currentTheme as 'light' | 'dark'} />
  </div>
</div>
