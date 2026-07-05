"use client"

import { motion } from "framer-motion"
import { 
  TrendingUp, 
  Eye, 
  MapPin, 
  Target, 
  MessageSquare, 
  Zap,
  Info,
  ChevronRight,
  ArrowUpRight,
  ArrowDownRight,
  Minus,
  Sparkles,
  Search,
  ShieldCheck,
  AlertCircle,
  ThumbsUp,
  LineChart,
  MousePointerClick
} from "lucide-react"

interface Signal {
  value: number
  trend: 'up' | 'down' | 'stable'
}

interface IntelligenceData {
  disclosure: {
    is_promoted: boolean
    promotion_tier: string
  }
  trust_score: number
  visibility: {
    appearances_7d: number
    appearances_30d: number
    trend: number
  }
  ranking: {
    avg_position: number
    top_3_rate: number
    base_relevance: number
    data_quality: number
  }
  match_quality: {
    avg_score: number
    low_confidence_rate: number
  }
  feedback: {
    positive_rate: number
    total_count: number
  }
  analytics: {
    clicks_7d: number
    ctr: number
    trend: number
  }
  signals: {
    memory_boost: Signal
    trend_boost: Signal
    session_boost: Signal
    exploration_boost: Signal
  }
}

export default function IntelligenceUI({ data }: { data: IntelligenceData }) {
  
  const getStatusColor = (val: number, thresholds: { green: number, amber: number }) => {
    if (val >= thresholds.green) return "text-emerald-500 bg-emerald-500/10 border-emerald-500/20"
    if (val >= thresholds.amber) return "text-amber-500 bg-amber-500/10 border-amber-500/20"
    return "text-red-500 bg-red-500/10 border-red-500/20"
  }

  const getTrustLabel = (score: number) => {
    if (score > 0.8) return { label: "STRONG", color: "text-emerald-500", bg: "bg-emerald-500/10" }
    if (score >= 0.6) return { label: "GOOD", color: "text-amber-500", bg: "bg-amber-500/10" }
    return { label: "NEEDS IMPROVEMENT", color: "text-red-500", bg: "bg-red-500/10" }
  }

  const formatPercent = (val: number) => `${(val * 100).toFixed(1)}%`
  const trust = getTrustLabel(data.trust_score)

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      
      {/* 💡 INSIGHT & TRUST HEADER */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="lg:col-span-2 relative transition-all group"
        >
          <div className="relative bg-white/60 backdrop-blur-2xl border border-white p-8 rounded-[40px] shadow-sm flex items-start space-x-6 h-full">
            <div className="w-14 h-14 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-2xl flex items-center justify-center text-white shadow-xl shadow-blue-500/20 shrink-0">
              <Sparkles size={24} fill="currentColor" />
            </div>
            <div className="flex-1">
              <div className="flex items-center justify-between mb-2">
                <h2 className="text-xl font-black italic tracking-tighter text-gray-900">Weekly Performance Insight</h2>
                {data.disclosure.is_promoted && (
                  <div className="group/promo relative">
                    <div className="px-3 py-1 bg-amber-500/10 text-amber-600 border border-amber-500/20 rounded-full text-[9px] font-black uppercase tracking-widest flex items-center gap-1.5 cursor-help">
                      <Zap size={10} fill="currentColor" />
                      Promoted
                    </div>
                    <div className="absolute top-full right-0 mt-2 w-56 p-3 bg-gray-900 text-white text-[9px] font-medium rounded-xl opacity-0 group-hover/promo:opacity-100 transition-opacity pointer-events-none z-50 shadow-2xl">
                      This listing is boosted ({data.disclosure.promotion_tier}), but still ranked based on relevance.
                    </div>
                  </div>
                )}
              </div>
              <p className="text-sm font-medium text-gray-600 leading-relaxed">
                You are appearing in <span className="text-blue-600 font-black">{data.visibility.appearances_7d} searches</span> this week. 
                {data.signals.memory_boost.value > 0.015 ? " Customer engagement is increasing your visibility." : ""}
                {data.ranking.data_quality > 0.8 ? " Your high data completeness is strengthening your position in specific intent queries." : ""}
              </p>
              <div className="mt-4 flex items-center space-x-2 text-[10px] font-black text-gray-400 uppercase tracking-widest italic">
                <Info size={12} />
                <span>Better data beats paid promotion</span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* TRUST SCORE CARD */}
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-white border border-gray-100 p-8 rounded-[40px] shadow-sm flex flex-col justify-between"
        >
           <div className="flex items-center justify-between mb-6">
              <div className="p-3 bg-gray-50 rounded-2xl border border-gray-100 text-gray-900">
                 <ShieldCheck size={20} />
              </div>
              <div className="group/trust relative">
                <Info size={14} className="text-gray-300 hover:text-gray-900 cursor-help" />
                <div className="absolute top-full right-0 mt-2 w-56 p-3 bg-gray-900 text-white text-[9px] font-medium rounded-xl opacity-0 group-hover/trust:opacity-100 transition-opacity pointer-events-none z-50 shadow-2xl">
                  Trust Score is based on query relevance, verified data quality, and authenticated customer feedback.
                </div>
              </div>
           </div>
           <div>
              <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-2">Engine Trust Score</h4>
              <div className="flex items-baseline space-x-3">
                 <span className="text-4xl font-black italic tracking-tighter text-gray-900">{data.trust_score.toFixed(2)}</span>
                 <span className={`${trust.color} text-[10px] font-black px-2 py-0.5 ${trust.bg} rounded-full tracking-tighter italic`}>
                    {trust.label}
                 </span>
              </div>
              <div className="mt-4 h-1.5 w-full bg-gray-100 rounded-full overflow-hidden">
                 <motion.div 
                   initial={{ width: 0 }}
                   animate={{ width: `${data.trust_score * 100}%` }}
                   className={`h-full ${data.trust_score > 0.8 ? 'bg-emerald-500' : data.trust_score > 0.6 ? 'bg-amber-500' : 'bg-red-500'}`}
                 />
              </div>
           </div>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-4 gap-6">
        <MetricCard title="Appearances" value={data.visibility.appearances_7d} subtitle="7d Window" icon={<Eye size={20} />} trend={data.visibility.trend} tooltip="Total appearances in engine results." />
        <MetricCard title="Base Relevance" value={formatPercent(data.ranking.base_relevance)} subtitle="Intent Matching" icon={<Search size={20} />} status={getStatusColor(data.ranking.base_relevance, { green: 0.8, amber: 0.6 })} tooltip="How well your entity matches user intent without boosts." />
        <MetricCard title="Grounding Quality" value={formatPercent(data.ranking.data_quality)} subtitle="Verified Data" icon={<MapPin size={20} />} status={getStatusColor(data.ranking.data_quality, { green: 0.85, amber: 0.7 })} tooltip="The depth and accuracy of your business profile data." />
        <MetricCard 
          title="Public Sentiment" 
          value={formatPercent(data.feedback.positive_rate)} 
          subtitle={`${data.feedback.total_count} Responses`}
          icon={<ThumbsUp size={20} />}
          status={getStatusColor(data.feedback.positive_rate, { green: 0.9, amber: 0.75 })}
          tooltip="The percentage of positive signals detected from user feedback and mentions."
        />
      </div>

      {/* CUSTOMER ACTIVITY ROW (PHASE 4.6) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-emerald-600 rounded-[32px] p-8 text-white shadow-xl shadow-emerald-500/10 flex items-center justify-between group overflow-hidden relative">
           <div className="absolute top-0 right-0 p-6 opacity-10 transform scale-150 rotate-12 group-hover:rotate-0 transition-transform duration-700">
              <TrendingUp size={48} />
           </div>
           <div className="relative z-10">
              <div className="flex items-center space-x-2 mb-4">
                 <div className="p-2 bg-white/20 rounded-xl">
                    <MousePointerClick size={18} />
                 </div>
                 <span className="text-[10px] font-black uppercase tracking-widest">Customer Activity</span>
              </div>
              <div className="flex items-baseline space-x-4">
                 <h3 className="text-4xl font-black italic tracking-tighter">{data.analytics.clicks_7d}</h3>
                 <span className="text-xs font-bold text-white/60 uppercase italic">Real Interactions This Week</span>
              </div>
           </div>
           <div className="relative z-10 text-right">
              <p className="text-[10px] font-bold text-emerald-100/60 uppercase tracking-widest mb-1">Click-Through Rate</p>
              <div className="text-2xl font-black italic tracking-tighter">{(data.analytics.ctr * 100).toFixed(1)}%</div>
           </div>
        </div>

        <div className="bg-white border border-gray-100 p-8 rounded-[32px] shadow-sm flex items-center justify-between">
           <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-gray-50 border border-gray-100 rounded-2xl flex items-center justify-center text-gray-400">
                 <Zap size={24} fill="currentColor" />
              </div>
              <div>
                 <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Conversion Signal</p>
                 <p className="text-sm font-black italic text-gray-900 leading-none">High-Intent Discovery Demand.</p>
              </div>
           </div>
           <p className="max-w-[200px] text-[9px] font-medium text-gray-400 italic text-right">
              This is real customer demand captured from search activity on Hua Hin Discover.
           </p>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        
        {/* WHY YOU RANK PANEL (ENHANCED) */}
        <div className="xl:col-span-2 bg-gray-900 rounded-[40px] p-10 text-white shadow-2xl relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-8 opacity-10 transform scale-125 rotate-6">
             <LineChart size={120} />
          </div>
          
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-10">
               <div className="flex items-center space-x-3">
                  <div className="p-3 bg-red-500/20 rounded-2xl border border-red-500/30 text-red-500">
                     <Zap size={24} fill="currentColor" />
                  </div>
                  <div>
                     <h3 className="text-lg font-black uppercase tracking-widest italic leading-none">Signal Health Panel</h3>
                     <p className="text-[9px] font-bold text-gray-500 tracking-[0.2em] uppercase mt-2">Explainable discovery ranking & trends.</p>
                  </div>
               </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-10">
               <SignalBar label="Memory Signal" signal={data.signals.memory_boost} color="bg-blue-500" tooltip="Incentive from recurring customer engagement." />
               <SignalBar label="Trend Signal" signal={data.signals.trend_boost} color="bg-orange-500" tooltip="Ranking bonus from local trending topics." />
               <SignalBar label="Session Context" signal={data.signals.session_boost} color="bg-emerald-500" tooltip="Live relevance to the active user session." />
               <SignalBar label="Exploration Path" signal={data.signals.exploration_boost} color="bg-purple-500" tooltip="Signal from new users discovering your area." />
            </div>
          </div>
        </div>

        {/* SELF-OPTIMIZATION (RECOMMENDATIONS) */}
        <div className="bg-white border border-gray-100 rounded-[40px] p-8 shadow-sm flex flex-col justify-between space-y-8">
           <div className="space-y-6">
              <div className="flex items-center space-x-3">
                 <div className="p-3 bg-gray-50 rounded-2xl border border-gray-100 text-gray-900">
                    <AlertCircle size={20} />
                 </div>
                 <h3 className="text-sm font-black uppercase tracking-[0.2em] italic">Optimization Path</h3>
              </div>
              
              <div className="space-y-4">
                 {data.ranking.data_quality < 0.9 && (
                   <div className="p-4 bg-red-50 border border-red-100 rounded-2xl flex items-start space-x-3">
                      <div className="mt-1"><ArrowUpRight size={14} className="text-red-600" /></div>
                      <div>
                         <p className="text-[10px] font-black text-red-900 uppercase">Improve Grounding</p>
                         <p className="text-[9px] font-medium text-red-700 mt-1">Add structured operating hours to maximize intent matching.</p>
                      </div>
                   </div>
                 )}
                 {data.signals.memory_boost.value < 0.02 && (
                   <div className="p-4 bg-amber-50 border border-amber-100 rounded-2xl flex items-start space-x-3">
                      <div className="mt-1"><ArrowUpRight size={14} className="text-amber-600" /></div>
                      <div>
                         <p className="text-[10px] font-black text-amber-900 uppercase">Boost Memory</p>
                         <p className="text-[9px] font-medium text-amber-700 mt-1">Encourage verified reviews to strengthen your brand signal.</p>
                      </div>
                   </div>
                 )}
                 {data.ranking.data_quality >= 0.9 && data.signals.memory_boost.value >= 0.02 && (
                   <div className="p-4 bg-emerald-50 border border-emerald-100 rounded-2xl flex items-start space-x-3">
                      <div className="mt-1"><ThumbsUp size={14} className="text-emerald-600" /></div>
                      <div>
                         <p className="text-[10px] font-black text-emerald-900 uppercase">Optimal Profile</p>
                         <p className="text-[9px] font-medium text-emerald-700 mt-1">Your profile is currently optimal for grounding. Maintain verified data.</p>
                      </div>
                   </div>
                 )}
              </div>
           </div>

           <button className="w-full py-4 bg-gray-50 hover:bg-gray-100 border border-gray-100 rounded-2xl text-[10px] font-black uppercase tracking-widest text-gray-600 flex items-center justify-center gap-2 transition-all">
              <span>Grounding Audit</span>
              <ChevronRight size={14} />
           </button>
        </div>

      </div>
    </div>
  )
}

function MetricCard({ title, value, subtitle, icon, trend, status, tooltip }: any) {
  return (
    <div className="bg-white border border-gray-100 p-6 rounded-[32px] shadow-sm relative group hover:shadow-xl hover:shadow-gray-200/50 transition-all duration-500">
      <div className="flex items-center justify-between mb-4">
        <div className="w-10 h-10 rounded-xl bg-gray-50 border border-gray-100 flex items-center justify-center text-gray-400 group-hover:text-gray-900 transition-colors">
          {icon}
        </div>
        <div className="group/info relative">
          <Info size={14} className="text-gray-300 hover:text-gray-900 cursor-help" />
          <div className="absolute bottom-full right-0 mb-2 w-48 p-3 bg-gray-900 text-white text-[9px] font-medium rounded-xl opacity-0 group-hover/info:opacity-100 transition-opacity pointer-events-none z-50 shadow-2xl">
            {tooltip}
          </div>
        </div>
      </div>
      
      <div className="space-y-1">
        <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{title}</h4>
        <div className="flex items-baseline space-x-2">
          <span className="text-2xl font-black italic tracking-tighter text-gray-900">{value}</span>
          {trend !== undefined && (
            <div className={`flex items-center text-[10px] font-black ${trend >= 0 ? 'text-emerald-600' : 'text-red-600'}`}>
              {trend >= 0 ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />}
              {Math.abs(trend * 100).toFixed(0)}%
            </div>
          )}
        </div>
        <p className={`text-[10px] font-bold uppercase tracking-tight py-1 px-2 rounded-lg inline-block mt-2 border border-transparent ${status || 'text-gray-500 bg-gray-50'}`}>
          {subtitle}
        </p>
      </div>
    </div>
  )
}

function SignalBar({ label, signal, color, tooltip }: { label: string, signal: Signal, color: string, tooltip: string }) {
  const percent = Math.min((signal.value / 0.03) * 100, 100)
  
  const getStrength = (v: number) => {
    if (v > 0.02) return { label: "STRONG", color: "text-emerald-500" }
    if (v >= 0.01) return { label: "GOOD", color: "text-amber-500" }
    return { label: "STABILIZING", color: "text-gray-500" }
  }

  const strength = getStrength(signal.value)

  return (
    <div className="space-y-3 group/signal">
      <div className="flex items-center justify-between text-[10px] font-black uppercase tracking-widest">
         <div className="flex items-center gap-3">
            <span className="text-gray-400 group-hover/signal:text-white transition-colors">{label}</span>
            <span className={`${strength.color} italic font-bold tracking-tighter`}>{strength.label}</span>
            {signal.trend === 'up' && <ArrowUpRight size={10} className="text-emerald-500" />}
            {signal.trend === 'down' && <ArrowDownRight size={10} className="text-red-500" />}
            {signal.trend === 'stable' && <Minus size={10} className="text-gray-500" />}
         </div>
         <div className="flex items-center gap-2">
            <span className="text-white italic">+{signal.value.toFixed(3)}</span>
            <div className="group/info relative">
              <Info size={11} className="text-gray-600 hover:text-white cursor-help transition-colors" />
              <div className="absolute bottom-full right-0 mb-2 w-40 p-2 bg-white text-gray-900 text-[8px] font-black rounded-lg opacity-0 group-hover/info:opacity-100 transition-opacity pointer-events-none z-50 shadow-2xl">
                {tooltip}
              </div>
            </div>
         </div>
      </div>
      <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
         <motion.div 
           initial={{ width: 0 }}
           animate={{ width: `${percent}%` }}
           className={`h-full ${color} shadow-[0_0_10px_rgba(255,255,255,0.2)]`}
           transition={{ duration: 1, ease: "easeOut" }}
         />
      </div>
    </div>
  )
}
