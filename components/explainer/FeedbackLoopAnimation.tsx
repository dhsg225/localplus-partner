"use client"

import { motion } from "framer-motion"

export default function FeedbackLoopAnimation() {
  return (
    <div className="w-full max-w-2xl mx-auto p-12 bg-gray-900 rounded-[56px] shadow-3xl text-white relative overflow-hidden group border border-white/5">
       <div className="absolute inset-0 bg-blue-500/10 blur-[120px] opacity-20 group-hover:opacity-40 transition-opacity" />
       
       <div className="flex flex-col items-center space-y-12 relative z-10 text-center">
            <div className="space-y-4">
               <p className="text-[10px] font-black text-blue-400 uppercase tracking-[0.3em]">The LocalPlus Feedback Loop</p>
               <h3 className="text-4xl font-black italic uppercase tracking-tighter leading-none font-heading">Self-Correcting Visibility</h3>
            </div>

            <div className="w-full flex items-center justify-between gap-4">
                 <motion.div 
                   animate={{ y: [0, -10, 0] }}
                   transition={{ repeat: Infinity, duration: 4 }}
                   className="p-6 bg-white/5 border border-white/10 rounded-3xl flex-1 space-y-2"
                 >
                    <span className="text-2xl">↗</span>
                    <p className="text-[10px] font-black text-white/50 uppercase leading-none">User Clicked</p>
                    <p className="text-sm font-bold text-white">Conversion Trigger</p>
                 </motion.div>

                 <motion.div 
                   animate={{ scale: [1, 1.1, 1] }}
                   transition={{ repeat: Infinity, duration: 2 }}
                   className="w-12 h-12 rounded-full bg-blue-500 flex items-center justify-center font-black shadow-[0_0_20px_rgba(59,130,246,0.5)]"
                 >
                    →
                 </motion.div>

                 <motion.div 
                   animate={{ y: [0, 10, 0] }}
                   transition={{ repeat: Infinity, duration: 4, delay: 1 }}
                   className="p-6 bg-white/5 border border-white/10 rounded-3xl flex-1 space-y-2"
                 >
                    <span className="text-2xl">📉</span>
                    <p className="text-[10px] font-black text-white/50 uppercase leading-none">System Logs</p>
                    <p className="text-sm font-bold text-white">Weight Update</p>
                 </motion.div>
            </div>

            <div className="w-full h-[2px] bg-white/10 relative overflow-hidden">
                <motion.div 
                   animate={{ x: [-100, 500] }}
                   transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
                   className="absolute top-0 left-0 w-24 h-full bg-blue-400 blur-sm"
                />
            </div>

            <div className="p-8 bg-blue-500/10 border border-blue-500/20 rounded-3xl w-full text-left space-y-4">
                 <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                    <p className="text-[10px] font-black text-blue-400 uppercase tracking-widest leading-none">Ranking Adjusting</p>
                 </div>
                 <p className="text-xl font-bold italic text-white/90">"Business A just converted. Boosting ranking for similar Intent/GPS profiles."</p>
            </div>

            <p className="text-[12px] font-black text-white/30 uppercase tracking-[0.2em] leading-none">Every interaction fuels the answer engine.</p>
       </div>
    </div>
  )
}
