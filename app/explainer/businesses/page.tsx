"use client"

import { motion } from "framer-motion"
import VisibilityDashboard from "@/components/explainer/VisibilityDashboard"

export default function BusinessesPage() {
  return (
    <main className="bg-white min-h-screen selection:bg-gray-900 selection:text-white pb-32">
        {/* Section 1: Interaction Simulation (The Hero) */}
        <section className="pt-24 pb-32 px-6">
            <div className="max-w-7xl mx-auto text-center space-y-8 mb-20">
                <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="inline-block px-4 py-2 bg-green-50 rounded-full"
                >
                    <p className="text-[10px] font-black text-green-600 uppercase tracking-[0.3em]">Business Perspective</p>
                </motion.div>
                <h1 className="text-5xl md:text-8xl font-black text-gray-900 italic tracking-tighter leading-[0.85] font-heading max-w-4xl mx-auto">
                   Stop Searching. <br/> Start Appearing.
                </h1>
                <p className="max-w-xl mx-auto text-xl text-gray-400 font-bold lowercase tracking-tight">
                   The LocalPlus Partner Dashboard. Real-time control over your AI visibility, mentions, and citations.
                </p>
            </div>

            <VisibilityDashboard />
        </section>

        {/* Section 2: Why You Appear (Explanation) */}
        <section className="px-6 py-32 bg-gray-900 text-white rounded-[64px] mx-4 md:mx-12 border border-white/5 overflow-hidden">
             <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
                 <div className="space-y-12">
                     <div className="space-y-6">
                        <h2 className="text-4xl md:text-7xl font-black text-white italic tracking-tighter uppercase font-heading leading-none">Command Your <br/> Answer Share.</h2>
                        <p className="text-xl text-white/40 font-bold lowercase leading-relaxed italic">Marketing used to be about clicks. For AI, it’s about **Grounding**. We translate your raw business data into authoritative citations that LLMs trust implicitly.</p>
                     </div>
                     
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                         <div className="space-y-2 p-8 bg-white/5 rounded-3xl border border-white/10 group hover:border-blue-500/50 transition-all">
                            <p className="text-3xl font-black text-white tracking-tighter italic leading-none">Mentions (·)</p>
                            <p className="text-xs text-blue-400 font-bold uppercase tracking-widest mt-2">+ Presence Control</p>
                            <p className="text-sm text-white/40 font-medium leading-relaxed mt-4">Gain top-of-mind awareness for all relevant category queries.</p>
                         </div>
                         <div className="space-y-2 p-8 bg-white/5 rounded-3xl border border-white/10 group hover:border-green-500/50 transition-all">
                            <p className="text-3xl font-black text-white tracking-tighter italic leading-none">Citations (†)</p>
                            <p className="text-xs text-green-400 font-bold uppercase tracking-widest mt-2">+ Authority Proof</p>
                            <p className="text-sm text-white/40 font-medium leading-relaxed mt-4">Convert the mention into a verified fact the AI assistant will stand behind.</p>
                         </div>
                     </div>
                 </div>

                 <div className="relative group">
                    <div className="p-10 bg-white/5 border border-white/10 rounded-[48px] shadow-2xl space-y-8">
                         <div className="flex items-center space-x-3">
                             <div className="w-10 h-1 h-1 bg-blue-500 rounded" />
                             <p className="text-[10px] font-black text-blue-400 uppercase tracking-widest">Visibility Algorithm Simulation</p>
                         </div>
                         <div className="space-y-4">
                              <p className="text-sm font-bold text-white/80 leading-relaxed italic">"If a user asks for 'Best Pizza', our ranking engine weights your **Data Quality** score against **Distance**. High quality data = Higher Grounding probability."</p>
                              <div className="pt-8 grid grid-cols-3 gap-4 border-t border-white/10">
                                   <div className="text-center"><p className="text-xs font-black text-white/30 uppercase">Distance</p><p className="text-xl font-black text-white">40%</p></div>
                                   <div className="text-center font-black text-green-400 text-2xl mt-4">+</div>
                                   <div className="text-center"><p className="text-xs font-black text-white/30 uppercase">Grounding</p><p className="text-xl font-black text-white">60%</p></div>
                              </div>
                         </div>
                    </div>
                 </div>
             </div>
        </section>

        {/* Section 3: Revenue Driven */}
        <section className="max-w-6xl mx-auto px-6 py-32 text-center space-y-20">
            <h3 className="text-4xl font-black text-gray-900 uppercase italic font-heading tracking-tighter leading-none">Built for conversion.</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-16 md:gap-8">
                {[
                  { label: "18% avg.", desc: "Increase in direct, ad-free AI discovery share.", icon: "📈", sub: "Market Share" },
                  { label: "32 avg.", desc: "Daily citations triggered by verified business facts.", icon: "⚡", sub: "Grounding Events" },
                  { label: "3.2x", desc: "Better conversion rate than traditional SERP links.", icon: "🔥", sub: "ROI Uplift" }
                ].map((s, i) => (
                  <div key={i} className="space-y-6">
                     <div className="w-16 h-16 bg-gray-50 border border-gray-100 rounded-2xl flex items-center justify-center mx-auto text-2xl shadow-sm">{s.icon}</div>
                     <div className="space-y-2">
                        <p className="text-3xl font-black text-gray-900 uppercase tracking-tighter leading-none">{s.label}</p>
                        <p className="text-[10px] font-black text-blue-500 uppercase tracking-widest">{s.sub}</p>
                        <p className="text-sm text-gray-400 font-bold leading-relaxed max-w-[240px] mx-auto">{s.desc}</p>
                     </div>
                  </div>
                ))}
            </div>
        </section>
    </main>
  )
}
