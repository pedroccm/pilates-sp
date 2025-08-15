-- Configurar políticas RLS para todas as tabelas do blog
-- Permite operações CRUD para usuários anônimos (admin público)

-- ===========================================
-- TABELA: blog_authors
-- ===========================================

-- Habilitar RLS na tabela
ALTER TABLE blog_authors ENABLE ROW LEVEL SECURITY;

-- Remover políticas existentes se houver
DROP POLICY IF EXISTS "Allow public read access to blog_authors" ON blog_authors;
DROP POLICY IF EXISTS "Allow public insert access to blog_authors" ON blog_authors;
DROP POLICY IF EXISTS "Allow public update access to blog_authors" ON blog_authors;
DROP POLICY IF EXISTS "Allow public delete access to blog_authors" ON blog_authors;

-- Política para SELECT (ler autores)
CREATE POLICY "Allow public read access to blog_authors" 
ON blog_authors FOR SELECT 
TO anon, authenticated 
USING (true);

-- Política para INSERT (criar autores)
CREATE POLICY "Allow public insert access to blog_authors" 
ON blog_authors FOR INSERT 
TO anon, authenticated 
WITH CHECK (true);

-- Política para UPDATE (editar autores)
CREATE POLICY "Allow public update access to blog_authors" 
ON blog_authors FOR UPDATE 
TO anon, authenticated 
USING (true)
WITH CHECK (true);

-- Política para DELETE (deletar autores)
CREATE POLICY "Allow public delete access to blog_authors" 
ON blog_authors FOR DELETE 
TO anon, authenticated 
USING (true);

-- ===========================================
-- TABELA: blog_categories
-- ===========================================

-- Habilitar RLS na tabela
ALTER TABLE blog_categories ENABLE ROW LEVEL SECURITY;

-- Remover políticas existentes se houver
DROP POLICY IF EXISTS "Allow public read access to blog_categories" ON blog_categories;
DROP POLICY IF EXISTS "Allow public insert access to blog_categories" ON blog_categories;
DROP POLICY IF EXISTS "Allow public update access to blog_categories" ON blog_categories;
DROP POLICY IF EXISTS "Allow public delete access to blog_categories" ON blog_categories;

-- Política para SELECT (ler categorias)
CREATE POLICY "Allow public read access to blog_categories" 
ON blog_categories FOR SELECT 
TO anon, authenticated 
USING (true);

-- Política para INSERT (criar categorias)
CREATE POLICY "Allow public insert access to blog_categories" 
ON blog_categories FOR INSERT 
TO anon, authenticated 
WITH CHECK (true);

-- Política para UPDATE (editar categorias)
CREATE POLICY "Allow public update access to blog_categories" 
ON blog_categories FOR UPDATE 
TO anon, authenticated 
USING (true)
WITH CHECK (true);

-- Política para DELETE (deletar categorias)
CREATE POLICY "Allow public delete access to blog_categories" 
ON blog_categories FOR DELETE 
TO anon, authenticated 
USING (true);

-- ===========================================
-- TABELA: blog_tags
-- ===========================================

-- Habilitar RLS na tabela
ALTER TABLE blog_tags ENABLE ROW LEVEL SECURITY;

-- Remover políticas existentes se houver
DROP POLICY IF EXISTS "Allow public read access to blog_tags" ON blog_tags;
DROP POLICY IF EXISTS "Allow public insert access to blog_tags" ON blog_tags;
DROP POLICY IF EXISTS "Allow public update access to blog_tags" ON blog_tags;
DROP POLICY IF EXISTS "Allow public delete access to blog_tags" ON blog_tags;

-- Política para SELECT (ler tags)
CREATE POLICY "Allow public read access to blog_tags" 
ON blog_tags FOR SELECT 
TO anon, authenticated 
USING (true);

-- Política para INSERT (criar tags)
CREATE POLICY "Allow public insert access to blog_tags" 
ON blog_tags FOR INSERT 
TO anon, authenticated 
WITH CHECK (true);

-- Política para UPDATE (editar tags)
CREATE POLICY "Allow public update access to blog_tags" 
ON blog_tags FOR UPDATE 
TO anon, authenticated 
USING (true)
WITH CHECK (true);

-- Política para DELETE (deletar tags)
CREATE POLICY "Allow public delete access to blog_tags" 
ON blog_tags FOR DELETE 
TO anon, authenticated 
USING (true);

-- ===========================================
-- TABELA: blog_posts
-- ===========================================

-- Habilitar RLS na tabela
ALTER TABLE blog_posts ENABLE ROW LEVEL SECURITY;

-- Remover políticas existentes se houver
DROP POLICY IF EXISTS "Allow public read access to blog_posts" ON blog_posts;
DROP POLICY IF EXISTS "Allow public insert access to blog_posts" ON blog_posts;
DROP POLICY IF EXISTS "Allow public update access to blog_posts" ON blog_posts;
DROP POLICY IF EXISTS "Allow public delete access to blog_posts" ON blog_posts;

-- Política para SELECT (ler posts)
CREATE POLICY "Allow public read access to blog_posts" 
ON blog_posts FOR SELECT 
TO anon, authenticated 
USING (true);

-- Política para INSERT (criar posts)
CREATE POLICY "Allow public insert access to blog_posts" 
ON blog_posts FOR INSERT 
TO anon, authenticated 
WITH CHECK (true);

-- Política para UPDATE (editar posts)
CREATE POLICY "Allow public update access to blog_posts" 
ON blog_posts FOR UPDATE 
TO anon, authenticated 
USING (true)
WITH CHECK (true);

-- Política para DELETE (deletar posts)
CREATE POLICY "Allow public delete access to blog_posts" 
ON blog_posts FOR DELETE 
TO anon, authenticated 
USING (true);

-- ===========================================
-- TABELA: blog_post_tags (relacionamento N:N)
-- ===========================================

-- Habilitar RLS na tabela
ALTER TABLE blog_post_tags ENABLE ROW LEVEL SECURITY;

-- Remover políticas existentes se houver
DROP POLICY IF EXISTS "Allow public read access to blog_post_tags" ON blog_post_tags;
DROP POLICY IF EXISTS "Allow public insert access to blog_post_tags" ON blog_post_tags;
DROP POLICY IF EXISTS "Allow public update access to blog_post_tags" ON blog_post_tags;
DROP POLICY IF EXISTS "Allow public delete access to blog_post_tags" ON blog_post_tags;

-- Política para SELECT (ler relacionamentos post-tag)
CREATE POLICY "Allow public read access to blog_post_tags" 
ON blog_post_tags FOR SELECT 
TO anon, authenticated 
USING (true);

-- Política para INSERT (criar relacionamentos post-tag)
CREATE POLICY "Allow public insert access to blog_post_tags" 
ON blog_post_tags FOR INSERT 
TO anon, authenticated 
WITH CHECK (true);

-- Política para UPDATE (editar relacionamentos post-tag)
CREATE POLICY "Allow public update access to blog_post_tags" 
ON blog_post_tags FOR UPDATE 
TO anon, authenticated 
USING (true)
WITH CHECK (true);

-- Política para DELETE (deletar relacionamentos post-tag)
CREATE POLICY "Allow public delete access to blog_post_tags" 
ON blog_post_tags FOR DELETE 
TO anon, authenticated 
USING (true);

-- ===========================================
-- VERIFICAÇÃO DAS POLÍTICAS CRIADAS
-- ===========================================

-- Verificar todas as políticas do blog
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual 
FROM pg_policies 
WHERE tablename LIKE 'blog_%'
ORDER BY tablename, policyname;

-- Status RLS das tabelas
SELECT schemaname, tablename, rowsecurity 
FROM pg_tables 
WHERE tablename LIKE 'blog_%'
ORDER BY tablename;