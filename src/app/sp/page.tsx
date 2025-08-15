import StudiosPage from '@/components/StudiosPage';

// Force dynamic rendering for Netlify
export const dynamic = 'force-dynamic';

export default function SaoPauloPage() {
  return <StudiosPage cityCode="sp" />;
}

// SEO metadata
export const metadata = {
  title: 'Melhores Estúdios de Pilates em São Paulo - Pilates SP',
  description: 'Encontre os melhores estúdios de Pilates em São Paulo. Compare preços, avaliações e localização dos principais estúdios de Pilates da cidade.',
  keywords: 'pilates são paulo, estúdios pilates sp, pilates zona sul, pilates zona norte, pilates centro são paulo',
  openGraph: {
    title: 'Melhores Estúdios de Pilates em São Paulo',
    description: 'Encontre os melhores estúdios de Pilates em São Paulo. Compare preços, avaliações e localização.',
    url: 'https://pilates-sp.vercel.app/sp',
    siteName: 'Pilates SP',
    images: [
      {
        url: '/og-image-sp.jpg',
        width: 1200,
        height: 630,
        alt: 'Estúdios de Pilates em São Paulo',
      },
    ],
    locale: 'pt_BR',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Melhores Estúdios de Pilates em São Paulo',
    description: 'Encontre os melhores estúdios de Pilates em São Paulo. Compare preços, avaliações e localização.',
    images: ['/og-image-sp.jpg'],
  },
}