import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getBlogCategory, getBlogPosts, getBlogCategories } from '@/lib/blog-api'
import BlogList from '@/components/blog/BlogList'

interface CategoryPageProps {
  params: {
    category: string
  }
}

export async function generateStaticParams() {
  try {
    const categories = await getBlogCategories()
    return categories.map((category) => ({
      category: category.slug,
    }))
  } catch (error) {
    console.error('Error generating static params for categories:', error)
    return []
  }
}

export async function generateMetadata({ params }: CategoryPageProps): Promise<Metadata> {
  const category = await getBlogCategory(params.category)
  
  if (!category) {
    return {
      title: 'Categoria não encontrada',
      description: 'A categoria solicitada não foi encontrada.'
    }
  }

  return {
    title: `${category.name} | Blog Pilates SP`,
    description: category.description || `Todos os posts sobre ${category.name} no Blog Pilates SP. Dicas, guias e informações especializadas.`,
    keywords: `${category.name.toLowerCase()}, pilates ${category.name.toLowerCase()}, blog pilates`,
    openGraph: {
      title: `${category.name} | Blog Pilates SP`,
      description: category.description || `Todos os posts sobre ${category.name} no Blog Pilates SP.`,
      type: 'website',
      url: `https://pilates-sp.com/blog/categoria/${params.category}`
    }
  }
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  try {
    // Verificar se a categoria existe
    const category = await getBlogCategory(params.category)
    
    if (!category) {
      notFound()
    }

    // Carregar posts da categoria
    const { posts, total } = await getBlogPosts({
      category: params.category,
      page: 1,
      limit: 12
    })

    return (
      <div className="min-h-screen bg-gray-50">
        {/* Category Header */}
        <div className="bg-white border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 py-12">
            <div className="text-center">
              <div className="flex items-center justify-center mb-4">
                <div 
                  className="w-12 h-12 rounded-full flex items-center justify-center text-white text-xl font-bold"
                  style={{ backgroundColor: category.color }}
                >
                  {category.icon ? (
                    <span>{category.icon}</span>
                  ) : (
                    category.name[0]
                  )}
                </div>
              </div>
              <h1 className="text-4xl font-bold text-gray-900 mb-4">
                {category.name}
              </h1>
              {category.description && (
                <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                  {category.description}
                </p>
              )}
              <p className="text-sm text-gray-500 mt-4">
                {category.posts_count} {category.posts_count === 1 ? 'artigo' : 'artigos'} nesta categoria
              </p>
            </div>
          </div>
        </div>

        <BlogList 
          initialPosts={posts}
          initialTotal={total}
          category={params.category}
        />
      </div>
    )
  } catch (error) {
    console.error('Error loading category page:', error)
    
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            Erro ao carregar categoria
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