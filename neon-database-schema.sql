-- ====================================
-- CHEF ROULETTE - ESQUEMA COMPLETO DE BASE DE DATOS NEON
-- Base de datos PostgreSQL en Neon
-- ====================================

-- Información de conexión:
-- Host: ep-shy-tooth-a5crh72m.us-east-2.aws.neon.tech
-- Database: neondb
-- User: neondb_owner
-- Password: npg_pvubC3fAa2OL
-- SSL: required

-- ====================================
-- FUNCIONES AUXILIARES
-- ====================================

-- Función para actualizar timestamps automáticamente
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- ====================================
-- TABLA 1: SESSIONS (Requerida para Replit Auth)
-- ====================================
CREATE TABLE IF NOT EXISTS sessions (
    sid VARCHAR PRIMARY KEY,
    sess JSONB NOT NULL,
    expire TIMESTAMP NOT NULL
);

CREATE INDEX IF NOT EXISTS IDX_session_expire ON sessions(expire);

-- ====================================
-- TABLA 2: USERS (Requerida para Replit Auth + Chef Roulette)
-- ====================================
CREATE TABLE IF NOT EXISTS users (
    id VARCHAR PRIMARY KEY NOT NULL,
    email VARCHAR UNIQUE,
    first_name VARCHAR,
    last_name VARCHAR,
    profile_image_url VARCHAR,
    
    -- Campos adicionales de Chef Roulette
    username VARCHAR(50) UNIQUE,
    points INTEGER DEFAULT 0,
    streak INTEGER DEFAULT 0,
    recipes_cooked INTEGER DEFAULT 0,
    weekly_points INTEGER DEFAULT 0,
    is_pro BOOLEAN DEFAULT false,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- ====================================
-- TABLA 3: SOCIAL_MEDIA_CONTENT
-- ====================================
CREATE TABLE IF NOT EXISTS social_media_content (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    
    -- Identificadores únicos
    content_id VARCHAR UNIQUE,
    
    -- URLs y referencias de archivos
    original_url VARCHAR NOT NULL,
    file_name VARCHAR,
    public_url VARCHAR,
    bucket_name VARCHAR DEFAULT 'chef-roulette-media',
    
    -- Información de plataforma y tipo de contenido
    platform VARCHAR NOT NULL CHECK (platform IN ('tiktok', 'instagram', 'youtube', 'pinterest', 'facebook', 'twitter')),
    content_type VARCHAR NOT NULL CHECK (content_type IN ('video', 'image', 'reel', 'story', 'post')),
    
    -- Metadatos del contenido
    title TEXT,
    description TEXT,
    author VARCHAR,
    author_username VARCHAR,
    duration INTEGER, -- en segundos
    views INTEGER,
    likes INTEGER,
    shares INTEGER,
    comments INTEGER,
    hashtags JSONB,
    music VARCHAR,
    
    -- Datos de usuario y receta
    user_id VARCHAR, -- referencia a users.id
    recipe_name VARCHAR,
    
    -- Estado de procesamiento
    status VARCHAR DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'completed', 'error')),
    needs_ai_processing BOOLEAN DEFAULT true,
    error_message TEXT,
    
    -- Timestamps
    created_at TIMESTAMP DEFAULT NOW(),
    processing_started_at TIMESTAMP,
    processed_at TIMESTAMP,
    updated_at TIMESTAMP DEFAULT NOW()
);

-- ====================================
-- TABLA 4: EXTRACTED_RECIPES
-- ====================================
CREATE TABLE IF NOT EXISTS extracted_recipes (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    social_media_content_id UUID REFERENCES social_media_content(id) ON DELETE CASCADE,
    
    -- Datos principales de la receta extraídos por IA
    recipe_title VARCHAR NOT NULL,
    description TEXT,
    ingredients JSONB, -- Array de ingredientes con cantidades y unidades
    instructions JSONB, -- Array de instrucciones paso a paso
    prep_time INTEGER, -- tiempo de preparación en minutos
    cook_time INTEGER, -- tiempo de cocción en minutos
    total_time INTEGER, -- prep_time + cook_time
    servings INTEGER,
    difficulty_level VARCHAR CHECK (difficulty_level IN ('easy', 'medium', 'hard')),
    
    -- Categorización y etiquetado
    cuisine_type VARCHAR,
    meal_type VARCHAR CHECK (meal_type IN ('breakfast', 'lunch', 'dinner', 'snack', 'dessert')),
    dietary_tags JSONB, -- vegetariano, vegano, sin gluten, etc.
    chef_attribution VARCHAR, -- nombre del chef si se menciona en el contenido
    
    -- Metadatos de procesamiento de IA
    ai_confidence_score DECIMAL(3,2), -- 0.00 a 1.00
    extraction_method VARCHAR DEFAULT 'gemini_video_analysis',
    
    -- Estado de la receta y aprobación
    status VARCHAR DEFAULT 'draft' CHECK (status IN ('draft', 'reviewed', 'published')),
    is_approved BOOLEAN DEFAULT false,
    
    -- Timestamps
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- ====================================
-- TABLA 5: USER_PROFILES
-- ====================================
CREATE TABLE IF NOT EXISTS user_profiles (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id VARCHAR UNIQUE, -- referencia a users.id
    
    -- Información básica del perfil
    display_name VARCHAR,
    avatar_url VARCHAR,
    
    -- Sistema de gamificación
    points INTEGER DEFAULT 0,
    level INTEGER DEFAULT 1,
    recipes_count INTEGER DEFAULT 0,
    recipes_cooked INTEGER DEFAULT 0,
    favorite_cuisine VARCHAR,
    
    -- Preferencias del usuario
    dietary_preferences JSONB, -- restricciones/preferencias dietéticas del usuario
    cooking_skill_level VARCHAR DEFAULT 'beginner' CHECK (cooking_skill_level IN ('beginner', 'intermediate', 'advanced')),
    
    -- Timestamps
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- ====================================
-- TABLA 6: PROCESSING_JOBS
-- ====================================
CREATE TABLE IF NOT EXISTS processing_jobs (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    social_media_content_id UUID REFERENCES social_media_content(id),
    
    -- Información del trabajo
    job_type VARCHAR NOT NULL, -- 'platform_detection', 'ai_extraction', 'categorization'
    status VARCHAR DEFAULT 'pending' CHECK (status IN ('pending', 'running', 'completed', 'failed')),
    
    -- Detalles de ejecución
    started_at TIMESTAMP,
    completed_at TIMESTAMP,
    execution_time_ms INTEGER,
    error_details JSONB,
    result_data JSONB,
    
    -- Información del workflow N8N
    workflow_execution_id VARCHAR,
    node_name VARCHAR,
    
    created_at TIMESTAMP DEFAULT NOW()
);

-- ====================================
-- TABLA 7: RECIPE_COLLECTIONS
-- ====================================
CREATE TABLE IF NOT EXISTS recipe_collections (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id VARCHAR, -- referencia a users.id
    
    -- Detalles de la colección
    name VARCHAR NOT NULL,
    description TEXT,
    is_public BOOLEAN DEFAULT false,
    recipe_count INTEGER DEFAULT 0,
    
    -- Timestamps
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- ====================================
-- TABLA 8: COLLECTION_RECIPES (Tabla de unión)
-- ====================================
CREATE TABLE IF NOT EXISTS collection_recipes (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    collection_id UUID REFERENCES recipe_collections(id) ON DELETE CASCADE,
    recipe_id UUID REFERENCES extracted_recipes(id) ON DELETE CASCADE,
    
    -- Posición en la colección para ordenamiento
    position INTEGER DEFAULT 0,
    
    -- Timestamps
    added_at TIMESTAMP DEFAULT NOW(),
    
    -- Restricción única para prevenir duplicados
    UNIQUE(collection_id, recipe_id)
);

-- ====================================
-- TABLAS LEGACY (Compatibilidad hacia atrás)
-- ====================================

-- Tabla de recetas legacy
CREATE TABLE IF NOT EXISTS recipes (
    id SERIAL PRIMARY KEY,
    user_id VARCHAR NOT NULL,
    title TEXT NOT NULL,
    description TEXT,
    ingredients JSONB NOT NULL,
    instructions JSONB NOT NULL,
    prep_time INTEGER,
    cook_time INTEGER,
    servings INTEGER,
    difficulty TEXT CHECK (difficulty IN ('easy', 'medium', 'hard')),
    cuisine TEXT,
    tags JSONB,
    rating DECIMAL(3,2),
    source_url TEXT,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Tabla de acciones de usuario sobre recetas
CREATE TABLE IF NOT EXISTS user_recipe_actions (
    id SERIAL PRIMARY KEY,
    user_id VARCHAR NOT NULL,
    recipe_id INTEGER REFERENCES recipes(id),
    action_type VARCHAR NOT NULL CHECK (action_type IN ('like', 'bookmark', 'cook', 'rate')),
    rating INTEGER CHECK (rating >= 1 AND rating <= 5),
    created_at TIMESTAMP DEFAULT NOW(),
    UNIQUE(user_id, recipe_id, action_type)
);

-- Tabla de desafíos semanales
CREATE TABLE IF NOT EXISTS challenges (
    id SERIAL PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT,
    challenge_type VARCHAR NOT NULL,
    requirements JSONB,
    points INTEGER DEFAULT 0,
    start_date TIMESTAMP,
    end_date TIMESTAMP,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Tabla de progreso de desafíos de usuario
CREATE TABLE IF NOT EXISTS user_challenges (
    id SERIAL PRIMARY KEY,
    user_id VARCHAR NOT NULL,
    challenge_id INTEGER REFERENCES challenges(id),
    progress INTEGER DEFAULT 0,
    is_completed BOOLEAN DEFAULT false,
    completed_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT NOW()
);

-- ====================================
-- ÍNDICES DE RENDIMIENTO
-- ====================================

-- Índices para social_media_content
CREATE INDEX IF NOT EXISTS idx_social_content_user_id ON social_media_content(user_id);
CREATE INDEX IF NOT EXISTS idx_social_content_status ON social_media_content(status);
CREATE INDEX IF NOT EXISTS idx_social_content_platform ON social_media_content(platform);
CREATE INDEX IF NOT EXISTS idx_social_content_content_type ON social_media_content(content_type);
CREATE INDEX IF NOT EXISTS idx_social_content_created_at ON social_media_content(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_social_content_url ON social_media_content(original_url);

-- Índices para extracted_recipes
CREATE INDEX IF NOT EXISTS idx_recipes_content_id ON extracted_recipes(social_media_content_id);
CREATE INDEX IF NOT EXISTS idx_recipes_ingredients_gin ON extracted_recipes USING gin(ingredients);
CREATE INDEX IF NOT EXISTS idx_recipes_dietary_tags_gin ON extracted_recipes USING gin(dietary_tags);
CREATE INDEX IF NOT EXISTS idx_recipes_filters ON extracted_recipes(prep_time, difficulty_level, meal_type);
CREATE INDEX IF NOT EXISTS idx_recipes_cuisine ON extracted_recipes(cuisine_type);
CREATE INDEX IF NOT EXISTS idx_recipes_chef ON extracted_recipes(chef_attribution);

-- Índices para user_profiles
CREATE INDEX IF NOT EXISTS idx_user_profiles_user_id ON user_profiles(user_id);
CREATE INDEX IF NOT EXISTS idx_user_profiles_points ON user_profiles(points DESC);
CREATE INDEX IF NOT EXISTS idx_user_profiles_level ON user_profiles(level DESC);

-- Índices para processing_jobs
CREATE INDEX IF NOT EXISTS idx_processing_jobs_content_id ON processing_jobs(social_media_content_id);
CREATE INDEX IF NOT EXISTS idx_processing_jobs_status ON processing_jobs(status);
CREATE INDEX IF NOT EXISTS idx_processing_jobs_created_at ON processing_jobs(created_at DESC);

-- Índices para recipes legacy
CREATE INDEX IF NOT EXISTS idx_recipes_user_id ON recipes(user_id);
CREATE INDEX IF NOT EXISTS idx_recipes_created_at ON recipes(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_recipes_cuisine ON recipes(cuisine);
CREATE INDEX IF NOT EXISTS idx_recipes_difficulty ON recipes(difficulty);

-- ====================================
-- TRIGGERS PARA ACTUALIZACIÓN AUTOMÁTICA
-- ====================================

-- Aplicar triggers a las tablas principales
CREATE TRIGGER IF NOT EXISTS update_social_media_content_updated_at 
    BEFORE UPDATE ON social_media_content 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER IF NOT EXISTS update_extracted_recipes_updated_at 
    BEFORE UPDATE ON extracted_recipes 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER IF NOT EXISTS update_user_profiles_updated_at 
    BEFORE UPDATE ON user_profiles 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER IF NOT EXISTS update_recipe_collections_updated_at 
    BEFORE UPDATE ON recipe_collections 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER IF NOT EXISTS update_users_updated_at 
    BEFORE UPDATE ON users 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ====================================
-- DATOS DE EJEMPLO
-- ====================================

-- Insertar la receta del kimchi como ejemplo
INSERT INTO social_media_content (
    id,
    original_url,
    platform,
    content_type,
    title,
    description,
    author,
    user_id,
    status,
    needs_ai_processing,
    created_at,
    processed_at
) VALUES (
    'f345d082-447a-4cee-b9b4-edc7d4113546',
    'https://example.com/cucumber-kimchi-video',
    'youtube',
    'video',
    'Easy and Crunchy Cucumber Kimchi Recipe',
    'Quick and delicious Korean cucumber kimchi tutorial',
    'Korean Chef Master',
    'demo-user-001',
    'completed',
    false,
    NOW() - INTERVAL '2 days',
    NOW() - INTERVAL '1 day'
) ON CONFLICT (id) DO NOTHING;

-- Insertar la receta extraída del kimchi
INSERT INTO extracted_recipes (
    id,
    social_media_content_id,
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
    extraction_method,
    status,
    is_approved,
    created_at
) VALUES (
    'f345d082-447a-4cee-b9b4-edc7d4113546',
    'f345d082-447a-4cee-b9b4-edc7d4113546',
    'Easy and Crunchy Cucumber Kimchi',
    'Una versión rápida y crujiente del kimchi tradicional coreano usando pepinos frescos. Perfecto como acompañamiento o aperitivo saludable.',
    '[
        "2 pepinos grandes (cortados en rodajas finas)",
        "2 cucharadas de sal marina",
        "1 cucharada de azúcar blanca",
        "2 cucharadas de vinagre de arroz",
        "1 cucharada de aceite de sésamo tostado",
        "2 dientes de ajo finamente picados",
        "1 cucharadita de jengibre fresco rallado",
        "2 cucharadas de gochugaru (chile coreano en copos)",
        "2 cebolletas verdes picadas en diagonal",
        "1 cucharadita de semillas de sésamo tostadas"
    ]'::jsonb,
    '[
        "Cortar los pepinos en rodajas finas de aproximadamente 3mm de grosor",
        "Colocar las rodajas de pepino en un bol grande y espolvorear con sal marina",
        "Mezclar bien y dejar reposar durante 30 minutos para que suelten agua",
        "Mientras tanto, preparar la salsa mezclando azúcar, vinagre de arroz, aceite de sésamo, ajo picado y jengibre rallado",
        "Añadir el gochugaru a la mezcla de condimentos y revolver bien",
        "Después de 30 minutos, enjuagar los pepinos con agua fría y escurrir completamente",
        "Exprimir suavemente los pepinos con las manos para eliminar el exceso de agua",
        "Combinar los pepinos escurridos con la mezcla de condimentos",
        "Añadir las cebolletas picadas y mezclar delicadamente",
        "Espolvorear con semillas de sésamo tostadas",
        "Refrigerar durante al menos 1 hora antes de servir para que se desarrollen los sabores"
    ]'::jsonb,
    15,
    0,
    75,
    4,
    'easy',
    'Coreana',
    'snack',
    '["Vegetariano", "Vegano", "Sin Gluten", "Bajo en Calorías", "Fermentado"]'::jsonb,
    'Korean Chef Master',
    0.95,
    'gemini_video_analysis',
    'published',
    true,
    NOW() - INTERVAL '1 day'
) ON CONFLICT (id) DO NOTHING;

-- ====================================
-- COMENTARIOS FINALES
-- ====================================

-- Esta base de datos está configurada para:
-- 1. Autenticación de Replit (tablas sessions y users)
-- 2. Gestión de contenido de redes sociales (social_media_content)
-- 3. Extracción de recetas con IA (extracted_recipes)
-- 4. Gamificación y perfiles de usuario (user_profiles)
-- 5. Procesamiento de trabajos (processing_jobs)
-- 6. Colecciones de recetas (recipe_collections, collection_recipes)
-- 7. Compatibilidad con sistema legacy (recipes, challenges, etc.)

-- Conexión desde aplicaciones externas:
-- postgresql://neondb_owner:npg_pvubC3fAa2OL@ep-shy-tooth-a5crh72m.us-east-2.aws.neon.tech/neondb?sslmode=require