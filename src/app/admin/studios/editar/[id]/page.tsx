'use client'

import { useState, useEffect, use } from 'react'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'
import { Studio } from '@/types/studio'

export default function EditarStudioPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [studio, setStudio] = useState<Studio | null>(null)
  const [formData, setFormData] = useState({
    title: '',
    street: '',
    neighborhood: '',
    city: '',
    state: '',
    postalCode: '',
    phone: '',
    website: '',
    instagramUrl: '',
    instagram: '',
    categoryName: 'Estúdio de Pilates',
    totalScore: 4.5,
    reviewsCount: 0,
    gympass: false,
    gympass_planos: '',
    totalpass: false,
    totalpass_planos: '',
    destaque: 0,
    cliente: false,
    address: '',
    imageUrl: '',
    url: '',
    slug: '',
    uniqueId: '',
    openingHours: [
      { day: 'Segunda', hours: '06:00 - 22:00' },
      { day: 'Terça', hours: '06:00 - 22:00' },
      { day: 'Quarta', hours: '06:00 - 22:00' },
      { day: 'Quinta', hours: '06:00 - 22:00' },
      { day: 'Sexta', hours: '06:00 - 22:00' },
      { day: 'Sábado', hours: '08:00 - 18:00' },
      { day: 'Domingo', hours: 'Fechado' }
    ],
    location: {
      lat: -23.5505,
      lng: -46.6333
    }
  })

  const router = useRouter()

  useEffect(() => {
    fetchStudio()
  }, [resolvedParams.id])

  const fetchStudio = async () => {
    setLoading(true)
    
    const { data, error } = await supabase
      .from('studios')
      .select('*')
      .eq('id', resolvedParams.id)
      .single()

    if (error) {
      console.error('Erro ao buscar estúdio:', error)
      alert('Erro ao carregar estúdio')
      router.push('/admin/studios')
    } else {
      setStudio(data)
      setFormData({
        title: data.title || '',
        street: data.street || '',
        neighborhood: data.neighborhood || '',
        city: data.city || '',
        state: data.state || '',
        postalCode: data.postal_code || '',
        phone: data.phone || '',
        website: data.website || '',
        instagramUrl: data.instagramUrl || '',
        instagram: data.instagram || '',
        categoryName: data.categoryName || 'Estúdio de Pilates',
        totalScore: data.totalScore || 4.5,
        reviewsCount: data.reviews_count || 0,
        gympass: data.gympass || false,
        gympass_planos: data.gympass_planos || '',
        totalpass: data.totalpass || false,
        totalpass_planos: data.totalpass_planos || '',
        destaque: data.destaque || 0,
        cliente: data.cliente || false,
        address: data.address || '',
        imageUrl: data.imageUrl || '',
        url: data.url || '',
        slug: data.slug || '',
        uniqueId: data.uniqueId || '',
        openingHours: data.openingHours || [
          { day: 'Segunda', hours: '06:00 - 22:00' },
          { day: 'Terça', hours: '06:00 - 22:00' },
          { day: 'Quarta', hours: '06:00 - 22:00' },
          { day: 'Quinta', hours: '06:00 - 22:00' },
          { day: 'Sexta', hours: '06:00 - 22:00' },
          { day: 'Sábado', hours: '08:00 - 18:00' },
          { day: 'Domingo', hours: 'Fechado' }
        ],
        location: data.location || { lat: -23.5505, lng: -46.6333 }
      })
    }

    setLoading(false)
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target
    
    if (type === 'checkbox') {
      const checkbox = e.target as HTMLInputElement
      setFormData(prev => ({
        ...prev,
        [name]: checkbox.checked
      }))
    } else if (type === 'number') {
      setFormData(prev => ({
        ...prev,
        [name]: parseFloat(value) || 0
      }))
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }))
    }
  }

  const handleOpeningHoursChange = (index: number, hours: string) => {
    setFormData(prev => ({
      ...prev,
      openingHours: prev.openingHours.map((item, i) => 
        i === index ? { ...item, hours } : item
      )
    }))
  }

  const generateSlug = (title: string, neighborhood: string, city: string) => {
    const normalize = (str: string) => str
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9\s]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim()

    return `${normalize(title)}-${normalize(neighborhood)}-${normalize(city)}`
  }

  const generateImageSlug = (title: string, neighborhood: string, city: string) => {
    const normalize = (str: string) => str
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9\s]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim()

    const cityCode = city.toLowerCase().includes('são paulo') ? 'sp' : 
                     city.toLowerCase().includes('rio de janeiro') ? 'rj' :
                     city.toLowerCase().includes('belo horizonte') ? 'bh' :
                     city.toLowerCase().includes('curitiba') ? 'cwb' :
                     city.toLowerCase().includes('brasília') ? 'bsb' : 'br'
    
    return `pilates-${normalize(neighborhood)}-${cityCode}-${normalize(title)}`
  }

  const handleImageUpload = async (file: File) => {
    if (!studio) return

    setUploading(true)
    try {
      const uploadFormData = new FormData()
      uploadFormData.append('file', file)
      uploadFormData.append('studioSlug', studio.slug || generateSlug(formData.title, formData.neighborhood, formData.city))

      const response = await fetch('/api/admin/upload/studio-image', {
        method: 'POST',
        body: uploadFormData
      })

      const result = await response.json()

      if (result.success) {
        setFormData(prev => ({
          ...prev,
          imageUrl: result.url
        }))
        alert('Imagem enviada com sucesso!')
      } else {
        throw new Error(result.error || 'Erro ao enviar imagem')
      }
    } catch (error: any) {
      console.error('Erro no upload:', error)
      alert('Erro ao enviar imagem: ' + error.message)
    } finally {
      setUploading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)

    try {
      // Gerar slug e outros campos automáticos
      const slug = generateSlug(formData.title, formData.neighborhood, formData.city)
      const imagemSlug = generateImageSlug(formData.title, formData.neighborhood, formData.city)
      const address = `${formData.street}, ${formData.neighborhood}, ${formData.city}, ${formData.state}`

      const studioData = {
        ...formData,
        postal_code: formData.postalCode,
        reviews_count: formData.reviewsCount,
        slug,
        imagem_slug: imagemSlug,
        address,
        url: `https://pilates-sp.vercel.app/studios/${slug}`,
        imageUrl: formData.imageUrl || '/uploads/studio-placeholder.jpg'
      }
      
      // Remove campos camelCase para não duplicar
      delete studioData.postalCode
      delete studioData.reviewsCount

      const { data, error } = await supabase
        .from('studios')
        .update(studioData)
        .eq('id', resolvedParams.id)
        .select()

      if (error) throw error

      alert('Estúdio atualizado com sucesso!')
      router.push('/admin/studios')
    } catch (error: any) {
      console.error('Erro ao atualizar estúdio:', error)
      alert('Erro ao atualizar estúdio: ' + error.message)
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <p className="mt-2 text-gray-500">Carregando estúdio...</p>
        </div>
      </div>
    )
  }

  if (!studio) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-500">Estúdio não encontrado</p>
          <Link href="/admin/studios" className="text-blue-600 hover:text-blue-700">
            Voltar aos estúdios
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <Link href="/admin/studios" className="text-sm text-gray-500 hover:text-gray-700">
                ← Voltar aos Estúdios
              </Link>
              <h1 className="ml-4 text-xl font-semibold text-gray-900">
                Editar Estúdio: {studio.title}
              </h1>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-4xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Imagem do Estúdio */}
            <div className="bg-white shadow rounded-lg p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Imagem do Estúdio</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Imagem Atual */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Imagem Atual
                  </label>
                  {formData.imageUrl ? (
                    <div className="relative">
                      <img
                        src={formData.imageUrl}
                        alt={formData.title}
                        className="w-full h-48 object-cover rounded-lg border border-gray-300"
                      />
                      <div className="absolute bottom-2 left-2 bg-black bg-opacity-50 text-white text-xs px-2 py-1 rounded">
                        {formData.title}
                      </div>
                    </div>
                  ) : (
                    <div className="w-full h-48 bg-gray-100 rounded-lg border-2 border-dashed border-gray-300 flex items-center justify-center">
                      <div className="text-center text-gray-500">
                        <svg className="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48">
                          <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                        <p className="mt-2 text-sm">Nenhuma imagem</p>
                      </div>
                    </div>
                  )}
                </div>

                {/* Upload Nova Imagem */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Fazer Upload de Nova Imagem
                  </label>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 transition-colors">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files?.[0]
                        if (file) {
                          handleImageUpload(file)
                        }
                      }}
                      disabled={uploading}
                      className="sr-only"
                      id="studio-image-upload"
                    />
                    <label
                      htmlFor="studio-image-upload"
                      className={`cursor-pointer ${uploading ? 'opacity-50 cursor-not-allowed' : ''}`}
                    >
                      <svg className="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48">
                        <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                      <div className="mt-4">
                        <p className="text-sm text-gray-600">
                          {uploading ? 'Enviando...' : 'Clique para fazer upload ou arraste a imagem'}
                        </p>
                        <p className="text-xs text-gray-500 mt-1">
                          PNG, JPG, GIF, WEBP até 10MB
                        </p>
                      </div>
                    </label>
                  </div>
                  {uploading && (
                    <div className="mt-2">
                      <div className="bg-blue-200 rounded-full h-2">
                        <div className="bg-blue-600 h-2 rounded-full animate-pulse" style={{ width: '50%' }}></div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Informações Básicas */}
            <div className="bg-white shadow rounded-lg p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Informações Básicas</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Nome do Estúdio *
                  </label>
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Categoria
                  </label>
                  <select
                    name="categoryName"
                    value={formData.categoryName}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="Estúdio de Pilates">Estúdio de Pilates</option>
                    <option value="Academia">Academia</option>
                    <option value="Centro de Fisioterapia">Centro de Fisioterapia</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Telefone
                  </label>
                  <input
                    type="text"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    placeholder="(11) 99999-9999"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Website
                  </label>
                  <input
                    type="url"
                    name="website"
                    value={formData.website}
                    onChange={handleInputChange}
                    placeholder="https://exemplo.com"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Instagram (handle)
                  </label>
                  <input
                    type="text"
                    name="instagram"
                    value={formData.instagram}
                    onChange={handleInputChange}
                    placeholder="nome_do_studio"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
            </div>

            {/* Localização */}
            <div className="bg-white shadow rounded-lg p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Localização</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Endereço *
                  </label>
                  <input
                    type="text"
                    name="street"
                    value={formData.street}
                    onChange={handleInputChange}
                    required
                    placeholder="Rua, número"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Bairro *
                  </label>
                  <input
                    type="text"
                    name="neighborhood"
                    value={formData.neighborhood}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Cidade *
                  </label>
                  <select
                    name="city"
                    value={formData.city}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Selecione...</option>
                    <option value="São Paulo">São Paulo</option>
                    <option value="Rio de Janeiro">Rio de Janeiro</option>
                    <option value="Belo Horizonte">Belo Horizonte</option>
                    <option value="Curitiba">Curitiba</option>
                    <option value="Brasília">Brasília</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Estado
                  </label>
                  <select
                    name="state"
                    value={formData.state}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="SP">São Paulo</option>
                    <option value="RJ">Rio de Janeiro</option>
                    <option value="MG">Minas Gerais</option>
                    <option value="PR">Paraná</option>
                    <option value="DF">Distrito Federal</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    CEP
                  </label>
                  <input
                    type="text"
                    name="postalCode"
                    value={formData.postalCode}
                    onChange={handleInputChange}
                    placeholder="00000-000"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
            </div>

            {/* Avaliações */}
            <div className="bg-white shadow rounded-lg p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Avaliações</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Nota Média
                  </label>
                  <input
                    type="number"
                    name="totalScore"
                    value={formData.totalScore}
                    onChange={handleInputChange}
                    min="0"
                    max="5"
                    step="0.1"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Número de Avaliações
                  </label>
                  <input
                    type="number"
                    name="reviewsCount"
                    value={formData.reviewsCount}
                    onChange={handleInputChange}
                    min="0"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
            </div>

            {/* Convênios */}
            <div className="bg-white shadow rounded-lg p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Convênios</h3>
              <div className="space-y-4">
                <div>
                  <div className="flex items-center mb-2">
                    <input
                      type="checkbox"
                      name="gympass"
                      checked={formData.gympass}
                      onChange={handleInputChange}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <label className="ml-2 block text-sm font-medium text-gray-700">
                      Aceita Gympass
                    </label>
                  </div>
                  {formData.gympass && (
                    <input
                      type="text"
                      name="gympass_planos"
                      value={formData.gympass_planos}
                      onChange={handleInputChange}
                      placeholder="ex: Bronze, Prata, Ouro"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  )}
                </div>

                <div>
                  <div className="flex items-center mb-2">
                    <input
                      type="checkbox"
                      name="totalpass"
                      checked={formData.totalpass}
                      onChange={handleInputChange}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <label className="ml-2 block text-sm font-medium text-gray-700">
                      Aceita TotalPass
                    </label>
                  </div>
                  {formData.totalpass && (
                    <input
                      type="text"
                      name="totalpass_planos"
                      value={formData.totalpass_planos}
                      onChange={handleInputChange}
                      placeholder="ex: Smart, Plus, Premium"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  )}
                </div>
              </div>
            </div>

            {/* Status e Destaque */}
            <div className="bg-white shadow rounded-lg p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Status e Destaque</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      name="cliente"
                      checked={formData.cliente}
                      onChange={handleInputChange}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <label className="ml-2 block text-sm font-medium text-gray-700">
                      É cliente da plataforma
                    </label>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Posição de Destaque
                  </label>
                  <select
                    name="destaque"
                    value={formData.destaque}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value={0}>Sem destaque</option>
                    <option value={1}>1º destaque</option>
                    <option value={2}>2º destaque</option>
                    <option value={3}>3º destaque</option>
                    <option value={4}>4º destaque</option>
                    <option value={5}>5º destaque</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Horários de Funcionamento */}
            <div className="bg-white shadow rounded-lg p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Horários de Funcionamento</h3>
              <div className="space-y-3">
                {formData.openingHours.map((schedule, index) => (
                  <div key={schedule.day} className="flex items-center space-x-4">
                    <div className="w-20 text-sm font-medium text-gray-700">
                      {schedule.day}
                    </div>
                    <input
                      type="text"
                      value={schedule.hours}
                      onChange={(e) => handleOpeningHoursChange(index, e.target.value)}
                      placeholder="06:00 - 22:00"
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Botões */}
            <div className="flex justify-end space-x-4">
              <Link
                href="/admin/studios"
                className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                Cancelar
              </Link>
              <button
                type="submit"
                disabled={saving}
                className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
              >
                {saving ? 'Salvando...' : 'Salvar Alterações'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}