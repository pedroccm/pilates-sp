import { NextResponse } from 'next/server'
import { invalidateSitemapCache } from '@/lib/sitemap-cache'

// Endpoint para invalidar cache do sitemap
// Pode ser chamado via webhook do Supabase ou manualmente
export async function POST(request: Request) {
  try {
    // Verificar se tem uma chave de API para segurança (opcional)
    const authHeader = request.headers.get('authorization')
    const expectedToken = process.env.SITEMAP_REFRESH_TOKEN
    
    if (expectedToken && authHeader !== `Bearer ${expectedToken}`) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Invalidar cache e notificar search engines
    await invalidateSitemapCache()

    return NextResponse.json({ 
      success: true, 
      message: 'Sitemap cache invalidated and search engines notified',
      timestamp: new Date().toISOString()
    })
  } catch (error) {
    console.error('Error refreshing sitemap cache:', error)
    return NextResponse.json({ 
      error: 'Failed to refresh sitemap cache',
      timestamp: new Date().toISOString()
    }, { status: 500 })
  }
}

// Endpoint GET para verificar status
export async function GET() {
  return NextResponse.json({
    message: 'Sitemap refresh endpoint is active',
    endpoints: {
      refresh: '/api/sitemap/refresh (POST)',
      sitemaps: [
        '/sitemap.xml',
        '/sitemap-pages.xml',
        '/sitemap-cities.xml', 
        '/sitemap-neighborhoods.xml',
        '/sitemap-studios.xml'
      ]
    },
    timestamp: new Date().toISOString()
  })
}