"use client"

import { motion } from "framer-motion"
import { BusinessShowcase } from "@/components/ui/BusinessShowcase"

export default function BusinessesPage() {
    return (
        <main className="bg-white min-h-screen selection:bg-gray-900 selection:text-white pb-32">
            {/* Business Context Header */}
            <section className="pt-32 pb-24 px-6 border-b border-gray-100 bg-gray-900 text-white rounded-b-[64px]">
                <div className="max-w-7xl mx-auto space-y-6">
                    <motion.div 
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="inline-block px-4 py-1.5 bg-white/10 rounded-full text-xs font-black tracking-widest text-white/50 uppercase font-heading"
                    >
                        Business Perspective
                    </motion.div>
                    <h1 className="text-4xl md:text-6xl font-black text-white italic tracking-tighter leading-none font-heading">Be the Answer. <br/>Not a Link.</h1>
                    <p className="max-w-2xl text-xl text-white/40 font-bold lowercase tracking-tight leading-relaxed">LocalPlus ensures your business is the single choice AI models recommend when intent matches your service.</p>
                </div>
            </section>

            {/* Performance Stats Overlay */}
            <section className="-mt-12 px-6">
                 <div className="max-w-7xl mx-auto grid grid-cols-2 lg:grid-cols-4 gap-4">
                     {[
                         { label: "AI Discovery Rate", val: "+340%", color: "text-blue-500" },
                         { label: "Conversion Rate", val: "12.4%", color: "text-green-500" },
                         { label: "Cost Per Lead", val: "$0.12", color: "text-amber-500" },
                         { label: "Avg. ROI", val: "15x", color: "text-gray-900" }
                     ].map((stat, i) => (
                         <div key={i} className="p-8 bg-white rounded-3xl shadow-xl border border-gray-100 backdrop-blur-3xl transform hover:-translate-y-1 transition-transform">
                             <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">{stat.label}</p>
                             <p className={`text-4xl font-black italic tracking-tighter ${stat.color}`}>{stat.val}</p>
                         </div>
                     ))}
                 </div>
            </section>

            {/* Business Showcase */}
            <section className="py-24 px-6">
                <div className="max-w-7xl mx-auto space-y-16">
                     <div className="space-y-4 text-center">
                        <h2 className="text-3xl font-black text-gray-900 italic tracking-tighter font-heading uppercase">Your Placement Example</h2>
                        <p className="text-sm font-black text-gray-400 uppercase tracking-widest">How top-performing businesses appear with MCC indicators.</p>
                     </div>
                     <BusinessShowcase />
                </div>
            </section>
        </main>
    )
}
