import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

// GET - Listar todos os autores
export async function GET() {
  try {
    const { data: authors, error } = await supabase
      .from('blog_authors')
      .select('*')
      .order('name')

    if (error) throw error

    return NextResponse.json(authors)
  } catch (error) {
    console.error('Error fetching authors:', error)
    return NextResponse.json({ error: 'Erro ao buscar autores' }, { status: 500 })
  }
}

// POST - Criar novo autor
export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { name, slug, bio, avatar_url } = body

    if (!name || !slug) {
      return NextResponse.json({ error: 'Nome e slug são obrigatórios' }, { status: 400 })
    }

    const { data: author, error } = await supabase
      .from('blog_authors')
      .insert({
        name,
        slug,
        bio: bio || null,
        avatar_url: avatar_url || null,
        posts_count: 0
      })
      .select()
      .single()

    if (error) {
      if (error.code === '23505') { // Unique constraint violation
        return NextResponse.json({ error: 'Slug já existe' }, { status: 400 })
      }
      throw error
    }

    return NextResponse.json(author, { status: 201 })
  } catch (error) {
    console.error('Error creating author:', error)
    return NextResponse.json({ error: 'Erro ao criar autor' }, { status: 500 })
  }
}