-- Adicionar novos campos na tabela studios
-- Execute este script no Supabase SQL Editor

ALTER TABLE studios 
ADD COLUMN IF NOT EXISTS gympass BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS gympass_planos TEXT,
ADD COLUMN IF NOT EXISTS totalpass BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS totalpass_planos TEXT,
ADD COLUMN IF NOT EXISTS destaque INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS imagem_slug TEXT,
ADD COLUMN IF NOT EXISTS instagram TEXT,
ADD COLUMN IF NOT EXISTS cliente BOOLEAN DEFAULT FALSE;

-- Comentários para documentar os campos
COMMENT ON COLUMN studios.gympass IS 'Se o studio aceita Gympass';
COMMENT ON COLUMN studios.gympass_planos IS 'Planos do Gympass que aceita (ex: "Bronze, Prata, Ouro")';
COMMENT ON COLUMN studios.totalpass IS 'Se o studio aceita TotalPass';
COMMENT ON COLUMN studios.totalpass_planos IS 'Planos do TotalPass que aceita';
COMMENT ON COLUMN studios.destaque IS 'Ordem de destaque (0=não destaque, 1=primeiro, 2=segundo, etc)';
COMMENT ON COLUMN studios.imagem_slug IS 'Nome formatado da imagem (gerado automaticamente)';
COMMENT ON COLUMN studios.instagram IS 'Handle do Instagram (sem @)';
COMMENT ON COLUMN studios.cliente IS 'Se é cliente da plataforma';

-- Criar índices para melhor performance
CREATE INDEX IF NOT EXISTS idx_studios_gympass ON studios(gympass) WHERE gympass = TRUE;
CREATE INDEX IF NOT EXISTS idx_studios_totalpass ON studios(totalpass) WHERE totalpass = TRUE;
CREATE INDEX IF NOT EXISTS idx_studios_destaque ON studios(destaque) WHERE destaque > 0;
CREATE INDEX IF NOT EXISTS idx_studios_cliente ON studios(cliente) WHERE cliente = TRUE;

-- Verificar se os campos foram criados
SELECT column_name, data_type, is_nullable, column_default 
FROM information_schema.columns 
WHERE table_name = 'studios' 
AND column_name IN ('gympass', 'gympass_planos', 'totalpass', 'totalpass_planos', 'destaque', 'imagem_slug', 'instagram', 'cliente')
ORDER BY column_name;