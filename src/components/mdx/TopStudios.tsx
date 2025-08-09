'use client'

import { useEffect, useState } from 'react'
import { getBlogPosts } from '@/lib/blog-api'
import { supabase } from '@/lib/supabase'
import Link from 'next/link'
import Image from 'next/image'

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

interface TopStudiosProps {
  city: string
  limit?: number
  minRating?: number
}

export function TopStudios({ city, limit = 5, minRating = 4.0 }: TopStudiosProps) {
  const [studios, setStudios] = useState<Studio[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchTopStudios() {
      try {
        const { data, error } = await supabase
          .from('studios')
          .select('id, title, slug, total_score, reviews_count, neighborhood, phone, website, image_url')
          .eq('city_code', city)
          .gte('total_score', minRating)
          .gte('reviews_count', 5) // Pelo menos 5 reviews
          .order('total_score', { ascending: false })
          .order('reviews_count', { ascending: false })
          .limit(limit)

        if (error) throw error

        setStudios(data || [])
      } catch (error) {
        console.error('Error fetching top studios:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchTopStudios()
  }, [city, limit, minRating])

  if (loading) {
    return (
      <div className="space-y-4">
        {Array.from({ length: limit }).map((_, i) => (
          <div key={i} className="animate-pulse">
            <div className="bg-gray-200 h-20 rounded-lg"></div>
          </div>
        ))}
      </div>
    )
  }

  if (studios.length === 0) {
    return (
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
        <p className="text-yellow-800">
          Nenhum estúdio encontrado com avaliação acima de {minRating}⭐ em {city.toUpperCase()}.
        </p>
      </div>
    )
  }

  return (
    <div className="not-prose">
      <div className="grid gap-4 my-6">
        {studios.map((studio, index) => (
          <div 
            key={studio.id} 
            className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <span className="bg-blue-100 text-blue-800 text-sm font-semibold px-2 py-1 rounded">
                    #{index + 1}
                  </span>
                  <div className="flex items-center text-yellow-500">
                    {'★'.repeat(Math.floor(studio.total_score))}
                    <span className="ml-1 text-sm text-gray-600">
                      {studio.total_score.toFixed(1)} ({studio.reviews_count} reviews)
                    </span>
                  </div>
                </div>
                
                <h3 className="font-semibold text-lg text-gray-900 mb-1">
                  {studio.title}
                </h3>
                
                <p className="text-gray-600 text-sm mb-2">
                  📍 {studio.neighborhood}
                </p>

                <div className="flex gap-2">
                  {studio.website && (
                    <a
                      href={studio.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-green-600 hover:text-green-800 text-sm font-medium"
                    >
                      🌐 Website
                    </a>
                  )}
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
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mt-4">
        <p className="text-blue-800 text-sm">
          📊 <strong>{studios.length}</strong> melhores estúdios com avaliação acima de {minRating}⭐ em{' '}
          <strong>{city.toUpperCase()}</strong>
        </p>
      </div>
    </div>
  )
}