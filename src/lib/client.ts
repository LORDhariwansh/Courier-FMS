import { createBrowserClient } from '@supabase/ssr'
import type { SupabaseClient } from '@supabase/supabase-js'

export function createClient(): SupabaseClient | null {
  const url = import.meta.env.VITE_SUPABASE_URL?.trim()
  const publishableKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY?.trim()
  if (!url || !publishableKey) return null

  return createBrowserClient(
    url,
    publishableKey,
    { auth: { autoRefreshToken: true, persistSession: true, detectSessionInUrl: true } },
  )
}
