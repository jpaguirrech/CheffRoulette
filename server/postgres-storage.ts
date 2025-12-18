import { 
  users, socialMediaContent, extractedRecipes, recipes, challenges, userChallenges, userRecipeActions,
  type User, type InsertUser, type UpsertUser,
  type SocialMediaContent, type InsertSocialMediaContent,
  type ExtractedRecipe, type InsertExtractedRecipe,
  type Recipe, type InsertRecipe, 
  type Challenge, type InsertChallenge, type UserChallenge, type InsertUserChallenge,
  type UserRecipeAction, type InsertUserRecipeAction
} from "@shared/schema";
import { db } from "./db";
import { eq, and, desc, sql } from "drizzle-orm";
import type { IStorage, RecipeFilters, ExtractedRecipeFilters } from "./storage";

export class PostgresStorage implements IStorage {
  
  // User operations
  async getUser(id: string): Promise<User | undefined> {
    const result = await db.select().from(users).where(eq(users.id, id)).limit(1);
    return result[0];
  }

  async upsertUser(user: UpsertUser): Promise<User> {
    // First, check if a user with this email already exists
    if (user.email) {
      const existingUser = await db.select().from(users).where(eq(users.email, user.email)).limit(1);
      if (existingUser.length > 0) {
        // Update the existing user with the new ID (from Google OAuth) and other details
        const result = await db.update(users)
          .set({
            id: user.id, // Update to new Google OAuth ID
            firstName: user.firstName,
            lastName: user.lastName,
            profileImageUrl: user.profileImageUrl,
            username: user.username,
            updatedAt: new Date(),
          })
          .where(eq(users.email, user.email))
          .returning();
        return result[0];
      }
    }
    
    // If no existing user by email, try upsert by ID
    const result = await db.insert(users)
      .values(user)
      .onConflictDoUpdate({
        target: users.id,
        set: {
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          profileImageUrl: user.profileImageUrl,
          username: user.username,
          updatedAt: new Date(),
        }
      })
      .returning();
    return result[0];
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const result = await db.select().from(users).where(eq(users.username, username)).limit(1);
    return result[0];
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    const result = await db.select().from(users).where(eq(users.email, email)).limit(1);
    return result[0];
  }

  async createUser(user: InsertUser): Promise<User> {
    const result = await db.insert(users).values(user).returning();
    return result[0];
  }

  async updateUser(id: string, updates: Partial<User>): Promise<User | undefined> {
    const result = await db.update(users)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(users.id, id))
      .returning();
    return result[0];
  }

  // Social Media Content operations
  async createSocialMediaContent(content: InsertSocialMediaContent): Promise<SocialMediaContent> {
    const result = await db.insert(socialMediaContent).values(content).returning();
    return result[0];
  }

  async getSocialMediaContent(id: string): Promise<SocialMediaContent | undefined> {
    const result = await db.select().from(socialMediaContent).where(eq(socialMediaContent.id, id)).limit(1);
    return result[0];
  }

  async getUserSocialMediaContent(userId: string): Promise<SocialMediaContent[]> {
    return await db.select()
      .from(socialMediaContent)
      .where(eq(socialMediaContent.userId, userId))
      .orderBy(desc(socialMediaContent.createdAt));
  }

  async updateSocialMediaContentStatus(id: string, status: string, processedAt?: Date): Promise<SocialMediaContent | undefined> {
    const result = await db.update(socialMediaContent)
      .set({ 
        status, 
        processedAt: processedAt || new Date() 
      })
      .where(eq(socialMediaContent.id, id))
      .returning();
    return result[0];
  }

  // Extracted Recipe operations
  async createExtractedRecipe(recipe: InsertExtractedRecipe): Promise<ExtractedRecipe> {
    const result = await db.insert(extractedRecipes).values(recipe).returning();
    return result[0];
  }

  async getExtractedRecipe(id: string): Promise<ExtractedRecipe | undefined> {
    const result = await db.select().from(extractedRecipes).where(eq(extractedRecipes.id, id)).limit(1);
    return result[0];
  }

  async getExtractedRecipeByContentId(contentId: string): Promise<ExtractedRecipe | undefined> {
    const result = await db.select()
      .from(extractedRecipes)
      .where(eq(extractedRecipes.socialMediaContentId, contentId))
      .limit(1);
    return result[0];
  }

  async updateExtractedRecipe(id: string, updates: Partial<ExtractedRecipe>): Promise<ExtractedRecipe | undefined> {
    const result = await db.update(extractedRecipes)
      .set(updates)
      .where(eq(extractedRecipes.id, id))
      .returning();
    return result[0];
  }

  async getUserExtractedRecipes(userId: string, filters?: ExtractedRecipeFilters): Promise<ExtractedRecipe[]> {
    let query = db.select({
      id: extractedRecipes.id,
      socialMediaContentId: extractedRecipes.socialMediaContentId,
      recipeTitle: extractedRecipes.recipeTitle,
      description: extractedRecipes.description,
      ingredients: extractedRecipes.ingredients,
      instructions: extractedRecipes.instructions,
      prepTime: extractedRecipes.prepTime,
      cookTime: extractedRecipes.cookTime,
      totalTime: extractedRecipes.totalTime,
      servings: extractedRecipes.servings,
      difficultyLevel: extractedRecipes.difficultyLevel,
      cuisineType: extractedRecipes.cuisineType,
      mealType: extractedRecipes.mealType,
      dietaryTags: extractedRecipes.dietaryTags,
      chefAttribution: extractedRecipes.chefAttribution,
      aiConfidenceScore: extractedRecipes.aiConfidenceScore,
      status: extractedRecipes.status,
      createdAt: extractedRecipes.createdAt,
    })
    .from(extractedRecipes)
    .innerJoin(socialMediaContent, eq(extractedRecipes.socialMediaContentId, socialMediaContent.id));

    let whereConditions = [
      eq(socialMediaContent.userId, userId),
      eq(extractedRecipes.status, "published")
    ];

    if (filters?.cuisineType) {
      whereConditions.push(eq(extractedRecipes.cuisineType, filters.cuisineType));
    }
    if (filters?.difficultyLevel) {
      whereConditions.push(eq(extractedRecipes.difficultyLevel, filters.difficultyLevel));
    }
    if (filters?.mealType) {
      whereConditions.push(eq(extractedRecipes.mealType, filters.mealType));
    }

    query = query.where(and(...whereConditions));
    
    
    return await query.orderBy(desc(socialMediaContent.createdAt));
  }

  async getRandomExtractedRecipe(userId: string, filters?: ExtractedRecipeFilters): Promise<ExtractedRecipe | undefined> {
    const recipes = await this.getUserExtractedRecipes(userId, filters);
    if (recipes.length === 0) return undefined;
    
    const randomIndex = Math.floor(Math.random() * recipes.length);
    return recipes[randomIndex];
  }

  // Legacy Recipe operations (keeping for backwards compatibility)
  async getRecipe(id: number): Promise<Recipe | undefined> {
    const result = await db.select().from(recipes).where(eq(recipes.id, id)).limit(1);
    return result[0];
  }

  async getRecipes(userId?: string, filters?: RecipeFilters): Promise<Recipe[]> {
    let whereConditions = [];
    
    if (userId) {
      whereConditions.push(eq(recipes.userId, userId));
    }
    
    // Apply filters if provided
    if (filters?.cuisine) {
      whereConditions.push(eq(recipes.cuisine, filters.cuisine));
    }
    if (filters?.difficulty) {
      whereConditions.push(eq(recipes.difficulty, filters.difficulty));
    }
    if (filters?.category) {
      whereConditions.push(eq(recipes.category, filters.category));
    }
    
    const query = db.select().from(recipes);
    
    if (whereConditions.length > 0) {
      return await query.where(and(...whereConditions));
    }
    
    return await query;
  }

  async createRecipe(recipe: InsertRecipe): Promise<Recipe> {
    const result = await db.insert(recipes).values(recipe).returning();
    return result[0];
  }

  async updateRecipe(id: number, updates: Partial<Recipe>): Promise<Recipe | undefined> {
    const result = await db.update(recipes)
      .set(updates)
      .where(eq(recipes.id, id))
      .returning();
    return result[0];
  }

  async deleteRecipe(id: number): Promise<boolean> {
    const result = await db.delete(recipes).where(eq(recipes.id, id));
    return (result.rowCount || 0) > 0;
  }

  async getRandomRecipe(filters?: RecipeFilters): Promise<Recipe | undefined> {
    const allRecipes = await this.getRecipes(undefined, filters);
    if (allRecipes.length === 0) return undefined;
    
    const randomIndex = Math.floor(Math.random() * allRecipes.length);
    return allRecipes[randomIndex];
  }

  // Challenge operations
  async getChallenges(): Promise<Challenge[]> {
    return await db.select().from(challenges).where(eq(challenges.isActive, true));
  }

  async getActiveUserChallenges(userId: string): Promise<UserChallenge[]> {
    return await db.select()
      .from(userChallenges)
      .where(and(
        eq(userChallenges.userId, userId),
        eq(userChallenges.completed, false)
      ));
  }

  async updateUserChallengeProgress(userId: string, challengeId: number, progress: number): Promise<UserChallenge | undefined> {
    const result = await db.update(userChallenges)
      .set({ progress })
      .where(and(
        eq(userChallenges.userId, userId),
        eq(userChallenges.challengeId, challengeId)
      ))
      .returning();
    return result[0];
  }

  // User actions
  async recordUserAction(action: InsertUserRecipeAction): Promise<UserRecipeAction> {
    const result = await db.insert(userRecipeActions).values(action).returning();
    return result[0];
  }

  async getUserActions(userId: string, recipeId?: number): Promise<UserRecipeAction[]> {
    let whereConditions = [eq(userRecipeActions.userId, userId)];
    
    if (recipeId) {
      whereConditions.push(eq(userRecipeActions.recipeId, recipeId));
    }
    
    return await db.select()
      .from(userRecipeActions)
      .where(and(...whereConditions))
      .orderBy(desc(userRecipeActions.createdAt));
  }
}

export const storage = new PostgresStorage();