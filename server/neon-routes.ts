// Routes for accessing Neon database recipes
import { Request, Response } from 'express';
import { db } from './db';
import { extractedRecipes, socialMediaContent } from '../shared/schema';
import { eq, desc } from 'drizzle-orm';

/**
 * Get all extracted recipes for a user from Neon database
 */
export async function getUserExtractedRecipes(req: any, res: Response) {
  try {
    // For development, use default user or get from query params
    let userId = req.user?.claims?.sub || 'dev-user-123';
    console.log(`📋 Fetching extracted recipes for user: ${userId}`);
    
    // Query the extracted_recipes table with social media content
    const recipes = await db
      .select()
      .from(extractedRecipes)
      .leftJoin(socialMediaContent, eq(extractedRecipes.socialMediaContentId, socialMediaContent.id))
      .orderBy(desc(extractedRecipes.createdAt));
    
    console.log(`✅ Found ${recipes.length} extracted recipes for user ${userId}`);
    
    // Remove duplicates based on recipe title (more comprehensive than ID)
    const uniqueRecipes = recipes.filter((recipe, index, self) => 
      index === self.findIndex(r => r.extracted_recipes?.recipeTitle === recipe.extracted_recipes?.recipeTitle)
    );
    
    console.log(`🔍 Filtered ${recipes.length} total to ${uniqueRecipes.length} unique recipes`);
    
    // Transform the data for frontend compatibility
    const transformedRecipes = uniqueRecipes.map(item => {
      const recipe = item.extracted_recipes;
      const social = item.social_media_content;
      
      return {
        id: recipe.id,
        title: recipe.recipeTitle,
        description: recipe.description,
        ingredients: recipe.ingredients || [],
        instructions: recipe.instructions || [],
        prepTime: recipe.prepTime || 0,
        cookTime: recipe.cookTime || 0,
        totalTime: recipe.totalTime || recipe.prepTime + recipe.cookTime,
        servings: recipe.servings || 1,
        difficulty: recipe.difficultyLevel || 'medium',
        cuisine: recipe.cuisineType || 'International',
        category: recipe.mealType || 'Main Course',
        dietaryTags: recipe.dietaryTags || [],
        platform: social?.platform || 'unknown',
        originalUrl: social?.originalUrl,
        username: social?.title || 'Unknown Chef',
        confidence: recipe.aiConfidenceScore,
        createdAt: recipe.createdAt,
        imageUrl: getDefaultImageForPlatform(social?.platform || 'tiktok'),
        rating: 0 // Default rating
      };
    });
    
    res.json(transformedRecipes);
    
  } catch (error) {
    console.error('❌ Error fetching extracted recipes:', error);
    res.status(500).json({ 
      message: 'Failed to fetch recipes',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}

/**
 * Get a single extracted recipe by ID
 */
export async function getExtractedRecipeDetails(req: any, res: Response) {
  try {
    const recipeId = req.params.id;
    const userId = req.user.claims.sub;
    
    console.log(`🔍 Fetching recipe details for ID: ${recipeId}`);
    
    const recipe = await db
      .select({
        id: extractedRecipes.id,
        title: extractedRecipes.recipeTitle,
        description: extractedRecipes.description,
        ingredients: extractedRecipes.ingredients,
        instructions: extractedRecipes.instructions,
        prepTime: extractedRecipes.prepTime,
        cookTime: extractedRecipes.cookTime,
        totalTime: extractedRecipes.totalTime,
        servings: extractedRecipes.servings,
        difficulty: extractedRecipes.difficultyLevel,
        cuisine: extractedRecipes.cuisineType,
        mealType: extractedRecipes.mealType,
        dietaryTags: extractedRecipes.dietaryTags,
        chef: extractedRecipes.chefAttribution,
        confidence: extractedRecipes.aiConfidenceScore,
        status: extractedRecipes.status,
        createdAt: extractedRecipes.createdAt,
        
        // Social media content details
        platform: socialMediaContent.platform,
        originalUrl: socialMediaContent.originalUrl,
        contentTitle: socialMediaContent.title,
        author: socialMediaContent.author,
        authorUsername: socialMediaContent.authorUsername,
        duration: socialMediaContent.duration,
        views: socialMediaContent.views,
        likes: socialMediaContent.likes
      })
      .from(extractedRecipes)
      .leftJoin(socialMediaContent, eq(extractedRecipes.socialMediaContentId, socialMediaContent.id))
      .where(eq(extractedRecipes.id, recipeId))
      .limit(1);
    
    if (recipe.length === 0) {
      return res.status(404).json({ message: 'Recipe not found' });
    }
    
    const recipeData = recipe[0];
    
    // Transform for frontend
    const transformedRecipe = {
      id: recipeData.id,
      title: recipeData.title,
      description: recipeData.description,
      ingredients: recipeData.ingredients || [],
      instructions: recipeData.instructions || [],
      prepTime: recipeData.prepTime || 0,
      cookTime: recipeData.cookTime || 0,
      totalTime: recipeData.totalTime || (recipeData.prepTime || 0) + (recipeData.cookTime || 0),
      servings: recipeData.servings || 1,
      difficulty: recipeData.difficulty || 'medium',
      cuisine: recipeData.cuisine || 'International',
      category: recipeData.mealType || 'Main Course',
      dietaryTags: recipeData.dietaryTags || [],
      platform: recipeData.platform || 'unknown',
      originalUrl: recipeData.originalUrl,
      username: recipeData.authorUsername || recipeData.author || 'Unknown Chef',
      imageUrl: getDefaultImageForPlatform(recipeData.platform || 'tiktok'),
      rating: 0,
      confidence: recipeData.confidence,
      createdAt: recipeData.createdAt,
      
      // Additional metadata
      socialMedia: {
        platform: recipeData.platform,
        author: recipeData.author,
        authorUsername: recipeData.authorUsername,
        duration: recipeData.duration,
        views: recipeData.views,
        likes: recipeData.likes,
        originalUrl: recipeData.originalUrl
      }
    };
    
    console.log(`✅ Recipe found: ${recipeData.title}`);
    res.json(transformedRecipe);
    
  } catch (error) {
    console.error('❌ Error fetching recipe details:', error);
    res.status(500).json({ 
      message: 'Failed to fetch recipe details',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}

/**
 * Get a random recipe for the roulette feature
 */
export async function getRandomExtractedRecipe(req: any, res: Response) {
  try {
    const userId = req.user.claims.sub;
    
    console.log(`🎲 Getting random recipe for user: ${userId}`);
    
    // Get all published recipes and pick one randomly
    const recipes = await db
      .select({
        id: extractedRecipes.id,
        title: extractedRecipes.recipeTitle,
        description: extractedRecipes.description,
        difficulty: extractedRecipes.difficultyLevel,
        cuisine: extractedRecipes.cuisineType,
        prepTime: extractedRecipes.prepTime,
        cookTime: extractedRecipes.cookTime,
        platform: socialMediaContent.platform,
        author: socialMediaContent.author
      })
      .from(extractedRecipes)
      .leftJoin(socialMediaContent, eq(extractedRecipes.socialMediaContentId, socialMediaContent.id))
      .where(eq(extractedRecipes.status, 'published'))
      .limit(50); // Get a reasonable sample
    
    if (recipes.length === 0) {
      return res.status(404).json({ message: 'No recipes available for roulette' });
    }
    
    // Pick a random recipe
    const randomIndex = Math.floor(Math.random() * recipes.length);
    const randomRecipe = recipes[randomIndex];
    
    console.log(`🎯 Selected random recipe: ${randomRecipe.title}`);
    
    res.json({
      id: randomRecipe.id,
      title: randomRecipe.title,
      description: randomRecipe.description,
      difficulty: randomRecipe.difficulty || 'medium',
      cuisine: randomRecipe.cuisine || 'International',
      prepTime: randomRecipe.prepTime || 0,
      cookTime: randomRecipe.cookTime || 0,
      platform: randomRecipe.platform || 'unknown',
      username: randomRecipe.author || 'Unknown Chef',
      imageUrl: getDefaultImageForPlatform(randomRecipe.platform || 'tiktok')
    });
    
  } catch (error) {
    console.error('❌ Error getting random recipe:', error);
    res.status(500).json({ 
      message: 'Failed to get random recipe',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}

/**
 * Helper function to get default images for platforms
 */
function getDefaultImageForPlatform(platform: string): string {
  const images = {
    tiktok: "https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600",
    instagram: "https://images.unsplash.com/photo-1511690743698-d9d85f2fbf38?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600",
    youtube: "https://images.unsplash.com/photo-1544025162-d76694265947?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600",
    pinterest: "https://images.unsplash.com/photo-1499636136210-6f4ee915583e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600",
    facebook: "https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600",
    twitter: "https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600"
  };
  
  return images[platform.toLowerCase() as keyof typeof images] || images.tiktok;
}

/**
 * Get a single recipe by ID from Neon database (for webhook processing)
 */
export async function getRecipeById(recipeId: string) {
  try {
    console.log(`🔍 Fetching recipe by ID: ${recipeId}`);
    
    const result = await db
      .select()
      .from(extractedRecipes)
      .leftJoin(socialMediaContent, eq(extractedRecipes.socialMediaContentId, socialMediaContent.id))
      .where(eq(extractedRecipes.id, recipeId))
      .limit(1);
    
    if (result.length === 0) {
      console.log(`❌ Recipe not found: ${recipeId}`);
      return null;
    }
    
    const item = result[0];
    const recipe = item.extracted_recipes;
    const social = item.social_media_content;
    
    console.log(`✅ Found recipe: ${recipe.recipeTitle}`);
    
    return {
      id: recipe.id,
      title: recipe.recipeTitle,
      description: recipe.description,
      ingredients: recipe.ingredients || [],
      instructions: recipe.instructions || [],
      prepTime: recipe.prepTime || 0,
      cookTime: recipe.cookTime || 0,
      totalTime: recipe.totalTime || recipe.prepTime + recipe.cookTime,
      servings: recipe.servings || 1,
      difficulty: recipe.difficultyLevel || 'medium',
      cuisine: recipe.cuisineType || 'International',
      category: recipe.mealType || 'Main Course',
      dietaryTags: recipe.dietaryTags || [],
      platform: social?.platform || 'unknown',
      originalUrl: social?.originalUrl,
      username: social?.title || 'Unknown Chef',
      confidence: recipe.aiConfidenceScore,
      createdAt: recipe.createdAt,
      imageUrl: getDefaultImageForPlatform(social?.platform || 'tiktok'),
      rating: 0
    };
  } catch (error) {
    console.error('Error fetching recipe by ID:', error);
    throw error;
  }
}