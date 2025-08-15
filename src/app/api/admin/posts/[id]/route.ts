import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

// GET - Buscar post por ID para edição
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const { data: post, error } = await supabase
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
      .eq('id', id)
      .single()

    if (error) {
      if (error.code === 'PGRST116') {
        return NextResponse.json({ error: 'Post não encontrado' }, { status: 404 })
      }
      throw error
    }

    // Buscar tags do post
    const { data: postTags } = await supabase
      .from('blog_post_tags')
      .select(`
        blog_tags (
          id,
          name,
          slug
        )
      `)
      .eq('post_id', id)

    const tags = postTags?.map(pt => pt.blog_tags).filter(Boolean) || []

    return NextResponse.json({
      ...post,
      tags
    })
  } catch (error) {
    console.error('Error fetching post:', error)
    return NextResponse.json({ error: 'Erro ao buscar post' }, { status: 500 })
  }
}

// PUT - Atualizar post
export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
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
      status,
      featured,
      category_id,
      author_id,
      published_at,
      tags = []
    } = body

    if (!title || !slug) {
      return NextResponse.json({ error: 'Título e slug são obrigatórios' }, { status: 400 })
    }

    // Calcular tempo de leitura
    const wordCount = content ? content.split(/\s+/).length : 0
    const reading_time = Math.max(1, Math.round(wordCount / 200))

    // Atualizar post
    const { data: post, error } = await supabase
      .from('blog_posts')
      .update({
        title,
        slug,
        excerpt: excerpt || null,
        content: content || null,
        meta_title: meta_title || title,
        meta_description: meta_description || excerpt,
        featured_image: featured_image || null,
        featured_image_alt: featured_image_alt || null,
        status,
        featured: featured || false,
        category_id: category_id || null,
        author_id: author_id || null,
        published_at: status === 'published' ? (published_at || new Date().toISOString()) : null,
        reading_time
      })
      .eq('id', id)
      .select()
      .single()

    if (error) {
      if (error.code === 'PGRST116') {
        return NextResponse.json({ error: 'Post não encontrado' }, { status: 404 })
      }
      if (error.code === '23505') {
        return NextResponse.json({ error: 'Slug já existe' }, { status: 400 })
      }
      throw error
    }

    // Atualizar tags se fornecidas
    if (Array.isArray(tags)) {
      // Remover tags existentes
      await supabase
        .from('blog_post_tags')
        .delete()
        .eq('post_id', id)

      // Adicionar novas tags
      if (tags.length > 0) {
        const tagInserts = tags.map(tagId => ({
          post_id: id,
          tag_id: tagId
        }))

        await supabase
          .from('blog_post_tags')
          .insert(tagInserts)
      }
    }

    return NextResponse.json(post)
  } catch (error) {
    console.error('Error updating post:', error)
    return NextResponse.json({ error: 'Erro ao atualizar post' }, { status: 500 })
  }
}

// DELETE - Deletar post
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    // Remover tags do post primeiro
    await supabase
      .from('blog_post_tags')
      .delete()
      .eq('post_id', id)

    // Deletar o post
    const { error } = await supabase
      .from('blog_posts')
      .delete()
      .eq('id', id)

    if (error) {
      if (error.code === 'PGRST116') {
        return NextResponse.json({ error: 'Post não encontrado' }, { status: 404 })
      }
      throw error
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting post:', error)
    return NextResponse.json({ error: 'Erro ao deletar post' }, { status: 500 })
  }
}