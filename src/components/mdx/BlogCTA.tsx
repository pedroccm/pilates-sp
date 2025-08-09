'use client'

import Link from 'next/link'

interface BlogCTAProps {
  text: string
  href?: string
  theme?: 'blue' | 'green' | 'purple'
  size?: 'sm' | 'md' | 'lg'
}

export function BlogCTA({ 
  text, 
  href = '/', 
  theme = 'blue', 
  size = 'md' 
}: BlogCTAProps) {
  const themeClasses = {
    blue: 'bg-blue-600 hover:bg-blue-700 text-white',
    green: 'bg-green-600 hover:bg-green-700 text-white',
    purple: 'bg-purple-600 hover:bg-purple-700 text-white'
  }

  const sizeClasses = {
    sm: 'px-4 py-2 text-sm',
    md: 'px-6 py-3 text-base',
    lg: 'px-8 py-4 text-lg'
  }

  return (
    <div className="not-prose my-6">
      <div className="text-center bg-gray-50 border border-gray-200 rounded-lg p-6">
        <div className="max-w-md mx-auto">
          <div className="text-4xl mb-3">🚀</div>
          <h3 className="text-lg font-semibold text-gray-900 mb-3">
            Pronto para começar?
          </h3>
          <p className="text-gray-600 text-sm mb-4">
            Encontre o estúdio perfeito para sua jornada no Pilates.
          </p>
          <Link
            href={href}
            className={`inline-flex items-center ${themeClasses[theme]} ${sizeClasses[size]} rounded-lg font-medium transition-colors shadow-sm hover:shadow-md`}
          >
            {text}
            <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>
      </div>
    </div>
  )
}