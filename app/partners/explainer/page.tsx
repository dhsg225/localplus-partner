"use client"

import { motion } from "framer-motion"
import { HeroSection } from "@/components/sections/HeroSection"
import { ComparisonSection } from "@/components/sections/ComparisonSection"
import { Eli5Section } from "@/components/sections/Eli5Section"
import { IndustryCardSection } from "@/components/sections/IndustryCardSection"
import { AIAnswerDemo } from "@/components/sections/AIAnswerDemo"
import { WhyYouAppearPanel } from "@/components/sections/WhyYouAppearPanel"
import { CTASection, Footer } from "@/components/sections/CTASection"

export default function ExplainerPage() {
  return (
    <main className="relative w-full overflow-x-hidden selection:bg-gray-900 selection:text-white">
      {/* Scroll Progress Bar */}
      <motion.div
         style={{ scaleX: 0 }}
         animate={{ scaleX: 1 }}
         transition={{ duration: 1 }}
         className="fixed top-0 left-0 right-0 h-1 bg-gray-900 origin-left z-[100]"
      />
      
      {/* Sticky Bottom CTA for Mobile */}
      <motion.div
         initial={{ y: 100 }}
         animate={{ y: 0 }}
         transition={{ delay: 2 }}
         className="md:hidden fixed bottom-6 left-6 right-6 z-[90]"
      >
         <button className="w-full py-4 bg-gray-900 text-white rounded-2xl font-black shadow-3xl flex items-center justify-center space-x-2">
             <span>Join as Partner ↗</span>
         </button>
      </motion.div>

      {/* Navbar Minimal */}
      <nav className="fixed top-0 left-0 right-0 py-6 px-12 flex justify-between items-center z-50 mix-blend-difference invert pointer-events-none">
          <div className="flex items-center space-x-3 pointer-events-auto">
             <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center font-black text-black text-[10px]">LP</div>
             <span className="text-sm font-black tracking-widest text-white uppercase">LocalPlus</span>
          </div>
          <div className="hidden md:flex items-center space-x-8 pointer-events-auto">
             <a href="#" className="text-xs font-black text-white hover:opacity-50 transition-opacity uppercase tracking-widest">Pricing</a>
             <a href="#" className="text-xs font-black text-white hover:opacity-50 transition-opacity uppercase tracking-widest">Docs</a>
             <button className="px-6 py-2 border-2 border-white text-white rounded-full text-xs font-black hover:bg-white hover:text-black transition-all uppercase tracking-widest">
                Login
             </button>
          </div>
      </nav>

      {/* Sections */}
      <HeroSection />
      
      <ComparisonSection />
      
      <Eli5Section />
      
      <IndustryCardSection />
      
      <AIAnswerDemo />
      
      <WhyYouAppearPanel />
      
      <CTASection />
      
      <Footer />
      
    </main>
  )
}
