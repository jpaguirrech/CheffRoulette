# 🍽️ Chef Roulette

> Turn your social media food discoveries into organized, cookable recipes with AI-powered capture and smart discovery.

[![Live Demo](https://img.shields.io/badge/demo-live-brightgreen)](https://your-demo-url.replit.app)
[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
[![Node.js](https://img.shields.io/badge/node.js-20+-brightgreen.svg)](https://nodejs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0+-blue)](https://www.typescriptlang.org/)

## 🎯 Elevator Pitch

Every day you scroll past mouth-watering recipes on TikTok, Instagram, YouTube or Pinterest—only to lose them in a sea of disparate bookmarks, screenshots and half-watched videos. **Chef Roulette** is the AI-powered hub that captures those social-media dishes, extracts full ingredients and steps, tags them by cuisine, diet and cook time, and stores them in one consistent format. When dinner indecision strikes, set your filters or pantry inventory and spin the in-app roulette to get a ready-to-cook suggestion. Earn points for cooking, sharing and completing challenges while reducing food waste.

## ✨ Core Features

### 🎪 Recipe Discovery
- **Roulette Wheel**: Smart recipe suggestions based on your filters and mood
- **AI-Powered Capture**: One-click capture from TikTok, Instagram, YouTube, and Pinterest
- **Smart Filtering**: Find recipes by cuisine, cook time, dietary restrictions, and difficulty
- **Social Media Integration**: Seamlessly import recipes from your favorite food creators

### 🎮 Gamification System
- **Points & Streaks**: Earn rewards for cooking, sharing, and discovering new recipes
- **Weekly Challenges**: Complete cooking challenges to unlock achievements
- **Leaderboards**: Compete with friends and the community
- **Progress Tracking**: Monitor your culinary journey and cooking statistics

### 💎 Freemium Monetization

| Feature | Free (Ad-supported) | Pro ($4.99/mo) |
|---------|-------------------|----------------|
| Save unlimited recipes | ✅ | ✅ |
| Basic tagging & roulette | ✅ | ✅ |
| Pantry-aware roulette & "leftovers mode" | ❌ | ✅ |
| Nutritional & carbon footprint data | ❌ | ✅ |
| No video ads & skip banner ads | ❌ | ✅ |
| Offline access & printable recipe PDFs | ❌ | ✅ |
| Early access to community challenges | ❌ | ✅ |

## 🏗️ Technology Stack

### Frontend
- **React 18** with TypeScript for type-safe component development
- **Tailwind CSS** for utility-first styling with custom design system
- **Radix UI** primitives with shadcn/ui components for accessibility
- **TanStack Query** for efficient server state management
- **Wouter** for lightweight client-side routing
- **Vite** for fast development and optimized builds

### Backend
- **Node.js** with Express.js for RESTful API development
- **TypeScript** with ESM modules for modern JavaScript features
- **PostgreSQL** with Drizzle ORM for type-safe database operations
- **Neon Database** for serverless PostgreSQL hosting
- **Zod** for runtime type validation and schema management

### Development Tools
- **Drizzle Kit** for database migrations and schema management
- **ESBuild** for fast TypeScript compilation
- **PostCSS** with Autoprefixer for CSS processing

## 🚀 Quick Start

### Prerequisites
- Node.js 20+ 
- PostgreSQL database (or use the included Neon setup)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/chef-roulette.git
   cd chef-roulette
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   # Copy example environment file
   cp .env.example .env
   
   # Edit .env with your database connection
   DATABASE_URL="postgresql://username:password@localhost:5432/chef_roulette"
   ```

4. **Initialize the database**
   ```bash
   npm run db:push
   ```

5. **Start the development server**
   ```bash
   npm run dev
   ```

6. **Open your browser**
   Navigate to `http://localhost:5000` to see the application running.

## 📁 Project Structure

```
chef-roulette/
├── client/                 # React frontend application
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   ├── pages/         # Route-based page components
│   │   ├── hooks/         # Custom React hooks
│   │   ├── lib/           # Utility functions and configurations
│   │   └── index.css      # Global styles and CSS variables
│   └── index.html         # HTML entry point
├── server/                # Express.js backend application
│   ├── index.ts          # Server entry point
│   ├── routes.ts         # API route definitions
│   ├── storage.ts        # Data layer interface and implementation
│   └── vite.ts           # Vite integration for development
├── shared/               # Shared types and schemas
│   └── schema.ts         # Database schema and TypeScript types
├── package.json          # Project dependencies and scripts
├── vite.config.ts        # Vite configuration
├── tailwind.config.ts    # Tailwind CSS configuration
├── drizzle.config.ts     # Database configuration
└── tsconfig.json         # TypeScript configuration
```

## 🎨 Design System

Chef Roulette uses a carefully crafted design system with:

- **Primary Colors**: Vibrant orange (#FF6B35) for action items
- **Secondary Colors**: Calming teal (#4ECDC4) for supporting elements  
- **Accent Colors**: Warm yellow (#FFE66D) for highlights and rewards
- **Typography**: Playfair Display for headings, Inter for body text
- **Spacing**: Consistent 8px grid system
- **Shadows**: Subtle elevation for depth and hierarchy

## 🔧 API Endpoints

### Recipes
```
GET    /api/recipes              # Get all recipes with optional filters
GET    /api/recipes/:id          # Get specific recipe
POST   /api/recipes              # Create new recipe
PATCH  /api/recipes/:id          # Update recipe
GET    /api/recipes/random       # Get random recipe for roulette
```

### Users
```
GET    /api/user/:id             # Get user profile
GET    /api/user/:id/challenges  # Get user's active challenges
GET    /api/user/:id/subscription # Get subscription status
```

### Actions
```
POST   /api/user-actions         # Record user actions (cook, like, share)
POST   /api/capture-recipe       # Capture recipe from social media URL
POST   /api/subscribe            # Subscribe to Pro plan
```

## 🧪 Development Scripts

```bash
# Development
npm run dev              # Start development server with hot reload
npm run build           # Build for production
npm run preview         # Preview production build locally

# Database
npm run db:push         # Push schema changes to database
npm run db:studio       # Open Drizzle Studio for database management

# Code Quality
npm run type-check      # Run TypeScript type checking
npm run lint           # Run ESLint for code quality
npm run format         # Format code with Prettier
```

## 🌟 Key Features in Detail

### Recipe Capture with AI
The platform uses advanced AI processing to extract structured recipe data from social media content:
- **Speech-to-Text**: Converts video narration to ingredient lists
- **OCR Technology**: Reads text overlays and captions
- **Computer Vision**: Identifies ingredients and cooking techniques
- **Smart Tagging**: Automatically categorizes by cuisine, diet, and difficulty

### Intelligent Roulette System
The recipe roulette goes beyond random selection:
- **Filter Integration**: Respects your dietary preferences and time constraints
- **Pantry Mode** (Pro): Suggests recipes based on ingredients you have
- **Learning Algorithm**: Improves suggestions based on your cooking history
- **Mood Detection**: Considers time of day and weather for recommendations

### Gamification Engine
Keeps users engaged through meaningful progression:
- **Streak Tracking**: Maintains cooking momentum with daily challenges
- **Achievement System**: Unlocks rewards for culinary milestones
- **Social Challenges**: Community-driven cooking competitions
- **Progress Visualization**: Clear metrics on cooking improvement

## 🔐 Environment Variables

Create a `.env` file in the root directory:

```env
# Database
DATABASE_URL="postgresql://username:password@host:port/database"

# Optional: For development
NODE_ENV="development"
PORT=5000

# Optional: For Replit deployment
REPL_ID="your-repl-id"
REPLIT_DOMAINS="your-domain.replit.app"
```

## 🚀 Deployment

### Replit Deployment (Recommended)
1. Fork this repository to your Replit account
2. Set up environment variables in the Secrets tab
3. Run `npm install` to install dependencies
4. Click "Run" to start the application
5. Use Replit's built-in database or connect to external PostgreSQL

### Manual Deployment
1. Build the application: `npm run build`
2. Set up PostgreSQL database
3. Configure environment variables
4. Start the server: `npm start`

## 🤝 Contributing

We welcome contributions to Chef Roulette! Here's how you can help:

1. **Fork the repository**
2. **Create a feature branch**: `git checkout -b feature/amazing-feature`
3. **Make your changes** following our coding standards
4. **Run tests**: `npm run test`
5. **Commit your changes**: `git commit -m 'Add amazing feature'`
6. **Push to the branch**: `git push origin feature/amazing-feature`
7. **Open a Pull Request**

### Development Guidelines
- Follow TypeScript best practices
- Use conventional commit messages
- Add tests for new features
- Update documentation as needed
- Ensure accessibility compliance

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Radix UI** for accessible component primitives
- **Tailwind CSS** for the utility-first CSS framework
- **Drizzle ORM** for type-safe database operations
- **TanStack Query** for excellent server state management
- **Unsplash** for beautiful recipe photography
- **The cooking community** for inspiration and feedback

## 📞 Support

- **Documentation**: [Wiki](https://github.com/yourusername/chef-roulette/wiki)
- **Issues**: [GitHub Issues](https://github.com/yourusername/chef-roulette/issues)
- **Discussions**: [GitHub Discussions](https://github.com/yourusername/chef-roulette/discussions)
- **Email**: support@chefroulette.com

---

**Made with ❤️ for food lovers everywhere**

*Turn your recipe chaos into culinary order with Chef Roulette*