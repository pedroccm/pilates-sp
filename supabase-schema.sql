-- Create the studios table
CREATE TABLE public.studios (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title TEXT NOT NULL,
    total_score DECIMAL(3,2) NOT NULL DEFAULT 0,
    reviews_count INTEGER NOT NULL DEFAULT 0,
    street TEXT,
    postal_code TEXT,
    neighborhood TEXT NOT NULL,
    state TEXT,
    phone TEXT,
    category_name TEXT,
    url TEXT NOT NULL,
    image_url TEXT NOT NULL,
    website TEXT,
    opening_hours JSONB NOT NULL DEFAULT '[]'::jsonb,
    location JSONB NOT NULL, -- {lat: number, lng: number}
    address TEXT NOT NULL,
    city_code TEXT NOT NULL,
    slug TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Create indexes for better query performance
CREATE INDEX idx_studios_city_code ON public.studios (city_code);
CREATE INDEX idx_studios_neighborhood ON public.studios (neighborhood);
CREATE INDEX idx_studios_title ON public.studios USING gin(to_tsvector('portuguese', title));
CREATE INDEX idx_studios_total_score ON public.studios (total_score DESC);
CREATE INDEX idx_studios_slug ON public.studios (slug);

-- Create unique constraint on slug
ALTER TABLE public.studios ADD CONSTRAINT unique_slug UNIQUE (slug);

-- Enable RLS (Row Level Security) - optional, for future security
ALTER TABLE public.studios ENABLE ROW LEVEL SECURITY;

-- Create policy to allow read access to all users (since it's public data)
CREATE POLICY "Allow public read access" ON public.studios
    FOR SELECT USING (true);

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = TIMEZONE('utc'::text, NOW());
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger to auto-update updated_at
CREATE TRIGGER update_studios_updated_at
    BEFORE UPDATE ON public.studios
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Add some helpful functions for search
CREATE OR REPLACE FUNCTION search_studios(
    search_text TEXT DEFAULT '',
    city_filter TEXT DEFAULT '',
    neighborhood_filter TEXT[] DEFAULT '{}',
    min_rating DECIMAL DEFAULT 0,
    has_whatsapp BOOLEAN DEFAULT false,
    has_website BOOLEAN DEFAULT false,
    limit_count INTEGER DEFAULT 12,
    offset_count INTEGER DEFAULT 0
)
RETURNS TABLE (
    id UUID,
    title TEXT,
    total_score DECIMAL,
    reviews_count INTEGER,
    street TEXT,
    postal_code TEXT,
    neighborhood TEXT,
    state TEXT,
    phone TEXT,
    category_name TEXT,
    url TEXT,
    image_url TEXT,
    website TEXT,
    opening_hours JSONB,
    location JSONB,
    address TEXT,
    city_code TEXT,
    slug TEXT,
    total_count BIGINT
) AS $$
BEGIN
    RETURN QUERY
    WITH filtered_studios AS (
        SELECT s.*
        FROM public.studios s
        WHERE 
            (city_filter = '' OR s.city_code = city_filter)
            AND (search_text = '' OR 
                 s.title ILIKE '%' || search_text || '%' OR 
                 s.neighborhood ILIKE '%' || search_text || '%')
            AND (array_length(neighborhood_filter, 1) IS NULL OR 
                 s.neighborhood = ANY(neighborhood_filter))
            AND s.total_score >= min_rating
            AND (NOT has_whatsapp OR s.phone ~ '^(\+55\s?)?(\(?\d{2}\)?\s?)?\d{4,5}-?\d{4}$')
            AND (NOT has_website OR s.website IS NOT NULL AND s.website != '')
    ),
    counted_studios AS (
        SELECT *, COUNT(*) OVER() as total_count
        FROM filtered_studios
        ORDER BY total_score DESC, reviews_count DESC, title
        LIMIT limit_count OFFSET offset_count
    )
    SELECT 
        cs.id,
        cs.title,
        cs.total_score,
        cs.reviews_count,
        cs.street,
        cs.postal_code,
        cs.neighborhood,
        cs.state,
        cs.phone,
        cs.category_name,
        cs.url,
        cs.image_url,
        cs.website,
        cs.opening_hours,
        cs.location,
        cs.address,
        cs.city_code,
        cs.slug,
        cs.total_count
    FROM counted_studios cs;
END;
$$ LANGUAGE plpgsql;

-- Function to get city statistics for analytics
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
    GROUP BY s.city_code
    ORDER BY s.city_code;
END;
$$ LANGUAGE plpgsql;