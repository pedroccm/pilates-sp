'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';

// Force dynamic rendering for Netlify
export const dynamic = 'force-dynamic';

export default function Home() {
  const [connectionStatus, setConnectionStatus] = useState<'testing' | 'success' | 'error'>('testing');
  const [error, setError] = useState<string | null>(null);
  const [studioCount, setStudioCount] = useState<number>(0);
  const [loadTime, setLoadTime] = useState<number>(0);
  
  useEffect(() => {
    testSupabaseConnection();
  }, []);

  const testSupabaseConnection = async () => {
    const startTime = Date.now();
    
    try {
      setConnectionStatus('testing');
      
      console.log('🔄 Testando conexão com Supabase...');
      
      // Test simple query with timeout
      const timeoutPromise = new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Timeout após 10 segundos')), 10000)
      );
      
      const queryPromise = supabase
        .from('studios')
        .select('*', { count: 'exact', head: true });

      const { data, error, count } = await Promise.race([queryPromise, timeoutPromise]) as any;

      if (error) {
        throw error;
      }

      const endTime = Date.now();
      setLoadTime(endTime - startTime);
      setStudioCount(count || 0);
      setConnectionStatus('success');
      
      console.log('✅ Conexão bem-sucedida!', { count, loadTime: endTime - startTime });
    } catch (err) {
      const endTime = Date.now();
      setLoadTime(endTime - startTime);
      
      console.error('❌ Erro na conexão:', err);
      setError(err instanceof Error ? err.message : 'Erro desconhecido');
      setConnectionStatus('error');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8">
        <h1 className="text-2xl font-bold text-center mb-8">
          🏋️‍♀️ Estúdios de Pilates
        </h1>
        
        <div className="space-y-4">
          {connectionStatus === 'testing' && (
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-4 border-blue-500 mx-auto mb-4"></div>
              <p className="text-gray-600">Testando conexão com Supabase...</p>
              <p className="text-sm text-gray-400 mt-2">Tempo: {loadTime}ms</p>
            </div>
          )}
          
          {connectionStatus === 'success' && (
            <div className="text-center">
              <div className="text-green-500 text-6xl mb-4">✅</div>
              <h2 className="text-xl font-semibold text-green-700 mb-2">
                Conexão Bem-sucedida!
              </h2>
              <div className="space-y-2 text-gray-600">
                <p><strong>Total de Estúdios:</strong> {studioCount.toLocaleString()}</p>
                <p><strong>Tempo de Resposta:</strong> {loadTime}ms</p>
                <p><strong>Status:</strong> Supabase funcionando</p>
              </div>
              
              <div className="mt-6 space-y-2">
                <a 
                  href="/rj" 
                  className="block w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition-colors text-center"
                >
                  🏙️ Rio de Janeiro
                </a>
                <a 
                  href="/analytics" 
                  className="block w-full bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600 transition-colors text-center"
                >
                  📊 Analytics
                </a>
              </div>
            </div>
          )}
          
          {connectionStatus === 'error' && (
            <div className="text-center">
              <div className="text-red-500 text-6xl mb-4">❌</div>
              <h2 className="text-xl font-semibold text-red-700 mb-2">
                Erro de Conexão
              </h2>
              <div className="space-y-2 text-gray-600 text-sm">
                <p><strong>Tempo decorrido:</strong> {loadTime}ms</p>
                <p><strong>Erro:</strong></p>
                <div className="bg-red-50 border border-red-200 rounded p-3 text-left">
                  <code className="text-red-700">{error}</code>
                </div>
              </div>
              
              <button 
                onClick={testSupabaseConnection}
                className="mt-4 w-full bg-red-500 text-white py-2 px-4 rounded hover:bg-red-600 transition-colors"
              >
                🔄 Tentar Novamente
              </button>
            </div>
          )}
        </div>
        
        <div className="mt-8 text-center text-xs text-gray-400">
          <p>Deploy no Netlify - Teste de Conexão</p>
          <p>Supabase URL: {process.env.NEXT_PUBLIC_SUPABASE_URL ? '✅ Configurado' : '❌ Não encontrado'}</p>
          <p>Supabase Key: {process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? '✅ Configurado' : '❌ Não encontrado'}</p>
        </div>
      </div>
    </div>
  );
}