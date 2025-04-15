<script lang="ts">
	import { page } from '$app/state';

	const navItems = [
		{
			path: '/',
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

<nav class="overflow-x-auto">
	<div class="tabs tabs-boxed w-full">
		{#each navItems as item}
			{@const isActive = page.url.pathname === item.path}
			<a
				href={item.path}
				class="tab tab-lg {isActive ? 'tab-active' : ''}"
				aria-current={isActive ? 'page' : undefined}
			>
				{item.label}
			</a>
		{/each}
	</div>
</nav>
