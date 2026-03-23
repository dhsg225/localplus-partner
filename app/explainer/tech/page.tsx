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

            {/* The Standard: MCP */}
            <section className="py-24 px-6 bg-gray-50">
                <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
                    <div className="space-y-8">
                         <div className="space-y-4">
                            <h2 className="text-4xl font-black text-gray-900 italic tracking-tighter uppercase font-heading">MCP (Model Context Protocol)</h2>
                            <p className="text-xl text-gray-400 font-bold lowercase">Standardizing how AI reads business data.</p>
                         </div>
                         <p className="text-lg text-gray-600 font-medium leading-relaxed">LocalPlus isn't just a database; it is a **Distributed MCP Server**. By using MCP, we allow LLMs like Claude, Gemini, and GPT to "Plug in" and read your real-time availability, inventory, and facts directly, without the risks of hallucination. We act as the authoritative bridge between your binary data and the AI's semantic logic.</p>
                         <div className="flex flex-wrap gap-4">
                              <span className="px-4 py-2 bg-white rounded-xl border border-gray-200 text-xs font-black text-gray-900 uppercase">Universal Interop</span>
                              <span className="px-4 py-2 bg-white rounded-xl border border-gray-200 text-xs font-black text-blue-500 uppercase">Context Injection</span>
                              <span className="px-4 py-2 bg-white rounded-xl border border-gray-200 text-xs font-black text-green-500 uppercase">Tool Calling support</span>
                         </div>
                    </div>
                    <div className="p-12 bg-gray-900 rounded-[56px] shadow-3xl text-white space-y-6">
                        <div className="flex items-center space-x-3 mb-8">
                            <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center font-black">M</div>
                            <p className="text-xs font-black tracking-widest text-blue-400 uppercase">MCP Server Status: Active</p>
                        </div>
                        <div className="space-y-4 opacity-80">
                            <div className="p-4 bg-white/5 border border-white/10 rounded-2xl flex justify-between">
                                <span className="text-xs font-heading uppercase text-white/50">Read Inventory</span>
                                <span className="text-xs font-black text-green-400">GRANTED</span>
                            </div>
                            <div className="p-4 bg-white/5 border border-white/10 rounded-2xl flex justify-between">
                                <span className="text-xs font-heading uppercase text-white/50">Context Window Injection</span>
                                <span className="text-xs font-black text-green-400">OPTIMIZED</span>
                            </div>
                            <div className="p-4 bg-white/5 border border-white/10 rounded-2xl flex justify-between">
                                <span className="text-xs font-heading uppercase text-white/50">Semantic RAG Overlap</span>
                                <span className="text-xs font-black text-blue-400">99.4% Match</span>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* The Infrastructure: Bunny Edge & Containers */}
            <section className="py-24 px-6">
                <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-20">
                    <div className="p-16 bg-blue-50/50 rounded-[48px] space-y-8 border border-blue-100">
                         <h3 className="text-3xl font-black text-gray-900 italic tracking-tighter uppercase font-heading leading-none">The Global Edge (On Bunny)</h3>
                         <p className="text-lg text-gray-500 font-bold leading-relaxed">AI moves at the speed of thought. To avoid being dropped from the context window, your data must be available in **sub-10ms**. We deploy your business profile to 110+ nodes on the **Bunny.net Edge Network**, ensuring that no matter where the AI is processing, your 'Fact Grounding' is instantaneous.</p>
                         <div className="pt-8 border-t border-blue-200 grid grid-cols-2 gap-8">
                             <div>
                                 <p className="text-xs font-black text-blue-500 uppercase mb-1">Global Latency</p>
                                 <p className="text-2xl font-black text-gray-900">8.2 ms avg.</p>
                             </div>
                             <div>
                                 <p className="text-xs font-black text-blue-500 uppercase mb-1">Uptime</p>
                                 <p className="text-2xl font-black text-gray-900">99.99%</p>
                             </div>
                         </div>
                    </div>
                    <div className="p-16 bg-gray-50 rounded-[48px] space-y-8 border border-gray-100">
                         <h3 className="text-3xl font-black text-gray-900 italic tracking-tighter uppercase font-heading leading-none">Isolated MCP Containers</h3>
                         <p className="text-lg text-gray-500 font-bold leading-relaxed">Trust is a primary metric. Each Partner's data is housed in an **Isolated MCP Container**. This ensures that your business proprietary data never bleeds into a competitor's training set, while remaining fully accessible to authorized AI queries via the Protocol.</p>
                         <div className="pt-8 border-t border-gray-200">
                             <div className="flex items-center space-x-3">
                                 <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse" />
                                 <p className="text-xs font-black text-gray-400 uppercase tracking-widest">Distributed Docker Mesh Active</p>
                             </div>
                         </div>
                    </div>
                </div>
            </section>
        </main>
    )
}
