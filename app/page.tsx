import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { PlatformHero } from "@/components/sections/PlatformHero"
import { IndustryCardSection } from "@/components/sections/IndustryCardSection"
import { PhilosophySection } from "@/components/sections/PhilosophySection"
import { CTASection, Footer } from "@/components/sections/CTASection"
import ExplainerNavbar from "@/components/ui/ExplainerNavbar"

export default async function HomePage() {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()

  // If already logged in, go straight to the dash
  if (user) {
    redirect('/dashboard')
  }

  // Otherwise, show the True LocalPlus Platform Explainer (Macro Narrative)
  // v1.3.3: Correct Platform vs Answer Engine separation.
  return (
    <main className="relative w-full overflow-x-hidden selection:bg-blue-500 selection:text-white">
      <ExplainerNavbar />
      
      {/* 1. Platform-level Hero: The Operating System */}
      <PlatformHero />

      {/* 2. Industry-specific Modules: Restaurants, Home Services, Clinics, Events */}
      <div id="industries">
        <IndustryCardSection />
      </div>

      {/* 3. Platform Philosophy: Push vs Pull, Operational Reality */}
      <PhilosophySection />
      
      {/* 4. Conversion and Footer */}
      <CTASection />
      <Footer />
    </main>
  )
}
