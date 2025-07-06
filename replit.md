# Chef Roulette - Recipe Discovery & Cooking Platform

## Overview

Chef Roulette is a modern web application that gamifies the cooking experience by allowing users to discover recipes through a roulette-style interface. The platform combines social media recipe capture with gamification elements to encourage users to try new dishes and build cooking streaks.

## System Architecture

### Frontend Architecture
- **Framework**: React with TypeScript
- **Styling**: Tailwind CSS with custom CSS variables for theming
- **UI Components**: Radix UI primitives with shadcn/ui component library
- **State Management**: TanStack Query for server state management
- **Routing**: Wouter for lightweight client-side routing
- **Build Tool**: Vite for development and build processes

### Backend Architecture
- **Runtime**: Node.js with Express.js
- **Language**: TypeScript with ESM modules
- **Database**: PostgreSQL with Drizzle ORM
- **Database Provider**: Neon Database (serverless PostgreSQL)
- **Session Management**: PostgreSQL-backed sessions using connect-pg-simple
- **API Design**: RESTful API with JSON responses

### Key Components

#### Recipe Management
- Recipe creation, storage, and retrieval
- Recipe filtering by cuisine, difficulty, category, cook time, and dietary tags
- Recipe capture from external URLs (TikTok, Instagram, YouTube, Pinterest)
- Recipe rating and bookmarking system

#### Gamification System
- User points and streak tracking
- Weekly challenges and progress monitoring
- Achievement system with rewards
- Leaderboard functionality

#### User Management
- User profiles with cooking statistics
- Pro subscription system with enhanced features
- User action tracking (likes, bookmarks, cooking completions)

#### Social Features
- Recipe sharing and discovery
- Community challenges
- User-generated content integration

## Data Flow

1. **Recipe Discovery**: Users can browse recipes through filters or use the roulette wheel for random selection
2. **Recipe Capture**: Users input social media URLs to automatically extract recipe data
3. **User Actions**: All user interactions (likes, bookmarks, cooking completions) are tracked for gamification
4. **Progress Tracking**: User achievements and streaks are calculated and updated in real-time
5. **Subscription Management**: Pro features are gated behind subscription checks

## External Dependencies

### Core Dependencies
- **@neondatabase/serverless**: Serverless PostgreSQL database connection
- **drizzle-orm**: Type-safe database queries and migrations
- **@tanstack/react-query**: Server state management and caching
- **@radix-ui/***: Headless UI components for accessibility
- **express**: Web application framework
- **zod**: Runtime type validation

### Development Dependencies
- **vite**: Build tool and development server
- **typescript**: Type checking and compilation
- **tailwindcss**: Utility-first CSS framework
- **drizzle-kit**: Database schema management and migrations

## Deployment Strategy

### Development Setup
- Vite development server with HMR (Hot Module Replacement)
- Express server with middleware for API routes
- PostgreSQL database with Drizzle migrations
- Environment variables for database connection

### Production Build
- Vite builds the React frontend to static assets
- esbuild bundles the Express server for Node.js runtime
- Database migrations run via `drizzle-kit push`
- Assets served from `dist/public` directory

### Environment Configuration
- `NODE_ENV` for environment detection
- `DATABASE_URL` for PostgreSQL connection
- `REPL_ID` for Replit-specific features

## User Preferences

Preferred communication style: Simple, everyday language.

## Monetization Strategy

Chef Roulette operates on a freemium model with a clear value proposition for upgrading to Pro:

### Free Tier (Ad-supported)
- Save unlimited recipes
- Basic tagging & roulette functionality
- Access to core recipe capture features
- Community challenges (limited access)
- Banner advertisements between recipe cards

### Pro Tier ($4.99/month)
- Pantry-aware roulette & "leftovers mode"
- Complete nutritional & carbon footprint data
- Ad-free experience (no video ads or banner ads)
- Offline access & printable recipe PDFs
- Early access to community challenges
- Advanced filtering and search capabilities
- Priority customer support

### Revenue Streams
1. **Subscription Revenue**: Primary income from Pro memberships
2. **Advertising Revenue**: Display ads for free tier users
3. **Affiliate Marketing**: Kitchen equipment and ingredient partnerships
4. **Data Insights**: Anonymized cooking trend reports (enterprise)

## Recent Changes

- July 06, 2025: Initial Chef Roulette setup with full-stack architecture
- July 06, 2025: Implemented comprehensive README documentation for GitHub
- July 06, 2025: Added monetization plan with freemium tier structure
- July 06, 2025: Fixed TypeScript compilation errors in server routes and storage
- July 06, 2025: Restructured app with proper landing page and authentication flow
- July 06, 2025: Enhanced recipe parsing with platform-specific templates (TikTok, Instagram, YouTube, Pinterest)
- July 06, 2025: Created dedicated dashboard for authenticated users with stats and gamification

## Application Flow

### Public Experience
1. **Landing Page**: Marketing page explaining Chef Roulette's value proposition
2. **Authentication**: Users must sign up/login to access features
3. **Demo Mode**: `/demo` route shows dashboard functionality without authentication

### Authenticated Experience
1. **Dashboard**: Personal cooking hub with stats, recent recipes, and quick actions
2. **Recipe Capture**: Enhanced AI parsing based on social media platform
3. **My Recipes**: Personal recipe collection with filtering and organization
4. **Gamification**: Points, streaks, challenges, and community features

## User Authentication Strategy

Currently implemented as a demo with toggle between public and private routes. Production implementation will include:
- Social login (Google, Facebook, Apple)
- Email/password authentication
- Session management with secure tokens
- Progressive web app capabilities for mobile users

## Changelog

- July 06, 2025: Initial setup with React frontend, Express backend, and PostgreSQL database
- July 06, 2025: Created comprehensive project documentation and GitHub README
- July 06, 2025: Implemented proper landing page and dashboard separation
- July 06, 2025: Enhanced AI recipe parsing with realistic platform-specific templates