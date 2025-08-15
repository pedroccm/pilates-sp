import Link from 'next/link'
import { Studio } from '@/types/studio'
import WhatsAppButton from '@/components/WhatsAppButton'
import PhoneButton from '@/components/PhoneButton'
import { isWhatsAppNumber } from '@/utils/whatsapp'

interface StudioCardProps {
  studio: Studio
}

export default function StudioCard({ studio }: StudioCardProps) {
  return (
    <div className="bg-white rounded-2xl shadow-sm hover:shadow-lg transition-all duration-300 border border-gray-50 overflow-hidden group">
      <div className="relative">
        <img 
          src={studio.imageUrl || '/placeholder-studio.jpg'} 
          alt={studio.title}
          className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-500"
          onError={(e) => {
            const target = e.target as HTMLImageElement
            target.src = '/placeholder-studio.jpg'
          }}
        />
        
        {/* Rating Badge */}
        <div className="absolute top-4 right-4">
          <div className="bg-white/95 backdrop-blur-sm rounded-full px-3 py-1.5 shadow-sm">
            <div className="flex items-center gap-1">
              <svg className="w-4 h-4 text-yellow-400 fill-current" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
              <span className="text-sm font-semibold text-gray-800">
                {(studio.totalScore || 0).toFixed(1)}
              </span>
            </div>
          </div>
        </div>

        {/* Badges de Convênio */}
        {(studio.gympass || studio.totalpass) && (
          <div className="absolute top-4 left-4 flex gap-1">
            {studio.gympass && (
              <span className="bg-green-500 text-white text-xs px-2 py-1 rounded-full font-medium">
                Gympass
              </span>
            )}
            {studio.totalpass && (
              <span className="bg-blue-500 text-white text-xs px-2 py-1 rounded-full font-medium">
                TotalPass
              </span>
            )}
          </div>
        )}

        {/* Badge Cliente */}
        {studio.cliente && (
          <div className="absolute bottom-4 left-4">
            <span className="bg-purple-500 text-white text-xs px-2 py-1 rounded-full font-medium">
              Parceiro
            </span>
          </div>
        )}
      </div>
      
      <div className="p-6">
        <div className="mb-4">
          <Link href={`/studios/${studio.slug}`}>
            <h3 className="font-semibold text-xl mb-2 text-gray-900 hover:text-blue-600 transition-colors cursor-pointer line-clamp-2 leading-tight">
              {studio.title}
            </h3>
          </Link>
          
          <div className="flex items-center gap-2 text-sm text-gray-500 mb-2">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <span className="line-clamp-1">{studio.neighborhood}</span>
          </div>
          
          <div className="flex items-center text-sm text-gray-400">
            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
            <span>{studio.reviewsCount || 0} avaliações</span>
          </div>
        </div>
        
        <div className="space-y-3">
          {/* Botão Principal de Contato */}
          {studio.phone && (
            <div>
              {isWhatsAppNumber(studio.phone) ? (
                <WhatsAppButton 
                  phone={studio.phone} 
                  studioName={studio.title}
                  size="md"
                  className="w-full justify-center font-medium"
                />
              ) : (
                <PhoneButton 
                  phone={studio.phone}
                  size="md"
                  className="w-full justify-center font-medium"
                />
              )}
            </div>
          )}
          
          {/* Botões Secundários */}
          <div className="grid grid-cols-2 gap-2">
            <Link
              href={`/studios/${studio.slug}`}
              className="flex items-center justify-center gap-2 bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2.5 rounded-lg transition-colors text-sm font-medium"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Detalhes
            </Link>
            
            {studio.website ? (
              <a 
                href={studio.website} 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 bg-blue-50 hover:bg-blue-100 text-blue-600 px-4 py-2.5 rounded-lg transition-colors text-sm font-medium"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9v-9m0-9v9" />
                </svg>
                Site
              </a>
            ) : (
              <a 
                href={`https://www.google.com/maps/search/${encodeURIComponent(studio.title + ' ' + studio.address)}`}
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 bg-green-50 hover:bg-green-100 text-green-600 px-4 py-2.5 rounded-lg transition-colors text-sm font-medium"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                Maps
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}