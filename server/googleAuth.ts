import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import passport from "passport";
import session from "express-session";
import type { Express, RequestHandler } from "express";
import connectPg from "connect-pg-simple";
import { storage } from "./postgres-storage";

export function getSession() {
  const sessionTtl = 7 * 24 * 60 * 60 * 1000; // 1 week
  
  // Require SESSION_SECRET in production
  if (process.env.NODE_ENV === 'production' && !process.env.SESSION_SECRET) {
    throw new Error('SESSION_SECRET environment variable is required in production');
  }
  
  // For development, use memory store to avoid database connection issues
  const isDevelopment = process.env.NODE_ENV === 'development';
  if (isDevelopment) {
    console.log('🔧 Using memory store for sessions in development');
    return session({
      secret: process.env.SESSION_SECRET || 'dev-secret-key-change-in-production',
      resave: false,
      saveUninitialized: false,
      cookie: {
        httpOnly: true,
        secure: false,
        maxAge: sessionTtl,
        sameSite: 'lax',
      },
    });
  }
  
  // For production, use PostgreSQL store
  const pgStore = connectPg(session);
  const sessionStore = new pgStore({
    conString: process.env.DATABASE_URL,
    createTableIfMissing: true,
    ttl: sessionTtl,
    tableName: "sessions",
  });
  
  return session({
    secret: process.env.SESSION_SECRET!,
    store: sessionStore,
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: sessionTtl,
      sameSite: 'lax',
    },
  });
}

async function upsertUser(profile: any) {
  await storage.upsertUser({
    id: profile.id,
    email: profile.email,
    firstName: profile.first_name || profile.firstName,
    lastName: profile.last_name || profile.lastName,
    profileImageUrl: profile.picture || profile.profileImageUrl,
  });
}

export async function setupAuth(app: Express) {
  console.log('🔧 Setting up Google OAuth authentication system');
  
  app.set("trust proxy", 1);
  app.use(getSession());
  app.use(passport.initialize());
  app.use(passport.session());

  // Development fallback authentication - ONLY in development
  const isDevelopment = process.env.NODE_ENV === 'development';
  if (isDevelopment) {
    console.log('🚨 Development authentication fallback enabled - NOT for production');
    
    app.get('/api/auth/dev-login', async (req, res) => {
      try {
        // Create a mock user for development
        const mockUser = {
          id: 'dev-user-123',
          email: 'dev@chef-roulette.com',
          first_name: 'Developer',
          last_name: 'User',
          picture: 'https://robohash.org/dev-user-123?set=set4',
          access_token: 'dev-token',
          refresh_token: 'dev-refresh',
          expires_at: Math.floor(Date.now() / 1000) + 3600
        };
        
        // Store user in database
        await storage.upsertUser({
          id: mockUser.id,
          email: mockUser.email,
          firstName: mockUser.first_name,
          lastName: mockUser.last_name,
          profileImageUrl: mockUser.picture,
        });
        
        // Log in the user
        req.login(mockUser, (err) => {
          if (err) {
            console.error('Development login error:', err);
            return res.status(500).json({ error: 'Login failed' });
          }
          console.log('✅ Development user logged in successfully');
          res.redirect('/');
        });
        
      } catch (error: any) {
        console.error('❌ Development auth error:', error);
        res.status(500).json({ error: 'Authentication failed' });
      }
    });
  }

  // Google OAuth Strategy
  if (!process.env.GOOGLE_CLIENT_ID || !process.env.GOOGLE_CLIENT_SECRET) {
    throw new Error('GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET environment variables are required');
  }

  console.log('🔧 Configuring Google OAuth with client ID:', process.env.GOOGLE_CLIENT_ID?.substring(0, 20) + '...');
  
  // Get callback URL based on environment
  const getCallbackURL = () => {
    if (isDevelopment) {
      // Use the Replit development domain
      const replitDomain = process.env.REPLIT_DOMAINS?.split(',')[0];
      return `https://${replitDomain}/api/google/callback`;
    }
    // Production domain
    return 'https://ai-company.co/api/google/callback';
  };

  const callbackURL = getCallbackURL();
  console.log('🔧 Google OAuth callback URL:', callbackURL);

  passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: callbackURL,
    scope: ['profile', 'email']
  }, async (accessToken, refreshToken, profile, done) => {
    try {
      console.log('✅ Google OAuth callback received for user:', profile.emails?.[0]?.value);
      
      const user = {
        id: profile.id,
        email: profile.emails?.[0]?.value,
        first_name: profile.name?.givenName,
        last_name: profile.name?.familyName,
        picture: profile.photos?.[0]?.value,
        access_token: accessToken,
        refresh_token: refreshToken,
        expires_at: Math.floor(Date.now() / 1000) + 3600 // 1 hour from now
      };
      
      await upsertUser(user);
      console.log('✅ User upserted to database:', user.email);
      done(null, user);
    } catch (error: any) {
      console.error('❌ Google OAuth error:', error);
      done(error, null);
    }
  }));

  passport.serializeUser((user: Express.User, cb) => cb(null, user));
  passport.deserializeUser((user: Express.User, cb) => cb(null, user));

  // Main login route
  app.get("/api/login", (req, res, next) => {
    console.log('🔐 Login request received');
    
    // In development, redirect to dev login
    if (isDevelopment) {
      console.log('🔀 Redirecting to development login');
      return res.redirect('/api/auth/dev-login');
    }
    
    // Redirect to Google OAuth
    console.log('🔀 Redirecting to Google OAuth');
    passport.authenticate('google', { scope: ['profile', 'email'] })(req, res, next);
  });

  // Google OAuth callback
  app.get('/api/google/callback', (req, res, next) => {
    console.log('🔐 Google OAuth callback received');
    console.log('Query params:', req.query);
    
    passport.authenticate('google', (err, user, info) => {
      if (err) {
        console.error('❌ Google OAuth authentication error:', err);
        return res.status(500).send(`Authentication failed: ${err.message}`);
      }
      
      if (!user) {
        console.error('❌ No user returned from Google OAuth');
        console.error('Info:', info);
        return res.redirect("/api/login");
      }
      
      req.logIn(user, (loginErr) => {
        if (loginErr) {
          console.error('❌ Login error:', loginErr);
          return res.status(500).send(`Login failed: ${loginErr.message}`);
        }
        console.log('✅ User authenticated successfully via Google OAuth');
        return res.redirect("/");
      });
    })(req, res, next);
  });

  // Logout route
  app.get("/api/logout", (req, res) => {
    console.log('🔐 Logout request received');
    req.logout(() => {
      console.log('✅ User logged out successfully');
      res.redirect('/');
    });
  });
}

export const isAuthenticated: RequestHandler = async (req, res, next) => {
  const user = req.user as any;

  if (!req.isAuthenticated() || !user) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  // User is authenticated
  next();
};
