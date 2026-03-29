"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import QuerySimulator from "@/components/explainer/QuerySimulator"

const HEADLINES = [
  { part1: "The End of the", part2: "Endless Scroll." },
  { part1: "The End of Search.", part2: "The End of the Scroll." },
  { part1: "Stop Searching.", part2: "Start Finding." },
  { part1: "Beyond Search.", part2: "Beyond the Scroll." }
]

export default function ConsumersPage() {
    const [index, setIndex] = useState(0)

    useEffect(() => {
        const timer = setInterval(() => {
            setIndex((prev) => (prev + 1) % HEADLINES.length)
        }, 5000)
        return () => clearInterval(timer)
    }, [])

    return (
        <main className="min-h-screen bg-white">
            <div className="pt-24 pb-12 px-6 text-center space-y-12">
                <div className="min-h-[160px] md:min-h-[200px] flex items-center justify-center">
                    <AnimatePresence mode="wait">
                        <motion.h1 
                           key={index}
                           initial={{ opacity: 0, scale: 0.95, filter: "blur(10px)" }}
                           animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
                           exit={{ opacity: 0, scale: 1.05, filter: "blur(10px)" }}
                           transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                           className="text-5xl md:text-8xl font-black text-gray-900 italic tracking-tighter leading-[0.85] font-heading max-w-5xl mx-auto"
                        >
                           {HEADLINES[index].part1} <br/> 
                           <span className="text-blue-600 not-italic">{HEADLINES[index].part2}</span>
                        </motion.h1>
                    </AnimatePresence>
                </div>
                
                <p className="max-w-3xl mx-auto text-lg text-gray-400 font-bold lowercase tracking-tight leading-relaxed">
                   Legacy search strands you in a maze of messy links and fragmented pages. Our <span className="text-gray-900">Answer Engine</span> preserves your focus. By grounding AI in live, verified merchant data, we deliver one definitive truth—skipping the mental fatigue of the <span className="italic">endless scroll</span> entirely.
                   <span className="text-blue-500 italic block mt-6 animate-pulse uppercase tracking-[0.2em] text-[10px]">Select a localized scenario below to see the focus in action</span>
                </p>
            </div>

            <section className="pb-24">
                <QuerySimulator />
            </section>

            {/* Zero Ads Section */}
            <section className="py-32 bg-gray-50/50 border-y border-gray-100 px-6 text-center">
                <div className="max-w-4xl mx-auto space-y-8">
                   <h2 className="text-4xl md:text-7xl font-black tracking-tight text-gray-900 italic">Zero Ads. <br/> Just Answers.</h2>
                   <p className="text-xl text-gray-500 font-bold max-w-2xl mx-auto leading-relaxed">
                      Search engines prioritize who paid the most. LocalPlus prioritizes what is actually true. Grounded intelligence, directly in the conversation.
                   </p>
                </div>
            </section>
        </main>
    )
}
