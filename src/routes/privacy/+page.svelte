<script lang="ts">
	import { page } from '$app/stores';
</script>

<svelte:head>
	<title>Privacy Policy | EV Calculator Hub</title>
	<meta name="robots" content="noindex" />
</svelte:head>

<div class="prose mx-auto max-w-3xl">
	<h1>Privacy Policy</h1>

	<p class="lead">
		This privacy policy explains how EV Calculator Hub collects and uses data when you visit our
		website.
	</p>

	<h2>Analytics</h2>
	<p>
		We use <a href="https://umami.is/" target="_blank" rel="noopener noreferrer">Umami Analytics</a
		>, a privacy-focused open-source analytics platform to understand how visitors use our website.
		Umami:
	</p>

	<ul>
		<li>Does not use cookies</li>
		<li>Does not collect personal information</li>
		<li>Does not track visitors across websites</li>
		<li>Is fully compliant with GDPR, CCPA, and PECR</li>
	</ul>

	<p>The following information is collected:</p>

	<ul>
		<li>Page views (URL, referrer, browser)</li>
		<li>Country of origin (derived from IP address, which is not stored)</li>
		<li>Device information (type, screen size, browser)</li>
		<li>Visit duration</li>
	</ul>

	<p>
		All data is anonymized and used only for improving our website experience. We cannot identify
		individual users.
	</p>

	<h2>Local Storage</h2>
	<p>This website stores some information locally on your device to remember your preferences:</p>

	<ul>
		<li>Theme preference (light/dark)</li>
		<li>Calculator input values (to save you time on return visits)</li>
	</ul>

	<p>This information never leaves your device and is not transmitted to our servers.</p>

	<h2>Third-Party Services</h2>
	<p>We do not use any third-party services that may track users across websites, such as:</p>

	<ul>
		<li>Social media buttons</li>
		<li>Advertisement networks</li>
		<li>Affiliate tracking</li>
	</ul>

	<h2>Contact</h2>
	<p>
		If you have any questions about our privacy practices, please contact us at [your contact info].
	</p>

	<p class="text-base-content/60 mt-8 text-sm">
		Last updated: {new Date().toISOString().split('T')[0]}
	</p>
</div>
