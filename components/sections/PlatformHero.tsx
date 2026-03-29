'use client'

import { motion } from "framer-motion"

export const PlatformHero = () => {
    return (
        <section className="relative pt-40 pb-32 px-6 overflow-hidden bg-slate-900 text-white">
            <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-blue-500/10 rounded-full blur-[150px] -mr-96 -mt-96" />
            <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-indigo-500/10 rounded-full blur-[120px] -ml-48 -mb-48" />
            
            <div className="max-w-7xl mx-auto relative z-10">
                <div className="max-w-4xl space-y-10">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="inline-flex items-center space-x-3 px-4 py-2 bg-white/10 rounded-full border border-white/10 backdrop-blur-xl"
                    >
                        <span className="w-2 h-2 rounded-full bg-blue-400 animate-pulse" />
                        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-blue-100">The Operating System for Local Business</span>
                    </motion.div>

                    <motion.h1 
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="text-6xl md:text-8xl font-black tracking-tighter leading-[0.9] font-heading"
                    >
                        Streamline your day-to-day. <br/>
                        <span className="bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent italic font-heading">Not your dashboard.</span>
                    </motion.h1>

                    <motion.p 
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="max-w-2xl text-xl md:text-2xl text-slate-400 font-bold lowercase tracking-tight leading-relaxed"
                    >
                        Purpose-built tools for busy operators. Whether you run a restaurant, manage tours, or host events, LocalPlus helps you cut through the noise and focus on what matters.
                    </motion.p>

                    <motion.div 
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.3 }}
                        className="flex flex-wrap gap-4 pt-6"
                    >
                        <a href="#industries" className="px-10 py-5 bg-blue-500 text-white font-black rounded-2xl hover:bg-blue-600 transition-all shadow-2xl hover:shadow-blue-500/30 uppercase tracking-widest text-sm">
                            Explore Your Industry
                        </a>
                        <a href="/login" className="px-10 py-5 bg-white/5 border border-white/10 text-white font-black rounded-2xl hover:bg-white/10 transition-all uppercase tracking-widest text-sm">
                            Partner Log In
                        </a>
                    </motion.div>
                </div>
            </div>

            {/* Visual element: Multi-module hint */}
            <div className="absolute right-0 bottom-0 w-1/3 h-2/3 hidden xl:block opacity-40">
                <div className="relative w-full h-full">
                    <div className="absolute top-0 right-20 w-64 h-80 bg-slate-800 rounded-[40px] border border-white/5 shadow-2xl rotate-6 translate-y-20 transform group-hover:rotate-3 transition-transform duration-700" />
                    <div className="absolute top-40 right-40 w-64 h-80 bg-slate-800 rounded-[40px] border border-white/5 shadow-2xl -rotate-12 transform group-hover:-rotate-6 transition-transform duration-700" />
                </div>
            </div>
        </section>
    )
}
