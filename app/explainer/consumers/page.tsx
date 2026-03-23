"use client"

import { motion } from "framer-motion"
import { BusinessShowcase } from "@/components/ui/BusinessShowcase"
import { HeroSection } from "@/components/sections/HeroSection"

export default function ConsumersPage() {
    return (
        <main className="bg-white min-h-screen Selection:bg-gray-900 Selection:text-white pb-32">
            {/* Contextual Header */}
            <section className="pt-32 pb-24 px-6 border-b border-gray-100 bg-gray-50/50">
                <div className="max-w-7xl mx-auto space-y-6">
                    <motion.div 
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="inline-block px-4 py-1.5 bg-gray-200/50 rounded-full text-xs font-black tracking-widest text-gray-500 uppercase font-heading"
                    >
                        Consumer Perspective
                    </motion.div>
                    <h1 className="text-4xl md:text-6xl font-black text-gray-900 italic tracking-tighter leading-none font-heading">The End of the Endless Scroll.</h1>
                    <p className="max-w-2xl text-xl text-gray-400 font-bold lowercase tracking-tight leading-relaxed">LocalPlus delivers the single, most relevant choice directly into the conversation. No ads. No irrelevant results. Just the answer.</p>
                </div>
            </section>

            {/* Main Showcase */}
            <section className="py-24 px-6">
                <div className="max-w-7xl mx-auto space-y-16">
                     <div className="space-y-4">
                        <h2 className="text-3xl font-black text-gray-900 italic tracking-tighter font-heading uppercase">Suggested Discoveries</h2>
                        <p className="text-sm font-black text-gray-400 uppercase tracking-widest">How LocalPlus appears to the end-user.</p>
                     </div>
                     <BusinessShowcase />
                </div>
            </section>

            {/* Key Benefits */}
            <section className="py-24 px-6 bg-gray-900 text-white rounded-[64px] mx-6">
                <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-16">
                     {[
                         { title: "Zero Interference", desc: "No paid links ever interfere with the top AI result." },
                         { title: "Verified Facts", desc: "AI cites real-time business data for total confidence." },
                         { title: "Instant Action", desc: "One-click transitions from chat to bookings." }
                     ].map((item, idx) => (
                         <div key={idx} className="space-y-4">
                             <h3 className="text-2xl font-black italic tracking-tighter uppercase font-heading">{item.title}</h3>
                             <p className="text-white/40 font-bold leading-relaxed">{item.desc}</p>
                         </div>
                     ))}
                </div>
            </section>
        </main>
    )
}
