import { pgTable, text, serial, integer, boolean, timestamp, jsonb, varchar, index } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Session storage table.
// (IMPORTANT) This table is mandatory for Replit Auth, don't drop it.
export const sessions = pgTable(
  "sessions",
  {
    sid: varchar("sid").primaryKey(),
    sess: jsonb("sess").notNull(),
    expire: timestamp("expire").notNull(),
  },
  (table) => [index("IDX_session_expire").on(table.expire)],
);

// User storage table.
// (IMPORTANT) This table is mandatory for Replit Auth, don't drop it.
export const users = pgTable("users", {
  id: varchar("id").primaryKey().notNull(),
  email: varchar("email").unique(),
  firstName: varchar("first_name"),
  lastName: varchar("last_name"),
  profileImageUrl: varchar("profile_image_url"),
  // Additional Chef Roulette fields
  username: varchar("username", { length: 50 }).unique(),
  points: integer("points").default(0),
  streak: integer("streak").default(0),
  recipesCooked: integer("recipes_cooked").default(0),
  weeklyPoints: integer("weekly_points").default(0),
  isPro: boolean("is_pro").default(false),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const recipes = pgTable("recipes", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id").notNull(),
  title: text("title").notNull(),
  description: text("description"),
  ingredients: text("ingredients").array().notNull(),
  instructions: text("instructions").array().notNull(),
  cookTime: integer("cook_time"), // in minutes
  servings: integer("servings"),
  cuisine: text("cuisine"),
  difficulty: text("difficulty"), // Easy, Medium, Hard
  category: text("category"), // Breakfast, Lunch, Dinner, Dessert, Snack
  dietaryTags: text("dietary_tags").array().default([]), // Vegetarian, Vegan, Keto, etc.
  sourceUrl: text("source_url"),
  sourcePlatform: text("source_platform"), // TikTok, Instagram, YouTube, Pinterest
  sourceUsername: text("source_username"),
  imageUrl: text("image_url"),
  likes: integer("likes").default(0),
  isBookmarked: boolean("is_bookmarked").default(false),
  nutritionData: jsonb("nutrition_data"), // Pro feature
  carbonScore: integer("carbon_score"), // Pro feature
});

export const challenges = pgTable("challenges", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  type: text("type").notNull(), // weekly, monthly, seasonal
  target: integer("target").notNull(), // target number to achieve
  reward: integer("reward").notNull(), // points reward
  isActive: boolean("is_active").default(true),
});

export const userChallenges = pgTable("user_challenges", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id").notNull(),
  challengeId: integer("challenge_id").notNull(),
  progress: integer("progress").default(0),
  completed: boolean("completed").default(false),
  completedAt: timestamp("completed_at"),
});

export const userRecipeActions = pgTable("user_recipe_actions", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id").notNull(),
  recipeId: integer("recipe_id").notNull(),
  action: text("action").notNull(), // cooked, liked, shared, bookmarked
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertUserSchema = createInsertSchema(users).omit({
  points: true,
  streak: true,
  recipesCooked: true,
  weeklyPoints: true,
  isPro: true,
  createdAt: true,
  updatedAt: true,
});

export const insertRecipeSchema = createInsertSchema(recipes).omit({
  id: true,
  likes: true,
  isBookmarked: true,
});

export const insertChallengeSchema = createInsertSchema(challenges).omit({
  id: true,
});

export const insertUserChallengeSchema = createInsertSchema(userChallenges).omit({
  id: true,
  progress: true,
  completed: true,
  completedAt: true,
});

export const insertUserRecipeActionSchema = createInsertSchema(userRecipeActions).omit({
  id: true,
  createdAt: true,
});

export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;
export type UpsertUser = typeof users.$inferInsert;
export type Recipe = typeof recipes.$inferSelect;
export type InsertRecipe = z.infer<typeof insertRecipeSchema>;
export type Challenge = typeof challenges.$inferSelect;
export type InsertChallenge = z.infer<typeof insertChallengeSchema>;
export type UserChallenge = typeof userChallenges.$inferSelect;
export type InsertUserChallenge = z.infer<typeof insertUserChallengeSchema>;
export type UserRecipeAction = typeof userRecipeActions.$inferSelect;
export type InsertUserRecipeAction = z.infer<typeof insertUserRecipeActionSchema>;
