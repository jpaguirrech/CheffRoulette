// Test fetching a real recipe from the database
async function testRecipeFetch() {
  const recipeId = '3aaff802-9e84-4064-a13b-4b0ce6efe44a'; // Greek Salad ID from database
  
  try {
    const response = await fetch(`http://localhost:5000/api/neon/recipes/${recipeId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    });
    
    const data = await response.json();
    
    console.log('Recipe fetch test result:');
    console.log('Title:', data.title);
    console.log('Description:', data.description);
    console.log('Ingredients count:', data.ingredients?.length || 0);
    console.log('Instructions count:', data.instructions?.length || 0);
    console.log('Platform:', data.platform);
    console.log('Full response:', JSON.stringify(data, null, 2));
    
  } catch (error) {
    console.error('Error testing recipe fetch:', error);
  }
}

testRecipeFetch();