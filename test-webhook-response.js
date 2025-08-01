// Test webhook response format
const mockWebhookResponse = [
  {
    "id": "d9abe2e7-c4a8-46c1-9a2c-c7daa24a9b03",
    "status": "completed",
    "title": "Recipe Not Available",
    "processed_at": "2025-08-01T03:23:18.511Z"
  }
];

console.log('Mock webhook response:');
console.log(JSON.stringify(mockWebhookResponse, null, 2));

// Test parsing
const result = mockWebhookResponse[0];
const response = {
  success: result.status === 'completed',
  status: result.status,
  message: result.title,
  data: result.status === 'completed' ? {
    recipe_id: result.id,
    recipe_title: result.title,
    processed_at: result.processed_at,
    status: result.status
  } : undefined
};

console.log('\nParsed response:');
console.log(JSON.stringify(response, null, 2));