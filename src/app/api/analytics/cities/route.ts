import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function GET() {
  try {
    // Buscar contagem de studios por cidade
    const { data: cityStats, error } = await supabase
      .from('studios')
      .select('city_code')
      .then(result => {
        if (result.error) throw result.error
        
        // Contar studios por cidade
        const counts: { [key: string]: number } = {}
        result.data?.forEach(studio => {
          counts[studio.city_code] = (counts[studio.city_code] || 0) + 1
        })
        
        return { data: counts, error: null }
      })

    if (error) {
      console.error('Error fetching city stats:', error)
      return NextResponse.json({ error: 'Erro ao buscar estatísticas' }, { status: 500 })
    }

    return NextResponse.json(cityStats)
  } catch (error) {
    console.error('Error in city stats API:', error)
    return NextResponse.json({ error: 'Erro interno do servidor' }, { status: 500 })
  }
}