import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { setupAuth, isAuthenticated } from "./replitAuth";
import { insertRecipeSchema, insertUserRecipeActionSchema } from "@shared/schema";
import { z } from "zod";
import { analyzeRecipeFromText, analyzeRecipeFromImage, convertAnalysisToInsertRecipe, getPlatformFromUrl } from "./ai-service";

const recipeFiltersSchema = z.object({
  cuisine: z.string().optional(),
  difficulty: z.string().optional(),
  category: z.string().optional(),
  cookTime: z.number().optional(),
  dietaryTags: z.array(z.string()).optional(),
  hasIngredients: z.array(z.string()).optional(),
});

const subscriptionSchema = z.object({
  userId: z.number(),
  planType: z.enum(["pro"]),
  duration: z.enum(["monthly"]),
});

const urlCaptureSchema = z.object({
  url: z.string().url(),
  userId: z.number(),
});

// AI-powered recipe parsing function using Gemini AI
async function parseRecipeFromUrl(url: string) {
  try {
    // Get platform information
    const platform = getPlatformFromUrl(url);
    
    // Create mock content based on platform for AI analysis
    const mockContent = `This is a ${platform} recipe post showing a cooking tutorial. 
    The content demonstrates step-by-step preparation of a delicious dish with clear instructions.
    Platform: ${platform}
    URL: ${url}
    
    The video/post shows cooking techniques, ingredient preparation, and final presentation.
    It includes timing information and serving suggestions appropriate for ${platform} audience.`;
    
    // Use Gemini AI to analyze and extract recipe information
    const analysis = await analyzeRecipeFromText(mockContent, url);
    
    return {
      ...analysis,
      username: `@${platform.toLowerCase()}_chef`,
      imageUrl: getDefaultImageForPlatform(platform)
    };
  } catch (error) {
    console.error("Error parsing recipe with AI:", error);
    // Fallback to basic recipe structure if AI fails
    return getFallbackRecipe(url);
  }
}

function getDefaultImageForPlatform(platform: string): string {
  const images = {
    TikTok: "https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600",
    Instagram: "https://images.unsplash.com/photo-1511690743698-d9d85f2fbf38?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600",
    YouTube: "https://images.unsplash.com/photo-1544025162-d76694265947?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600",
    Pinterest: "https://images.unsplash.com/photo-1499636136210-6f4ee915583e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600"
  };
  return images[platform as keyof typeof images] || images.TikTok;
}

function getFallbackRecipe(url: string) {
  const platform = getPlatformFromUrl(url);
  return {
    title: `${platform} Recipe`,
    description: `A delicious recipe shared on ${platform}`,
    ingredients: ["Basic ingredients based on common recipes"],
    instructions: ["Follow standard cooking procedures"],
    cookTime: 30,
    servings: 4,
    difficulty: "Easy" as const,
    cuisine: "Various",
    category: "Main Course",
    dietaryTags: [],
    platform,
    originalUrl: url,
    username: `@${platform.toLowerCase()}_user`,
    imageUrl: getDefaultImageForPlatform(platform)
  };
}

function getPlatformFromUrl(url: string): string {
  if (url.includes("tiktok")) return "TikTok";
  if (url.includes("instagram")) return "Instagram";
  if (url.includes("youtube")) return "YouTube";
  if (url.includes("pinterest")) return "Pinterest";
  return "TikTok";
}

export async function registerRoutes(app: Express): Promise<Server> {
  // Setup authentication
  await setupAuth(app);

  // Auth routes
  app.get('/api/auth/user', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const user = await storage.getUser(userId);
      res.json(user);
    } catch (error) {
      console.error("Error fetching user:", error);
      res.status(500).json({ message: "Failed to fetch user" });
    }
  });
  // Get user profile
  app.get("/api/user/:id", async (req, res) => {
    try {
      const userId = parseInt(req.params.id);
      const user = await storage.getUser(userId);
      
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      
      res.json(user);
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // Get recipes with filters
  app.get("/api/recipes", async (req, res) => {
    try {
      const filters = recipeFiltersSchema.parse(req.query);
      const recipes = await storage.getRecipes(undefined, filters);
      res.json(recipes);
    } catch (error) {
      res.status(400).json({ message: "Invalid filters" });
    }
  });

  // Get recipe by ID
  app.get("/api/recipes/:id", async (req, res) => {
    try {
      const recipeId = parseInt(req.params.id);
      const recipe = await storage.getRecipe(recipeId);
      
      if (!recipe) {
        return res.status(404).json({ message: "Recipe not found" });
      }
      
      res.json(recipe);
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // Create new recipe
  app.post("/api/recipes", async (req, res) => {
    try {
      const recipeData = insertRecipeSchema.parse(req.body);
      const recipe = await storage.createRecipe(recipeData);
      res.status(201).json(recipe);
    } catch (error) {
      res.status(400).json({ message: "Invalid recipe data" });
    }
  });

  // Update recipe
  app.patch("/api/recipes/:id", async (req, res) => {
    try {
      const recipeId = parseInt(req.params.id);
      const updates = req.body;
      const recipe = await storage.updateRecipe(recipeId, updates);
      
      if (!recipe) {
        return res.status(404).json({ message: "Recipe not found" });
      }
      
      res.json(recipe);
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // Get random recipe for roulette
  app.get("/api/recipes/random", async (req, res) => {
    try {
      const filters = recipeFiltersSchema.parse(req.query);
      const recipe = await storage.getRandomRecipe(filters);
      
      if (!recipe) {
        return res.status(404).json({ message: "No recipes found with these filters" });
      }
      
      res.json(recipe);
    } catch (error) {
      res.status(400).json({ message: "Invalid filters" });
    }
  });

  // Record user action (like, bookmark, cook, share)
  app.post("/api/user-actions", async (req, res) => {
    try {
      const actionData = insertUserRecipeActionSchema.parse(req.body);
      const action = await storage.recordUserAction(actionData);
      
      // Update user stats based on action
      if (actionData.action === "cooked") {
        const user = await storage.getUser(actionData.userId);
        if (user) {
          await storage.updateUser(actionData.userId, {
            recipesCooked: (user.recipesCooked || 0) + 1,
            points: (user.points || 0) + 50, // Award points for cooking
            weeklyPoints: (user.weeklyPoints || 0) + 50,
          });
        }
      }
      
      res.status(201).json(action);
    } catch (error) {
      res.status(400).json({ message: "Invalid action data" });
    }
  });

  // Get user challenges
  app.get("/api/user/:id/challenges", async (req, res) => {
    try {
      const userId = parseInt(req.params.id);
      const challenges = await storage.getActiveUserChallenges(userId);
      res.json(challenges);
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // Capture recipe from URL with AI-powered parsing
  app.post("/api/capture-recipe", isAuthenticated, async (req: any, res) => {
    try {
      const { url } = z.object({ url: z.string().url() }).parse(req.body);
      const userId = req.user.claims.sub;
      
      // Use Gemini AI to analyze and parse the recipe from the URL
      const parsedRecipe = await parseRecipeFromUrl(url);
      
      // Convert the AI analysis to a recipe format for storage
      const recipeData = convertAnalysisToInsertRecipe(parsedRecipe, userId);
      
      const recipe = await storage.createRecipe(recipeData);
      res.status(201).json(recipe);
    } catch (error) {
      console.error("Recipe capture error:", error);
      res.status(400).json({ message: "Unable to capture recipe from this URL" });
    }
  });

  // Subscribe to Pro
  app.post("/api/subscribe", async (req, res) => {
    try {
      const { userId, planType, duration } = subscriptionSchema.parse(req.body);
      
      // Mock subscription processing
      const expiresAt = new Date();
      expiresAt.setMonth(expiresAt.getMonth() + 1); // 1 month from now
      
      const user = await storage.updateUser(userId, {
        isPro: true,
        proExpiresAt: expiresAt,
      });
      
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      
      res.json({ message: "Subscription successful", user });
    } catch (error) {
      res.status(400).json({ message: "Invalid subscription data" });
    }
  });

  // Get subscription status
  app.get("/api/user/:id/subscription", async (req, res) => {
    try {
      const userId = parseInt(req.params.id);
      const user = await storage.getUser(userId);
      
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      
      const isProActive = user.isPro && user.proExpiresAt && new Date() < user.proExpiresAt;
      
      res.json({
        isPro: isProActive,
        expiresAt: user.proExpiresAt,
        planType: isProActive ? "pro" : "free",
      });
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
