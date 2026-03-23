"use client"

import { motion } from "framer-motion"
import { HeroSection } from "@/components/sections/HeroSection"
import { LogicalChoiceSequence } from "@/components/sections/LogicalChoiceSequence"
import { ComparisonSection } from "@/components/sections/ComparisonSection"
import { CTASection, Footer } from "@/components/sections/CTASection"

export default function ExplainerPage() {
  return (
    <main className="relative w-full overflow-x-hidden selection:bg-gray-900 selection:text-white">
      {/* Scroll Progress Bar moved to layout */}

      {/* Sections */}
      <HeroSection />

      <LogicalChoiceSequence />

      <ComparisonSection />
      
      <CTASection />
      
      <Footer />
      
    </main>
  )
}
