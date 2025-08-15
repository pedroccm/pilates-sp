import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

// GET - Buscar autor por ID
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const { data: author, error } = await supabase
      .from('blog_authors')
      .select('*')
      .eq('id', id)
      .single()

    if (error) {
      if (error.code === 'PGRST116') { // Not found
        return NextResponse.json({ error: 'Autor não encontrado' }, { status: 404 })
      }
      throw error
    }

    return NextResponse.json(author)
  } catch (error) {
    console.error('Error fetching author:', error)
    return NextResponse.json({ error: 'Erro ao buscar autor' }, { status: 500 })
  }
}

// PUT - Atualizar autor
export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    console.log('PUT - ID recebido:', id)
    const body = await request.json()
    console.log('PUT - Body recebido:', body)
    const { name, slug, bio, avatar_url } = body

    if (!name || !slug) {
      return NextResponse.json({ error: 'Nome e slug são obrigatórios' }, { status: 400 })
    }

    const { data: author, error } = await supabase
      .from('blog_authors')
      .update({
        name,
        slug,
        bio: bio || null,
        avatar_url: avatar_url || null
      })
      .eq('id', id)
      .select()
      .single()

    console.log('PUT - Resultado Supabase:', { data: author, error })

    if (error) {
      console.log('PUT - Erro Supabase:', error)
      if (error.code === 'PGRST116') {
        return NextResponse.json({ error: 'Autor não encontrado' }, { status: 404 })
      }
      if (error.code === '23505') {
        return NextResponse.json({ error: 'Slug já existe' }, { status: 400 })
      }
      throw error
    }

    return NextResponse.json(author)
  } catch (error) {
    console.error('Error updating author:', error)
    return NextResponse.json({ error: 'Erro ao atualizar autor' }, { status: 500 })
  }
}

// DELETE - Deletar autor
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    // Verificar se o autor tem posts
    const { data: posts, error: postsError } = await supabase
      .from('blog_posts')
      .select('id')
      .eq('author_id', id)
      .limit(1)

    if (postsError) throw postsError

    if (posts && posts.length > 0) {
      return NextResponse.json(
        { error: 'Não é possível deletar autor que possui posts' },
        { status: 400 }
      )
    }

    const { error } = await supabase
      .from('blog_authors')
      .delete()
      .eq('id', id)

    if (error) {
      if (error.code === 'PGRST116') {
        return NextResponse.json({ error: 'Autor não encontrado' }, { status: 404 })
      }
      throw error
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting author:', error)
    return NextResponse.json({ error: 'Erro ao deletar autor' }, { status: 500 })
  }
}