import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function GET() {
  const baseUrl = 'https://pilates-sp.com'
  
  try {
    // Buscar estatísticas por cidade diretamente do Supabase
    const { data: cityStats, error } = await supabase
      .from('studios')
      .select('city_code, updated_at')
      .order('updated_at', { ascending: false })

    if (error) {
      console.error('Error fetching city stats:', error)
      return new NextResponse('Error generating sitemap', { status: 500 })
    }

    // Agrupar por cidade e pegar a data mais recente de cada uma
    const cities = cityStats?.reduce((acc: any, studio) => {
      const city = studio.city_code
      if (!acc[city] || new Date(studio.updated_at || '') > new Date(acc[city].lastmod)) {
        acc[city] = {
          code: city,
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

    const cityUrls = Object.values(cities || {}).map((city: any) => {
      const citySlug = cityMapping[city.code] || city.code
      return `  <url>
    <loc>${baseUrl}/pilates-${citySlug}</loc>
    <lastmod>${city.lastmod}</lastmod>
    <changefreq>daily</changefreq>
    <priority>0.9</priority>
  </url>`
    }).join('\n')

    const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${cityUrls}
</urlset>`

    return new NextResponse(sitemap, {
      headers: {
        'Content-Type': 'application/xml',
        'Cache-Control': 'max-age=7200, s-maxage=7200' // Cache por 2 horas
      }
    })
  } catch (error) {
    console.error('Error generating cities sitemap:', error)
    return new NextResponse('Error generating sitemap', { status: 500 })
  }
}