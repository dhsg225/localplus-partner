"use client"

import { motion } from "framer-motion"
import { MCCIndicators } from "../ui/MCCIndicators"

const businesses = [
    {
        name: "The Brunch Club",
        category: "Hospitality / F&B",
        tagline: "Farm-to-table eggs benedict & specialty coffee.",
        stats: { mentions: true, citations: true, clicks: true },
        color: "bg-blue-50/50"
    },
    {
        name: "Modern Care Center",
        category: "Healthcare",
        tagline: "Primary care with 100% insurance transparency.",
        stats: { mentions: true, citations: true, clicks: true },
        color: "bg-green-50/50"
    },
    {
        name: "Eco-Friendly Vet",
        category: "Pet Services",
        tagline: "Specializing in emergency care and checkups.",
        stats: { mentions: true, citations: true, clicks: true },
        color: "bg-amber-50/50"
    },
    {
        name: "Pure Pilates Lab",
        category: "Wellness",
        tagline: "Core-focused reformer pilates in a boutique setting.",
        stats: { mentions: true, citations: true, clicks: true },
        color: "bg-purple-50/50"
    }
]

export const BusinessShowcase = () => {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 py-12">
            {businesses.map((biz, idx) => (
                <motion.div 
                   key={idx}
                   initial={{ opacity: 0, y: 20 }}
                   whileInView={{ opacity: 1, y: 0 }}
                   transition={{ delay: idx * 0.1 }}
                   className={`p-10 rounded-[40px] border border-gray-100 ${biz.color} shadow-sm hover:shadow-xl transition-all group`}
                >
                    <div className="space-y-6">
                        <div className="flex justify-between items-start">
                             <div className="space-y-1">
                                <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{biz.category}</span>
                                <h3 className="text-3xl font-black text-gray-900 italic tracking-tighter font-heading leading-none">{biz.name}</h3>
                             </div>
                             <div className="flex items-center space-x-2">
                                 {biz.stats.mentions && <MCCIndicators type="mention" showLabel={false} />}
                                 {biz.stats.citations && <MCCIndicators type="citation" showLabel={false} />}
                                 {biz.stats.clicks && <MCCIndicators type="click" showLabel={false} />}
                             </div>
                        </div>
                        <p className="text-xl text-gray-500 font-bold leading-tight lowercase">{biz.tagline}</p>
                        
                        <div className="flex items-center space-x-6 pt-6 border-t border-black/5">
                            <MCCIndicators type="mention" label="Mentions" />
                            <MCCIndicators type="click" label="Action Taken" />
                        </div>
                    </div>
                </motion.div>
            ))}
        </div>
    )
}
