// Test with Supabase pooler connection format
import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import { extractedRecipes } from '../shared/schema';
import { eq } from 'drizzle-orm';

async function testPoolerConnection() {
  // Get the current password from the existing connection string
  const currentUrl = process.env.SUPABASE_DATABASE_URL;
  if (!currentUrl) {
    console.error('❌ SUPABASE_DATABASE_URL not set');
    return;
  }
  
  // Extract password from current URL
  const passwordMatch = currentUrl.match(/:([^@]+)@/);
  const password = passwordMatch ? passwordMatch[1] : null;
  
  if (!password) {
    console.error('❌ Could not extract password from connection string');
    return;
  }
  
  // Try different connection formats for Supabase
  const connectionFormats = [
    `postgresql://postgres.ctbcdiedhsaqibcvcdmd:${password}@aws-0-us-east-1.pooler.supabase.com:6543/postgres`,
    `postgresql://postgres:${password}@aws-0-us-east-1.pooler.supabase.com/postgres?host=db.ctbcdiedhsaqibcvcdmd.supabase.co`,
    `postgresql://postgres:${password}@ctbcdiedhsaqibcvcdmd.supabase.co:5432/postgres?sslmode=require`,
    `postgresql://postgres:${password}@db.ctbcdiedhsaqibcvcdmd.supabase.co:5432/postgres`
  ];
  
  console.log('🔍 Testing different Supabase connection formats...');
  
  for (let i = 0; i < connectionFormats.length; i++) {
    const url = connectionFormats[i];
    const maskedUrl = url.replace(/:[^:@]*@/, ':****@');
    
    console.log(`\n🔧 Format ${i + 1}: ${maskedUrl}`);
    
    try {
      const client = postgres(url, {
        ssl: 'require',
        max: 1,
        idle_timeout: 5,
        connect_timeout: 15
      });
      
      const db = drizzle(client, { schema: { extractedRecipes } });
      
      // Test connection
      const [dbInfo] = await client`SELECT current_database(), current_user`;
      console.log('✅ Connection successful!');
      console.log('📊 Database:', dbInfo.current_database);
      console.log('👤 User:', dbInfo.current_user);
      
      // Get the kimchi recipe
      const recipe = await db.select().from(extractedRecipes)
        .where(eq(extractedRecipes.id, 'f345d082-447a-4cee-b9b4-edc7d4113546'))
        .limit(1);
      
      if (recipe.length > 0) {
        console.log('\n🥒 EASY AND CRUNCHY CUCUMBER KIMCHI RECIPE FOUND!');
        console.log('==================================================');
        const r = recipe[0];
        console.log('🏷️  Title:', r.recipeTitle);
        console.log('📝 Description:', r.description);
        console.log('⏰ Prep Time:', r.prepTime, 'minutes');
        console.log('🔥 Cook Time:', r.cookTime, 'minutes');
        console.log('⏱️  Total Time:', r.totalTime, 'minutes');
        console.log('🍽️  Servings:', r.servings);
        console.log('📈 Difficulty:', r.difficultyLevel);
        console.log('🌍 Cuisine:', r.cuisineType);
        console.log('🍽️  Meal Type:', r.mealType);
        console.log('🏷️  Dietary Tags:', JSON.stringify(r.dietaryTags));
        console.log('👨‍🍳 Chef:', r.chefAttribution);
        console.log('🤖 AI Confidence:', r.aiConfidenceScore);
        console.log('📅 Created:', r.createdAt);
        
        console.log('\n🥕 INGREDIENTS:');
        console.log('================');
        if (Array.isArray(r.ingredients)) {
          r.ingredients.forEach((ingredient, idx) => {
            console.log(`${idx + 1}. ${ingredient}`);
          });
        } else {
          console.log(r.ingredients);
        }
        
        console.log('\n👩‍🍳 INSTRUCTIONS:');
        console.log('==================');
        if (Array.isArray(r.instructions)) {
          r.instructions.forEach((instruction, idx) => {
            console.log(`${idx + 1}. ${instruction}`);
          });
        } else {
          console.log(r.instructions);
        }
        
        await client.end();
        return { success: true, recipe: r, connectionUrl: maskedUrl };
      } else {
        console.log('❌ Recipe not found with that ID');
        
        // Show available recipes
        const allRecipes = await db.select({
          id: extractedRecipes.id,
          title: extractedRecipes.recipeTitle,
          created: extractedRecipes.createdAt
        }).from(extractedRecipes).limit(10);
        
        console.log('\n📋 Available recipes:');
        allRecipes.forEach((recipe, idx) => {
          console.log(`${idx + 1}. ${recipe.title} (${recipe.id})`);
        });
      }
      
      await client.end();
      return { success: true, connectionUrl: maskedUrl };
      
    } catch (error) {
      console.log(`❌ Failed: ${error.message}`);
    }
  }
  
  console.log('\n❌ All connection formats failed');
  return { success: false };
}

testPoolerConnection().then((result) => {
  if (result?.success) {
    console.log('\n🎉 SUCCESS! Found working connection format');
    if (result.recipe) {
      console.log('✅ Recipe retrieved successfully');
    }
  } else {
    console.log('\n💔 Could not establish connection to Supabase');
  }
}).catch(console.error);