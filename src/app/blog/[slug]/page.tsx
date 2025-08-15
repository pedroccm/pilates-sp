import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { getBlogPost, incrementPostViews, getRelatedPosts, getAllBlogPostSlugs } from '@/lib/blog-api'
import { generateBlogPostSchema } from '@/lib/schema-markup'
import { StructuredBreadcrumbs } from '@/components/Breadcrumbs'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import BlogCard from '@/components/blog/BlogCard'

interface BlogPostPageProps {
  params: {
    slug: string
  }
}

export async function generateStaticParams() {
  try {
    const slugs = await getAllBlogPostSlugs()
    return slugs.map((slug) => ({
      slug: slug,
    }))
  } catch (error) {
    console.error('Error generating static params for blog posts:', error)
    return []
  }
}

export async function generateMetadata({ params }: BlogPostPageProps): Promise<Metadata> {
  const post = await getBlogPost(params.slug)
  
  if (!post) {
    return {
      title: 'Post não encontrado',
      description: 'O post solicitado não foi encontrado.'
    }
  }

  return {
    title: post.meta_title || post.title,
    description: post.meta_description || post.excerpt || post.description,
    keywords: post.tags?.map(tag => tag.name).join(', ') || '',
    authors: [{ name: post.author?.name || 'Blog Studios de Pilates' }],
    openGraph: {
      title: post.title,
      description: post.excerpt || post.description || '',
      type: 'article',
      url: `https://pilates-sp.com/blog/${params.slug}`,
      images: post.featured_image ? [
        {
          url: post.featured_image,
          width: 1200,
          height: 630,
          alt: post.featured_image_alt || post.title
        }
      ] : [],
      publishedTime: post.published_at,
      authors: post.author?.name ? [post.author.name] : undefined,
      section: post.category?.name
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description: post.excerpt || post.description || '',
      images: post.featured_image ? [post.featured_image] : []
    }
  }
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  try {
    const post = await getBlogPost(params.slug)
    
    if (!post) {
      notFound()
    }

    // Incrementar visualizações (não aguardar para não bloquear renderização)
    incrementPostViews(params.slug).catch(console.error)

    // Buscar posts relacionados
    const relatedPosts = await getRelatedPosts(
      post.id, 
      post.category?.id, 
      3
    ) || []

    // O conteúdo agora vem direto do banco de dados

    const formatDate = (dateString?: string) => {
      if (!dateString) return ''
      return new Date(dateString).toLocaleDateString('pt-BR', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      })
    }

    // Gerar Schema Markup
    const fullUrl = `https://pilates-sp.com/blog/${params.slug}`
    const articleSchema = generateBlogPostSchema(post, fullUrl)
    
    // Preparar breadcrumbs
    const breadcrumbItems = [
      { name: 'Home', href: '/' },
      { name: 'Blog', href: '/blog' }
    ]
    
    if (post.category) {
      breadcrumbItems.push({ 
        name: post.category.name, 
        href: `/blog/categoria/${post.category.slug}` 
      })
    }
    
    breadcrumbItems.push({ name: post.title, current: true })

    return (
      <div className="min-h-screen bg-gray-50">
        {/* Schema Markup JSON-LD */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(articleSchema)
          }}
        />
        <Header />
        {/* Header */}
        <header className="bg-white border-b border-gray-200">
          <div className="max-w-4xl mx-auto px-4 py-8">
            {/* Breadcrumbs Estruturados */}
            <StructuredBreadcrumbs 
              items={breadcrumbItems} 
              className="mb-6"
            />

            {/* Category Badge */}
            {post.category && (
              <div className="mb-4">
                <Link 
                  href={`/blog/categoria/${post.category.slug}`}
                  className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium text-white transition-opacity hover:opacity-80"
                  style={{ backgroundColor: post.category.color }}
                >
                  {post.category.name}
                </Link>
              </div>
            )}

            {/* Title */}
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 leading-tight">
              {post.title}
            </h1>

            {/* Excerpt */}
            {post.excerpt && (
              <p className="text-xl text-gray-600 mb-6 leading-relaxed">
                {post.excerpt}
              </p>
            )}

            {/* Meta Info */}
            <div className="flex flex-wrap items-center text-sm text-gray-500 gap-4">
              {post.author && (
                <div className="flex items-center">
                  {post.author.avatar_url && (
                    <Image
                      src={post.author.avatar_url}
                      alt={post.author.name}
                      width={32}
                      height={32}
                      className="rounded-full mr-3"
                    />
                  )}
                  <div>
                    <p className="font-medium text-gray-900">
                      {post.author.name}
                    </p>
                    <p className="text-xs">
                      {formatDate(post.published_at)}
                    </p>
                  </div>
                </div>
              )}

              <div className="flex items-center gap-4 text-xs">
                {post.reading_time && (
                  <span className="flex items-center">
                    <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    {post.reading_time} min de leitura
                  </span>
                )}

                <span className="flex items-center">
                  <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                  {post.views.toLocaleString()} visualizações
                </span>
              </div>
            </div>
          </div>
        </header>

        {/* Featured Image */}
        {post.featured_image && (
          <div className="relative h-64 md:h-96 bg-gray-200">
            <Image
              src={post.featured_image}
              alt={post.featured_image_alt || post.title}
              fill
              className="object-cover"
              priority
            />
          </div>
        )}

        {/* Content */}
        <article className="max-w-4xl mx-auto px-4 py-12">
          <div className="prose prose-lg max-w-none">
            {post.content ? (
              <div dangerouslySetInnerHTML={{ __html: post.content }} />
            ) : (
              <div>
                <p className="text-gray-600 mb-6">
                  {post.description || post.excerpt || 'Conteúdo em breve...'}
                </p>
                
                {/* Conteúdo placeholder baseado no título */}
                {post.title.toLowerCase().includes('iniciantes') && (
                  <div>
                    <h2>Por que começar no Pilates?</h2>
                    <p>O Pilates é uma modalidade completa que trabalha corpo e mente, oferecendo benefícios únicos para pessoas de todas as idades e níveis de condicionamento físico.</p>
                    
                    <h2>Principais benefícios para iniciantes</h2>
                    <ul>
                      <li><strong>Fortalecimento do core:</strong> Músculos abdominais, das costas e pélvicos</li>
                      <li><strong>Melhora da postura:</strong> Alinhamento corporal correto</li>
                      <li><strong>Flexibilidade:</strong> Aumento da amplitude de movimento</li>
                      <li><strong>Concentração:</strong> Conexão mente-corpo</li>
                      <li><strong>Baixo impacto:</strong> Seguro para articulações</li>
                    </ul>

                    <h2>Como escolher seu primeiro estúdio</h2>
                    <p>Encontrar o estúdio ideal é fundamental para uma boa experiência inicial no Pilates.</p>
                  </div>
                )}

                {post.title.toLowerCase().includes('benefício') && (
                  <div>
                    <h2>Benefícios comprovados cientificamente</h2>
                    <p>Diversos estudos demonstram a eficácia do Pilates para melhorar a saúde física e mental.</p>
                    
                    <h2>1. Fortalecimento muscular</h2>
                    <p>O Pilates trabalha músculos profundos que raramente são ativados em outras atividades.</p>

                    <h2>2. Melhora da flexibilidade</h2>
                    <p>Os exercícios promovem alongamento e maior amplitude de movimento.</p>
                  </div>
                )}

                {post.title.toLowerCase().includes('escolher') && (
                  <div>
                    <h2>Como escolher o melhor estúdio</h2>
                    <p>Encontrar o estúdio de Pilates ideal envolve considerar diversos fatores importantes.</p>
                    
                    <h2>Principais critérios de avaliação</h2>
                    <ul>
                      <li><strong>Localização:</strong> Proximidade de casa ou trabalho</li>
                      <li><strong>Qualificação dos instrutores:</strong> Certificações e experiência</li>
                      <li><strong>Equipamentos:</strong> Estado e variedade dos aparelhos</li>
                      <li><strong>Ambiente:</strong> Limpeza e organização do espaço</li>
                      <li><strong>Horários:</strong> Flexibilidade e disponibilidade</li>
                    </ul>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Tags */}
          {post.tags && post.tags.length > 0 && (
            <div className="mt-8 pt-8 border-t border-gray-200">
              <h3 className="text-sm font-medium text-gray-900 mb-3">Tags:</h3>
              <div className="flex flex-wrap gap-2">
                {post.tags?.map(tag => (
                  <Link
                    key={tag.id}
                    href={`/blog/tag/${tag.slug}`}
                    className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-gray-100 hover:bg-gray-200 text-gray-700 transition-colors"
                  >
                    #{tag.name}
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* Author Bio */}
          {post.author && post.author.bio && (
            <div className="mt-8 pt-8 border-t border-gray-200">
              <div className="flex items-start">
                {post.author.avatar_url && (
                  <Image
                    src={post.author.avatar_url}
                    alt={post.author.name}
                    width={64}
                    height={64}
                    className="rounded-full mr-4 flex-shrink-0"
                  />
                )}
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-1">
                    {post.author.name}
                  </h3>
                  <p className="text-gray-600 text-sm">
                    {post.author.bio}
                  </p>
                </div>
              </div>
            </div>
          )}
        </article>

        {/* Related Posts */}
        {relatedPosts && Array.isArray(relatedPosts) && relatedPosts.length > 0 && (
          <section className="max-w-7xl mx-auto px-4 py-12 border-t border-gray-200">
            <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">
              Posts Relacionados
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {relatedPosts.map(relatedPost => (
                <BlogCard key={relatedPost.id} post={relatedPost} />
              ))}
            </div>
          </section>
        )}

        {/* CTA Section */}
        <section className="bg-blue-600 py-16">
          <div className="max-w-4xl mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold text-white mb-4">
              Encontre o melhor estúdio de Pilates perto de você
            </h2>
            <p className="text-xl text-blue-100 mb-8">
              Compare preços, avaliações e encontre o estúdio ideal para sua prática.
            </p>
            <Link
              href="/"
              className="inline-flex items-center bg-white text-blue-600 font-semibold py-3 px-8 rounded-lg hover:bg-gray-100 transition-colors"
            >
              Buscar Estúdios
              <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>
        </section>
        
        <Footer />
      </div>
    )
  } catch (error) {
    console.error('Error loading blog post:', error)
    
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="flex items-center justify-center flex-1 py-12">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">
              Erro ao carregar post
            </h1>
            <p className="text-gray-600 mb-6">
              Tente novamente em alguns instantes.
            </p>
            <button 
              onClick={() => window.location.reload()}
              className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors"
            >
              Recarregar
            </button>
          </div>
        </div>
        <Footer />
      </div>
    )
  }
}