import { BlogPost } from '@/types/studio'

interface SchemaArticle {
  '@context': string
  '@type': string
  headline: string
  description: string
  image?: string[]
  author: {
    '@type': string
    name: string
    url?: string
  }
  publisher: {
    '@type': string
    name: string
    logo: {
      '@type': string
      url: string
    }
  }
  datePublished: string
  dateModified: string
  mainEntityOfPage: {
    '@type': string
    '@id': string
  }
  articleSection?: string
  keywords?: string
  wordCount?: number
  articleBody?: string
}

export function generateBlogPostSchema(post: BlogPost, fullUrl: string): SchemaArticle {
  const schema: SchemaArticle = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: post.title,
    description: post.excerpt || post.description || '',
    author: {
      '@type': 'Person',
      name: post.author?.name || 'Pilates SP',
      url: post.author?.website || 'https://pilates-sp.com'
    },
    publisher: {
      '@type': 'Organization',
      name: 'Pilates SP',
      logo: {
        '@type': 'ImageObject',
        url: 'https://pilates-sp.com/logo.png'
      }
    },
    datePublished: post.published_at || new Date().toISOString(),
    dateModified: post.updated_at || post.published_at || new Date().toISOString(),
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': fullUrl
    }
  }

  // Adicionar imagem se disponível
  if (post.featured_image) {
    schema.image = [post.featured_image]
  }

  // Adicionar categoria se disponível
  if (post.category?.name) {
    schema.articleSection = post.category.name
  }

  // Adicionar keywords das tags
  if (post.tags && post.tags.length > 0) {
    schema.keywords = post.tags.map(tag => tag.name).join(', ')
  }

  // Adicionar contagem de palavras estimada
  if (post.content) {
    const wordCount = post.content.split(/\s+/).length
    if (wordCount > 0) {
      schema.wordCount = wordCount
    }
  }

  return schema
}

interface SchemaBreadcrumb {
  '@context': string
  '@type': string
  itemListElement: Array<{
    '@type': string
    position: number
    name: string
    item: string
  }>
}

export function generateBreadcrumbSchema(
  baseUrl: string,
  items: Array<{ name: string; url?: string }>
): SchemaBreadcrumb {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url ? `${baseUrl}${item.url}` : undefined
    })).filter(item => item.item) as Array<{
      '@type': string
      position: number
      name: string
      item: string
    }>
  }
}

interface SchemaWebsite {
  '@context': string
  '@type': string
  name: string
  url: string
  description: string
  potentialAction: {
    '@type': string
    target: {
      '@type': string
      urlTemplate: string
    }
    'query-input': string
  }
  sameAs: string[]
}

export function generateWebsiteSchema(): SchemaWebsite {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'Pilates SP - Guia Completo de Estúdios de Pilates em São Paulo',
    url: 'https://pilates-sp.com',
    description: 'Encontre os melhores estúdios de Pilates em São Paulo. Compare preços, avaliações e encontre o estúdio ideal para você.',
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: 'https://pilates-sp.com/?search={search_term_string}'
      },
      'query-input': 'required name=search_term_string'
    },
    sameAs: [
      'https://facebook.com/pilatessaopaulo',
      'https://instagram.com/pilatessaopaulo',
      'https://linkedin.com/company/pilates-sp'
    ]
  }
}

interface SchemaFAQ {
  '@context': string
  '@type': string
  mainEntity: Array<{
    '@type': string
    name: string
    acceptedAnswer: {
      '@type': string
      text: string
    }
  }>
}

export function generateFAQSchema(faqs: Array<{ question: string; answer: string }>): SchemaFAQ {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map(faq => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer
      }
    }))
  }
}