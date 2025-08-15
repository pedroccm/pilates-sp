'use client';

import { useState } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import StudiosFilters from '@/components/StudiosFilters';
import StudiosContent from '@/components/StudiosContent';
import StudiosLoading from '@/components/StudiosLoading';
import { useSupabaseStudios } from '@/hooks/useSupabaseStudios';
import { useCity } from '@/hooks/useCities';

type ViewMode = 'cards' | 'list' | 'map';

interface StudiosPageProps {
  cityCode: string;
  preSelectedNeighborhood?: string;
}

export default function StudiosPage({ cityCode, preSelectedNeighborhood }: StudiosPageProps) {
  const [viewMode, setViewMode] = useState<ViewMode>('cards');
  
  // Buscar informações da cidade para o nome
  const { city } = useCity(cityCode);
  
  // Função para converter slug em nome bonito (fallback)
  const slugToName = (slug?: string): string => {
    if (!slug) return 'Cidade';
    return slug
      .split('-')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ')
      .replace(/\bDe\b/g, 'de')
      .replace(/\bDo\b/g, 'do')
      .replace(/\bDa\b/g, 'da')
      .replace(/\bDos\b/g, 'dos')
      .replace(/\bDas\b/g, 'das');
  };
  
  const cityName = city?.name || (cityCode === 'sp' ? 'São Paulo' : slugToName(cityCode));
  
  const {
    studios,
    loading,
    loadingMore,
    error,
    searchTerm,
    setSearchTerm,
    selectedNeighborhoods,
    setSelectedNeighborhoods,
    minRating,
    setMinRating,
    hasWhatsAppOnly,
    setHasWhatsAppOnly,
    hasWebsiteOnly,
    setHasWebsiteOnly,
    neighborhoods,
    totalStudios,
    hasMore,
    loadMore
  } = useSupabaseStudios({ cityCode, preSelectedNeighborhood });

  if (loading) {
    return <StudiosLoading cityName={cityName} />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-gray-800">
            Estúdios de Pilates em {preSelectedNeighborhood ? `${preSelectedNeighborhood}, ${cityName}` : cityName}
          </h1>
        </div>

        <StudiosFilters
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          neighborhoods={neighborhoods}
          selectedNeighborhoods={selectedNeighborhoods}
          setSelectedNeighborhoods={setSelectedNeighborhoods}
          minRating={minRating}
          setMinRating={setMinRating}
          hasWhatsAppOnly={hasWhatsAppOnly}
          setHasWhatsAppOnly={setHasWhatsAppOnly}
          hasWebsiteOnly={hasWebsiteOnly}
          setHasWebsiteOnly={setHasWebsiteOnly}
          viewMode={viewMode}
          setViewMode={setViewMode}
          studiosCount={studios.length}
          totalStudios={totalStudios}
          error={error}
        />

        <StudiosContent
          viewMode={viewMode}
          studios={studios}
          hasMore={hasMore}
          loadingMore={loadingMore}
          totalStudios={totalStudios}
          loadMore={loadMore}
        />

        {studios.length === 0 && !loading && !error && (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">Nenhum estúdio encontrado com os filtros selecionados.</p>
          </div>
        )}
      </main>
      
      <Footer />
    </div>
  );
}