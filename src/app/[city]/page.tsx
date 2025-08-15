import { notFound } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import CityPageClient from './CityPageClient';

interface PageProps {
  params: {
    city: string;
  };
}

// Generate static params for main cities
export async function generateStaticParams() {
  try {
    // Tentar buscar cidades do banco
    const { data: cityStats } = await supabase.rpc('get_city_stats');
    
    if (cityStats && cityStats.length > 0) {
      // Retornar top 10 cidades
      return cityStats
        .slice(0, 10)
        .map(stat => ({ city: stat.city_code }));
    }
  } catch (error) {
    console.warn('Failed to fetch cities for static generation:', error);
  }
  
  // Fallback para cidades principais
  return [
    { city: 'rj' },
    { city: 'bh' },
    { city: 'bsb' },
    { city: 'cwb' },
    { city: 'campinas' },
    { city: 'guarulhos' },
    { city: 'sorocaba' }
  ];
}

// ISR Configuration
export const revalidate = 1800; // 30 minutos
export const dynamicParams = true; // Permite outras cidades

export default async function CityPage({ params }: PageProps) {
  const cityCode = params.city;
  
  // Verificar se a cidade existe no servidor
  try {
    const { data: cityCheck } = await supabase
      .from('studios')
      .select('city_code')
      .eq('city_code', cityCode)
      .limit(1);
      
    if (!cityCheck || cityCheck.length === 0) {
      notFound();
    }
  } catch (error) {
    console.error('Error checking city:', error);
    notFound();
  }

  return <CityPageClient cityCode={cityCode} />;
}