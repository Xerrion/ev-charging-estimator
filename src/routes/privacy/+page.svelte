<script lang="ts">
	import { page } from '$app/state';
	import { Alert } from '$lib/components/ui';
</script>

<svelte:head>
	<title>Privacy Policy | EV Estimator Hub</title>
	<meta name="robots" content="noindex" />
</svelte:head>

<div class="rounded-box bg-base-100 mx-auto max-w-3xl p-8 shadow-md">
	<h1 class="text-primary mb-6 text-3xl font-bold">Privacy Policy</h1>

	<div class="bg-base-200 mb-8 rounded-lg p-4">
		<p class="text-base-content/80 text-lg italic">
			At EV Estimator Hub, we believe in transparency and respect for your privacy. This policy
			explains our minimal data collection practices.
		</p>
	</div>

	<section class="mb-8">
		<h2 class="text-base-content mb-3 text-2xl font-semibold">Analytics</h2>
		<div class="text-base-content/80 mb-4 space-y-2">
			<p>
				We use <a
					href="https://umami.is/"
					target="_blank"
					rel="noopener noreferrer"
					class="link link-primary">Umami Analytics</a
				>, a privacy-focused open-source alternative to Google Analytics. Unlike conventional
				analytics tools, Umami:
			</p>
		</div>

		<div class="mb-4 grid grid-cols-1 gap-3 md:grid-cols-2">
			<div class="bg-primary/5 rounded-lg p-4">
				<h3 class="text-primary mb-2 font-medium">Privacy Respecting</h3>
				<ul class="text-base-content/80 ml-5 list-disc space-y-1">
					<li>Does not use cookies</li>
					<li>Does not collect personal information</li>
					<li>Does not track users across websites</li>
				</ul>
			</div>

			<div class="bg-secondary/5 rounded-lg p-4">
				<h3 class="text-secondary mb-2 font-medium">Compliant</h3>
				<ul class="text-base-content/80 ml-5 list-disc space-y-1">
					<li>GDPR compliant (EU)</li>
					<li>CCPA compliant (California)</li>
					<li>PECR compliant (UK)</li>
				</ul>
			</div>
		</div>

		<h3 class="mb-2 font-medium">Information Collected:</h3>
		<ul class="text-base-content/80 mb-4 ml-5 list-disc space-y-1">
			<li>Page views (URLs visited)</li>
			<li>Referrer (where you came from)</li>
			<li>Country (derived from IP, which is not stored)</li>
			<li>Browser and device type</li>
			<li>Visit duration</li>
		</ul>

		<Alert
			type="info"
			message="All data is anonymized. We cannot identify individual users or track them across different websites."
			className="text-sm shadow-sm mb-4"
		/>
	</section>

	<section class="mb-8">
		<h2 class="text-base-content mb-3 text-2xl font-semibold">Local Storage</h2>
		<p class="text-base-content/80 mb-3">
			This website stores some information locally on your device to enhance your experience:
		</p>

		<div class="overflow-x-auto">
			<table class="table-zebra table w-full">
				<thead>
					<tr>
						<th>Data Stored</th>
						<th>Purpose</th>
						<th>Duration</th>
					</tr>
				</thead>
				<tbody>
					<tr>
						<td>Theme preferences</td>
						<td>Remember your light/dark theme choice</td>
						<td>Persistent</td>
					</tr>
					<tr>
						<td>Calculator inputs</td>
						<td>Remember your most recent calculation values</td>
						<td>Persistent</td>
					</tr>
					<tr>
						<td>Cookie consent</td>
						<td>Remember that you've seen our cookie notice</td>
						<td>365 days</td>
					</tr>
				</tbody>
			</table>
		</div>

		<div class="text-base-content/70 mt-4 text-sm">
			<p>This information never leaves your device and is not transmitted to our servers.</p>
		</div>
	</section>

	<section class="mb-8">
		<h2 class="text-base-content mb-3 text-2xl font-semibold">What We Don't Do</h2>
		<div class="rounded-box bg-error/5 p-4">
			<ul class="text-base-content/80 ml-5 list-disc space-y-1">
				<li>We do not sell your data</li>
				<li>We do not use third-party advertising or marketing trackers</li>
				<li>We do not use social media tracking buttons</li>
				<li>We do not allow other companies to place tracking pixels on our site</li>
				<li>We do not create user profiles or "digital fingerprints"</li>
			</ul>
		</div>
	</section>

	<section>
		<h2 class="text-base-content mb-3 text-2xl font-semibold">Contact Information</h2>
		<p class="text-base-content/80">
			If you have questions about this privacy policy or our data practices, please contact us at:
			<a href="/contact" class="link link-primary">our contact page</a>.
		</p>
	</section>

	<div class="border-base-300 text-base-content/60 mt-12 border-t pt-4 text-right text-sm">
		Last updated: {new Date().toISOString().split('T')[0]}
	</div>
</div>
