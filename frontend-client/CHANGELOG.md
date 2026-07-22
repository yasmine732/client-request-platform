# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [2.0.0] - 2025-01-11

### Added
- **Lucide Angular**: Modern icon library with 1000+ icons
- **NGX Sonner**: Beautiful toast notifications for Angular
- **Enhanced UI Components**:
  - Button component with variants (primary, secondary, outline, ghost, danger) and loading states
  - Card components (Card, CardHeader, CardContent, CardFooter)
  - Badge component with color variants (default, primary, success, warning, danger, info)
- **404 Not Found Page**: Animated error page with navigation options and Lucide icons
- **Toast Notifications**: Global toast system using ngx-sonner
- **Environment Variables**: .env.example with common configuration options

### Changed
- Updated routing to use NotFound component instead of redirect for 404s
- Enhanced app root with toast notifications
- Improved user experience with CSS animations

### Developer Experience
- All UI components as standalone Angular components
- Reusable component library ready for expansion
- Toast notifications system integrated in root component

## [1.0.0] - 2025-01-11

### Added
- Initial production-ready release
- Complete UI with 4 pages (Home, About, Services, Contact)
- Angular 21 with standalone components (no NgModules)
- Tailwind CSS 4 with new @import syntax
- TypeScript 5.9 with strict mode
- Vitest 4 for fast unit testing
- Dark mode support throughout the application
- Mobile-first responsive design
- Beautiful blue-purple gradient theme
- MIT License file
- EditorConfig for consistent coding styles
- Prettier configuration for code formatting
- VS Code workspace recommendations
- Firebase deployment configuration
- GitHub Actions workflow for automatic deployment
- Comprehensive README with setup instructions
- CLAUDE.md with detailed architecture documentation

### Features
- **Header Component**: Sticky navigation with mobile menu and active route highlighting
- **Footer Component**: Multi-column footer with brand info, quick links, and social icons
- **Home Page**: Hero section, feature cards, statistics, and CTAs
- **About Page**: Mission statement, tech stack showcase, values cards, and team profiles
- **Services Page**: 6 color-coded service cards with detailed features
- **Contact Page**: Functional contact form with validation and contact information

### Developer Experience
- Standalone component architecture (no NgModules required)
- Type-safe development with TypeScript strict mode
- Fast build times with Angular build system
- Vitest for lightning-fast unit tests
- Prettier for consistent code formatting
- Catch-all route for 404 handling
- Production-optimized builds
