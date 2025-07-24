// Direct test of Supabase connection to retrieve the kimchi recipe
import { db } from './db';
import { extractedRecipes } from '../shared/schema';
import { eq } from 'drizzle-orm';

async function getKimchiRecipe() {
  try {
    console.log('🔍 Searching for Easy and Crunchy Cucumber Kimchi recipe...');
    
    // Get the specific recipe by ID
    const recipe = await db.select().from(extractedRecipes)
      .where(eq(extractedRecipes.id, 'f345d082-447a-4cee-b9b4-edc7d4113546'))
      .limit(1);
    
    if (recipe.length > 0) {
      console.log('\n🥒 Easy and Crunchy Cucumber Kimchi Recipe Found!');
      console.log('=====================================================');
      console.log('Recipe Title:', recipe[0].recipeTitle);
      console.log('Description:', recipe[0].description);
      console.log('Prep Time:', recipe[0].prepTime, 'minutes');
      console.log('Cook Time:', recipe[0].cookTime, 'minutes');
      console.log('Total Time:', recipe[0].totalTime, 'minutes');
      console.log('Servings:', recipe[0].servings);
      console.log('Difficulty:', recipe[0].difficultyLevel);
      console.log('Cuisine:', recipe[0].cuisineType);
      console.log('Meal Type:', recipe[0].mealType);
      console.log('Dietary Tags:', JSON.stringify(recipe[0].dietaryTags));
      console.log('Chef Attribution:', recipe[0].chefAttribution);
      console.log('AI Confidence Score:', recipe[0].aiConfidenceScore);
      console.log('\n📝 Ingredients:');
      console.log(JSON.stringify(recipe[0].ingredients, null, 2));
      console.log('\n👩‍🍳 Instructions:');
      console.log(JSON.stringify(recipe[0].instructions, null, 2));
      console.log('\n📅 Created:', recipe[0].createdAt);
      
      return recipe[0];
    } else {
      console.log('❌ Recipe not found with that ID');
      
      // Let's see what recipes are actually in the database
      const allRecipes = await db.select({
        id: extractedRecipes.id,
        title: extractedRecipes.recipeTitle,
        createdAt: extractedRecipes.createdAt
      }).from(extractedRecipes).limit(10);
      
      console.log('\n📋 Available recipes in database:');
      allRecipes.forEach((r, i) => {
        console.log(`${i+1}. ${r.title} (ID: ${r.id})`);
      });
      
      return null;
    }
    
  } catch (error) {
    console.error('❌ Error connecting to database:', error);
    return null;
  }
}

// Run the test
getKimchiRecipe().then(() => {
  process.exit(0);
}).catch((error) => {
  console.error('Fatal error:', error);
  process.exit(1);
});