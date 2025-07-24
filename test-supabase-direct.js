// Direct test of Supabase connection with the specific recipe ID
import { neon } from '@neondatabase/serverless';

const SUPABASE_URL = 'postgresql://postgres:Ch$$-Rule69@db.ctbcdiedhsaqibcvcdmd.supabase.co:5432/postgres';

async function getRecipe() {
  try {
    const sql = neon(SUPABASE_URL);
    
    // Test connection first
    const testResult = await sql`SELECT current_database(), current_user`;
    console.log('✅ Connected to:', testResult[0]);
    
    // Get the specific recipe
    const recipe = await sql`
      SELECT 
        id,
        recipe_title,
        description,
        ingredients,
        instructions,
        prep_time,
        cook_time,
        total_time,
        servings,
        difficulty_level,
        cuisine_type,
        meal_type,
        dietary_tags,
        chef_attribution,
        ai_confidence_score,
        status,
        created_at
      FROM extracted_recipes 
      WHERE id = 'f345d082-447a-4cee-b9b4-edc7d4113546'
    `;
    
    if (recipe.length > 0) {
      console.log('\n🥒 Easy and Crunchy Cucumber Kimchi Recipe Found:');
      console.log('=====================================');
      console.log(JSON.stringify(recipe[0], null, 2));
    } else {
      console.log('❌ Recipe not found with that ID');
      
      // Let's see what recipes are actually in the database
      const allRecipes = await sql`SELECT id, recipe_title FROM extracted_recipes LIMIT 5`;
      console.log('\n📋 Available recipes:');
      console.log(allRecipes);
    }
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

getRecipe();