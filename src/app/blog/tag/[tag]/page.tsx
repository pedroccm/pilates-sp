import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getBlogTag, getBlogPosts, getBlogTags } from '@/lib/blog-api'
import BlogList from '@/components/blog/BlogList'

interface TagPageProps {
  params: {
    tag: string
  }
}

export async function generateStaticParams() {
  try {
    const tags = await getBlogTags()
    return tags.map((tag) => ({
      tag: tag.slug,
    }))
  } catch (error) {
    console.error('Error generating static params for tags:', error)
    return []
  }
}

export async function generateMetadata({ params }: TagPageProps): Promise<Metadata> {
  const tag = await getBlogTag(params.tag)
  
  if (!tag) {
    return {
      title: 'Tag não encontrada',
      description: 'A tag solicitada não foi encontrada.'
    }
  }

  return {
    title: `Posts sobre ${tag.name} | Blog Pilates SP`,
    description: tag.description || `Todos os posts com a tag ${tag.name} no Blog Pilates SP. Dicas, guias e informações especializadas.`,
    keywords: `${tag.name.toLowerCase()}, pilates ${tag.name.toLowerCase()}, blog pilates`,
    openGraph: {
      title: `Posts sobre ${tag.name} | Blog Pilates SP`,
      description: tag.description || `Todos os posts com a tag ${tag.name} no Blog Pilates SP.`,
      type: 'website',
      url: `https://pilates-sp.com/blog/tag/${params.tag}`
    }
  }
}

export default async function TagPage({ params }: TagPageProps) {
  try {
    // Verificar se a tag existe
    const tag = await getBlogTag(params.tag)
    
    if (!tag) {
      notFound()
    }

    // Carregar posts da tag
    const { posts, total } = await getBlogPosts({
      tag: params.tag,
      page: 1,
      limit: 12
    })

    return (
      <div className="min-h-screen bg-gray-50">
        {/* Tag Header */}
        <div className="bg-white border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 py-12">
            <div className="text-center">
              <div className="flex items-center justify-center mb-4">
                <div className="bg-gray-600 w-12 h-12 rounded-full flex items-center justify-center text-white text-lg">
                  #
                </div>
              </div>
              <h1 className="text-4xl font-bold text-gray-900 mb-4">
                #{tag.name}
              </h1>
              {tag.description && (
                <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                  {tag.description}
                </p>
              )}
              <p className="text-sm text-gray-500 mt-4">
                {tag.posts_count} {tag.posts_count === 1 ? 'artigo' : 'artigos'} com esta tag
              </p>
            </div>
          </div>
        </div>

        <BlogList 
          initialPosts={posts}
          initialTotal={total}
          tag={params.tag}
        />
      </div>
    )
  } catch (error) {
    console.error('Error loading tag page:', error)
    
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            Erro ao carregar tag
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
    )
  }
}