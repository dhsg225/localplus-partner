import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import PartnerLandingLegacy from './(landing)/components/PartnerLandingLegacy'

/**
 * Root Switcher (v1.4.0)
 * 
 * 1. Auth Logic: Logged-in partners are redirected to /dashboard.
 * 2. Platform Reality: Logged-out visitors see the RESTORED GROUND TRUTH 
 *    (Feb 8th Version: "The Operating System for Local Business").
 * 
 * This page replaces all Answer Engine / simulation-focused root overwrites.
 */
export default async function HomePage() {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()

  // If already logged in, go straight to the dash
  if (user) {
    redirect('/dashboard')
  }

  // Otherwise, show the faithful port of the original PartnerLanding.tsx
  return (
    <main className="w-full">
      <PartnerLandingLegacy />
    </main>
  )
}
