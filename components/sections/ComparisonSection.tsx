"use client"

import { motion } from "framer-motion"

export const ComparisonSection = () => {
  return (
    <section className="h-[120vh] flex flex-col md:flex-row bg-white overflow-hidden">
      
      {/* Old Side: Search Clutter */}
      <motion.div 
        initial={{ width: "50%" }}
        whileInView={{ backgroundColor: "#ffffff" }}
        className="relative w-full md:w-1/2 flex flex-col items-center justify-center p-12 overflow-hidden grayscale opacity-60"
      >
        <div className="absolute inset-0 bg-gray-50/50 backdrop-blur-sm z-0" />
        <div className="absolute top-12 left-12 z-10">
          <h2 className="text-2xl font-black text-gray-300 italic tracking-tighter">THE PAST</h2>
        </div>
        
        <div className="space-y-6 w-full max-w-sm">
          <div className="p-4 border-2 border-gray-200 rounded-lg shadow-sm flex items-center space-x-3 bg-white">
            <div className="w-4 h-4 rounded-full border-2 border-gray-300" />
            <div className="w-full h-2 bg-gray-100 rounded" />
          </div>
          
          <motion.div 
            animate={{ y: [0, -10, 0] }}
            transition={{ repeat: Infinity, duration: 2 }}
            className="space-y-3"
          >
            <div className="p-4 border border-blue-200 bg-blue-50/50 rounded-lg space-y-2 opacity-60">
              <div className="flex justify-between">
                <div className="w-24 h-2 bg-blue-200 rounded" />
                <span className="text-[10px] font-bold text-blue-500 tracking-wider">AD</span>
              </div>
              <div className="w-full h-1.5 bg-blue-100 rounded" />
              <div className="w-3/4 h-1.5 bg-blue-100 rounded" />
            </div>
            
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="p-4 border border-gray-100 rounded-lg space-y-2 opacity-30">
                <div className="w-32 h-2 bg-gray-200 rounded" />
                <div className="w-full h-1 bg-gray-100 rounded" />
              </div>
            ))}
          </motion.div>
          
          <div className="text-center pt-8">
            <p className="text-gray-400 font-bold text-3xl opacity-20 rotate-12">LISTS OF LINKS</p>
          </div>
        </div>
      </motion.div>

      {/* New Side: LocalPlus Clean Answer */}
      <motion.div 
        initial={{ backgroundColor: "#f9fafb" }}
        whileInView={{ backgroundColor: "#ffffff" }}
        className="relative w-full md:w-1/2 flex flex-col items-center justify-center p-12 overflow-hidden border-l border-gray-100"
      >
        {/* Techy Background for New Side */}
        <div className="absolute inset-0 bg-gradient-to-tr from-blue-50/50 via-green-50/30 to-white -z-10" />
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="absolute top-12 right-12"
        >
          <h2 className="text-2xl font-black text-gray-900 italic tracking-tighter font-heading">THE FUTURE</h2>
        </motion.div>
        
        <div className="relative w-full max-w-sm space-y-8 z-10">
          <motion.div 
            initial={{ scale: 0.8, opacity: 0 }}
            whileInView={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", stiffness: 100, delay: 0.5 }}
            className="p-8 bg-black rounded-[40px] shadow-2xl text-white space-y-6"
          >
            <div className="flex items-center space-x-3">
              <div className="w-6 h-6 border-2 border-white/30 rounded-full flex items-center justify-center">
                <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
              </div>
              <p className="text-xs font-bold tracking-widest text-white/50 uppercase">Answer Found</p>
            </div>
            
            <p className="text-2xl font-bold leading-snug">"The most highly rated clinic in your area is <span className="text-green-400 underline underline-offset-4 decoration-2">Modern Care Center</span>. They accept your insurance and have an opening tomorrow at 10 AM."</p>
            
            <div className="flex gap-3 pt-4">
              <button className="flex-1 py-3 bg-white text-black text-sm font-bold rounded-2xl hover:bg-gray-200 transition-colors">
                Book Visit ↗
              </button>
              <button className="flex-1 py-3 border border-white/20 text-white text-sm font-bold rounded-2xl hover:bg-white/10 transition-colors">
                Call Clinic
              </button>
            </div>
          </motion.div>
          
          <motion.p 
             initial={{ opacity: 0 }}
             whileInView={{ opacity: 1 }}
             transition={{ delay: 1 }}
             className="text-center text-sm font-medium text-gray-400"
          >No links. No ads. Just the answer.</motion.p>
        </div>
        
        {/* Animated Background Pulse */}
        <motion.div 
          animate={{ scale: [1, 1.2, 1], opacity: [0.1, 0.2, 0.1] }}
          transition={{ repeat: Infinity, duration: 4 }}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gray-400 rounded-full blur-3xl -z-0"
        />
      </motion.div>
    </section>
  )
}
