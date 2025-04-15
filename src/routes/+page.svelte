<script lang="ts">
	// No imports needed for basic DaisyUI components
</script>

<div class="hero min-h-[70vh] bg-base-200">
	<div class="hero-content text-center">
		<div class="max-w-md">
			<h1 class="text-5xl font-bold text-primary">EV Estimator Hub</h1>
			<p class="py-6">
				Simplify your electric vehicle experience with our suite of easy-to-use calculators for charging
				frequency, time, and cost estimation.
			</p>
			<div class="flex flex-col gap-4 sm:flex-row sm:justify-center">
				<a href="/frequency" class="btn btn-primary">Charge Frequency</a>
				<a href="/charging-time" class="btn btn-outline">Charging Time</a>
			</div>
		</div>
	</div>
</div>

<div class="mt-12 grid gap-8 md:grid-cols-3">
	<div class="card bg-base-100 shadow-lg transition-all duration-300 hover:shadow-xl">
		<div class="card-body">
			<h2 class="card-title">Charge Frequency</h2>
			<p>Calculate how many times you'll need to charge your EV per week based on your driving habits.</p>
			<div class="card-actions justify-end">
				<a href="/frequency" class="btn btn-primary btn-sm">Calculate Now</a>
			</div>
		</div>
	</div>
	
	<div class="card bg-base-100 shadow-lg transition-all duration-300 hover:shadow-xl">
		<div class="card-body">
			<h2 class="card-title">Charging Time</h2>
			<p>Estimate how long it will take to charge your electric vehicle from any state of charge.</p>
			<div class="card-actions justify-end">
				<a href="/charging-time" class="btn btn-primary btn-sm">Calculate Now</a>
			</div>
		</div>
	</div>
	
	<div class="card bg-base-100 shadow-lg transition-all duration-300 hover:shadow-xl">
		<div class="card-body">
			<h2 class="card-title">Charging Cost</h2>
			<p>Calculate the cost of charging your EV at home or at public charging stations.</p>
			<div class="card-actions justify-end">
				<a href="/cost" class="btn btn-primary btn-sm">Calculate Now</a>
			</div>
		</div>
	</div>
</div>
