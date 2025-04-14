# EV Charge Frequency Estimator

An interactive web application for electric vehicle owners to calculate and plan their charging needs.

## Features

- **Charge Frequency Calculator**: Calculate how often you need to charge your EV based on your weekly driving distance and vehicle specifications.
- **Charging Time Calculator**: Estimate how long it takes to charge your vehicle under different conditions.
- **Cost Calculator** (Coming Soon): Calculate the cost of charging your EV at home or at public stations.

## Technologies

- Built with SvelteKit and Svelte 5 Runes
- Styled with TailwindCSS and DaisyUI
- Fully responsive design for all devices
- Dark/light theme support

## Development

This project uses Bun as the package manager and runtime.

### Setup

```bash
# Install dependencies
bun install

# Start development server
bun run dev

# Build for production
bun run build
```

### Structure

- `/src/lib/components/calculators/` - Calculator components
- `/src/lib/components/ui/` - Reusable UI components
- `/src/lib/utils/` - Utility functions and calculations
- `/src/routes/` - SvelteKit routes and pages

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/my-feature`
3. Commit your changes: `git commit -m 'Add my feature'`
4. Push to the branch: `git push origin feature/my-feature`
5. Submit a pull request
