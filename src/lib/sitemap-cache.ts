import { supabase } from './supabase'

// Cache em memória para evitar regeneração desnecessária
let cacheData = {
  lastUpdated: '',
  shouldRegenerate: true
}

// Função para verificar se houve mudanças na base
export async function checkForChanges(): Promise<boolean> {
  try {
    // Busca o registro mais recentemente atualizado
    const { data, error } = await supabase
      .from('studios')
      .select('updated_at')
      .order('updated_at', { ascending: false })
      .limit(1)

    if (error || !data || data.length === 0) {
      return true // Em caso de erro, força regeneração
    }

    const latestUpdate = data[0].updated_at
    
    if (cacheData.lastUpdated !== latestUpdate) {
      cacheData.lastUpdated = latestUpdate
      cacheData.shouldRegenerate = true
      return true
    }

    return false
  } catch (error) {
    console.error('Error checking for changes:', error)
    return true // Em caso de erro, força regeneração
  }
}

// Marca que o cache foi atualizado
export function markCacheUpdated() {
  cacheData.shouldRegenerate = false
}

// Força regeneração do cache
export function forceCacheRegeneration() {
  cacheData.shouldRegenerate = true
  cacheData.lastUpdated = ''
}

// Verifica se precisa regenerar
export function shouldRegenerateCache(): boolean {
  return cacheData.shouldRegenerate
}

// Função para invalidar cache quando houver mudanças significativas
export async function invalidateSitemapCache() {
  try {
    // Esta função pode ser chamada via webhook do Supabase
    // ou através de um job cron quando dados são atualizados
    forceCacheRegeneration()
    
    // Opcional: Fazer ping nos search engines sobre atualização
    await notifySearchEngines()
  } catch (error) {
    console.error('Error invalidating cache:', error)
  }
}

// Notifica search engines sobre mudanças no sitemap
async function notifySearchEngines() {
  const sitemapUrl = 'https://pilates-sp.com/sitemap.xml'
  
  const searchEngines = [
    `https://www.google.com/ping?sitemap=${encodeURIComponent(sitemapUrl)}`,
    `https://www.bing.com/ping?sitemap=${encodeURIComponent(sitemapUrl)}`
  ]

  try {
    await Promise.all(
      searchEngines.map(async (url) => {
        try {
          const response = await fetch(url, { method: 'GET' })
          console.log(`Notified search engine: ${url} - Status: ${response.status}`)
        } catch (error) {
          console.error(`Failed to notify search engine ${url}:`, error)
        }
      })
    )
  } catch (error) {
    console.error('Error notifying search engines:', error)
  }
}