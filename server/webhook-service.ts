// External webhook service for real video processing
import { z } from 'zod';

const WEBHOOK_URL = 'https://flw.panteragpt.com/webhook/social-media-recipe';

// Request schema for the external webhook
const webhookRequestSchema = z.object({
  content_url: z.string().url(),
  user_id: z.string(),
  recipe_name: z.string().optional()
});

// Response schemas from the external webhook - handle both formats
const webhookArrayResponseSchema = z.array(z.object({
  id: z.string().uuid(),
  status: z.string(),
  title: z.string(),
  processed_at: z.string()
}));

const webhookObjectResponseSchema = z.object({
  success: z.boolean(),
  status: z.string(),
  message: z.string(),
  recipe_id: z.string().uuid(),
  recipe_title: z.string()
});

export type WebhookRequest = z.infer<typeof webhookRequestSchema>;
export type WebhookArrayResponse = z.infer<typeof webhookArrayResponseSchema>;
export type WebhookObjectResponse = z.infer<typeof webhookObjectResponseSchema>;

export class WebhookRecipeService {
  /**
   * Process a video URL using the external webhook service
   * This will automatically extract the recipe and save it to the Neon database
   */
  static async processVideoRecipe(
    contentUrl: string, 
    userId: string, 
    recipeName?: string
  ): Promise<{
    success: boolean;
    status: string;
    message: string;
    data?: {
      recipe_id: string;
      recipe_title: string;
      processed_at: string;
      status: string;
    };
  }> {
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

      const responseText = await response.text();
      console.log('📥 Webhook response received:', responseText);
      
      // Handle empty response
      if (!responseText.trim()) {
        console.log('⚠️ Empty response from webhook API');
        return {
          success: false,
          status: 'failed',
          message: 'Unable to process this video. The content may be private, unavailable, or not supported for recipe extraction.'
        };
      }
      
      const responseData = JSON.parse(responseText);

      // Try to parse as array format first, then object format
      let result;
      try {
        const arrayResponse = webhookArrayResponseSchema.parse(responseData);
        if (arrayResponse.length === 0) {
          throw new Error('No processing result received');
        }
        result = arrayResponse[0];
        console.log(`✅ Webhook processing completed (array format): ${result.status} - ${result.title}`);
        
        return {
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
      } catch {
        // Try object format
        const objectResponse = webhookObjectResponseSchema.parse(responseData);
        console.log(`✅ Webhook processing completed (object format): ${objectResponse.status} - ${objectResponse.recipe_title}`);
        
        return {
          success: objectResponse.success && objectResponse.status === 'completed',
          status: objectResponse.status,
          message: objectResponse.recipe_title,
          data: objectResponse.success && objectResponse.status === 'completed' ? {
            recipe_id: objectResponse.recipe_id,
            recipe_title: objectResponse.recipe_title,
            processed_at: new Date().toISOString(),
            status: objectResponse.status
          } : undefined
        };
      }

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