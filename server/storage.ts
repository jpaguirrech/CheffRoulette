import { 
  users, recipes, challenges, userChallenges, userRecipeActions,
  type User, type InsertUser, type Recipe, type InsertRecipe, 
  type Challenge, type InsertChallenge, type UserChallenge, type InsertUserChallenge,
  type UserRecipeAction, type InsertUserRecipeAction
} from "@shared/schema";

export interface IStorage {
  // User operations
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUser(id: number, updates: Partial<User>): Promise<User | undefined>;
  
  // Recipe operations
  getRecipe(id: number): Promise<Recipe | undefined>;
  getRecipes(userId?: number, filters?: RecipeFilters): Promise<Recipe[]>;
  createRecipe(recipe: InsertRecipe): Promise<Recipe>;
  updateRecipe(id: number, updates: Partial<Recipe>): Promise<Recipe | undefined>;
  deleteRecipe(id: number): Promise<boolean>;
  getRandomRecipe(filters?: RecipeFilters): Promise<Recipe | undefined>;
  
  // Challenge operations
  getChallenges(): Promise<Challenge[]>;
  getActiveUserChallenges(userId: number): Promise<UserChallenge[]>;
  updateUserChallengeProgress(userId: number, challengeId: number, progress: number): Promise<UserChallenge | undefined>;
  
  // User actions
  recordUserAction(action: InsertUserRecipeAction): Promise<UserRecipeAction>;
  getUserActions(userId: number, recipeId?: number): Promise<UserRecipeAction[]>;
}

export interface RecipeFilters {
  cuisine?: string;
  difficulty?: string;
  category?: string;
  cookTime?: number; // max cook time
  dietaryTags?: string[];
  hasIngredients?: string[];
}

export class MemStorage implements IStorage {
  private users: Map<number, User> = new Map();
  private recipes: Map<number, Recipe> = new Map();
  private challenges: Map<number, Challenge> = new Map();
  private userChallenges: Map<number, UserChallenge> = new Map();
  private userRecipeActions: Map<number, UserRecipeAction> = new Map();
  
  private currentUserId = 1;
  private currentRecipeId = 1;
  private currentChallengeId = 1;
  private currentUserChallengeId = 1;
  private currentUserActionId = 1;

  constructor() {
    this.initializeData();
  }

  private initializeData() {
    // Create default user
    const defaultUser: User = {
      id: this.currentUserId++,
      username: "foodie_user",
      email: "user@example.com",
      password: "hashedpassword",
      points: 1247,
      streak: 7,
      recipesCooked: 23,
      weeklyPoints: 340,
      isPro: false,
      proExpiresAt: null,
    };
    this.users.set(defaultUser.id, defaultUser);

    // Create sample recipes
    const sampleRecipes: Recipe[] = [
      {
        id: this.currentRecipeId++,
        userId: defaultUser.id,
        title: "Spicy Korean Ramen Bowl",
        description: "Authentic Korean-style ramen with soft-boiled egg and scallions",
        ingredients: ["2 packs instant ramen", "2 eggs", "2 scallions", "1 tbsp gochujang", "1 clove garlic", "1 tsp sesame oil"],
        instructions: ["Boil water and cook ramen noodles", "Soft-boil eggs for 6 minutes", "Sauté garlic and gochujang", "Combine everything and garnish with scallions"],
        cookTime: 15,
        servings: 2,
        cuisine: "Korean",
        difficulty: "Easy",
        category: "Dinner",
        dietaryTags: [],
        sourceUrl: "https://tiktok.com/example",
        sourcePlatform: "TikTok",
        sourceUsername: "@foodie_chef",
        imageUrl: "https://images.unsplash.com/photo-1569718212165-3a8278d5f624?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&h=600",
        likes: 847,
        isBookmarked: false,
        nutritionData: null,
        carbonScore: null,
      },
      {
        id: this.currentRecipeId++,
        userId: defaultUser.id,
        title: "Classic Margherita Pizza",
        description: "Homemade margherita pizza with fresh basil and mozzarella",
        ingredients: ["Pizza dough", "San Marzano tomatoes", "Fresh mozzarella", "Fresh basil", "Olive oil", "Salt", "Pepper"],
        instructions: ["Preheat oven to 475°F", "Roll out pizza dough", "Spread tomato sauce", "Add mozzarella chunks", "Bake for 12-15 minutes", "Add fresh basil"],
        cookTime: 45,
        servings: 4,
        cuisine: "Italian",
        difficulty: "Medium",
        category: "Dinner",
        dietaryTags: ["Vegetarian"],
        sourceUrl: "https://youtube.com/example",
        sourcePlatform: "YouTube",
        sourceUsername: "@pizza_master",
        imageUrl: "https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&h=600",
        likes: 1200,
        isBookmarked: true,
        nutritionData: null,
        carbonScore: null,
      },
      {
        id: this.currentRecipeId++,
        userId: defaultUser.id,
        title: "Rainbow Quinoa Power Bowl",
        description: "Colorful quinoa salad bowl with vegetables and herbs",
        ingredients: ["1 cup quinoa", "Mixed vegetables", "Avocado", "Chickpeas", "Lemon", "Olive oil", "Herbs"],
        instructions: ["Cook quinoa according to package", "Roast vegetables", "Prepare dressing", "Combine all ingredients", "Serve fresh"],
        cookTime: 20,
        servings: 2,
        cuisine: "Healthy",
        difficulty: "Easy",
        category: "Lunch",
        dietaryTags: ["Vegan", "Gluten-Free"],
        sourceUrl: "https://instagram.com/example",
        sourcePlatform: "Instagram",
        sourceUsername: "@healthy_eats",
        imageUrl: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&h=600",
        likes: 623,
        isBookmarked: false,
        nutritionData: null,
        carbonScore: null,
      },
      {
        id: this.currentRecipeId++,
        userId: defaultUser.id,
        title: "Perfect Chocolate Chip Cookies",
        description: "Crispy outside, chewy inside chocolate chip cookies",
        ingredients: ["2 cups flour", "1 cup butter", "3/4 cup brown sugar", "1/2 cup white sugar", "2 eggs", "2 tsp vanilla", "Chocolate chips"],
        instructions: ["Cream butter and sugars", "Add eggs and vanilla", "Mix in flour", "Fold in chocolate chips", "Bake at 375°F for 9-11 minutes"],
        cookTime: 30,
        servings: 24,
        cuisine: "American",
        difficulty: "Easy",
        category: "Dessert",
        dietaryTags: [],
        sourceUrl: "https://pinterest.com/example",
        sourcePlatform: "Pinterest",
        sourceUsername: "@baking_queen",
        imageUrl: "https://images.unsplash.com/photo-1499636136210-6f4ee915583e?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&h=600",
        likes: 2100,
        isBookmarked: true,
        nutritionData: null,
        carbonScore: null,
      },
    ];

    sampleRecipes.forEach(recipe => {
      this.recipes.set(recipe.id, recipe);
    });

    // Create sample challenges
    const sampleChallenges: Challenge[] = [
      {
        id: this.currentChallengeId++,
        title: "Veggie Week Challenge",
        description: "Cook 5 vegetarian recipes this week",
        type: "weekly",
        target: 5,
        reward: 100,
        isActive: true,
      },
      {
        id: this.currentChallengeId++,
        title: "Quick Cook Master",
        description: "Cook 10 recipes under 30 minutes",
        type: "monthly",
        target: 10,
        reward: 250,
        isActive: true,
      },
    ];

    sampleChallenges.forEach(challenge => {
      this.challenges.set(challenge.id, challenge);
    });

    // Create user challenge progress
    const userChallenge: UserChallenge = {
      id: this.currentUserChallengeId++,
      userId: defaultUser.id,
      challengeId: 1,
      progress: 3,
      completed: false,
      completedAt: null,
    };
    this.userChallenges.set(userChallenge.id, userChallenge);
  }

  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(user => user.username === username);
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(user => user.email === email);
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const user: User = {
      id: this.currentUserId++,
      ...insertUser,
      points: 0,
      streak: 0,
      recipesCooked: 0,
      weeklyPoints: 0,
      isPro: false,
      proExpiresAt: null,
    };
    this.users.set(user.id, user);
    return user;
  }

  async updateUser(id: number, updates: Partial<User>): Promise<User | undefined> {
    const user = this.users.get(id);
    if (!user) return undefined;
    
    const updatedUser = { ...user, ...updates };
    this.users.set(id, updatedUser);
    return updatedUser;
  }

  async getRecipe(id: number): Promise<Recipe | undefined> {
    return this.recipes.get(id);
  }

  async getRecipes(userId?: number, filters?: RecipeFilters): Promise<Recipe[]> {
    let recipes = Array.from(this.recipes.values());
    
    if (userId) {
      recipes = recipes.filter(recipe => recipe.userId === userId);
    }
    
    if (filters) {
      if (filters.cuisine) {
        recipes = recipes.filter(recipe => recipe.cuisine === filters.cuisine);
      }
      if (filters.difficulty) {
        recipes = recipes.filter(recipe => recipe.difficulty === filters.difficulty);
      }
      if (filters.category) {
        recipes = recipes.filter(recipe => recipe.category === filters.category);
      }
      if (filters.cookTime) {
        recipes = recipes.filter(recipe => recipe.cookTime && recipe.cookTime <= filters.cookTime!);
      }
      if (filters.dietaryTags && filters.dietaryTags.length > 0) {
        recipes = recipes.filter(recipe => 
          recipe.dietaryTags && recipe.dietaryTags.length > 0 && filters.dietaryTags!.some(tag => recipe.dietaryTags!.includes(tag))
        );
      }
    }
    
    return recipes;
  }

  async createRecipe(insertRecipe: InsertRecipe): Promise<Recipe> {
    const recipe: Recipe = {
      id: this.currentRecipeId++,
      ...insertRecipe,
      description: insertRecipe.description || null,
      cookTime: insertRecipe.cookTime || null,
      servings: insertRecipe.servings || null,
      cuisine: insertRecipe.cuisine || null,
      difficulty: insertRecipe.difficulty || null,
      category: insertRecipe.category || null,
      dietaryTags: insertRecipe.dietaryTags || [],
      sourceUrl: insertRecipe.sourceUrl || null,
      sourcePlatform: insertRecipe.sourcePlatform || null,
      sourceUsername: insertRecipe.sourceUsername || null,
      imageUrl: insertRecipe.imageUrl || null,
      nutritionData: insertRecipe.nutritionData || null,
      carbonScore: insertRecipe.carbonScore || null,
      likes: 0,
      isBookmarked: false,
    };
    this.recipes.set(recipe.id, recipe);
    return recipe;
  }

  async updateRecipe(id: number, updates: Partial<Recipe>): Promise<Recipe | undefined> {
    const recipe = this.recipes.get(id);
    if (!recipe) return undefined;
    
    const updatedRecipe = { ...recipe, ...updates };
    this.recipes.set(id, updatedRecipe);
    return updatedRecipe;
  }

  async deleteRecipe(id: number): Promise<boolean> {
    return this.recipes.delete(id);
  }

  async getRandomRecipe(filters?: RecipeFilters): Promise<Recipe | undefined> {
    const recipes = await this.getRecipes(undefined, filters);
    if (recipes.length === 0) return undefined;
    
    const randomIndex = Math.floor(Math.random() * recipes.length);
    return recipes[randomIndex];
  }

  async getChallenges(): Promise<Challenge[]> {
    return Array.from(this.challenges.values()).filter(challenge => challenge.isActive);
  }

  async getActiveUserChallenges(userId: number): Promise<UserChallenge[]> {
    return Array.from(this.userChallenges.values()).filter(uc => uc.userId === userId && !uc.completed);
  }

  async updateUserChallengeProgress(userId: number, challengeId: number, progress: number): Promise<UserChallenge | undefined> {
    const userChallenge = Array.from(this.userChallenges.values()).find(
      uc => uc.userId === userId && uc.challengeId === challengeId
    );
    
    if (!userChallenge) return undefined;
    
    const challenge = this.challenges.get(challengeId);
    if (!challenge) return undefined;
    
    const updatedUserChallenge = {
      ...userChallenge,
      progress,
      completed: progress >= challenge.target,
      completedAt: progress >= challenge.target ? new Date() : null,
    };
    
    this.userChallenges.set(userChallenge.id, updatedUserChallenge);
    return updatedUserChallenge;
  }

  async recordUserAction(insertAction: InsertUserRecipeAction): Promise<UserRecipeAction> {
    const action: UserRecipeAction = {
      id: this.currentUserActionId++,
      ...insertAction,
      createdAt: new Date(),
    };
    this.userRecipeActions.set(action.id, action);
    return action;
  }

  async getUserActions(userId: number, recipeId?: number): Promise<UserRecipeAction[]> {
    let actions = Array.from(this.userRecipeActions.values()).filter(action => action.userId === userId);
    
    if (recipeId) {
      actions = actions.filter(action => action.recipeId === recipeId);
    }
    
    return actions;
  }
}

export const storage = new MemStorage();
