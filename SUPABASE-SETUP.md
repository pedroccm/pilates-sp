# 🚀 Migração para Supabase - Guia de Setup

## 📋 Pré-requisitos

1. Conta no [Supabase](https://supabase.com)
2. Node.js instalado
3. Dados JSON já estruturados

## 🛠️ Passo a Passo

### 1. Criar Projeto no Supabase

1. Acesse [supabase.com](https://supabase.com)
2. Clique em "Start your project" 
3. Crie uma nova organização (se necessário)
4. Clique em "New project"
5. Preencha:
   - **Name**: `pilates-sp` (ou nome de sua escolha)
   - **Database Password**: Use uma senha forte
   - **Region**: `South America (São Paulo)` (recomendado para Brasil)
6. Clique em "Create new project"

⏱️ **Aguarde 2-3 minutos** para o projeto ser criado.

### 2. Configurar Variáveis de Ambiente

1. No painel do Supabase, vá em **Settings > API**
2. Copie as seguintes informações:
   - **Project URL**
   - **anon/public key** 
   - **service_role key** (clique em "Reveal" para ver)

3. Crie o arquivo `.env.local` na raiz do projeto:
```bash
# .env.local
NEXT_PUBLIC_SUPABASE_URL=sua-url-do-projeto
NEXT_PUBLIC_SUPABASE_ANON_KEY=sua-chave-anon
SUPABASE_SERVICE_ROLE_KEY=sua-chave-service-role
```

### 3. Criar Schema do Banco

1. No Supabase, vá em **SQL Editor**
2. Clique em "New query"
3. Copie todo o conteúdo do arquivo `supabase-schema.sql`
4. Cole no editor e clique em "Run"

✅ Isso criará:
- Tabela `studios` com todos os campos necessários
- Índices para performance otimizada
- Função `search_studios` para buscas complexas
- Policies de segurança (RLS)

### 4. Migrar os Dados

Execute o script de migração:

```bash
node scripts/migrate-to-supabase.js
```

📊 **O que acontece:**
- Lê todos os arquivos JSON de `src/data/`
- Gera slugs únicos para cada estúdio
- Insere os dados no Supabase em batches
- Mostra progresso e estatísticas

**Exemplo de saída:**
```
🚀 Iniciando migração dos dados para Supabase...
📁 Processando SP - pilates-sp.json...
   Encontrados 1247 estúdios
   ✅ Inserido batch 1/13 (100 registros)
   ✅ Inserido batch 2/13 (100 registros)
   ...
✅ SP concluída: 1247 estúdios inseridos
🎉 Migração concluída! Total de 3891 estúdios inseridos no Supabase.
```

### 5. Testar a Aplicação

```bash
npm run dev
```

🎯 **Funcionalidades que funcionam automaticamente:**
- ✅ Carregamento paginado (12 por vez)
- ✅ Busca por nome e bairro
- ✅ Filtros por bairro, avaliação, WhatsApp, website
- ✅ Três visualizações: cards, lista, mapa  
- ✅ Botão "Carregar mais" com progresso
- ✅ Performance otimizada (consultas SQL rápidas)

## 🔧 Troubleshooting

### Erro: "Failed to search studios"
- ✅ Verifique as variáveis de ambiente
- ✅ Confirme que o schema foi criado corretamente
- ✅ Verifique se há dados na tabela `studios`

### Erro: "Cannot access before initialization"
- ✅ Certifique-se de que o `.env.local` está configurado
- ✅ Reinicie o servidor de desenvolvimento

### Dados não aparecem
```sql
-- Execute no SQL Editor do Supabase para verificar:
SELECT count(*) FROM studios;
SELECT city_code, count(*) FROM studios GROUP BY city_code;
```

### Performance lenta
- ✅ Verifique se os índices foram criados (executar `supabase-schema.sql`)
- ✅ Confirme que está usando a região São Paulo no Supabase

## 📈 Benefícios Alcançados

| Antes (JSON) | Depois (Supabase) |
|-------------|------------------|
| 📁 4.8MB por página | 🚀 ~50KB por requisição |
| 🐌 Carrega tudo de uma vez | ⚡ Paginação nativa |
| 🔍 Filtros no cliente | 🎯 Filtros no servidor |
| 💾 Sem cache | 🏎️ Cache automático |
| ❌ Falha no Netlify | ✅ Funciona perfeitamente |

## 🚀 Próximos Passos (Opcional)

1. **Analytics**: Tracking de buscas mais populares
2. **Admin Panel**: Interface para adicionar/editar estúdios
3. **Reviews**: Sistema de avaliações dos usuários
4. **Favoritos**: Users podem salvar estúdios
5. **Real-time**: Updates automáticos quando dados mudam

---

**🎉 Parabéns!** Sua aplicação agora usa Supabase e tem performance otimizada! 

Se tiver problemas, verifique os logs do console do navegador e do terminal.