<script lang="ts">
	import { enhance } from '$app/forms';
	import type { ActionData } from './$types';
	import Alert from '$lib/components/ui/Alert.svelte';

	// Use $props instead of export let for Svelte 5
	let { form } = $props<{
		form?: ActionData;
	}>();

	// Local state
	let submitted = $state(false);
	let error = $state<string | null>(null);

	// Determine submission status from form data
	$effect(() => {
		if (form) {
			submitted = form.success || false;
			error = form.success ? null : form.message;
		}
	});

	// Type definition for form data to fix type errors
	type FormData = {
		success: boolean;
		message: string;
		data?: {
			name?: string;
			email?: string;
			subject?: string;
		};
	};

	// Handle dismissing success message to show form again
	function resetForm() {
		submitted = false;
	}
</script>

<svelte:head>
	<title>Contact Us | EV Estimator Hub</title>
	<meta
		name="description"
		content="Contact the EV Estimator Hub team with questions or feedback."
	/>
</svelte:head>

<div class="container-custom mx-auto my-12 max-w-2xl px-4">
	<h1 class="mb-6 text-center text-3xl font-bold">Contact Us</h1>

	<div class="card bg-base-100 border-base-300 border shadow-md">
		<div class="card-body p-8">
			{#if submitted}
				<Alert
					type="success"
					style="default"
					message={(form as FormData)?.message ||
						"Thank you for your message! We'll get back to you as soon as possible."}
				/>

				<div class="mt-6 flex justify-center">
					<button class="btn btn-primary px-8" onclick={resetForm}> Send Another Message </button>
				</div>
			{:else}
				{#if error}
					<Alert type="error" message={error} className="mb-6" />
				{/if}

				<form method="POST" class="space-y-6" use:enhance>
					<div class="grid gap-6 md:grid-cols-2">
						<div class="form-control w-full">
							<label for="name" class="label pb-1">
								<span class="label-text font-medium">Name</span>
							</label>
							<input
								type="text"
								id="name"
								name="name"
								placeholder="Your name"
								class="input input-bordered focus:border-primary w-full"
								required
								value={(form as FormData)?.data?.name || ''}
							/>
						</div>
						<div class="form-control w-full">
							<label for="email" class="label pb-1">
								<span class="label-text font-medium">Email</span>
							</label>
							<input
								type="email"
								id="email"
								name="email"
								placeholder="your@email.com"
								class="input input-bordered focus:border-primary w-full"
								required
								value={(form as FormData)?.data?.email || ''}
							/>
						</div>
					</div>

					<div class="form-control w-full">
						<label for="subject" class="label pb-1">
							<span class="label-text font-medium">Subject</span>
						</label>
						<input
							type="text"
							id="subject"
							name="subject"
							placeholder="What is this regarding?"
							class="input input-bordered focus:border-primary w-full"
							required
							value={(form as FormData)?.data?.subject || ''}
						/>
					</div>

					<div class="form-control w-full">
						<label for="message" class="label pb-1">
							<span class="label-text font-medium">Message</span>
						</label>
						<textarea
							id="message"
							name="message"
							placeholder="Your message here..."
							class="textarea textarea-bordered focus:border-primary min-h-[150px] w-full"
							required
						></textarea>
					</div>

					<div class="flex justify-center pt-2">
						<button type="submit" class="btn btn-black btn-wide">Send Message</button>
					</div>
				</form>
			{/if}
		</div>
	</div>
</div>
