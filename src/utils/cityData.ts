import { Studio } from '@/types/studio';
import { cities, City } from '@/components/CitySelector';

// Importar todos os JSONs das cidades
import spData from '@/data/pilates-sp.json';
import rjData from '@/data/pilates-rj.json';
import bhData from '@/data/pilates-bh.json';
import bsbData from '@/data/pilates-bsb.json';
import cwbData from '@/data/pilates-cwb.json';

const cityDataMap: Record<string, Studio[]> = {
  'sp': spData as Studio[],
  'rj': rjData as Studio[],
  'bh': bhData as Studio[],
  'bsb': bsbData as Studio[],
  'cwb': cwbData as Studio[]
};

export const getCityData = (cityCode: string): Studio[] => {
  return cityDataMap[cityCode] || [];
};

export const getAllCitiesData = (): Studio[] => {
  return Object.values(cityDataMap).flat();
};

export const getCityByCode = (code: string): City | undefined => {
  return cities.find(city => city.code === code);
};

export const getCityName = (code: string): string => {
  const city = getCityByCode(code);
  return city ? city.name : 'Cidade não encontrada';
};