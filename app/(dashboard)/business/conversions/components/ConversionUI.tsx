"use client"

import { motion } from "framer-motion"
import { 
  BarChart3, 
  MousePointerClick, 
  PhoneCall,
  MapPin, 
  CalendarCheck, 
  TrendingUp, 
  Info,
  ChevronRight,
  ArrowRight,
  Zap,
  ShieldCheck,
  Target
} from "lucide-react"

interface ConversionData {
  summary: {
    conversions_7d: number
    clicks_7d: number
    actions: {
      calls: number
      directions: number
      bookings: number
    }
    conversion_rate: number
    click_rate: number
  }
  funnel: {
    appearances: number
    clicks: number
    conversions: number
  }
}

export default function ConversionUI({ data }: { data: ConversionData }) {
  
  const formatPercent = (val: number) => `${(val * 100).toFixed(1)}%`

  return (
    <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
      
      {/* 🚀 ROI INSIGHT BOX */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative group"
      >
        <div className="absolute inset-x-0 -bottom-4 h-24 bg-blue-600/5 blur-3xl rounded-[40px]" />
        <div className="relative bg-white/60 backdrop-blur-2xl border border-white p-8 rounded-[40px] shadow-sm flex items-start space-x-6">
          <div className="w-16 h-16 bg-gray-900 rounded-3xl flex items-center justify-center text-white shadow-xl shrink-0 group-hover:bg-blue-600 transition-colors">
            <Target size={28} />
          </div>
          <div>
            <h2 className="text-xl font-black italic tracking-tighter text-gray-900 mb-2">Conversion Strategy Hub</h2>
            <p className="text-sm font-medium text-gray-600 leading-relaxed max-w-2xl">
              {data.summary.conversion_rate < 0.2 
                ? "You are getting attention but not converting efficiently. Consider improving your business profile depth or operational offering to bridge the gap."
                : "Strong intent demand detected. Your profile is converting high-intent clicks at a superior rate. Consider boosting visibility to scale these results."
              }
            </p>
          </div>
        </div>
      </motion.div>

      {/* SUMMARY CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title="Total Conversions" value={data.summary.conversions_7d} subtitle="7d High-Intent Actions" icon={<Target size={20} />} color="text-blue-600" />
        <StatCard title="Engine Clicks" value={data.summary.clicks_7d} subtitle="Discovery Interest" icon={<MousePointerClick size={20} />} />
        <StatCard title="Conversion Rate" value={formatPercent(data.summary.conversion_rate)} subtitle="Clicks → Action" icon={<TrendingUp size={20} />} color="text-emerald-600" />
        <StatCard title="Click-Action Rate" value={formatPercent(data.summary.click_rate)} subtitle="Appearance → Click" icon={<BarChart3 size={20} />} />
      </div>

      {/* FUNNEL VISUALIZATION */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        
        <div className="xl:col-span-2 bg-white border border-gray-100 rounded-[48px] p-12 shadow-sm relative overflow-hidden group">
           <div className="flex items-center space-x-3 mb-12">
              <div className="p-3 bg-gray-50 rounded-2xl border border-gray-100 text-gray-900">
                 <BarChart3 size={24} />
              </div>
              <h3 className="text-xl font-black uppercase tracking-widest italic">Discovery Funnel</h3>
           </div>

           <div className="flex flex-col md:flex-row items-center justify-between gap-12 relative">
              <FunnelStep label="Appearances" value={data.funnel.appearances} color="bg-gray-100" textColor="text-gray-400" />
              <ArrowRight className="hidden md:block text-gray-200" size={32} />
              <FunnelStep label="Clicks" value={data.funnel.clicks} color="bg-blue-50" textColor="text-blue-600" />
              <ArrowRight className="hidden md:block text-gray-200" size={32} />
              <FunnelStep label="Conversions" value={data.funnel.conversions} color="bg-emerald-500" textColor="text-white" highlight />
           </div>

           <div className="mt-16 pt-8 border-t border-gray-50 flex items-center justify-between">
              <p className="text-[10px] font-black text-gray-300 uppercase tracking-widest italic">
                Verified Engine Activity Data • Updated in Real-Time
              </p>
           </div>
        </div>

        {/* ACTION BREAKDOWN */}
        <div className="bg-gray-900 rounded-[48px] p-10 text-white shadow-2xl relative overflow-hidden group">
           <div className="relative z-10 space-y-8">
              <div className="space-y-2">
                 <h4 className="text-[10px] font-black text-gray-500 uppercase tracking-[0.2em]">Action Composition</h4>
                 <h3 className="text-2xl font-black italic tracking-tighter">Engagement Mix</h3>
              </div>
              
              <div className="space-y-4">
                 <ActionItem label="Call Requests" count={data.summary.actions.calls} icon={<PhoneCall size={16} />} />
                 <ActionItem label="Directions" count={data.summary.actions.directions} icon={<MapPin size={16} />} />
                 <ActionItem label="Direct Bookings" count={data.summary.actions.bookings} icon={<CalendarCheck size={16} />} />
              </div>

              <div className="pt-8 block text-center">
                 <div className="px-6 py-4 bg-white/5 border border-white/10 rounded-3xl">
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1 italic">Optimization Tip</p>
                    <p className="text-[11px] font-medium text-white/80">
                      Conversion depends on your business quality. Keep your profile data fresh to maintain trust.
                    </p>
                 </div>
              </div>
           </div>
        </div>

      </div>

    </div>
  )
}

function StatCard({ title, value, subtitle, icon, color }: any) {
  return (
    <div className="bg-white border border-gray-100 p-8 rounded-[40px] shadow-sm group hover:shadow-xl transition-all duration-500">
      <div className="w-12 h-12 bg-gray-50 rounded-2xl flex items-center justify-center text-gray-400 mb-6 group-hover:text-gray-900 transition-colors">
        {icon}
      </div>
      <div className="space-y-1">
        <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{title}</h4>
        <div className={`text-4xl font-black italic tracking-tighter ${color || 'text-gray-900'}`}>{value}</div>
        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-tight pt-2">{subtitle}</p>
      </div>
    </div>
  )
}

function FunnelStep({ label, value, color, textColor, highlight }: any) {
  return (
    <div className="flex-1 w-full text-center space-y-4">
       <div className={`w-full h-32 rounded-[32px] ${color} flex flex-col items-center justify-center p-6 transition-transform group-hover:scale-105 duration-700 shadow-sm`}>
          <span className={`text-3xl font-black italic tracking-tighter ${textColor}`}>{value}</span>
       </div>
       <span className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] italic">{label}</span>
    </div>
  )
}

function ActionItem({ label, count, icon }: any) {
  return (
    <div className="flex items-center justify-between p-4 bg-white/5 border border-white/10 rounded-2xl hover:bg-white/10 transition-colors">
       <div className="flex items-center space-x-3 text-gray-400">
          {icon}
          <span className="text-[10px] font-black uppercase tracking-widest">{label}</span>
       </div>
       <span className="text-xl font-black italic tracking-tighter">{count}</span>
    </div>
  )
}
