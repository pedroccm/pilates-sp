'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'

interface LiveStatsProps {
  city: string
}

interface Stats {
  totalStudios: number
  averageRating: number
  totalReviews: number
  studiosWithWebsite: number
  studiosWithWhatsApp: number
}

export function LiveStats({ city }: LiveStatsProps) {
  const [stats, setStats] = useState<Stats | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchStats() {
      try {
        // Buscar estatísticas básicas
        const { data: studiosData, error } = await supabase
          .from('studios')
          .select('total_score, reviews_count, website, phone')
          .eq('city_code', city)

        if (error) throw error

        if (!studiosData) {
          setStats(null)
          return
        }

        // Calcular estatísticas
        const totalStudios = studiosData.length
        const validRatings = studiosData.filter(s => s.total_score > 0)
        const averageRating = validRatings.length > 0 
          ? validRatings.reduce((sum, s) => sum + s.total_score, 0) / validRatings.length
          : 0
        const totalReviews = studiosData.reduce((sum, s) => sum + (s.reviews_count || 0), 0)
        const studiosWithWebsite = studiosData.filter(s => s.website && s.website.trim() !== '').length
        const studiosWithWhatsApp = studiosData.filter(s => 
          s.phone && /^(\+55\s?)?(\(?\d{2}\)?\s?)?\d{4,5}-?\d{4}$/.test(s.phone)
        ).length

        setStats({
          totalStudios,
          averageRating,
          totalReviews,
          studiosWithWebsite,
          studiosWithWhatsApp
        })
      } catch (error) {
        console.error('Error fetching stats:', error)
        setStats(null)
      } finally {
        setLoading(false)
      }
    }

    fetchStats()
  }, [city])

  if (loading) {
    return (
      <div className="not-prose">
        <div className="bg-gray-50 rounded-lg p-6 animate-pulse">
          <div className="h-4 bg-gray-200 rounded mb-4"></div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="text-center">
                <div className="h-8 bg-gray-200 rounded mb-2"></div>
                <div className="h-4 bg-gray-200 rounded"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  if (!stats) {
    return (
      <div className="not-prose">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-800">
            Erro ao carregar estatísticas para {city.toUpperCase()}.
          </p>
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
    <div className="not-prose my-8">
      <div className="bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 text-center">
          📊 Pilates em {cityNames[city] || city.toUpperCase()} - Dados em Tempo Real
        </h3>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600 mb-1">
              {stats.totalStudios.toLocaleString()}
            </div>
            <div className="text-sm text-gray-600">Estúdios</div>
          </div>
          
          <div className="text-center">
            <div className="text-2xl font-bold text-yellow-600 mb-1 flex items-center justify-center">
              {stats.averageRating.toFixed(1)}
              <span className="text-yellow-500 ml-1">★</span>
            </div>
            <div className="text-sm text-gray-600">Avaliação Média</div>
          </div>
          
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600 mb-1">
              {stats.totalReviews.toLocaleString()}
            </div>
            <div className="text-sm text-gray-600">Reviews</div>
          </div>
          
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-600 mb-1">
              {Math.round((stats.studiosWithWhatsApp / stats.totalStudios) * 100)}%
            </div>
            <div className="text-sm text-gray-600">Com WhatsApp</div>
          </div>
        </div>

        <div className="mt-4 pt-4 border-t border-blue-200">
          <div className="flex flex-wrap justify-center gap-4 text-sm text-gray-600">
            <span>🌐 {stats.studiosWithWebsite} com website próprio</span>
            <span>📱 {stats.studiosWithWhatsApp} com WhatsApp</span>
          </div>
        </div>

        <div className="mt-4 text-center">
          <span className="text-xs text-gray-500">
            ⚡ Dados atualizados em tempo real
          </span>
        </div>
      </div>
    </div>
  )
}