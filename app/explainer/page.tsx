"use client"

import { motion } from "framer-motion"
import { HeroSection } from "@/components/sections/HeroSection"
import { LogicalChoiceSequence } from "@/components/sections/LogicalChoiceSequence"
import { SegmentedContentSections } from "@/components/sections/SegmentedContentSections"
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

      {/* Navbar Minimal Glassmorphism */}
      <nav className="fixed top-6 left-1/2 -translate-x-1/2 w-[calc(100%-3rem)] max-w-7xl h-16 px-8 flex justify-between items-center z-[100] bg-white/70 backdrop-blur-xl border border-white/20 rounded-2xl shadow-2xl transition-all duration-300">
          <div className="flex items-center space-x-3">
             <div className="w-8 h-8 rounded-lg bg-gray-900 flex items-center justify-center font-black text-white text-[10px] shadow-lg">LP</div>
             <span className="text-sm font-black tracking-tight text-gray-900 uppercase">LocalPlus</span>
          </div>
          
          <div className="hidden lg:flex items-center space-x-8">
             <a href="#" className="text-[10px] font-black text-gray-400 hover:text-gray-900 transition-colors uppercase tracking-widest">Platform</a>
             <a href="#" className="text-[10px] font-black text-gray-400 hover:text-gray-900 transition-colors uppercase tracking-widest">Solutions</a>
             <a href="#" className="text-[10px] font-black text-gray-400 hover:text-gray-900 transition-colors uppercase tracking-widest">Pricing</a>
             <div className="h-4 w-[1px] bg-gray-200 mx-2" />
             <a href="#consumers" className="text-xs font-bold text-gray-900 hover:opacity-70 transition-opacity uppercase tracking-widest">For Consumers</a>
             <a href="#businesses" className="text-xs font-bold text-gray-900 hover:opacity-70 transition-opacity uppercase tracking-widest">For Businesses</a>
             <a href="#tech" className="text-xs font-bold text-gray-900 hover:opacity-70 transition-opacity uppercase tracking-widest">The Tech</a>
          </div>

          <div className="flex items-center space-x-4">
             <button className="hidden sm:block text-xs font-bold text-gray-600 hover:text-gray-900 transition-colors uppercase tracking-widest">Login</button>
             <button className="px-6 py-2.5 bg-gray-900 text-white rounded-full text-xs font-black hover:bg-black transition-all shadow-lg hover:shadow-xl active:scale-95 uppercase tracking-widest">
                Get Started
             </button>
          </div>
      </nav>

      {/* Sections */}
      <HeroSection />

      <LogicalChoiceSequence />

      <SegmentedContentSections />
      
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
