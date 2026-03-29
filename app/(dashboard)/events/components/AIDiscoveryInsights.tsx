'use client'

import { useState, useEffect } from 'react'
import { Sparkles, AlertTriangle, ArrowRight, TrendingUp, Calendar, Zap, RefreshCw, CheckCircle2 } from 'lucide-react'
import { aiApi } from '@/lib/api'

interface DiscoveryData {
  conflicts: any[]
  insights: any[]
  recommendations: any[]
  audit: { generated_at: string }
}

export default function AIDiscoveryInsights({ organizationId }: { organizationId: string }) {
  const [data, setData] = useState<DiscoveryData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadDiscovery()
  }, [organizationId])

  const loadDiscovery = async () => {
    setLoading(true)
    try {
      const res = await aiApi.getDiscovery(organizationId)
      if (res.success) setData(res.data)
    } finally {
      setLoading(false)
    }
  }

  if (loading) return (
    <div className="p-8 bg-gray-900 rounded-[40px] border border-gray-800 animate-pulse flex flex-col items-center justify-center space-y-4">
       <Sparkles className="text-red-500" size={32} />
       <p className="text-[10px] font-black text-white uppercase tracking-[0.2em] italic">Initializing Discovery Engine...</p>
    </div>
  )

  if (!data || (data.conflicts.length === 0 && data.insights.length === 0 && data.recommendations.length === 0)) return null

  return (
    <div className="bg-gray-900 rounded-[40px] p-8 border border-gray-800 shadow-2xl relative overflow-hidden group">
      {/* Background Glow */}
      <div className="absolute -top-24 -right-24 w-64 h-64 bg-red-600/20 blur-[100px] rounded-full group-hover:bg-red-600/30 transition-all duration-1000" />
      
      {/* Header */}
      <div className="flex justify-between items-start mb-8 relative z-10">
         <div>
            <div className="flex items-center space-x-2 text-red-500 mb-2">
               <Zap size={16} fill="currentColor" />
               <span className="text-[10px] font-black uppercase tracking-[0.3em] italic">Live Intelligence Radar</span>
            </div>
            <h3 className="text-2xl font-black text-white italic tracking-tighter">AI Discovery Analysis.</h3>
         </div>
         <button 
           onClick={loadDiscovery}
           className="p-2 hover:bg-white/5 rounded-full text-gray-400 transition-all"
         >
           <RefreshCw size={16} />
         </button>
      </div>

      <div className="space-y-6 relative z-10">
         {/* CONFLICTS */}
         {data.conflicts.length > 0 && (
            <div className="space-y-3">
               <p className="text-[9px] font-black text-red-500 uppercase tracking-widest pl-1">CRITICAL CONFLICTS DETECTION</p>
               {data.conflicts.map((conf, i) => (
                  <div key={i} className="p-4 bg-red-500/10 border border-red-500/20 rounded-2xl flex items-start space-x-3 group/item">
                     <AlertTriangle size={18} className="text-red-500 shrink-0 mt-0.5" />
                     <div className="flex-1">
                        <p className="text-xs font-black text-red-100 italic leading-snug">{conf.message}</p>
                     </div>
                     <button className="p-2 bg-red-500 text-white rounded-xl shadow-lg shadow-red-500/20 opacity-0 group-hover/item:opacity-100 transition-all hover:scale-110">
                        <ArrowRight size={14} />
                     </button>
                  </div>
               ))}
            </div>
         )}

         {/* INSIGHTS */}
         {data.insights.length > 0 && (
            <div className="space-y-3">
               <p className="text-[9px] font-black text-blue-400 uppercase tracking-widest pl-1">PREDICTIVE LOAD FORECASTS</p>
               {data.insights.map((ins, i) => (
                  <div key={i} className="p-4 bg-blue-500/10 border border-blue-400/20 rounded-2xl flex items-start space-x-3">
                     <TrendingUp size={18} className="text-blue-400 shrink-0 mt-0.5" />
                     <p className="text-xs font-black text-blue-100 italic leading-snug">{ins.message}</p>
                  </div>
               ))}
            </div>
         )}

         {/* RECOMMENDATIONS */}
         {data.recommendations.length > 0 && (
            <div className="space-y-3 pt-2">
               <p className="text-[9px] font-black text-emerald-400 uppercase tracking-widest pl-1">STRATEGIC OPPORTUNITIES</p>
               <div className="grid grid-cols-1 gap-3">
                  {data.recommendations.map((rec, i) => (
                     <div key={i} className="p-5 bg-white/5 border border-white/10 rounded-[28px] hover:bg-white/10 transition-all group/rec">
                        <div className="flex justify-between items-start mb-2">
                           <div className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 text-[8px] font-black uppercase tracking-tighter ring-1 ring-emerald-500/40">
                              [AI RECON]
                           </div>
                           <Calendar size={14} className="text-gray-600" />
                        </div>
                        <h4 className="text-sm font-black text-white italic tracking-tight">{rec.title}</h4>
                        <p className="text-[10px] font-medium text-gray-400 mt-1 mb-4 leading-relaxed">{rec.message}</p>
                        <button className="w-full py-3 bg-emerald-500 text-gray-900 rounded-xl text-[10px] font-black uppercase tracking-widest shadow-xl shadow-emerald-500/10 hover:bg-emerald-400 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center space-x-2">
                           <CheckCircle2 size={14} />
                           <span>Apply Strategic Injection →</span>
                        </button>
                     </div>
                  ))}
               </div>
            </div>
         )}
      </div>

      <div className="mt-8 pt-4 border-t border-white/5 flex items-center justify-between opacity-30 text-[8px] font-black text-white uppercase tracking-[0.2em] italic">
         <span>Temporal Engine Verify: OK</span>
         <span className="tabular-nums">{new Date(data.audit.generated_at).toLocaleTimeString()}</span>
      </div>
    </div>
  )
}
