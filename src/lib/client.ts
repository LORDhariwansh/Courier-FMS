import { createBrowserClient } from '@supabase/ssr'
import type { SupabaseClient } from '@supabase/supabase-js'
import type { Database } from '../types/database'

export function createClient(): SupabaseClient<Database> | null {
  const url = import.meta.env.VITE_SUPABASE_URL?.trim()
  const publishableKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY?.trim()
  if (!url || !publishableKey) return null

  return createBrowserClient<Database>(
    url,
    publishableKey,
    { auth: { autoRefreshToken: true, persistSession: true, detectSessionInUrl: true } },
  )
}
