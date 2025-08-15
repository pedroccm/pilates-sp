'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';

export interface City {
  code: string;
  name: string;
  fileName: string;
  count?: number;
}

// Mapeamento de city_code para nome amigável
const CITY_NAMES: Record<string, string> = {
  'sp': 'São Paulo',
  'rj': 'Rio de Janeiro',
  'bh': 'Belo Horizonte',
  'bsb': 'Brasília',
  'cwb': 'Curitiba',
  'belem': 'Belém',
  'campinas': 'Campinas',
  'campo-grande': 'Campo Grande',
  'duque-de-caxias': 'Duque de Caxias',
  'fortaleza': 'Fortaleza',
  'goiania': 'Goiânia',
  'guarulhos': 'Guarulhos',
  'maceio': 'Maceió',
  'manaus': 'Manaus',
  'piracicaba': 'Piracicaba',
  'porto-alegre': 'Porto Alegre',
  'recife': 'Recife',
  'sorocaba': 'Sorocaba',
  'sao-jose-dos-campos': 'São José dos Campos',
  'santos': 'Santos',
  'ribeirao-preto': 'Ribeirão Preto',
  'osasco': 'Osasco',
  'santo-andre': 'Santo André',
  'sao-bernardo-do-campo': 'São Bernardo do Campo',
  'sao-caetano-do-sul': 'São Caetano do Sul',
  'diadema': 'Diadema',
  'maua': 'Mauá',
  'jundiai': 'Jundiaí'
};

// Função para converter slug em nome bonito (fallback)
function slugToName(slug: string): string {
  return slug
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')
    .replace(/\bDe\b/g, 'de')
    .replace(/\bDo\b/g, 'do')
    .replace(/\bDa\b/g, 'da')
    .replace(/\bDos\b/g, 'dos')
    .replace(/\bDas\b/g, 'das');
}

export function useCities() {
  const [cities, setCities] = useState<City[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchCities() {
      try {
        setLoading(true);
        
        // Tentar usar função RPC primeiro
        let cityStats = null;
        let rpcError = null;
        
        try {
          const rpcResult = await supabase.rpc('get_city_stats');
          cityStats = rpcResult.data;
          rpcError = rpcResult.error;
        } catch (err) {
          rpcError = err;
        }

        if (rpcError || !cityStats) {
          console.warn('RPC failed or function not found, using direct aggregation:', rpcError);
          
          // Fallback: usar query PostgreSQL direta com GROUP BY
          // Isso é bem mais eficiente que buscar todos os registros
          const { data: rawData, error: rawError } = await supabase
            .from('studios')
            .select('city_code, total_score, reviews_count')
            .not('city_code', 'is', null)
            .limit(10000); // Aumentar limite temporariamente

          if (rawError) {
            throw rawError;
          }

          // Agregar manualmente os dados
          const cityAggregation: Record<string, { count: number, totalScore: number, totalReviews: number }> = {};
          
          rawData?.forEach(studio => {
            const cityCode = studio.city_code;
            if (cityCode) {
              if (!cityAggregation[cityCode]) {
                cityAggregation[cityCode] = { count: 0, totalScore: 0, totalReviews: 0 };
              }
              cityAggregation[cityCode].count++;
              cityAggregation[cityCode].totalScore += studio.total_score || 0;
              cityAggregation[cityCode].totalReviews += studio.reviews_count || 0;
            }
          });

          console.log('Aggregated city data:', cityAggregation);

          // Converter para formato City
          const cityList: City[] = Object.entries(cityAggregation)
            .map(([code, stats]) => ({
              code,
              name: CITY_NAMES[code] || slugToName(code),
              fileName: `pilates-${code}.json`,
              count: stats.count
            }))
            .sort((a, b) => (b.count || 0) - (a.count || 0));

          console.log('Final city list (direct aggregation):', cityList);
          setCities(cityList);
          setError(null);
          return;
        }

        // Usar dados da função RPC
        console.log('City stats from RPC:', cityStats);

        const cityList: City[] = cityStats
          ?.map(stat => ({
            code: stat.city_code,
            name: CITY_NAMES[stat.city_code] || slugToName(stat.city_code),
            fileName: `pilates-${stat.city_code}.json`,
            count: stat.total_studios
          }))
          .sort((a, b) => (b.count || 0) - (a.count || 0)) || [];

        console.log('Final city list from RPC:', cityList);
        
        setCities(cityList);
        setError(null);
      } catch (err) {
        console.error('Error fetching cities:', err);
        setError(err instanceof Error ? err.message : 'Failed to fetch cities');
        
        // Fallback para cidades hardcoded em caso de erro
        setCities([
          { code: 'sp', name: 'São Paulo', fileName: 'pilates-sp.json' },
          { code: 'rj', name: 'Rio de Janeiro', fileName: 'pilates-rj.json' },
          { code: 'bh', name: 'Belo Horizonte', fileName: 'pilates-bh.json' },
          { code: 'bsb', name: 'Brasília', fileName: 'pilates-bsb.json' },
          { code: 'cwb', name: 'Curitiba', fileName: 'pilates-cwb.json' }
        ]);
      } finally {
        setLoading(false);
      }
    }

    fetchCities();
  }, []);

  return { cities, loading, error, refetch: () => fetchCities() };
}

// Hook para buscar uma cidade específica
export function useCity(cityCode: string) {
  const { cities, loading, error } = useCities();
  
  const city = cities.find(c => c.code === cityCode);
  
  return { 
    city, 
    loading, 
    error,
    exists: !!city 
  };
}