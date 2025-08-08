'use client';

import { useState, useEffect } from 'react';

// Force dynamic rendering for Netlify
export const dynamic = 'force-dynamic';

export default function TestPage() {
  const [status, setStatus] = useState('Carregando...');
  const [details, setDetails] = useState<any>({});
  
  useEffect(() => {
    checkEverything();
  }, []);

  const checkEverything = async () => {
    const results: any = {};
    
    // 1. Check environment variables
    results.envVars = {
      supabaseUrl: !!process.env.NEXT_PUBLIC_SUPABASE_URL,
      supabaseKey: !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
      googleMaps: !!process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY
    };
    
    // 2. Check if we can import Supabase
    try {
      const { supabase } = await import('@/lib/supabase');
      results.supabaseImport = '✅ Import OK';
      
      // 3. Test actual connection
      const startTime = Date.now();
      const { data, error, count } = await supabase
        .from('studios')
        .select('*', { count: 'exact', head: true });
      
      const endTime = Date.now();
      
      if (error) {
        results.supabaseConnection = `❌ ${error.message}`;
      } else {
        results.supabaseConnection = `✅ ${count} estúdios encontrados (${endTime - startTime}ms)`;
      }
      
    } catch (err) {
      results.supabaseImport = `❌ ${err}`;
      results.supabaseConnection = '❌ Não testado';
    }
    
    setDetails(results);
    setStatus('Teste concluído');
  };

  return (
    <div style={{ 
      minHeight: '100vh', 
      padding: '20px',
      fontFamily: 'Arial, sans-serif',
      backgroundColor: '#f5f5f5'
    }}>
      <div style={{
        backgroundColor: 'white',
        padding: '30px',
        borderRadius: '10px',
        boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
        maxWidth: '600px',
        margin: '0 auto'
      }}>
        <h1 style={{ marginBottom: '20px' }}>🧪 Teste de Diagnóstico</h1>
        
        <p><strong>Status:</strong> {status}</p>
        
        <div style={{ marginTop: '20px' }}>
          <h3>🔧 Variáveis de Ambiente:</h3>
          <ul>
            <li>SUPABASE_URL: {details.envVars?.supabaseUrl ? '✅' : '❌'}</li>
            <li>SUPABASE_KEY: {details.envVars?.supabaseKey ? '✅' : '❌'}</li>
            <li>GOOGLE_MAPS: {details.envVars?.googleMaps ? '✅' : '❌'}</li>
          </ul>
        </div>
        
        <div style={{ marginTop: '20px' }}>
          <h3>📦 Import Supabase:</h3>
          <p>{details.supabaseImport || 'Testando...'}</p>
        </div>
        
        <div style={{ marginTop: '20px' }}>
          <h3>🔌 Conexão Database:</h3>
          <p>{details.supabaseConnection || 'Testando...'}</p>
        </div>
        
        <div style={{ marginTop: '30px' }}>
          <a href="/" style={{
            display: 'inline-block',
            backgroundColor: '#007bff',
            color: 'white',
            padding: '10px 20px',
            textDecoration: 'none',
            borderRadius: '5px'
          }}>
            ← Voltar
          </a>
          
          <button 
            onClick={checkEverything}
            style={{
              marginLeft: '10px',
              backgroundColor: '#28a745',
              color: 'white',
              padding: '10px 20px',
              border: 'none',
              borderRadius: '5px',
              cursor: 'pointer'
            }}
          >
            🔄 Testar Novamente
          </button>
        </div>
      </div>
    </div>
  );
}