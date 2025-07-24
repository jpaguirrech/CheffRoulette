// Script para importar datos de recetas desde Supabase a Neon
import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import { extractedRecipes, socialMediaContent } from './shared/schema';

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error('DATABASE_URL no está configurado');
}

const client = postgres(connectionString);
const db = drizzle(client, { schema: { extractedRecipes, socialMediaContent } });

// Ejemplo de cómo importar la receta del kimchi
async function importKimchiRecipe() {
  console.log('🥒 Importando receta de Easy and Crunchy Cucumber Kimchi...');
  
  // Cuando el usuario proporcione los datos, los insertaremos aquí
  const kimchiData = {
    id: 'f345d082-447a-4cee-b9b4-edc7d4113546',
    recipeTitle: 'Easy and Crunchy Cucumber Kimchi',
    description: 'Una versión rápida y crujiente del kimchi tradicional coreano usando pepinos',
    ingredients: [
      '2 pepinos grandes',
      '2 cucharadas de sal',
      '1 cucharada de azúcar',
      '2 cucharadas de vinagre de arroz',
      '1 cucharada de aceite de sésamo',
      '2 dientes de ajo picados',
      '1 cucharadita de jengibre rallado',
      '1-2 cucharadas de gochugaru (chile coreano en copos)',
      '2 cebolletas picadas'
    ],
    instructions: [
      'Cortar los pepinos en rodajas finas y salar durante 30 minutos',
      'Enjuagar y escurrir bien los pepinos',
      'Mezclar todos los condimentos en un bol',
      'Combinar pepinos con la mezcla de condimentos',
      'Refrigerar por al menos 1 hora antes de servir'
    ],
    prepTime: 15,
    cookTime: 0,
    totalTime: 75, // incluye tiempo de marinado
    servings: 4,
    difficultyLevel: 'Fácil' as const,
    cuisineType: 'Coreana',
    mealType: ['Acompañamiento'],
    dietaryTags: ['Vegetariano', 'Vegano', 'Sin Gluten'],
    chefAttribution: 'Receta tradicional coreana adaptada',
    aiConfidenceScore: 0.95,
    createdAt: new Date()
  };
  
  try {
    // Comentado hasta que tengamos los datos reales
    // await db.insert(extractedRecipes).values(kimchiData);
    console.log('✅ Estructura preparada para importar la receta');
    console.log('📝 Esperando datos reales del usuario...');
  } catch (error) {
    console.error('❌ Error al importar:', error);
  } finally {
    await client.end();
  }
}

// Función para importar múltiples recetas desde un array de datos
async function importMultipleRecipes(recipesData: any[]) {
  console.log(`📦 Importando ${recipesData.length} recetas...`);
  
  try {
    for (const recipe of recipesData) {
      await db.insert(extractedRecipes).values(recipe);
      console.log(`✅ Importada: ${recipe.recipeTitle}`);
    }
    console.log('🎉 Todas las recetas importadas correctamente');
  } catch (error) {
    console.error('❌ Error al importar recetas:', error);
  } finally {
    await client.end();
  }
}

if (require.main === module) {
  importKimchiRecipe();
}

export { importKimchiRecipe, importMultipleRecipes };