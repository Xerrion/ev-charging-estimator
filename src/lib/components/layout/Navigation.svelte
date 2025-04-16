<script lang="ts">
  import { page } from '$app/state';
  import ThemeSwitcher from '$lib/components/ui/ThemeSwitcher.svelte';

  const currentPath = $derived(page.url.pathname);
</script>

<nav class="flex items-center justify-between py-4">
  <div class="flex items-center gap-8">
    <a href="/" class="text-lg font-semibold">EV Estimator Hub</a>

    <ul class="flex gap-4">
      <li>
        <a
          href="/"
          class="link-hover link {currentPath === '/' ? 'link-primary' : ''}"
          aria-current={currentPath === '/' ? 'page' : undefined}
        >
          Charge Frequency
        </a>
      </li>
      <li>
        <a
          href="/charging-time"
          class="link-hover link {currentPath === '/charging-time' ? 'link-primary' : ''}"
          aria-current={currentPath === '/charging-time' ? 'page' : undefined}
        >
          Charging Time
        </a>
      </li>
      <li>
        <a
          href="/cost"
          class="link-hover link {currentPath === '/cost' ? 'link-primary' : ''}"
          aria-current={currentPath === '/cost' ? 'page' : undefined}
        >
          Cost
        </a>
      </li>
    </ul>
  </div>

  <div class="flex items-center gap-4">
    <ThemeSwitcher />
  </div>
</nav>
