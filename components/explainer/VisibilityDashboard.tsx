"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"

const REASONS = [
  { label: "Grounding Match", value: "99.4%", description: "Business facts are verified and up-to-date.", icon: "✅" },
  { label: "Relevance Score", value: "High", description: "Direct match for 'Dental Emergency' query.", icon: "🎯" },
  { label: "Availability", value: "9:00 AM", description: "Confirmed open slot via MCP bridge.", icon: "🕒" },
  { label: "Data Quality", value: "Premium", description: "Complete profile with citations enabled.", icon: "★" }
]

export default function VisibilityDashboard() {
  const [stats, setStats] = useState({
    mentions: 124,
    citations: 32,
    clicks: 89,
    answerShare: 18
  })

  const [activeReason, setActiveReason] = useState<number | null>(null)

  const improveVisibility = (type: keyof typeof stats) => {
    setStats(prev => ({
       ...prev,
       [type]: prev[type] + Math.floor(Math.random() * 5 + 1),
       answerShare: Math.min(prev.answerShare + 1, 100)
    }))
  }

  return (
    <div className="w-full max-w-5xl mx-auto p-4 md:p-8 space-y-8 bg-gray-50/50 rounded-[56px] border border-gray-100 selection:bg-gray-900 selection:text-white">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Metric Cards - Sidebar */}
        <div className="space-y-4">
           <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-2">Your Business Performance</p>
           {Object.entries(stats).map(([key, val]) => (
             <motion.div 
               key={key}
               layout
               className="p-6 bg-white rounded-3xl border border-gray-100 shadow-sm flex justify-between items-center group relative overflow-hidden"
             >
                <div className="space-y-1 relative z-10">
                   <p className="text-[8px] font-black text-gray-400 uppercase tracking-widest">
                     {key === 'answerShare' ? 'Market Answer Share' : key}
                   </p>
                   <p className="text-3xl font-black text-gray-900 tabular-nums tracking-tighter">
                     {val}{key === 'answerShare' ? '%' : ''}
                   </p>
                </div>
                <div className="relative z-10 p-2 bg-green-50 rounded-lg">
                    <span className="text-green-600 font-black text-[10px]">↑</span>
                </div>
                <div className="absolute -bottom-2 -right-2 opacity-10 group-hover:opacity-20 transition-opacity">
                    <p className="text-6xl font-black text-gray-900 select-none">{key === 'mentions' ? '·' : key === 'citations' ? '†' : '↗'}</p>
                </div>
             </motion.div>
           ))}

           {/* Call to Action Controls */}
           <div className="p-8 bg-gray-900 rounded-[32px] shadow-2xl space-y-6 text-white overflow-hidden relative border border-white/5">
                <div className="absolute inset-0 bg-blue-500/10 blur-[100px]" />
                <p className="text-[10px] font-black text-blue-400 uppercase tracking-widest relative z-10">Improve Your Visibility</p>
                <div className="space-y-3 relative z-10">
                    <button onClick={() => improveVisibility('mentions')} className="w-full py-3 px-4 bg-white/10 hover:bg-white/20 rounded-xl text-[10px] font-black uppercase text-left transition-all border border-white/10 flex justify-between group">
                        <span>+ Add Mentions (·)</span>
                        <span className="opacity-0 group-hover:opacity-100 transition-opacity">↗</span>
                    </button>
                    <button onClick={() => improveVisibility('citations')} className="w-full py-3 px-4 bg-white/10 hover:bg-white/20 rounded-xl text-[10px] font-black uppercase text-left transition-all border border-white/10 flex justify-between group">
                        <span>+ Enable Citations (†)</span>
                        <span className="opacity-0 group-hover:opacity-100 transition-opacity">↗</span>
                    </button>
                    <button onClick={() => improveVisibility('clicks')} className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-500 rounded-xl text-[10px] font-black uppercase text-left transition-all flex justify-between group">
                        <span>🚀 Upgrade to Premium (★)</span>
                        <span className="opacity-0 group-hover:opacity-100 transition-opacity">↗</span>
                    </button>
                </div>
           </div>
        </div>

        {/* Dashboard Main Visual */}
        <div className="lg:col-span-2 space-y-8">
           <div className="relative bg-white border border-gray-100 rounded-[48px] p-10 shadow-xl overflow-hidden min-h-[500px] flex flex-col">
                <div className="flex justify-between items-center mb-12">
                   <div className="space-y-1">
                      <p className="text-[10px] font-black text-blue-500 uppercase tracking-widest leading-none">System Dashboard</p>
                      <h3 className="text-2xl font-black text-gray-900 uppercase font-heading tracking-tighter italic">Why You Appear</h3>
                   </div>
                   <div className="px-4 py-2 bg-green-50 rounded-full border border-green-100">
                      <p className="text-[10px] font-black text-green-600 uppercase tracking-widest leading-none">Status: Optimized</p>
                   </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 flex-1">
                   {REASONS.map((r, i) => (
                     <motion.div 
                       key={i}
                       onHoverStart={() => setActiveReason(i)}
                       onHoverEnd={() => setActiveReason(null)}
                       className={`p-8 rounded-[36px] border transition-all cursor-crosshair group ${
                         activeReason === i ? 'bg-gray-900 border-gray-900 scale-[1.02] shadow-2xl' : 'bg-gray-50 border-gray-100'
                       }`}
                     >
                        <div className="flex justify-between items-start mb-6">
                           <span className="text-2xl group-hover:scale-125 transition-transform">{r.icon}</span>
                           <span className={`text-2xl font-black tabular-nums tracking-tighter ${activeReason === i ? 'text-blue-400' : 'text-gray-900'}`}>{r.value}</span>
                        </div>
                        <p className={`text-[10px] font-black uppercase tracking-widest mb-2 ${activeReason === i ? 'text-white/40' : 'text-gray-400'}`}>
                           {r.label}
                        </p>
                        <p className={`text-sm font-bold leading-tight ${activeReason === i ? 'text-white' : 'text-gray-600'}`}>
                           {r.description}
                        </p>
                     </motion.div>
                   ))}
                </div>

                <div className="mt-12 pt-8 border-t border-gray-100 flex items-center justify-between">
                   <p className="text-[8px] font-bold text-gray-400 uppercase tracking-[0.2em] leading-none">Reference ID: LP-DISC-9932</p>
                   <div className="flex -space-x-2">
                       {[1,2,3,4].map(i => <div key={i} className="w-6 h-6 rounded-full bg-gray-100 border-2 border-white" />)}
                       <div className="w-6 h-6 rounded-full bg-blue-100 border-2 border-white flex items-center justify-center text-[8px] font-black text-blue-500">+8</div>
                   </div>
                </div>
           </div>
        </div>

      </div>
    </div>
  )
}
