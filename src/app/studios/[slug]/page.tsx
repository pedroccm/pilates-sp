import { notFound } from 'next/navigation';
import { Studio } from '@/types/studio';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import WhatsAppButton from '@/components/WhatsAppButton';
import PhoneButton from '@/components/PhoneButton';
import GoogleMap from '@/components/GoogleMap';
import { isWhatsAppNumber } from '@/utils/whatsapp';
import { getStudioBySlug } from '@/lib/studios-api';
import { supabase } from '@/lib/supabase';
import { getStudioImageUrl } from '@/lib/image-utils';

interface PageProps {
  params: {
    slug: string;
  };
}

// Generate static params only for top studios (ISR)
export async function generateStaticParams() {
  try {
    const { data: studios, error } = await supabase
      .from('studios')
      .select('slug')
      .order('total_score', { ascending: false })
      .order('reviews_count', { ascending: false })
      .limit(1000); // Apenas top 1000 estúdios no build

    if (error) {
      console.error('Error fetching studios for static generation:', error);
      return [];
    }

    console.log(`Generating ${studios?.length || 0} static pages for top studios`);

    return studios.map((studio) => ({
      slug: studio.slug,
    }));
  } catch (error) {
    console.error('Error generating static params:', error);
    return [];
  }
}

// ISR Configuration
export const revalidate = 3600; // Revalida a cada 1 hora
export const dynamicParams = true; // Permite gerar páginas não pré-construídas

export default async function StudioPage({ params }: PageProps) {
  try {
    const studio = await getStudioBySlug(params.slug);

    if (!studio) {
      notFound();
    }

    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
      
      <main className="container mx-auto px-4 py-8">
        {/* Breadcrumbs */}
        <nav className="mb-6" aria-label="Breadcrumb">
          <ol className="flex items-center space-x-2 text-sm text-gray-600">
            <li>
              <a href="/" className="hover:text-blue-600">Início</a>
            </li>
            <li className="flex items-center">
              <span className="mx-2">/</span>
              <span className="text-gray-900 font-medium">{studio.title}</span>
            </li>
          </ol>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Studio Header */}
            <div className="bg-white rounded-lg shadow-md overflow-hidden mb-6">
              <img 
                src={getStudioImageUrl(studio.imageUrl || studio, 'original')} 
                alt={studio.title}
                className="w-full h-64 object-cover"
              />
              <div className="p-6">
                <h1 className="text-3xl font-bold text-gray-900 mb-4">{studio.title}</h1>
                
                {/* Rating */}
                <div className="flex items-center mb-4">
                  <div className="flex text-yellow-400 text-xl">
                    {'★'.repeat(Math.floor(studio.totalScore))}
                    {'☆'.repeat(5 - Math.floor(studio.totalScore))}
                  </div>
                  <span className="ml-3 text-gray-600">
                    <strong>{studio.totalScore.toFixed(1)}</strong> ({studio.reviewsCount} avaliações)
                  </span>
                </div>

                {/* Location */}
                <div className="mb-6">
                  <h2 className="text-lg font-semibold text-gray-900 mb-2">Localização</h2>
                  <p className="text-gray-600 mb-1">{studio.address}</p>
                  <p className="text-gray-600">{studio.neighborhood} - São Paulo, SP</p>
                </div>

                {/* Contact Actions */}
                <div className="flex gap-4 mb-6">
                  {isWhatsAppNumber(studio.phone) ? (
                    <WhatsAppButton 
                      phone={studio.phone} 
                      studioName={studio.title}
                      size="lg"
                    />
                  ) : (
                    <PhoneButton 
                      phone={studio.phone}
                      size="lg"
                    />
                  )}
                  
                  {studio.website && (
                    <a 
                      href={studio.website} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="bg-green-500 text-white px-6 py-3 rounded-lg hover:bg-green-600 transition-colors font-medium"
                    >
                      Visitar Site
                    </a>
                  )}
                  
                  <a 
                    href={studio.url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 transition-colors font-medium"
                  >
                    Ver no Google Maps
                  </a>
                </div>

                {/* Business Hours */}
                {studio.openingHours && studio.openingHours.length > 0 && (
                  <div className="mb-6">
                    <h2 className="text-lg font-semibold text-gray-900 mb-2">Horário de Funcionamento</h2>
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <div className="space-y-1">
                        {studio.openingHours.map((hours, index) => (
                          <div key={index} className="text-sm text-gray-600">
                            <strong>{hours.day}:</strong> {hours.hours}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* Services */}
                {studio.types && studio.types.length > 0 && (
                  <div className="mb-6">
                    <h2 className="text-lg font-semibold text-gray-900 mb-2">Serviços</h2>
                    <div className="flex flex-wrap gap-2">
                      {studio.types.map((type, index) => (
                        <span 
                          key={index}
                          className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm"
                        >
                          {type}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Reviews Summary */}
                <div className="border-t pt-6">
                  <h2 className="text-lg font-semibold text-gray-900 mb-4">Avaliações</h2>
                  <div className="grid grid-cols-2 gap-4 text-center">
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <div className="text-2xl font-bold text-gray-900">{studio.totalScore.toFixed(1)}</div>
                      <div className="text-sm text-gray-600">Nota Geral</div>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <div className="text-2xl font-bold text-gray-900">{studio.reviewsCount}</div>
                      <div className="text-sm text-gray-600">Total de Avaliações</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            {/* Map */}
            <div className="bg-white rounded-lg shadow-md overflow-hidden mb-6">
              <div className="h-64">
                <GoogleMap studios={[studio]} />
              </div>
            </div>

            {/* Quick Info */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Informações Rápidas</h3>
              
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Telefone:</span>
                  <span className="font-medium">{studio.phone}</span>
                </div>
                
                {studio.website && (
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Site:</span>
                    <a 
                      href={studio.website} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline font-medium"
                    >
                      Visitar
                    </a>
                  </div>
                )}
                
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Bairro:</span>
                  <span className="font-medium">{studio.neighborhood}</span>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Avaliações:</span>
                  <div className="flex items-center">
                    <div className="flex text-yellow-400 text-sm mr-1">
                      {'★'.repeat(Math.floor(studio.totalScore))}
                      {'☆'.repeat(5 - Math.floor(studio.totalScore))}
                    </div>
                    <span className="text-sm font-medium">({studio.reviewsCount})</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      
        <Footer />
      </div>
    );
  } catch (error) {
    console.error('Error loading studio page:', error);
    notFound();
  }
}