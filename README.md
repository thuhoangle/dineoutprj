# DineOut - Project Setup and Run Guide

DineOut is a restaurant discovery and reservation platform built as a monorepo with two main applications: a customer-facing web app and an admin dashboard.

## 🏗️ Project Architecture

### Applications
- **`apps/web`** - Customer-facing Next.js application for restaurant discovery and reservations
- **`apps/admin`** - Admin dashboard Next.js application for restaurant management

### Shared Packages
- **`packages/ui`** - Shared React component library (`dineout-ui`)
- **`packages/eslint-config`** - Shared ESLint configuration
- **`packages/tailwind-config`** - Shared Tailwind CSS configuration  
- **`packages/typescript-config`** - Shared TypeScript configuration

### Tech Stack
- **Framework**: Next.js 14.1.0
- **Language**: TypeScript
- **Styling**: Tailwind CSS + HeroUI components
- **Backend**: Supabase (Auth, Database, Storage)
- **State Management**: Zustand
- **Build Tool**: Turborepo
- **Package Manager**: npm
- **Deployment**: Netlify

## 🚀 Quick Start

### Prerequisites

- **Node.js**: >= 18.0.0
- **npm**: >= 10.9.0 (specified in packageManager)

### 1. Clone and Install

```bash
# Clone the repository
git clone <[repository-url](https://github.com/thuhoangle/dineoutprj)>
cd monodineout

# Install all dependencies
npm install
```

### 2. Environment Setup

#### env.local

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_ANON_KEY
NEXT_SUPABASE_SERVICE_ROLE_KEY

# API Keys
NEXT_PUBLIC_GEOCODE_API_KEY
NEXT_PUBLIC_MAPBOX_API_KEY
```

### 3. Build Shared Packages

```bash
# Build the shared UI package
cd packages/ui
npm run build
cd ../..
```

### 4. Start Development

```bash
# Start all applications in development mode
npm run dev
```

This will start:
- **Web app**: http://localhost:3000
- **Admin app**: http://localhost:3001

## 📋 Available Scripts

### Root Level Commands

```bash
# Development
npm run dev                 # Start all apps in development mode

# Building
npm run build              # Build all apps and packages
npm run build:web          # Build only web app
npm run build:admin        # Build only admin app

# Code Quality
npm run lint               # Lint all projects
npm run format             # Format code with Prettier
```

### Individual App Commands

#### Web App (apps/web)
```bash
cd apps/web

npm run dev                # Start in development mode
npm run build              # Build for production
npm run start              # Start production server
npm run lint               # Lint the web app
npm run check-types        # TypeScript type checking
```

#### Admin App (apps/admin)
```bash
cd apps/admin

npm run dev                # Start in development mode (port 3001)
npm run build              # Build for production  
npm run start              # Start production server
npm run lint               # Lint the admin app
```

#### UI Package (packages/ui)
```bash
cd packages/ui

npm run build              # Build the component library
npm run dev                # Build in watch mode
npm run lint               # Lint the UI package
```

## 🔧 Configuration Details

### Port Configuration

- **Web App**: http://localhost:3000 (default Next.js port)
- **Admin App**: http://localhost:3001 (configured in package.json)

## 🚢 Deployment

### Netlify Deployment

Both applications are configured for Netlify deployment with separate `netlify.toml` files.

#### Web App Deployment
- **Base Directory**: `apps/web`
- **Build Command**: `npm run build` 
- **Publish Directory**: `.next`

#### Admin App Deployment  
- **Base Directory**: `apps/admin`
- **Build Command**: Builds UI package first, then admin app
- **Publish Directory**: `.next`
- **Special Configuration**: 
  - Uses legacy peer deps: `NPM_FLAGS = "--legacy-peer-deps"`
  - Node.js 18: `NODE_VERSION = "18"`

### Environment Variables for Production

Set the same environment variables in your Netlify dashboard:
- Go to Site Settings > Environment Variables
- Add all the variables from your `.env.local` files

## 🐛 Troubleshooting

### Common Issues

1. **Port Already in Use**
   ```bash
   # Kill processes on specific ports
   npx kill-port 3000
   npx kill-port 3001
   ```

2. **Build Errors with UI Package**
   ```bash
   # Rebuild the UI package
   cd packages/ui
   npm run build
   cd ../..
   npm run dev
   ```

3. **Dependency Issues**
   ```bash
   # Clean install
   rm -rf node_modules package-lock.json
   npm install
   ```

4. **TypeScript Errors**
   ```bash
   # Check types across all packages
   npm run check-types
   ```

### Environment Variable Issues

- Ensure all required environment variables are set
- Variables prefixed with `NEXT_PUBLIC_` are exposed to the browser
- Service role keys should NOT be prefixed with `NEXT_PUBLIC_`

## 📁 Project Structure

```
monodineout/
├── apps/
│   ├── admin/           # Admin dashboard app
│   │   ├── src/
│   │   ├── package.json
│   │   └── netlify.toml
│   └── web/             # Customer-facing web app  
│       ├── app/
│       ├── components/
│       ├── package.json
│       └── netlify.toml
├── packages/
│   ├── ui/              # Shared component library
│   ├── eslint-config/   # Shared ESLint config
│   ├── tailwind-config/ # Shared Tailwind config
│   └── typescript-config/ # Shared TypeScript config
├── package.json         # Root package.json with workspaces
├── turbo.json          # Turborepo configuration
└── README.md
```

## 🤝 Development Workflow

1. **Start Development**: `npm run dev`
2. **Make Changes**: Edit files in the respective app/package
3. **Hot Reload**: Changes automatically reload in development
4. **Build Shared Packages**: If you modify `packages/ui`, run `npm run build` in that directory
5. **Test**: Ensure both apps work correctly
6. **Commit**: Follow conventional commit messages
7. **Deploy**: Push to trigger Netlify deployment

## 🆘 Getting Help

If you encounter issues:

1. Check this documentation first
2. Look at the console logs for specific error messages
3. Verify all environment variables are correctly set
4. Ensure all dependencies are installed: `npm install`
5. Try clearing caches and rebuilding: `npm run build`

---
