'use client';

import { useState, useEffect, useCallback } from 'react';
import { Studio } from '@/types/studio';
import { searchStudios, getNeighborhoodsByCity, type StudioSearchParams } from '@/lib/studios-api';

interface UseSupabaseStudiosOptions {
  cityCode: string;
  itemsPerPage?: number;
  autoLoad?: boolean;
}

interface UseSupabaseStudiosReturn {
  studios: Studio[];
  loading: boolean;
  loadingMore: boolean;
  error: string | null;
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
  totalPages: number;
  totalStudios: number;
  hasMore: boolean;
  loadMore: () => void;
  refresh: () => void;
}

export const useSupabaseStudios = ({
  cityCode,
  itemsPerPage = 12,
  autoLoad = true
}: UseSupabaseStudiosOptions): UseSupabaseStudiosReturn => {
  // Data states
  const [studios, setStudios] = useState<Studio[]>([]);
  const [neighborhoods, setNeighborhoods] = useState<string[]>([]);
  
  // Loading states
  const [loading, setLoading] = useState(autoLoad);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Filter states
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedNeighborhoods, setSelectedNeighborhoods] = useState<string[]>([]);
  const [minRating, setMinRating] = useState(0);
  const [hasWhatsAppOnly, setHasWhatsAppOnly] = useState(false);
  const [hasWebsiteOnly, setHasWebsiteOnly] = useState(false);
  
  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [totalStudios, setTotalStudios] = useState(0);
  const [hasMore, setHasMore] = useState(false);

  // Load studios based on current filters and pagination
  const loadStudios = useCallback(async (page: number = 1, append: boolean = false) => {
    try {
      if (!append) {
        setLoading(true);
        setError(null);
      } else {
        setLoadingMore(true);
      }

      const params: StudioSearchParams = {
        cityCode,
        searchTerm: searchTerm.trim(),
        neighborhoods: selectedNeighborhoods,
        minRating,
        hasWhatsAppOnly,
        hasWebsiteOnly,
        page,
        limit: itemsPerPage
      };

      const result = await searchStudios(params);

      if (append) {
        setStudios(prev => [...prev, ...result.studios]);
      } else {
        setStudios(result.studios);
      }

      setCurrentPage(result.page);
      setTotalPages(result.totalPages);
      setTotalStudios(result.total);
      setHasMore(result.hasMore);

    } catch (err) {
      console.error('Error loading studios:', err);
      setError(err instanceof Error ? err.message : 'Erro ao carregar estúdios');
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  }, [cityCode, searchTerm, selectedNeighborhoods, minRating, hasWhatsAppOnly, hasWebsiteOnly, itemsPerPage]);

  // Load neighborhoods for the city
  const loadNeighborhoods = useCallback(async () => {
    try {
      const cityNeighborhoods = await getNeighborhoodsByCity(cityCode);
      setNeighborhoods(cityNeighborhoods);
    } catch (err) {
      console.error('Error loading neighborhoods:', err);
    }
  }, [cityCode]);

  // Load more studios (append to existing list)
  const loadMore = useCallback(() => {
    if (hasMore && !loadingMore) {
      loadStudios(currentPage + 1, true);
    }
  }, [hasMore, loadingMore, currentPage, loadStudios]);

  // Refresh data (reset to first page)
  const refresh = useCallback(() => {
    setCurrentPage(1);
    loadStudios(1, false);
  }, [loadStudios]);

  // Reset to first page when filters change
  useEffect(() => {
    if (autoLoad) {
      setCurrentPage(1);
      loadStudios(1, false);
    }
  }, [searchTerm, selectedNeighborhoods, minRating, hasWhatsAppOnly, hasWebsiteOnly]);

  // Load initial data and neighborhoods
  useEffect(() => {
    if (autoLoad) {
      loadNeighborhoods();
      loadStudios(1, false);
    }
  }, [cityCode, autoLoad]);

  return {
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
    currentPage,
    totalPages,
    totalStudios,
    hasMore,
    loadMore,
    refresh
  };
};