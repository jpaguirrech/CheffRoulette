import { db } from "./db";
import { users, recipes, challenges, userChallenges } from "@shared/schema";

async function seedDatabase() {
  console.log("🌱 Seeding database...");

  try {
    // Create default user
    const [defaultUser] = await db
      .insert(users)
      .values({
        username: "foodie_user",
        email: "user@example.com",
        password: "hashedpassword",
        points: 1247,
        streak: 7,
        recipesCooked: 23,
        weeklyPoints: 340,
        isPro: false,
      })
      .returning();

    console.log("✅ Created default user:", defaultUser.username);

    // Create sample recipes
    const sampleRecipes = [
      {
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
      },
      {
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
      },
      {
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
      },
      {
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
      },
    ];

    const createdRecipes = await db.insert(recipes).values(sampleRecipes).returning();
    console.log(`✅ Created ${createdRecipes.length} sample recipes`);

    // Create sample challenges
    const sampleChallenges = [
      {
        title: "Veggie Week Challenge",
        description: "Cook 5 vegetarian recipes this week",
        type: "weekly",
        target: 5,
        reward: 100,
        isActive: true,
      },
      {
        title: "Quick Cook Master",
        description: "Cook 10 recipes under 30 minutes",
        type: "monthly",
        target: 10,
        reward: 250,
        isActive: true,
      },
    ];

    const createdChallenges = await db.insert(challenges).values(sampleChallenges).returning();
    console.log(`✅ Created ${createdChallenges.length} challenges`);

    // Create user challenge progress
    await db.insert(userChallenges).values({
      userId: defaultUser.id,
      challengeId: createdChallenges[0].id,
      progress: 3,
      completed: false,
    });

    console.log("✅ Created user challenge progress");
    console.log("🎉 Database seeding completed successfully!");

  } catch (error) {
    console.error("❌ Error seeding database:", error);
    throw error;
  }
}

// Run seeding if this file is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  seedDatabase()
    .then(() => process.exit(0))
    .catch(() => process.exit(1));
}

export { seedDatabase };