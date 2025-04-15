<script lang="ts">
	import { page } from '$app/state';

	// Get current year for copyright
	const currentYear = new Date().getFullYear();
</script>

<footer class="bg-base-200 py-6">
	<div class="container-custom">
		<div class="grid grid-cols-1 gap-8 md:grid-cols-3">
			<!-- Column 1: About -->
			<div>
				<h3 class="text-base-content mb-3 text-lg font-semibold">About EV Estimator Hub</h3>
				<p class="text-base-content/70 text-sm">
					Free, privacy-focused calculators to help electric vehicle owners estimate charging
					frequency, time, and costs with no account required.
				</p>
			</div>

			<!-- Column 2: Links -->
			<div>
				<h3 class="text-base-content mb-3 text-lg font-semibold">Tools</h3>
				<ul class="text-base-content/70 space-y-2 text-sm">
					<li>
						<a
							href="/"
							class="hover:text-primary transition-colors {page.url.pathname === '/'
								? 'text-primary'
								: ''}"
						>
							Charge Frequency Calculator
						</a>
					</li>
					<li>
						<a
							href="/charging-time"
							class="hover:text-primary transition-colors {page.url.pathname === '/charging-time'
								? 'text-primary'
								: ''}"
						>
							Charging Time Calculator
						</a>
					</li>
					<li>
						<a
							href="/cost"
							class="hover:text-primary transition-colors {page.url.pathname === '/cost'
								? 'text-primary'
								: ''}"
						>
							Charging Cost Calculator
						</a>
					</li>
				</ul>
			</div>

			<!-- Column 3: Legal -->
			<div>
				<h3 class="text-base-content mb-3 text-lg font-semibold">Legal</h3>
				<ul class="text-base-content/70 space-y-2 text-sm">
					<li>
						<a
							href="/privacy"
							class="hover:text-primary transition-colors {page.url.pathname === '/privacy'
								? 'text-primary'
								: ''}"
						>
							Privacy Policy
						</a>
					</li>
					<li>
						<a href="mailto:contact@example.com" class="hover:text-primary transition-colors">
							Contact Us
						</a>
					</li>
				</ul>
			</div>
		</div>

		<div class="border-base-300 text-base-content/50 mt-8 border-t pt-5 text-center text-xs">
			<p>© {currentYear} EV Estimator Hub. All rights reserved.</p>
			<p class="mt-1">Built with Svelte. No cookies. No tracking. No nonsense.</p>
		</div>
	</div>
</footer>
