# Angular Tailwind Template

A modern, production-ready Angular template built with Angular 21, TypeScript, and Tailwind CSS 4. Features a beautiful, responsive UI with multiple pages and components ready to use.

## ✨ Features

- 🅰️ **Angular 21** - Latest Angular with standalone components
- 🎨 **Tailwind CSS 4** - Latest Tailwind with new @import syntax
- 📘 **TypeScript** - Type safety and enhanced developer experience
- 🛣️ **Angular Router** - Client-side routing with multiple pages
- 🌓 **Dark Mode Support** - Built-in dark mode styling
- 📱 **Responsive Design** - Mobile-first responsive components
- ✅ **Vitest** - Fast unit testing with Vitest
- 💅 **Prettier** - Code formatting for consistency
- 📦 **Standalone Components** - No NgModules required

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ and npm

### Installation

1. Clone the repository
2. Install dependencies:

```bash
npm install
```

3. Start the development server:

```bash
npm start
# or
ng serve
```

The application will be available at `http://localhost:4200`

## 📜 Available Scripts

### Development

```bash
npm start            # Start Angular development server
ng serve             # Alternative to npm start
ng generate component component-name  # Generate new component
```

### Production

```bash
npm run build        # Create production build
ng build             # Alternative to npm run build
```

### Testing

```bash
npm test             # Run unit tests with Vitest
ng test              # Alternative to npm test
```

## 📁 Project Structure

```
src/
├── app/
│   ├── components/
│   │   ├── header/        # Navigation header with mobile menu
│   │   └── footer/        # Footer with links and social icons
│   ├── pages/
│   │   ├── home/          # Landing page with hero and features
│   │   ├── about/         # About page with team section
│   │   ├── services/      # Services showcase page
│   │   └── contact/       # Contact page with form
│   ├── app.ts             # Root component
│   ├── app.config.ts      # Application configuration
│   └── app.routes.ts      # Route definitions
├── styles.css             # Global styles with Tailwind directives
└── main.ts                # Application entry point
```

## 🎨 Pages Included

### Home Page
- Hero section with gradient text
- Feature cards with icons
- Statistics section
- Call-to-action sections

### About Page
- Company mission and values
- Technology stack showcase
- Team member profiles with images

### Services Page
- Service cards with detailed features
- Multiple service categories
- Interactive hover effects

### Contact Page
- Contact form with validation
- Contact information cards
- Social media links
- Responsive two-column layout

## 🎨 Customization

### Colors
The template uses a blue-purple gradient theme. To customize colors, update the Tailwind classes in components or modify `tailwind.config.js`.

### Components
All components use Angular's standalone component architecture:
- No NgModules required
- Each component is self-contained
- Import dependencies directly in component metadata

### Adding New Pages
1. Generate a new component: `ng generate component pages/your-page`
2. Create route files: `your-page.ts`, `your-page.html`, `your-page.css`
3. Import and add the route in `src/app/app.routes.ts`

## 🛠️ Tech Stack

- **Angular 21** - Web application framework
- **TypeScript 5.9** - Type-safe JavaScript
- **Tailwind CSS 4** - Utility-first CSS framework
- **Vite** - Build tool (via Angular build system)
- **Vitest 4** - Unit testing framework
- **Prettier** - Code formatting

## 🚀 Deployment

### Firebase Hosting (Automatic with GitHub Actions)

This template is configured for automatic deployment to Firebase Hosting via GitHub Actions.

#### Initial Setup

1. **Create a Firebase project** at [Firebase Console](https://console.firebase.google.com/)

2. **Install Firebase CLI:**
   ```bash
   npm install -g firebase-tools
   ```

3. **Login to Firebase:**
   ```bash
   firebase login
   ```

4. **Generate a service account key:**
   - Go to Firebase Console → Project Settings → Service Accounts
   - Click "Generate New Private Key"
   - Save the JSON file securely

5. **Add Firebase secret to GitHub:**
   - Go to your GitHub repo → Settings → Secrets and variables → Actions
   - Click "New repository secret"
   - Name: `FIREBASE_SERVICE_ACCOUNT`
   - Value: Paste the entire contents of the service account JSON file
   - Click "Add secret"

6. **Push to GitHub:**
   ```bash
   git add .
   git commit -m "Setup Firebase deployment"
   git push origin main
   ```

Your app will automatically build and deploy to Firebase whenever you push to the `main` branch!

#### Manual Deployment

You can also deploy manually:

```bash
# Build your app
npm run build

# Deploy to Firebase
firebase deploy
```

**Firebase Configuration:**
- Build directory: `dist/angular-tailwind-template/browser`
- Single-page app: Yes (configured in `firebase.json`)

## 📚 Documentation

- [CLAUDE.md](./CLAUDE.md) - Architecture and development guide
- [Angular Documentation](https://angular.dev) - Official Angular docs
- [Tailwind CSS 4 Documentation](https://tailwindcss.com/docs) - Tailwind CSS docs

## 📝 License

This project is open source and available under the MIT License.

## 👤 Author

Created with ❤️ by [Ishan Sasika](https://github.com/ishansasika)
