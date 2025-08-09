'use client'

import { useState, useEffect } from 'react'
import { BlogPost, BlogCategory, BlogTag, getBlogPosts, getBlogCategories, getBlogTags } from '@/lib/blog-api'
import BlogCard from './BlogCard'

interface BlogListProps {
  initialPosts?: BlogPost[]
  initialTotal?: number
  category?: string
  tag?: string
  search?: string
}

export default function BlogList({ 
  initialPosts = [], 
  initialTotal = 0, 
  category, 
  tag, 
  search: initialSearch 
}: BlogListProps) {
  const [posts, setPosts] = useState<BlogPost[]>(initialPosts)
  const [total, setTotal] = useState(initialTotal)
  const [loading, setLoading] = useState(false)
  const [loadingMore, setLoadingMore] = useState(false)
  const [hasMore, setHasMore] = useState(initialTotal > initialPosts.length)
  const [page, setPage] = useState(1)
  const [search, setSearch] = useState(initialSearch || '')
  const [selectedCategory, setSelectedCategory] = useState(category || 'all')
  const [selectedTag, setSelectedTag] = useState(tag || '')
  
  // Estados para filtros
  const [categories, setCategories] = useState<BlogCategory[]>([])
  const [tags, setTags] = useState<BlogTag[]>([])
  const [showFilters, setShowFilters] = useState(false)

  // Carregar filtros
  useEffect(() => {
    const loadFilters = async () => {
      try {
        const [categoriesData, tagsData] = await Promise.all([
          getBlogCategories(),
          getBlogTags()
        ])
        setCategories(categoriesData)
        setTags(tagsData)
      } catch (error) {
        console.error('Error loading filters:', error)
      }
    }
    loadFilters()
  }, [])

  // Buscar posts quando filtros mudam
  useEffect(() => {
    const searchPosts = async () => {
      if (loading) return
      
      setLoading(true)
      try {
        const { posts: newPosts, total: newTotal, hasMore: newHasMore } = await getBlogPosts({
          page: 1,
          limit: 12,
          category: selectedCategory === 'all' ? undefined : selectedCategory,
          tag: selectedTag || undefined,
          search: search || undefined
        })
        
        setPosts(newPosts)
        setTotal(newTotal)
        setHasMore(newHasMore)
        setPage(1)
      } catch (error) {
        console.error('Error searching posts:', error)
      } finally {
        setLoading(false)
      }
    }

    // Debounce search
    const timeoutId = setTimeout(searchPosts, 300)
    return () => clearTimeout(timeoutId)
  }, [search, selectedCategory, selectedTag])

  // Carregar mais posts
  const loadMore = async () => {
    if (loadingMore || !hasMore) return
    
    setLoadingMore(true)
    try {
      const nextPage = page + 1
      const { posts: newPosts, hasMore: newHasMore } = await getBlogPosts({
        page: nextPage,
        limit: 12,
        category: selectedCategory === 'all' ? undefined : selectedCategory,
        tag: selectedTag || undefined,
        search: search || undefined
      })
      
      setPosts(prev => [...prev, ...newPosts])
      setHasMore(newHasMore)
      setPage(nextPage)
    } catch (error) {
      console.error('Error loading more posts:', error)
    } finally {
      setLoadingMore(false)
    }
  }

  const featuredPosts = posts.filter(post => post.featured)
  const regularPosts = posts.filter(post => !post.featured)

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          {category ? 
            `Posts sobre ${categories.find(c => c.slug === category)?.name || category}` :
            tag ? 
              `Posts com tag "${tags.find(t => t.slug === tag)?.name || tag}"` :
              'Blog do Pilates SP'
          }
        </h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          Descubra tudo sobre Pilates: guias, benefícios, dicas e os melhores estúdios para sua prática.
        </p>
        <p className="text-sm text-gray-500 mt-2">
          {total.toLocaleString()} {total === 1 ? 'artigo encontrado' : 'artigos encontrados'}
        </p>
      </div>

      {/* Search and Filters */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
          {/* Search */}
          <div className="flex-1 max-w-md">
            <div className="relative">
              <input
                type="text"
                placeholder="Buscar artigos..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <svg className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>

          {/* Filters Toggle */}
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
            </svg>
            Filtros
          </button>
        </div>

        {/* Expanded Filters */}
        {showFilters && (
          <div className="mt-6 pt-6 border-t border-gray-200">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Categories */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Categoria
                </label>
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="all">Todas as categorias</option>
                  {categories.map(category => (
                    <option key={category.id} value={category.slug}>
                      {category.name} ({category.posts_count})
                    </option>
                  ))}
                </select>
              </div>

              {/* Tags */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tag
                </label>
                <select
                  value={selectedTag}
                  onChange={(e) => setSelectedTag(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Todas as tags</option>
                  {tags.map(tag => (
                    <option key={tag.id} value={tag.slug}>
                      {tag.name} ({tag.posts_count})
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        )}
      </div>

      {loading && (
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      )}

      {!loading && posts.length === 0 && (
        <div className="text-center py-12">
          <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <h3 className="mt-2 text-sm font-medium text-gray-900">Nenhum post encontrado</h3>
          <p className="mt-1 text-sm text-gray-500">
            Tente ajustar seus filtros ou termo de busca.
          </p>
        </div>
      )}

      {!loading && posts.length > 0 && (
        <>
          {/* Featured Posts */}
          {featuredPosts.length > 0 && (
            <div className="mb-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Posts em Destaque</h2>
              <div className="space-y-8">
                {featuredPosts.map(post => (
                  <BlogCard key={post.id} post={post} featured={true} />
                ))}
              </div>
            </div>
          )}

          {/* Regular Posts */}
          {regularPosts.length > 0 && (
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                {featuredPosts.length > 0 ? 'Mais Posts' : 'Posts Recentes'}
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {regularPosts.map(post => (
                  <BlogCard key={post.id} post={post} />
                ))}
              </div>
            </div>
          )}

          {/* Load More Button */}
          {hasMore && (
            <div className="text-center mt-12">
              <button
                onClick={loadMore}
                disabled={loadingMore}
                className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-8 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loadingMore ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white inline-block mr-2"></div>
                    Carregando...
                  </>
                ) : (
                  `Carregar mais posts`
                )}
              </button>
            </div>
          )}
        </>
      )}
    </div>
  )
}