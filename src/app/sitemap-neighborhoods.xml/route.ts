import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export const dynamic = 'force-static'

export async function GET() {
  const baseUrl = 'https://pilates-sp.com'
  
  try {
    // Buscar todos os bairros únicos com suas cidades
    const { data: neighborhoods, error } = await supabase
      .from('studios')
      .select('neighborhood, city_code, updated_at')
      .order('updated_at', { ascending: false })

    if (error) {
      console.error('Error fetching neighborhoods:', error)
      return new NextResponse('Error generating sitemap', { status: 500 })
    }

    // Agrupar por bairro+cidade e pegar a data mais recente
    const uniqueNeighborhoods = neighborhoods?.reduce((acc: any, studio) => {
      const key = `${studio.neighborhood}-${studio.city_code}`
      if (!acc[key] || new Date(studio.updated_at || '') > new Date(acc[key].lastmod)) {
        acc[key] = {
          neighborhood: studio.neighborhood,
          cityCode: studio.city_code,
          lastmod: studio.updated_at || new Date().toISOString()
        }
      }
      return acc
    }, {})

    const cityMapping: { [key: string]: string } = {
      'sp': 'sao-paulo',
      'rj': 'rio-de-janeiro',
      'bh': 'belo-horizonte', 
      'bsb': 'brasilia',
      'cwb': 'curitiba'
    }

    // Converter para slug URL-friendly
    const slugify = (text: string): string => {
      return text
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '') // Remove acentos
        .replace(/[^a-z0-9\s-]/g, '') // Remove caracteres especiais
        .replace(/\s+/g, '-') // Substitui espaços por hífens
        .replace(/-+/g, '-') // Remove hífens duplicados
        .trim()
    }

    const neighborhoodUrls = Object.values(uniqueNeighborhoods || {})
      .filter((item: any) => item.neighborhood && item.neighborhood.trim() !== '')
      .map((item: any) => {
        const citySlug = cityMapping[item.cityCode] || item.cityCode
        const neighborhoodSlug = slugify(item.neighborhood)
        
        return `  <url>
    <loc>${baseUrl}/pilates-${neighborhoodSlug}-${citySlug}</loc>
    <lastmod>${item.lastmod}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>`
      })
      .join('\n')

    const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${neighborhoodUrls}
</urlset>`

    return new NextResponse(sitemap, {
      headers: {
        'Content-Type': 'application/xml',
        'Cache-Control': 'max-age=21600, s-maxage=21600' // Cache por 6 horas
      }
    })
  } catch (error) {
    console.error('Error generating neighborhoods sitemap:', error)
    return new NextResponse('Error generating sitemap', { status: 500 })
  }
}