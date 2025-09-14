import * as client from "openid-client";
import { Strategy, type VerifyFunction } from "openid-client/passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";

import passport from "passport";
import session from "express-session";
import type { Express, RequestHandler } from "express";
import memoize from "memoizee";
import connectPg from "connect-pg-simple";
import { storage } from "./postgres-storage";

if (!process.env.REPLIT_DOMAINS) {
  throw new Error("Environment variable REPLIT_DOMAINS not provided");
}

const getOidcConfig = memoize(
  async () => {
    return await client.discovery(
      new URL(process.env.ISSUER_URL ?? "https://replit.com/oidc"),
      process.env.REPL_ID!
    );
  },
  { maxAge: 3600 * 1000 }
);

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

function updateUserSession(
  user: any,
  tokens: client.TokenEndpointResponse & client.TokenEndpointResponseHelpers
) {
  user.claims = tokens.claims();
  user.access_token = tokens.access_token;
  user.refresh_token = tokens.refresh_token;
  user.expires_at = user.claims?.exp;
}

async function upsertUser(
  claims: any,
) {
  await storage.upsertUser({
    id: claims["sub"],
    email: claims["email"],
    firstName: claims["first_name"],
    lastName: claims["last_name"],
    profileImageUrl: claims["profile_image_url"] || claims["picture"],
  });
}

export async function setupAuth(app: Express) {
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
          claims: {
            sub: 'dev-user-123',
            email: 'dev@chef-roulette.com',
            first_name: 'Developer',
            last_name: 'User',
            profile_image_url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face'
          },
          access_token: 'dev-token',
          refresh_token: 'dev-refresh',
          expires_at: Math.floor(Date.now() / 1000) + 3600
        };
        
        // Store user in database
        await storage.upsertUser({
          id: mockUser.claims.sub,
          email: mockUser.claims.email,
          firstName: mockUser.claims.first_name,
          lastName: mockUser.claims.last_name,
          profileImageUrl: mockUser.claims.profile_image_url,
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

  let config;
  try {
    config = await getOidcConfig();
  } catch (error: any) {
    console.error('❌ OIDC configuration failed:', error.message);
    
    // In production, we should fail fast rather than silently disable auth
    if (process.env.NODE_ENV === 'production') {
      console.error('🚨 OIDC failure in production - authentication will be limited to Google OAuth only');
      console.error('🔧 Please check REPL_ID and ISSUER_URL environment variables');
      // Don't return - continue with Google OAuth setup
    } else {
      console.warn('⚠️ OIDC configuration failed in development, continuing with available auth methods');
    }
    
    config = null; // Set to null to skip OIDC strategy setup but continue with other auth
  }

  const verify: VerifyFunction = async (
    tokens: client.TokenEndpointResponse & client.TokenEndpointResponseHelpers,
    verified: passport.AuthenticateCallback
  ) => {
    const user = {};
    updateUserSession(user, tokens);
    await upsertUser(tokens.claims());
    verified(null, user);
  };

  // Only set up OIDC strategies if config is available
  if (config) {
    // Get all possible domains (development and production)
    const domains = process.env.REPLIT_DOMAINS!.split(",");
    
    // Add production domain if not already included
    const productionDomain = "ai-company.co";
    if (!domains.includes(productionDomain)) {
      domains.push(productionDomain);
    }
    
    console.log(`🔧 Setting up OIDC authentication for domains: ${domains.join(', ')}`);
    console.log(`🔧 REPL_ID: ${process.env.REPL_ID}`);
    console.log(`🔧 Production domain included: ${domains.includes(productionDomain)}`);
    
    
    for (const domain of domains) {
      const strategy = new Strategy(
        {
          name: `replitauth:${domain}`,
          config,
          scope: "openid email profile offline_access",
          callbackURL: `https://${domain}/api/callback`,
        },
        verify,
      );
      passport.use(strategy);
    }
  } else {
    console.warn('⚠️ Skipping OIDC strategy setup due to configuration failure');
  }

  // Google OAuth Strategy
  if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET) {
    const domains = process.env.REPLIT_DOMAINS!.split(",");
    for (const domain of domains) {
      passport.use(new GoogleStrategy({
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: `https://${domain}/api/google/callback`,
        scope: ['profile', 'email']
      }, async (accessToken, refreshToken, profile, done) => {
        try {
          const user = {
            claims: {
              sub: profile.id,
              email: profile.emails?.[0]?.value,
              first_name: profile.name?.givenName,
              last_name: profile.name?.familyName,
              picture: profile.photos?.[0]?.value,
            },
            access_token: accessToken,
            refresh_token: refreshToken,
            expires_at: Math.floor(Date.now() / 1000) + 3600 // 1 hour from now
          };
          
          await upsertUser(user.claims);
          done(null, user);
        } catch (error) {
          done(error, null);
        }
      }));
    }
  }

  passport.serializeUser((user: Express.User, cb) => cb(null, user));
  passport.deserializeUser((user: Express.User, cb) => cb(null, user));

  app.get("/api/login", (req, res, next) => {
    // In development, redirect to dev login
    const isDevelopment = process.env.NODE_ENV === 'development';
    if (isDevelopment) {
      return res.redirect('/api/auth/dev-login');
    }
    
    // Get the correct hostname - check for production domain
    const hostname = req.hostname === 'ai-company.co' ? 'ai-company.co' : req.hostname;
    console.log(`🔐 Login attempt for domain: ${hostname}`);
    
    // If OIDC config failed, redirect to Google OAuth instead
    if (!config) {
      console.log('🔀 OIDC unavailable, redirecting to Google OAuth');
      return res.redirect('/api/google/login');
    }
    
    passport.authenticate(`replitauth:${hostname}`, {
      prompt: "login consent",
      scope: ["openid", "email", "profile", "offline_access"],
    })(req, res, next);
  });

  app.get("/api/callback", (req, res, next) => {
    // Skip OIDC callback if config is not available
    if (!config) {
      console.log('🔀 OIDC unavailable, redirecting to Google OAuth');
      return res.redirect('/api/google/login');
    }
    
    // Get the correct hostname - check for production domain
    const hostname = req.hostname === 'ai-company.co' ? 'ai-company.co' : req.hostname;
    console.log(`🔐 Callback for domain: ${hostname}`);
    
    passport.authenticate(`replitauth:${hostname}`, {
      successReturnToOrRedirect: "/",
      failureRedirect: "/api/login",
    })(req, res, next);
  });

  // Google OAuth routes
  app.get('/api/google/login', (req, res, next) => {
    passport.authenticate('google', { scope: ['profile', 'email'] })(req, res, next);
  });

  app.get('/api/google/callback', (req, res, next) => {
    passport.authenticate('google', {
      successRedirect: '/',
      failureRedirect: '/api/google/login',
    })(req, res, next);
  });

  app.get("/api/logout", (req, res) => {
    req.logout(() => {
      // If OIDC config is not available, just redirect to home
      if (!config) {
        console.log('🔀 OIDC unavailable for logout, redirecting to home');
        return res.redirect('/');
      }
      
      res.redirect(
        client.buildEndSessionUrl(config, {
          client_id: process.env.REPL_ID!,
          post_logout_redirect_uri: `${req.protocol}://${req.hostname}`,
        }).href
      );
    });
  });
}

export const isAuthenticated: RequestHandler = async (req, res, next) => {
  const user = req.user as any;

  if (!req.isAuthenticated() || !user.expires_at) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const now = Math.floor(Date.now() / 1000);
  if (now <= user.expires_at) {
    return next();
  }

  const refreshToken = user.refresh_token;
  if (!refreshToken) {
    res.status(401).json({ message: "Unauthorized" });
    return;
  }

  try {
    const config = await getOidcConfig();
    const tokenResponse = await client.refreshTokenGrant(config, refreshToken);
    updateUserSession(user, tokenResponse);
    return next();
  } catch (error) {
    res.status(401).json({ message: "Unauthorized" });
    return;
  }
};