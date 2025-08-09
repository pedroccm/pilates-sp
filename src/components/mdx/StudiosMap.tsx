'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'

interface StudiosMapProps {
  city: string
  neighborhoods?: string[]
  limit?: number
}

interface NeighborhoodStats {
  neighborhood: string
  count: number
  avgRating: number
  topStudio: {
    name: string
    rating: number
  }
}

export function StudiosMap({ city, neighborhoods, limit = 10 }: StudiosMapProps) {
  const [neighborhoodStats, setNeighborhoodStats] = useState<NeighborhoodStats[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchNeighborhoodData() {
      try {
        let query = supabase
          .from('studios')
          .select('neighborhood, title, total_score, reviews_count')
          .eq('city_code', city)
          .gte('total_score', 0.1) // Apenas estúdios com alguma avaliação

        if (neighborhoods && neighborhoods.length > 0) {
          query = query.in('neighborhood', neighborhoods)
        }

        const { data, error } = await query

        if (error) throw error

        // Agrupar por bairro
        const neighborhoodMap = new Map<string, {
          studios: any[]
          totalRating: number
          count: number
        }>()

        data?.forEach(studio => {
          const neighborhood = studio.neighborhood
          if (!neighborhood) return

          const existing = neighborhoodMap.get(neighborhood) || {
            studios: [],
            totalRating: 0,
            count: 0
          }

          existing.studios.push(studio)
          existing.totalRating += studio.total_score
          existing.count += 1

          neighborhoodMap.set(neighborhood, existing)
        })

        // Converter para array e calcular estatísticas
        const stats: NeighborhoodStats[] = Array.from(neighborhoodMap.entries())
          .map(([neighborhood, data]) => {
            const avgRating = data.totalRating / data.count
            const topStudio = data.studios.reduce((best, current) => 
              current.total_score > best.total_score ? current : best
            )

            return {
              neighborhood,
              count: data.count,
              avgRating,
              topStudio: {
                name: topStudio.title,
                rating: topStudio.total_score
              }
            }
          })
          .sort((a, b) => b.count - a.count)
          .slice(0, limit)

        setNeighborhoodStats(stats)
      } catch (error) {
        console.error('Error fetching neighborhood data:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchNeighborhoodData()
  }, [city, neighborhoods, limit])

  if (loading) {
    return (
      <div className="not-prose my-6">
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <div className="animate-pulse space-y-4">
            <div className="h-4 bg-gray-200 rounded w-1/3"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="h-20 bg-gray-200 rounded"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (neighborhoodStats.length === 0) {
    return (
      <div className="not-prose my-6">
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <div className="text-center py-8">
            <span className="text-4xl mb-2 block">🗺️</span>
            <p className="text-gray-600">
              Nenhum dado encontrado para os bairros especificados.
            </p>
          </div>
        </div>
      </div>
    )
  }

  const cityNames: Record<string, string> = {
    sp: 'São Paulo',
    rj: 'Rio de Janeiro',
    bh: 'Belo Horizonte', 
    bsb: 'Brasília',
    cwb: 'Curitiba'
  }

  return (
    <div className="not-prose my-6">
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <div className="flex items-center gap-2 mb-6">
          <span className="text-2xl">🗺️</span>
          <h3 className="text-lg font-semibold text-gray-900">
            Estúdios por Bairro em {cityNames[city] || city.toUpperCase()}
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {neighborhoodStats.map((neighborhood, index) => (
            <div 
              key={neighborhood.neighborhood} 
              className="border border-gray-100 rounded-lg p-4 hover:shadow-md transition-shadow"
            >
              <div className="flex items-start justify-between mb-2">
                <h4 className="font-medium text-gray-900 text-sm">
                  📍 {neighborhood.neighborhood}
                </h4>
                <span className="bg-blue-100 text-blue-800 text-xs font-semibold px-2 py-1 rounded">
                  #{index + 1}
                </span>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Estúdios:</span>
                  <span className="font-semibold text-gray-900">{neighborhood.count}</span>
                </div>

                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Média:</span>
                  <div className="flex items-center">
                    <span className="text-yellow-500 mr-1">★</span>
                    <span className="font-semibold text-gray-900">
                      {neighborhood.avgRating.toFixed(1)}
                    </span>
                  </div>
                </div>

                <div className="pt-2 border-t border-gray-100">
                  <div className="text-xs text-gray-500 mb-1">🏆 Destaque:</div>
                  <div className="text-xs font-medium text-gray-800 line-clamp-1">
                    {neighborhood.topStudio.name}
                  </div>
                  <div className="text-xs text-gray-600">
                    ⭐ {neighborhood.topStudio.rating.toFixed(1)}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {neighborhoods && neighborhoods.length > 0 && (
          <div className="mt-4 p-3 bg-blue-50 rounded-lg">
            <p className="text-blue-800 text-sm">
              🎯 Filtrado para: <strong>{neighborhoods.join(', ')}</strong>
            </p>
          </div>
        )}

        <div className="mt-4 text-center text-xs text-gray-500">
          📊 Dados baseados em estúdios com avaliações • Ordenado por quantidade
        </div>
      </div>
    </div>
  )
}