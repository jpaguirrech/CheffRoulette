interface RecipeApiRequest {
  content_url: string;
  user_id: string;
  recipe_name?: string;
}

interface RecipeApiResponse {
  success: boolean;
  data?: {
    recipe_title: string;
    description: string;
    prep_time: number;
    cook_time: number;
    total_time: number;
    servings: number;
    difficulty_level: string;
    cuisine_type: string;
    meal_type: string;
    ai_confidence_score: number;
    processed_at: string;
  };
  error?: string;
}

class ExternalAPIService {
  private readonly API_BASE_URL = 'https://flw.panteragpt.com/webhook/social-media-recipe';
  private readonly SUPPORTED_PLATFORMS = ['tiktok', 'youtube', 'instagram', 'pinterest'];

  // Check if the URL platform is supported
  isPlatformSupported(url: string): boolean {
    const platform = this.extractPlatformFromUrl(url).toLowerCase();
    return this.SUPPORTED_PLATFORMS.includes(platform);
  }

  // Extract platform from URL
  extractPlatformFromUrl(url: string): string {
    const urlLower = url.toLowerCase();
    
    if (urlLower.includes('tiktok.com')) return 'tiktok';
    if (urlLower.includes('youtube.com') || urlLower.includes('youtu.be')) return 'youtube';
    if (urlLower.includes('instagram.com')) return 'instagram';
    if (urlLower.includes('pinterest.com')) return 'pinterest';
    
    return 'unknown';
  }

  // Process recipe using external API
  async processRecipe(request: RecipeApiRequest): Promise<RecipeApiResponse> {
    try {
      console.log(`Processing recipe from external API: ${request.content_url}`);
      
      const response = await fetch(this.API_BASE_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'User-Agent': 'Chef-Roulette/1.0'
        },
        body: JSON.stringify(request)
      });

      if (!response.ok) {
        throw new Error(`API request failed with status ${response.status}`);
      }

      const data = await response.json();
      
      // Validate API response structure
      if (!data.success) {
        return {
          success: false,
          error: data.error || 'API processing failed'
        };
      }

      // Ensure required fields are present
      const requiredFields = ['recipe_title', 'description', 'prep_time', 'cook_time', 'total_time', 'servings'];
      const missingFields = requiredFields.filter(field => !data.data || data.data[field] === undefined);
      
      if (missingFields.length > 0) {
        return {
          success: false,
          error: `Missing required fields: ${missingFields.join(', ')}`
        };
      }

      return {
        success: true,
        data: {
          recipe_title: data.data.recipe_title,
          description: data.data.description,
          prep_time: data.data.prep_time || 0,
          cook_time: data.data.cook_time || 0,
          total_time: data.data.total_time || 0,
          servings: data.data.servings || 1,
          difficulty_level: data.data.difficulty_level || 'medium',
          cuisine_type: data.data.cuisine_type || 'international',
          meal_type: data.data.meal_type || 'main',
          ai_confidence_score: data.data.ai_confidence_score || 0.5,
          processed_at: data.data.processed_at || new Date().toISOString()
        }
      };

    } catch (error) {
      console.error('External API service error:', error);
      
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown API error'
      };
    }
  }

  // Get user-friendly error messages
  getErrorMessage(error: string): string {
    const errorMessages: Record<string, string> = {
      'Unsupported platform': 'This social media platform is not supported yet. We currently support TikTok, YouTube, Instagram, and Pinterest.',
      'API processing failed': 'Unable to extract recipe from this content. Please try a different URL.',
      'Network error': 'Unable to connect to the recipe processing api. Please try again later.',
      'Invalid URL': 'Please provide a valid social media URL.'
    };

    return errorMessages[error] || 'An unexpected error occurred while processing your recipe.';
  }

  // Get platform-specific extraction hints
  getPlatformExtractionHints(platform: string): string[] {
    const hints: Record<string, string[]> = {
      'tiktok': [
        'Best results with cooking tutorials showing step-by-step preparation',
        'Ensure video has clear ingredient listings in caption or overlay text',
        'Works well with trending recipe videos with detailed instructions'
      ],
      'youtube': [
        'Optimal for cooking channels with detailed descriptions',
        'Works best with videos that have ingredient lists in description',
        'Most effective with step-by-step cooking tutorials'
      ],
      'instagram': [
        'Best results with recipe posts that include ingredient lists',
        'Works well with cooking reels showing preparation steps',
        'Ensure post captions include detailed recipe information'
      ],
      'pinterest': [
        'Effective with recipe pins that link to detailed blog posts',
        'Works best with pins containing complete ingredient lists',
        'Optimal for traditional recipe format pins'
      ]
    };

    return hints[platform.toLowerCase()] || ['General recipe extraction hints not available'];
  }
}

export const externalAPIService = new ExternalAPIService();