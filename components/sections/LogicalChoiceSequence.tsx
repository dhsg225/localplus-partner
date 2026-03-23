"use client"

import { useRef } from "react"
import { motion, useScroll, useTransform } from "framer-motion"
import { MCCIndicators } from "../ui/MCCIndicators"

const StageCard = ({ children, title, description, isActive }: any) => (
  <motion.div 
    className={`p-12 bg-white/10 backdrop-blur-2xl rounded-[48px] border border-white/20 shadow-max relative overflow-hidden flex flex-col items-center justify-center transition-opacity duration-700 ${isActive ? 'opacity-100' : 'opacity-0'}`}
  >
    <div className="absolute top-8 left-12">
        <span className="text-xs font-black tracking-widest text-white/40 uppercase font-heading">{title}</span>
    </div>
    <div className="w-full">
        {children}
    </div>
    <div className="absolute bottom-12 left-12 right-12 text-center">
        <p className="text-lg font-bold text-white/60 lowercase tracking-tight">{description}</p>
    </div>
  </motion.div>
)

export const LogicalChoiceSequence = () => {
    const containerRef = useRef(null)
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start start", "end end"]
    })

    const stage1Opacity = useTransform(scrollYProgress, [0, 0.3], [1, 0])
    const stage2Opacity = useTransform(scrollYProgress, [0.3, 0.65], [0, 1])
    const stage2Exit = useTransform(scrollYProgress, [0.65, 0.8], [1, 0])
    const stage3Opacity = useTransform(scrollYProgress, [0.8, 1], [0, 1])

    const stage2Y = useTransform(scrollYProgress, [0.65, 0.8], [0, -100])

    return (
        <section ref={containerRef} className="h-[400vh] relative bg-black font-sans">
            <div className="sticky top-0 h-screen w-full flex items-center justify-center overflow-hidden">
                
                {/* Stage 1: The Chaos */}
                <motion.div 
                  style={{ opacity: stage1Opacity }}
                  className="absolute inset-0 flex flex-col items-center justify-center p-12"
                >
                    <div className="max-w-4xl text-center space-y-12">
                        <div className="space-y-4">
                            <h2 className="text-6xl md:text-8xl font-black text-white italic tracking-tighter font-heading leading-none">The Chaos</h2>
                            <p className="text-xl text-white/40 font-bold uppercase tracking-widest">Traditional Search is a cluttered mess.</p>
                        </div>
                        
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-8 bg-white/5 rounded-[40px] opacity-40 blur-[2px] transition-all">
                            {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                                <div key={i} className="p-6 bg-red-900/10 border border-red-900/20 rounded-2xl flex flex-col space-y-2">
                                    <div className="w-12 h-1.5 bg-red-400/30 rounded" />
                                    <div className="w-full h-1 bg-white/5 rounded" />
                                    <div className="w-3/4 h-1 bg-white/5 rounded" />
                                </div>
                            ))}
                        </div>
                    </div>
                </motion.div>

                {/* Stage 2: The Filtering */}
                <motion.div 
                  style={{ opacity: stage2Opacity, y: stage2Y }}
                  className="absolute inset-0 flex flex-col items-center justify-center p-12"
                >
                    <div className="max-w-4xl text-center space-y-12">
                        <div className="space-y-4">
                            <h2 className="text-6xl md:text-8xl font-black text-white italic tracking-tighter font-heading leading-none">The Filtering</h2>
                            <p className="text-xl text-blue-400 font-bold uppercase tracking-widest">AI Discovery logic trims the noise.</p>
                        </div>

                        <div className="relative w-full h-48 flex items-center justify-center">
                            <motion.div 
                              animate={{ scale: [1, 1.2, 1], rotate: 360 }}
                              transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                              className="w-48 h-48 border-[20px] border-blue-500/20 border-t-blue-500 rounded-full"
                            />
                            <div className="absolute inset-0 flex items-center justify-center">
                                <span className="text-4xl font-black text-white italic animate-pulse tracking-tighter">DISTILLING</span>
                            </div>
                        </div>
                        <p className="max-w-md mx-auto text-white/40 font-medium">Removing ads, duplicate content, and inaccurate data to reach the only logical choice.</p>
                    </div>
                </motion.div>

                {/* Stage 3: The Choice */}
                <motion.div 
                  style={{ opacity: stage3Opacity }}
                  className="absolute inset-0 flex flex-col items-center justify-center p-12 bg-gradient-to-tr from-black via-gray-900 to-black"
                >
                    <div className="max-w-4xl text-center space-y-12">
                        <div className="space-y-4">
                            <h2 className="text-6xl md:text-8xl font-black text-white italic tracking-tighter font-heading leading-none">The Choice</h2>
                            <p className="text-xl text-green-400 font-bold uppercase tracking-widest">Being the only logical answer.</p>
                        </div>

                        <motion.div 
                          className="p-12 bg-white rounded-[56px] shadow-[0_48px_128px_-16px_rgba(0,0,0,0.8)] border border-white/20 relative overflow-hidden group"
                        >
                            <div className="absolute top-0 right-0 w-64 h-64 bg-green-400/20 blur-[100px] pointer-events-none group-hover:scale-150 transition-transform duration-1000" />
                            <div className="relative z-10 space-y-8">
                                <div className="flex justify-between items-start">
                                    <h3 className="text-4xl font-black text-gray-900 italic tracking-tighter font-heading leading-none">LocalPlus Partner</h3>
                                    <div className="flex space-x-2">
                                        <MCCIndicators type="citation" />
                                        <MCCIndicators type="sponsored" />
                                    </div>
                                </div>
                                <p className="text-2xl text-gray-500 font-bold leading-tight lowercase">Direct, verifiable data that moves the user from discovery to conversion in seconds.</p>
                                <div className="flex items-center space-x-6 pt-6 border-t border-gray-100">
                                    <MCCIndicators type="mention" label="Mentions" />
                                    <MCCIndicators type="click" label="Book Visit ↗" />
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </motion.div>

            </div>
        </section>
    )
}
