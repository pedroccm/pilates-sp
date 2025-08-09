import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function GET() {
  const baseUrl = 'https://pilates-sp.com'
  
  try {
    // Buscar todos os estúdios com paginação para não sobrecarregar
    let allStudios: any[] = []
    let from = 0
    const batchSize = 1000
    let hasMore = true

    while (hasMore) {
      const { data: studios, error } = await supabase
        .from('studios')
        .select('slug, updated_at, city_code')
        .range(from, from + batchSize - 1)
        .order('updated_at', { ascending: false })

      if (error) {
        console.error('Error fetching studios batch:', error)
        throw error
      }

      if (studios && studios.length > 0) {
        allStudios = [...allStudios, ...studios]
        from += batchSize
        hasMore = studios.length === batchSize
      } else {
        hasMore = false
      }

      // Limitador de segurança para evitar loops infinitos
      if (allStudios.length > 10000) {
        console.warn('Sitemap limitado a 10.000 estúdios')
        break
      }
    }

    const studioUrls = allStudios
      .filter(studio => studio.slug && studio.slug.trim() !== '')
      .map(studio => `  <url>
    <loc>${baseUrl}/estudio/${studio.slug}</loc>
    <lastmod>${studio.updated_at || new Date().toISOString()}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>`)
      .join('\n')

    const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${studioUrls}
</urlset>`

    return new NextResponse(sitemap, {
      headers: {
        'Content-Type': 'application/xml',
        'Cache-Control': 'max-age=43200, s-maxage=43200' // Cache por 12 horas
      }
    })
  } catch (error) {
    console.error('Error generating studios sitemap:', error)
    return new NextResponse('Error generating sitemap', { status: 500 })
  }
}