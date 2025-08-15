-- Políticas de Row Level Security (RLS) para os novos campos
-- Permite leitura pública mas restringe escrita

-- Verificar se RLS está habilitado na tabela studios
SELECT schemaname, tablename, rowsecurity 
FROM pg_tables 
WHERE tablename = 'studios';

-- Se RLS não estiver habilitado, descomente a linha abaixo:
-- ALTER TABLE studios ENABLE ROW LEVEL SECURITY;

-- Política para permitir leitura pública de todos os dados
DROP POLICY IF EXISTS "studios_select_policy" ON studios;
CREATE POLICY "studios_select_policy" 
ON studios FOR SELECT 
USING (true);

-- Política para permitir inserção apenas para usuários autenticados
DROP POLICY IF EXISTS "studios_insert_policy" ON studios;
CREATE POLICY "studios_insert_policy" 
ON studios FOR INSERT 
WITH CHECK (auth.role() = 'authenticated');

-- Política para permitir atualização apenas para usuários autenticados
DROP POLICY IF EXISTS "studios_update_policy" ON studios;
CREATE POLICY "studios_update_policy" 
ON studios FOR UPDATE 
USING (auth.role() = 'authenticated')
WITH CHECK (auth.role() = 'authenticated');

-- Política para permitir exclusão apenas para usuários autenticados
DROP POLICY IF EXISTS "studios_delete_policy" ON studios;
CREATE POLICY "studios_delete_policy" 
ON studios FOR DELETE 
USING (auth.role() = 'authenticated');

-- Verificar políticas criadas
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual, with_check
FROM pg_policies 
WHERE tablename = 'studios'
ORDER BY policyname;