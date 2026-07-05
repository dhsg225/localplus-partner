"use client"

import { motion } from "framer-motion"
import { 
  Zap, 
  TrendingUp, 
  ArrowRight, 
  ShieldCheck, 
  Sparkles,
  ChevronRight,
  Info,
  CheckCircle2,
  LineChart,
  Search,
  Scale,
  DollarSign,
  BarChart3
} from "lucide-react"
import { useState, useEffect } from "react"
import { pricingApi } from "@/lib/api"

interface GrowthUIProps {
  intelligenceData: any
}

export default function GrowthUI({ intelligenceData }: GrowthUIProps) {
  const [loading, setLoading] = useState(false)
  const [upgraded, setUpgraded] = useState(false)
  const [pricing, setPricing] = useState<any>(null)

  useEffect(() => {
    pricingApi.getPricing().then(setPricing).catch(console.error)
  }, [])

  const appearances = intelligenceData?.visibility?.appearances_7d || 0
  const multiplier = pricing?.multiplier || 1.0
  const basePrice = pricing?.base_price || 500
  const finalPrice = Math.round(basePrice * multiplier)

  const handleUpgrade = () => {
    setLoading(true)
    setTimeout(() => {
       setLoading(false)
       setUpgraded(true)
    }, 1500)
  }

  const getInsight = () => {
    if (!pricing) return "Calculating performance alignment..."
    const { demand_score, value_score } = pricing
    if (demand_score > 0.7 && value_score < 0.5) return "You are getting attention but not converting — improve profile depth or operational offering."
    if (demand_score < 0.5 && value_score > 0.7) return "Strong business performance — increase visibility to capture untapped demand."
    if (demand_score > 0.7 && value_score > 0.7) return "Top performer — your business quality justifies premium exposure."
    return "Your pricing is balanced based on current demand and value signals."
  }

  return (
    <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-20">
      
      {/* 🏛️ PRICING STRATEGY OVERVIEW */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
         <div className="lg:col-span-2 bg-gray-900 rounded-[48px] p-10 text-white shadow-2xl relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-12 opacity-10 transform scale-150 rotate-12 group-hover:rotate-0 transition-transform duration-700">
               <Scale size={160} />
            </div>
            
            <div className="relative z-10 space-y-8">
               <div className="space-y-2">
                  <div className="px-3 py-1 bg-blue-500/20 text-blue-400 border border-blue-500/30 rounded-full text-[10px] font-black uppercase tracking-widest w-fit">Engine Economics</div>
                  <h2 className="text-4xl font-black italic tracking-tighter">Performance-Based Pricing</h2>
                  <p className="text-gray-400 font-medium max-w-xl text-sm leading-relaxed">
                     Your dynamic price multiplier is calculated using real-time demand and conversion value signals. 
                     No arbitrary tiers — you pay based on the value you extract from the engine.
                  </p>
               </div>

               <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <PricingStat label="Demand Multiplier" value={`${multiplier}x`} color="text-blue-400" />
                  <PricingStat label="Demand Score" value={(pricing?.demand_score || 0).toFixed(2)} color="text-amber-400" />
                  <PricingStat label="Value Score" value={(pricing?.value_score || 0).toFixed(2)} color="text-emerald-400" />
               </div>
            </div>
         </div>

         <div className="bg-white border border-gray-100 p-8 rounded-[48px] shadow-sm flex flex-col justify-between group">
            <div className="space-y-6">
               <div className="flex items-center space-x-3">
                  <div className="p-3 bg-gray-50 rounded-2xl text-gray-900 border border-gray-100">
                     <BarChart3 size={24} />
                  </div>
                  <h3 className="text-sm font-black uppercase tracking-widest italic leading-none">Status</h3>
               </div>
               <div>
                  <h4 className="text-2xl font-black italic tracking-tighter text-gray-900">{pricing?.tier_label || "Stable Performer"}</h4>
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-2">Dynamic Performance Tier</p>
               </div>
               <p className="text-xs text-gray-500 italic leading-relaxed">
                  {getInsight()}
               </p>
            </div>
            <div className="mt-8 pt-6 border-t border-gray-50 flex items-center justify-between">
               <span className="text-[10px] font-black uppercase text-gray-300">Last Audit: Today</span>
               <Info size={14} className="text-gray-200" />
            </div>
         </div>
      </div>

      {/* DYNAMIC PRICING CALCULATION */}
      <div className="bg-blue-50 border border-blue-100 p-10 rounded-[48px] relative overflow-hidden group">
         <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-8">
            <div className="flex items-start space-x-6">
               <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center text-blue-600 shadow-sm shrink-0">
                  <DollarSign size={28} />
               </div>
               <div>
                  <h3 className="text-xl font-black italic tracking-tighter text-blue-900 mb-1">Price Calculation</h3>
                  <p className="text-sm text-blue-800/60 font-medium">Pricing is based on real customer demand (search visibility) and conversion performance (real outcomes).</p>
               </div>
            </div>
            
            <div className="flex items-center space-x-8">
               <div className="text-center">
                  <p className="text-[10px] font-black text-blue-400 uppercase tracking-widest mb-1">Base Price</p>
                  <p className="text-2xl font-black italic text-blue-900/40 tracking-tighter decoration-1 line-through">฿{basePrice}</p>
               </div>
               <div className="text-center">
                  <p className="text-[10px] font-black text-blue-400 uppercase tracking-widest mb-1">Multiplier</p>
                  <p className="text-2xl font-black italic text-blue-900 tracking-tighter">× {multiplier}</p>
               </div>
               <div className="bg-white px-8 py-4 rounded-3xl border border-blue-200 text-center shadow-lg shadow-blue-500/5">
                  <p className="text-[10px] font-black text-blue-600 uppercase tracking-widest mb-1">Your Price</p>
                  <p className="text-3xl font-black italic text-gray-900 tracking-tighter">฿{finalPrice}</p>
               </div>
            </div>
         </div>
      </div>

      {/* UPGRADE TIERS */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
         
         {/* BOOST TIER */}
         <div className="bg-white border border-gray-100 p-12 rounded-[56px] shadow-sm hover:shadow-xl hover:shadow-gray-200/50 transition-all duration-500 group relative">
            <div className="space-y-8">
               <div className="w-16 h-16 bg-gray-50 rounded-2xl flex items-center justify-center text-gray-300 group-hover:text-amber-500 group-hover:bg-amber-50 transition-all duration-500">
                  <Zap size={32} />
               </div>
               <div>
                  <h3 className="text-3xl font-black italic tracking-tighter text-gray-900">Visibility Scale</h3>
                  <p className="text-sm font-medium text-gray-500 mt-2">Scale your exposure in high-intent local discovery query paths.</p>
               </div>
               
               <div className="py-8 border-y border-gray-50 space-y-4">
                  <FeatureItem label="+0.020 Global Boost Signal" active />
                  <FeatureItem label="Verified Grounding Priority" active />
                  <FeatureItem label="Advanced Intent Matching" />
               </div>

               <div className="flex items-baseline space-x-3">
                  <span className="text-4xl font-black italic tracking-tighter text-gray-900">฿{finalPrice}</span>
                  <span className="text-xs font-bold text-gray-400 uppercase tracking-widest italic">/ month</span>
               </div>

               <button 
                  onClick={handleUpgrade}
                  disabled={loading || upgraded}
                  className="w-full py-6 bg-gray-900 text-white rounded-[32px] text-xs font-black uppercase tracking-[0.2em] shadow-xl hover:bg-red-600 transition-all active:scale-95 disabled:opacity-50"
               >
                  {loading ? "Calculating Path..." : upgraded ? "Exposure Active" : "Scale Visibility"}
               </button>
            </div>
         </div>

         {/* PREMIUM TIER */}
         <div className="bg-gradient-to-br from-indigo-600 to-blue-700 p-12 rounded-[56px] text-white shadow-2xl relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-12 opacity-20 transform rotate-12 transition-transform group-hover:rotate-0 duration-700">
               <Sparkles size={140} />
            </div>
            <div className="relative z-10 space-y-8">
               <div className="w-16 h-16 bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl flex items-center justify-center">
                  <Sparkles size={32} fill="currentColor" />
               </div>
               <div>
                  <h3 className="text-3xl font-black italic tracking-tighter">Premium Dominance</h3>
                  <p className="text-sm font-medium text-white/70 mt-2">The highest available weighting for all grounded exploration vectors.</p>
               </div>
               
               <div className="py-8 border-y border-white/10 space-y-4">
                  <FeatureItem label="+0.040 Maximum Boost Signal" active light />
                  <FeatureItem label="Tier 1 Intent Prority" active light />
                  <FeatureItem label="Dominant Discovery Presence" active light />
               </div>

               <div className="flex items-baseline space-x-3">
                  <span className="text-4xl font-black italic tracking-tighter">฿{Math.round(999 * multiplier)}</span>
                  <span className="text-xs font-bold text-white/60 uppercase tracking-widest italic">/ month</span>
               </div>

               <button 
                  disabled 
                  className="w-full py-6 bg-white text-blue-600 rounded-[32px] text-xs font-black uppercase tracking-[0.2em] shadow-xl opacity-50 cursor-not-allowed"
               >
                  Limited Availability
               </button>
            </div>
         </div>

      </div>

      {/* TRUST MESSAGE */}
      <div className="text-center space-y-4 max-w-sm mx-auto">
         <p className="text-[10px] font-black text-blue-600 uppercase tracking-[0.2em] italic">
            Pricing is based on real customer behavior — not arbitrary tiers.
         </p>
         <p className="text-[10px] font-black text-gray-300 uppercase tracking-widest italic">
            Your performance multiplier reflects real demand and results tracked by the Answer Engine.
         </p>
      </div>

    </div>
  )
}

function PricingStat({ label, value, color }: any) {
  return (
    <div className="p-6 bg-white/5 border border-white/10 rounded-3xl">
       <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-2">{label}</p>
       <p className={`text-2xl font-black italic tracking-tighter ${color}`}>{value}</p>
    </div>
  )
}

function FeatureItem({ label, active, light }: any) {
  return (
    <div className={`flex items-center space-x-3 text-xs font-black uppercase tracking-widest italic ${active ? (light ? 'text-white' : 'text-gray-900') : (light ? 'text-white/30' : 'text-gray-200')}`}>
       <CheckCircle2 size={16} className={active ? (light ? 'text-white' : 'text-emerald-500') : (light ? 'text-white/10' : 'text-gray-100')} />
       <span>{label}</span>
    </div>
  )
}
