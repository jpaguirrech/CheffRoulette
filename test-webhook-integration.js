// Test the webhook integration with a real TikTok video
const TEST_VIDEO_URL = 'https://www.tiktok.com/@foodiechina888/video/7504670981533797639';
const TEST_USER_ID = 'test-user-123';

async function testWebhookIntegration() {
  try {
    console.log('🧪 Testing webhook integration with external API...');
    console.log('🎬 Video URL:', TEST_VIDEO_URL);
    console.log('👤 User ID:', TEST_USER_ID);
    
    const response = await fetch('http://localhost:5000/api/recipes/capture', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        // Note: In real usage, this would require authentication
      },
      body: JSON.stringify({
        url: TEST_VIDEO_URL,
        recipeName: 'Chinese Food Test Recipe'
      })
    });
    
    const result = await response.json();
    
    console.log('\n📋 Response Status:', response.status);
    console.log('📋 Response Data:', JSON.stringify(result, null, 2));
    
    if (result.success) {
      console.log('\n✅ WEBHOOK INTEGRATION SUCCESSFUL!');
      console.log('🍜 Recipe Title:', result.data.title);
      console.log('📝 Description:', result.data.description);
      console.log('🏷️  Platform:', result.data.platform);
      console.log('⏰ Prep Time:', result.data.prepTime, 'minutes');
      console.log('🔥 Cook Time:', result.data.cookTime, 'minutes');
      console.log('🍽️  Servings:', result.data.servings);
      console.log('📈 Difficulty:', result.data.difficulty);
      console.log('🌍 Cuisine:', result.data.cuisine);
      console.log('🤖 AI Confidence:', result.data.confidenceScore);
      console.log('🆔 Recipe ID:', result.data.recipeId);
      console.log('📅 Processed At:', result.data.processedAt);
    } else {
      console.log('\n❌ WEBHOOK FAILED:', result.error);
    }
    
  } catch (error) {
    console.error('\n💥 TEST ERROR:', error.message);
  }
}

// For manual testing
if (require.main === module) {
  testWebhookIntegration();
}

module.exports = { testWebhookIntegration };