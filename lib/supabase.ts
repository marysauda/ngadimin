import { createClient } from '@supabase/supabase-js'

// Hardcode values untuk memastikan koneksi
const supabaseUrl = 'https://rzqwtrmqxpequanpedjb.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJ6cXd0cm1xeHBlcXVhbnBlZGpiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQ3Njc5NDQsImV4cCI6MjA3MDM0Mzk0NH0.oWY4uwMP9KCBv2uv74glSF6XYmxXaq5NvfKPaaql7Hg'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Check if Supabase is properly configured
export const isSupabaseConfigured = () => {
  return true // Selalu true karena hardcode
}

// Database types
export interface Product {
  id: number
  name: string
  description: string
  price: number
  category: string
  images: string[]
  created_at: string
  updated_at: string
}

export interface SiteSettings {
  id: number
  section: string
  title: string
  content: string
  image_url?: string
  whatsapp_number?: string
  created_at: string
  updated_at: string
}
