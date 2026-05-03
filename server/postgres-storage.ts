import {
  users, socialMediaContent, extractedRecipes, challenges, userChallenges, userRecipeActions,
  type User, type InsertUser, type UpsertUser,
  type SocialMediaContent, type InsertSocialMediaContent,
  type ExtractedRecipe, type InsertExtractedRecipe,
  type Challenge,
  type UserChallenge,
  type UserRecipeAction, type InsertUserRecipeAction,
} from "@shared/schema";
import { db } from "./db";
import { eq, and, desc } from "drizzle-orm";

export interface ExtractedRecipeFilters {
  cuisineType?: string;
  difficultyLevel?: string;
  mealType?: string;
  maxPrepTime?: number;
  maxCookTime?: number;
  dietaryTags?: string[];
}

export class PostgresStorage {
  // ─── Users ────────────────────────────────────────────────────────────
  async getUser(id: string): Promise<User | undefined> {
    const result = await db.select().from(users).where(eq(users.id, id)).limit(1);
    return result[0];
  }

  async upsertUser(user: UpsertUser): Promise<User> {
    // If a user with this email already exists, update its id (handles
    // login provider changes that mint a new external id for the same person).
    if (user.email) {
      const existingUser = await db.select().from(users).where(eq(users.email, user.email)).limit(1);
      if (existingUser.length > 0) {
        const result = await db.update(users)
          .set({
            id: user.id,
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

  // ─── Social media content ─────────────────────────────────────────────
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
        processedAt: processedAt || new Date(),
      })
      .where(eq(socialMediaContent.id, id))
      .returning();
    return result[0];
  }

  // ─── Extracted recipes ────────────────────────────────────────────────
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
    const whereConditions = [
      eq(socialMediaContent.userId, userId),
      eq(extractedRecipes.status, "published"),
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

    return await db.select()
      .from(extractedRecipes)
      .innerJoin(socialMediaContent, eq(extractedRecipes.socialMediaContentId, socialMediaContent.id))
      .where(and(...whereConditions))
      .orderBy(desc(socialMediaContent.createdAt))
      .then(rows => rows.map(r => r.extracted_recipes));
  }

  async getRandomExtractedRecipe(userId: string, filters?: ExtractedRecipeFilters): Promise<ExtractedRecipe | undefined> {
    const recipes = await this.getUserExtractedRecipes(userId, filters);
    if (recipes.length === 0) return undefined;
    return recipes[Math.floor(Math.random() * recipes.length)];
  }

  // ─── Challenges ───────────────────────────────────────────────────────
  async getChallenges(): Promise<Challenge[]> {
    return await db.select().from(challenges).where(eq(challenges.isActive, true));
  }

  async getActiveUserChallenges(userId: string): Promise<UserChallenge[]> {
    return await db.select()
      .from(userChallenges)
      .where(and(
        eq(userChallenges.userId, userId),
        eq(userChallenges.completed, false),
      ));
  }

  async updateUserChallengeProgress(userId: string, challengeId: number, progress: number): Promise<UserChallenge | undefined> {
    const result = await db.update(userChallenges)
      .set({ progress })
      .where(and(
        eq(userChallenges.userId, userId),
        eq(userChallenges.challengeId, challengeId),
      ))
      .returning();
    return result[0];
  }

  // ─── User actions ─────────────────────────────────────────────────────
  async recordUserAction(action: InsertUserRecipeAction): Promise<UserRecipeAction> {
    const result = await db.insert(userRecipeActions).values(action).returning();
    return result[0];
  }

  async getUserActions(userId: string, recipeId?: string): Promise<UserRecipeAction[]> {
    const whereConditions = [eq(userRecipeActions.userId, userId)];
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
