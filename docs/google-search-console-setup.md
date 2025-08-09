ç
# Google Search Console - Guia de Configuração

## Passos Para Submissão ao Google Search Console

### 1. Verificação da Propriedade

#### Método HTML Tag (Recomendado)
1. Acesse [Google Search Console](https://search.google.com/search-console/)
2. Adicione a propriedade: `https://pilates-sp.com`
3. Escolha "Tag HTML" para verificação
4. Adicione a meta tag no `<head>` de todas as páginas

**Exemplo de tag para adicionar:**
```html
<meta name="google-site-verification" content="SEU_CODIGO_AQUI" />
```

### 2. Sitemaps Para Submeter

Submeta os seguintes sitemaps:

```
https://pilates-sp.com/sitemap.xml (Sitemap Index)
https://pilates-sp.com/sitemap-blog.xml (Posts do Blog)
https://pilates-sp.com/sitemap-cities.xml (Páginas de Cidades)
https://pilates-sp.com/sitemap-neighborhoods.xml (Bairros)
https://pilates-sp.com/sitemap-studios.xml (Estúdios)
```

### 3. Monitoramento Inicial

#### KPIs Para Acompanhar:
- **Impressões**: Meta inicial 10.000/mês
- **Cliques**: Meta inicial 500/mês  
- **CTR médio**: Meta 5%+
- **Posição média**: Meta top 10 para palavras-chave principais

#### Palavras-chave Principais:
1. `pilates são paulo`
2. `estudio pilates sp`
3. `pilates perto de mim`
4. `pilates preço são paulo`
5. `melhor estudio pilates`
6. `pilates iniciantes`
7. `pilates gestantes`
8. `pilates idosos`

### 4. Core Web Vitals Para Monitorar

#### Metas de Performance:
- **Largest Contentful Paint (LCP)**: < 2.5s
- **First Input Delay (FID)**: < 100ms
- **Cumulative Layout Shift (CLS)**: < 0.1

### 5. Problemas Comuns Para Verificar

#### Index Coverage:
- Verificar se todas as páginas estão sendo indexadas
- Identificar erros 404 ou páginas bloqueadas
- Monitorar duplicatas ou canonicals incorretos

#### Mobile Usability:
- Verificar se todas as páginas são mobile-friendly
- Identificar problemas de viewport ou elementos muito pequenos

### 6. Configurações Importantes

#### URL Parameters:
- `?search=` : Configurar para "Let Googlebot decide"
- `?filter=` : Configurar para "Let Googlebot decide"  
- `?page=` : Configurar para "Let Googlebot decide"

#### Geo-targeting:
- Configurar país de destino: Brasil

#### Crawl Rate:
- Deixar no automático (Google decide a frequência ideal)

### 7. Rich Results Para Monitorar

#### Structured Data Implementados:
1. **Article** (Posts do blog)
2. **BreadcrumbList** (Navegação)  
3. **Organization** (Dados da empresa)
4. **LocalBusiness** (Para estúdios)

#### Validação:
- Use [Rich Results Test](https://search.google.com/test/rich-results)
- Verifique regularmente se não há erros

### 8. Cronograma de Monitoramento

#### Diário:
- Verificar erros críticos no Index Coverage
- Monitorar performance de Core Web Vitals

#### Semanal:  
- Analisar crescimento de impressões e cliques
- Verificar novas palavras-chave rankando
- Identificar oportunidades de melhoria

#### Mensal:
- Relatório completo de performance
- Análise de competidores
- Planejamento de otimizações

### 9. Integração com Google Analytics

#### Enhanced Ecommerce (Para Conversões):
- Configurar goals para:
  - Contato com estúdio
  - Download de materiais
  - Newsletter signup
  - Tempo na página > 2 min

#### Audience Segments:
- Visitantes do blog
- Interessados em pilates para gestantes  
- Buscas por região específica

### 10. Alertas Para Configurar

#### Search Console Alerts:
- Queda > 20% em impressões
- Aumento > 50% em erros 404
- Problemas de Core Web Vitals
- Problemas de mobile usability

#### Email Notifications:
- Configurar para receber relatórios semanais
- Alertas imediatos para problemas críticos

### 11. Dados Para Análise Regular

#### Performance:
```sql
-- Consultas mais frequentes no Search Console
Top Queries:
1. Posição média
2. CTR
3. Impressões  
4. Cliques

-- Páginas com melhor performance
Top Pages:
1. /blog/pilates-iniciantes-guia-completo-2025
2. /blog/beneficios-pilates-ciencia  
3. / (homepage)
4. /sp/ (São Paulo)
```

#### Index Coverage:
- Total de páginas: ~1.500+
- Válidas indexadas: Meta 95%+
- Excluídas por robots.txt: < 100
- Erros: 0 (meta)

### 12. Próximos Passos Após Configuração

1. **Aguardar 48-72h** para dados aparecerem
2. **Submeter sitemaps** um por vez
3. **Solicitar indexação** das páginas principais
4. **Configurar relatórios automáticos**
5. **Integrar com Google Analytics**

### 13. Troubleshooting

#### Se páginas não indexarem:
1. Verificar robots.txt
2. Confirmar sitemaps válidos
3. Verificar meta robots tags
4. Solicitar indexação manual

#### Se performance estiver baixa:
1. Otimizar Core Web Vitals
2. Melhorar títulos e descriptions
3. Criar mais conteúdo relevante
4. Melhorar link building interno

---

**Data de criação**: 2025-08-09
**Última atualização**: 2025-08-09
**Responsável**: Equipe SEO Pilates SP