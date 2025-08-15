import { Metadata } from 'next'
import { getBlogPosts } from '@/lib/blog-api'
import BlogList from '@/components/blog/BlogList'
import Header from '@/components/Header'
import Footer from '@/components/Footer'

export const metadata: Metadata = {
  title: 'Blog Studios de Pilates | Guias, Dicas e Benefícios do Pilates',
  description: 'Descubra tudo sobre Pilates no nosso blog: guias para iniciantes, benefícios científicos, melhores studios e dicas de especialistas.',
  keywords: 'blog pilates, guia pilates, benefícios pilates, dicas pilates, pilates iniciantes',
  openGraph: {
    title: 'Blog Studios de Pilates | Guias, Dicas e Benefícios do Pilates',
    description: 'Descubra tudo sobre Pilates no nosso blog: guias para iniciantes, benefícios científicos, melhores studios e dicas de especialistas.',
    type: 'website',
    url: 'https://pilates-sp.com/blog'
  }
}

export default async function BlogPage() {
  try {
    // Carregar posts iniciais
    const { posts, total } = await getBlogPosts({
      page: 1,
      limit: 12
    })

    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <BlogList 
          initialPosts={posts}
          initialTotal={total}
        />
        <Footer />
      </div>
    )
  } catch (error) {
    console.error('Error loading blog page:', error)
    
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="flex items-center justify-center flex-1 py-12">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">
              Erro ao carregar o blog
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