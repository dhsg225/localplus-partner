"use client"

import { motion } from "framer-motion"
import { MCCIndicators } from "@/components/ui/MCCIndicators"

export default function TechPage() {
    return (
        <main className="bg-white min-h-screen selection:bg-gray-900 selection:text-white pb-32">
            {/* Tech Context Header */}
            <section className="pt-32 pb-24 px-6 border-b border-gray-100 bg-blue-50/30">
                <div className="max-w-7xl mx-auto space-y-6">
                    <motion.div 
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="inline-block px-4 py-1.5 bg-blue-100 rounded-full text-xs font-black tracking-widest text-blue-500 uppercase font-heading"
                    >
                        Technical Architecture
                    </motion.div>
                    <h1 className="text-4xl md:text-6xl font-black text-gray-900 italic tracking-tighter leading-none font-heading">The Answer Engine.</h1>
                    <p className="max-w-2xl text-xl text-gray-400 font-bold lowercase tracking-tight leading-relaxed">The LocalPlus "Answer Engine" operates on three primary metrics of trust that AI models respect: Mentions, Citations, and Clicks.</p>
                </div>
            </section>

            {/* Tech Deep Dive */}
            <section className="py-24 px-6">
                <div className="max-w-4xl mx-auto space-y-24">
                     <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                         {[
                             { type: "mention", title: "Semantic Mapping", desc: "Modeling business intent into the LLM latent space via knowledge graph indexing." },
                             { type: "citation", title: "Fact Grounding", desc: "Converting unstructured business data into verifiable, citable facts for RAG systems." },
                             { type: "click", title: "Token Optimization", desc: "Reducing the path-to-action for the end user inside the AI conversation loop." }
                         ].map((item, i) => (
                             <div key={i} className="flex flex-col items-center text-center space-y-6 p-10 bg-white rounded-[40px] border border-gray-100 shadow-sm transition-all group">
                                 <div className="scale-150 transform group-hover:scale-[1.7] transition-transform duration-500">
                                     <MCCIndicators type={item.type as any} showLabel={false} />
                                 </div>
                                 <h3 className="text-xl font-black text-gray-900 italic tracking-tighter uppercase font-heading leading-tight">{item.title}</h3>
                                 <p className="text-sm text-gray-400 font-medium leading-relaxed">{item.desc}</p>
                             </div>
                         ))}
                     </div>
                </div>
            </section>
        </main>
    )
}
