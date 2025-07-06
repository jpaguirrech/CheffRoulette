import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertRecipeSchema, insertUserRecipeActionSchema } from "@shared/schema";
import { z } from "zod";

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

export async function registerRoutes(app: Express): Promise<Server> {
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

  // Capture recipe from URL (mock implementation)
  app.post("/api/capture-recipe", async (req, res) => {
    try {
      const { url, userId } = urlCaptureSchema.parse(req.body);
      
      // Mock AI processing - in real implementation, this would parse the URL
      const mockRecipe = {
        userId,
        title: "AI-Captured Recipe",
        description: "Recipe captured from social media",
        ingredients: ["Ingredient 1", "Ingredient 2", "Ingredient 3"],
        instructions: ["Step 1", "Step 2", "Step 3"],
        cookTime: 30,
        servings: 4,
        cuisine: "Unknown",
        difficulty: "Medium",
        category: "Dinner",
        dietaryTags: [],
        sourceUrl: url,
        sourcePlatform: url.includes("tiktok") ? "TikTok" : 
                      url.includes("instagram") ? "Instagram" :
                      url.includes("youtube") ? "YouTube" : "Pinterest",
        sourceUsername: "@unknown",
        imageUrl: "https://via.placeholder.com/400x300",
        nutritionData: null,
        carbonScore: null,
      };
      
      const recipe = await storage.createRecipe(mockRecipe);
      res.status(201).json(recipe);
    } catch (error) {
      res.status(400).json({ message: "Invalid URL or user ID" });
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
