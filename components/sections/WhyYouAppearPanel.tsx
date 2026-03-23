"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"

const criteria = [
  { id: "relevance", label: "Relevance", description: "How well your business matches the user's specific intent. Not just keyword matching, but actual value alignment." },
  { id: "proximity", label: "Proximity", description: "The physical distance to the user or the requested area. AI prioritizes the most efficient choice." },
  { id: "availability", label: "Availability", description: "Real-time status. Closed businesses are filtered out instantly for 'right now' queries." },
  { id: "data-quality", label: "Data Quality", description: "The accuracy and depth of your business profile. More high-quality data = higher AI confidence." },
  { id: "sponsored", label: "Sponsored (★)", description: "Priority placement for partner businesses that meet the baseline quality threshold." }
]

export const WhyYouAppearPanel = () => {
  const [active, setActive] = useState<string | null>(null)

  return (
    <section className="py-40 bg-white px-6">
      <div className="max-w-4xl mx-auto space-y-24">
        
        <div className="text-center space-y-4">
          <h2 className="text-5xl font-black text-gray-900 tracking-tighter italic">Transparency Panel</h2>
          <p className="text-lg text-gray-400 font-bold uppercase tracking-widest">Why do you appear in answers?</p>
        </div>

        <div className="space-y-4">
           {criteria.map((item) => (
             <div key={item.id} className="relative group overflow-hidden bg-gray-50/50 rounded-3xl border border-gray-100 transition-all hover:border-gray-900/10">
                <button
                   onClick={() => setActive(active === item.id ? null : item.id)}
                   className="w-full text-left p-8 flex items-center justify-between"
                >
                   <span className="text-2xl font-black text-gray-900 group-hover:pl-2 transition-all">{item.label}</span>
                   <div className={`w-8 h-8 rounded-full border-2 border-gray-900 flex items-center justify-center transition-transform ${active === item.id ? 'rotate-180' : ''}`}>
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" /></svg>
                   </div>
                </button>
                
                <AnimatePresence>
                   {active === item.id && (
                     <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="px-8 pb-8 overflow-hidden"
                     >
                        <p className="text-lg text-gray-500 font-medium leading-relaxed max-w-2xl">{item.description}</p>
                     </motion.div>
                   )}
                </AnimatePresence>
             </div>
           ))}
        </div>

      </div>
    </section>
  )
}
