'use client';

import { useEffect, useState } from 'react';
import { Studio } from '@/types/studio';
import CitySelector, { cities } from '@/components/CitySelector';
import { calculateAnalytics } from '@/lib/analytics-api';

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

  useEffect(() => {
    loadAnalytics();
  }, [selectedCity]);

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
                - {getCityName(selectedCity)}
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
          
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-sm font-medium text-gray-500">Com Instagram</h3>
            <p className="text-2xl font-bold text-pink-600">{analytics.studiosWithInstagram}</p>
            <p className="text-xs text-gray-500">{((analytics.studiosWithInstagram / analytics.totalStudios) * 100).toFixed(1)}%</p>
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
          
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-sm font-medium text-gray-500">Bairros Cobertos</h3>
            <p className="text-2xl font-bold text-indigo-600">{Object.keys(analytics.studiosByNeighborhood).length}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-bold mb-4">Top 10 Bairros com Mais Estúdios</h2>
            <div className="space-y-3">
              {topNeighborhoods.map(([neighborhood, count], index) => (
                <div key={neighborhood} className="flex justify-between items-center">
                  <span className="text-sm font-medium text-gray-700">
                    {index + 1}. {neighborhood}
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
      </div>
    </div>
  );
}