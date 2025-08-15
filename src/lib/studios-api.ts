import { supabase } from './supabase'
import { Studio } from '@/types/studio'
import { isWhatsAppNumber } from '@/utils/whatsapp'

export interface StudioSearchParams {
  cityCode?: string
  searchTerm?: string
  neighborhoods?: string[]
  minRating?: number
  hasWhatsAppOnly?: boolean
  hasWebsiteOnly?: boolean
  page?: number
  limit?: number
}

export interface StudioSearchResult {
  studios: Studio[]
  total: number
  page: number
  totalPages: number
  hasMore: boolean
}

// Convert database format to frontend Studio type
function dbStudioToStudio(dbStudio: any): Studio {
  return {
    title: dbStudio.title,
    totalScore: dbStudio.total_score,
    reviewsCount: dbStudio.reviews_count,
    street: dbStudio.street,
    postalCode: dbStudio.postal_code,
    neighborhood: dbStudio.neighborhood,
    state: dbStudio.state,
    phone: dbStudio.phone,
    categoryName: dbStudio.category_name,
    url: dbStudio.url,
    imageUrl: dbStudio.image_url,
    website: dbStudio.website,
    openingHours: dbStudio.opening_hours || [],
    location: dbStudio.location,
    address: dbStudio.address,
    city: dbStudio.city_code,
    slug: dbStudio.slug,
    uniqueId: dbStudio.id
  }
}

export async function searchStudios(params: StudioSearchParams = {}): Promise<StudioSearchResult> {
  const {
    cityCode = '',
    searchTerm = '',
    neighborhoods = [],
    minRating = 0,
    hasWhatsAppOnly = false,
    hasWebsiteOnly = false,
    page = 1,
    limit = 100
  } = params

  const offset = (page - 1) * limit

  try {
    // Use the stored procedure for complex search
    const { data, error } = await supabase
      .rpc('search_studios', {
        search_text: searchTerm,
        city_filter: cityCode,
        neighborhood_filter: neighborhoods,
        min_rating: minRating,
        has_whatsapp: hasWhatsAppOnly,
        has_website: hasWebsiteOnly,
        limit_count: limit,
        offset_count: offset
      })

    if (error) {
      console.error('Error searching studios:', error)
      throw new Error(`Failed to search studios: ${error.message}`)
    }

    const studios = (data || []).map(dbStudioToStudio)
    const total = data && data.length > 0 ? Number(data[0].total_count) : 0
    const totalPages = Math.ceil(total / limit)

    return {
      studios,
      total,
      page,
      totalPages,
      hasMore: page < totalPages
    }
  } catch (error) {
    console.error('Error in searchStudios:', error)
    throw error
  }
}

export async function getStudioBySlug(slug: string): Promise<Studio | null> {
  try {
    const { data, error } = await supabase
      .from('studios')
      .select('*')
      .eq('slug', slug)
      .single()

    if (error) {
      if (error.code === 'PGRST116') {
        return null // Not found
      }
      throw new Error(`Failed to get studio: ${error.message}`)
    }

    return dbStudioToStudio(data)
  } catch (error) {
    console.error('Error in getStudioBySlug:', error)
    throw error
  }
}

export async function getNeighborhoodsByCity(cityCode: string): Promise<string[]> {
  try {
    const { data, error } = await supabase
      .from('studios')
      .select('neighborhood')
      .eq('city_code', cityCode)
      .order('neighborhood')

    if (error) {
      throw new Error(`Failed to get neighborhoods: ${error.message}`)
    }

    const uniqueNeighborhoods = [...new Set(data.map(item => item.neighborhood))]
    return uniqueNeighborhoods.sort()
  } catch (error) {
    console.error('Error in getNeighborhoodsByCity:', error)
    throw error
  }
}

export async function getCityStats(cityCode: string) {
  try {
    const { data, error } = await supabase
      .from('studios')
      .select('total_score, reviews_count')
      .eq('city_code', cityCode)

    if (error) {
      throw new Error(`Failed to get city stats: ${error.message}`)
    }

    const totalStudios = data.length
    const avgRating = data.reduce((sum, studio) => sum + studio.total_score, 0) / totalStudios
    const totalReviews = data.reduce((sum, studio) => sum + studio.reviews_count, 0)

    return {
      totalStudios,
      avgRating: Math.round(avgRating * 10) / 10,
      totalReviews
    }
  } catch (error) {
    console.error('Error in getCityStats:', error)
    throw error
  }
}

// Fallback function for client-side filtering (if needed)
export function applyClientFilters(
  studios: Studio[],
  params: Omit<StudioSearchParams, 'cityCode' | 'page' | 'limit'>
): Studio[] {
  const {
    searchTerm = '',
    neighborhoods = [],
    minRating = 0,
    hasWhatsAppOnly = false,
    hasWebsiteOnly = false
  } = params

  return studios.filter(studio => {
    const matchesSearch = !searchTerm || 
      studio.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      studio.neighborhood.toLowerCase().includes(searchTerm.toLowerCase())
      
    const matchesNeighborhoods = neighborhoods.length === 0 || 
      neighborhoods.includes(studio.neighborhood)
      
    const matchesRating = studio.totalScore >= minRating
    
    const matchesWhatsApp = !hasWhatsAppOnly || isWhatsAppNumber(studio.phone)
    
    const matchesWebsite = !hasWebsiteOnly || (studio.website && studio.website.length > 0)

    return matchesSearch && matchesNeighborhoods && matchesRating && matchesWhatsApp && matchesWebsite
  })
}