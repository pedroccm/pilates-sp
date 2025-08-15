-- Adicionar coluna content à tabela blog_posts
ALTER TABLE blog_posts ADD COLUMN IF NOT EXISTS content TEXT;