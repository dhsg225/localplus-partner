"use client"

import { motion } from "framer-motion"
import { MCCIndicators } from "../ui/MCCIndicators"

const LoopDiagram = () => {
  const items = [
    { label: "Business", description: "Your services & data" },
    { label: "AI", description: "The Discovery Layer" },
    { label: "User", description: "Customer Intent" },
    { label: "Answer", description: "One Clear Solution" }
  ]

  return (
    <div className="relative w-full max-w-lg aspect-square flex items-center justify-center">
      {/* Background Circle */}
      <svg className="absolute w-full h-full text-gray-100 -rotate-90 scale-90" viewBox="0 0 100 100">
        <circle cx="50" cy="50" r="45" fill="none" stroke="currentColor" strokeWidth="0.5" strokeDasharray="4 4" />
      </svg>
      
      {/* Inner Rotating Ring */}
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
        className="absolute w-full h-full"
      >
        <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-4 h-4 bg-gray-900 rounded-full shadow-lg border-4 border-white" />
      </motion.div>

      {/* Nodes */}
      <div className="grid grid-cols-2 gap-24 relative p-12">
        {items.map((item, idx) => (
          <motion.div
            key={idx}
            whileHover={{ scale: 1.05 }}
            className="flex flex-col items-center justify-center space-y-2 p-6 bg-white rounded-3xl shadow-xl border border-gray-100 z-10"
          >
            <span className="text-xl font-black text-gray-900">{item.label}</span>
            <span className="text-[10px] text-gray-400 font-bold uppercase tracking-widest text-center leading-tight">
               {item.description}
            </span>
          </motion.div>
        ))}
      </div>
      
      {/* Center Logo */}
      <div className="absolute w-16 h-16 bg-white rounded-full shadow-2xl flex items-center justify-center border-4 border-gray-50">
        <div className="w-8 h-8 rounded-full bg-gray-900 flex items-center justify-center">
             <span className="text-white font-black text-xs">LP</span>
        </div>
      </div>
    </div>
  )
}

export const Eli5Section = () => {
  return (
    <section className="py-32 bg-gray-50 flex flex-col items-center justify-center px-6">
      <div className="max-w-4xl text-center space-y-16">
        
        {/* A. Magic Helper */}
        <div className="space-y-6">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="inline-block px-4 py-1.5 bg-gray-200/50 rounded-full text-xs font-bold tracking-widest text-gray-600 uppercase"
          >
            How it works
          </motion.div>
          <h2 className="text-5xl font-extrabold text-gray-900 italic tracking-tight">The LocalPlus Loop</h2>
          <p className="max-w-xl mx-auto text-lg text-gray-500 font-medium leading-relaxed">
            AI models are the new gatekeepers. We don't optimize for search engines; we optimize for <span className="text-gray-900 font-bold">Answers</span>.
          </p>
        </div>

        {/* B. The Loop (Animated) */}
        <div className="flex justify-center">
          <LoopDiagram />
        </div>

        {/* C. Indicators Scale */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 py-12 border-t border-gray-200">
           <div className="flex flex-col items-center space-y-4">
              <MCCIndicators type="mention" label="Mentions" />
              <p className="text-xs text-gray-400 font-medium max-w-[160px]">The core baseline. Being known by the AI.</p>
           </div>
           <div className="flex flex-col items-center space-y-4">
              <MCCIndicators type="citation" label="Citations" />
              <p className="text-xs text-gray-400 font-medium max-w-[160px]">The validation layer. AI citing your data as facts.</p>
           </div>
           <div className="flex flex-col items-center space-y-4">
              <MCCIndicators type="click" label="Clicks" />
              <p className="text-xs text-gray-400 font-medium max-w-[160px]">The economic layer. Converting interest to action.</p>
           </div>
        </div>

      </div>
    </section>
  )
}
