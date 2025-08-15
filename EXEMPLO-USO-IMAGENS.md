# 🖼️ Guia de Uso do Sistema de Imagens

## 📋 **Passos para implementar:**

### 1. **Instalar dependências Python**
```bash
pip install -r requirements.txt
```

### 2. **Configurar variáveis de ambiente**
```bash
# .env.local (adicionar se não existe)
NEXT_PUBLIC_IMAGE_BASE_URL=/uploads/studios/
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here
```

### 3. **Executar o download (teste primeiro)**
```bash
# Teste com poucos registros
python download-studio-images.py --dry-run --limit 10

# Execução real (pequeno batch)
python download-studio-images.py --limit 100

# Execução completa (todos os studios)
python download-studio-images.py
```

## 🔧 **Como usar nos componentes:**

### **Antes (URL original):**
```jsx
<img src={studio.imageUrl} alt={studio.title} />
```

### **Depois (otimizado):**
```jsx
import { getStudioImageUrl, getOptimizedImageProps } from '@/lib/image-utils';
import Image from 'next/image';

// Opção 1: URL simples
<img 
  src={getStudioImageUrl(studio.imageUrl, 'medium')} 
  alt={studio.title}
/>

// Opção 2: Next.js Image otimizado
<Image 
  {...getOptimizedImageProps(studio.imageUrl, studio.title, 'medium')}
/>

// Opção 3: Diferentes tamanhos
<img src={getStudioImageUrl(studio.imageUrl, 'thumbnail')} /> // 300x200
<img src={getStudioImageUrl(studio.imageUrl, 'medium')} />    // 600x400  
<img src={getStudioImageUrl(studio.imageUrl, 'original')} />  // Tamanho original
```

## 📁 **Estrutura de arquivos após download:**

```
public/uploads/studios/
├── original/
│   ├── pilates-vila-olimpia-sp-core-studio-123.jpg
│   └── pilates-ipanema-rj-moves-studio-456.jpg
├── medium/
│   ├── pilates-vila-olimpia-sp-core-studio-123.webp (600x400)
│   └── pilates-ipanema-rj-moves-studio-456.webp
└── thumbnails/
    ├── pilates-vila-olimpia-sp-core-studio-123.webp (300x200)
    └── pilates-ipanema-rj-moves-studio-456.webp
```

## 🔄 **Atualização dos componentes existentes:**

### **HomeStudioCard.tsx:**
```jsx
// Substituir
<img src={studio.imageUrl} />

// Por
<Image {...getOptimizedImageProps(studio.imageUrl, studio.title, 'medium')} />
```

### **HomeStudioListItem.tsx:**
```jsx
// Substituir
<img src={studio.imageUrl} />

// Por  
<Image {...getOptimizedImageProps(studio.imageUrl, studio.title, 'thumbnail')} />
```

## 🚀 **Benefícios após implementação:**

- ✅ **SEO melhorado** - nomes descritivos nas URLs
- ✅ **Performance** - WebP, múltiplos tamanhos
- ✅ **Flexibilidade** - fácil mudar CDN/path
- ✅ **Backup** - imagens salvas localmente
- ✅ **Otimização** - thumbnails automáticos

## ⚙️ **Variáveis de ambiente:**

```bash
# Atual (local)
NEXT_PUBLIC_IMAGE_BASE_URL=/uploads/studios/

# Futuro (CDN)
NEXT_PUBLIC_IMAGE_BASE_URL=https://cdn.seusite.com/studios/

# Futuro (Cloudinary)
NEXT_PUBLIC_IMAGE_BASE_URL=https://res.cloudinary.com/seucloud/image/upload/studios/
```

## 📊 **Monitoramento:**

O script gera log completo em `download-images.log`:
- Total de studios processados
- Imagens baixadas com sucesso  
- Erros e motivos
- URLs atualizadas no banco