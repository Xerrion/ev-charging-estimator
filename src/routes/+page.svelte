<script lang="ts">
  // No imports needed for SVG icons
</script>

<!-- Hero Section with improved DaisyUI components - Full Width -->
<div class="hero bg-base-200 min-h-[60vh]">
  <div class="hero-content text-center">
    <div class="max-w-md">
      <h1 class="text-5xl font-bold">EV Charging Made Simple</h1>
      <p class="py-6">
        Plan smarter, charge better. Calculate everything you need for your electric vehicle charging journey.
      </p>
      <div class="join">
        <a href="#calculators" class="btn btn-primary join-item">Get Started</a>
      </div>
    </div>
  </div>
</div>

<!-- Content with container -->
<div class="container mx-auto px-4 py-8">
  <div class="mx-auto max-w-5xl">
    <!-- Calculator Cards Section with improved styling -->
    <section id="calculators" class="py-12">
      <h2 class="mb-8 text-center text-3xl font-bold">Our Calculators</h2>
      <div class="grid gap-8 md:grid-cols-3">
        <!-- Frequency Calculator Card -->
        <div class="card bg-base-100 shadow-xl transition-all duration-300 hover:shadow-2xl">
          <figure class="px-10 pt-10">
            <div class="bg-primary/10 rounded-full p-6">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="text-primary h-10 w-10"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
          </figure>
          <div class="card-body items-center text-center">
            <h2 class="card-title">Charge Frequency</h2>
            <p>Calculate how many times you'll need to charge your EV per week based on your driving habits.</p>
            <div class="card-actions mt-4">
              <a href="/calculators/frequency" class="btn btn-primary btn-wide">Calculate Now</a>
            </div>
          </div>
        </div>

        <!-- Charging Time Calculator Card -->
        <div class="card bg-base-100 shadow-xl transition-all duration-300 hover:shadow-2xl">
          <figure class="px-10 pt-10">
            <div class="bg-secondary/10 rounded-full p-6">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="text-secondary h-10 w-10"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
          </figure>
          <div class="card-body items-center text-center">
            <h2 class="card-title">Charging Time</h2>
            <p>Estimate how long it will take to charge your electric vehicle from any state of charge.</p>
            <div class="card-actions mt-4">
              <a href="/calculators/charging-time" class="btn btn-secondary btn-wide">Calculate Now</a>
            </div>
          </div>
        </div>

        <!-- Cost Calculator Card -->
        <div class="card bg-base-100 shadow-xl transition-all duration-300 hover:shadow-2xl">
          <figure class="px-10 pt-10">
            <div class="bg-accent/10 rounded-full p-6">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="text-accent h-10 w-10"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
          </figure>
          <div class="card-body items-center text-center">
            <h2 class="card-title">Charging Cost</h2>
            <p>Calculate the cost of charging your EV at home or at public charging stations.</p>
            <div class="card-actions mt-4">
              <a href="/calculators/cost" class="btn btn-accent btn-wide">Calculate Now</a>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Stats Section with improved stats component -->
    <section class="py-12">
      <h2 class="mb-8 text-center text-3xl font-bold">Why Use Our EV Calculators</h2>
      <div class="stats stats-vertical lg:stats-horizontal w-full shadow">
        <div class="stat">
          <div class="stat-figure text-primary">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              class="inline-block h-8 w-8 stroke-current"
              ><path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              ></path></svg
            >
          </div>
          <div class="stat-title">Accurate Estimates</div>
          <div class="stat-value text-primary">99%</div>
          <div class="stat-desc">Real-world precision</div>
        </div>

        <div class="stat">
          <div class="stat-figure text-secondary">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              class="inline-block h-8 w-8 stroke-current"
              ><path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4"
              ></path></svg
            >
          </div>
          <div class="stat-title">Customizable</div>
          <div class="stat-value text-secondary">100+</div>
          <div class="stat-desc">Parameter combinations</div>
        </div>

        <div class="stat">
          <div class="stat-figure text-accent">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              class="inline-block h-8 w-8 stroke-current"
              ><path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4"
              ></path></svg
            >
          </div>
          <div class="stat-title">Free Forever</div>
          <div class="stat-value text-accent">100%</div>
          <div class="stat-desc">No payment required</div>
        </div>
      </div>
    </section>
  </div>
</div>

<!-- EV Facts Section - Full Width -->
<section class="bg-base-200 py-12">
  <div class="container mx-auto px-4">
    <h2 class="mb-8 text-center text-3xl font-bold">EV Charging Facts</h2>
    <div class="mx-auto max-w-5xl">
      <div class="grid gap-8 md:grid-cols-3">
        <div class="card bg-base-100 shadow-lg">
          <div class="card-body">
            <div class="mb-4 flex items-center gap-4">
              <div class="badge badge-primary badge-lg p-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  class="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M13 10V3L4 14h7v7l9-11h-7z"
                  />
                </svg>
              </div>
              <h3 class="card-title">Fast Charging</h3>
            </div>
            <p>
              DC fast chargers can add up to 100 miles of range in just 20-30 minutes, depending on the vehicle model.
            </p>
          </div>
        </div>

        <div class="card bg-base-100 shadow-lg">
          <div class="card-body">
            <div class="mb-4 flex items-center gap-4">
              <div class="badge badge-secondary badge-lg p-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  class="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                  />
                </svg>
              </div>
              <h3 class="card-title">Home Charging</h3>
            </div>
            <p>
              Over 80% of EV charging happens at home, where Level 2 chargers can fully recharge most EVs overnight.
            </p>
          </div>
        </div>

        <div class="card bg-base-100 shadow-lg">
          <div class="card-body">
            <div class="mb-4 flex items-center gap-4">
              <div class="badge badge-accent badge-lg p-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  class="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <h3 class="card-title">Cost Savings</h3>
            </div>
            <p>
              EV owners save 50-70% on fuel costs compared to gas vehicles, with average electricity costs of $0.12/kWh.
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</section>

<!-- Call to Action - Full Width -->
<section class="py-12">
  <div class="container mx-auto px-4">
    <div class="card bg-primary text-primary-content mx-auto max-w-2xl">
      <div class="card-body text-center">
        <h2 class="card-title mx-auto mb-2 text-2xl font-bold">Ready to optimize your EV charging?</h2>
        <p class="mb-6">Choose one of our calculators to get started on your EV journey.</p>
        <div class="card-actions justify-center">
          <a href="/calculators/frequency" class="btn">Frequency Calculator</a>
          <a href="/calculators/charging-time" class="btn">Time Calculator</a>
          <a href="/calculators/cost" class="btn">Cost Calculator</a>
        </div>
      </div>
    </div>
  </div>
</section>
