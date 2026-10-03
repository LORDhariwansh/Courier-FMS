import { createClient } from './client'

export const supabase = createClient()

export const hasSupabaseConfig = Boolean(supabase)
