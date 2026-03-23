"use client"

import { motion } from "framer-motion"

export const CTASection = () => {
  return (
    <section className="py-60 bg-gray-900 flex flex-col items-center justify-center px-6 relative overflow-hidden">
      
      {/* Background Shapes */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500 rounded-full blur-[200px] opacity-20 -translate-y-1/2 translate-x-1/2" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-green-500 rounded-full blur-[200px] opacity-20 translate-y-1/2 -translate-x-1/2" />

      <div className="max-w-4xl text-center space-y-12 z-10">
        
        <motion.div
           initial={{ opacity: 0, scale: 0.95 }}
           whileInView={{ opacity: 1, scale: 1 }}
           className="space-y-6"
        >
          <h2 className="text-7xl font-black text-white leading-tight tracking-tighter italic font-serif">
             Get inside AI answers.
          </h2>
          <p className="max-w-xl mx-auto text-xl text-white/50 font-medium leading-relaxed">
            Stop competing for links. Start becoming the answer. Join the LocalPlus Partner network today.
          </p>
        </motion.div>

        <div className="flex justify-center flex-wrap gap-8">
           <button className="px-12 py-6 bg-white text-black font-black text-2xl rounded-3xl hover:bg-gray-200 hover:scale-105 active:scale-95 transition-all shadow-2xl">
              Join as Partner ↗
           </button>
           <button className="px-12 py-6 border-2 border-white/20 text-white font-black text-2xl rounded-3xl hover:bg-white/10 transition-colors">
              Request Demo
           </button>
        </div>

      </div>
    </section>
  )
}

export const Footer = () => {
  return (
    <footer className="py-20 bg-gray-900 border-t border-white/10 px-6">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center space-y-8 md:space-y-0 text-white/40 font-bold text-xs uppercase tracking-[0.2em]">
         <div className="flex items-center space-x-3">
             <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center font-black text-black text-[10px]">LP</div>
             <span>© 2026 LOCALPLUS INC.</span>
         </div>
         
         <div className="flex gap-8">
            <a href="#" className="hover:text-white transition-colors">Privacy</a>
            <a href="#" className="hover:text-white transition-colors">Terms</a>
            <a href="#" className="hover:text-white transition-colors">Security</a>
            <a href="#" className="hover:text-white transition-colors">Partner Dashboard</a>
         </div>
      </div>
    </footer>
  )
}
