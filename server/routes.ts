import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./postgres-storage";
import { setupAuth, isAuthenticated } from "./googleAuth";
import { insertUserRecipeActionSchema, updateExtractedRecipeSchema } from "@shared/schema";
import { z } from "zod";
import { getUserExtractedRecipes, getRandomExtractedRecipe, getRecipeById, getUserRecentRecipes } from "./neon-routes";
import { WebhookRecipeService } from "./webhook-service";

const subscriptionSchema = z.object({
  userId: z.string(),
  planType: z.enum(["pro"]),
  duration: z.enum(["monthly"]),
});

const urlCaptureSchema = z.object({
  url: z.string().url(),
  recipeName: z.string().optional(),
});

export async function registerRoutes(app: Express): Promise<Server> {
  console.log('🔧 Setting up authentication system');
  await setupAuth(app);

  // ─── Auth ───────────────────────────────────────────────────────────
  app.get('/api/auth/user', async (req: any, res) => {
    try {
      const userId = (req.user as any)?.id;

      if (userId && userId !== 'dev-user-123') {
        console.log(`👤 Authenticated user: ${userId}`);
        return res.json({
          id: userId,
          email: (req.user as any)?.email || 'user@chef-roulette.com',
          firstName: (req.user as any)?.first_name || 'User',
          lastName: (req.user as any)?.last_name || '',
          profileImageUrl: (req.user as any)?.picture || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
          username: (req.user as any)?.username || null,
          points: 0,
          streak: 0,
          recipesCooked: 0,
          weeklyPoints: 0,
          isPro: false,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        });
      }

      const isDevelopment = process.env.NODE_ENV === 'development' || !process.env.NODE_ENV;
      if (isDevelopment) {
        console.log('🔧 Using development mock user');
        return res.json({
          id: 'dev-user-123',
          email: 'dev@chef-roulette.com',
          firstName: 'Developer',
          lastName: 'User',
          profileImageUrl: 'https://robohash.org/chef-marco.png?set=set5&size=150x150',
          username: null,
          points: 150,
          streak: 5,
          recipesCooked: 12,
          weeklyPoints: 85,
          isPro: false,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        });
      }

      console.log('❌ No authenticated user in production');
      return res.status(401).json({ message: "Not authenticated" });
    } catch (error) {
      console.error("Error fetching user:", error);
      res.status(500).json({ message: "Failed to fetch user" });
    }
  });

  // ─── User profile ───────────────────────────────────────────────────
  app.patch('/api/user/:id', async (req: any, res) => {
    try {
      const userId = req.params.id;
      const currentUserId = (req.user as any)?.id || 'dev-user-123';
      if (userId !== currentUserId) {
        return res.status(403).json({ message: "Forbidden: Can only update your own profile" });
      }

      const updates = req.body;
      if (userId === 'dev-user-123') {
        return res.json({ ...updates, id: 'dev-user-123', updatedAt: new Date().toISOString() });
      }

      const updatedUser = await storage.updateUser(userId, updates);
      res.json(updatedUser);
    } catch (error) {
      console.error("Error updating user:", error);
      res.status(500).json({ message: "Failed to update user profile" });
    }
  });

  app.get("/api/user/:id", async (req, res) => {
    try {
      const user = await storage.getUser(req.params.id);
      if (!user) return res.status(404).json({ message: "User not found" });
      res.json(user);
    } catch (error) {
      console.error("Error fetching user:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // ─── Recipes (read paths use neon-routes, all UUID-keyed) ──────────
  app.get("/api/recipes", getUserExtractedRecipes);

  // /api/recipes/random MUST be registered before /:id to avoid being
  // captured as id="random".
  app.get("/api/recipes/random", getRandomExtractedRecipe);

  app.get("/api/recipes/:id", async (req, res) => {
    try {
      const recipe = await getRecipeById(req.params.id);
      if (!recipe) return res.status(404).json({ message: "Recipe not found" });
      res.json(recipe);
    } catch (error) {
      console.error("Error fetching recipe:", error);
      res.status(500).json({ message: "Failed to fetch recipe" });
    }
  });

  app.patch("/api/extracted-recipes/:id", isAuthenticated, async (req, res) => {
    try {
      const authenticatedUserId = (req.user as any)?.id;
      if (!authenticatedUserId) return res.status(401).json({ message: "Unauthorized" });

      const recipeId = req.params.id;
      const existingRecipe = await storage.getExtractedRecipe(recipeId);
      if (!existingRecipe) return res.status(404).json({ message: "Recipe not found" });

      const content = await storage.getSocialMediaContent(existingRecipe.socialMediaContentId);
      if (!content || content.userId !== authenticatedUserId) {
        return res.status(403).json({ message: "Access denied - you can only edit your own recipes" });
      }

      const updates = updateExtractedRecipeSchema.parse(req.body);
      const updatedRecipe = await storage.updateExtractedRecipe(recipeId, updates);
      if (!updatedRecipe) return res.status(404).json({ message: "Recipe not found" });
      res.json(updatedRecipe);
    } catch (error) {
      console.error("Error updating extracted recipe:", error);
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid recipe data", errors: error.errors });
      }
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // ─── User actions (cook, like, share, bookmark) ─────────────────────
  app.post("/api/user-actions", async (req, res) => {
    try {
      let authenticatedUserId = (req.user as any)?.id;
      if (!authenticatedUserId) {
        const isDevelopment = process.env.NODE_ENV === 'development' || !process.env.NODE_ENV;
        if (isDevelopment) {
          console.log('⚠️ No authenticated user found for user action, using development fallback');
          authenticatedUserId = 'dev-user-123';
        } else {
          return res.status(401).json({ message: "Unauthorized" });
        }
      }

      // Strip any client-supplied userId; trust the session/token only.
      const { userId: _ignored, ...requestData } = req.body;
      const actionData = insertUserRecipeActionSchema.parse({
        ...requestData,
        userId: authenticatedUserId,
      });
      const action = await storage.recordUserAction(actionData);

      if (actionData.action === "cooked") {
        const user = await storage.getUser(actionData.userId);
        if (user) {
          await storage.updateUser(actionData.userId, {
            recipesCooked: (user.recipesCooked || 0) + 1,
            points: (user.points || 0) + 50,
            weeklyPoints: (user.weeklyPoints || 0) + 50,
          });
        }
      }

      res.status(201).json(action);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid action data", errors: error.errors });
      }
      res.status(400).json({ message: "Invalid action data" });
    }
  });

  // ─── Challenges ─────────────────────────────────────────────────────
  app.get("/api/user/:id/challenges", async (req, res) => {
    try {
      const userId = req.params.id;
      // Dev mock user has no real challenges in storage.
      if (userId === 'dev-user-123') return res.json([]);
      const challenges = await storage.getActiveUserChallenges(userId);
      res.json(challenges);
    } catch (error) {
      console.error('Error getting user challenges:', error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // ─── Recipe capture (delegates to external webhook) ─────────────────
  app.post("/api/recipes/capture", async (req: any, res) => {
    try {
      const { url, recipeName } = urlCaptureSchema.parse(req.body);
      let userId = (req.user as any)?.id;
      if (!userId) {
        userId = 'dev-user-123';
        console.log('🔧 Using default development user for testing');
      }

      console.log(`🎬 Starting video capture for user ${userId}: ${url}`);

      const validation = WebhookRecipeService.validateUrl(url);
      if (!validation.isValid) {
        return res.status(400).json({ success: false, error: validation.error });
      }

      console.log(`📡 Calling external webhook for ${validation.platform} video...`);
      const result = await WebhookRecipeService.processVideoRecipe(url, userId, recipeName);

      if (result.success && result.data) {
        const webhookResult = result.data;
        console.log(`✅ Webhook processing completed: ${webhookResult.status} - ${webhookResult.recipe_title}`);

        if (
          webhookResult.status === 'completed' &&
          webhookResult.recipe_title !== 'Recipe Not Available' &&
          webhookResult.recipe_title !== 'Recipe Not Found'
        ) {
          try {
            const recipeDetails = await getRecipeById(webhookResult.recipe_id);
            if (recipeDetails) {
              console.log(`📋 Retrieved full recipe details: ${recipeDetails.title}`);
              return res.json({
                success: true,
                message: `Recipe "${recipeDetails.title}" has been successfully extracted and added to your collection!`,
                data: {
                  ...recipeDetails,
                  recipeId: webhookResult.recipe_id,
                  status: webhookResult.status,
                  processedAt: webhookResult.processed_at,
                  platform: validation.platform,
                },
              });
            }
            return res.json({
              success: true,
              message: `Recipe "${webhookResult.recipe_title}" has been successfully processed and added to your collection!`,
              data: {
                title: webhookResult.recipe_title,
                recipeId: webhookResult.recipe_id,
                status: webhookResult.status,
                processedAt: webhookResult.processed_at,
                platform: validation.platform,
              },
            });
          } catch (dbError) {
            console.error('Error fetching recipe details:', dbError);
            return res.json({
              success: true,
              message: `Recipe "${webhookResult.recipe_title}" has been successfully processed and added to your collection!`,
              data: {
                title: webhookResult.recipe_title,
                recipeId: webhookResult.recipe_id,
                status: webhookResult.status,
                processedAt: webhookResult.processed_at,
                platform: validation.platform,
              },
            });
          }
        }

        return res.json({
          success: false,
          status: webhookResult.status,
          message: webhookResult.recipe_title,
          platform: validation.platform,
        });
      }

      console.log('❌ No valid response from webhook');
      return res.json({
        success: false,
        message: result.message || 'Unable to process this video. The content may be private, unavailable, or not contain extractable recipe information.',
        error: 'Video processing failed',
      });
    } catch (error: any) {
      console.error('❌ Recipe capture error:', error);

      if (error.message?.includes('rate limit')) {
        return res.status(429).json({ success: false, error: 'Too many requests. Please wait before trying again.' });
      }
      if (error.message?.includes('Network error')) {
        return res.status(503).json({ success: false, error: 'Video processing service is temporarily unavailable. Please try again later.' });
      }

      // The webhook write may have succeeded even if the response shape was off.
      // Look for a recipe created in the last 5 minutes for this user before giving up.
      if (error.message?.includes('Invalid data format') || error.message?.includes('Unable to parse webhook response')) {
        console.error('⚠️ Response parsing issue, checking if recipes were actually processed...');
        try {
          const currentUserId = (req.user as any)?.id || 'dev-user-123';
          const recentRecipes = await getUserRecentRecipes(currentUserId, 1);
          if (recentRecipes && recentRecipes.length > 0) {
            const latestRecipe = recentRecipes[0];
            const recipeDate = latestRecipe.createdAt || latestRecipe.processed_at;
            const timeDiff = recipeDate ? Date.now() - new Date(recipeDate).getTime() : Infinity;
            if (timeDiff < 5 * 60 * 1000) {
              console.log('✅ Found recently processed recipe despite parsing error');
              return res.json({
                success: true,
                message: `Recipe "${latestRecipe.title}" has been successfully extracted and added to your collection!`,
                data: { ...latestRecipe, platform: 'tiktok' },
              });
            }
          }
        } catch (dbError) {
          console.error('Error checking for recent recipes:', dbError);
        }

        return res.status(202).json({
          success: false,
          error: 'Video processing completed but response format was unexpected. Please check your recipes - the video may have been processed successfully.',
          note: 'Refresh the page to see if your recipe was added.',
        });
      }

      return res.status(500).json({ success: false, error: 'Unable to process video. Please check the URL and try again.' });
    }
  });

  // ─── Subscription ───────────────────────────────────────────────────
  app.post("/api/subscribe", async (req, res) => {
    try {
      const { userId, planType: _planType, duration: _duration } = subscriptionSchema.parse(req.body);
      const expiresAt = new Date();
      expiresAt.setMonth(expiresAt.getMonth() + 1);

      const user = await storage.updateUser(userId, { isPro: true, proExpiresAt: expiresAt });
      if (!user) return res.status(404).json({ message: "User not found" });
      res.json({ message: "Subscription successful", user });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid subscription data", errors: error.errors });
      }
      res.status(400).json({ message: "Invalid subscription data" });
    }
  });

  app.get("/api/user/:id/subscription", async (req, res) => {
    try {
      const user = await storage.getUser(req.params.id);
      if (!user) return res.status(404).json({ message: "User not found" });

      const isProActive = !!(user.isPro && user.proExpiresAt && new Date() < user.proExpiresAt);
      res.json({
        isPro: isProActive,
        expiresAt: user.proExpiresAt,
        planType: isProActive ? "pro" : "free",
      });
    } catch (error) {
      console.error("Error fetching subscription:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  return createServer(app);
}
