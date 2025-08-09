import Link from 'next/link'
import Image from 'next/image'
import { BlogPost } from '@/lib/blog-api'

interface BlogCardProps {
  post: BlogPost
  featured?: boolean
}

export default function BlogCard({ post, featured = false }: BlogCardProps) {
  const formatDate = (dateString?: string) => {
    if (!dateString) return ''
    return new Date(dateString).toLocaleDateString('pt-BR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  const cardClass = featured 
    ? "bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300 md:flex"
    : "bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300"

  const imageClass = featured 
    ? "md:w-1/2 h-64 md:h-auto"
    : "w-full h-48"

  const contentClass = featured 
    ? "p-6 md:w-1/2 md:flex md:flex-col md:justify-center"
    : "p-6"

  return (
    <article className={cardClass}>
      {/* Featured Badge */}
      {post.featured && (
        <div className="absolute top-4 left-4 z-10">
          <span className="bg-blue-600 text-white text-xs font-semibold px-2 py-1 rounded-full">
            Featured
          </span>
        </div>
      )}

      {/* Image */}
      <div className={`relative ${imageClass}`}>
        <Image
          src={post.featured_image || '/images/blog/default-blog.jpg'}
          alt={post.featured_image_alt || post.title}
          fill
          className="object-cover"
          sizes={featured ? "(max-width: 768px) 100vw, 50vw" : "(max-width: 768px) 100vw, 33vw"}
        />
        
        {/* Category Badge */}
        {post.category && (
          <div className="absolute top-4 right-4">
            <Link 
              href={`/blog/categoria/${post.category.slug}`}
              className="text-xs font-semibold px-2 py-1 rounded-full text-white transition-opacity hover:opacity-80"
              style={{ backgroundColor: post.category.color }}
            >
              {post.category.name}
            </Link>
          </div>
        )}
      </div>

      {/* Content */}
      <div className={contentClass}>
        {/* Meta Info */}
        <div className="flex items-center text-sm text-gray-500 mb-3">
          {post.author && (
            <Link 
              href={`/blog/autor/${post.author.slug}`}
              className="flex items-center hover:text-gray-700 transition-colors"
            >
              {post.author.avatar_url && (
                <Image
                  src={post.author.avatar_url}
                  alt={post.author.name}
                  width={20}
                  height={20}
                  className="rounded-full mr-2"
                />
              )}
              <span className="font-medium">{post.author.name}</span>
            </Link>
          )}
          <span className="mx-2">•</span>
          <time dateTime={post.published_at}>
            {formatDate(post.published_at)}
          </time>
          {post.reading_time && (
            <>
              <span className="mx-2">•</span>
              <span>{post.reading_time} min de leitura</span>
            </>
          )}
        </div>

        {/* Title */}
        <Link href={`/blog/${post.slug}`}>
          <h2 className={`font-bold text-gray-900 mb-3 hover:text-blue-600 transition-colors ${
            featured ? 'text-xl md:text-2xl' : 'text-lg'
          }`}>
            {post.title}
          </h2>
        </Link>

        {/* Excerpt */}
        {post.excerpt && (
          <p className={`text-gray-600 mb-4 line-clamp-3 ${
            featured ? 'text-base' : 'text-sm'
          }`}>
            {post.excerpt}
          </p>
        )}

        {/* Footer */}
        <div className="flex items-center justify-between">
          <Link 
            href={`/blog/${post.slug}`}
            className="text-blue-600 hover:text-blue-800 font-medium text-sm transition-colors inline-flex items-center"
          >
            Ler mais
            <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>

          <div className="flex items-center text-xs text-gray-500">
            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
            </svg>
            {post.views.toLocaleString()} visualizações
          </div>
        </div>

        {/* Tags */}
        {post.tags && post.tags.length > 0 && (
          <div className="mt-4 pt-3 border-t border-gray-100">
            <div className="flex flex-wrap gap-2">
              {post.tags.slice(0, 3).map(tag => (
                <Link
                  key={tag.id}
                  href={`/blog/tag/${tag.slug}`}
                  className="text-xs bg-gray-100 hover:bg-gray-200 text-gray-700 px-2 py-1 rounded-full transition-colors"
                >
                  #{tag.name}
                </Link>
              ))}
              {post.tags.length > 3 && (
                <span className="text-xs text-gray-500">
                  +{post.tags.length - 3} mais
                </span>
              )}
            </div>
          </div>
        )}
      </div>
    </article>
  )
}