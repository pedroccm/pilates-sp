import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase-admin'

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get('file') as File | null

    if (!file) {
      return NextResponse.json({ error: 'Nenhum arquivo enviado' }, { status: 400 })
    }

    // Validar tipo de arquivo
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp']
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json({ error: 'Tipo de arquivo não suportado' }, { status: 400 })
    }

    // Validar tamanho (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      return NextResponse.json({ error: 'Arquivo muito grande. Máximo 5MB' }, { status: 400 })
    }

    // Gerar nome único para o arquivo
    const timestamp = Date.now()
    const randomString = Math.random().toString(36).substring(2, 15)
    const fileExtension = file.name.split('.').pop()?.toLowerCase() || 'jpg'
    const fileName = `blog/${timestamp}-${randomString}.${fileExtension}`

    // Converter file para arrayBuffer
    const arrayBuffer = await file.arrayBuffer()

    // Upload para Supabase Storage
    const { data, error } = await supabaseAdmin.storage
      .from('pilates')
      .upload(fileName, arrayBuffer, {
        contentType: file.type,
        upsert: false
      })

    if (error) {
      console.error('Supabase storage error:', error)
      return NextResponse.json({ error: 'Erro ao fazer upload no storage' }, { status: 500 })
    }

    // Gerar URL pública manualmente (já que o bucket pode ter RLS)
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
    const publicUrl = `${supabaseUrl}/storage/v1/object/public/pilates/${fileName}`

    return NextResponse.json({
      success: true,
      url: publicUrl,
      filename: fileName,
      path: data.path,
      size: file.size,
      type: file.type
    })

  } catch (error) {
    console.error('Error uploading file:', error)
    return NextResponse.json({ error: 'Erro interno do servidor' }, { status: 500 })
  }
}