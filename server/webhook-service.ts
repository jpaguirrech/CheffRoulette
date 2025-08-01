// External webhook service for real video processing
import { z } from 'zod';

const WEBHOOK_URL = 'https://flw.panteragpt.com/webhook/social-media-recipe';

// Request schema for the external webhook
const webhookRequestSchema = z.object({
  content_url: z.string().url(),
  user_id: z.string(),
  recipe_name: z.string().optional()
});

// Response schema from the external webhook
const webhookResponseSchema = z.object({
  success: z.boolean(),
  status: z.string(),
  message: z.string(),
  data: z.object({
    social_media_content_id: z.string().uuid(),
    recipe_id: z.string().uuid(),
    recipe_title: z.string(),
    description: z.string(),
    platform: z.string(),
    content_type: z.string(),
    prep_time: z.number(),
    cook_time: z.number(),
    total_time: z.number(),
    servings: z.number(),
    difficulty_level: z.string(),
    cuisine_type: z.string(),
    meal_type: z.string(),
    ai_confidence_score: z.number(),
    processed_at: z.string()
  }).optional(),
  error: z.string().optional()
});

export type WebhookRequest = z.infer<typeof webhookRequestSchema>;
export type WebhookResponse = z.infer<typeof webhookResponseSchema>;

export class WebhookRecipeService {
  /**
   * Process a video URL using the external webhook service
   * This will automatically extract the recipe and save it to the Neon database
   */
  static async processVideoRecipe(
    contentUrl: string, 
    userId: string, 
    recipeName?: string
  ): Promise<WebhookResponse> {
    try {
      console.log(`🎬 Processing video with external webhook: ${contentUrl}`);
      
      // Validate input
      const requestData = webhookRequestSchema.parse({
        content_url: contentUrl,
        user_id: userId,
        recipe_name: recipeName
      });

      // Call the external webhook API
      const response = await fetch(WEBHOOK_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(requestData)
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Webhook API error (${response.status}): ${errorText}`);
      }

      const responseData = await response.json();
      console.log('📥 Webhook response received:', responseData);

      // Validate response structure
      const validatedResponse = webhookResponseSchema.parse(responseData);

      if (!validatedResponse.success) {
        throw new Error(`Webhook processing failed: ${validatedResponse.message || 'Unknown error'}`);
      }

      console.log(`✅ Recipe processed successfully: ${validatedResponse.data?.recipe_title}`);
      
      return validatedResponse;

    } catch (error) {
      console.error('❌ Webhook service error:', error);
      
      // Handle different types of errors
      if (error instanceof z.ZodError) {
        throw new Error(`Invalid data format: ${error.message}`);
      }
      
      if (error instanceof TypeError && error.message.includes('fetch')) {
        throw new Error('Network error: Unable to connect to video processing service');
      }
      
      throw error;
    }
  }

  /**
   * Get supported platforms for video processing
   */
  static getSupportedPlatforms(): string[] {
    return [
      'tiktok.com',
      'instagram.com', 
      'youtube.com',
      'youtu.be',
      'pinterest.com',
      'facebook.com',
      'twitter.com',
      'x.com'
    ];
  }

  /**
   * Check if a URL is from a supported platform
   */
  static isSupportedPlatform(url: string): boolean {
    const supportedPlatforms = this.getSupportedPlatforms();
    return supportedPlatforms.some(platform => url.toLowerCase().includes(platform));
  }

  /**
   * Extract platform name from URL
   */
  static getPlatformFromUrl(url: string): string {
    const urlLower = url.toLowerCase();
    
    if (urlLower.includes('tiktok.com')) return 'tiktok';
    if (urlLower.includes('instagram.com')) return 'instagram';
    if (urlLower.includes('youtube.com') || urlLower.includes('youtu.be')) return 'youtube';
    if (urlLower.includes('pinterest.com')) return 'pinterest';
    if (urlLower.includes('facebook.com')) return 'facebook';
    if (urlLower.includes('twitter.com') || urlLower.includes('x.com')) return 'twitter';
    
    return 'unknown';
  }

  /**
   * Validate URL format and platform support
   */
  static validateUrl(url: string): { isValid: boolean; platform: string; error?: string } {
    try {
      new URL(url); // Basic URL validation
    } catch {
      return { isValid: false, platform: 'unknown', error: 'Invalid URL format' };
    }

    const platform = this.getPlatformFromUrl(url);
    
    if (platform === 'unknown') {
      return { 
        isValid: false, 
        platform: 'unknown', 
        error: `Unsupported platform. Supported platforms: ${this.getSupportedPlatforms().join(', ')}` 
      };
    }

    return { isValid: true, platform };
  }
}

export default WebhookRecipeService;