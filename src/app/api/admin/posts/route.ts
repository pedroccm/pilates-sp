import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

// GET - Listar posts para admin (com mais detalhes)
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '20')
    const status = searchParams.get('status') // draft, published, archived
    const search = searchParams.get('search')
    
    const offset = (page - 1) * limit

    let query = supabase
      .from('blog_posts')
      .select(`
        *,
        blog_categories (
          id,
          name,
          slug,
          color
        ),
        blog_authors (
          id,
          name,
          slug
        )
      `)

    // Filtros
    if (status) {
      query = query.eq('status', status)
    }
    
    if (search) {
      query = query.or(`title.ilike.%${search}%,excerpt.ilike.%${search}%`)
    }

    // Contar total
    const { count } = await query.range(0, 0)

    // Buscar posts
    const { data: posts, error } = await query
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1)

    if (error) throw error

    return NextResponse.json({
      posts: posts || [],
      total: count || 0,
      hasMore: (count || 0) > offset + (posts?.length || 0)
    })
  } catch (error) {
    console.error('Error fetching posts:', error)
    return NextResponse.json({ error: 'Erro ao buscar posts' }, { status: 500 })
  }
}

// POST - Criar novo post
export async function POST(request: Request) {
  try {
    const body = await request.json()
    const {
      title,
      slug,
      excerpt,
      content,
      meta_title,
      meta_description,
      featured_image,
      featured_image_alt,
      status = 'draft',
      featured = false,
      category_id,
      author_id,
      published_at
    } = body

    if (!title || !slug) {
      return NextResponse.json({ error: 'Título e slug são obrigatórios' }, { status: 400 })
    }

    // Calcular tempo de leitura aproximado (200 palavras por minuto)
    const wordCount = content ? content.split(/\s+/).length : 0
    const reading_time = Math.max(1, Math.round(wordCount / 200))

    const { data: post, error } = await supabase
      .from('blog_posts')
      .insert({
        title,
        slug,
        excerpt: excerpt || null,
        content: content || null,
        meta_title: meta_title || title,
        meta_description: meta_description || excerpt,
        featured_image: featured_image || null,
        featured_image_alt: featured_image_alt || null,
        status,
        featured,
        category_id: category_id || null,
        author_id: author_id || null,
        published_at: status === 'published' ? (published_at || new Date().toISOString()) : null,
        reading_time,
        views: 0
      })
      .select()
      .single()

    if (error) {
      if (error.code === '23505') {
        return NextResponse.json({ error: 'Slug já existe' }, { status: 400 })
      }
      throw error
    }

    return NextResponse.json(post, { status: 201 })
  } catch (error) {
    console.error('Error creating post:', error)
    return NextResponse.json({ error: 'Erro ao criar post' }, { status: 500 })
  }
}