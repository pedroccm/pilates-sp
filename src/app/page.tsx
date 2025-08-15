import CitySelection from '@/components/CitySelection';

// Force dynamic rendering for Netlify
export const dynamic = 'force-dynamic';

export default function Home() {
  return <CitySelection />;
}

// SEO metadata
export const metadata = {
  title: 'Pilates Brasil - Encontre os Melhores Estúdios de Pilates',
  description: 'Encontre e compare os melhores estúdios de Pilates em São Paulo, Rio de Janeiro, Belo Horizonte, Curitiba e Brasília. Avaliações, preços e localização.',
  keywords: 'pilates brasil, estúdios pilates, pilates são paulo, pilates rio de janeiro, pilates belo horizonte, pilates curitiba, pilates brasília',
  openGraph: {
    title: 'Pilates Brasil - Encontre os Melhores Estúdios de Pilates',
    description: 'Encontre e compare os melhores estúdios de Pilates no Brasil. Avaliações, preços e localização.',
    url: 'https://pilates-sp.vercel.app',
    siteName: 'Pilates Brasil',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Pilates Brasil - Estúdios de Pilates',
      },
    ],
    locale: 'pt_BR',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Pilates Brasil - Encontre os Melhores Estúdios de Pilates',
    description: 'Encontre e compare os melhores estúdios de Pilates no Brasil. Avaliações, preços e localização.',
    images: ['/og-image.jpg'],
  },
}