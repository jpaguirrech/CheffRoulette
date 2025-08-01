// Test API responses to debug frontend issues
async function testAPIs() {
  console.log('=== TESTING API RESPONSES ===\n');
  
  try {
    // Test recipes endpoint
    console.log('1. Testing /api/recipes endpoint:');
    const recipesResponse = await fetch('http://localhost:5000/api/recipes');
    const recipesData = await recipesResponse.json();
    console.log('Status:', recipesResponse.status);
    console.log('Data type:', Array.isArray(recipesData) ? 'array' : typeof recipesData);
    console.log('Count:', Array.isArray(recipesData) ? recipesData.length : 'N/A');
    if (Array.isArray(recipesData) && recipesData.length > 0) {
      console.log('First recipe title:', recipesData[0].title);
      console.log('First recipe keys:', Object.keys(recipesData[0]));
    }
    console.log('');
    
    // Test auth endpoint  
    console.log('2. Testing /api/auth/user endpoint:');
    const authResponse = await fetch('http://localhost:5000/api/auth/user');
    const authData = await authResponse.json();
    console.log('Status:', authResponse.status);
    console.log('User ID:', authData.id);
    console.log('User name:', authData.firstName, authData.lastName);
    console.log('');
    
    // Test with a working TikTok URL from our database
    console.log('3. Testing recipe capture with existing recipe URL:');
    const captureResponse = await fetch('http://localhost:5000/api/recipes/capture', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        url: 'https://www.tiktok.com/@essen_paradies/video/7521018309056253206',
        recipeName: 'Greek Salad Test'
      })
    });
    const captureData = await captureResponse.json();
    console.log('Status:', captureResponse.status);
    console.log('Success:', captureData.success);
    console.log('Response:', JSON.stringify(captureData, null, 2));
    
  } catch (error) {
    console.error('Error testing APIs:', error);
  }
}

testAPIs();