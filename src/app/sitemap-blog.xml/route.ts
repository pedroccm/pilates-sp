import { NextResponse } from 'next/server'
import { getBlogPosts, getBlogCategories } from '@/lib/blog-api'

export const dynamic = 'force-static'

export async function GET() {
  const baseUrl = 'https://pilates-sp.com'
  
  try {
    // Buscar posts e categorias do blog
    const posts = await getBlogPosts()
    const categories = await getBlogCategories()
    
    // Gerar URLs do sitemap
    let urls = []
    
    // Página principal do blog
    urls.push(`
      <url>
        <loc>${baseUrl}/blog</loc>
        <lastmod>${new Date().toISOString()}</lastmod>
        <changefreq>daily</changefreq>
        <priority>0.8</priority>
      </url>`)
    
    // Posts do blog
    posts.forEach(post => {
      urls.push(`
        <url>
          <loc>${baseUrl}/blog/${post.slug}</loc>
          <lastmod>${post.updated_at || post.published_at}</lastmod>
          <changefreq>monthly</changefreq>
          <priority>0.7</priority>
        </url>`)
    })
    
    // Categorias do blog
    categories.forEach(category => {
      urls.push(`
        <url>
          <loc>${baseUrl}/blog/categoria/${category.slug}</loc>
          <lastmod>${new Date().toISOString()}</lastmod>
          <changefreq>weekly</changefreq>
          <priority>0.6</priority>
        </url>`)
    })
    
    const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  ${urls.join('')}
</urlset>`

    return new NextResponse(sitemap, {
      headers: {
        'Content-Type': 'application/xml',
        'Cache-Control': 'max-age=3600, s-maxage=3600' // Cache por 1 hora
      }
    })
    
  } catch (error) {
    console.error('Error generating blog sitemap:', error)
    
    // Sitemap básico em caso de erro
    const fallbackSitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>${baseUrl}/blog</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
    <changefreq>daily</changefreq>
    <priority>0.8</priority>
  </url>
</urlset>`

    return new NextResponse(fallbackSitemap, {
      headers: {
        'Content-Type': 'application/xml',
        'Cache-Control': 'max-age=300, s-maxage=300' // Cache menor em caso de erro
      }
    })
  }
}