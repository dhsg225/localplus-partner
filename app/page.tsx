import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import ExplainerPage from './explainer/page'
import ExplainerNavbar from '@/components/ui/ExplainerNavbar'

export default async function HomePage() {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()

  // If already logged in, go straight to the dash
  if (user) {
    redirect('/dashboard')
  }

  // Otherwise, show the world-class explainer
  return (
    <>
      <ExplainerNavbar />
      <ExplainerPage />
    </>
  )
}
