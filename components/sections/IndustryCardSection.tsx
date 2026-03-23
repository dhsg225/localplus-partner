"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"

const industries = [
  { id: "restaurants", label: "Restaurants", icon: "🍴", query: "Best food nearby?", flow: "Location → Rating → Opening Hours → Table available" },
  { id: "home-services", label: "Home Services", icon: "🛠️", query: "Who can fix my sink today?", flow: "Proximity → Review Score → Response Time" },
  { id: "clinics", label: "Clinics", icon: "🏥", query: "Highest rated dentist?", flow: "Insurance Check → Doctor Bio → Latest Reviews" },
  { id: "events", label: "Events", icon: "🎉", query: "What is happening tonight?", flow: "Crowd Size → Time Window → Ticket Status" }
]

export const IndustryCardSection = () => {
  const [selected, setSelected] = useState(industries[0].id)

  return (
    <section className="py-40 bg-white px-6">
      <div className="max-w-7xl mx-auto space-y-24">
        
        <div className="text-center space-y-6">
          <h2 className="text-5xl md:text-6xl font-black text-gray-900 leading-tight tracking-tighter">
            Every industry has <br /> a new logic.
          </h2>
          <p className="text-lg text-gray-400 font-bold uppercase tracking-widest">
            Tap an industry to see the AI workflow
          </p>
        </div>

        {/* Desktop Interface */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          
          {/* Selector Grid */}
          <div className="grid grid-cols-2 gap-4">
             {industries.map(item => (
                <button
                  key={item.id}
                  onClick={() => setSelected(item.id)}
                  className={`flex flex-col items-center justify-center p-8 rounded-[40px] text-center transition-all duration-300 ${selected === item.id ? 'bg-gray-900 text-white shadow-2xl scale-105' : 'bg-gray-50 text-gray-400 border border-gray-100 hover:bg-gray-100'}`}
                >
                  <span className="text-4xl mb-4 grayscale group-hover:grayscale-0">{item.icon}</span>
                  <span className="text-xl font-black">{item.label}</span>
                </button>
             ))}
          </div>
          
          {/* Active Flow View */}
          <div className="relative h-full flex flex-col justify-center p-12 bg-gray-50 rounded-[40px] border border-gray-100 min-h-[400px]">
             <AnimatePresence mode="wait">
                <motion.div
                  key={selected}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-8"
                >
                   <div className="space-y-2">
                      <p className="text-xs font-black text-gray-400 uppercase tracking-widest leading-none">Intent</p>
                      <p className="text-3xl font-bold leading-none">"{industries.find(i => i.id === selected)?.query}"</p>
                   </div>
                   
                   <div className="space-y-4">
                      <p className="text-xs font-black text-gray-400 uppercase tracking-widest">AI Matching Logic</p>
                      <div className="flex flex-wrap gap-2">
                         {industries.find(i => i.id === selected)?.flow.split(" → ").map((step, idx) => (
                            <span key={idx} className="px-4 py-2 bg-white rounded-xl shadow-sm border border-gray-100 text-sm font-bold text-gray-900">
                               {step}
                            </span>
                         ))}
                      </div>
                   </div>
                   
                   <div className="pt-8">
                       <button className="w-full py-4 bg-gray-900 text-white rounded-2xl font-bold text-lg hover:scale-[1.02] transition-transform">
                          Optimize for this ↗
                       </button>
                   </div>
                </motion.div>
             </AnimatePresence>
          </div>

        </div>

      </div>
    </section>
  )
}
