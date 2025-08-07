'use client';

import { useState, useEffect, useMemo } from 'react';
import { Studio } from '@/types/studio';
import studiosData from '@/data/studios.json';
import GoogleMap from '@/components/GoogleMap';
import WhatsAppButton from '@/components/WhatsAppButton';
import PhoneButton from '@/components/PhoneButton';
import MultiSelectNeighborhoods from '@/components/MultiSelectNeighborhoods';
import { isWhatsAppNumber } from '@/utils/whatsapp';
import { generateSlug, createUniqueSlug } from '@/utils/slug';
import Link from 'next/link';

type ViewMode = 'cards' | 'list' | 'map';

export default function Home() {
  const [studios, setStudios] = useState<Studio[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState<ViewMode>('cards');
  const [selectedNeighborhoods, setSelectedNeighborhoods] = useState<string[]>([]);
  const [minRating, setMinRating] = useState(0);
  const [hasWhatsAppOnly, setHasWhatsAppOnly] = useState(false);
  const [hasWebsiteOnly, setHasWebsiteOnly] = useState(false);

  useEffect(() => {
    const loadStudios = async () => {
      setLoading(true);
      
      // Simulate loading time for better UX
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const studiosWithSlugs = (studiosData as Studio[]).map((studio, index) => {
        const existingSlugs = (studiosData as Studio[])
          .slice(0, index)
          .map(s => generateSlug(s.title));
        
        return {
          ...studio,
          slug: createUniqueSlug(studio.title, existingSlugs)
        };
      });
      
      setStudios(studiosWithSlugs);
      setLoading(false);
    };
    
    loadStudios();
  }, []);

  const neighborhoods = useMemo(() => {
    const unique = [...new Set(studios.map(studio => studio.neighborhood))];
    return unique.sort();
  }, [studios]);

  const filteredStudios = useMemo(() => {
    return studios.filter(studio => {
      const matchesSearch = studio.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           studio.neighborhood.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesNeighborhoods = selectedNeighborhoods.length === 0 || 
                                  selectedNeighborhoods.includes(studio.neighborhood);
      const matchesRating = studio.totalScore >= minRating;
      const matchesWhatsApp = !hasWhatsAppOnly || isWhatsAppNumber(studio.phone);
      const matchesWebsite = !hasWebsiteOnly || (studio.website && studio.website.length > 0);
      
      return matchesSearch && matchesNeighborhoods && matchesRating && matchesWhatsApp && matchesWebsite;
    });
  }, [studios, searchTerm, selectedNeighborhoods, minRating, hasWhatsAppOnly, hasWebsiteOnly]);

  const StudioCard = ({ studio }: { studio: Studio }) => (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
      <img 
        src={studio.imageUrl} 
        alt={studio.title}
        className="w-full h-48 object-cover"
      />
      <div className="p-4">
        <Link href={`/studios/${studio.slug}`}>
          <h3 className="font-bold text-lg mb-2 hover:text-blue-600 transition-colors cursor-pointer">
            {studio.title}
          </h3>
        </Link>
        <div className="flex items-center mb-2">
          <div className="flex text-yellow-400">
            {'★'.repeat(Math.floor(studio.totalScore))}
            {'☆'.repeat(5 - Math.floor(studio.totalScore))}
          </div>
          <span className="ml-2 text-gray-600">({studio.reviewsCount} avaliações)</span>
        </div>
        <p className="text-gray-600 text-sm mb-2">{studio.neighborhood}</p>
        <p className="text-gray-600 text-sm mb-3">{studio.address}</p>
        <div className="flex justify-between items-center">
          <div className="flex gap-2">
            {isWhatsAppNumber(studio.phone) ? (
              <WhatsAppButton 
                phone={studio.phone} 
                studioName={studio.title}
                size="sm"
              />
            ) : (
              <PhoneButton 
                phone={studio.phone}
                size="sm"
              />
            )}
          </div>
          <div className="flex gap-2">
            {studio.website && (
              <a 
                href={studio.website} 
                target="_blank" 
                rel="noopener noreferrer"
                className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition-colors text-sm"
              >
                Site
              </a>
            )}
            <a 
              href={studio.url} 
              target="_blank" 
              rel="noopener noreferrer"
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors text-sm"
            >
              Ver no Maps
            </a>
          </div>
        </div>
      </div>
    </div>
  );

  const StudioListItem = ({ studio }: { studio: Studio }) => (
    <div className="bg-white rounded-lg shadow-md px-6 py-4 hover:shadow-lg transition-shadow">
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <Link href={`/studios/${studio.slug}`}>
            <h3 className="font-bold text-lg hover:text-blue-600 transition-colors cursor-pointer">
              {studio.title}
            </h3>
          </Link>
          <div className="flex items-center mt-1">
            <div className="flex text-yellow-400 text-sm">
              {'★'.repeat(Math.floor(studio.totalScore))}
              {'☆'.repeat(5 - Math.floor(studio.totalScore))}
            </div>
            <span className="ml-2 text-gray-600 text-sm">({studio.reviewsCount})</span>
          </div>
          <p className="text-gray-600 text-sm mt-1">{studio.neighborhood}</p>
        </div>
        <div className="flex items-center space-x-4">
          <img 
            src={studio.imageUrl} 
            alt={studio.title}
            className="w-16 h-16 object-cover rounded"
          />
          <div className="flex gap-2">
            {isWhatsAppNumber(studio.phone) ? (
              <WhatsAppButton 
                phone={studio.phone} 
                studioName={studio.title}
                size="sm"
              />
            ) : (
              <PhoneButton 
                phone={studio.phone}
                size="sm"
              />
            )}
            <div className="flex gap-2">
              {studio.website && (
                <a 
                  href={studio.website} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition-colors"
                >
                  Site
                </a>
              )}
              <a 
                href={studio.url} 
                target="_blank" 
                rel="noopener noreferrer"
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors"
              >
                Ver no Maps
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col items-center justify-center min-h-[60vh]">
            <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-500 mb-6"></div>
            <h2 className="text-2xl font-semibold text-gray-700 mb-2">Carregando estúdios...</h2>
            <p className="text-gray-500">Encontrando os melhores estúdios de Pilates em São Paulo</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-6">
            Estúdios de Pilates em São Paulo
          </h1>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <div>
              <input
                type="text"
                placeholder="Buscar estúdios..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <MultiSelectNeighborhoods
                neighborhoods={neighborhoods}
                selectedNeighborhoods={selectedNeighborhoods}
                onChange={setSelectedNeighborhoods}
              />
            </div>

            <div>
              <select
                value={minRating}
                onChange={(e) => setMinRating(Number(e.target.value))}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value={0}>Todas as avaliações</option>
                <option value={3}>3+ estrelas</option>
                <option value={4}>4+ estrelas</option>
                <option value={5}>5 estrelas</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div className="flex items-center space-x-4">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={hasWhatsAppOnly}
                  onChange={(e) => setHasWhatsAppOnly(e.target.checked)}
                  className="mr-2 h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                />
                <span className="text-sm text-gray-700">Apenas com WhatsApp</span>
              </label>
            </div>
            
            <div className="flex items-center space-x-4">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={hasWebsiteOnly}
                  onChange={(e) => setHasWebsiteOnly(e.target.checked)}
                  className="mr-2 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <span className="text-sm text-gray-700">Apenas com Site</span>
              </label>
            </div>
          </div>

          <div className="flex justify-between items-center">
            <div className="flex bg-gray-100 rounded-lg p-1">
              <button
                onClick={() => setViewMode('cards')}
                className={`px-4 py-2 rounded-md transition-colors ${
                  viewMode === 'cards' 
                    ? 'bg-white text-blue-600 shadow-sm' 
                    : 'text-gray-600 hover:text-gray-800'
                }`}
              >
                Cards
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`px-4 py-2 rounded-md transition-colors ${
                  viewMode === 'list' 
                    ? 'bg-white text-blue-600 shadow-sm' 
                    : 'text-gray-600 hover:text-gray-800'
                }`}
              >
                Lista
              </button>
              <button
                onClick={() => setViewMode('map')}
                className={`px-4 py-2 rounded-md transition-colors ${
                  viewMode === 'map' 
                    ? 'bg-white text-blue-600 shadow-sm' 
                    : 'text-gray-600 hover:text-gray-800'
                }`}
              >
                Mapa
              </button>
            </div>
            
            <div className="text-gray-600">
              <span>{filteredStudios.length} estúdios encontrados</span>
              {selectedNeighborhoods.length > 0 && (
                <div className="text-sm text-blue-600 mt-1">
                  Filtros: {selectedNeighborhoods.join(', ')}
                </div>
              )}
            </div>
          </div>
        </div>

        {viewMode === 'map' ? (
          <div className="h-[600px]">
            <GoogleMap studios={filteredStudios} />
          </div>
        ) : (
          <div className={
            viewMode === 'cards' 
              ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'
              : 'space-y-4'
          }>
            {filteredStudios.map((studio, index) => (
              <div key={index}>
                {viewMode === 'cards' ? (
                  <StudioCard studio={studio} />
                ) : (
                  <StudioListItem studio={studio} />
                )}
              </div>
            ))}
          </div>
        )}

        {filteredStudios.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">Nenhum estúdio encontrado com os filtros selecionados.</p>
          </div>
        )}
      </div>
    </div>
  );
}
