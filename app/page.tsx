import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { motion } from "framer-motion"
import { HeroSection } from "@/components/sections/HeroSection"
import { LogicalChoiceSequence } from "@/components/sections/LogicalChoiceSequence"
import { ComparisonSection } from "@/components/sections/ComparisonSection"
import { CTASection, Footer } from "@/components/sections/CTASection"
import ExplainerNavbar from "@/components/ui/ExplainerNavbar"

export default async function HomePage() {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()

  // If already logged in, go straight to the dash
  if (user) {
    redirect('/dashboard')
  }

  // Otherwise, show the Full Platform Explainer (Root /)
  return (
    <main className="relative w-full overflow-x-hidden selection:bg-gray-900 selection:text-white">
      <ExplainerNavbar />
      
      {/* Sections: Platform narrative (Hero, Logical Choice, etc.) */}
      <HeroSection />

      <LogicalChoiceSequence />

      <ComparisonSection />
      
      <CTASection />
      
      <Footer />
    </main>
  )
}
