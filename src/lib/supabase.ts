import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Types for database
export interface StudioDB {
  id: string
  title: string
  total_score: number
  reviews_count: number
  street: string
  postal_code: string
  neighborhood: string
  state: string
  phone: string
  category_name: string
  url: string
  image_url: string
  website?: string
  opening_hours: any[] // JSON field
  location: { lat: number; lng: number } // JSON field
  address: string
  city_code: string
  slug: string
  created_at?: string
  updated_at?: string
}

export interface Database {
  public: {
    Tables: {
      studios: {
        Row: StudioDB
        Insert: Omit<StudioDB, 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Omit<StudioDB, 'id' | 'created_at' | 'updated_at'>>
      }
    }
  }
}