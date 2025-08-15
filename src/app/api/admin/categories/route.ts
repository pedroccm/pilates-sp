import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function GET() {
  try {
    const { data: categories, error } = await supabase
      .from('blog_categories')
      .select('*')
      .order('name')

    if (error) throw error

    return NextResponse.json(categories || [])
  } catch (error) {
    console.error('Error fetching categories:', error)
    return NextResponse.json({ error: 'Erro ao buscar categorias' }, { status: 500 })
  }
}