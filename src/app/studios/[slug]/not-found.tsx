import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
          <h1 className="text-6xl font-bold text-gray-400 mb-4">404</h1>
          <h2 className="text-3xl font-semibold text-gray-700 mb-4">
            Estúdio não encontrado
          </h2>
          <p className="text-gray-600 mb-8 max-w-md">
            O estúdio que você está procurando não existe ou foi removido do nosso diretório.
          </p>
          
          <div className="flex gap-4">
            <Link
              href="/"
              className="bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 transition-colors font-medium"
            >
              Ver Todos os Estúdios
            </Link>
            <Link
              href="/blog"
              className="bg-gray-200 text-gray-800 px-6 py-3 rounded-lg hover:bg-gray-300 transition-colors font-medium"
            >
              Ler Nosso Blog
            </Link>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}