import { supabase } from './supabase'

// Types para o blog
export interface BlogPost {
  id: string
  title: string
  slug: string
  description?: string
  excerpt?: string
  content?: string
  content_file?: string
  meta_title?: string
  meta_description?: string
  featured_image?: string
  featured_image_alt?: string
  status: 'draft' | 'published' | 'archived'
  published_at?: string
  reading_time?: number
  views: number
  featured: boolean
  category?: {
    id: string
    name: string
    slug: string
    color: string
  }
  author?: {
    id: string
    name: string
    slug: string
    bio?: string
    avatar_url?: string
  }
  tags?: Array<{
    id: string
    name: string
    slug: string
  }>
}

export interface BlogCategory {
  id: string
  name: string
  slug: string
  description?: string
  color: string
  icon?: string
  posts_count: number
}

export interface BlogTag {
  id: string
  name: string
  slug: string
  description?: string
  posts_count: number
}

export interface BlogAuthor {
  id: string
  name: string
  slug: string
  bio?: string
  avatar_url?: string
  posts_count: number
}

// Buscar posts com filtros e paginação
export async function getBlogPosts(params: {
  page?: number
  limit?: number
  category?: string
  tag?: string
  search?: string
  featured?: boolean
} = {}): Promise<{ posts: BlogPost[], total: number, hasMore: boolean }> {
  try {
    const { page = 1, limit = 12, category, tag, search, featured } = params
    const offset = (page - 1) * limit

    let query = supabase
      .from('blog_posts')
      .select(`
        id,
        title,
        slug,
        excerpt,
        featured_image,
        featured_image_alt,
        published_at,
        reading_time,
        views,
        featured,
        blog_categories!inner (
          id,
          name,
          slug,
          color
        ),
        blog_authors!inner (
          id,
          name,
          slug,
          avatar_url
        )
      `)
      .eq('status', 'published')
      .lte('published_at', new Date().toISOString())

    // Filtros
    if (category) {
      query = query.eq('blog_categories.slug', category)
    }

    if (search) {
      query = query.or(`title.ilike.%${search}%,excerpt.ilike.%${search}%`)
    }

    if (featured) {
      query = query.eq('featured', true)
    }

    // Buscar tags se especificado
    if (tag) {
      const { data: taggedPosts } = await supabase
        .from('blog_post_tags')
        .select('post_id, blog_tags!inner(slug)')
        .eq('blog_tags.slug', tag)

      if (taggedPosts && taggedPosts.length > 0) {
        const postIds = taggedPosts.map(tp => tp.post_id)
        query = query.in('id', postIds)
      } else {
        return { posts: [], total: 0, hasMore: false }
      }
    }

    // Contar total
    const { count } = await query.range(0, 0)

    // Buscar posts paginados
    const { data, error } = await query
      .order('featured', { ascending: false })
      .order('published_at', { ascending: false })
      .range(offset, offset + limit - 1)

    if (error) {
      console.error('Error fetching blog posts:', error)
      throw error
    }

    const posts = data?.map(post => ({
      id: post.id,
      title: post.title,
      slug: post.slug,
      excerpt: post.excerpt,
      featured_image: post.featured_image,
      featured_image_alt: post.featured_image_alt,
      published_at: post.published_at,
      reading_time: post.reading_time,
      views: post.views,
      featured: post.featured,
      category: post.blog_categories,
      author: post.blog_authors
    })) || []

    return {
      posts,
      total: count || 0,
      hasMore: (count || 0) > offset + posts.length
    }
  } catch (error) {
    console.error('Error in getBlogPosts:', error)
    throw error
  }
}

// Buscar post por slug
export async function getBlogPost(slug: string): Promise<BlogPost | null> {
  try {
    const { data, error } = await supabase
      .from('blog_posts')
      .select(`
        *,
        blog_categories (
          id,
          name,
          slug,
          color
        ),
        blog_authors (
          id,
          name,
          slug,
          bio,
          avatar_url
        )
      `)
      .eq('slug', slug)
      .eq('status', 'published')
      .lte('published_at', new Date().toISOString())
      .single()

    if (error || !data) {
      return null
    }

    // Buscar tags do post
    const { data: postTags } = await supabase
      .from('blog_post_tags')
      .select(`
        blog_tags (
          id,
          name,
          slug
        )
      `)
      .eq('post_id', data.id)

    const tags = postTags?.map(pt => pt.blog_tags).filter(Boolean) || []

    return {
      id: data.id,
      title: data.title,
      slug: data.slug,
      description: data.description,
      excerpt: data.excerpt,
      content: data.content,
      content_file: data.content_file,
      meta_title: data.meta_title,
      meta_description: data.meta_description,
      featured_image: data.featured_image,
      featured_image_alt: data.featured_image_alt,
      status: data.status,
      published_at: data.published_at,
      reading_time: data.reading_time,
      views: data.views,
      featured: data.featured,
      category: data.blog_categories,
      author: data.blog_authors,
      tags
    }
  } catch (error) {
    console.error('Error fetching blog post:', error)
    return null
  }
}

// Buscar categorias
export async function getBlogCategories(): Promise<BlogCategory[]> {
  try {
    const { data, error } = await supabase
      .from('blog_categories')
      .select('*')
      .order('posts_count', { ascending: false })

    if (error) throw error

    return data || []
  } catch (error) {
    console.error('Error fetching blog categories:', error)
    return []
  }
}

// Buscar categoria por slug
export async function getBlogCategory(slug: string): Promise<BlogCategory | null> {
  try {
    const { data, error } = await supabase
      .from('blog_categories')
      .select('*')
      .eq('slug', slug)
      .single()

    if (error || !data) return null

    return data
  } catch (error) {
    console.error('Error fetching blog category:', error)
    return null
  }
}

// Buscar tags
export async function getBlogTags(): Promise<BlogTag[]> {
  try {
    const { data, error } = await supabase
      .from('blog_tags')
      .select('*')
      .order('posts_count', { ascending: false })
      .limit(20)

    if (error) throw error

    return data || []
  } catch (error) {
    console.error('Error fetching blog tags:', error)
    return []
  }
}

// Buscar tag por slug
export async function getBlogTag(slug: string): Promise<BlogTag | null> {
  try {
    const { data, error } = await supabase
      .from('blog_tags')
      .select('*')
      .eq('slug', slug)
      .single()

    if (error || !data) return null

    return data
  } catch (error) {
    console.error('Error fetching blog tag:', error)
    return null
  }
}

// Incrementar views do post
export async function incrementPostViews(slug: string): Promise<void> {
  try {
    const { error } = await supabase.rpc('increment_post_views', {
      post_slug: slug
    })

    if (error) {
      console.error('Error incrementing post views:', error)
    }
  } catch (error) {
    console.error('Error in incrementPostViews:', error)
  }
}

// Buscar todos os slugs dos posts (para generateStaticParams)
export async function getAllBlogPostSlugs(): Promise<string[]> {
  try {
    const { data, error } = await supabase
      .from('blog_posts')
      .select('slug')
      .eq('status', 'published')
      .lte('published_at', new Date().toISOString())

    if (error) {
      console.error('Supabase error in getAllBlogPostSlugs:', error)
      return []
    }

    if (!data || !Array.isArray(data)) {
      console.warn('No data or invalid data format in getAllBlogPostSlugs')
      return []
    }

    return data.map(post => post.slug).filter(slug => slug && typeof slug === 'string')
  } catch (error) {
    console.error('Error fetching blog post slugs:', error)
    return []
  }
}

// Buscar posts relacionados
export async function getRelatedPosts(
  currentPostId: string,
  categoryId?: string,
  limit: number = 4
): Promise<BlogPost[]> {
  try {
    let query = supabase
      .from('blog_posts')
      .select(`
        id,
        title,
        slug,
        excerpt,
        featured_image,
        published_at,
        reading_time,
        blog_categories (
          name,
          slug,
          color
        ),
        blog_authors (
          name,
          slug
        )
      `)
      .eq('status', 'published')
      .lte('published_at', new Date().toISOString())
      .neq('id', currentPostId)

    if (categoryId) {
      query = query.eq('category_id', categoryId)
    }

    const { data, error } = await query
      .order('published_at', { ascending: false })
      .limit(limit)

    if (error) throw error

    return data?.map(post => ({
      id: post.id,
      title: post.title,
      slug: post.slug,
      excerpt: post.excerpt,
      featured_image: post.featured_image,
      published_at: post.published_at,
      reading_time: post.reading_time,
      views: 0,
      featured: false,
      status: 'published' as const,
      category: post.blog_categories,
      author: post.blog_authors
    })) || []
  } catch (error) {
    console.error('Error fetching related posts:', error)
    return []
  }
}

// Função para buscar dados do dashboard admin
export async function getDashboardData() {
  try {
    // Buscar total de posts
    const { count: postsCount, error: postsError } = await supabase
      .from('blog_posts')
      .select('*', { count: 'exact', head: true })

    if (postsError) throw postsError

    // Buscar total de autores
    const { count: authorsCount, error: authorsError } = await supabase
      .from('blog_authors')
      .select('*', { count: 'exact', head: true })

    if (authorsError) throw authorsError

    // Buscar posts recentes (últimos 5)
    const { data: recentPosts, error: recentPostsError } = await supabase
      .from('blog_posts')
      .select(`
        id,
        title,
        slug,
        published_at,
        views,
        blog_authors(name)
      `)
      .order('created_at', { ascending: false })
      .limit(5)

    if (recentPostsError) throw recentPostsError

    return {
      totalPosts: postsCount || 0,
      totalAuthors: authorsCount || 0,
      recentPosts: recentPosts?.map(post => ({
        id: post.id,
        title: post.title,
        slug: post.slug,
        published_at: post.published_at,
        views: post.views,
        author: post.blog_authors
      })) || []
    }
  } catch (error) {
    console.error('Erro ao buscar dados do dashboard:', error)
    return {
      totalPosts: 0,
      totalAuthors: 0,
      recentPosts: []
    }
  }
}