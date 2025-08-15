'use client';

import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { useCities, City } from '@/hooks/useCities';

// Re-export City type for backward compatibility
export type { City } from '@/hooks/useCities';

// Fallback cities for compatibility
export const cities: City[] = [
  { code: 'sp', name: 'São Paulo', fileName: 'pilates-sp.json' },
  { code: 'rj', name: 'Rio de Janeiro', fileName: 'pilates-rj.json' },
  { code: 'bh', name: 'Belo Horizonte', fileName: 'pilates-bh.json' },
  { code: 'bsb', name: 'Brasília', fileName: 'pilates-bsb.json' },
  { code: 'cwb', name: 'Curitiba', fileName: 'pilates-cwb.json' }
];

interface CitySelectorProps {
  currentCity?: string;
  onCityChange?: (city: City) => void;
  className?: string;
}

export default function CitySelector({ currentCity = 'sp', onCityChange, className = '' }: CitySelectorProps) {
  const router = useRouter();
  const [selectedCity, setSelectedCity] = useState(currentCity);
  const { cities: dynamicCities, loading, error } = useCities();

  // Use dynamic cities or fallback to static ones
  const availableCities = !loading && dynamicCities.length > 0 ? dynamicCities : cities;

  // Update selected city when currentCity prop changes
  useEffect(() => {
    setSelectedCity(currentCity);
  }, [currentCity]);

  const handleCityChange = (cityCode: string) => {
    const city = availableCities.find(c => c.code === cityCode);
    if (city) {
      setSelectedCity(cityCode);
      
      if (onCityChange) {
        onCityChange(city);
      } else {
        // Navegar para a página da cidade
        router.push(`/${cityCode}`);
      }
    }
  };

  return (
    <div className={`relative ${className}`}>
      <select
        value={selectedCity}
        onChange={(e) => handleCityChange(e.target.value)}
        disabled={loading}
        className="appearance-none bg-white border border-gray-300 rounded-lg px-4 py-2 pr-8 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading ? (
          <option>Carregando cidades...</option>
        ) : (
          availableCities.map((city) => (
            <option key={city.code} value={city.code}>
              {city.name}
            </option>
          ))
        )}
      </select>
      <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
        {loading ? (
          <div className="w-4 h-4 border-2 border-gray-400 border-t-transparent rounded-full animate-spin"></div>
        ) : (
          <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        )}
      </div>
      {error && (
        <div className="absolute top-full left-0 mt-1 text-xs text-red-600 bg-white px-2 py-1 rounded shadow-lg border">
          ⚠️ Erro ao carregar cidades
        </div>
      )}
    </div>
  );
}