<script lang="ts">
	import { onMount } from 'svelte';
	import Alert from './Alert.svelte';

	const COOKIE_NAME = 'cookie-consent-accepted';
	const COOKIE_EXPIRY_DAYS = 365;

	let bannerVisible = $state(false);

	// Check if the user has already accepted cookies
	onMount(() => {
		if (typeof window !== 'undefined') {
			// Check if the cookie exists
			const hasAccepted = document.cookie
				.split('; ')
				.some((cookie) => cookie.startsWith(`${COOKIE_NAME}=true`));

			// If cookie doesn't exist, show the banner
			bannerVisible = !hasAccepted;
		}
	});

	// Set the cookie when user accepts
	function acceptCookies() {
		const expiryDate = new Date();
		expiryDate.setDate(expiryDate.getDate() + COOKIE_EXPIRY_DAYS);

		document.cookie = `${COOKIE_NAME}=true; expires=${expiryDate.toUTCString()}; path=/; SameSite=Lax`;
		bannerVisible = false;
	}
</script>

{#if bannerVisible}
	<div class="fixed right-0 bottom-0 left-0 z-50 p-4">
		<div class="container mx-auto max-w-4xl">
			<Alert
				type="info"
				message="This website doesn't use any third-party cookies. We only use a single cookie to remember that you've seen this message."
				dismissible={true}
				onDismiss={acceptCookies}
				className="shadow-lg"
			/>
		</div>
	</div>
{/if}
