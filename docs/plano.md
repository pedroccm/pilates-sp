# Plano de Negócio — Diretório de Estúdios de Pilates

## 0. Revenue Architecture (Winning by Design) — Guia Detalhado

### 0.1. O que é e por que importa
Revenue Architecture é a engenharia do crescimento recorrente: **como adquirir, ativar, expandir e reter clientes** com previsibilidade. O foco não é “vender mais uma vez”, e sim **construir fluxo de caixa recorrente** com unit economics saudáveis (LTV, CAC, churn). Para este diretório, significa transformar uma base de 8.000 estúdios listados em uma máquina de MRR.

### 0.2. Princípios-chave
- **Crescimento recorrente ≥ vendas pontuais**: priorizar assinaturas e renovações.
- **Playbooks por estágio**: cada etapa do ciclo tem dono, SLA e critérios de saída.
- **Previsibilidade por matemática de funil**: metas = (capacidade × conversões × ticket).
- **Unit economics antes de escala**: só escalar canais com CAC payback < 3 meses.
- **Dados no centro**: CRM como “sistema de verdade” de contatos, receita e renovações.

### 0.3. Jornada do cliente e motions
**Estágios (com métrica principal):**
1. **Descoberta (Awareness)** → tráfego orgânico/paid (visitas qualificadas)
2. **Avaliação (Consideration)** → leads MQL (cadastros/contatos)
3. **Compra (Decision/Land)** → SQL/fechamentos (novas assinaturas)
4. **Onboarding (First Value)** → tempo até 1º lead/resultado
5. **Adoção (Adopt)** → uso de recursos (cliques WhatsApp, agendamentos)
6. **Expansão (Expand)** → upgrades/destaques/ad adds
7. **Renovação (Retain/Renew)** → GRR/NRR

**Motions (como chegamos lá):**
- **Inbound (marketing-led)**: SEO local, conteúdos, newsletter monetizada.
- **Outbound (sales-led)**: SDRs ativando base listada (8k).
- **Product-led (product-led assist)**: valor percebido no perfil (tráfego + cliques).

### 0.4. Arquitetura do funil (estágios, dono, critério de saída, SLA)
| Estágio CRM | Dono | Critério de Saída (Exit Criteria) | SLA |
|---|---|---|---|
| Lista fria | SDR | Contato iniciado (ligação/WhatsApp/email logados) | 48h após import |
| Contato iniciado | SDR | DORs mapeadas + proposta enviada | 48h |
| Proposta enviada | SDR/AE | Aceite de plano e pagamento | 7 dias |
| Fechou – Destaque | CS | Onboarding completo + perfil otimizado | 72h |
| Fechou – Performance/Premium | CS | 1º lead entregue + confirmação de valor | 7 dias |
| Follow-up | SDR | Próxima ação agendada (data/hora) | 3 dias |
| Perdido | SDR | Motivo registrado + próxima janela | — |

### 0.5. Pricing & Packaging (Good/Better/Best) e alavancas de monetização
- **Good** (Destaque R$ 99): visibilidade, SEO local, CTA WhatsApp.
- **Better** (Performance R$ 199): +leads qualificados + agendamento online.
- **Best** (Premium R$ 399): +campanhas geolocalizadas + vídeo promo.
- **Extras**: venda de leads avulsos, **newsletter fechada monetizada**, anúncios, eventos.

**Métricas de valor (para precificação/upsell):** volume de buscas do bairro, cliques no perfil, leads/mês, presença em newsletter/eventos.

### 0.6. Unit Economics — fórmulas e metas
- **ARPA (ticket médio mensal)**: R$ 200 (meta)
- **Margem bruta** (SaaS/marketplace leve): 80–90% (meta ≥ 85%)
- **Churn mensal**: meta < 3%
- **LTV** ≈ `ARPA × Margem Bruta × (1 / Churn Mensal)`  
  Ex.: `200 × 0,85 × (1/0,03) ≈ R$ 5.667`
- **CAC Payback** ≈ `CAC / (ARPA × Margem Bruta)` → meta ≤ 3 meses
- **LTV:CAC** → meta ≥ 3:1
- **GRR (retensão bruta)** ≥ 85% / **NRR** ≥ 100–110%

### 0.7. Matemática de pipeline (exemplo operacional)
Assumindo outbound + inbound:

- **Taxas de conversão de referência (saudáveis)**  
  - Contato → Reunião/Proposta: 15–25%  
  - Proposta → Fechamento: 25–35%  
  - Contato → Fechamento (overall): 4–7%
- **Capacidade por SDR**  
  - 40 contatos/dia × 20 dias = **800 contatos/mês**  
  - A 5% de fechamento: **40 deals/mês/SDR**
- **Meta mês 1: 100 novos pagantes**  
  - Outbound (3 SDRs): ~120 deals potenciais (com 5%)  
  - Inbound/SEO + reativações: 10–20 deals  
  - **Buffer realista**: 3 SDRs batem 90–110 → meta atingível

> Ajuste de alavancas: **qualidade da lista (score)**, **script**, **prova de valor (leads rápidos)** e **oferta (R$ 99 de entrada)** ampliam a taxa de fechamento.

### 0.8. Plano de cobertura e papéis
- **SDR** (Land): prospecção + qualificação + proposta.
- **AE** (opcional / SDR híbrido): negociação e fechamento de planos maiores.
- **CS/Onboarding** (Retain/Expand): 1º valor em 72h + relatório mensal + upsell.
- **Growth (Marketing)**: SEO local, newsletter, materiais de prova/social proof.

**Capacidade de CS** (carteira): 150–250 contas por CS (planos baixos) com cadência mensal automatizada.

### 0.9. Dados & instrumentação (CRM como fonte da verdade)
- **Campos essenciais**: plano atual, status de assinatura, data de ativação, cidade/bairro, Instagram, fonte, score, atividades, uso (cliques/lead), NPS.
- **Eventos de produto**: visitas ao perfil, cliques no WhatsApp, leads entregues, aberturas de newsletter, participação em eventos.
- **Dashboards semanais**: novos MRR, churn, expansões, pipeline por estágio, produtividade SDR, tempo até 1º valor.

### 0.10. Cadência operacional (ritmo de execução)
- **Diário**: dailies de SDR/CS (15 min).
- **Semanal**: revisão de pipeline (1h), SEO/conteúdo (30–45 min).
- **Mensal**: QBR interno (NRR, churn drivers, roadmap de crescimento).
- **Por edição**: fechamento comercial da **newsletter** (vendas e entregas).

### 0.11. Alças de crescimento (growth loops)
- **SEO local** → mais tráfego → mais leads → prova de ROI → upsell → reviews/UGC → melhora SEO.
- **Newsletter monetizada** → demanda por destaque → upgrades e anúncios.
- **Eventos fechados** → comunidade/autoridade → retenção e expansão.

---

## 1. Visão Geral e Potencial
- **Base atual**: 8.000 estúdios listados (5 cidades).
- **Meta de pagantes**: 835 (10,4% da base).
- **Ticket médio**: R$ 200/mês.
- **Receita alvo**: R$ 167k MRR (~R$ 2M ARR).
- **Valuation esperado**: R$ 10M (múltiplo de ~5× ARR).

---

## 2. Estratégia — Revenue Architecture Adaptada (resumo aplicado)
- **Land**: plano gratuito + ativação de Destaque (R$ 99).
- **Expand**: Performance (R$ 199), Premium (R$ 399), +leads, +campanhas.
- **Retain**: 1º valor em 72h, relatório mensal, newsletter e eventos.

---

## 3. Produtos e Monetização
| Produto/Serviço         | Preço Mensal | Descrição |
|---|---:|---|
| Plano Destaque          | R$ 99 | Visibilidade/SEO/CTA WhatsApp. |
| Plano Performance       | R$ 199 | +Leads qualificados + agendamento online. |
| Plano Premium           | R$ 399 | +Campanhas segmentadas + vídeo promocional. |
| Venda de Leads avulsos  | R$ 20–50 | Lotes sob demanda. |
| Publicidade segmentada  | R$ 2k–10k | Banners e boxes por perfil/edição. |
| **Newsletter fechada**  | R$ 300–2.000/ins. | Destaques pagos e anúncios. |
| Eventos exclusivos      | Incluído (tiers) | Online/presencial para donos. |

---

## 4. Plano de Ataque — 90 Dias
**Meta**: 835 pagantes (MRR R$ 167k).

**Fase 1 — Land (Dias 1–30)**
- Priorizar top 20% da base (score).
- Oferta de entrada R$ 99; 1º valor rápido.
- Meta: 100 novos pagantes.

**Fase 2 — Expand (Dias 31–60)**
- Upsell para Performance/Premium via ROI.
- Parcerias com redes/franquias.
- Meta: 400 acumulados.

**Fase 3 — Retain (Dias 61–90)**
- Relatório mensal, newsletter, eventos.
- Churn < 3%, aumento de ARPA.
- Meta: 835 acumulados.

**Projeção**
| Mês | Novos | Total | MRR |
|---|---:|---:|---:|
| 1 | 100 | 100 | R$ 20k |
| 2 | 300 | 400 | R$ 80k |
| 3 | 435 | 835 | R$ 167k |

---

## 5. Playbook Comercial
**Script (resumo)**
- Abertura: autoridade + oferta limitada por bairro.
- Diagnóstico: aquisições atuais, canais, capacidade semanal.
- Proposta: Destaque R$ 99 (de R$ 129), sem fidelidade.
- Fechamento: Pix/cartão agora; escassez (5 por bairro).

**Objeções**
- Verba: 1 aluno/3 meses paga.
- Pensar: limite por bairro.
- “Já tenho Insta”: atingimos quem **procura** Pilates no bairro.

**Follow-up 7 dias**
- D1 link, D3 case, D5 call, D7 última vaga.

---

## 6. Estrutura de CRM (campos, estágios, automações, relatórios)
**Estágios**
1. Lista fria → 2. Contato iniciado → 3. Proposta enviada →  
4. Fechou – Destaque → 5. Fechou – Performance → 6. Fechou – Premium →  
7. Follow-up → 8. Perdido

**Campos essenciais**
- Estúdio, responsável, WhatsApp, e-mail, cidade/bairro, Instagram
- Plano atual, status assinatura, fonte, **score**, data último contato
- Histórico de interações, uso do produto (visitas/cliques/leads), NPS

**Automação**
- Follow-up: +2d e +7d após 1º contato
- Upgrade: 30 dias no Destaque
- Retenção: evento de cancelamento
- Integração cobrança: status visível no CRM

**Relatórios**
- Conversão por estágio, MRR por plano, churn por motivo
- Produtividade SDR/CS, tempo até 1º valor
- Cohorts de retenção por cidade/bairro

---

## 7. Newsletter Exclusiva Monetizada
**Objetivo**: produto pago para donos (destaques/anúncios), canal de autoridade.

**Características**
- Fechada (base de donos), mensal (→ quinzenal com tração), link privado.
- Conteúdo: Destaque do mês (pago), case, agenda de eventos, tendências, espaço do anunciante.

**Monetização**
- Destaques: R$ 300–500 (exclusividade/edição)
- Anúncios: R$ 500–2.000 por inserção
- Combos: newsletter + destaque no diretório

**Meta inicial**: 3 destaques (R$ 1.200) + 2 anunciantes (R$ 3.000) = **R$ 4.200/mês**

**KPIs**: abertura > 35%, CTR > 10%, receita/edição, nº de anunciantes.

---

## 8. Eventos Fechados (Retain/Expand)
**Objetivos**: networking, autoridade, upsell.

**Formatos**
- Online: webinars/workshops (Google Ads, Instagram, CRM).
- Presencial: encontros regionais (SP e capitais), painéis de cases.

**Inclusão por plano**
- Destaque: online gratuito
- Performance: online + desconto presencial
- Premium: acesso total/VIP

---

## 9. KPIs e Metas
- CAC payback ≤ 3 meses; LTV:CAC ≥ 3
- Churn mensal < 3%; GRR ≥ 85%; NRR ≥ 100–110%
- 70% aquisição via inbound/SEO
- Newsletter: open > 35%, CTR > 10%
- Eventos: participação > 50% da base ativa

---

## 10. Próximos Passos
1. Escolher CRM (HubSpot/Pipedrive/Airtable) e importar CSV.
2. Priorizar base por score (top 20%) e iniciar cadência SDR.
3. Configurar automações de follow-up/upgrade/retention.
4. Lançar a 1ª edição da newsletter (vender destaques/anúncios).
5. Agendar 1º evento fechado (online) e calendário trimestral.
6. Estabelecer cadências (diária/semana/mensal) e dashboards.
7. Revisar unit economics mensalmente e otimizar oferta/roteiros.

---
