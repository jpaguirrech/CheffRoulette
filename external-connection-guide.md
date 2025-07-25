# External Connection Guide for Neon PostgreSQL

## Connection Details

Use these credentials to connect to your Neon PostgreSQL database from external functions:

### Full Connection String
```
DATABASE_URL=postgresql://neondb_owner:ACTUAL_PASSWORD@ep-shy-tooth-a5crh72m.us-east-2.aws.neon.tech/neondb?sslmode=require
```

### Individual Components
- **Host**: `ep-shy-tooth-a5crh72m.us-east-2.aws.neon.tech`
- **Port**: `5432`
- **Database**: `neondb`
- **User**: `neondb_owner`
- **Password**: [Use the actual password from DATABASE_URL]
- **SSL Mode**: `require`

## Database Schema for Video Processing

### Table: `social_media_content`
Insert video metadata here first:

```sql
INSERT INTO social_media_content (
  id,
  original_url,
  platform,
  content_type,
  title,
  description,
  author,
  author_username,
  duration,
  views,
  likes,
  user_id,
  status,
  created_at,
  processed_at
) VALUES (
  gen_random_uuid(),
  'https://video-url.com',
  'youtube', -- or 'tiktok', 'instagram', etc.
  'video',
  'Video Title',
  'Video Description',
  'Chef Name',
  '@chefusername',
  180, -- duration in seconds
  1000, -- view count
  50, -- like count
  'user-123',
  'completed',
  NOW(),
  NOW()
) RETURNING id;
```

### Table: `extracted_recipes`
Insert processed recipe data here:

```sql
INSERT INTO extracted_recipes (
  id,
  social_media_content_id, -- from previous insert
  recipe_title,
  description,
  ingredients,
  instructions,
  prep_time,
  cook_time,
  total_time,
  servings,
  difficulty_level,
  cuisine_type,
  meal_type,
  dietary_tags,
  chef_attribution,
  ai_confidence_score,
  status,
  created_at
) VALUES (
  gen_random_uuid(),
  'content_id_from_previous_insert',
  'Recipe Title',
  'Recipe description',
  '["ingredient 1", "ingredient 2", "ingredient 3"]'::jsonb,
  '["step 1", "step 2", "step 3"]'::jsonb,
  15, -- prep time in minutes
  30, -- cook time in minutes
  45, -- total time in minutes
  4, -- servings
  'easy', -- 'easy', 'medium', 'hard'
  'Italian',
  'dinner', -- 'breakfast', 'lunch', 'dinner', 'snack', 'dessert'
  '["Vegetarian", "Gluten-Free"]'::jsonb,
  'Chef Name',
  0.95, -- confidence score 0.00-1.00
  'published',
  NOW()
);
```

## Example Code Integration

### Node.js/JavaScript
```javascript
import postgres from 'postgres';

const sql = postgres('postgresql://neondb_owner:PASSWORD@ep-shy-tooth-a5crh72m.us-east-2.aws.neon.tech/neondb?sslmode=require');

async function insertProcessedVideo(videoData, recipeData) {
  try {
    // Insert social media content first
    const [content] = await sql`
      INSERT INTO social_media_content (
        original_url, platform, content_type, title, description,
        author, duration, user_id, status, processed_at
      ) VALUES (
        ${videoData.url}, ${videoData.platform}, 'video', 
        ${videoData.title}, ${videoData.description},
        ${videoData.author}, ${videoData.duration}, 
        ${videoData.userId}, 'completed', NOW()
      ) RETURNING id
    `;
    
    // Insert extracted recipe
    await sql`
      INSERT INTO extracted_recipes (
        social_media_content_id, recipe_title, description,
        ingredients, instructions, prep_time, cook_time,
        total_time, servings, difficulty_level, cuisine_type,
        meal_type, dietary_tags, chef_attribution, ai_confidence_score
      ) VALUES (
        ${content.id}, ${recipeData.title}, ${recipeData.description},
        ${JSON.stringify(recipeData.ingredients)}, ${JSON.stringify(recipeData.instructions)},
        ${recipeData.prepTime}, ${recipeData.cookTime}, ${recipeData.totalTime},
        ${recipeData.servings}, ${recipeData.difficulty}, ${recipeData.cuisine},
        ${recipeData.mealType}, ${JSON.stringify(recipeData.dietaryTags)},
        ${recipeData.chef}, ${recipeData.confidence}
      )
    `;
    
    console.log('Recipe inserted successfully');
    return content.id;
  } catch (error) {
    console.error('Database error:', error);
    throw error;
  }
}
```

### Python
```python
import psycopg2
import json
from datetime import datetime

conn = psycopg2.connect(
    host="ep-shy-tooth-a5crh72m.us-east-2.aws.neon.tech",
    port="5432",
    database="neondb",
    user="neondb_owner",
    password="YOUR_PASSWORD",
    sslmode="require"
)

def insert_processed_video(video_data, recipe_data):
    cur = conn.cursor()
    try:
        # Insert social media content
        cur.execute("""
            INSERT INTO social_media_content (
                original_url, platform, content_type, title, description,
                author, duration, user_id, status, processed_at
            ) VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
            RETURNING id
        """, (
            video_data['url'], video_data['platform'], 'video',
            video_data['title'], video_data['description'],
            video_data['author'], video_data['duration'],
            video_data['user_id'], 'completed', datetime.now()
        ))
        
        content_id = cur.fetchone()[0]
        
        # Insert recipe
        cur.execute("""
            INSERT INTO extracted_recipes (
                social_media_content_id, recipe_title, description,
                ingredients, instructions, prep_time, cook_time,
                total_time, servings, difficulty_level, cuisine_type,
                meal_type, dietary_tags, chef_attribution, ai_confidence_score
            ) VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
        """, (
            content_id, recipe_data['title'], recipe_data['description'],
            json.dumps(recipe_data['ingredients']), json.dumps(recipe_data['instructions']),
            recipe_data['prep_time'], recipe_data['cook_time'], recipe_data['total_time'],
            recipe_data['servings'], recipe_data['difficulty'], recipe_data['cuisine'],
            recipe_data['meal_type'], json.dumps(recipe_data['dietary_tags']),
            recipe_data['chef'], recipe_data['confidence']
        ))
        
        conn.commit()
        return content_id
        
    except Exception as e:
        conn.rollback()
        raise e
    finally:
        cur.close()
```

## Important Notes

1. **SSL Required**: Always use `sslmode=require` for secure connections
2. **JSONB Format**: Ingredients, instructions, and dietary_tags must be valid JSON arrays
3. **UUID Generation**: Use `gen_random_uuid()` for generating IDs
4. **Foreign Keys**: Always insert `social_media_content` first, then use its ID for `extracted_recipes`
5. **Timestamps**: Use `NOW()` for current timestamp or provide ISO format strings

## Testing Connection

You can test the connection with:

```bash
psql "postgresql://neondb_owner:PASSWORD@ep-shy-tooth-a5crh72m.us-east-2.aws.neon.tech/neondb?sslmode=require" -c "SELECT current_database(), current_user;"
```