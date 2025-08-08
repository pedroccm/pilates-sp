export default function Home() {
  return (
    <div style={{ 
      minHeight: '100vh', 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center',
      fontFamily: 'Arial, sans-serif',
      backgroundColor: '#f5f5f5'
    }}>
      <div style={{
        backgroundColor: 'white',
        padding: '40px',
        borderRadius: '10px',
        boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
        textAlign: 'center',
        maxWidth: '400px'
      }}>
        <h1 style={{ color: '#333', marginBottom: '20px' }}>
          🏋️‍♀️ Estúdios de Pilates
        </h1>
        
        <p style={{ color: '#666', marginBottom: '20px' }}>
          Site funcionando no Netlify!
        </p>
        
        <div style={{ marginBottom: '20px', fontSize: '14px', color: '#999' }}>
          <p>✅ Build: OK</p>
          <p>✅ Deploy: OK</p>
          <p>✅ Rendering: OK</p>
        </div>
        
        <div style={{ marginTop: '30px' }}>
          <a 
            href="/test" 
            style={{
              display: 'inline-block',
              backgroundColor: '#007bff',
              color: 'white',
              padding: '10px 20px',
              textDecoration: 'none',
              borderRadius: '5px',
              margin: '5px'
            }}
          >
            Teste Supabase
          </a>
          
          <a 
            href="/rj" 
            style={{
              display: 'inline-block',
              backgroundColor: '#28a745',
              color: 'white',
              padding: '10px 20px',
              textDecoration: 'none',
              borderRadius: '5px',
              margin: '5px'
            }}
          >
            Rio de Janeiro
          </a>
        </div>
        
        <div style={{ marginTop: '20px', fontSize: '12px', color: '#ccc' }}>
          Timestamp: {new Date().toISOString()}
        </div>
      </div>
    </div>
  );
}