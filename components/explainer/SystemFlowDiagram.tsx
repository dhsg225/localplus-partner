"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"

const NODES = [
  { 
    id: "query", 
    label: "User Query", 
    icon: "💬", 
    description: "Natural language input (text/voice) originating from the LocalPlus mobile app or web interface.",
    details: ["Native GPS Grounding", "User Intent Capture", "Session Context"],
    deepTech: "BGP Anycast routing ensures the query hits the nearest Edge node within 10ms."
  },
  { 
    id: "intent", 
    label: "Intent Parsing", 
    icon: "🧠", 
    description: "Our proprietary LLM logic breaks down the raw query into structured parameters for the Live-Graph engine.",
    details: ["Temporal Constraint Mapping", "Geometric Boundary Extraction", "Entity Resolution"],
    deepTech: "Function calling triggers specific MCP tools based on zero-shot classification."
  },
  { 
    id: "retrieval", 
    label: "Data Retrieval", 
    icon: "⚡", 
    description: "Parallel fetch between static merchant records and real-time availability via the MCP Bridge.",
    details: ["Distributed libSQL fetch", "MCP Auth Handshake", "Availability Grounding"],
    deepTech: "Vector similarity search (Top-K) combined with multi-hop graph traversals."
  },
  { 
    id: "ranking", 
    label: "Ranking Engine", 
    icon: "🏆", 
    description: "Multi-objective scoring model calculates the final answer share using Cross-Encoders.",
    details: ["Relevance Scoring", "Merchant Metadata Weight", "Sponsorship Logic"],
    deepTech: "Softmax normalization applied to raw logits across availability and distance metrics."
  },
  { 
    id: "answer", 
    label: "AI Answer", 
    icon: "✍️", 
    description: "Generative response augmented with symbolic disclosure (mention, citation, action).",
    details: ["Symbolic Token Injection", "Reference Formatting", "Deterministic Output"],
    deepTech: "Post-hoc validation ensures the output contains mandatory disclosure symbols (·, †)."
  },
  { 
    id: "action", 
    label: "User Action", 
    icon: "↗", 
    description: "Direct conversion tracking where the user takes action without leaving the interface context.",
    details: ["API-to-Merchant Bridge", "Booking Confirmation", "Interaction Logging"],
    deepTech: "Webhook triggers update the Live-Graph state instantly to reflect new availability."
  }
]

export default function SystemFlowDiagram() {
  const [activeIndex, setActiveIndex] = useState(0)
  const [showDeepTech, setShowDeepTech] = useState(false)

  return (
    <div className="w-full max-w-6xl mx-auto p-4 md:p-8 space-y-12">
      {/* Visual Flow Header */}
      <div className="relative flex flex-col md:flex-row items-center justify-between gap-4 md:gap-0 h-auto md:h-12 w-full max-w-5xl mx-auto px-4">
         <div className="absolute top-1/2 left-0 right-0 h-[2px] bg-gray-100 -translate-y-1/2 hidden md:block" />
         {NODES.map((node, i) => (
           <motion.button
             key={node.id}
             onClick={() => {
                setActiveIndex(i)
                setShowDeepTech(false)
             }}
             className={`relative z-10 w-12 h-12 rounded-full border-2 flex items-center justify-center text-xl transition-all ${
               i <= activeIndex ? 'bg-gray-900 border-gray-900 text-white shadow-xl scale-110' : 'bg-white border-gray-100 text-gray-300 hover:border-gray-900 hover:text-gray-900'
             }`}
             whileHover={{ scale: 1.25 }}
             whileTap={{ scale: 0.9 }}
           >
              {node.icon}
              {i < NODES.length - 1 && (
                  <div className={`absolute left-full w-full h-[2px] -translate-y-1/2 top-1/2 hidden md:block ${i < activeIndex ? 'bg-gray-900' : 'bg-gray-100'}`} />
              )}
           </motion.button>
         ))}
      </div>

      {/* Node Info - Deep Dive */}
      <AnimatePresence mode="wait">
        <motion.div 
           key={activeIndex}
           initial={{ opacity: 0, y: 20 }}
           animate={{ opacity: 1, y: 0 }}
           exit={{ opacity: 0, y: -20 }}
           className="grid grid-cols-1 lg:grid-cols-2 gap-12 bg-white rounded-[48px] p-8 md:p-16 border border-gray-100 shadow-2xl relative overflow-hidden min-h-[600px]"
        >
            <div className="absolute top-0 right-0 p-8 opacity-5">
                <span className="text-[12rem] font-black text-gray-900 leading-none">0{activeIndex + 1}</span>
            </div>
            
            <div className="flex flex-col justify-center space-y-8 relative z-10">
               <div className="space-y-4">
                  <span className="px-4 py-2 bg-gray-900 text-white rounded-full text-[10px] font-black uppercase tracking-widest">
                    Step 0{activeIndex + 1}: {NODES[activeIndex].label}
                  </span>
                  <h3 className="text-4xl md:text-6xl font-black text-gray-900 italic tracking-tighter uppercase font-heading leading-none">
                    {NODES[activeIndex].label}
                  </h3>
               </div>
               <p className="text-xl text-gray-400 font-bold max-w-md leading-relaxed">
                  {NODES[activeIndex].description}
               </p>
               
               <div className="space-y-6 pt-8 border-t border-gray-50">
                   <div className="flex items-center justify-between">
                       <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Technical Specifications</p>
                       <button 
                         onClick={() => setShowDeepTech(!showDeepTech)}
                         className={`text-[8px] font-black uppercase tracking-[0.2em] px-3 py-1 rounded-full border transition-all ${
                            showDeepTech ? 'bg-blue-600 border-blue-600 text-white' : 'bg-white border-gray-200 text-gray-400'
                         }`}
                       >
                         {showDeepTech ? 'Simple View' : 'Deep Tech [RAW]'}
                       </button>
                   </div>

                   <AnimatePresence mode="wait">
                       {showDeepTech ? (
                           <motion.div 
                             key="deep"
                             initial={{ opacity: 0 }}
                             animate={{ opacity: 1 }}
                             className="p-6 bg-blue-50/50 rounded-2xl border border-blue-100 font-mono text-xs text-blue-600 leading-relaxed font-bold"
                           >
                              {NODES[activeIndex].deepTech}
                           </motion.div>
                       ) : (
                           <motion.div key="details" className="grid grid-cols-1 md:grid-cols-2 gap-3">
                               {NODES[activeIndex].details.map((detail, d) => (
                                    <div key={d} className="flex items-center space-x-2">
                                        <div className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                                        <p className="text-[12px] text-gray-600 font-black">{detail}</p>
                                    </div>
                                ))}
                           </motion.div>
                       )}
                   </AnimatePresence>
               </div>

               <div className="flex items-center space-x-6 pt-8">
                   <button onClick={() => setActiveIndex(Math.max(0, activeIndex - 1))} className="px-6 py-3 border border-gray-200 rounded-2xl text-[10px] font-black text-gray-400 hover:text-gray-900 transition-colors uppercase tracking-[0.2em]">Previous</button>
                   <button onClick={() => setActiveIndex(Math.min(NODES.length - 1, activeIndex + 1))} className="px-8 py-3 bg-gray-900 text-white rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] shadow-lg hover:shadow-xl transition-all">Next Component ↗</button>
               </div>
            </div>

            <div className="bg-gray-50 rounded-[40px] p-8 md:p-12 flex flex-col justify-center space-y-6 relative z-10 border border-gray-100 shadow-inner">
                <div className="flex items-center space-x-3 text-blue-500">
                    <span className="text-xl">⚙️</span>
                    <p className="text-[10px] font-black uppercase tracking-widest">Internal Logic Execution</p>
                </div>
                
                <div className="space-y-4">
                     {/* Simulated Code/Logs */}
                     <div className="p-6 bg-gray-900 rounded-3xl space-y-3 font-mono text-[10px] text-white/40 overflow-hidden">
                        <p className="text-green-400"># Initializing step_{activeIndex + 1}...</p>
                        <p>PROMPT_TOKEN_COUNT: 1242</p>
                        <p>MCP_BRIDGE_STATUS: <span className="text-green-400">READY</span></p>
                        <p>LATENCY: <span className="text-blue-400">12ms</span></p>
                        <motion.div 
                          animate={{ opacity: [0.2, 0.4, 0.2] }}
                          transition={{ repeat: Infinity, duration: 1 }}
                          className="h-1 w-full bg-white/10 rounded"
                        />
                     </div>
                </div>

               <div className="mt-8 pt-8 border-t border-gray-200 flex items-center justify-between">
                   <p className="text-[8px] font-bold text-gray-300 uppercase tracking-[0.2em]">Reference Layer: 0.2.1-stable</p>
                   <div className="flex -space-x-2">
                       {[1,2,3,4].map(i => <div key={i} className="w-6 h-6 rounded-full bg-gray-200 border-2 border-white" />)}
                   </div>
               </div>
            </div>
        </motion.div>
      </AnimatePresence>
    </div>
  )
}
