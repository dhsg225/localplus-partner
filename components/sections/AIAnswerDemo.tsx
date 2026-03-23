"use client"

import { motion } from "framer-motion"
import { MCCIndicators } from "../ui/MCCIndicators"

export const AIAnswerDemo = () => {
  return (
    <section className="py-40 bg-gray-50 flex flex-col items-center justify-center px-6">
      <div className="max-w-4xl text-center space-y-24">
        
        <div className="space-y-6">
          <h2 className="text-6xl font-black text-gray-900 leading-tight tracking-tighter italic font-serif">
             Inside the Answer.
          </h2>
          <p className="max-w-xl mx-auto text-lg text-gray-500 font-medium">
            This is where your business lives now. Not as a link, but as <span className="text-gray-900 font-bold">The Answer</span>.
          </p>
        </div>

        <motion.div 
           initial={{ opacity: 0, y: 50, scale: 0.9 }}
           whileInView={{ opacity: 1, y: 0, scale: 1 }}
           transition={{ duration: 1, type: "spring", stiffness: 50 }}
           className="relative p-1 bg-gradient-to-br from-blue-500 via-gray-900 to-green-500 rounded-[50px] shadow-3xl"
        >
          <div className="bg-white p-12 rounded-[49px] space-y-8 flex flex-col items-start text-left shadow-inner">
             
             {/* Example query */}
             <div className="space-y-2 w-full">
                <span className="text-xs font-black text-gray-400 uppercase tracking-widest leading-none">Query</span>
                <div className="w-full p-6 bg-gray-50 rounded-3xl border border-gray-100 flex items-center justify-between">
                   <p className="text-2xl font-bold">"Best brunch right now"</p>
                   <div className="w-8 h-8 rounded-full border-2 border-gray-200 flex items-center justify-center text-gray-400 text-xs font-bold">?</div>
                </div>
             </div>
             
             {/* AI Answer Card */}
             <div className="space-y-4 w-full">
                <span className="text-xs font-black text-gray-400 uppercase tracking-widest leading-none">AI Answer Card</span>
                
                <div className="w-full flex flex-col space-y-6 border-4 border-gray-900 p-8 rounded-[40px] shadow-2xl relative overflow-hidden group">
                   
                    <div className="absolute top-0 right-0 w-32 h-32 bg-amber-50 rounded-bl-[100px] flex items-center justify-center -translate-y-4 translate-x-4">
                       <MCCIndicators type="sponsored" />
                    </div>

                    <div className="space-y-2">
                       <h3 className="text-3xl font-black">LocalPlus Bistro</h3>
                       <p className="text-lg text-gray-400 font-black flex items-center gap-2">
                          <MCCIndicators type="citation" label="Source Verified" />
                       </p>
                    </div>

                    <p className="text-xl font-medium leading-relaxed max-w-lg">
                       "Based on 1,400 reviews and current proximity, <span className="bg-gray-100 px-1.5 rounded decoration-2 underline underline-offset-4 font-bold">LocalPlus Bistro</span> is the top choice for brunch. They have an outdoor seating area and currently have no wait time."
                    </p>

                    <div className="flex flex-wrap gap-4 pt-4">
                       <button className="flex-1 py-4 bg-gray-900 text-white rounded-2xl font-bold shadow-lg hover:shadow-gray-400/50 hover:scale-105 active:scale-95 transition-all">
                          Book Table ↗
                       </button>
                       <button className="flex-1 py-4 bg-gray-100 text-gray-900 rounded-2xl font-bold border border-gray-200 hover:bg-gray-200 transition-colors">
                          View Details
                       </button>
                    </div>

                    <div className="flex gap-4 pt-4 border-t border-gray-100">
                         <MCCIndicators type="mention" label="1,240 Mentions" />
                         <MCCIndicators type="citation" label="45 Citations" />
                         <MCCIndicators type="click" label="280 Clicks Today" />
                    </div>
                </div>
             </div>

          </div>
          
          <div className="absolute -z-10 -bottom-12 -right-12 w-48 h-48 bg-gray-900 rounded-full blur-3xl opacity-10" />
        </motion.div>

      </div>
    </section>
  )
}
