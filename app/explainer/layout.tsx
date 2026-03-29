"use client"

import { motion } from "framer-motion"

export default function ExplainerLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="relative w-full overflow-x-hidden selection:bg-gray-900 selection:text-white">
      {/* Scroll Progress Bar */}
      <motion.div
         style={{ scaleX: 0 }}
         animate={{ scaleX: 1 }}
         transition={{ duration: 1 }}
         className="fixed top-0 left-0 right-0 h-1 bg-gray-900 origin-left z-[110]"
      />
      
      {/* Navbar Minimal Glassmorphism (Shared) */}
      <nav className="fixed top-6 left-1/2 -translate-x-1/2 w-[calc(100%-3rem)] max-w-7xl h-16 px-8 flex justify-between items-center z-[100] bg-white/70 backdrop-blur-xl border border-white/20 rounded-2xl shadow-2xl transition-all duration-300">
          <div className="flex items-center space-x-3">
             <a href="/" className="flex items-center space-x-3">
                <div className="w-8 h-8 rounded-lg bg-gray-900 flex items-center justify-center font-black text-white text-[10px] shadow-lg">LP</div>
                <span className="text-sm font-black tracking-tight text-gray-900 uppercase">LocalPlus</span>
             </a>
          </div>
          
          <div className="hidden lg:flex items-center space-x-8">
             <a href="#" className="text-[10px] font-black text-gray-400 hover:text-gray-900 transition-colors uppercase tracking-widest">Platform</a>
             <a href="#" className="text-[10px] font-black text-gray-400 hover:text-gray-900 transition-colors uppercase tracking-widest">Solutions</a>
             <a href="#" className="text-[10px] font-black text-gray-400 hover:text-gray-900 transition-colors uppercase tracking-widest">Pricing</a>
             <div className="h-4 w-[1px] bg-gray-200 mx-2" />
             <a href="/explainer/consumers" className="text-xs font-bold text-gray-900 hover:opacity-70 transition-opacity uppercase tracking-widest">For Consumers</a>
             <a href="/explainer/businesses" className="text-xs font-bold text-gray-900 hover:opacity-70 transition-opacity uppercase tracking-widest">For Businesses</a>
             <a href="/explainer/tech" className="text-xs font-bold text-gray-900 hover:opacity-70 transition-opacity uppercase tracking-widest border-b-2 border-gray-900 pb-1">The Tech</a>
          </div>

          <div className="flex items-center space-x-4">
             <a href="/login" className="px-6 py-2.5 bg-gray-900 text-white rounded-full text-xs font-black hover:bg-black transition-all shadow-lg hover:shadow-xl active:scale-95 uppercase tracking-widest text-center">
                Login
             </a>
          </div>
      </nav>

      <main>{children}</main>
    </div>
  )
}
