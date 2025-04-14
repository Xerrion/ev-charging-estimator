<script lang="ts">
	import Skeleton from './Skeleton.svelte';
</script>

<div class="mb-4 h-[82px]">
	<div class="mb-3 flex items-center justify-between">
		<Skeleton className="h-5 w-32" />
		<Skeleton className="h-5 w-16" />
	</div>
	<div class="pt-1">
		<Skeleton className="h-2 w-full rounded-full" />
		<div class="mt-1 flex justify-between">
			<Skeleton className="h-4 w-10" />
			<Skeleton className="h-4 w-10" />
		</div>
	</div>
</div>
