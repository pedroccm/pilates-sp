'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { supabase } from '@/lib/supabase'

interface Author {
  id: string
  name: string
  slug: string
  bio?: string
  avatar_url?: string
  posts_count: number
}

export default function AutoresAdmin() {
  const [authors, setAuthors] = useState<Author[]>([])
  const [loading, setLoading] = useState(true)
  const [deleteLoading, setDeleteLoading] = useState<string | null>(null)
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null)

  useEffect(() => {
    fetchAuthors()
  }, [])

  const fetchAuthors = async () => {
    try {
      const { data, error } = await supabase
        .from('blog_authors')
        .select('*')
        .order('name')

      if (error) {
        console.error('Error fetching authors:', error)
      } else {
        setAuthors(data || [])
      }
    } catch (error) {
      console.error('Error fetching authors:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (authorId: string) => {
    if (deleteConfirm !== authorId) return

    setDeleteLoading(authorId)

    try {
      // Verificar se o autor tem posts
      const { data: posts, error: postsError } = await supabase
        .from('blog_posts')
        .select('id')
        .eq('author_id', authorId)
        .limit(1)

      if (postsError) {
        console.error('Error checking author posts:', postsError)
        return
      }

      if (posts && posts.length > 0) {
        alert('Não é possível deletar autor que possui posts')
        return
      }

      // Deletar autor
      const { error } = await supabase
        .from('blog_authors')
        .delete()
        .eq('id', authorId)

      if (error) {
        console.error('Error deleting author:', error)
        alert('Erro ao deletar autor')
      } else {
        // Atualizar lista
        await fetchAuthors()
      }
    } catch (error) {
      console.error('Error deleting author:', error)
      alert('Erro ao deletar autor')
    } finally {
      setDeleteLoading(null)
      setDeleteConfirm(null)
    }
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
                Gerenciar Autores
              </h1>
            </div>
            <div className="flex items-center">
              <Link
                href="/admin/autores/novo"
                className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md text-sm font-medium"
              >
                Novo Autor
              </Link>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          {loading ? (
            <div className="bg-white shadow rounded-lg p-6 text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
              <p className="mt-2 text-sm text-gray-600">Carregando autores...</p>
            </div>
          ) : authors.length === 0 ? (
            <div className="bg-white shadow rounded-lg p-6 text-center">
              <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              <h3 className="mt-2 text-sm font-medium text-gray-900">Nenhum autor encontrado</h3>
              <p className="mt-1 text-sm text-gray-500">
                Comece criando um novo autor.
              </p>
              <div className="mt-6">
                <Link
                  href="/admin/autores/novo"
                  className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700"
                >
                  Criar Primeiro Autor
                </Link>
              </div>
            </div>
          ) : (
            <div className="bg-white shadow rounded-lg overflow-hidden">
              <div className="px-4 py-5 sm:p-6">
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                  {authors.map(author => (
                    <div key={author.id} className="bg-gray-50 rounded-lg p-6">
                      <div className="flex items-center space-x-4">
                        <div className="flex-shrink-0">
                          {author.avatar_url ? (
                            <Image
                              src={author.avatar_url}
                              alt={author.name}
                              width={48}
                              height={48}
                              className="rounded-full"
                            />
                          ) : (
                            <div className="w-12 h-12 bg-gray-300 rounded-full flex items-center justify-center">
                              <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                              </svg>
                            </div>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900 truncate">
                            {author.name}
                          </p>
                          <p className="text-sm text-gray-500 truncate">
                            @{author.slug}
                          </p>
                          <p className="text-xs text-gray-400 mt-1">
                            {author.posts_count} posts
                          </p>
                        </div>
                      </div>

                      {author.bio && (
                        <p className="mt-3 text-sm text-gray-600 line-clamp-2">
                          {author.bio}
                        </p>
                      )}

                      <div className="mt-4 flex justify-between">
                        <Link
                          href={`/admin/autores/editar/${author.id}`}
                          className="text-blue-600 hover:text-blue-500 text-sm font-medium"
                        >
                          Editar
                        </Link>
                        {author.posts_count === 0 && (
                          <div>
                            {deleteConfirm === author.id ? (
                              <div className="space-x-2">
                                <button
                                  onClick={() => handleDelete(author.id)}
                                  disabled={deleteLoading === author.id}
                                  className="text-red-800 hover:text-red-900 text-xs font-medium disabled:opacity-50"
                                >
                                  {deleteLoading === author.id ? 'Deletando...' : 'Confirmar'}
                                </button>
                                <button
                                  onClick={() => setDeleteConfirm(null)}
                                  className="text-gray-600 hover:text-gray-500 text-xs font-medium"
                                >
                                  Cancelar
                                </button>
                              </div>
                            ) : (
                              <button
                                onClick={() => setDeleteConfirm(author.id)}
                                className="text-red-600 hover:text-red-500 text-sm font-medium"
                              >
                                Deletar
                              </button>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}