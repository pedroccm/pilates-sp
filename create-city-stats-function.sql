-- Criar função para estatísticas de cidades
CREATE OR REPLACE FUNCTION get_city_stats()
RETURNS TABLE (
    city_code TEXT,
    total_studios BIGINT,
    avg_rating DECIMAL,
    total_reviews BIGINT
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        s.city_code,
        COUNT(*) as total_studios,
        ROUND(AVG(s.total_score), 1) as avg_rating,
        SUM(s.reviews_count) as total_reviews
    FROM public.studios s
    WHERE s.city_code IS NOT NULL 
    GROUP BY s.city_code
    ORDER BY total_studios DESC;
END;
$$ LANGUAGE plpgsql;