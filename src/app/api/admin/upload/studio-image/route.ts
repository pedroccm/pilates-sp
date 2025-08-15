import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase-admin'

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get('file') as File | null
    const studioSlug = formData.get('studioSlug') as string | null

    if (!file) {
      return NextResponse.json({ error: 'Nenhum arquivo enviado' }, { status: 400 })
    }

    if (!studioSlug) {
      return NextResponse.json({ error: 'Studio slug é obrigatório' }, { status: 400 })
    }

    // Validar tipo de arquivo
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp']
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json({ error: 'Tipo de arquivo não suportado' }, { status: 400 })
    }

    // Validar tamanho (max 10MB para imagens de estúdio)
    if (file.size > 10 * 1024 * 1024) {
      return NextResponse.json({ error: 'Arquivo muito grande. Máximo 10MB' }, { status: 400 })
    }

    // Gerar nome do arquivo baseado no slug do estúdio
    const timestamp = Date.now()
    const fileExtension = file.name.split('.').pop()?.toLowerCase() || 'jpg'
    const fileName = `studios/${studioSlug}-${timestamp}.${fileExtension}`

    // Converter file para arrayBuffer
    const arrayBuffer = await file.arrayBuffer()

    // Upload para Supabase Storage no bucket "pilates"
    const { data, error } = await supabaseAdmin.storage
      .from('pilates')
      .upload(fileName, arrayBuffer, {
        contentType: file.type,
        upsert: true // Permite sobrescrever se existir
      })

    if (error) {
      console.error('Supabase storage error:', error)
      return NextResponse.json({ error: 'Erro ao fazer upload no storage' }, { status: 500 })
    }

    // Gerar URL pública
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
    console.error('Error uploading studio image:', error)
    return NextResponse.json({ error: 'Erro interno do servidor' }, { status: 500 })
  }
}