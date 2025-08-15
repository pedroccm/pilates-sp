'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'

export default function UploadsAdmin() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [uploading, setUploading] = useState(false)
  const [uploadedUrl, setUploadedUrl] = useState<string>('')
  const [error, setError] = useState('')
  const [uploadHistory, setUploadHistory] = useState<string[]>([])

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      // Validar tipo de arquivo
      const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp']
      if (!allowedTypes.includes(file.type)) {
        setError('Tipo de arquivo não suportado. Use JPG, PNG, GIF ou WebP.')
        return
      }

      // Validar tamanho (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setError('Arquivo muito grande. Máximo 5MB.')
        return
      }

      setSelectedFile(file)
      setError('')
    }
  }

  const handleUpload = async () => {
    if (!selectedFile) return

    setUploading(true)
    setError('')

    try {
      const formData = new FormData()
      formData.append('file', selectedFile)

      const response = await fetch('/api/admin/upload', {
        method: 'POST',
        body: formData
      })

      if (response.ok) {
        const data = await response.json()
        setUploadedUrl(data.url)
        setUploadHistory(prev => [data.url, ...prev])
        setSelectedFile(null)
        
        // Reset file input
        const fileInput = document.getElementById('file-input') as HTMLInputElement
        if (fileInput) fileInput.value = ''
      } else {
        const errorData = await response.json()
        setError(errorData.error || 'Erro ao fazer upload')
      }
    } catch (err) {
      setError('Erro ao fazer upload da imagem')
    } finally {
      setUploading(false)
    }
  }

  const copyToClipboard = (url: string) => {
    navigator.clipboard.writeText(url)
    // Aqui você poderia mostrar uma notificação de sucesso
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center h-16 space-x-4">
            <Link href="/admin" className="text-gray-500 hover:text-gray-700">
              ← Voltar ao Dashboard
            </Link>
            <h1 className="text-xl font-semibold text-gray-900">
              Upload de Imagens
            </h1>
          </div>
        </div>
      </nav>

      <div className="max-w-3xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          {/* Upload Form */}
          <div className="bg-white shadow rounded-lg p-6 mb-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Fazer Upload</h3>
            
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md mb-4">
                {error}
              </div>
            )}

            <div className="space-y-4">
              <div>
                <label htmlFor="file-input" className="block text-sm font-medium text-gray-700 mb-2">
                  Selecionar Imagem
                </label>
                <input
                  id="file-input"
                  type="file"
                  accept="image/*"
                  onChange={handleFileSelect}
                  className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                />
                <p className="mt-1 text-sm text-gray-500">
                  Formatos suportados: JPG, PNG, GIF, WebP. Máximo 5MB.
                </p>
              </div>

              {selectedFile && (
                <div className="p-4 bg-gray-50 rounded-md">
                  <p className="text-sm text-gray-700">
                    <strong>Arquivo selecionado:</strong> {selectedFile.name}
                  </p>
                  <p className="text-sm text-gray-500">
                    Tamanho: {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                  </p>
                </div>
              )}

              <button
                onClick={handleUpload}
                disabled={!selectedFile || uploading}
                className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white px-4 py-2 rounded-md text-sm font-medium disabled:cursor-not-allowed"
              >
                {uploading ? 'Fazendo Upload...' : 'Fazer Upload'}
              </button>
            </div>
          </div>

          {/* Upload Result */}
          {uploadedUrl && (
            <div className="bg-white shadow rounded-lg p-6 mb-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Upload Concluído</h3>
              
              <div className="space-y-4">
                <div className="flex items-center justify-center p-4 border-2 border-dashed border-gray-300 rounded-lg">
                  <Image
                    src={uploadedUrl}
                    alt="Imagem carregada"
                    width={200}
                    height={200}
                    className="max-w-full max-h-48 object-contain"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    URL da Imagem
                  </label>
                  <div className="flex">
                    <input
                      type="text"
                      value={uploadedUrl}
                      readOnly
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-l-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm bg-gray-50"
                    />
                    <button
                      onClick={() => copyToClipboard(uploadedUrl)}
                      className="px-4 py-2 border border-l-0 border-gray-300 rounded-r-md text-sm font-medium text-gray-700 bg-gray-50 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                      Copiar
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Upload History */}
          {uploadHistory.length > 0 && (
            <div className="bg-white shadow rounded-lg p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Imagens Recentes</h3>
              
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {uploadHistory.map((url, index) => (
                  <div key={index} className="relative group">
                    <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden">
                      <Image
                        src={url}
                        alt={`Upload ${index + 1}`}
                        width={150}
                        height={150}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <button
                      onClick={() => copyToClipboard(url)}
                      className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-all duration-200 flex items-center justify-center text-white opacity-0 group-hover:opacity-100 rounded-lg"
                    >
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                      </svg>
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Instruções */}
          <div className="mt-6 bg-blue-50 border border-blue-200 rounded-md p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-blue-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-blue-800">
                  Dicas de Upload
                </h3>
                <div className="mt-2 text-sm text-blue-700">
                  <ul className="list-disc pl-5 space-y-1">
                    <li>Para posts: recomendamos 800x400px (proporção 2:1)</li>
                    <li>Para avatares: recomendamos 40x40px ou maior</li>
                    <li>Use formatos JPG para fotos e PNG para ilustrações</li>
                    <li>Comprima suas imagens antes do upload para melhor performance</li>
                    <li>As imagens são salvas no bucket "pilates" do Supabase Storage</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}