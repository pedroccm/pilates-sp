'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useParams } from 'next/navigation'
import Link from 'next/link'

interface Category {
  id: string
  name: string
  color: string
}

interface Author {
  id: string
  name: string
}

interface Post {
  id: string
  title: string
  slug: string
  excerpt?: string
  content?: string
  meta_title?: string
  meta_description?: string
  featured_image?: string
  featured_image_alt?: string
  status: 'draft' | 'published' | 'archived'
  featured: boolean
  category_id?: string
  author_id?: string
  published_at?: string
  reading_time?: number
  views: number
  blog_categories?: {
    id: string
    name: string
    color: string
  }
  blog_authors?: {
    id: string
    name: string
  }
  tags?: Array<{
    id: string
    name: string
    slug: string
  }>
}

export default function EditarPost() {
  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    excerpt: '',
    content: '',
    meta_title: '',
    meta_description: '',
    featured_image: '',
    featured_image_alt: '',
    status: 'draft',
    featured: false,
    category_id: '',
    author_id: '',
    published_at: ''
  })
  const [post, setPost] = useState<Post | null>(null)
  const [categories, setCategories] = useState<Category[]>([])
  const [authors, setAuthors] = useState<Author[]>([])
  const [loading, setLoading] = useState(false)
  const [loadingPost, setLoadingPost] = useState(true)
  const [error, setError] = useState('')
  const [deleteConfirm, setDeleteConfirm] = useState(false)
  const [uploadingImage, setUploadingImage] = useState(false)
  const [imageError, setImageError] = useState('')
  
  const router = useRouter()
  const params = useParams()
  const postId = params.id as string

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [postRes, categoriesRes, authorsRes] = await Promise.all([
          fetch(`/api/admin/posts/${postId}`),
          fetch('/api/admin/categories'),
          fetch('/api/admin/autores')
        ])

        if (postRes.ok) {
          const postData = await postRes.json()
          setPost(postData)
          setFormData({
            title: postData.title || '',
            slug: postData.slug || '',
            excerpt: postData.excerpt || '',
            content: postData.content || '',
            meta_title: postData.meta_title || '',
            meta_description: postData.meta_description || '',
            featured_image: postData.featured_image || '',
            featured_image_alt: postData.featured_image_alt || '',
            status: postData.status || 'draft',
            featured: postData.featured || false,
            category_id: postData.blog_categories?.id || '',
            author_id: postData.blog_authors?.id || '',
            published_at: postData.published_at ? 
              new Date(postData.published_at).toISOString().slice(0, 16) : ''
          })
        } else {
          setError('Post não encontrado')
        }

        if (categoriesRes.ok) {
          const categoriesData = await categoriesRes.json()
          setCategories(categoriesData)
        }

        if (authorsRes.ok) {
          const authorsData = await authorsRes.json()
          setAuthors(authorsData)
        }
      } catch (err) {
        setError('Erro ao carregar dados')
      } finally {
        setLoadingPost(false)
      }
    }

    if (postId) {
      fetchData()
    }
  }, [postId])

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setUploadingImage(true)
    setImageError('')

    try {
      const formData = new FormData()
      formData.append('file', file)

      const response = await fetch('/api/admin/upload/featured-image', {
        method: 'POST',
        body: formData
      })

      if (response.ok) {
        const data = await response.json()
        setFormData(prev => ({ ...prev, featured_image: data.url }))
      } else {
        const errorData = await response.json()
        setImageError(errorData.error || 'Erro ao fazer upload da imagem')
      }
    } catch (err) {
      setImageError('Erro ao fazer upload da imagem')
    } finally {
      setUploadingImage(false)
      // Reset file input
      e.target.value = ''
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const response = await fetch(`/api/admin/posts/${postId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          ...formData,
          category_id: formData.category_id || null,
          author_id: formData.author_id || null,
          published_at: formData.status === 'published' ? 
            (formData.published_at || new Date().toISOString()) : null
        })
      })

      if (response.ok) {
        router.push('/admin/posts')
      } else {
        const data = await response.json()
        setError(data.error || 'Erro ao atualizar post')
      }
    } catch (err) {
      setError('Erro ao atualizar post')
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async () => {
    if (!deleteConfirm) return

    setLoading(true)
    setError('')

    try {
      const response = await fetch(`/api/admin/posts/${postId}`, {
        method: 'DELETE'
      })

      if (response.ok) {
        router.push('/admin/posts')
      } else {
        const data = await response.json()
        setError(data.error || 'Erro ao deletar post')
      }
    } catch (err) {
      setError('Erro ao deletar post')
    } finally {
      setLoading(false)
      setDeleteConfirm(false)
    }
  }

  if (loadingPost) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
          <p className="mt-4 text-gray-600">Carregando post...</p>
        </div>
      </div>
    )
  }

  if (!post) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600">Post não encontrado</p>
          <Link href="/admin/posts" className="text-blue-600 hover:text-blue-500 mt-2 inline-block">
            ← Voltar aos posts
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center h-16 space-x-4">
            <Link href="/admin/posts" className="text-gray-500 hover:text-gray-700">
              ← Voltar aos Posts
            </Link>
            <h1 className="text-xl font-semibold text-gray-900">
              Editar Post: {post.title}
            </h1>
          </div>
        </div>
      </nav>

      <div className="max-w-4xl mx-auto py-6 sm:px-6 lg:px-8">
        <form className="space-y-6">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md">
              {error}
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Coluna Principal */}
            <div className="lg:col-span-2 space-y-6">
              {/* Conteúdo Principal */}
              <div className="bg-white shadow rounded-lg p-6">
                <div className="space-y-6">
                  <div>
                    <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
                      Título *
                    </label>
                    <input
                      type="text"
                      id="title"
                      required
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    />
                  </div>

                  <div>
                    <label htmlFor="slug" className="block text-sm font-medium text-gray-700 mb-2">
                      Slug *
                    </label>
                    <input
                      type="text"
                      id="slug"
                      required
                      value={formData.slug}
                      onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                      className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    />
                    <p className="mt-1 text-sm text-gray-500">
                      URL: /blog/{formData.slug}
                    </p>
                  </div>

                  <div>
                    <label htmlFor="excerpt" className="block text-sm font-medium text-gray-700 mb-2">
                      Resumo
                    </label>
                    <textarea
                      id="excerpt"
                      rows={3}
                      value={formData.excerpt}
                      onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
                      className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    />
                  </div>

                  <div>
                    <label htmlFor="content" className="block text-sm font-medium text-gray-700 mb-2">
                      Conteúdo
                    </label>
                    <textarea
                      id="content"
                      rows={20}
                      value={formData.content}
                      onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                      className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm font-mono"
                    />
                  </div>
                </div>
              </div>

              {/* SEO */}
              <div className="bg-white shadow rounded-lg p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">SEO</h3>
                <div className="space-y-4">
                  <div>
                    <label htmlFor="meta_title" className="block text-sm font-medium text-gray-700 mb-2">
                      Meta Título
                    </label>
                    <input
                      type="text"
                      id="meta_title"
                      value={formData.meta_title}
                      onChange={(e) => setFormData({ ...formData, meta_title: e.target.value })}
                      className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    />
                  </div>

                  <div>
                    <label htmlFor="meta_description" className="block text-sm font-medium text-gray-700 mb-2">
                      Meta Descrição
                    </label>
                    <textarea
                      id="meta_description"
                      rows={3}
                      value={formData.meta_description}
                      onChange={(e) => setFormData({ ...formData, meta_description: e.target.value })}
                      className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Estatísticas */}
              <div className="bg-white shadow rounded-lg p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Estatísticas</h3>
                <div className="space-y-2">
                  <p className="text-sm text-gray-600">
                    <strong>Views:</strong> {post.views.toLocaleString()}
                  </p>
                  <p className="text-sm text-gray-600">
                    <strong>Tempo de leitura:</strong> {post.reading_time || 0} min
                  </p>
                  <p className="text-sm text-gray-600">
                    <strong>Criado em:</strong> {new Date(post.created_at || '').toLocaleDateString('pt-BR')}
                  </p>
                </div>
              </div>

              {/* Publicação */}
              <div className="bg-white shadow rounded-lg p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Publicação</h3>
                <div className="space-y-4">
                  <div>
                    <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-2">
                      Status
                    </label>
                    <select
                      id="status"
                      value={formData.status}
                      onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                      className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    >
                      <option value="draft">Rascunho</option>
                      <option value="published">Publicado</option>
                      <option value="archived">Arquivado</option>
                    </select>
                  </div>

                  <div className="flex items-center">
                    <input
                      id="featured"
                      name="featured"
                      type="checkbox"
                      checked={formData.featured}
                      onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <label htmlFor="featured" className="ml-2 block text-sm text-gray-900">
                      Post em destaque
                    </label>
                  </div>

                  {formData.status === 'published' && (
                    <div>
                      <label htmlFor="published_at" className="block text-sm font-medium text-gray-700 mb-2">
                        Data de Publicação
                      </label>
                      <input
                        type="datetime-local"
                        id="published_at"
                        value={formData.published_at}
                        onChange={(e) => setFormData({ ...formData, published_at: e.target.value })}
                        className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                      />
                    </div>
                  )}
                </div>
              </div>

              {/* Categorização */}
              <div className="bg-white shadow rounded-lg p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Categorização</h3>
                <div className="space-y-4">
                  <div>
                    <label htmlFor="category_id" className="block text-sm font-medium text-gray-700 mb-2">
                      Categoria
                    </label>
                    <select
                      id="category_id"
                      value={formData.category_id}
                      onChange={(e) => setFormData({ ...formData, category_id: e.target.value })}
                      className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    >
                      <option value="">Selecionar categoria</option>
                      {categories.map(category => (
                        <option key={category.id} value={category.id}>
                          {category.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label htmlFor="author_id" className="block text-sm font-medium text-gray-700 mb-2">
                      Autor
                    </label>
                    <select
                      id="author_id"
                      value={formData.author_id}
                      onChange={(e) => setFormData({ ...formData, author_id: e.target.value })}
                      className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    >
                      <option value="">Selecionar autor</option>
                      {authors.map(author => (
                        <option key={author.id} value={author.id}>
                          {author.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              {/* Imagem Destacada */}
              <div className="bg-white shadow rounded-lg p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Imagem Destacada</h3>
                <div className="space-y-4">
                  
                  {/* Preview da imagem atual */}
                  {formData.featured_image && (
                    <div className="mb-4">
                      <div className="flex items-start space-x-3">
                        <img
                          src={formData.featured_image}
                          alt="Preview da imagem destacada"
                          className="w-32 h-24 object-cover rounded border border-gray-300"
                        />
                        <div className="flex-1">
                          <p className="text-sm text-gray-500">Imagem atual</p>
                          <button
                            type="button"
                            onClick={() => setFormData(prev => ({ ...prev, featured_image: '' }))}
                            className="text-xs text-red-600 hover:text-red-500 mt-1"
                          >
                            Remover imagem
                          </button>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Upload de nova imagem */}
                  <div className="mb-4">
                    <label htmlFor="image-upload" className="block">
                      <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-400 cursor-pointer">
                        {uploadingImage ? (
                          <div className="py-4">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                            <p className="mt-2 text-sm text-gray-600">Fazendo upload...</p>
                          </div>
                        ) : (
                          <div className="py-4">
                            <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                            </svg>
                            <p className="mt-2 text-sm text-gray-600">Clique para fazer upload de uma imagem</p>
                            <p className="text-xs text-gray-500">JPG, PNG, WebP até 5MB</p>
                          </div>
                        )}
                      </div>
                    </label>
                    <input
                      id="image-upload"
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      disabled={uploadingImage}
                      className="hidden"
                    />
                  </div>

                  {imageError && (
                    <p className="text-sm text-red-600">{imageError}</p>
                  )}

                  {/* URL manual (alternativa) */}
                  <div>
                    <label htmlFor="featured_image" className="block text-sm font-medium text-gray-700 mb-2">
                      Ou insira URL da imagem manualmente
                    </label>
                    <input
                      type="url"
                      id="featured_image"
                      value={formData.featured_image}
                      onChange={(e) => setFormData({ ...formData, featured_image: e.target.value })}
                      className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                      placeholder="https://exemplo.com/imagem.jpg"
                    />
                  </div>

                  <div>
                    <label htmlFor="featured_image_alt" className="block text-sm font-medium text-gray-700 mb-2">
                      Texto Alternativo (Alt Text)
                    </label>
                    <input
                      type="text"
                      id="featured_image_alt"
                      value={formData.featured_image_alt}
                      onChange={(e) => setFormData({ ...formData, featured_image_alt: e.target.value })}
                      className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                      placeholder="Descreva a imagem para acessibilidade"
                    />
                    <p className="mt-1 text-xs text-gray-500">
                      Importante para SEO e acessibilidade
                    </p>
                  </div>
                </div>
              </div>

              {/* Ações */}
              <div className="bg-white shadow rounded-lg p-6">
                <div className="space-y-3">
                  <button
                    type="button"
                    onClick={handleSubmit}
                    disabled={loading}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium disabled:opacity-50"
                  >
                    {loading ? 'Salvando...' : 'Salvar Alterações'}
                  </button>

                  <Link
                    href={`/blog/${post.slug}`}
                    target="_blank"
                    className="block w-full text-center bg-gray-100 border border-gray-300 text-gray-700 px-4 py-2 rounded-md text-sm font-medium hover:bg-gray-200"
                  >
                    Visualizar Post
                  </Link>

                  <Link
                    href="/admin/posts"
                    className="block w-full text-center bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded-md text-sm font-medium hover:bg-gray-50"
                  >
                    Cancelar
                  </Link>

                  <div className="pt-3 border-t border-gray-200">
                    <button
                      type="button"
                      onClick={() => setDeleteConfirm(!deleteConfirm)}
                      className="w-full bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md text-sm font-medium"
                    >
                      {deleteConfirm ? 'Confirmar Exclusão' : 'Deletar Post'}
                    </button>
                    
                    {deleteConfirm && (
                      <div className="mt-2 p-3 bg-red-50 rounded-md">
                        <p className="text-sm text-red-800">
                          Esta ação é irreversível. Clique novamente para confirmar.
                        </p>
                        <button
                          type="button"
                          onClick={handleDelete}
                          disabled={loading}
                          className="mt-2 bg-red-800 hover:bg-red-900 text-white px-3 py-1 rounded text-xs disabled:opacity-50"
                        >
                          {loading ? 'Deletando...' : 'SIM, DELETAR'}
                        </button>
                        <button
                          type="button"
                          onClick={() => setDeleteConfirm(false)}
                          className="mt-2 ml-2 bg-gray-200 hover:bg-gray-300 text-gray-800 px-3 py-1 rounded text-xs"
                        >
                          Cancelar
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}