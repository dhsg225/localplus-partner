"use client"

import { motion } from "framer-motion"
import { MCCIndicators } from "../ui/MCCIndicators"

export const HeroSection = () => {
  return (
    <section className="relative h-[110vh] min-h-[800px] flex flex-col items-center justify-center bg-white pt-32 px-6 overflow-hidden">
      {/* Dynamic Background Elements */}
      <div className="absolute top-0 left-0 w-full h-full -z-10 overflow-hidden pointer-events-none">
        <div className="absolute top-[10%] left-[5%] w-96 h-96 bg-blue-100/30 rounded-full blur-[120px] animate-pulse-slow" />
        <div className="absolute bottom-[20%] right-[10%] w-[500px] h-[500px] bg-green-100/20 rounded-full blur-[150px]" />
        <div className="absolute top-[40%] right-[30%] w-64 h-64 bg-amber-100/20 rounded-full blur-[100px]" />
      </div>

      <div className="max-w-7xl w-full grid grid-cols-1 lg:grid-cols-2 gap-20 items-center z-10">
        
        {/* Left Side: Text and CTA */}
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="flex flex-col space-y-8 text-left"
        >
          <div className="space-y-6">
            <h1 className="text-7xl md:text-8xl font-black tracking-tighter text-gray-900 leading-[0.95] font-heading">
              Get chosen <br />by AI. <br />
              <span className="bg-gradient-to-r from-gray-400 via-gray-300 to-gray-500 bg-clip-text text-transparent italic">Not lost in lists.</span>
            </h1>
            <p className="max-w-md text-xl text-gray-400 font-bold leading-relaxed lowercase tracking-tight">
              LocalPlus gives one clear answer instead of 20 links. Turn your business into the only logical choice for <span className="text-gray-900 italic">AI discovery</span>.
            </p>
          </div>
          
          <div className="flex flex-wrap gap-4">
            <button className="px-8 py-4 bg-gray-900 text-white font-semibold rounded-full hover:bg-black transition-colors transform hover:scale-105 active:scale-95 duration-200">
              Try LocalPlus
            </button>
            <button className="px-8 py-4 border-2 border-gray-900 text-gray-900 font-semibold rounded-full hover:bg-gray-100 transition-colors transform hover:scale-105 active:scale-95 duration-200">
              Join as Partner ↗
            </button>
          </div>
        </motion.div>
        
        {/* Right Side: Animated Flow */}
        <motion.div
           initial={{ opacity: 0, scale: 0.95 }}
           animate={{ opacity: 1, scale: 1 }}
           transition={{ duration: 1, delay: 0.2 }}
           className="relative aspect-square flex items-center justify-center p-8 bg-white/40 backdrop-blur-3xl rounded-[48px] shadow-[0_32px_64px_-16px_rgba(0,0,0,0.1)] border border-white/80"
        >
          <div className="relative w-full max-w-sm space-y-6 flex flex-col">
            {/* User Query */}
            <motion.div 
              initial={{ x: -100, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 1, duration: 0.5 }}
              className="p-4 bg-gray-100 rounded-2xl rounded-bl-none self-start shadow-sm"
            >
              <p className="text-xs font-semibold text-gray-400 mb-1 tracking-wider uppercase">User Query</p>
              <p className="text-lg font-medium">"Best brunch right now"</p>
            </motion.div>
            
            {/* AI thinking */}
            <motion.div
               animate={{ opacity: [0, 1, 0] }}
               transition={{ repeat: Infinity, duration: 1.5, delay: 1.5 }}
               className="self-center flex space-x-2"
            >
              <div className="w-2 h-2 bg-gray-300 rounded-full" />
              <div className="w-2 h-2 bg-gray-300 rounded-full" />
              <div className="w-2 h-2 bg-gray-300 rounded-full" />
            </motion.div>
            
            {/* AI Answer Card */}
            <motion.div
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 2, duration: 0.8 }}
              className="p-8 bg-gray-900 rounded-[32px] shadow-3xl space-y-6 border border-white/10 group"
            >
              <div className="flex justify-between items-start">
                <h3 className="text-2xl font-black text-white italic tracking-tighter">The Brunch Club</h3>
                <MCCIndicators type="citation" />
              </div>
              <p className="text-sm text-gray-400 font-medium leading-relaxed">They currently have a short 10-minute wait and specialize in farm-to-table eggs benedict.</p>
              <div className="flex items-center space-x-4 pt-4 border-t border-white/10">
                <MCCIndicators type="mention" label="Mentions" />
                <MCCIndicators type="click" label="Book Table ↗" />
              </div>
            </motion.div>
          </div>
          
          {/* Decorative floating elements */}
          <div className="absolute -top-4 -right-4 w-24 h-24 bg-blue-100 rounded-full blur-3xl opacity-50" />
          <div className="absolute -bottom-4 -left-4 w-24 h-24 bg-green-100 rounded-full blur-3xl opacity-50" />
        </motion.div>
      </div>
    </section>
  )
}
