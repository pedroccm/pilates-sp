import fs from 'fs'
import path from 'path'
import { MDXRemote } from 'next-mdx-remote/rsc'

// Componentes disponíveis no MDX
import { TopStudios } from '@/components/mdx/TopStudios'
import { StudioFinder } from '@/components/mdx/StudioFinder'
import { LiveStats } from '@/components/mdx/LiveStats'
import { PriceComparator } from '@/components/mdx/PriceComparator'
import { StudiosMap } from '@/components/mdx/StudiosMap'
import { BlogCTA } from '@/components/mdx/BlogCTA'
import { StudioCard as MDXStudioCard } from '@/components/mdx/StudioCard'

export const mdxComponents = {
  TopStudios,
  StudioFinder,
  LiveStats,
  PriceComparator,
  StudiosMap,
  BlogCTA,
  StudioCard: MDXStudioCard,
}

const contentDirectory = path.join(process.cwd(), 'content/blog')

export async function getMDXContent(filename: string) {
  try {
    const filePath = path.join(contentDirectory, filename)
    
    // Verificar se arquivo existe
    if (!fs.existsSync(filePath)) {
      console.warn(`MDX file not found: ${filename}`)
      return null
    }

    const source = fs.readFileSync(filePath, 'utf8')
    
    return {
      content: source,
      filename
    }
  } catch (error) {
    console.error(`Error processing MDX file ${filename}:`, error)
    return null
  }
}

export function getAllMDXFiles() {
  try {
    if (!fs.existsSync(contentDirectory)) {
      return []
    }
    
    const files = fs.readdirSync(contentDirectory)
    return files.filter(file => file.endsWith('.mdx'))
  } catch (error) {
    console.error('Error reading MDX directory:', error)
    return []
  }
}

// Componente para renderizar MDX
export function MDXContent({ source }: { source: string }) {
  return <MDXRemote source={source} components={mdxComponents} />
}