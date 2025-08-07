'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';

export interface City {
  code: string;
  name: string;
  fileName: string;
}

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

  const handleCityChange = (cityCode: string) => {
    const city = cities.find(c => c.code === cityCode);
    if (city) {
      setSelectedCity(cityCode);
      
      if (onCityChange) {
        onCityChange(city);
      } else {
        // Navegar para a página da cidade
        if (cityCode === 'sp') {
          router.push('/');
        } else {
          router.push(`/${cityCode}`);
        }
      }
    }
  };

  return (
    <div className={`relative ${className}`}>
      <select
        value={selectedCity}
        onChange={(e) => handleCityChange(e.target.value)}
        className="appearance-none bg-white border border-gray-300 rounded-lg px-4 py-2 pr-8 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent cursor-pointer"
      >
        {cities.map((city) => (
          <option key={city.code} value={city.code}>
            {city.name}
          </option>
        ))}
      </select>
      <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
        <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </div>
    </div>
  );
}