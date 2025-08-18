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
      <Link href={`/studios/${studio.slug}`} className="block">
        <img 
          src={getStudioImageUrl(studio.imageUrl || studio, 'original')} 
          alt={studio.title}
          className="w-full h-48 object-cover cursor-pointer hover:scale-105 transition-transform duration-300"
        />
      </Link>
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
        <div className="flex gap-2">
          {/* Botão WhatsApp menor - só ícone */}
          {studio.phone && isWhatsAppNumber(studio.phone) && (
            <WhatsAppButton 
              phone={studio.phone} 
              studioName={studio.title}
              size="sm"
              iconOnly={true}
              className="justify-center font-medium shadow-sm"
            />
          )}
          
          {/* Botão Ver Mais */}
          <Link
            href={`/studios/${studio.slug}`}
            className="flex-1 flex items-center justify-center bg-gradient-to-r from-gray-50 to-gray-100 hover:from-gray-100 hover:to-gray-200 text-gray-700 hover:text-gray-900 px-3 py-2.5 rounded-xl transition-all duration-200 text-sm font-medium border border-gray-200 hover:border-gray-300 shadow-sm hover:shadow-md"
          >
            Ver Mais
          </Link>
          
          {/* Botão Site ou Maps */}
          {studio.website ? (
            <a 
              href={studio.website} 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex-1 flex items-center justify-center bg-gradient-to-r from-blue-50 to-blue-100 hover:from-blue-100 hover:to-blue-200 text-blue-600 hover:text-blue-700 px-3 py-2.5 rounded-xl transition-all duration-200 text-sm font-medium border border-blue-200 hover:border-blue-300 shadow-sm hover:shadow-md"
            >
              Site
            </a>
          ) : (
            <a 
              href={`https://www.google.com/maps/search/${encodeURIComponent(studio.title + ' ' + studio.address)}`}
              target="_blank" 
              rel="noopener noreferrer"
              className="flex-1 flex items-center justify-center bg-gradient-to-r from-emerald-50 to-emerald-100 hover:from-emerald-100 hover:to-emerald-200 text-emerald-600 hover:text-emerald-700 px-3 py-2.5 rounded-xl transition-all duration-200 text-sm font-medium border border-emerald-200 hover:border-emerald-300 shadow-sm hover:shadow-md"
            >
              Maps
            </a>
          )}
        </div>
      </div>
    </div>
  );
}