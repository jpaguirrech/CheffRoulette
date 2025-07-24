import { Request, Response } from 'express';
import { z } from 'zod';
import { externalAPIService } from './external-api-service';
import { storage } from './postgres-storage';
import { insertSocialMediaContentSchema, insertExtractedRecipeSchema } from '@shared/schema';

// Extend Express Request interface for authentication
declare global {
  namespace Express {
    interface Request {
      user?: {
        claims: {
          sub: string;
        };
      };
    }
  }
}

// Request schemas
const captureRecipeRequestSchema = z.object({
  url: z.string().url(),
  recipeName: z.string().optional(),
});

const getRecipesQuerySchema = z.object({
  cuisineType: z.string().optional(),
  difficultyLevel: z.enum(['easy', 'medium', 'hard']).optional(),
  mealType: z.enum(['breakfast', 'lunch', 'dinner', 'snack', 'dessert']).optional(),
  maxPrepTime: z.coerce.number().optional(),
  maxCookTime: z.coerce.number().optional(),
});

// Enhanced recipe capture using external API
export async function captureRecipeFromURL(req: Request, res: Response) {
  try {
    // Validate request body
    const { url, recipeName } = captureRecipeRequestSchema.parse(req.body);
    
    // Check if user is authenticated
    if (!req.user?.claims?.sub) {
      return res.status(401).json({ error: 'Authentication required' });
    }
    
    const userId = req.user.claims.sub;
    
    // Validate platform support
    if (!externalAPIService.isPlatformSupported(url)) {
      return res.status(400).json({ 
        error: externalAPIService.getErrorMessage('Unsupported platform')
      });
    }
    
    // Create social media content record
    const platform = externalAPIService.extractPlatformFromUrl(url);
    const contentData = {
      userId,
      originalUrl: url,
      platform,
      contentType: 'video', // Default for now, could be detected
      title: recipeName || null,
      status: 'pending'
    };
    
    const socialMediaContent = await storage.createSocialMediaContent(contentData);
    
    // Call external API to process the recipe
    const apiRequest = {
      content_url: url,
      user_id: userId,
      recipe_name: recipeName
    };
    
    const apiResponse = await externalAPIService.processRecipe(apiRequest);
    
    if (!apiResponse.success || !apiResponse.data) {
      // Update status to error
      await storage.updateSocialMediaContentStatus(socialMediaContent.id, 'error');
      
      return res.status(400).json({
        error: externalAPIService.getErrorMessage(apiResponse.error || 'Processing failed')
      });
    }
    
    // Update social media content status
    await storage.updateSocialMediaContentStatus(
      socialMediaContent.id,
      'completed',
      new Date(apiResponse.data.processed_at)
    );
    
    // Create extracted recipe record
    const extractedRecipeData = {
      socialMediaContentId: socialMediaContent.id,
      recipeTitle: apiResponse.data.recipe_title,
      description: apiResponse.data.description,
      ingredients: [], // Will be populated from detailed API call or set as empty for now
      instructions: [], // Will be populated from detailed API call or set as empty for now
      prepTime: apiResponse.data.prep_time,
      cookTime: apiResponse.data.cook_time,
      totalTime: apiResponse.data.total_time,
      servings: apiResponse.data.servings,
      difficultyLevel: apiResponse.data.difficulty_level,
      cuisineType: apiResponse.data.cuisine_type,
      mealType: apiResponse.data.meal_type,
      dietaryTags: [], // Will be populated from detailed API call
      chefAttribution: null,
      aiConfidenceScore: apiResponse.data.ai_confidence_score.toString(),
      status: 'published'
    };
    
    const extractedRecipe = await storage.createExtractedRecipe(extractedRecipeData);
    
    // Return the combined response
    res.json({
      success: true,
      message: 'Recipe captured successfully',
      data: {
        contentId: socialMediaContent.id,
        recipeId: extractedRecipe.id,
        title: extractedRecipe.recipeTitle,
        description: extractedRecipe.description,
        platform: socialMediaContent.platform,
        prepTime: extractedRecipe.prepTime,
        cookTime: extractedRecipe.cookTime,
        servings: extractedRecipe.servings,
        difficulty: extractedRecipe.difficultyLevel,
        cuisine: extractedRecipe.cuisineType,
        mealType: extractedRecipe.mealType,
        confidence: parseFloat(extractedRecipe.aiConfidenceScore || '0'),
        originalUrl: socialMediaContent.originalUrl
      }
    });
    
  } catch (error) {
    console.error('Recipe capture error:', error);
    
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: 'Invalid request data', details: error.errors });
    }
    
    res.status(500).json({ error: 'Internal server error' });
  }
}

// Get user's extracted recipes
export async function getUserRecipes(req: Request, res: Response) {
  try {
    if (!req.user?.claims?.sub) {
      return res.status(401).json({ error: 'Authentication required' });
    }
    
    // Parse query parameters for filtering
    const filters = getRecipesQuerySchema.parse(req.query);
    
    const recipes = await storage.getUserExtractedRecipes(req.user.claims.sub, filters);
    
    // Transform the data for frontend consumption
    const transformedRecipes = recipes.map(recipe => ({
      id: recipe.id,
      title: recipe.recipeTitle,
      description: recipe.description,
      prepTime: recipe.prepTime,
      cookTime: recipe.cookTime,
      totalTime: recipe.totalTime,
      servings: recipe.servings,
      difficulty: recipe.difficultyLevel,
      cuisine: recipe.cuisineType,
      mealType: recipe.mealType,
      confidence: parseFloat(recipe.aiConfidenceScore || '0'),
      createdAt: recipe.createdAt,
      // Note: ingredients and instructions would need to be parsed from JSON
      ingredients: recipe.ingredients || [],
      instructions: recipe.instructions || [],
      dietaryTags: recipe.dietaryTags || []
    }));
    
    res.json({
      success: true,
      data: transformedRecipes,
      count: transformedRecipes.length
    });
    
  } catch (error) {
    console.error('Get recipes error:', error);
    
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: 'Invalid query parameters', details: error.errors });
    }
    
    res.status(500).json({ error: 'Internal server error' });
  }
}

// Get single recipe details
export async function getRecipeDetails(req: Request, res: Response) {
  try {
    const { id } = req.params;
    
    if (!req.user?.claims?.sub) {
      return res.status(401).json({ error: 'Authentication required' });
    }
    
    const recipe = await storage.getExtractedRecipe(id);
    
    if (!recipe) {
      return res.status(404).json({ error: 'Recipe not found' });
    }
    
    // Get the associated social media content to verify ownership
    const content = await storage.getSocialMediaContent(recipe.socialMediaContentId);
    
    if (!content || content.userId !== req.user.claims.sub) {
      return res.status(403).json({ error: 'Access denied' });
    }
    
    // Transform the data
    const transformedRecipe = {
      id: recipe.id,
      title: recipe.recipeTitle,
      description: recipe.description,
      ingredients: recipe.ingredients || [],
      instructions: recipe.instructions || [],
      prepTime: recipe.prepTime,
      cookTime: recipe.cookTime,
      totalTime: recipe.totalTime,
      servings: recipe.servings,
      difficulty: recipe.difficultyLevel,
      cuisine: recipe.cuisineType,
      mealType: recipe.mealType,
      dietaryTags: recipe.dietaryTags || [],
      confidence: parseFloat(recipe.aiConfidenceScore || '0'),
      createdAt: recipe.createdAt,
      originalUrl: content.originalUrl,
      platform: content.platform
    };
    
    res.json({
      success: true,
      data: transformedRecipe
    });
    
  } catch (error) {
    console.error('Get recipe details error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

// Recipe roulette - get random recipe
export async function getRandomRecipe(req: Request, res: Response) {
  try {
    if (!req.user?.claims?.sub) {
      return res.status(401).json({ error: 'Authentication required' });
    }
    
    // Parse query parameters for filtering
    const filters = getRecipesQuerySchema.parse(req.query);
    
    const recipe = await storage.getRandomExtractedRecipe(req.user.claims.sub, filters);
    
    if (!recipe) {
      return res.status(404).json({ 
        error: 'No recipes found matching your criteria' 
      });
    }
    
    // Transform the data
    const transformedRecipe = {
      id: recipe.id,
      title: recipe.recipeTitle,
      description: recipe.description,
      prepTime: recipe.prepTime,
      cookTime: recipe.cookTime,
      totalTime: recipe.totalTime,
      servings: recipe.servings,
      difficulty: recipe.difficultyLevel,
      cuisine: recipe.cuisineType,
      mealType: recipe.mealType,
      confidence: parseFloat(recipe.aiConfidenceScore || '0'),
      createdAt: recipe.createdAt
    };
    
    res.json({
      success: true,
      data: transformedRecipe
    });
    
  } catch (error) {
    console.error('Random recipe error:', error);
    
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: 'Invalid query parameters', details: error.errors });
    }
    
    res.status(500).json({ error: 'Internal server error' });
  }
}