'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function NovoAutor() {
  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    bio: '',
    avatar_url: ''
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [uploadingAvatar, setUploadingAvatar] = useState(false)
  const [avatarError, setAvatarError] = useState('')
  const router = useRouter()

  const generateSlug = (name: string) => {
    return name
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/^-+|-+$/g, '')
  }

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const name = e.target.value
    setFormData({
      ...formData,
      name,
      slug: formData.slug === generateSlug(formData.name) ? generateSlug(name) : formData.slug
    })
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
      const response = await fetch('/api/admin/autores', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      })

      if (response.ok) {
        router.push('/admin/autores')
      } else {
        const data = await response.json()
        setError(data.error || 'Erro ao criar autor')
      }
    } catch (err) {
      setError('Erro ao criar autor')
    } finally {
      setLoading(false)
    }
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
              Novo Autor
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
                  onChange={handleNameChange}
                  className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  placeholder="Ex: João Silva"
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
                  placeholder="Ex: joao-silva"
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
                
                {/* Preview do avatar */}
                {formData.avatar_url && (
                  <div className="mb-3">
                    <div className="flex items-center space-x-3">
                      <img
                        src={formData.avatar_url}
                        alt="Avatar preview"
                        className="w-16 h-16 rounded-full object-cover border border-gray-300"
                      />
                      <div>
                        <p className="text-sm text-gray-500">Avatar selecionado</p>
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

                {/* Upload de avatar */}
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
                          <p className="mt-2 text-sm text-gray-600">Clique para fazer upload do avatar</p>
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

              <div className="flex justify-end space-x-3">
                <Link
                  href="/admin/autores"
                  className="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Cancelar
                </Link>
                <button
                  type="submit"
                  disabled={loading}
                  className="bg-green-600 py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50"
                >
                  {loading ? 'Criando...' : 'Criar Autor'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}