<script lang="ts">
	let { className = '' } = $props<{
		className?: string;
	}>();
</script>

<div class="bg-secondary-content rounded-box p-6 shadow {className}">
	<h3 class="mb-3 text-lg font-semibold">Recommended Charging Tips</h3>
	<ul class="list-disc space-y-2 pl-5">
		<li>Charge during off-peak hours for cost savings</li>
		<li>Avoid charging to 100% regularly to prolong battery life</li>
		<li>Use fast charging only when necessary to preserve battery health</li>
	</ul>
</div>
