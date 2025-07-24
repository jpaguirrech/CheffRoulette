// Try to connect directly to Supabase using different connection methods
import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import { extractedRecipes } from '../shared/schema';
import { eq } from 'drizzle-orm';

async function testSupabaseConnection() {
  const supabaseUrl = process.env.SUPABASE_DATABASE_URL;
  console.log('🔍 Testing Supabase connection...');
  console.log('🔌 URL exists:', !!supabaseUrl);
  console.log('🔌 URL format:', supabaseUrl ? supabaseUrl.replace(/:[^:@]*@/, ':****@') : 'NOT_SET');
  
  if (!supabaseUrl) {
    console.error('❌ SUPABASE_DATABASE_URL not set');
    return;
  }
  
  try {
    // Test with different SSL configurations
    const connectionConfigs = [
      { ssl: 'require', description: 'SSL required' },
      { ssl: 'prefer', description: 'SSL preferred' },
      { ssl: false, description: 'No SSL' }
    ];
    
    for (const config of connectionConfigs) {
      try {
        console.log(`\n🔧 Trying connection with ${config.description}...`);
        
        const client = postgres(supabaseUrl, {
          ssl: config.ssl,
          max: 1,
          idle_timeout: 5,
          connect_timeout: 10
        });
        
        const db = drizzle(client, { schema: { extractedRecipes } });
        
        // Test basic connection
        await client`SELECT 1 as test`;
        console.log('✅ Basic connection successful');
        
        // Test database info
        const [dbInfo] = await client`SELECT current_database(), current_user, version()`;
        console.log('📊 Database:', dbInfo.current_database);
        console.log('👤 User:', dbInfo.current_user);
        
        // Try to get the kimchi recipe
        const recipe = await db.select().from(extractedRecipes)
          .where(eq(extractedRecipes.id, 'f345d082-447a-4cee-b9b4-edc7d4113546'))
          .limit(1);
        
        if (recipe.length > 0) {
          console.log('\n🥒 FOUND THE KIMCHI RECIPE!');
          console.log('=================================');
          const r = recipe[0];
          console.log('Title:', r.recipeTitle);
          console.log('Description:', r.description);
          console.log('Prep Time:', r.prepTime, 'minutes');
          console.log('Cook Time:', r.cookTime, 'minutes');
          console.log('Servings:', r.servings);
          console.log('Difficulty:', r.difficultyLevel);
          console.log('Cuisine:', r.cuisineType);
          console.log('Ingredients:', JSON.stringify(r.ingredients, null, 2));
          console.log('Instructions:', JSON.stringify(r.instructions, null, 2));
          
          await client.end();
          return r;
        } else {
          console.log('❌ Recipe not found, but connection works');
          // List available recipes
          const allRecipes = await db.select({
            id: extractedRecipes.id,
            title: extractedRecipes.recipeTitle
          }).from(extractedRecipes).limit(5);
          
          console.log('Available recipes:', allRecipes);
        }
        
        await client.end();
        break; // If we get here, connection worked
        
      } catch (error) {
        console.log(`❌ ${config.description} failed:`, error.message);
      }
    }
    
  } catch (error) {
    console.error('❌ All connection attempts failed:', error.message);
  }
}

testSupabaseConnection().then(() => {
  console.log('\n🏁 Test completed');
}).catch(console.error);