# PRD - Plataforma de Localização de Estúdios de Pilates

## 1. Visão Geral do Produto

### 1.1 Visão
Ser a principal plataforma digital para descoberta e conexão entre praticantes de pilates e estúdios de qualidade no Brasil, facilitando a escolha informada através de dados confiáveis e experiência de usuário otimizada.

### 1.2 Missão
Conectar pessoas que buscam bem-estar através do pilates com os melhores estúdios em suas cidades, oferecendo informações precisas, avaliações confiáveis e facilidade de contato.

### 1.3 Declaração do Problema
- **Dificuldade na descoberta**: Usuários têm dificuldade para encontrar estúdios de pilates qualificados em sua região
- **Informações dispersas**: Dados sobre estúdios estão espalhados em múltiplas plataformas (Google Maps, redes sociais, sites próprios)
- **Falta de comparação**: Ausência de uma plataforma centralizada para comparar preços, avaliações e serviços
- **Processo de contato ineficiente**: Dificuldade para entrar em contato direto com os estúdios

### 1.4 Proposta de Valor
- **Centralização de informações**: Todos os dados relevantes em um só lugar
- **Busca inteligente**: Filtros avançados por localização, avaliação, serviços oferecidos
- **Contato direto**: Integração com WhatsApp e telefone para comunicação imediata
- **Experiência visual**: Mapas interativos e visualizações múltiplas
- **Dados confiáveis**: Informações atualizadas e verificadas

## 2. Análise de Mercado

### 2.1 Mercado Alvo
**Mercado Primário:**
- Mulheres de 25-45 anos, classe B e C+
- Residentes de grandes centros urbanos (SP, RJ, BH, BSB, Curitiba)
- Interessadas em atividade física e bem-estar
- Usuárias ativas de smartphones e redes sociais

**Mercado Secundário:**
- Homens interessados em pilates
- Pessoas em reabilitação física
- Profissionais da área da saúde buscando parceiros

### 2.2 Tamanho do Mercado
- **São Paulo**: 1.247 estúdios cadastrados
- **Total nas 5 cidades**: ~3.891 estúdios
- **Mercado estimado**: 15+ milhões de potenciais usuários nas regiões atendidas

### 2.3 Concorrência
- **Diretos**: Google Maps, ClassPass, Gympass
- **Indiretos**: Instagram, Facebook, Sites próprios dos estúdios
- **Diferenciais competitivos**: Especialização em pilates, interface otimizada, dados estruturados

## 3. Personas

### 3.1 Persona Primária - "Ana, a Profissional Ocupada"
- **Demografia**: 32 anos, publicitária, renda R$ 8.000-12.000
- **Comportamento**: Busca conveniência, valoriza tempo, usa muito o celular
- **Necessidades**: Estúdio próximo ao trabalho ou casa, horários flexíveis, boa avaliação
- **Dores**: Falta de tempo para pesquisar, medo de escolher um lugar inadequado
- **Objetivos**: Encontrar rapidamente um estúdio confiável e conveniente

### 3.2 Persona Secundária - "Maria, a Mãe em Recuperação"
- **Demografia**: 38 anos, mãe de 2 filhos, dona de casa/meio período
- **Comportamento**: Pesquisa muito antes de decidir, valoriza recomendações
- **Necessidades**: Profissionais qualificados, ambiente acolhedor, preço justo
- **Dores**: Insegurança sobre qualidade, dificuldade de locomoção
- **Objetivos**: Recuperar a forma física com segurança e profissionalismo

## 4. Funcionalidades

### 4.1 Funcionalidades Atuais (MVP)

#### 4.1.1 Descoberta e Busca
- **Busca por texto**: Nome do estúdio, bairro
- **Filtros avançados**:
  - Por bairro (multi-seleção)
  - Por avaliação (3+, 4+, 4.5+ estrelas)
  - Apenas com WhatsApp
  - Apenas com website próprio
- **Visualizações múltiplas**: Cards, lista, mapa
- **Paginação inteligente**: Carregamento sob demanda (12 por página)

#### 4.1.2 Informações dos Estúdios
- **Dados básicos**: Nome, endereço, bairro, telefone
- **Avaliações**: Nota (0-5) e número de reviews
- **Contato**: Website, Instagram, telefone
- **Localização**: Coordenadas GPS precisas
- **Horários de funcionamento**: Dias e horários detalhados

#### 4.1.3 Interação e Contato
- **Botão WhatsApp**: Link direto com mensagem pré-formatada
- **Botão Telefone**: Discagem direta no mobile
- **Link Google Maps**: Redirecionamento para navegação
- **Website próprio**: Acesso aos sites dos estúdios

#### 4.1.4 Cobertura Geográfica
- **São Paulo** (SP): 1.247 estúdios
- **Rio de Janeiro** (RJ): Cobertura completa
- **Belo Horizonte** (BH): Cobertura completa
- **Brasília** (BSB): Cobertura completa
- **Curitiba** (CWB): Cobertura completa

### 4.2 Funcionalidades de Analytics e Dados
- **Dashboard interno**: Métricas de uso e performance
- **Estatísticas por cidade**: Total de estúdios, avaliação média, reviews
- **Análise por bairro**: Distribuição geográfica
- **Categorização**: Estúdios com website, Instagram, WhatsApp

## 5. Especificações Técnicas

### 5.1 Arquitetura Atual
- **Frontend**: Next.js 15 + React 19 + TypeScript
- **Styling**: Tailwind CSS 4
- **Database**: Supabase (PostgreSQL)
- **Maps**: Google Maps JavaScript API
- **Deployment**: Netlify (otimizado para performance)

### 5.2 Performance
- **Carregamento inicial**: ~50KB por página (vs 4.8MB anterior)
- **Paginação**: Consultas otimizadas com índices
- **Cache**: Automático via Supabase
- **SEO**: SSG para páginas estáticas, SSR para busca

### 5.3 Responsividade
- **Mobile-first**: Interface otimizada para smartphones
- **Breakpoints**: Tailwind CSS responsive design
- **Touch-friendly**: Botões e áreas de toque adequadas

## 6. Experiência do Usuário (UX)

### 6.1 Jornada do Usuário Principal

```
1. Landing na homepage → 
2. Visualiza estúdios em cards → 
3. Aplica filtros (bairro, avaliação) → 
4. Muda para visualização de mapa → 
5. Clica em estúdio de interesse → 
6. Visualiza detalhes completos → 
7. Clica em WhatsApp → 
8. Abre conversa no WhatsApp
```

### 6.2 Principais Fluxos de Uso

#### Fluxo 1: Busca por Proximidade
- Usuário seleciona bairro específico
- Sistema filtra resultados em tempo real
- Visualização no mapa mostra distribuição geográfica
- Contato direto via WhatsApp

#### Fluxo 2: Busca por Qualidade
- Usuário define avaliação mínima (4+ estrelas)
- Sistema ordena por melhor avaliação
- Usuário compara opções em visualização lista
- Acesso ao website para mais informações

#### Fluxo 3: Descoberta Exploratória
- Usuário navega sem filtros específicos
- Utiliza visualização em cards para overview
- Carrega mais resultados conforme interesse
- Descobre estúdios por imagem e descrição

### 6.3 Interface e Design

#### 6.3.1 Princípios de Design
- **Simplicidade**: Interface limpa e intuitiva
- **Performance**: Carregamento rápido e responsivo  
- **Acessibilidade**: Contraste adequado, textos legíveis
- **Mobilidade**: Design mobile-first

#### 6.3.2 Componentes Principais
- **CitySelector**: Seleção entre cidades disponíveis
- **GoogleMap**: Mapa interativo com marcadores
- **MultiSelectNeighborhoods**: Filtro de bairros com multi-seleção
- **WhatsAppButton**: Botão de contato direto
- **PhoneButton**: Botão de ligação direta

## 7. Métricas e KPIs

### 7.1 Métricas de Produto
- **Usuários únicos mensais**: Meta inicial 50k
- **Sessões por usuário**: Meta 2.5
- **Taxa de conversão (contato)**: Meta 15%
- **Tempo na página**: Meta 3 minutos
- **Taxa de rejeição**: Meta <60%

### 7.2 Métricas de Negócio
- **Cliques em WhatsApp**: Principal indicador de valor
- **Cliques em website**: Engajamento com estúdios
- **Uso de filtros**: Qualidade da busca
- **Visualização de mapas**: Interesse geográfico
- **Carregamento de mais resultados**: Exploração do catálogo

### 7.3 Métricas Técnicas
- **Page Speed Score**: >90
- **Core Web Vitals**: Todos em "Good"
- **Uptime**: >99.9%
- **Error Rate**: <0.1%

## 8. Roadmap de Produto

### 8.1 Fase Atual - Foundation (Q1 2025)
✅ **Concluído**:
- Migração para Supabase
- Interface responsiva
- 5 cidades ativas
- Busca e filtros básicos
- Integração WhatsApp/Telefone

### 8.2 Próxima Fase - Enhancement (Q2 2025)

#### 8.2.1 Melhorias na Descoberta
- **Busca por geolocalização**: "Estúdios próximos a mim"
- **Filtros avançados**: Preço, modalidades específicas, acessibilidade
- **Ordenação inteligente**: Por distância, por avaliação, por popularidade
- **Sugestões personalizadas**: Baseado em histórico de busca

#### 8.2.2 Conteúdo Enriquecido
- **Fotos dos estúdios**: Galeria de imagens
- **Descrições detalhadas**: Modalidades, diferenciais, equipamentos
- **Preços indicativos**: Faixas de preço por modalidade
- **Professores destacados**: Perfis e especializações

#### 8.2.3 Funcionalidades Sociais
- **Sistema de avaliações**: Usuários podem avaliar estúdios
- **Comentários**: Reviews detalhados
- **Favoritos**: Usuários podem salvar estúdios preferidos
- **Compartilhamento**: Share de estúdios em redes sociais

### 8.3 Fase de Crescimento - Expansion (Q3-Q4 2025)

#### 8.3.1 Expansão Geográfica
- **Novas cidades**: Porto Alegre, Salvador, Recife, Fortaleza
- **Cobertura interior**: Cidades médias do interior paulista e mineiro
- **Meta**: 15 cidades, 10.000+ estúdios

#### 8.3.2 Monetização
- **Perfis Premium**: Destaque para estúdios pagantes
- **Anúncios contextuais**: Google Ads integrados
- **Leads qualificados**: Sistema de CRM para estúdios
- **Analytics para estúdios**: Dashboard de métricas

#### 8.3.3 Parcerias Estratégicas
- **Integração com agendamento**: APIs de booking
- **Parcerias com planos de saúde**: Convênios
- **Marketplace de produtos**: Equipamentos, roupas
- **Programa de afiliados**: Comissões por conversão

## 9. Considerações de Desenvolvimento

### 9.1 Arquitetura Técnica
- **Database scaling**: Preparação para 100k+ estúdios
- **CDN**: Otimização de imagens e assets
- **API Rate Limiting**: Proteção contra abuso
- **Monitoring**: APM e error tracking

### 9.2 SEO e Marketing
- **SEO técnico**: Schema markup para estúdios
- **Content marketing**: Blog com conteúdo sobre pilates
- **Social media**: Presença no Instagram e TikTok
- **Email marketing**: Newsletter com novidades

### 9.3 Compliance e Segurança
- **LGPD compliance**: Política de privacidade
- **Data security**: Criptografia de dados sensíveis
- **Rate limiting**: Proteção de APIs
- **Content moderation**: Moderação de reviews

## 10. Riscos e Mitigações

### 10.1 Riscos de Produto
| Risco | Impacto | Probabilidade | Mitigação |
|-------|---------|---------------|-----------|
| Dados desatualizados | Alto | Média | Sistema de verificação automática |
| Concorrência do Google Maps | Alto | Alta | Diferenciação por especialização |
| Baixa adoção pelos estúdios | Médio | Média | Programa de parcerias ativo |

### 10.2 Riscos Técnicos
| Risco | Impacto | Probabilidade | Mitigação |
|-------|---------|---------------|-----------|
| Performance em escala | Alto | Média | Arquitetura escalável |
| Dependência de APIs externas | Médio | Baixa | Fallbacks e redundância |
| Custos de infraestrutura | Médio | Média | Monitoramento de custos |

## 11. Definição de Sucesso

### 11.1 Critérios de Sucesso - Curto Prazo (6 meses)
- ✅ 50.000 usuários únicos mensais
- ✅ 15% de taxa de conversão (contato)
- ✅ 4.5+ rating na avaliação dos usuários
- ✅ 5 cidades ativas com cobertura completa

### 11.2 Critérios de Sucesso - Médio Prazo (12 meses)
- 📈 200.000 usuários únicos mensais
- 📈 25% de taxa de conversão
- 📈 10 cidades ativas
- 📈 Receita mensal de R$ 50.000

### 11.3 Critérios de Sucesso - Longo Prazo (24 meses)
- 🎯 500.000 usuários únicos mensais
- 🎯 Liderança de mercado em pilates
- 🎯 15 cidades + interior
- 🎯 Receita mensal de R$ 200.000

---

**Documento criado por**: Product Manager  
**Data**: Janeiro 2025  
**Versão**: 1.0  
**Próxima revisão**: Março 2025