import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { 
  getStudiosByNeighborhood, 
  getNeighborhoodStats, 
  getAllNeighborhoodsWithCount,
  slugToNeighborhood,
  neighborhoodToSlug 
} from '@/lib/analytics-api';
import NeighborhoodPageClient from './NeighborhoodPageClient';

interface Props {
  params: {
    city: string;
    neighborhood: string;
  };
}

export async function generateStaticParams() {
  // Return empty array for now to enable dynamic rendering
  // This allows the pages to work while avoiding build-time database calls
  return [];
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { city: cityCode, neighborhood: neighborhoodSlug } = await params;
  
  // Define cities for metadata generation
  const citiesList = [
    { code: 'sp', name: 'São Paulo' },
    { code: 'rj', name: 'Rio de Janeiro' },
    { code: 'bh', name: 'Belo Horizonte' },
    { code: 'bsb', name: 'Brasília' },
    { code: 'cwb', name: 'Curitiba' }
  ];
  
  const cityInfo = citiesList.find(c => c.code === cityCode);
  if (!cityInfo) {
    return { title: 'Página não encontrada' };
  }

  try {
    // Get all neighborhoods to find the original name
    const allNeighborhoods = await getAllNeighborhoodsWithCount(cityCode);
    const originalNeighborhood = slugToNeighborhood(
      neighborhoodSlug, 
      allNeighborhoods.map(n => n.neighborhood)
    );

    if (!originalNeighborhood) {
      return { title: 'Bairro não encontrado' };
    }

    const stats = await getNeighborhoodStats(cityCode, originalNeighborhood);
    
    const title = `Studios de Pilates em ${originalNeighborhood}, ${cityInfo.name} - ${stats.totalStudios} Opções`;
    const description = `Encontre os melhores studios de Pilates em ${originalNeighborhood}, ${cityInfo.name}. ${stats.totalStudios} opções com avaliações${stats.averageRating > 0 ? `, média ${stats.averageRating}⭐` : ''}${stats.totalReviews > 0 ? ` e ${stats.totalReviews} avaliações` : ''}.`;

    return {
      title,
      description,
      keywords: `pilates ${originalNeighborhood}, studio pilates ${cityInfo.name}, pilates ${neighborhoodSlug}, academia pilates ${originalNeighborhood}`,
      openGraph: {
        title,
        description,
        type: 'website',
        url: `/${cityCode}/${neighborhoodSlug}`,
      },
      twitter: {
        card: 'summary_large_image',
        title,
        description,
      },
      alternates: {
        canonical: `/${cityCode}/${neighborhoodSlug}`,
      },
    };
  } catch (error) {
    console.error('Error generating metadata:', error);
    return { title: 'Erro ao carregar página' };
  }
}

export default async function NeighborhoodPage({ params }: Props) {
  const { city: cityCode, neighborhood: neighborhoodSlug } = await params;
  
  // Define cities for the main component
  const citiesList = [
    { code: 'sp', name: 'São Paulo' },
    { code: 'rj', name: 'Rio de Janeiro' },
    { code: 'bh', name: 'Belo Horizonte' },
    { code: 'bsb', name: 'Brasília' },
    { code: 'cwb', name: 'Curitiba' }
  ];
  
  const cityInfo = citiesList.find(c => c.code === cityCode);
  if (!cityInfo) {
    notFound();
  }

  try {
    // Get all neighborhoods to find the original name
    const allNeighborhoods = await getAllNeighborhoodsWithCount(cityCode);
    const originalNeighborhood = slugToNeighborhood(
      neighborhoodSlug, 
      allNeighborhoods.map(n => n.neighborhood)
    );

    if (!originalNeighborhood) {
      notFound();
    }

    return (
      <NeighborhoodPageClient
        cityCode={cityCode}
        neighborhoodName={originalNeighborhood}
      />
    );
  } catch (error) {
    console.error('Error loading neighborhood page:', error);
    notFound();
  }
}