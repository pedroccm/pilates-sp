'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import Link from 'next/link'

interface StudioFinderProps {
  city: string
  neighborhood?: string
  beginnerFriendly?: boolean
  limit?: number
  showSearch?: boolean
}

interface Studio {
  id: string
  title: string
  slug: string
  total_score: number
  reviews_count: number
  neighborhood: string
  phone: string
  website?: string
}

export function StudioFinder({ 
  city, 
  neighborhood, 
  beginnerFriendly = false, 
  limit = 6,
  showSearch = true 
}: StudioFinderProps) {
  const [studios, setStudios] = useState<Studio[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedNeighborhood, setSelectedNeighborhood] = useState(neighborhood || '')
  const [neighborhoods, setNeighborhoods] = useState<string[]>([])

  useEffect(() => {
    async function fetchData() {
      try {
        let query = supabase
          .from('studios')
          .select('id, title, slug, total_score, reviews_count, neighborhood, phone, website')
          .eq('city_code', city)

        // Filtros
        if (selectedNeighborhood) {
          query = query.eq('neighborhood', selectedNeighborhood)
        }

        if (beginnerFriendly) {
          // Estúdios com boa avaliação e muitos reviews (mais seguros para iniciantes)
          query = query.gte('total_score', 4.0).gte('reviews_count', 10)
        }

        if (searchTerm) {
          query = query.or(`title.ilike.%${searchTerm}%,neighborhood.ilike.%${searchTerm}%`)
        }

        const { data: studiosData, error } = await query
          .order('total_score', { ascending: false })
          .limit(limit)

        if (error) throw error

        setStudios(studiosData || [])

        // Buscar bairros únicos para o dropdown
        if (neighborhoods.length === 0) {
          const { data: neighborhoodsData } = await supabase
            .from('studios')
            .select('neighborhood')
            .eq('city_code', city)
            .order('neighborhood')

          const uniqueNeighborhoods = [...new Set(
            neighborhoodsData?.map(s => s.neighborhood).filter(Boolean) || []
          )]
          setNeighborhoods(uniqueNeighborhoods)
        }
      } catch (error) {
        console.error('Error fetching studios:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [city, selectedNeighborhood, beginnerFriendly, searchTerm, limit])

  if (loading) {
    return (
      <div className="not-prose my-6">
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <div className="animate-pulse space-y-4">
            <div className="h-4 bg-gray-200 rounded w-1/4"></div>
            <div className="space-y-3">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="h-16 bg-gray-200 rounded"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="not-prose my-6">
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <div className="flex items-center gap-2 mb-4">
          <span className="text-2xl">🔍</span>
          <h3 className="text-lg font-semibold text-gray-900">
            {beginnerFriendly ? 'Estúdios Ideais para Iniciantes' : 'Encontre Seu Estúdio'}
          </h3>
        </div>

        {showSearch && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div>
              <input
                type="text"
                placeholder="Buscar por nome ou bairro..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
              />
            </div>
            <div>
              <select
                value={selectedNeighborhood}
                onChange={(e) => setSelectedNeighborhood(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
              >
                <option value="">Todos os bairros</option>
                {neighborhoods.map(n => (
                  <option key={n} value={n}>{n}</option>
                ))}
              </select>
            </div>
          </div>
        )}

        {studios.length === 0 ? (
          <div className="text-center py-8">
            <span className="text-4xl mb-2 block">😔</span>
            <p className="text-gray-600">
              Nenhum estúdio encontrado com esses filtros.
            </p>
            {beginnerFriendly && (
              <p className="text-sm text-gray-500 mt-1">
                Tente remover o filtro "iniciantes" para ver mais opções.
              </p>
            )}
          </div>
        ) : (
          <>
            <div className="space-y-3 mb-4">
              {studios.map(studio => (
                <div key={studio.id} className="border border-gray-100 rounded-lg p-4 hover:bg-gray-50 transition-colors">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900 mb-1">
                        {studio.title}
                      </h4>
                      <div className="flex items-center gap-4 text-sm text-gray-600 mb-2">
                        <span>📍 {studio.neighborhood}</span>
                        <span className="flex items-center">
                          <span className="text-yellow-500 mr-1">★</span>
                          {studio.total_score.toFixed(1)} ({studio.reviews_count})
                        </span>
                        {beginnerFriendly && (
                          <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs">
                            ✅ Iniciante OK
                          </span>
                        )}
                      </div>
                      <div className="flex gap-3">
                        {studio.phone && (
                          <a
                            href={`https://wa.me/55${studio.phone.replace(/\D/g, '')}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-green-600 hover:text-green-800 text-sm font-medium"
                          >
                            📱 WhatsApp
                          </a>
                        )}
                        {studio.website && (
                          <a
                            href={studio.website}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                          >
                            🌐 Site
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="text-center">
              <Link
                href={`/?city=${city}${selectedNeighborhood ? `&neighborhood=${selectedNeighborhood}` : ''}`}
                className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
              >
                Ver todos os {studios.length < limit ? studios.length : `${limit}+`} estúdios
                <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            </div>
          </>
        )}
      </div>
    </div>
  )
}