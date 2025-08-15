import Link from 'next/link';
import { Studio } from '@/types/studio';
import WhatsAppButton from '@/components/WhatsAppButton';
import PhoneButton from '@/components/PhoneButton';
import { isWhatsAppNumber } from '@/utils/whatsapp';
import { getStudioImageUrl } from '@/lib/image-utils';

interface HomeStudioListItemProps {
  studio: Studio;
}

export default function HomeStudioListItem({ studio }: HomeStudioListItemProps) {
  return (
    <div className="bg-white rounded-lg shadow-md p-4 mb-4">
      <div className="flex items-start justify-between">
        <div className="flex-1">
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
          <p className="text-gray-600 text-sm mt-1">{studio.neighborhood}</p>
        </div>
        <div className="flex items-center space-x-4">
          <img 
            src={getStudioImageUrl(studio.imageUrl || studio, 'original')} 
            alt={studio.title}
            className="w-16 h-16 object-cover rounded"
          />
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
            <div className="flex gap-2">
              {studio.website && (
                <a 
                  href={studio.website} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition-colors"
                >
                  Site
                </a>
              )}
              <a 
                href={studio.url} 
                target="_blank" 
                rel="noopener noreferrer"
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors"
              >
                Ver no Maps
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}