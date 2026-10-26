import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string | undefined
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined

/**
 * Checks whether valid Supabase credentials have been provided in the environment.
 */
export const isSupabaseConfigured = (): boolean => {
  return Boolean(
    supabaseUrl &&
    supabaseAnonKey &&
    supabaseUrl !== 'https://your-project-ref.supabase.co' &&
    supabaseAnonKey !== 'your-anon-key' &&
    supabaseUrl.startsWith('https://')
  )
}

/**
 * Supabase client instance. Null when credentials are not configured,
 * triggering safe fallback to local development mode.
 */
export const supabase = isSupabaseConfigured()
  ? createClient(supabaseUrl!, supabaseAnonKey!)
  : null

