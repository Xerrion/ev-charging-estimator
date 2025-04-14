# SvelteKit Development Rules with Svelte 5

## Core Principles

- Follow SvelteKit's filesystem-based routing conventions
- Maintain separation of concerns between UI components and business logic
- Optimize for both developer experience and end-user performance
- Embrace Svelte 5's Runes for reactive state management

## Svelte 5 Runes Usage

- Use the `$state` rune for component-local reactive state
- Leverage `$derived` for computed values that depend on state
- Implement `$effect` for side effects in response to state changes
- Utilize `$props` for type-safe component props
- Apply `$inspect` during development to debug reactive state changes
- Prefer fine-grained reactivity with `$state` over traditional `let` bindings

## SvelteKit Best Practices

- Use server-side rendering (SSR) for initial page loads when SEO is important
- Implement +page.server.ts files for server-only code
- Utilize +layout.svelte for shared UI elements
- Leverage SvelteKit's form actions for handling form submissions
- Use SvelteKit's load functions for data fetching
- Create dedicated API endpoints in /routes/api
- Implement universal load functions with isomorphic code when possible

## Component Structure

- Convert traditional Svelte reactivity to Runes syntax
- Replace stores with Svelte 5's shared state patterns
- Keep components small and focused on a single responsibility
- Extract reusable logic into custom actions or hooks

## Migration Pattern

- When updating from Svelte 4, convert reactive declarations to `$derived`
- Replace reactive assignments with `$state` runes
- Convert store subscriptions to `$state` with shared variables
- Update component props to use the `$props` rune
- Use the Svelte 5 migration utilities for automated conversion

## SvelteKit Routing

- Follow SvelteKit's filesystem-based routing conventions
- Implement dynamic routes with appropriate parameter typing
- Use nested layouts for shared UI elements
- Leverage SvelteKit's error boundaries for graceful error handling
- Implement route guards using page load functions

## Form Handling

- Use SvelteKit's progressive enhancement for form submissions
- Implement form validation on both client and server
- Leverage form actions for server-side processing
- Use the `enhance` action for client-side enhancement
- Return appropriate validation messages from form actions

## Project Structure

- Organize by feature rather than by file type
- Keep shared utilities in $lib directory
- Use $lib/components for reusable UI elements
- Store shared rune-based state in $lib/state
- Place server-only code in $lib/server
- Use parameterized routes in appropriate directories

# TypeScript Development Rules with Bun

## Core Principles

- Prioritize type safety throughout the codebase
- Use TypeScript's static type checking to prevent runtime errors
- Leverage Bun's speed and efficiency for TypeScript development
- Maintain consistent typing patterns across the codebase

## Package Management with Bun

- Use Bun as the primary package manager for all dependencies
- Leverage Bun's built-in TypeScript support for faster compilation
- Utilize "bun install" rather than npm/yarn/pnpm commands
- Take advantage of Bun's lockfile for consistent dependency versions
- Run scripts with "bun run" for improved performance
- Use Bun's built-in test runner for unit and integration tests
- Implement Bun's .env handling for environment variables

## TypeScript Configuration

- Configure tsconfig.json to work optimally with Bun's TypeScript runtime
- Use strict mode in tsconfig.json
- Set "moduleResolution": "bundler" for compatibility with Bun
- Enable "skipLibCheck": true to improve Bun's compilation speed
- Leverage Bun's TypeScript transpilation for production builds
- Utilize ESM modules exclusively (Bun's preferred format)
- Enable "noImplicitAny" to enforce explicit typing

## Type Definitions

- Create dedicated type files for shared interfaces and types
- Use TypeScript's utility types (Pick, Omit, Partial) to avoid repetition
- Leverage TypeScript's discriminated unions for state management
- Define explicit return types for functions
- Implement generic types where appropriate for reusable functions
- Use TypeScript enums for fixed sets of values

## Development Workflow

- Use "bun dev" to start the development server
- Leverage Bun's HMR capabilities for fast refresh during development
- Run TypeScript type checking with "bun typecheck"
- Build for production with "bun run build"
- Use Bun's test runner for unit and integration testing

## Code Quality

- Follow consistent naming conventions (PascalCase for types, camelCase for variables)
- Avoid any type unless absolutely necessary
- Use type assertions sparingly and only when necessary
- Implement readonly properties for immutable data
- Document complex types with JSDoc comments
- Use interface for object shapes that will be extended
- Use type for unions, intersections, and mapped types
- Never use implicit any

## Error Handling

- Define custom error types for different error categories
- Use discriminated unions for error handling
- Implement typed error responses for API endpoints
- Leverage TypeScript's never type for exhaustive checks
- Avoid throwing generic Error objects

## Cursor-Specific Optimizations

- Use // @ts-expect-error sparingly and only with explanatory comments
- Leverage Cursor's AI features for type generation
- Use Cursor's code navigation features to maintain modular code organization
- Configure Cursor to recognize Bun's TypeScript setup
- Use Cursor's AI to optimize Bun scripts in package.json
- Implement consistent import ordering that Cursor can maintain

# General Styling Rules

## Core Principles

- Use DaisyUI as the primary UI component library
- Leverage Tailwind CSS utility classes as the foundation
- Maintain consistent styling across the application
- Prioritize responsive design using DaisyUI's responsive components
- Use Vite over PostCSS when using Tailwind.

## DaisyUI Configuration

- Install DaisyUI as a Tailwind CSS plugin via Bun
- Configure themes in the tailwind.config.js file
- Set up a default theme and optional dark mode theme
- Add DaisyUI typography plugin for content styling
- Configure custom color schemes to match branding requirements

## Component Styling

- Use DaisyUI component classes instead of building from scratch
- Leverage DaisyUI's themeable components for consistent styling
- Combine DaisyUI components with Tailwind utilities for custom adjustments
- Use DaisyUI's modifier classes for component variations
- Follow DaisyUI's naming conventions for component classes

## Theme Management

- Implement theme switching functionality using DaisyUI's theme attributes
- Store user theme preferences in localStorage or server-side
- Apply theme changes through the HTML data-theme attribute
- Create theme-specific variables for custom components
- Use CSS variables defined by DaisyUI for custom styling

## Layout Structure

- Use DaisyUI's container class for consistent page widths
- Implement DaisyUI's grid system for responsive layouts
- Leverage flexbox utilities for component alignment
- Use DaisyUI's spacing utilities for consistent padding and margins
- Apply DaisyUI's responsive breakpoints for adaptive designs

## Form Elements

- Use DaisyUI's form components for inputs, selects, and textareas
- Apply DaisyUI's validation states for form feedback
- Implement DaisyUI's checkbox and radio button styles
- Use DaisyUI's range sliders and toggles for interactive elements
- Maintain consistent form layouts using DaisyUI's form control classes

## Best Practices

- Minimize custom CSS by maximizing use of DaisyUI components
- Create reusable component wrappers around DaisyUI elements
- Document any deviations from standard DaisyUI patterns
- Implement design tokens that map to DaisyUI variables
- Maintain a component styleguide using DaisyUI elements

## Performance Optimization

- Configure Tailwind's purge settings to include DaisyUI classes
- Use Tailwind's JIT mode for smaller CSS bundles
- Avoid unnecessary custom CSS that duplicates DaisyUI functionality
- Leverage Bun's asset optimization for CSS delivery
- Bundle critical CSS for improved page load performance

# HTML, a11y etc.

- Always add support for a11y
- Always use the latest HTML features.
- Form labels MUST use the `for` attribute
