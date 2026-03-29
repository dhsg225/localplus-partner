"use client"

import { motion } from "framer-motion"
import { MCCIndicators } from "../ui/MCCIndicators"

const businesses = [
    {
        name: "Aria Grill",
        category: "Hospitality / F&B",
        tagline: "Prime steaks and sunset views from the terrace.",
        stats: { mentions: true, citations: true, clicks: true },
        color: "bg-blue-50/50"
    },
    {
        name: "Silom Care Hub",
        category: "Healthcare",
        tagline: "Pediatric care with instant insurance verification.",
        stats: { mentions: true, citations: true, clicks: true },
        color: "bg-green-50/50"
    },
    {
        name: "The Nexus",
        category: "Co-working",
        tagline: "Fiber-speed workspace with private sound pods.",
        stats: { mentions: true, citations: true, clicks: true },
        color: "bg-purple-50/50"
    }
]

export const BusinessShowcase = () => {
    return (
        <div className="space-y-8">
            {businesses.map((biz, idx) => (
                <motion.div 
                   key={idx}
                   initial={{ opacity: 0, x: 20 }}
                   whileInView={{ opacity: 1, x: 0 }}
                   transition={{ delay: idx * 0.1 }}
                   className={`p-8 rounded-[40px] border border-gray-100 ${biz.color} shadow-sm hover:shadow-xl transition-all group relative overflow-hidden`}
                >
                    <div className="space-y-6 relative z-10">
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
                        <p className="text-xl text-gray-500 font-bold leading-tight lowercase max-w-[80%]">{biz.tagline}</p>
                        
                        <div className="flex items-center justify-between pt-6 border-t border-black/5">
                            <div className="flex items-center space-x-6">
                                <MCCIndicators type="mention" label="Audit Trail" />
                                <MCCIndicators type="click" label="Live Booking" />
                            </div>
                            <span className="text-[10px] font-black text-green-500 uppercase tracking-widest">Verified Grounding</span>
                        </div>
                    </div>
                </motion.div>
            ))}
        </div>
    )
}
