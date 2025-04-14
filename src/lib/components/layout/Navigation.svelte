<script lang="ts">
	import { page } from '$app/stores';

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

<div class="w-full overflow-x-auto">
	<div class="tabs tabs-boxed w-full">
		{#each navItems as item}
			<a
				href={item.path}
				class="tab tab-lg {$page.url.pathname === item.path ? 'tab-active' : ''}"
				aria-current={$page.url.pathname === item.path ? 'page' : undefined}
			>
				{item.label}
			</a>
		{/each}
	</div>
</div>
