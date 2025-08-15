'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
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

export default function NovoPost() {
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
  const [categories, setCategories] = useState<Category[]>([])
  const [authors, setAuthors] = useState<Author[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const router = useRouter()

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [categoriesRes, authorsRes] = await Promise.all([
          fetch('/api/admin/categories'),
          fetch('/api/admin/autores')
        ])

        if (categoriesRes.ok) {
          const categoriesData = await categoriesRes.json()
          setCategories(categoriesData)
        }

        if (authorsRes.ok) {
          const authorsData = await authorsRes.json()
          setAuthors(authorsData)
        }
      } catch (err) {
        console.error('Erro ao carregar dados:', err)
      }
    }

    fetchData()
  }, [])

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/^-+|-+$/g, '')
  }

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const title = e.target.value
    const currentSlug = formData.slug
    const autoSlug = generateSlug(formData.title)
    
    setFormData({
      ...formData,
      title,
      slug: currentSlug === autoSlug ? generateSlug(title) : currentSlug,
      meta_title: formData.meta_title === formData.title ? title : formData.meta_title
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const response = await fetch('/api/admin/posts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          ...formData,
          category_id: formData.category_id || null,
          author_id: formData.author_id || null,
          published_at: formData.status === 'published' ? (formData.published_at || new Date().toISOString()) : null
        })
      })

      if (response.ok) {
        const post = await response.json()
        router.push('/admin/posts')
      } else {
        const data = await response.json()
        setError(data.error || 'Erro ao criar post')
      }
    } catch (err) {
      setError('Erro ao criar post')
    } finally {
      setLoading(false)
    }
  }

  const handleSaveAndPublish = async (e: React.FormEvent) => {
    e.preventDefault()
    setFormData({ ...formData, status: 'published' })
    
    // Aguardar um ciclo para garantir que o estado foi atualizado
    setTimeout(() => {
      handleSubmit(e)
    }, 0)
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
              Novo Post
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
                      onChange={handleTitleChange}
                      className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                      placeholder="Digite o título do post"
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
                      placeholder="slug-do-post"
                    />
                    <p className="mt-1 text-sm text-gray-500">
                      URL: /blog/{formData.slug || 'slug-do-post'}
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
                      placeholder="Breve descrição do post para listas e SEO"
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
                      placeholder="Conteúdo do post..."
                    />
                    <p className="mt-1 text-sm text-gray-500">
                      Você pode usar HTML ou Markdown
                    </p>
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
                      placeholder="Se vazio, usará o título do post"
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
                      placeholder="Se vazio, usará o resumo do post"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
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
                  <div>
                    <label htmlFor="featured_image" className="block text-sm font-medium text-gray-700 mb-2">
                      URL da Imagem
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
                      Texto Alternativo
                    </label>
                    <input
                      type="text"
                      id="featured_image_alt"
                      value={formData.featured_image_alt}
                      onChange={(e) => setFormData({ ...formData, featured_image_alt: e.target.value })}
                      className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                      placeholder="Descrição da imagem"
                    />
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
                    className="w-full bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-md text-sm font-medium disabled:opacity-50"
                  >
                    {loading ? 'Salvando...' : 'Salvar Rascunho'}
                  </button>
                  
                  <button
                    type="button"
                    onClick={handleSaveAndPublish}
                    disabled={loading}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium disabled:opacity-50"
                  >
                    {loading ? 'Publicando...' : 'Salvar e Publicar'}
                  </button>

                  <Link
                    href="/admin/posts"
                    className="block w-full text-center bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded-md text-sm font-medium hover:bg-gray-50"
                  >
                    Cancelar
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}