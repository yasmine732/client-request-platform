# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is an Angular 21 template application integrated with Tailwind CSS 4. It uses standalone components (no NgModules), Vitest for testing, and npm as the package manager.

## Development Commands

**Start dev server:**
```bash
ng serve
# or
npm start
```
Server runs at http://localhost:4200/

**Build:**
```bash
ng build                           # Production build (default)
ng build --configuration development  # Development build
npm run watch                      # Watch mode with development config
```
Build output: `dist/` directory

**Testing:**
```bash
ng test        # Run all tests with Vitest
npm test       # Same as above
```

**Generate code:**
```bash
ng generate component component-name
ng generate --help  # See all available schematics
```

## Architecture

### Component Structure

This application uses Angular's standalone component architecture (no NgModules). Components are organized by type:

- **Layout components** (`src/app/components/`): Reusable UI elements like Header and Footer
- **Page components** (`src/app/pages/`): Route-level components (Home, About, Services, Contact)

### Routing

Routes are defined in `src/app/app.routes.ts`. The application uses eager loading for all routes with a catch-all redirect to home for unknown paths.

### Styling

**Tailwind CSS v4 Setup:**
- **Global styles:** `src/styles.css` uses `@import "tailwindcss";` (v4 syntax, not `@tailwind` directives)
- **Tailwind config:** `tailwind.config.js` (scans `src/**/*.{html,ts}`)
- **PostCSS config:** `.postcssrc.json` (uses `@tailwindcss/postcss` plugin required for v4)
- **Component styles:** Each component has its own `.css` file
- The app supports both light and dark color schemes via `prefers-color-scheme`
- Layout uses CSS flexbox with `.page-container` and `.content-wrapper` classes for sticky footer

**Important:** This project uses Tailwind CSS v4 which requires:
1. The new `@import "tailwindcss";` syntax instead of old `@tailwind` directives
2. The `@tailwindcss/postcss` package and `.postcssrc.json` configuration

### Application Bootstrap

- Entry point: `src/main.ts`
- App config: `src/app/app.config.ts` (provides router and global error listeners)
- Root component: `src/app/app.ts` (includes RouterOutlet, Header, and Footer)

### File Naming Convention

Components use a simple naming pattern without `.component` suffix:
- TypeScript: `component-name.ts`
- Template: `component-name.html`
- Styles: `component-name.css`
- Tests: `component-name.spec.ts`

Example: `header.ts`, `header.html`, `header.css`, `header.spec.ts`

### Component Patterns

Components use:
- `imports` array instead of module declarations
- `templateUrl` and `styleUrl` for external files
- Standard Angular imports like `RouterLink`, `RouterLinkActive`, `CommonModule` as needed

## Build Configuration

Bundle size budgets (production):
- Initial bundle: 500kB warning, 1MB error
- Component styles: 4kB warning, 8kB error

## Deployment

### Firebase Hosting

**Build for production:**
```bash
ng build
```

**Deploy to Firebase:**
```bash
firebase deploy
```

**Important:** The `firebase.json` is configured to deploy from `dist/angular-tailwind-template/browser` which is the output directory for Angular's application builder. Do not change this path unless the project name changes.

## Prettier Configuration

Configured in `package.json`:
- Print width: 100
- Single quotes: enabled
- Angular parser for HTML files

## Git Conventions

### Commit Format
```
feat: Add <description>
fix: Fix <description>
docs: Update <description>
```

- Use lowercase after the prefix
- Keep messages concise and descriptive

### Branch Naming
```
release/v{version}-{short-description}
```
Example: `release/v4.1.0-neon-status-particle`

### Important Rules
- **Never add `Co-Authored-By: Claude` lines** to any commit messages or PR descriptions
- **Never include AI attribution** in commits, PRs, or any git history
