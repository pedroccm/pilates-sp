/**
 * Utilitários para URLs de imagens dos studios
 * Gera URLs dinamicamente baseado nos dados do studio
 */

import { Studio } from '@/types/studio';

// URL base das imagens (pode ser alterada por variável de ambiente)
const IMAGE_BASE_URL = process.env.NEXT_PUBLIC_IMAGE_BASE_URL || '/uploads/studios/';

/**
 * Normaliza string para URL/filename amigável
 */
function normalizeString(text: string): string {
  if (!text) return '';
  
  // Remover acentos e caracteres especiais
  return text
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/[-\s]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .substring(0, 50);
}

/**
 * Gera nome SEO-friendly do arquivo baseado nos dados do studio
 */
function generateSeoFilename(studio: Partial<Studio>): string {
  const name = normalizeString(studio.title || '');
  const neighborhood = normalizeString(studio.neighborhood || '');
  const city = normalizeString(studio.city_code || '');
  
  // Garantir dados mínimos
  const safeName = name || 'studio';
  const safeNeighborhood = neighborhood || 'centro';
  const safeCity = city || 'sp';
  
  return `pilates-${safeNeighborhood}-${safeCity}-${safeName}`;
}

/**
 * Retorna URL completa da imagem do studio
 * @param studio Dados do studio ou nome do arquivo de imagem
 * @param size Tamanho da imagem (original, medium, thumbnail)
 * @returns URL completa da imagem
 */
export function getStudioImageUrl(
  studio: string | Partial<Studio> | null | undefined, 
  size: 'original' | 'medium' | 'thumbnail' = 'medium'
): string {
  // Se não tem dados, retorna placeholder
  if (!studio) {
    return getPlaceholderImageUrl(size);
  }
  
  // Se é uma string, pode ser URL completa ou nome de arquivo legado
  if (typeof studio === 'string') {
    // Se já é uma URL completa, retorna como está
    if (studio.startsWith('http://') || studio.startsWith('https://')) {
      return studio;
    }
    
    // Se é nome de arquivo legado, usa como está
    if (studio.includes('.')) {
      const nameWithoutExt = studio.replace(/\.(jpg|jpeg|png|webp)$/i, '');
      
      if (size === 'medium') {
        return `${IMAGE_BASE_URL}medium/${nameWithoutExt}.webp`;
      } else if (size === 'thumbnail') {
        return `${IMAGE_BASE_URL}thumbnails/${nameWithoutExt}.webp`;
      } else {
        return `${IMAGE_BASE_URL}original/${studio}`;
      }
    }
    
    return getPlaceholderImageUrl(size);
  }
  
  // Se é objeto studio, gera nome dinamicamente
  const filename = generateSeoFilename(studio);
  
  if (size === 'medium') {
    return `${IMAGE_BASE_URL}medium/${filename}.webp`;
  } else if (size === 'thumbnail') {
    return `${IMAGE_BASE_URL}thumbnails/${filename}.webp`;
  } else {
    return `${IMAGE_BASE_URL}original/${filename}.jpg`;
  }
}

/**
 * Retorna URL do placeholder quando não há imagem
 */
export function getPlaceholderImageUrl(size: 'original' | 'medium' | 'thumbnail' = 'medium'): string {
  const placeholders = {
    thumbnail: '/images/placeholder-studio-thumb.jpg',
    medium: '/images/placeholder-studio-medium.jpg',
    original: '/images/placeholder-studio.jpg'
  };
  
  return placeholders[size] || placeholders.medium;
}

/**
 * Retorna srcSet para imagens responsivas
 * @param studio Dados do studio ou nome do arquivo de imagem
 * @returns String srcSet para usar em <img>
 */
export function getStudioImageSrcSet(studio: string | Partial<Studio> | null | undefined): string {
  if (!studio) {
    return '';
  }
  
  const thumbnailUrl = getStudioImageUrl(studio, 'thumbnail');
  const mediumUrl = getStudioImageUrl(studio, 'medium');
  const originalUrl = getStudioImageUrl(studio, 'original');
  
  return `${thumbnailUrl} 300w, ${mediumUrl} 600w, ${originalUrl} 1200w`;
}

/**
 * Props otimizadas para componente Image do Next.js
 */
export function getOptimizedImageProps(
  studio: string | Partial<Studio> | null | undefined,
  alt: string,
  size: 'original' | 'medium' | 'thumbnail' = 'medium'
) {
  const src = getStudioImageUrl(studio, size);
  const srcSet = getStudioImageSrcSet(studio);
  
  // Dimensões baseadas no size
  const dimensions = {
    thumbnail: { width: 300, height: 200 },
    medium: { width: 600, height: 400 },
    original: { width: 1200, height: 800 }
  };
  
  return {
    src,
    alt,
    ...dimensions[size],
    srcSet: srcSet || undefined,
    sizes: size === 'thumbnail' 
      ? '(max-width: 768px) 100vw, 300px'
      : size === 'medium'
      ? '(max-width: 768px) 100vw, 600px'
      : '100vw',
    loading: 'lazy' as const,
    placeholder: 'blur' as const,
    blurDataURL: 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkbHB0eH/xAAVAQEBAQEAAAAAAAAAAAAAAAAAAQIF/8QAGhEAAgMBAQAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bk+h0R//2Q=='
  };
}