"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Search, MapPin, Zap, ChevronRight, Loader2, Sparkles, Building2, Phone, Compass, Calendar } from "lucide-react"
import { searchApi } from "@/lib/api"

export default function SearchUI() {
  const [query, setQuery] = useState("")
  const [loading, setLoading] = useState(false)
  const [results, setResults] = useState<any[]>([])
  const [hasSearched, setHasSearched] = useState(false)
  const [sessionId, setSessionId] = useState("")

  useEffect(() => {
    let sid = localStorage.getItem("lp_search_session")
    if (!sid) {
      sid = crypto.randomUUID()
      localStorage.setItem("lp_search_session", sid)
    }
    setSessionId(sid)
  }, [])

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!query.trim()) return

    setLoading(true)
    setHasSearched(true)
    try {
      const res = await searchApi.query(query, sessionId)
      setResults(res.results || [])
    } catch (e) {
      console.error("Search failed:", e)
      setResults([])
    } finally {
      setLoading(false)
    }
  }

  const handleResultClick = (entityId: string) => {
    searchApi.trackClick(entityId, sessionId)
  }

  const handleAction = (entityId: string, action: string) => {
    searchApi.trackAction(entityId, sessionId, action)
    // Simple alert or feedback
    alert(`${action.toUpperCase()} intent captured.`)
  }

  return (
    <div className="max-w-3xl mx-auto px-6 pt-20 pb-40">
      
      {/* HEADER */}
      <div className="text-center mb-12">
        <div className="inline-flex items-center space-x-2 px-3 py-1 bg-gray-50 rounded-full border border-gray-100 mb-6">
           <div className="bg-red-600 w-2 h-2 rounded-full animate-pulse" />
           <span className="text-[10px] font-black uppercase tracking-widest text-gray-400 italic">Live Local Discovery</span>
        </div>
        <h1 className="text-5xl font-black italic tracking-tighter text-gray-900 mb-4">Hua Hin Discover.</h1>
        <p className="text-sm font-medium text-gray-400 uppercase tracking-[0.2em]">The Answer Engine for Soi 94 & Beyond</p>
      </div>

      {/* SEARCH BAR */}
      <form onSubmit={handleSearch} className="relative group mb-12">
        <div className="absolute inset-x-0 -bottom-2 h-20 bg-gray-900/5 blur-3xl rounded-[40px] opacity-0 group-hover:opacity-100 transition-opacity" />
        <div className="relative">
          <input 
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="I'm looking for a quiet spot for coffee with fast wifi..."
            className="w-full h-20 pl-8 pr-24 bg-white border-2 border-gray-100 rounded-[32px] text-lg font-black italic tracking-tight shadow-xl shadow-gray-200/20 outline-none focus:border-red-500 transition-all placeholder:text-gray-300"
          />
          <button 
            type="submit"
            disabled={loading}
            className="absolute right-3 top-3 bottom-3 px-8 bg-gray-900 text-white rounded-[24px] flex items-center justify-center hover:bg-red-600 active:scale-95 transition-all shadow-lg"
          >
            {loading ? <Loader2 className="animate-spin" size={24} /> : <Search size={24} />}
          </button>
        </div>
      </form>

      {/* RESULTS AREA */}
      <div className="space-y-6">
        <AnimatePresence mode="wait">
          {loading ? (
             <motion.div 
               key="loading"
               initial={{ opacity: 0 }}
               animate={{ opacity: 1 }}
               exit={{ opacity: 0 }}
               className="py-20 flex flex-col items-center space-y-4"
             >
                <div className="w-12 h-12 border-4 border-gray-100 border-t-red-600 rounded-full animate-spin" />
                <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 italic">Asking the Answer Engine...</p>
             </motion.div>
          ) : results.length > 0 ? (
             <motion.div 
               key="results"
               initial={{ opacity: 0, y: 20 }}
               animate={{ opacity: 1, y: 0 }}
               className="grid grid-cols-1 gap-6"
             >
                {results.map((result, idx) => (
                  <ResultCard 
                    key={result.id || idx} 
                    result={result} 
                    onClick={() => handleResultClick(result.id)}
                    onAction={(action) => handleAction(result.id, action)}
                  />
                ))}
             </motion.div>
          ) : hasSearched ? (
             <motion.div 
               key="empty"
               initial={{ opacity: 0 }}
               animate={{ opacity: 1 }}
               className="py-20 text-center"
             >
                <div className="w-16 h-16 bg-gray-50 rounded-[24px] flex items-center justify-center mx-auto mb-6 text-gray-200">
                   <MapPin size={32} />
                </div>
                <h3 className="text-xl font-black italic text-gray-900 mb-2">No Grounded Matches.</h3>
                <p className="text-sm font-medium text-gray-400">Try broadening your search or choosing a specific intent.</p>
                <div className="mt-8 flex flex-wrap justify-center gap-3">
                   {["Breakfast Hua Hin", "Late night bars", "Co-working spaces"].map(suggestion => (
                     <button 
                       key={suggestion}
                       onClick={() => { setQuery(suggestion); setHasSearched(false); }}
                       className="px-5 py-2.5 bg-gray-50 border border-gray-100 rounded-full text-[10px] font-black uppercase tracking-widest text-gray-500 hover:border-gray-300 transition-all"
                     >
                       {suggestion}
                     </button>
                   ))}
                </div>
             </motion.div>
          ) : null}
        </AnimatePresence>
      </div>
    </div>
  )
}

function ResultCard({ result, onClick, onAction }: { result: any, onClick: () => void, onAction: (a: string) => void }) {
  // Mapping AE result fields
  const name = result.name || result.text || "Untitled Location"
  const matchReason = result.match_reason || result.reason || "Matched via intent similarity"
  const isPromoted = result.disclosure?.is_promoted || false

  return (
    <motion.div 
      whileHover={{ y: -4 }}
      className="bg-white border border-gray-100 p-8 rounded-[40px] shadow-sm hover:shadow-2xl hover:shadow-gray-200/50 transition-all group overflow-hidden relative"
    >
      <div className="flex items-start justify-between gap-6">
        <div className="flex-1 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <h3 className="text-2xl font-black italic tracking-tighter text-gray-900 transition-colors group-hover:text-red-600">
                {name}
              </h3>
              {isPromoted && (
                <div className="group/promo relative">
                  <div className="px-3 py-1 bg-amber-500/10 text-amber-600 border border-amber-500/20 rounded-full text-[8px] font-black uppercase tracking-widest flex items-center gap-1">
                    <Zap size={8} fill="currentColor" />
                    Promoted
                  </div>
                </div>
              )}
            </div>
            
            <div className="flex items-center space-x-2">
               <ActionButton icon={<Phone size={14} />} onClick={() => onAction('call')} label="Call" />
               <ActionButton icon={<Compass size={14} />} onClick={() => onAction('directions')} label="Map" />
               <ActionButton icon={<Calendar size={14} />} onClick={() => onAction('book')} label="Book" />
            </div>
          </div>

          <p className="text-xs font-medium text-gray-500 leading-relaxed max-w-xl italic">
            <span className="text-blue-600 mr-2">Why this match:</span>
            {matchReason}
          </p>

          <div className="flex flex-wrap gap-2 pt-2">
             <span className="px-3 py-1 bg-gray-50 text-[9px] font-black uppercase tracking-widest text-gray-400 rounded-lg">Verified Grounding</span>
             <span className="px-3 py-1 bg-gray-50 text-[9px] font-black uppercase tracking-widest text-gray-400 rounded-lg">High Trust</span>
          </div>
        </div>

        <a 
          href="#" 
          onClick={(e) => { e.preventDefault(); onClick(); }}
          className="w-14 h-14 bg-gray-900 group-hover:bg-red-600 text-white rounded-2xl flex items-center justify-center shadow-lg transition-all active:scale-95"
        >
          <ChevronRight size={24} />
        </a>
      </div>
    </motion.div>
  )
}

function ActionButton({ icon, onClick, label }: any) {
  return (
    <button 
      onClick={(e) => { e.stopPropagation(); onClick(); }}
      className="p-3 bg-gray-50 hover:bg-red-50 hover:text-red-600 rounded-xl border border-gray-100 transition-all flex items-center space-x-2 grayscale hover:grayscale-0"
    >
      {icon}
      <span className="text-[8px] font-black uppercase tracking-widest hidden md:block">{label}</span>
    </button>
  )
}
