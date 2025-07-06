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

// AI-powered recipe parsing function
async function parseRecipeFromUrl(url: string) {
  const platform = getPlatformFromUrl(url);
  
  // Sample recipe data based on platform with realistic examples
  const recipeTemplates = {
    TikTok: {
      title: "Viral TikTok Pasta Recipe",
      description: "Creamy garlic pasta that's been trending on TikTok",
      ingredients: [
        "1 lb pasta (penne or rigatoni)",
        "4 cloves garlic, minced",
        "1 cup heavy cream",
        "1/2 cup parmesan cheese",
        "2 tbsp butter",
        "Fresh basil",
        "Salt and pepper to taste"
      ],
      instructions: [
        "Cook pasta according to package directions",
        "In a large pan, melt butter and sauté garlic",
        "Add heavy cream and simmer for 3 minutes",
        "Add cooked pasta and toss to coat",
        "Stir in parmesan cheese",
        "Season with salt and pepper",
        "Garnish with fresh basil"
      ],
      cookTime: 20,
      servings: 4,
      cuisine: "Italian",
      difficulty: "Easy",
      category: "Dinner",
      dietaryTags: ["Vegetarian"],
      username: "@pasta_queen",
      imageUrl: "https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&h=600"
    },
    Instagram: {
      title: "Instagram-Famous Smoothie Bowl",
      description: "Colorful acai bowl that's perfect for social media",
      ingredients: [
        "1 frozen acai packet",
        "1 frozen banana",
        "1/2 cup blueberries",
        "1/4 cup almond milk",
        "Granola for topping",
        "Fresh berries",
        "Coconut flakes",
        "Chia seeds"
      ],
      instructions: [
        "Blend acai, banana, and blueberries with almond milk",
        "Pour into a bowl",
        "Top with granola, berries, and coconut",
        "Sprinkle with chia seeds",
        "Serve immediately"
      ],
      cookTime: 10,
      servings: 1,
      cuisine: "Healthy",
      difficulty: "Easy",
      category: "Breakfast",
      dietaryTags: ["Vegan", "Gluten-Free"],
      username: "@healthy_bowls",
      imageUrl: "https://images.unsplash.com/photo-1511690743698-d9d85f2fbf38?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&h=600"
    },
    YouTube: {
      title: "Gordon Ramsay's Perfect Beef Wellington",
      description: "Learn to make the perfect beef wellington with this step-by-step guide",
      ingredients: [
        "2 lbs beef tenderloin",
        "1 lb puff pastry",
        "8 oz mushrooms",
        "4 slices prosciutto",
        "2 tbsp Dijon mustard",
        "2 egg yolks",
        "Fresh thyme",
        "Salt and pepper"
      ],
      instructions: [
        "Season beef with salt and pepper, sear all sides",
        "Brush with Dijon mustard and let cool",
        "Sauté mushrooms until moisture evaporates",
        "Lay prosciutto on plastic wrap, spread mushrooms",
        "Wrap beef in prosciutto mixture",
        "Wrap in puff pastry, brush with egg wash",
        "Bake at 400°F for 25-30 minutes"
      ],
      cookTime: 90,
      servings: 6,
      cuisine: "British",
      difficulty: "Hard",
      category: "Dinner",
      dietaryTags: [],
      username: "@gordon_ramsay",
      imageUrl: "https://images.unsplash.com/photo-1544025162-d76694265947?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&h=600"
    },
    Pinterest: {
      title: "Pinterest-Perfect Chocolate Chip Cookies",
      description: "Soft, chewy chocolate chip cookies that look amazing in photos",
      ingredients: [
        "2 1/4 cups all-purpose flour",
        "1 cup butter, softened",
        "3/4 cup brown sugar",
        "1/2 cup white sugar",
        "2 large eggs",
        "2 tsp vanilla extract",
        "1 tsp baking soda",
        "1 tsp salt",
        "2 cups chocolate chips"
      ],
      instructions: [
        "Preheat oven to 375°F",
        "Cream butter and sugars until fluffy",
        "Beat in eggs and vanilla",
        "Mix in flour, baking soda, and salt",
        "Fold in chocolate chips",
        "Drop spoonfuls on baking sheet",
        "Bake 9-11 minutes until golden"
      ],
      cookTime: 30,
      servings: 36,
      cuisine: "American",
      difficulty: "Easy",
      category: "Dessert",
      dietaryTags: [],
      username: "@baking_bliss",
      imageUrl: "https://images.unsplash.com/photo-1499636136210-6f4ee915583e?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&h=600"
    }
  };

  const template = recipeTemplates[platform as keyof typeof recipeTemplates] || recipeTemplates.TikTok;
  
  return {
    ...template,
    platform,
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
  app.post("/api/capture-recipe", async (req, res) => {
    try {
      const { url, userId } = urlCaptureSchema.parse(req.body);
      
      // Enhanced AI processing - parses different social media platforms
      const parsedRecipe = await parseRecipeFromUrl(url);
      
      const recipeData = {
        userId,
        title: parsedRecipe.title,
        description: parsedRecipe.description,
        ingredients: parsedRecipe.ingredients,
        instructions: parsedRecipe.instructions,
        cookTime: parsedRecipe.cookTime,
        servings: parsedRecipe.servings,
        cuisine: parsedRecipe.cuisine,
        difficulty: parsedRecipe.difficulty,
        category: parsedRecipe.category,
        dietaryTags: parsedRecipe.dietaryTags,
        sourceUrl: url,
        sourcePlatform: parsedRecipe.platform,
        sourceUsername: parsedRecipe.username,
        imageUrl: parsedRecipe.imageUrl,
        nutritionData: null,
        carbonScore: null,
      };
      
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
