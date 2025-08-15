'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'

interface Post {
  id: string
  title: string
  slug: string
  excerpt?: string
  featured_image?: string
  status: 'draft' | 'published' | 'archived'
  featured: boolean
  published_at?: string
  reading_time?: number
  views: number
  created_at: string
  blog_categories?: {
    id: string
    name: string
    color: string
  }
  blog_authors?: {
    id: string
    name: string
  }
}

export default function PostsAdmin() {
  const [posts, setPosts] = useState<Post[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('')
  const [page, setPage] = useState(1)
  const [hasMore, setHasMore] = useState(false)
  const [total, setTotal] = useState(0)

  const fetchPosts = async (newPage = 1, newSearch = search, newStatus = statusFilter) => {
    try {
      const params = new URLSearchParams()
      params.set('page', newPage.toString())
      if (newSearch) params.set('search', newSearch)
      if (newStatus) params.set('status', newStatus)

      const response = await fetch(`/api/admin/posts?${params}`)
      if (!response.ok) throw new Error('Erro ao buscar posts')
      
      const data = await response.json()
      setPosts(data.posts)
      setHasMore(data.hasMore)
      setTotal(data.total)
    } catch (err) {
      setError('Erro ao carregar posts')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchPosts(1, search, statusFilter)
    setPage(1)
  }, [search, statusFilter])

  const getStatusBadge = (status: string) => {
    const styles = {
      published: 'bg-green-100 text-green-800',
      draft: 'bg-yellow-100 text-yellow-800',
      archived: 'bg-gray-100 text-gray-800'
    }
    
    const labels = {
      published: 'Publicado',
      draft: 'Rascunho',
      archived: 'Arquivado'
    }

    return (
      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${styles[status as keyof typeof styles] || styles.draft}`}>
        {labels[status as keyof typeof labels] || status}
      </span>
    )
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
          <p className="mt-4 text-gray-600">Carregando posts...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center space-x-4">
              <Link href="/admin" className="text-gray-500 hover:text-gray-700">
                ← Voltar ao Dashboard
              </Link>
              <h1 className="text-xl font-semibold text-gray-900">
                Gerenciar Posts
              </h1>
            </div>
            <div className="flex items-center">
              <Link
                href="/admin/posts/novo"
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium"
              >
                Novo Post
              </Link>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          {/* Filtros */}
          <div className="bg-white p-4 rounded-lg shadow mb-6">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <input
                  type="text"
                  placeholder="Pesquisar posts..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                />
              </div>
              <div>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                >
                  <option value="">Todos os status</option>
                  <option value="published">Publicados</option>
                  <option value="draft">Rascunhos</option>
                  <option value="archived">Arquivados</option>
                </select>
              </div>
            </div>
            <p className="mt-2 text-sm text-gray-500">
              {total} posts encontrados
            </p>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md mb-6">
              {error}
            </div>
          )}

          {posts.length === 0 ? (
            <div className="bg-white shadow rounded-lg p-6 text-center">
              <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <h3 className="mt-2 text-sm font-medium text-gray-900">Nenhum post encontrado</h3>
              <p className="mt-1 text-sm text-gray-500">
                {search || statusFilter ? 'Tente ajustar os filtros.' : 'Comece criando seu primeiro post.'}
              </p>
              <div className="mt-6">
                <Link
                  href="/admin/posts/novo"
                  className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
                >
                  Criar Primeiro Post
                </Link>
              </div>
            </div>
          ) : (
            <div className="bg-white shadow rounded-lg overflow-hidden">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Post
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Autor
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Data
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Views
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Ações
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {posts.map(post => (
                      <tr key={post.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4">
                          <div className="flex items-center">
                            {post.featured_image && (
                              <div className="flex-shrink-0 h-12 w-12 mr-4">
                                <Image
                                  src={post.featured_image}
                                  alt=""
                                  width={48}
                                  height={48}
                                  className="h-12 w-12 rounded object-cover"
                                />
                              </div>
                            )}
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center space-x-2">
                                <p className="text-sm font-medium text-gray-900 truncate">
                                  {post.title}
                                </p>
                                {post.featured && (
                                  <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800">
                                    Destaque
                                  </span>
                                )}
                              </div>
                              {post.blog_categories && (
                                <p className="text-xs text-gray-500 mt-1">
                                  {post.blog_categories.name}
                                </p>
                              )}
                              {post.excerpt && (
                                <p className="text-xs text-gray-500 mt-1 line-clamp-1">
                                  {post.excerpt}
                                </p>
                              )}
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {post.blog_authors?.name || '-'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {getStatusBadge(post.status)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {post.published_at ? 
                            new Date(post.published_at).toLocaleDateString('pt-BR') :
                            new Date(post.created_at).toLocaleDateString('pt-BR')
                          }
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {post.views.toLocaleString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <div className="flex space-x-2">
                            <Link
                              href={`/admin/posts/editar/${post.id}`}
                              className="text-blue-600 hover:text-blue-500"
                            >
                              Editar
                            </Link>
                            <Link
                              href={`/blog/${post.slug}`}
                              target="_blank"
                              className="text-gray-600 hover:text-gray-500"
                            >
                              Ver
                            </Link>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Paginação simples */}
              {hasMore && (
                <div className="bg-white px-4 py-3 border-t border-gray-200 sm:px-6">
                  <button
                    onClick={() => {
                      const nextPage = page + 1
                      setPage(nextPage)
                      fetchPosts(nextPage)
                    }}
                    className="w-full bg-white border border-gray-300 rounded-md py-2 px-4 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    Carregar mais posts
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}