'use client'

interface StudioCardProps {
  title: string
  rating: number
  reviews: number
  neighborhood: string
  phone?: string
  website?: string
  highlight?: string
}

export function StudioCard({ 
  title, 
  rating, 
  reviews, 
  neighborhood, 
  phone, 
  website,
  highlight 
}: StudioCardProps) {
  return (
    <div className="not-prose">
      <div className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow my-4">
        {highlight && (
          <div className="mb-2">
            <span className="bg-yellow-100 text-yellow-800 text-xs font-semibold px-2 py-1 rounded">
              {highlight}
            </span>
          </div>
        )}
        
        <h4 className="font-semibold text-gray-900 mb-2">{title}</h4>
        
        <div className="flex items-center gap-4 text-sm text-gray-600 mb-3">
          <span>📍 {neighborhood}</span>
          <span className="flex items-center">
            <span className="text-yellow-500 mr-1">★</span>
            {rating.toFixed(1)} ({reviews})
          </span>
        </div>

        <div className="flex gap-3">
          {phone && (
            <a
              href={`https://wa.me/55${phone.replace(/\D/g, '')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-green-600 hover:text-green-800 text-sm font-medium"
            >
              📱 WhatsApp
            </a>
          )}
          {website && (
            <a
              href={website}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:text-blue-800 text-sm font-medium"
            >
              🌐 Website
            </a>
          )}
        </div>
      </div>
    </div>
  )
}