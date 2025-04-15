<script lang="ts">
  import { page } from '$app/state';
  import twitterIcon from '$lib/assets/icons/twitter.svg?raw';
  import youtubeIcon from '$lib/assets/icons/youtube.svg?raw';
  import facebookIcon from '$lib/assets/icons/facebook.svg?raw';
  import githubIcon from '$lib/assets/icons/github.svg?raw';

  // Get current year for copyright
  const currentYear = new Date().getFullYear();
</script>

<footer class="footer footer-horizontal footer-center bg-base-200 text-base-content rounded p-10">
  <nav class="grid grid-flow-col gap-4">
    <a href="/frequency" class="link link-hover">Frequency Calculator</a>
    <a href="/charging-time" class="link link-hover">Charging Time</a>
    <a href="/cost" class="link link-hover">Charging Cost</a>
  </nav>
  <nav class="grid grid-flow-col gap-4">
    <a href="/contact" class="link link-hover">Contact</a>
    <a href="/privacy" class="link link-hover">Privacy</a>
  </nav>
  <nav>
    <div class="grid grid-flow-col gap-4">
      <a href="https://github.com/xerrion" target="_blank" rel="noopener noreferrer" aria-label="GitHub">
        {@html githubIcon}
      </a>
    </div>
  </nav>
  <aside>
    <p>© {currentYear} EV Estimator Hub. All rights reserved.</p>
    <p class="mt-1 text-xs opacity-75">Built with Love, AI & Svelte. No cookies. No tracking. No nonsense.</p>
  </aside>
</footer>
