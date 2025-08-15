import Link from 'next/link';
import { Studio } from '@/types/studio';
import WhatsAppButton from '@/components/WhatsAppButton';
import PhoneButton from '@/components/PhoneButton';
import { isWhatsAppNumber } from '@/utils/whatsapp';
import { getStudioImageUrl } from '@/lib/image-utils';

interface HomeStudioCardProps {
  studio: Studio;
}

export default function HomeStudioCard({ studio }: HomeStudioCardProps) {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
      <img 
        src={getStudioImageUrl(studio.imageUrl || studio, 'original')} 
        alt={studio.title}
        className="w-full h-48 object-cover"
      />
      <div className="p-4">
        <Link href={`/studios/${studio.slug}`}>
          <h3 className="font-bold text-lg mb-2 hover:text-blue-600 transition-colors cursor-pointer">
            {studio.title}
          </h3>
        </Link>
        <div className="flex items-center mb-2">
          <div className="flex text-yellow-400">
            {'★'.repeat(Math.floor(studio.totalScore))}
            {'☆'.repeat(5 - Math.floor(studio.totalScore))}
          </div>
          <span className="ml-2 text-gray-600">({studio.reviewsCount} avaliações)</span>
        </div>
        <p className="text-gray-600 text-sm mb-2">{studio.neighborhood}</p>
        <p className="text-gray-600 text-sm mb-3">{studio.address}</p>
        <div className="flex justify-between items-center">
          <div className="flex gap-2">
            {isWhatsAppNumber(studio.phone) ? (
              <WhatsAppButton 
                phone={studio.phone} 
                studioName={studio.title}
                size="sm"
              />
            ) : (
              <PhoneButton 
                phone={studio.phone}
                size="sm"
              />
            )}
          </div>
          <div className="flex gap-2">
            {studio.website && (
              <a 
                href={studio.website} 
                target="_blank" 
                rel="noopener noreferrer"
                className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition-colors text-sm"
              >
                Site
              </a>
            )}
            <a 
              href={studio.url} 
              target="_blank" 
              rel="noopener noreferrer"
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors text-sm"
            >
              Ver no Maps
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}