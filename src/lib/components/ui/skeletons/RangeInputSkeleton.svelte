<script lang="ts">
	import Skeleton from './Skeleton.svelte';
</script>

<div class="mb-6">
	<div class="mb-4 flex items-center justify-between">
		<!-- Label -->
		<div class="text-base-content text-sm font-medium">
			<Skeleton height="5" width="32" />
		</div>
		<!-- Input field with unit -->
		<div class="flex h-8 min-h-8 w-36 items-center gap-2 rounded-md shadow-sm">
			<Skeleton height="6" width="24" className="grow" />
			<Skeleton height="4" width="8" className="text-base-content/70" />
		</div>
	</div>
	<div class="pt-2">
		<!-- Range slider -->
		<Skeleton height="7" width="full" className="range range-primary rounded-full" />
		<!-- Min/Max values -->
		<div class="text-base-content/60 mt-2 flex justify-between text-xs">
			<Skeleton height="4" width="10" />
			<Skeleton height="4" width="10" />
		</div>
	</div>
</div>
