'use client'

import Link from 'next/link'
import { ChevronRightIcon } from '@heroicons/react/20/solid'

interface BreadcrumbItem {
  name: string
  href?: string
  current?: boolean
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[]
  className?: string
}

export default function Breadcrumbs({ items, className = '' }: BreadcrumbsProps) {
  return (
    <nav className={`flex ${className}`} aria-label="Breadcrumb">
      <ol className="flex items-center space-x-1 md:space-x-2">
        {items.map((item, index) => (
          <li key={index} className="flex items-center">
            {index > 0 && (
              <ChevronRightIcon 
                className="h-4 w-4 text-gray-400 mx-1" 
                aria-hidden="true" 
              />
            )}
            
            {item.href && !item.current ? (
              <Link
                href={item.href}
                className="text-sm text-gray-500 hover:text-gray-700 transition-colors duration-200"
                itemProp="item"
              >
                <span itemProp="name">{item.name}</span>
              </Link>
            ) : (
              <span 
                className={`text-sm ${
                  item.current 
                    ? 'text-gray-900 font-medium truncate max-w-xs' 
                    : 'text-gray-500'
                }`}
                aria-current={item.current ? 'page' : undefined}
                itemProp="name"
              >
                {item.name}
              </span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  )
}

// Componente com Schema Markup integrado
interface StructuredBreadcrumbsProps extends BreadcrumbsProps {
  baseUrl?: string
}

export function StructuredBreadcrumbs({ 
  items, 
  className = '', 
  baseUrl = 'https://pilates-sp.com' 
}: StructuredBreadcrumbsProps) {
  // Gerar Schema JSON-LD para breadcrumbs
  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items
      .filter(item => item.href) // Só incluir itens com link
      .map((item, index) => ({
        '@type': 'ListItem',
        position: index + 1,
        name: item.name,
        item: `${baseUrl}${item.href}`
      }))
  }

  return (
    <>
      {/* Schema Markup para Breadcrumbs */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(breadcrumbSchema)
        }}
      />
      
      {/* Breadcrumbs visuais com microdata */}
      <nav 
        className={`flex ${className}`} 
        aria-label="Breadcrumb"
        itemScope
        itemType="https://schema.org/BreadcrumbList"
      >
        <ol className="flex items-center space-x-1 md:space-x-2">
          {items.map((item, index) => (
            <li 
              key={index} 
              className="flex items-center"
              itemScope
              itemType="https://schema.org/ListItem"
              itemProp="itemListElement"
            >
              <meta itemProp="position" content={String(index + 1)} />
              
              {index > 0 && (
                <ChevronRightIcon 
                  className="h-4 w-4 text-gray-400 mx-1" 
                  aria-hidden="true" 
                />
              )}
              
              {item.href && !item.current ? (
                <Link
                  href={item.href}
                  className="text-sm text-gray-500 hover:text-gray-700 transition-colors duration-200"
                  itemProp="item"
                >
                  <span itemProp="name">{item.name}</span>
                </Link>
              ) : (
                <span 
                  className={`text-sm ${
                    item.current 
                      ? 'text-gray-900 font-medium truncate max-w-xs' 
                      : 'text-gray-500'
                  }`}
                  aria-current={item.current ? 'page' : undefined}
                  itemProp="name"
                >
                  {item.name}
                </span>
              )}
            </li>
          ))}
        </ol>
      </nav>
    </>
  )
}