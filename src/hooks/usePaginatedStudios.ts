'use client';

import { useState, useEffect, useMemo } from 'react';
import { Studio } from '@/types/studio';
import { isWhatsAppNumber } from '@/utils/whatsapp';
import { generateSlug, createUniqueSlug } from '@/utils/slug';
import { getCityData } from '@/utils/cityData';

interface UsePaginatedStudiosOptions {
  cityCode: string;
  itemsPerPage?: number;
}

interface UsePaginatedStudiosReturn {
  allStudios: Studio[];
  displayedStudios: Studio[];
  filteredStudios: Studio[];
  loading: boolean;
  loadingMore: boolean;
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  selectedNeighborhoods: string[];
  setSelectedNeighborhoods: (neighborhoods: string[]) => void;
  minRating: number;
  setMinRating: (rating: number) => void;
  hasWhatsAppOnly: boolean;
  setHasWhatsAppOnly: (value: boolean) => void;
  hasWebsiteOnly: boolean;
  setHasWebsiteOnly: (value: boolean) => void;
  neighborhoods: string[];
  currentPage: number;
  loadMore: () => void;
  hasMore: boolean;
}

export const usePaginatedStudios = ({
  cityCode,
  itemsPerPage = 12
}: UsePaginatedStudiosOptions): UsePaginatedStudiosReturn => {
  const [allStudios, setAllStudios] = useState<Studio[]>([]);
  const [displayedStudios, setDisplayedStudios] = useState<Studio[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedNeighborhoods, setSelectedNeighborhoods] = useState<string[]>([]);
  const [minRating, setMinRating] = useState(0);
  const [hasWhatsAppOnly, setHasWhatsAppOnly] = useState(false);
  const [hasWebsiteOnly, setHasWebsiteOnly] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  // Load initial data
  useEffect(() => {
    const loadStudios = async () => {
      setLoading(true);
      
      const cityData = getCityData(cityCode);
      const studiosWithSlugs = cityData.map((studio, index) => {
        const existingSlugs = cityData
          .slice(0, index)
          .map(s => generateSlug(s.title));
        
        const uniqueSlug = createUniqueSlug(studio.title, existingSlugs);
        
        return {
          ...studio,
          slug: uniqueSlug,
          uniqueId: `${uniqueSlug}-${index}`
        };
      });
      
      setAllStudios(studiosWithSlugs);
      setDisplayedStudios(studiosWithSlugs.slice(0, itemsPerPage));
      setLoading(false);
    };
    
    loadStudios();
  }, [cityCode, itemsPerPage]);

  // Get unique neighborhoods
  const neighborhoods = useMemo(() => {
    const unique = [...new Set(allStudios.map(studio => studio.neighborhood))];
    return unique.sort();
  }, [allStudios]);

  // Filter studios based on search criteria
  const filteredStudios = useMemo(() => {
    return allStudios.filter(studio => {
      const matchesSearch = studio.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           studio.neighborhood.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesNeighborhoods = selectedNeighborhoods.length === 0 || 
                                  selectedNeighborhoods.includes(studio.neighborhood);
      const matchesRating = studio.totalScore >= minRating;
      const matchesWhatsApp = !hasWhatsAppOnly || isWhatsAppNumber(studio.phone);
      const matchesWebsite = !hasWebsiteOnly || (studio.website && studio.website.length > 0);
      
      return matchesSearch && matchesNeighborhoods && matchesRating && matchesWhatsApp && matchesWebsite;
    });
  }, [allStudios, searchTerm, selectedNeighborhoods, minRating, hasWhatsAppOnly, hasWebsiteOnly]);

  // Load more function
  const loadMore = () => {
    setLoadingMore(true);
    const nextPage = currentPage + 1;
    const startIndex = currentPage * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    
    setTimeout(() => {
      const moreStudios = filteredStudios.slice(0, endIndex);
      setDisplayedStudios(moreStudios);
      setCurrentPage(nextPage);
      setLoadingMore(false);
    }, 300);
  };

  // Reset pagination when filters change
  useEffect(() => {
    if (filteredStudios.length >= 0) {
      setCurrentPage(1);
      const studiosToShow = filteredStudios.slice(0, itemsPerPage);
      setDisplayedStudios(studiosToShow);
    }
  }, [filteredStudios, itemsPerPage]);

  const hasMore = displayedStudios.length < filteredStudios.length;

  return {
    allStudios,
    displayedStudios,
    filteredStudios,
    loading,
    loadingMore,
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
    currentPage,
    loadMore,
    hasMore
  };
};