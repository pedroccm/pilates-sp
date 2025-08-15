# 📋 Novos Campos da Tabela Studios

## 🆕 Campos Adicionados

### **1. Gympass**
- **`gympass`** (boolean): Se o studio aceita Gympass
- **`gympass_planos`** (text): Planos aceitos (ex: "Bronze, Prata, Ouro")

```sql
-- Exemplos
UPDATE studios SET gympass = true, gympass_planos = 'Bronze, Prata, Ouro' WHERE id = 1;
UPDATE studios SET gympass = true, gympass_planos = 'Prata, Ouro, Black' WHERE id = 2;
```

### **2. TotalPass**
- **`totalpass`** (boolean): Se o studio aceita TotalPass  
- **`totalpass_planos`** (text): Planos aceitos

```sql
-- Exemplos
UPDATE studios SET totalpass = true, totalpass_planos = 'Smart, Plus, Premium' WHERE id = 1;
```

### **3. Sistema de Destaque**
- **`destaque`** (integer): Ordem de destaque manual
  - `0` = Não destacado (padrão)
  - `1` = Primeiro destaque
  - `2` = Segundo destaque  
  - `3` = Terceiro destaque
  - etc.

```sql
-- Exemplos - definir destaques manualmente
UPDATE studios SET destaque = 1 WHERE id = 123; -- Primeiro destaque
UPDATE studios SET destaque = 2 WHERE id = 456; -- Segundo destaque
UPDATE studios SET destaque = 0 WHERE id = 789; -- Remover destaque
```

### **4. Slug da Imagem**
- **`imagem_slug`** (text): Nome formatado da imagem (gerado automaticamente)
- Formato: `pilates-{bairro}-{cidade}-{nome}`
- Usado para gerar URLs de imagem dinamicamente

```sql
-- Exemplos gerados automaticamente
-- pilates-vila-olimpia-sp-core-studio
-- pilates-ipanema-rj-moves-pilates  
-- pilates-centro-sp-space-pilates
```

### **5. Instagram**
- **`instagram`** (text): Handle do Instagram (sem @)

```sql
-- Exemplos
UPDATE studios SET instagram = 'corestudio_oficial' WHERE id = 1;
UPDATE studios SET instagram = 'movespilates' WHERE id = 2;
```

### **6. Cliente da Plataforma**
- **`cliente`** (boolean): Se é cliente da plataforma
- Usado para diferenciação de tratamento/exibição

```sql
-- Exemplos
UPDATE studios SET cliente = true WHERE id = 1;  -- É cliente
UPDATE studios SET cliente = false WHERE id = 2; -- Não é cliente
```

## 🔧 Scripts de Configuração

### **1. Criar campos**
```bash
# Execute no Supabase SQL Editor
psql -f add-new-studio-fields.sql
```

### **2. Popular imagem_slug automaticamente**
```bash
# Gera slugs para todos os studios existentes
psql -f update-imagem-slug.sql
```

### **3. Configurar políticas de segurança**
```bash
# Configura RLS para os novos campos
psql -f studio-fields-rls-policies.sql
```

## 💡 Casos de Uso

### **Filtros por Convênios**
```typescript
// Buscar studios que aceitam Gympass
const studiosGympass = await supabase
  .from('studios')
  .select('*')
  .eq('gympass', true);

// Buscar studios que aceitam TotalPass
const studiosTotalpass = await supabase
  .from('studios')
  .select('*')
  .eq('totalpass', true);
```

### **Ordenação por Destaque**
```typescript
// Buscar studios ordenados por destaque
const studiosDestaque = await supabase
  .from('studios')
  .select('*')
  .order('destaque', { ascending: true })
  .order('totalScore', { ascending: false });
```

### **Clientes da Plataforma**
```typescript
// Buscar apenas clientes
const clientesStudios = await supabase
  .from('studios')
  .select('*')
  .eq('cliente', true);
```

### **URLs de Imagem Dinâmicas**
```typescript
import { getStudioImageUrl } from '@/lib/image-utils';

// Usar o studio object para gerar URL
const imageUrl = getStudioImageUrl(studio, 'medium');
// Resultado: /uploads/studios/medium/pilates-vila-olimpia-sp-core-studio.webp
```

## 📊 Exemplos de Consultas

### **Studios em destaque com convênios**
```sql
SELECT 
    title,
    neighborhood,
    city_code,
    destaque,
    gympass,
    gympass_planos,
    totalpass,
    totalpass_planos,
    cliente
FROM studios 
WHERE destaque > 0
ORDER BY destaque ASC;
```

### **Estatísticas de convênios**
```sql
SELECT 
    COUNT(*) as total,
    COUNT(CASE WHEN gympass THEN 1 END) as com_gympass,
    COUNT(CASE WHEN totalpass THEN 1 END) as com_totalpass,
    COUNT(CASE WHEN cliente THEN 1 END) as clientes,
    COUNT(CASE WHEN destaque > 0 THEN 1 END) as em_destaque
FROM studios;
```

## 🎯 Próximos Passos

1. ✅ **Executar scripts SQL** no Supabase
2. ✅ **Verificar tipos TypeScript** atualizados
3. 🔄 **Atualizar componentes** para usar novos campos
4. 🔄 **Criar filtros** no frontend
5. 🔄 **Implementar sistema** de destaque
6. 🔄 **Adicionar badges** de convênios
7. 🔄 **Criar painel admin** para gerenciar campos