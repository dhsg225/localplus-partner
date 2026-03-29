'use client'

import { motion } from "framer-motion"

export const PhilosophySection = () => {
    const points = [
        {
            icon: "🚀", 
            title: "Push, Don't Pull", 
            desc: "We bring information to you. Get critical updates via WhatsApp or email so you aren't constantly checking another dashboard.",
            color: "bg-blue-100/50"
        },
        {
            icon: "🏥", 
            title: "Operational Reality", 
            desc: "Built for busy hands. Fast, reliable, and works on the mobile device you already have in your pocket.",
            color: "bg-green-100/50"
        },
        {
            icon: "🧠", 
            title: "Your Workflow, Respected", 
            desc: "We fit into your existing habits. No retraining your entire staff just to accept a single booking.",
            color: "bg-amber-100/50"
        }
    ]

    return (
        <section id="philosophy" className="py-40 bg-white px-6 border-b border-gray-50">
            <div className="max-w-7xl mx-auto space-y-24">
                <div className="text-center space-y-6">
                    <h2 className="text-5xl md:text-7xl font-black text-gray-900 leading-tight tracking-tighter italic font-heading">How We Work.</h2>
                    <p className="text-xl text-gray-400 font-bold max-w-2xl mx-auto lowercase tracking-tight leading-relaxed">Designed for the chaos of real-time operations. We don't just build dashboards. We build your local operating system.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                    {points.map((p, i) => (
                        <div key={i} className="flex flex-col items-center text-center space-y-8 p-12 bg-gray-50/50 rounded-[56px] border border-gray-100 hover:border-blue-500/20 transition-all duration-300">
                             <div className={`w-20 h-20 rounded-[32px] ${p.color} flex items-center justify-center text-4xl shadow-sm rotate-3 group-hover:rotate-0 transition-transform`}>
                                 {p.icon}
                             </div>
                             <h3 className="text-2xl font-black tracking-tighter uppercase font-heading text-gray-900">{p.title}</h3>
                             <p className="text-lg text-gray-400 font-medium leading-relaxed">{p.desc}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    )
}
