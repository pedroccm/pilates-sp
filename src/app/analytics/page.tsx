'use client';

import { useEffect, useState } from 'react';
import { Studio } from '@/types/studio';
import Link from 'next/link';
import CitySelector, { cities } from '@/components/CitySelector';
import { calculateAnalytics, getStudiosWithInstagram, getAllNeighborhoodsWithCount, neighborhoodToSlug } from '@/lib/analytics-api';

export const dynamic = 'force-dynamic';

interface AnalyticsData {
  totalStudios: number;
  studiosByNeighborhood: { [key: string]: number };
  studiosWithWebsite: number;
  studiosWithInstagram: number;
  studiosWithWhatsApp: number;
  studiosWithPhone: number;
  averageRating: number;
  totalReviews: number;
  topRatedStudios: Studio[];
  mostReviewedStudios: Studio[];
}

export default function AnalyticsPage() {
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadingMessage, setLoadingMessage] = useState('Iniciando...');
  const [selectedCity, setSelectedCity] = useState<string>('geral');
  const [websiteFilter, setWebsiteFilter] = useState<'all' | 'with' | 'without' | 'instagram'>('all');
  const [showInstagramStudios, setShowInstagramStudios] = useState(false);
  const [instagramStudios, setInstagramStudios] = useState<Studio[]>([]);
  const [loadingInstagram, setLoadingInstagram] = useState(false);
  const [cityStats, setCityStats] = useState<{ [key: string]: number }>({});
  const [loadingCityStats, setLoadingCityStats] = useState(true);
  const [showAllNeighborhoods, setShowAllNeighborhoods] = useState(false);
  const [allNeighborhoods, setAllNeighborhoods] = useState<{ neighborhood: string, count: number }[]>([]);
  const [loadingNeighborhoods, setLoadingNeighborhoods] = useState(false);

  useEffect(() => {
    loadAnalytics();
  }, [selectedCity]);

  useEffect(() => {
    loadCityStats();
  }, []);

  const loadAnalytics = async () => {
    setLoading(true);
    setLoadingMessage('Conectando com o banco de dados...');
    
    try {
      setLoadingMessage('Carregando dados dos estúdios... (pode levar alguns segundos)');
      const analyticsData = await calculateAnalytics(selectedCity);
      setLoadingMessage('Processando estatísticas...');
      setAnalytics(analyticsData);
    } catch (error) {
      console.error('Erro ao carregar analytics:', error);
      setLoadingMessage('❌ Erro ao carregar dados');
      setAnalytics(null);
    } finally {
      setTimeout(() => setLoading(false), 500); // Pequeno delay para mostrar "Processando"
    }
  };

  const loadCityStats = async () => {
    setLoadingCityStats(true);
    try {
      const response = await fetch('/api/analytics/cities');
      if (response.ok) {
        const stats = await response.json();
        setCityStats(stats);
      }
    } catch (error) {
      console.error('Erro ao carregar estatísticas das cidades:', error);
    } finally {
      setLoadingCityStats(false);
    }
  };

  const handleNeighborhoodsClick = async () => {
    if (showAllNeighborhoods) {
      setShowAllNeighborhoods(false);
    } else {
      try {
        setLoadingNeighborhoods(true);
        const neighborhoods = await getAllNeighborhoodsWithCount(selectedCity);
        setAllNeighborhoods(neighborhoods);
        setShowAllNeighborhoods(true);
        
        // Scroll para a seção da lista após um pequeno delay
        setTimeout(() => {
          document.getElementById('neighborhoods-list')?.scrollIntoView({ 
            behavior: 'smooth', 
            block: 'start' 
          });
        }, 100);
      } catch (error) {
        console.error('Erro ao carregar bairros:', error);
      } finally {
        setLoadingNeighborhoods(false);
      }
    }
  };

  // Helper function para truncar texto
  const truncateText = (text: string, maxLength: number) => {
    return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
  };

  // Helper function para detectar WhatsApp
  const isWhatsAppNumber = (phone: string) => {
    if (!phone) return false;
    // Remove todos os caracteres não numéricos
    const cleanPhone = phone.replace(/\D/g, '');
    // Verifica se é um número brasileiro válido (com 11 dígitos)
    return cleanPhone.length === 11 || cleanPhone.length === 13; // com ou sem código do país
  };

  // Helper function para formatar número do WhatsApp
  const formatWhatsAppLink = (phone: string) => {
    if (!phone) return '';
    const cleanPhone = phone.replace(/\D/g, '');
    // Adiciona código do país se não tiver
    const whatsappNumber = cleanPhone.startsWith('55') ? cleanPhone : `55${cleanPhone}`;
    return `https://wa.me/${whatsappNumber}`;
  };

  const handleInstagramClick = async () => {
    if (showInstagramStudios) {
      setShowInstagramStudios(false);
    } else {
      try {
        setLoadingInstagram(true);
        const studios = await getStudiosWithInstagram(selectedCity);
        // Ordenar por bairro
        const sortedStudios = studios.sort((a, b) => {
          return a.neighborhood.localeCompare(b.neighborhood);
        });
        setInstagramStudios(sortedStudios);
        setShowInstagramStudios(true);
        
        // Scroll para a seção da lista após um pequeno delay
        setTimeout(() => {
          document.getElementById('instagram-list')?.scrollIntoView({ 
            behavior: 'smooth', 
            block: 'start' 
          });
        }, 100);
      } catch (error) {
        console.error('Erro ao carregar estúdios com Instagram:', error);
      } finally {
        setLoadingInstagram(false);
      }
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-500 mb-6"></div>
        <div className="text-xl font-semibold text-gray-700 mb-2">Carregando análises...</div>
        <p className="text-gray-500 text-center max-w-md">
          {loadingMessage}
        </p>
        {selectedCity === 'geral' && (
          <p className="text-sm text-gray-400 mt-4">
            💡 Carregando dados de todas as cidades ({`>8.000 estúdios`})
          </p>
        )}
      </div>
    );
  }

  if (!analytics) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-xl text-red-600">Erro ao carregar dados</div>
      </div>
    );
  }

  const topNeighborhoods = Object.entries(analytics.studiosByNeighborhood)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 10);

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Dashboard de Análise - Estúdios de Pilates
            {selectedCity !== 'geral' && (
              <span className="text-xl text-gray-600 ml-2">
                - {cities.find(city => city.code === selectedCity)?.name || selectedCity.toUpperCase()}
              </span>
            )}
          </h1>
          <div className="flex items-center space-x-4">
            <select
              value={selectedCity}
              onChange={(e) => setSelectedCity(e.target.value)}
              className="appearance-none bg-white border border-gray-300 rounded-lg px-4 py-2 pr-8 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent cursor-pointer"
            >
              <option value="geral">Geral (Todas as Cidades)</option>
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
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-sm font-medium text-gray-500">Total de Estúdios</h3>
            <p className="text-2xl font-bold text-blue-600">{analytics.totalStudios.toLocaleString('pt-BR')}</p>
          </div>
          
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-sm font-medium text-gray-500">Com Website</h3>
            <p className="text-2xl font-bold text-green-600">{analytics.studiosWithWebsite}</p>
            <p className="text-xs text-gray-500">{((analytics.studiosWithWebsite / analytics.totalStudios) * 100).toFixed(1)}%</p>
          </div>
          
          <div 
            className="bg-white rounded-lg shadow p-6 cursor-pointer hover:shadow-lg transition-shadow duration-200 hover:bg-pink-50"
            onClick={handleInstagramClick}
          >
            <h3 className="text-sm font-medium text-gray-500">Com Instagram</h3>
            <p className="text-2xl font-bold text-pink-600">{analytics.studiosWithInstagram}</p>
            <p className="text-xs text-gray-500">{((analytics.studiosWithInstagram / analytics.totalStudios) * 100).toFixed(1)}%</p>
            {loadingInstagram ? (
              <p className="text-xs text-blue-500 mt-2">⏳ Carregando...</p>
            ) : (
              <p className="text-xs text-blue-500 mt-2">👆 Clique para ver a lista</p>
            )}
          </div>
          
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-sm font-medium text-gray-500">Com WhatsApp</h3>
            <p className="text-2xl font-bold text-green-500">{analytics.studiosWithWhatsApp}</p>
            <p className="text-xs text-gray-500">{((analytics.studiosWithWhatsApp / analytics.totalStudios) * 100).toFixed(1)}%</p>
          </div>
          
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-sm font-medium text-gray-500">Com Telefone</h3>
            <p className="text-2xl font-bold text-blue-500">{analytics.studiosWithPhone}</p>
            <p className="text-xs text-gray-500">{((analytics.studiosWithPhone / analytics.totalStudios) * 100).toFixed(1)}%</p>
          </div>
          
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-sm font-medium text-gray-500">Avaliação Média</h3>
            <p className="text-2xl font-bold text-yellow-600">{analytics.averageRating.toFixed(1)} ⭐</p>
          </div>
          
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-sm font-medium text-gray-500">Total de Avaliações</h3>
            <p className="text-2xl font-bold text-purple-600">{analytics.totalReviews.toLocaleString('pt-BR')}</p>
          </div>
          
          <div 
            className="bg-white rounded-lg shadow p-6 cursor-pointer hover:shadow-lg transition-shadow duration-200 hover:bg-indigo-50"
            onClick={handleNeighborhoodsClick}
          >
            <h3 className="text-sm font-medium text-gray-500">Bairros Cobertos</h3>
            <p className="text-2xl font-bold text-indigo-600">{Object.keys(analytics.studiosByNeighborhood).length}</p>
            {loadingNeighborhoods ? (
              <p className="text-xs text-blue-500 mt-2">⏳ Carregando...</p>
            ) : (
              <p className="text-xs text-blue-500 mt-2">👆 Clique para ver todos os bairros</p>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-bold mb-4">Studios por Cidade</h2>
            {loadingCityStats ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-2"></div>
                <p className="text-sm text-gray-500">Carregando estatísticas...</p>
              </div>
            ) : (
              <div className="space-y-3 max-h-80 overflow-y-auto">
                {/* Ordenar cidades por número de studios */}
                {cities
                  .map(city => ({ ...city, count: cityStats[city.code] || 0 }))
                  .sort((a, b) => b.count - a.count)
                  .map((city) => (
                    <div key={city.code} className="flex justify-between items-center py-2 border-b border-gray-100 last:border-b-0">
                      <div>
                        <span className="text-sm font-medium text-gray-700">{city.name}</span>
                        <span className="text-xs text-gray-500 ml-2">({city.code.toUpperCase()})</span>
                      </div>
                      <div className="flex items-center space-x-3">
                        <span className="text-lg font-bold text-blue-600">
                          {city.count.toLocaleString()}
                        </span>
                        <button
                          onClick={() => setSelectedCity(city.code)}
                          className={`px-3 py-1 rounded-full text-xs font-bold transition-colors ${
                            selectedCity === city.code 
                              ? 'bg-blue-600 text-white' 
                              : 'bg-gray-200 text-gray-700 hover:bg-blue-100'
                          }`}
                        >
                          {selectedCity === city.code ? 'Ativo' : 'Ver'}
                        </button>
                      </div>
                    </div>
                  ))}
                <div className="pt-3 border-t-2 border-blue-200">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-bold text-blue-700">🇧🇷 Todas as Cidades</span>
                    <div className="flex items-center space-x-3">
                      <span className="text-lg font-bold text-blue-800">
                        {Object.values(cityStats).reduce((sum, count) => sum + count, 0).toLocaleString()}
                      </span>
                      <button
                        onClick={() => setSelectedCity('geral')}
                        className={`px-3 py-1 rounded-full text-xs font-bold transition-colors ${
                          selectedCity === 'geral' 
                            ? 'bg-blue-600 text-white' 
                            : 'bg-gray-200 text-gray-700 hover:bg-blue-100'
                        }`}
                      >
                        {selectedCity === 'geral' ? 'Ativo' : 'Ver'}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-bold mb-4">Top 10 Bairros com Mais Estúdios</h2>
            <div className="space-y-3">
              {topNeighborhoods.map(([neighborhood, count], index) => (
                <div key={neighborhood} className="flex justify-between items-center">
                  <span className="text-sm font-medium text-gray-700">
                    {index + 1}. {selectedCity !== 'geral' ? (
                      <Link
                        href={`/${selectedCity}/${neighborhoodToSlug(neighborhood)}`}
                        className="text-blue-600 hover:text-blue-800 hover:underline transition-colors"
                        title={`Ver studios em ${neighborhood}`}
                      >
                        {neighborhood}
                      </Link>
                    ) : (
                      <span>{neighborhood}</span>
                    )}
                  </span>
                  <div className="flex items-center">
                    <div className="w-32 bg-gray-200 rounded-full h-2 mr-3">
                      <div 
                        className="bg-blue-600 h-2 rounded-full" 
                        style={{ width: `${(count / topNeighborhoods[0][1]) * 100}%` }}
                      ></div>
                    </div>
                    <span className="text-sm font-bold text-blue-600">{count}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-bold mb-4">Distribuição de Presença Digital</h2>
            <div className="space-y-4">
              <div className="flex justify-between">
                <span>Estúdios com Website</span>
                <span className="font-bold text-green-600">{analytics.studiosWithWebsite}</span>
              </div>
              <div className="flex justify-between">
                <span>Estúdios sem Website</span>
                <span className="font-bold text-red-600">{analytics.totalStudios - analytics.studiosWithWebsite}</span>
              </div>
              <div className="flex justify-between">
                <span>Estúdios com Instagram</span>
                <span className="font-bold text-pink-600">{analytics.studiosWithInstagram}</span>
              </div>
              <div className="flex justify-between">
                <span>Estúdios com WhatsApp</span>
                <span className="font-bold text-green-500">{analytics.studiosWithWhatsApp}</span>
              </div>
              <div className="flex justify-between">
                <span>Estúdios com Telefone</span>
                <span className="font-bold text-blue-500">{analytics.studiosWithPhone}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-bold mb-4">Top 10 Estúdios Melhor Avaliados</h2>
            <div className="space-y-3">
              {analytics.topRatedStudios.map((studio, index) => (
                <div key={studio.title} className="border-b border-gray-200 pb-2">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <p className="font-medium text-gray-900 text-sm">{index + 1}. {studio.title}</p>
                      <p className="text-xs text-gray-500">{studio.neighborhood}</p>
                    </div>
                    <div className="text-right">
                      <span className="font-bold text-yellow-600">{studio.totalScore} ⭐</span>
                      <p className="text-xs text-gray-500">({studio.reviewsCount} avaliações)</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-bold mb-4">Top 10 Estúdios Mais Avaliados</h2>
            <div className="space-y-3">
              {analytics.mostReviewedStudios.map((studio, index) => (
                <div key={studio.title} className="border-b border-gray-200 pb-2">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <p className="font-medium text-gray-900 text-sm">{index + 1}. {studio.title}</p>
                      <p className="text-xs text-gray-500">{studio.neighborhood}</p>
                    </div>
                    <div className="text-right">
                      <span className="font-bold text-purple-600">{studio.reviewsCount} avaliações</span>
                      <p className="text-xs text-gray-500">{studio.totalScore} ⭐</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {showInstagramStudios && (
          <div id="instagram-list" className="mt-12">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h2 className="text-2xl font-bold text-pink-600">
                  Estúdios com Instagram
                  {selectedCity !== 'geral' && (
                    <span className="text-xl text-gray-600 ml-2">
                      - {cities.find(city => city.code === selectedCity)?.name || selectedCity.toUpperCase()}
                    </span>
                  )}
                </h2>
                <p className="text-sm text-gray-600 mt-1">
                  {instagramStudios.length} estúdios encontrados
                </p>
              </div>
              <button
                onClick={() => setShowInstagramStudios(false)}
                className="text-gray-500 hover:text-gray-700 text-3xl leading-none"
              >
                ×
              </button>
            </div>

            {instagramStudios.length > 0 ? (
              <div className="bg-white rounded-lg shadow overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-1/4">
                          Estúdio
                        </th>
                        <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-1/6">
                          Bairro
                        </th>
                        <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-1/8">
                          Cidade
                        </th>
                        <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-1/6">
                          Avaliação
                        </th>
                        <th className="px-3 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider w-16">
                          <svg className="w-4 h-4 mx-auto" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M20 15.5c-1.25 0-2.45-.2-3.57-.57-.35-.11-.74-.03-1.02.24l-2.2 2.2c-2.83-1.44-5.15-3.75-6.59-6.59l2.2-2.2c.27-.27.35-.67.24-1.02C8.7 6.45 8.5 5.25 8.5 4c0-.55-.45-1-1-1H4c-.55 0-1 .45-1 1 0 9.39 7.61 17 17 17 .55 0 1-.45 1-1v-3.5c0-.55-.45-1-1-1zM19 12h2c0-4.97-4.03-9-9-9v2c3.87 0 7 3.13 7 7zm-4 0h2c0-2.76-2.24-5-5-5v2c1.66 0 3 1.34 3 3z"/>
                          </svg>
                        </th>
                        <th className="px-3 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider w-16">
                          <svg className="w-4 h-4 mx-auto" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                          </svg>
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {instagramStudios.map((studio, index) => (
                        <tr key={studio.title + index} className="hover:bg-gray-50">
                          <td className="px-4 py-3">
                            <div className="text-sm font-medium text-gray-900" title={studio.title}>
                              {truncateText(studio.title, 40)}
                            </div>
                          </td>
                          <td className="px-3 py-3">
                            <div className="text-sm text-gray-500" title={studio.neighborhood}>
                              {truncateText(studio.neighborhood, 20)}
                            </div>
                          </td>
                          <td className="px-3 py-3">
                            <div className="text-sm text-gray-500">
                              {cities.find(city => city.code === studio.city)?.name || studio.city}
                            </div>
                          </td>
                          <td className="px-3 py-3">
                            {studio.totalScore > 0 ? (
                              <div className="text-sm text-yellow-600">
                                {studio.totalScore} ⭐ ({studio.reviewsCount})
                              </div>
                            ) : (
                              <div className="text-sm text-gray-400">-</div>
                            )}
                          </td>
                          <td className="px-3 py-3 text-center">
                            {studio.phone ? (
                              isWhatsAppNumber(studio.phone) ? (
                                <a 
                                  href={formatWhatsAppLink(studio.phone)} 
                                  target="_blank" 
                                  rel="noopener noreferrer"
                                  className="text-green-600 hover:text-green-800"
                                  title="WhatsApp"
                                >
                                  <svg className="w-5 h-5 mx-auto" viewBox="0 0 24 24" fill="currentColor">
                                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.488"/>
                                  </svg>
                                </a>
                              ) : (
                                <a 
                                  href={`tel:${studio.phone}`}
                                  className="text-blue-600 hover:text-blue-800"
                                  title="Telefone"
                                >
                                  <svg className="w-5 h-5 mx-auto" viewBox="0 0 24 24" fill="currentColor">
                                    <path d="M20 15.5c-1.25 0-2.45-.2-3.57-.57-.35-.11-.74-.03-1.02.24l-2.2 2.2c-2.83-1.44-5.15-3.75-6.59-6.59l2.2-2.2c.27-.27.35-.67.24-1.02C8.7 6.45 8.5 5.25 8.5 4c0-.55-.45-1-1-1H4c-.55 0-1 .45-1 1 0 9.39 7.61 17 17 17 .55 0 1-.45 1-1v-3.5c0-.55-.45-1-1-1zM19 12h2c0-4.97-4.03-9-9-9v2c3.87 0 7 3.13 7 7zm-4 0h2c0-2.76-2.24-5-5-5v2c1.66 0 3 1.34 3 3z"/>
                                  </svg>
                                </a>
                              )
                            ) : (
                              <span className="text-gray-300">-</span>
                            )}
                          </td>
                          <td className="px-3 py-3 text-center">
                            {studio.website && studio.website.toLowerCase().includes('instagram') && (
                              <a 
                                href={studio.website} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="text-pink-600 hover:text-pink-800"
                                title="Instagram"
                              >
                                <svg className="w-5 h-5 mx-auto" viewBox="0 0 24 24" fill="currentColor">
                                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                                </svg>
                              </a>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-lg shadow p-8 text-center">
                <p className="text-gray-500 text-lg">
                  Nenhum estúdio com Instagram encontrado
                  {selectedCity !== 'geral' && (
                    <span> em {cities.find(city => city.code === selectedCity)?.name}</span>
                  )}
                </p>
              </div>
            )}
          </div>
        )}

        {showAllNeighborhoods && (
          <div id="neighborhoods-list" className="mt-12">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h2 className="text-2xl font-bold text-indigo-600">
                  Todos os Bairros
                  {selectedCity !== 'geral' && (
                    <span className="text-xl text-gray-600 ml-2">
                      - {cities.find(city => city.code === selectedCity)?.name || selectedCity.toUpperCase()}
                    </span>
                  )}
                </h2>
                <p className="text-sm text-gray-600 mt-1">
                  {allNeighborhoods.length} bairros encontrados
                  {selectedCity === 'geral' && (
                    <span className="block text-xs text-gray-500 mt-1">
                      💡 Selecione uma cidade específica para acessar as páginas dos bairros
                    </span>
                  )}
                </p>
              </div>
              <button
                onClick={() => setShowAllNeighborhoods(false)}
                className="text-gray-500 hover:text-gray-700 text-3xl leading-none"
              >
                ×
              </button>
            </div>

            {allNeighborhoods.length > 0 ? (
              <div className="bg-white rounded-lg shadow overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          #
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Bairro
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Quantidade de Studios
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          % do Total
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {allNeighborhoods.map((neighborhood, index) => (
                        <tr key={neighborhood.neighborhood + index} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {index + 1}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-medium text-gray-900">
                              {selectedCity !== 'geral' ? (
                                <Link
                                  href={`/${selectedCity}/${neighborhoodToSlug(neighborhood.neighborhood)}`}
                                  className="text-blue-600 hover:text-blue-800 hover:underline transition-colors"
                                  title={`Ver studios em ${neighborhood.neighborhood}`}
                                >
                                  {neighborhood.neighborhood}
                                </Link>
                              ) : (
                                <span>{neighborhood.neighborhood}</span>
                              )}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className="text-sm font-bold text-indigo-600 mr-3">
                                {neighborhood.count}
                              </div>
                              <div className="w-20 bg-gray-200 rounded-full h-2">
                                <div 
                                  className="bg-indigo-600 h-2 rounded-full" 
                                  style={{ 
                                    width: `${(neighborhood.count / allNeighborhoods[0].count) * 100}%` 
                                  }}
                                />
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {((neighborhood.count / analytics.totalStudios) * 100).toFixed(1)}%
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                
                {/* Summary section */}
                <div className="bg-gray-50 px-6 py-4 border-t border-gray-200">
                  <div className="flex justify-between items-center text-sm">
                    <div>
                      <strong>Resumo:</strong>
                      <span className="ml-2">
                        {allNeighborhoods.filter(n => n.count === 1).length} bairros com apenas 1 studio
                      </span>
                    </div>
                    <div>
                      <span className="text-gray-600">
                        {allNeighborhoods.filter(n => n.count > 1).length} bairros com mais de 1 studio
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-lg shadow p-8 text-center">
                <p className="text-gray-500 text-lg">
                  Nenhum bairro encontrado
                  {selectedCity !== 'geral' && (
                    <span> em {cities.find(city => city.code === selectedCity)?.name}</span>
                  )}
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}