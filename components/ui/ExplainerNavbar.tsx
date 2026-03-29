'use client'

import { motion } from "framer-motion"

export default function ExplainerNavbar() {
  return (
    <nav className="fixed top-6 left-1/2 -translate-x-1/2 w-[calc(100%-3rem)] max-w-7xl h-16 px-8 flex justify-between items-center z-[110] bg-white/70 backdrop-blur-xl border border-white/20 rounded-2xl shadow-2xl transition-all duration-300">
        <div className="flex items-center space-x-3">
           <a href="/" className="flex items-center space-x-3 group">
              <div className="w-8 h-8 rounded-lg bg-gray-900 flex items-center justify-center font-black text-white text-[10px] shadow-lg group-hover:scale-110 transition-transform">LP</div>
              <span className="text-sm font-black tracking-tight text-gray-900 uppercase">LocalPlus</span>
           </a>
        </div>
        
        <div className="hidden lg:flex items-center space-x-8">
           <a href="#platform" className="text-[10px] font-black text-gray-400 hover:text-gray-900 transition-colors uppercase tracking-widest">Platform</a>
           <a href="#solutions" className="text-[10px] font-black text-gray-400 hover:text-gray-900 transition-colors uppercase tracking-widest">Pricing</a>
           <div className="h-4 w-[1px] bg-gray-200 mx-2" />
           <a href="/answer-engine" className="text-xs font-black text-blue-600 hover:text-gray-900 transition-colors uppercase tracking-widest bg-blue-50 px-4 py-1.5 rounded-full shadow-sm">Answer Engine Simulation</a>
        </div>

        <div className="flex items-center space-x-4">
           <a 
              href="/login" 
              className="px-6 py-2.5 bg-gray-900 text-white rounded-full text-xs font-black hover:bg-black transition-all shadow-xl hover:shadow-2xl active:scale-95 uppercase tracking-widest text-center"
           >
              Login
           </a>
        </div>
    </nav>
  )
}
