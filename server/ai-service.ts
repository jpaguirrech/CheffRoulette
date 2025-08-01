import { GoogleGenAI } from "@google/genai";
import type { InsertRecipe } from "@shared/schema";

const ai = new GoogleGenAI(process.env.GOOGLE_API_KEY || "");
console.log("Google AI service initialized with key:", process.env.GOOGLE_API_KEY ? "✓" : "✗");

export interface RecipeAnalysis {
  title: string;
  description: string;
  ingredients: string[];
  instructions: string[];
  cookTime: number;
  servings: number;
  difficulty: "Easy" | "Medium" | "Hard";
  cuisine: string;
  category: string;
  dietaryTags: string[];
  platform: string;
  originalUrl: string;
}

export async function analyzeRecipeFromText(text: string, url: string): Promise<RecipeAnalysis> {
  try {
    const platform = getPlatformFromUrl(url);
    
    const systemPrompt = `You are a recipe extraction expert. Analyze the following social media content and extract recipe information.
    
    Extract a complete recipe with the following structure:
    - Title: Clear, descriptive recipe name
    - Description: Brief appetizing description
    - Ingredients: List of ingredients with quantities
    - Instructions: Step-by-step cooking instructions
    - Cook Time: Estimated cooking time in minutes
    - Servings: Number of servings
    - Difficulty: Easy, Medium, or Hard
    - Cuisine: Type of cuisine (e.g., Italian, Mexican, Asian)
    - Category: Main course, appetizer, dessert, etc.
    - Dietary Tags: Array of dietary restrictions/preferences (vegetarian, vegan, gluten-free, etc.)
    
    If the content doesn't contain a complete recipe, create a reasonable recipe based on what's shown.
    
    Respond with JSON in this exact format:
    {
      "title": "Recipe Name",
      "description": "Brief description",
      "ingredients": ["ingredient 1", "ingredient 2"],
      "instructions": ["step 1", "step 2"],
      "cookTime": 30,
      "servings": 4,
      "difficulty": "Easy",
      "cuisine": "Italian",
      "category": "Main Course",
      "dietaryTags": ["vegetarian"]
    }`;

    const response = await ai.models.generateContent({
      model: "gemini-1.5-flash",
      contents: [{ text: `${systemPrompt}\n\nPlatform: ${platform}\n\nContent: ${text}` }]
    });

    const rawJson = response.text;
    if (!rawJson) {
      throw new Error("Empty response from AI model");
    }

    const data = JSON.parse(rawJson);
    
    return {
      ...data,
      platform,
      originalUrl: url
    };
  } catch (error) {
    console.error("Error analyzing recipe:", error);
    throw new Error(`Failed to analyze recipe: ${error}`);
  }
}

export async function analyzeRecipeFromVideo(videoUrl: string, url: string): Promise<RecipeAnalysis> {
  try {
    const platform = getPlatformFromUrl(url);
    
    const systemPrompt = `You are a recipe extraction expert. Analyze this cooking video and extract the complete recipe information.
    
    Watch the video carefully and extract:
    - Recipe title based on what's being cooked
    - Brief appetizing description
    - Complete list of ingredients with quantities (observe what's used in the video)
    - Step-by-step cooking instructions (follow the video sequence)
    - Estimated cooking time
    - Number of servings
    - Difficulty level (Easy, Medium, Hard)
    - Cuisine type
    - Category (Main Course, Appetizer, Dessert, etc.)
    - Any dietary tags you can identify
    
    Respond with JSON in this exact format:
    {
      "title": "Recipe Name",
      "description": "Brief description",
      "ingredients": ["ingredient 1 with quantity", "ingredient 2 with quantity"],
      "instructions": ["step 1", "step 2"],
      "cookTime": 30,
      "servings": 4,
      "difficulty": "Easy",
      "cuisine": "Italian",
      "category": "Main Course",
      "dietaryTags": ["vegetarian"]
    }`;

    // For YouTube videos, we can pass the URL directly
    if (platform === 'YouTube') {
      const response = await ai.models.generateContent({
        model: "gemini-1.5-flash",
        contents: [
          {
            fileData: {
              mimeType: "video/mp4",
              fileUri: videoUrl
            }
          },
          { text: systemPrompt }
        ]
      });
      
      const rawJson = response.text;
      if (!rawJson) {
        throw new Error("Empty response from AI model");
      }

      const data = JSON.parse(rawJson);
      
      return {
        ...data,
        platform,
        originalUrl: url
      };
    } else {
      // For other platforms, we'll use enhanced text analysis for now
      // In a production system, you'd implement video download and upload
      throw new Error(`Direct video analysis not yet implemented for ${platform}`);
    }
  } catch (error) {
    console.error("Error analyzing recipe from video:", error);
    throw new Error(`Failed to analyze recipe from video: ${error}`);
  }
}

export async function analyzeRecipeFromImage(imageUrl: string, url: string): Promise<RecipeAnalysis> {
  try {
    const platform = getPlatformFromUrl(url);
    
    // For image analysis, we'll use a text-based approach since we can't directly fetch images
    // In a real implementation, you'd fetch the image and analyze it
    const systemPrompt = `You are a recipe extraction expert. Based on the provided image URL from ${platform}, create a plausible recipe.
    
    Create a complete recipe with realistic details for a dish that would commonly be shared on ${platform}.
    
    Respond with JSON in this exact format:
    {
      "title": "Recipe Name",
      "description": "Brief description",
      "ingredients": ["ingredient 1", "ingredient 2"],
      "instructions": ["step 1", "step 2"],
      "cookTime": 30,
      "servings": 4,
      "difficulty": "Easy",
      "cuisine": "Italian",
      "category": "Main Course",
      "dietaryTags": ["vegetarian"]
    }`;

    const response = await ai.models.generateContent({
      model: "gemini-1.5-flash",
      contents: [{ text: `${systemPrompt}\n\nAnalyze this ${platform} image and create a recipe: ${imageUrl}` }]
    });

    const rawJson = response.text;
    if (!rawJson) {
      throw new Error("Empty response from AI model");
    }

    const data = JSON.parse(rawJson);
    
    return {
      ...data,
      platform,
      originalUrl: url
    };
  } catch (error) {
    console.error("Error analyzing recipe from image:", error);
    throw new Error(`Failed to analyze recipe from image: ${error}`);
  }
}

export function getPlatformFromUrl(url: string): string {
  if (url.includes('tiktok.com')) return 'TikTok';
  if (url.includes('instagram.com')) return 'Instagram';
  if (url.includes('youtube.com') || url.includes('youtu.be')) return 'YouTube';
  if (url.includes('pinterest.com')) return 'Pinterest';
  return 'Other';
}

export function getPlatformTemplate(platform: string): string {
  const templates = {
    TikTok: `Quick and trendy recipe perfect for social media. Usually features:
    - Short cooking time (under 30 minutes)
    - Visually appealing presentation
    - Simple ingredients and steps
    - Popular flavors and trending ingredients`,
    
    Instagram: `Instagram-worthy recipe with beautiful presentation. Typically includes:
    - Photogenic ingredients and plating
    - Health-conscious options
    - Seasonal and fresh ingredients
    - Step-by-step visual guide`,
    
    YouTube: `Detailed recipe with comprehensive instructions. Features:
    - Complete ingredient list with measurements
    - Detailed step-by-step instructions
    - Tips and variations
    - Longer cooking processes explained`,
    
    Pinterest: `Pin-worthy recipe with clear instructions. Usually contains:
    - Recipe card format
    - Ingredient substitutions
    - Make-ahead tips
    - Serving suggestions`
  };
  
  return templates[platform] || templates.TikTok;
}

export function convertAnalysisToInsertRecipe(analysis: RecipeAnalysis, userId: string): InsertRecipe {
  return {
    userId,
    title: analysis.title,
    description: analysis.description,
    ingredients: analysis.ingredients,
    instructions: analysis.instructions,
    cookTime: analysis.cookTime,
    servings: analysis.servings,
    difficulty: analysis.difficulty,
    cuisine: analysis.cuisine,
    category: analysis.category,
    dietaryTags: analysis.dietaryTags,
    platform: analysis.platform,
    originalUrl: analysis.originalUrl,
    rating: 0
  };
}