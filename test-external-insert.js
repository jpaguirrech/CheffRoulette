// Test script to demonstrate external insertion
// Replace with your actual DATABASE_URL password

const postgres = require('postgres');

// Use your actual DATABASE_URL here
const sql = postgres(process.env.DATABASE_URL);

async function testExternalInsert() {
  try {
    console.log('Testing external database insertion...');
    
    // Sample video data from your processing function
    const videoData = {
      url: 'https://example.com/test-video',
      platform: 'youtube',
      title: 'Test Recipe Video',
      description: 'A test video for external insertion',
      author: 'Test Chef',
      duration: 120,
      userId: 'external-user-001'
    };
    
    // Sample recipe data from your AI processing
    const recipeData = {
      title: 'Test External Recipe',
      description: 'A recipe inserted from external processing',
      ingredients: [
        '2 cups flour',
        '1 cup sugar', 
        '3 eggs',
        '1/2 cup butter'
      ],
      instructions: [
        'Mix dry ingredients',
        'Add wet ingredients',
        'Bake at 350°F for 25 minutes'
      ],
      prepTime: 15,
      cookTime: 25,
      totalTime: 40,
      servings: 8,
      difficulty: 'medium',
      cuisine: 'American',
      mealType: 'dessert',
      dietaryTags: ['Vegetarian'],
      chef: 'Test Chef',
      confidence: 0.88
    };
    
    // Insert social media content first
    const [content] = await sql`
      INSERT INTO social_media_content (
        original_url, platform, content_type, title, description,
        author, duration, user_id, status, processed_at
      ) VALUES (
        ${videoData.url}, ${videoData.platform}, 'video', 
        ${videoData.title}, ${videoData.description},
        ${videoData.author}, ${videoData.duration}, 
        ${videoData.userId}, 'completed', NOW()
      ) RETURNING id, created_at
    `;
    
    console.log('✅ Social media content inserted:', content.id);
    
    // Insert extracted recipe
    const [recipe] = await sql`
      INSERT INTO extracted_recipes (
        social_media_content_id, recipe_title, description,
        ingredients, instructions, prep_time, cook_time,
        total_time, servings, difficulty_level, cuisine_type,
        meal_type, dietary_tags, chef_attribution, ai_confidence_score,
        status
      ) VALUES (
        ${content.id}, ${recipeData.title}, ${recipeData.description},
        ${JSON.stringify(recipeData.ingredients)}, ${JSON.stringify(recipeData.instructions)},
        ${recipeData.prepTime}, ${recipeData.cookTime}, ${recipeData.totalTime},
        ${recipeData.servings}, ${recipeData.difficulty}, ${recipeData.cuisine},
        ${recipeData.mealType}, ${JSON.stringify(recipeData.dietaryTags)},
        ${recipeData.chef}, ${recipeData.confidence}, 'published'
      ) RETURNING id, created_at
    `;
    
    console.log('✅ Recipe inserted:', recipe.id);
    
    // Verify the insertion
    const insertedRecipe = await sql`
      SELECT 
        er.recipe_title,
        er.ingredients,
        er.instructions,
        er.prep_time,
        er.cook_time,
        er.servings,
        smc.original_url,
        smc.platform
      FROM extracted_recipes er
      JOIN social_media_content smc ON er.social_media_content_id = smc.id
      WHERE er.id = ${recipe.id}
    `;
    
    console.log('\n📋 Inserted Recipe Details:');
    console.log('Title:', insertedRecipe[0].recipe_title);
    console.log('Platform:', insertedRecipe[0].platform);
    console.log('URL:', insertedRecipe[0].original_url);
    console.log('Prep Time:', insertedRecipe[0].prep_time, 'minutes');
    console.log('Cook Time:', insertedRecipe[0].cook_time, 'minutes');
    console.log('Servings:', insertedRecipe[0].servings);
    console.log('Ingredients:', insertedRecipe[0].ingredients.length, 'items');
    console.log('Instructions:', insertedRecipe[0].instructions.length, 'steps');
    
    console.log('\n🎉 External insertion test successful!');
    
    await sql.end();
    return { success: true, contentId: content.id, recipeId: recipe.id };
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
    await sql.end();
    return { success: false, error: error.message };
  }
}

if (require.main === module) {
  testExternalInsert();
}

module.exports = { testExternalInsert };