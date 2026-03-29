"use client"

import React, { useState, useEffect } from "react"
import { motion } from "framer-motion"
import SystemFlowDiagram from "@/components/explainer/SystemFlowDiagram"
import FeedbackLoopAnimation from "@/components/explainer/FeedbackLoopAnimation"

export default function TechRebuildPage() {
  const [displayText, setDisplayText] = useState("")
  const [isTyping, setIsTyping] = useState(true)
  const fullText = "Studio A is available for a booking [†] right now."

  useEffect(() => {
    let currentText = ""
    let i = 0
    const timer = setInterval(() => {
      if (i < fullText.length) {
        currentText += fullText[i]
        setDisplayText(currentText)
        i++
      } else {
        clearInterval(timer)
        setIsTyping(false)
        setTimeout(() => {
            setDisplayText("")
            setIsTyping(true)
        }, 5000) // Loop back after 5s
      }
    }, 40)
    return () => clearInterval(timer)
  }, [isTyping])

  const formatText = (text: string) => {
    return text.split(/(\[.*?\])/g).map((part, index) => {
      if (part === "[†]") {
        return (
          <span key={index} className="inline-flex items-center px-2 py-0.5 bg-green-500/20 border border-green-500/30 text-green-400 rounded-lg font-black text-sm mx-1 align-middle">
            {part}
          </span>
        )
      }
      return <span key={index}>{part}</span>
    })
  }

  return (
    <main className="bg-white min-h-screen selection:bg-gray-900 selection:text-white pb-32">
        {/* Section 1: The Core System (Interactive Walkthrough) */}
        <section className="pt-24 pb-32 px-6">
            <div className="max-w-7xl mx-auto text-center space-y-8 mb-20">
                <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="inline-block px-4 py-2 bg-blue-50 rounded-full"
                >
                    <p className="text-[10px] font-black text-blue-500 uppercase tracking-[0.3em]">The Technology Stack</p>
                </motion.div>
                <h1 className="text-5xl md:text-8xl font-black text-gray-900 italic tracking-tighter leading-[0.85] font-heading max-w-4xl mx-auto">
                   How the Answer <br/> Engine Works.
                </h1>
                <p className="max-w-xl mx-auto text-xl text-gray-400 font-bold lowercase tracking-tight">
                   A step-by-step visual system walkthrough from Intent Parsing to Direct Action.
                </p>
            </div>

            <SystemFlowDiagram />
        </section>

        {/* Section 2: Live vs Static (Side-by-Side Visual) */}
        <section className="px-6 py-32 bg-gray-50 rounded-[64px] mx-4 md:mx-12 border border-gray-100 overflow-hidden">
             <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-20">
                 
                 {/* Static Directory - The Problem (JITTER & DECAY) */}
                 <div className="space-y-12">
                     <div className="space-y-4">
                        <div className="flex items-center space-x-2">
                            <span className="text-xl animate-pulse">❌</span>
                            <h2 className="text-3xl font-black text-red-500 uppercase italic font-heading tracking-tighter leading-none">Static Directories</h2>
                        </div>
                        <p className="text-xl text-gray-400 font-bold lowercase leading-relaxed italic">The old way. Manual updates, broken links, and zero live availability.</p>
                     </div>
                     <div className="h-72 overflow-hidden rounded-[32px] bg-white border border-gray-100 relative group shadow-inner">
                          {/* Jittery Scrolling Feed */}
                          <motion.div 
                            animate={{ 
                                y: [0, -300, -290, -600, -580, 0],
                                rotate: [0, 0.5, -0.5, 0]
                            }}
                            transition={{ 
                                repeat: Infinity, 
                                duration: 12, 
                                times: [0, 0.2, 0.22, 0.5, 0.52, 1],
                                ease: "easeInOut" 
                            }}
                            className="p-8 space-y-4 opacity-20 grayscale filter blur-[0.5px]"
                          >
                               {[1,2,3,4,5,6,7,8,9,10].map(i => (
                                 <div key={i} className="p-4 bg-gray-50 rounded-xl space-y-3 border border-gray-100 flex items-center justify-between">
                                      <div className="flex-1 space-y-2">
                                          <div className="w-1/3 h-2.5 bg-gray-300 rounded" />
                                          <div className="w-full h-2 bg-gray-100 rounded" />
                                      </div>
                                      <div className="text-[10px] font-black text-red-300 line-through tracking-widest">OFFLINE</div>
                                 </div>
                               ))}
                          </motion.div>

                          {/* "Data Desync" Overlay */}
                          <motion.div 
                            animate={{ opacity: [0.3, 0.6, 0.3] }}
                            transition={{ repeat: Infinity, duration: 2 }}
                            className="absolute inset-x-0 bottom-8 text-center"
                          >
                               <p className="text-[9px] font-black text-white uppercase tracking-[0.3em] bg-red-500 inline-block px-4 py-1.5 rounded-full shadow-lg shadow-red-500/30">Desync Detected</p>
                          </motion.div>

                          <div className="absolute inset-0 bg-gradient-to-b from-white via-transparent to-white pointer-events-none" />
                          <div className="absolute inset-0 border-[8px] border-red-500/5 pointer-events-none rounded-[32px]" />
                     </div>
                 </div>

                 {/* LocalPlus - The Solution (PULSE & FLOW) */}
                 <div className="space-y-12">
                     <div className="space-y-4 text-right">
                        <div className="flex items-center justify-end space-x-2">
                            <h2 className="text-3xl font-black text-green-600 uppercase italic font-heading tracking-tighter leading-none whitespace-nowrap">LocalPlus Answer Engine</h2>
                            <span className="text-xl animate-bounce">✅</span>
                        </div>
                        <p className="text-xl text-gray-400 font-bold lowercase leading-relaxed italic">The new way. Real-time availability, direct citations, and sub-300ms grounding.</p>
                     </div>
                     <div className="p-8 bg-gray-900 border border-gray-800 rounded-[32px] shadow-2xl space-y-6 relative overflow-hidden group text-left h-72 flex flex-col justify-center">
                          
                          {/* Live Indicator Shimmer */}
                          <div className="absolute top-0 right-0 p-4 bg-blue-600 font-black text-[10px] text-white uppercase tracking-widest flex items-center gap-2">
                            <motion.div 
                               animate={{ scale: [1, 1.5, 1], opacity: [1, 0.5, 1] }} 
                               transition={{ repeat: Infinity, duration: 1 }}
                               className="w-1.5 h-1.5 rounded-full bg-white shadow-[0_0_10px_white]" 
                            />
                            Live: Now
                          </div>
                          
                          <div className="space-y-6 relative z-10">
                              <div className="flex items-center space-x-3">
                                  <div className="relative">
                                      <motion.div 
                                        animate={{ scale: [1, 2], opacity: [0.5, 0] }}
                                        transition={{ repeat: Infinity, duration: 1.5 }}
                                        className="absolute inset-0 rounded-full bg-green-500/50" 
                                      />
                                      <div className="w-2.5 h-2.5 rounded-full bg-green-500 shadow-[0_0_15px_#22c55e]" />
                                  </div>
                                  <p className="text-[11px] font-black text-blue-400 uppercase tracking-[0.3em] leading-none">Verified Grounding Cluster</p>
                              </div>
                              <p className="text-3xl font-bold italic tracking-tight text-white leading-tight max-w-[90%] min-h-[4rem]">
                                {formatText(displayText)}
                                {isTyping && (
                                    <motion.span 
                                        animate={{ opacity: [0, 1] }} 
                                        transition={{ repeat: Infinity, duration: 0.5 }}
                                        className="inline-block w-1.5 h-8 bg-blue-500 ml-1 translate-y-1"
                                    />
                                )}
                              </p>
                              <motion.div 
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                className="w-full py-4 bg-white text-gray-900 rounded-2xl text-[12px] font-black uppercase tracking-widest text-center shadow-[0_10px_30px_rgba(255,255,255,0.2)] cursor-pointer"
                              >
                                Book Now ↗
                              </motion.div>
                          </div>

                          {/* Tech Glows & Scanning Wave */}
                          <motion.div 
                             animate={{ x: [-200, 600] }}
                             transition={{ repeat: Infinity, duration: 3, ease: "linear" }}
                             className="absolute inset-y-0 w-20 bg-gradient-to-r from-transparent via-blue-500/20 to-transparent -skew-x-12 pointer-events-none"
                          />
                          
                          {/* Radial Background Glow */}
                          <div className="absolute top-1/2 left-1/2 -underline-1/2 -translate-x-1/2 -translate-y-1/2 w-[150%] h-[150%] bg-[radial-gradient(circle_at_center,rgba(59,130,246,0.1)_0%,transparent_70%)] pointer-events-none" />
                     </div>
                 </div>
             </div>
        </section>

        {/* Section 3: Anti-Hallucination & Feedback */}
        <section className="px-6 py-32 bg-gray-900 text-white rounded-[64px] mx-4 md:mx-12 mt-12 border border-white/5 overflow-hidden">
             <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
                 <div className="space-y-12">
                     <div className="space-y-6">
                        <h2 className="text-4xl md:text-7xl font-black text-white italic tracking-tighter uppercase font-heading leading-none">Zero <br/> Guessing.</h2>
                        <p className="text-xl text-white/40 font-bold lowercase leading-relaxed italic">Our system uses **Grounded Retrieval**. We strictly limit the AI to your verified business data, ensuring it never hallucinates facts, hours, or availability.</p>
                     </div>
                     
                     <div className="space-y-8">
                         {[
                            { label: "Verified Business Data", status: "✔ Required" },
                            { label: "Real-time Inputs (MCP)", status: "✔ Active" },
                            { label: "Structured Field Logic", status: "✔ Enforced" }
                         ].map((s, i) => (
                           <div key={i} className="flex justify-between items-center p-4 bg-white/5 border border-white/10 rounded-2xl group transition-all hover:bg-white/10">
                              <p className="text-[12px] font-black uppercase tracking-widest text-white/60">{s.label}</p>
                              <p className="text-[10px] font-black uppercase tracking-widest text-green-400">{s.status}</p>
                           </div>
                         ))}
                     </div>
                 </div>

                 <FeedbackLoopAnimation />
             </div>
        </section>

        {/* Section 4: Why We are Different */}
        <section className="max-w-4xl mx-auto px-6 py-32 text-center space-y-12">
             <h3 className="text-4xl font-black text-gray-900 uppercase italic font-heading tracking-tighter leading-none">The Future vs The Past.</h3>
             <div className="grid grid-cols-2 gap-4">
                  <div className="p-8 bg-gray-50 border border-gray-100 rounded-3xl space-y-4">
                     <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none">Legacy Search (Google/Yelp)</p>
                     <p className="text-2xl font-black text-gray-900 italic tracking-tighter uppercase">Links ❌</p>
                  </div>
                  <div className="p-8 bg-gray-900 border border-gray-800 rounded-3xl space-y-4">
                     <p className="text-[10px] font-black text-blue-400 uppercase tracking-widest leading-none">LocalPlus Engine</p>
                     <p className="text-2xl font-black text-white italic tracking-tighter uppercase">Answers ✅</p>
                  </div>
             </div>
             <p className="text-xl text-gray-400 font-bold lowercase tracking-tight max-w-2xl mx-auto">
                While legacy search shows thousands of links, we generate definitive answers from live business grounded data.
             </p>
        </section>
    </main>
  )
}
