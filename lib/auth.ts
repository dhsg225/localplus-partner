import { createClient } from './supabase/server'

/**
 * Server-side Auth Service
 * 
 * Centralizes authentication logic to eliminate direct createClient calls 
 * in UI components, adhering to the "Gatekeeper" architecture.
 */
export async function getCurrentUser() {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  return user
}

export async function requireUser() {
  const user = await getCurrentUser()
  if (!user) {
    throw new Error('Unauthorized')
  }
  return user
}
