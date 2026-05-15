import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL?.trim() || ''
const supabaseAnonKey =
  import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY?.trim() ||
  import.meta.env.VITE_SUPABASE_ANON_KEY?.trim() ||
  ''

export const supabaseProfileId = import.meta.env.VITE_SUPABASE_PROFILE_ID?.trim() || 'laura-profile'
export const supabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey)
export const supabase = supabaseConfigured
  ? createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
      },
    })
  : null

export const supabaseSettingsKeys = {
  completedExercises: 'completedExercises',
  expandedMeals: 'expandedMeals',
  selectedWorkout: 'selectedWorkout',
}

export const supabaseLastSyncStorageKey = 'laura_supabase_lastSyncAt'
