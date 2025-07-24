# Guía para Extraer Dump de Supabase

## Método 1: Usando pg_dump (Recomendado)

### Paso 1: Instalar PostgreSQL client tools
Si no tienes `pg_dump` instalado:

**En macOS:**
```bash
brew install postgresql
```

**En Ubuntu/Linux:**
```bash
sudo apt-get install postgresql-client
```

**En Windows:**
Descarga PostgreSQL desde https://www.postgresql.org/download/windows/

### Paso 2: Ejecutar pg_dump
Usa tu string de conexión de Supabase:

```bash
pg_dump "postgresql://postgres:TU_PASSWORD@db.ctbcdiedhsaqibcvcdmd.supabase.co:5432/postgres" \
  --schema-only \
  --no-owner \
  --no-privileges \
  --clean \
  --if-exists \
  > supabase-schema.sql
```

Para incluir también los datos:
```bash
pg_dump "postgresql://postgres:TU_PASSWORD@db.ctbcdiedhsaqibcvcdmd.supabase.co:5432/postgres" \
  --no-owner \
  --no-privileges \
  --clean \
  --if-exists \
  > supabase-full-dump.sql
```

### Paso 3: Dump solo de datos específicos
Si solo quieres las tablas relacionadas con Chef Roulette:

```bash
pg_dump "postgresql://postgres:TU_PASSWORD@db.ctbcdiedhsaqibcvcdmd.supabase.co:5432/postgres" \
  --no-owner \
  --no-privileges \
  --data-only \
  --table extracted_recipes \
  --table social_media_content \
  > chef-roulette-data.sql
```

## Método 2: Desde el Dashboard de Supabase

1. Ve a tu dashboard de Supabase: https://ctbcdiedhsaqibcvcdmd.supabase.co
2. Ve a Settings → Database
3. Busca la sección "Connection pooling" o "Database"
4. Usa las credenciales para conectarte con cualquier cliente PostgreSQL
5. Ejecuta queries para exportar los datos

## Método 3: Usando SQL Editor de Supabase

Ejecuta estas queries en el SQL Editor de Supabase para obtener los datos:

### Obtener el esquema de las tablas:
```sql
-- Obtener definición de la tabla extracted_recipes
SELECT 
  column_name,
  data_type,
  is_nullable,
  column_default
FROM information_schema.columns 
WHERE table_name = 'extracted_recipes'
ORDER BY ordinal_position;

-- Obtener definición de la tabla social_media_content
SELECT 
  column_name,
  data_type,
  is_nullable,
  column_default
FROM information_schema.columns 
WHERE table_name = 'social_media_content'
ORDER BY ordinal_position;
```

### Obtener los datos:
```sql
-- Exportar datos de extracted_recipes
COPY (SELECT * FROM extracted_recipes) TO STDOUT WITH CSV HEADER;

-- Exportar datos de social_media_content  
COPY (SELECT * FROM social_media_content) TO STDOUT WITH CSV HEADER;
```

## Información Importante

**Tu proyecto Supabase:** https://ctbcdiedhsaqibcvcdmd.supabase.co
**Database ID:** ctbcdiedhsaqibcvcdmd

**Credenciales que necesitas:**
- Host: db.ctbcdiedhsaqibcvcdmd.supabase.co
- Port: 5432
- Database: postgres
- User: postgres
- Password: [Tu password de Supabase]

## Próximos Pasos

1. Ejecuta uno de los métodos para obtener el dump
2. Comparte el archivo SQL resultante
3. Lo importaremos a la base de datos Neon que ya está configurada
4. Actualizaremos el código para usar Neon en lugar de Supabase