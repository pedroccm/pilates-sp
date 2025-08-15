-- Script para popular o campo imagem_slug automaticamente
-- Gera slugs SEO-friendly baseados no título, bairro e cidade

-- Função para normalizar strings (remove acentos, converte para minúsculas, etc)
CREATE OR REPLACE FUNCTION normalize_string(input_text TEXT)
RETURNS TEXT
LANGUAGE plpgsql
AS $$
BEGIN
    IF input_text IS NULL OR input_text = '' THEN
        RETURN '';
    END IF;
    
    RETURN LOWER(
        REGEXP_REPLACE(
            REGEXP_REPLACE(
                UNACCENT(input_text),
                '[^a-zA-Z0-9\s\-]', '', 'g'
            ),
            '[\s\-]+', '-', 'g'
        )
    );
END;
$$;

-- Função para gerar slug da imagem
CREATE OR REPLACE FUNCTION generate_image_slug(
    studio_title TEXT,
    studio_neighborhood TEXT, 
    studio_city_code TEXT
)
RETURNS TEXT
LANGUAGE plpgsql
AS $$
DECLARE
    name_part TEXT;
    neighborhood_part TEXT;
    city_part TEXT;
    result TEXT;
BEGIN
    -- Normalizar cada parte
    name_part := normalize_string(COALESCE(studio_title, ''));
    neighborhood_part := normalize_string(COALESCE(studio_neighborhood, ''));
    city_part := normalize_string(COALESCE(studio_city_code, ''));
    
    -- Valores padrão se estiverem vazios
    IF name_part = '' THEN name_part := 'studio'; END IF;
    IF neighborhood_part = '' THEN neighborhood_part := 'centro'; END IF;
    IF city_part = '' THEN city_part := 'sp'; END IF;
    
    -- Montar o slug no formato: pilates-bairro-cidade-nome
    result := 'pilates-' || neighborhood_part || '-' || city_part || '-' || name_part;
    
    -- Limitar tamanho e limpar bordas
    result := SUBSTRING(result FROM 1 FOR 100);
    result := TRIM(BOTH '-' FROM result);
    
    RETURN result;
END;
$$;

-- Atualizar todos os registros com imagem_slug vazio
UPDATE studios 
SET imagem_slug = generate_image_slug(title, neighborhood, city_code)
WHERE imagem_slug IS NULL OR imagem_slug = '';

-- Verificar alguns resultados
SELECT 
    id,
    title,
    neighborhood,
    city_code,
    imagem_slug
FROM studios 
WHERE imagem_slug IS NOT NULL
ORDER BY id
LIMIT 10;

-- Estatísticas
SELECT 
    COUNT(*) as total_studios,
    COUNT(imagem_slug) as studios_com_slug,
    COUNT(*) - COUNT(imagem_slug) as studios_sem_slug
FROM studios;