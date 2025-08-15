'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'

interface Author {
  id: string
  name: string
  slug: string
  bio?: string
  avatar_url?: string
  posts_count: number
}

export default function EditarAutor() {
  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    bio: '',
    avatar_url: ''
  })
  const [loading, setLoading] = useState(false)
  const [loadingAuthor, setLoadingAuthor] = useState(true)
  const [error, setError] = useState('')
  const [deleteConfirm, setDeleteConfirm] = useState(false)
  const [author, setAuthor] = useState<Author | null>(null)
  const [uploadingAvatar, setUploadingAvatar] = useState(false)
  const [avatarError, setAvatarError] = useState('')
  
  const router = useRouter()
  const params = useParams()
  const authorId = params.id as string

  useEffect(() => {
    const fetchAuthor = async () => {
      try {
        const { data: authorData, error } = await supabase
          .from('blog_authors')
          .select('*')
          .eq('id', authorId)
          .single()

        if (error) {
          if (error.code === 'PGRST116') {
            setError('Autor não encontrado')
          } else {
            setError('Erro ao carregar autor')
          }
        } else {
          setAuthor(authorData)
          setFormData({
            name: authorData.name || '',
            slug: authorData.slug || '',
            bio: authorData.bio || '',
            avatar_url: authorData.avatar_url || ''
          })
        }
      } catch (err) {
        setError('Erro ao carregar autor')
      } finally {
        setLoadingAuthor(false)
      }
    }

    if (authorId) {
      fetchAuthor()
    }
  }, [authorId])

  const generateSlug = (name: string) => {
    return name
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/^-+|-+$/g, '')
  }

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setUploadingAvatar(true)
    setAvatarError('')

    try {
      const formData = new FormData()
      formData.append('file', file)

      const response = await fetch('/api/admin/upload/avatar', {
        method: 'POST',
        body: formData
      })

      if (response.ok) {
        const data = await response.json()
        setFormData(prev => ({ ...prev, avatar_url: data.url }))
      } else {
        const errorData = await response.json()
        setAvatarError(errorData.error || 'Erro ao fazer upload do avatar')
      }
    } catch (err) {
      setAvatarError('Erro ao fazer upload do avatar')
    } finally {
      setUploadingAvatar(false)
      // Reset file input
      e.target.value = ''
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const { error } = await supabase
        .from('blog_authors')
        .update({
          name: formData.name,
          slug: formData.slug,
          bio: formData.bio || null,
          avatar_url: formData.avatar_url || null
        })
        .eq('id', authorId)

      if (error) {
        if (error.code === 'PGRST116') {
          setError('Autor não encontrado')
        } else if (error.code === '23505') {
          setError('Slug já existe')
        } else {
          setError('Erro ao atualizar autor')
        }
      } else {
        router.push('/admin/autores')
      }
    } catch (err) {
      setError('Erro ao atualizar autor')
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async () => {
    if (!deleteConfirm) return

    setLoading(true)
    setError('')

    try {
      // Verificar se o autor tem posts
      const { data: posts, error: postsError } = await supabase
        .from('blog_posts')
        .select('id')
        .eq('author_id', authorId)
        .limit(1)

      if (postsError) {
        setError('Erro ao verificar posts do autor')
        return
      }

      if (posts && posts.length > 0) {
        setError('Não é possível deletar autor que possui posts')
        return
      }

      const { error } = await supabase
        .from('blog_authors')
        .delete()
        .eq('id', authorId)

      if (error) {
        if (error.code === 'PGRST116') {
          setError('Autor não encontrado')
        } else {
          setError('Erro ao deletar autor')
        }
      } else {
        router.push('/admin/autores')
      }
    } catch (err) {
      setError('Erro ao deletar autor')
    } finally {
      setLoading(false)
      setDeleteConfirm(false)
    }
  }

  if (loadingAuthor) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
          <p className="mt-4 text-gray-600">Carregando autor...</p>
        </div>
      </div>
    )
  }

  if (!author) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600">Autor não encontrado</p>
          <Link href="/admin/autores" className="text-blue-600 hover:text-blue-500 mt-2 inline-block">
            ← Voltar aos autores
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
            <Link href="/admin/autores" className="text-gray-500 hover:text-gray-700">
              ← Voltar aos Autores
            </Link>
            <h1 className="text-xl font-semibold text-gray-900">
              Editar Autor: {author.name}
            </h1>
          </div>
        </div>
      </nav>

      <div className="max-w-3xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="bg-white shadow rounded-lg">
            <form onSubmit={handleSubmit} className="space-y-6 p-6">
              {error && (
                <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md">
                  {error}
                </div>
              )}

              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                  Nome *
                </label>
                <input
                  type="text"
                  id="name"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
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
                  URL amigável do autor. Será usado em /blog/autor/{formData.slug || 'slug'}
                </p>
              </div>

              <div>
                <label htmlFor="bio" className="block text-sm font-medium text-gray-700 mb-2">
                  Biografia
                </label>
                <textarea
                  id="bio"
                  rows={4}
                  value={formData.bio}
                  onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                  className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  placeholder="Breve descrição sobre o autor..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Avatar
                </label>
                
                {/* Preview do avatar atual */}
                {formData.avatar_url && (
                  <div className="mb-3">
                    <div className="flex items-center space-x-3">
                      <img
                        src={formData.avatar_url}
                        alt="Avatar preview"
                        className="w-16 h-16 rounded-full object-cover border border-gray-300"
                      />
                      <div>
                        <p className="text-sm text-gray-500">Avatar atual</p>
                        <button
                          type="button"
                          onClick={() => setFormData(prev => ({ ...prev, avatar_url: '' }))}
                          className="text-xs text-red-600 hover:text-red-500"
                        >
                          Remover
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {/* Upload de novo avatar */}
                <div className="mb-3">
                  <label htmlFor="avatar-upload" className="block">
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:border-blue-400 cursor-pointer">
                      {uploadingAvatar ? (
                        <div className="py-2">
                          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600 mx-auto"></div>
                          <p className="mt-2 text-sm text-gray-600">Fazendo upload...</p>
                        </div>
                      ) : (
                        <div className="py-2">
                          <svg className="mx-auto h-8 w-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                          </svg>
                          <p className="mt-2 text-sm text-gray-600">Clique para fazer upload de um novo avatar</p>
                          <p className="text-xs text-gray-500">JPG, PNG, GIF até 2MB</p>
                        </div>
                      )}
                    </div>
                  </label>
                  <input
                    id="avatar-upload"
                    type="file"
                    accept="image/*"
                    onChange={handleAvatarUpload}
                    disabled={uploadingAvatar}
                    className="hidden"
                  />
                </div>

                {avatarError && (
                  <p className="text-sm text-red-600 mb-3">{avatarError}</p>
                )}

                {/* URL manual (alternativa) */}
                <div>
                  <label htmlFor="avatar_url" className="block text-sm font-medium text-gray-700 mb-2">
                    Ou insira URL manualmente
                  </label>
                  <input
                    type="url"
                    id="avatar_url"
                    value={formData.avatar_url}
                    onChange={(e) => setFormData({ ...formData, avatar_url: e.target.value })}
                    className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    placeholder="https://exemplo.com/avatar.jpg"
                  />
                  <p className="mt-1 text-sm text-gray-500">
                    Recomendado: 40x40px ou maior
                  </p>
                </div>
              </div>

              <div className="border-t border-gray-200 pt-6">
                <div className="flex justify-between items-center">
                  <div>
                    {author.posts_count === 0 ? (
                      <button
                        type="button"
                        onClick={() => setDeleteConfirm(!deleteConfirm)}
                        className="bg-red-600 py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                      >
                        {deleteConfirm ? 'Confirmar Exclusão' : 'Deletar Autor'}
                      </button>
                    ) : (
                      <p className="text-sm text-gray-500">
                        Este autor possui {author.posts_count} posts e não pode ser deletado
                      </p>
                    )}
                    
                    {deleteConfirm && author.posts_count === 0 && (
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

                  <div className="flex space-x-3">
                    <Link
                      href="/admin/autores"
                      className="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                      Cancelar
                    </Link>
                    <button
                      type="submit"
                      disabled={loading}
                      className="bg-blue-600 py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
                    >
                      {loading ? 'Salvando...' : 'Salvar Alterações'}
                    </button>
                  </div>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}