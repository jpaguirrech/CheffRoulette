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
const webhookResponseSchema = z.array(z.object({
  id: z.string().uuid(),
  status: z.string(),
  title: z.string(),
  processed_at: z.string()
}));

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

      const responseText = await response.text();
      console.log('📥 Webhook response received:', responseText);
      
      // Handle empty response
      if (!responseText.trim()) {
        console.log('⚠️ Empty response from webhook API');
        return {
          success: false,
          status: 'processing',
          message: 'Video is being processed. Please check back later.'
        };
      }
      
      const responseData = JSON.parse(responseText);

      // Validate response structure
      const validatedResponse = webhookResponseSchema.parse(responseData);
      
      if (validatedResponse.length === 0) {
        throw new Error('No processing result received');
      }
      
      const result = validatedResponse[0];
      console.log(`✅ Webhook processing completed: ${result.status} - ${result.title}`);
      
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