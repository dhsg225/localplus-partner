"use client"

import { useState, useEffect, useMemo } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { 
  Building2, 
  MapPin, 
  UtensilsCrossed, 
  CheckCircle2, 
  Clock, 
  DollarSign, 
  Save, 
  AlertCircle,
  Zap,
  ChevronRight,
  Info
} from "lucide-react"
import { entitiesApi } from "@/lib/api"
import { useRouter } from "next/navigation"

interface Category {
  id: string
  name: string
  description?: string
}

interface BusinessProfileFormProps {
  businessId: string | null
  cuisines: Category[]
  features: Category[]
  initialProfile: any
}

export default function BusinessProfileForm({ 
  businessId, 
  cuisines, 
  features, 
  initialProfile 
}: BusinessProfileFormProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  // Form State
  const [formData, setFormData] = useState({
    name: initialProfile?.name || "",
    location_area: initialProfile?.location_area || "",
    latitude: initialProfile?.latitude || "",
    longitude: initialProfile?.longitude || "",
    selectedCuisines: initialProfile?.cuisines || [],
    selectedFeatures: initialProfile?.features || [],
    price_range: initialProfile?.price_range || "medium",
    hours: initialProfile?.hours || {
      monday: "09:00 - 21:00",
      tuesday: "09:00 - 21:00",
      wednesday: "09:00 - 21:00",
      thursday: "09:00 - 21:00",
      friday: "09:00 - 22:00",
      saturday: "10:00 - 22:00",
      sunday: "10:00 - 21:00",
    }
  })

  // Completeness Calculation
  const completeness = useMemo(() => {
    const fields = [
      formData.name,
      formData.location_area,
      formData.selectedCuisines.length > 0,
      formData.selectedFeatures.length > 0,
      formData.price_range,
    ]
    const filled = fields.filter(Boolean).length
    return Math.round((filled / fields.length) * 100)
  }, [formData])

  const handleToggleCategory = (type: 'cuisine' | 'feature', id: string) => {
    const field = type === 'cuisine' ? 'selectedCuisines' : 'selectedFeatures'
    setFormData(prev => ({
      ...prev,
      [field]: prev[field].includes(id) 
        ? prev[field].filter((item: string) => item !== id)
        : [...prev[field], id]
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setSuccess(false)

    // Validation
    if (formData.selectedCuisines.length === 0) {
      setError("Please select at least one cuisine type.")
      return
    }
    if (formData.selectedFeatures.length === 0) {
      setError("Please select at least one feature.")
      return
    }

    setLoading(true)
    try {
      const payload = {
        entity_id: businessId,
        is_partner: true,
        source: "partner",
        cuisine: formData.selectedCuisines,
        features: formData.selectedFeatures,
        hours: formData.hours,
        price_range: formData.price_range,
        location_area: formData.location_area,
        latitude: parseFloat(formData.latitude) || null,
        longitude: parseFloat(formData.longitude) || null,
        name: formData.name
      }

      const res = await entitiesApi.upsertProfile(payload)
      if (res.success) {
        setSuccess(true)
        setTimeout(() => setSuccess(false), 3000)
        router.refresh()
      }
    } catch (err: any) {
      setError(err.message || "Failed to save profile.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      
      {/* STATUS RADAR */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
        <div className="bg-white/60 backdrop-blur-xl border border-white p-6 rounded-[32px] shadow-sm flex items-center space-x-6">
          <div className="relative w-20 h-20">
             <svg className="w-full h-full transform -rotate-90">
                <circle cx="40" cy="40" r="36" stroke="currentColor" strokeWidth="8" fill="transparent" className="text-gray-100" />
                <motion.circle 
                  cx="40" cy="40" r="36" stroke="currentColor" strokeWidth="8" fill="transparent" 
                  strokeDasharray={226}
                  initial={{ strokeDashoffset: 226 }}
                  animate={{ strokeDashoffset: 226 - (226 * completeness) / 100 }}
                  transition={{ duration: 1.5, ease: "easeOut" }}
                  className="text-blue-600"
                />
             </svg>
             <div className="absolute inset-0 flex items-center justify-center font-black text-xl italic tracking-tighter">
                {completeness}%
             </div>
          </div>
          <div>
            <h4 className="text-sm font-black text-gray-900 uppercase tracking-widest leading-none mb-1">Profile Completeness</h4>
            <p className="text-[10px] font-medium text-gray-400 max-w-[200px]">Canonical data coverage for the Answer Engine discovery path.</p>
          </div>
        </div>

        <div className="bg-gray-900 border border-gray-800 p-6 rounded-[32px] shadow-2xl flex items-center space-x-6 relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-4 opacity-10">
            <Zap className="text-red-500" size={64} />
          </div>
          <div className="w-16 h-16 rounded-2xl bg-red-500/10 border border-red-500/20 flex items-center justify-center text-red-500 shadow-[0_0_20px_rgba(239,68,68,0.2)]">
            <Zap size={24} fill="currentColor" />
          </div>
          <div>
            <h4 className="text-sm font-black text-white uppercase tracking-widest leading-none mb-1">Data Quality Index</h4>
            <div className="flex items-center space-x-2 mt-2">
               <div className="h-1.5 w-32 bg-gray-800 rounded-full overflow-hidden">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: "85%" }}
                    className="h-full bg-gradient-to-r from-red-500 to-orange-400"
                  />
               </div>
               <span className="text-[10px] font-black text-red-400 italic">8.5/10 HIGH</span>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          
          {/* SECTION 1: BASIC INFO */}
          <Section title="Basic Entity Identity" icon={<Building2 size={18} />}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] ml-1">Business Name</label>
                <input 
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  readOnly={!!initialProfile?.name}
                  placeholder="e.g. Shannon's Coastal Kitchen"
                  className={`w-full px-5 py-4 bg-gray-50 border border-gray-100 rounded-2xl text-sm font-black tracking-tight outline-none focus:border-blue-500 transition-all ${initialProfile?.name ? 'opacity-60 cursor-not-allowed' : ''}`}
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] ml-1">Location Area</label>
                <input 
                  type="text"
                  value={formData.location_area}
                  onChange={(e) => setFormData(prev => ({ ...prev, location_area: e.target.value }))}
                  placeholder="e.g. Khao Takiab, Hua Hin"
                  className="w-full px-5 py-4 bg-gray-50 border border-gray-100 rounded-2xl text-sm font-black tracking-tight outline-none focus:border-blue-500 transition-all"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] ml-1">Latitude</label>
                <input 
                  type="text"
                  value={formData.latitude}
                  onChange={(e) => setFormData(prev => ({ ...prev, latitude: e.target.value }))}
                  placeholder="12.12345"
                  className="w-full px-5 py-4 bg-gray-50 border border-gray-100 rounded-2xl text-sm font-mono outline-none focus:border-blue-500 transition-all"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] ml-1">Longitude</label>
                <input 
                  type="text"
                  value={formData.longitude}
                  onChange={(e) => setFormData(prev => ({ ...prev, longitude: e.target.value }))}
                  placeholder="100.12345"
                  className="w-full px-5 py-4 bg-gray-50 border border-gray-100 rounded-2xl text-sm font-mono outline-none focus:border-blue-500 transition-all"
                />
              </div>
            </div>
          </Section>

          {/* SECTION 2: CUISINE */}
          <Section title="Cuisine Classification" icon={<UtensilsCrossed size={18} />}>
            <div className="flex flex-wrap gap-3">
              {cuisines.map((c) => (
                <button
                  key={c.id}
                  type="button"
                  onClick={() => handleToggleCategory('cuisine', c.id)}
                  className={`px-5 py-2.5 rounded-full text-[11px] font-black uppercase tracking-widest border transition-all active:scale-95 ${
                    formData.selectedCuisines.includes(c.id)
                      ? "bg-blue-600 border-blue-600 text-white shadow-xl shadow-blue-500/20"
                      : "bg-white border-gray-100 text-gray-500 hover:border-gray-300"
                  }`}
                >
                  {c.name}
                </button>
              ))}
              {cuisines.length === 0 && (
                <p className="text-xs text-gray-400 italic">Fetching canonical cuisines from engine...</p>
              )}
            </div>
          </Section>

          {/* SECTION 3: FEATURES */}
          <Section title="Operational Features & Vibe" icon={<CheckCircle2 size={18} />}>
            <div className="flex flex-wrap gap-3">
              {features.map((f) => (
                <button
                  key={f.id}
                  type="button"
                  onClick={() => handleToggleCategory('feature', f.id)}
                  className={`px-5 py-2.5 rounded-full text-[11px] font-black uppercase tracking-widest border transition-all active:scale-95 ${
                    formData.selectedFeatures.includes(f.id)
                      ? "bg-emerald-600 border-emerald-600 text-white shadow-xl shadow-emerald-500/20"
                      : "bg-white border-gray-100 text-gray-500 hover:border-gray-300"
                  }`}
                >
                  {f.name}
                </button>
              ))}
              {features.length === 0 && (
                <p className="text-xs text-gray-400 italic">Loading engine features...</p>
              )}
            </div>
          </Section>

        </div>

        <div className="space-y-8">
          
          {/* SECTION 4: OPERATING DATA */}
          <Section title="Price & Schedule" icon={<DollarSign size={18} />}>
            <div className="space-y-6">
              <div className="space-y-3">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Price Range</label>
                <div className="flex bg-gray-100 p-1 rounded-2xl border border-gray-200">
                  {['low', 'medium', 'high'].map((range) => (
                    <button
                      key={range}
                      type="button"
                      onClick={() => setFormData(prev => ({ ...prev, price_range: range }))}
                      className={`flex-1 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                        formData.price_range === range 
                          ? "bg-white text-gray-900 shadow-sm" 
                          : "text-gray-400 hover:text-gray-600"
                      }`}
                    >
                      {range === 'low' ? '฿' : range === 'medium' ? '฿฿' : '฿฿฿'} {range}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-3">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Operating Hours</label>
                <div className="space-y-2 max-h-[300px] overflow-y-auto pr-2 scrollbar-hide">
                  {Object.entries(formData.hours).map(([day, val]) => (
                    <div key={day} className="flex items-center justify-between p-3 bg-white border border-gray-100 rounded-xl">
                      <span className="text-[10px] font-black uppercase text-gray-900 w-20">{day.slice(0, 3)}</span>
                      <input 
                        type="text" 
                        value={val as string} 
                        onChange={(e) => setFormData(prev => ({
                          ...prev,
                          hours: { ...prev.hours, [day]: e.target.value }
                        }))}
                        className="text-[10px] font-medium text-gray-500 text-right outline-none bg-transparent focus:text-blue-600"
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </Section>

          {/* ENGINE PREVIEW */}
          <div className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-[40px] p-8 text-white shadow-2xl relative overflow-hidden group">
             <div className="absolute top-0 right-0 p-6 opacity-20 transform rotate-12 transition-transform group-hover:rotate-0 duration-700">
                <UtensilsCrossed size={80} />
             </div>
             <div className="relative z-10">
                <div className="px-3 py-1 bg-white/20 rounded-full text-[8px] font-black uppercase tracking-widest mb-4 w-fit">Engine Preview</div>
                <h4 className="text-xl font-black italic tracking-tighter mb-4">How customers see you.</h4>
                
                <div className="space-y-4">
                   <div className="p-4 bg-white/10 rounded-2xl border border-white/10">
                      <p className="text-xs font-black italic mb-1">{formData.name || "Business Name"}</p>
                      <div className="flex flex-wrap gap-1.5 opacity-80">
                         {formData.selectedCuisines.slice(0, 2).map((id: string) => (
                           <span key={id} className="text-[8px] font-bold bg-white/10 px-2 py-0.5 rounded-md">
                             {cuisines.find(c => c.id === id)?.name}
                           </span>
                         ))}
                      </div>
                      <p className="text-[9px] mt-2 opacity-60 flex items-center gap-1">
                        <MapPin size={10} /> {formData.location_area || "Area Not Set"}
                      </p>
                   </div>
                   
                   <p className="text-[9px] leading-relaxed opacity-70">
                     "I'm looking for a <span className="text-white font-bold">{cuisines.find(c => c.id === formData.selectedCuisines[0])?.name || "special"}</span> spot 
                     near <span className="text-white font-bold">{formData.location_area || "you"}</span>..."
                   </p>
                </div>

                <button type="button" className="mt-6 flex items-center gap-2 text-[10px] font-black uppercase tracking-widest group/btn">
                  Open Discovery Simulator <ChevronRight size={14} className="group-hover/btn:translate-x-1 transition-transform" />
                </button>
             </div>
          </div>

        </div>
      </div>

      {/* ERROR / SUCCESS ALERTS */}
      <AnimatePresence>
        {error && (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="p-5 bg-red-50 border border-red-200 rounded-[24px] flex items-center space-x-4 text-red-600"
          >
            <AlertCircle size={20} />
            <p className="text-xs font-black uppercase tracking-widest">{error}</p>
          </motion.div>
        )}
        {success && (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="p-5 bg-emerald-50 border border-emerald-200 rounded-[24px] flex items-center space-x-4 text-emerald-600"
          >
            <CheckCircle2 size={20} />
            <p className="text-xs font-black uppercase tracking-widest">Entity Data Grounded Successfully.</p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* SAVE BUTTON */}
      <div className="pt-10 flex justify-end">
        <button
          type="submit"
          disabled={loading}
          className={`px-10 py-5 bg-gray-900 text-white rounded-[24px] text-xs font-black uppercase tracking-[0.2em] shadow-2xl flex items-center space-x-3 transition-all active:scale-95 ${loading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-blue-600 hover:shadow-blue-500/20'}`}
        >
          {loading ? (
            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          ) : (
            <Save size={18} />
          )}
          <span>{loading ? "Injecting Data..." : "Save Canonical Profile"}</span>
        </button>
      </div>

    </form>
  )
}

function Section({ title, icon, children }: { title: string, icon: React.ReactNode, children: React.ReactNode }) {
  return (
    <div className="bg-white border border-gray-100 rounded-[40px] p-8 shadow-sm space-y-6">
      <div className="flex items-center space-x-3 text-gray-900">
        <div className="p-2 bg-gray-50 rounded-xl border border-gray-100">
          {icon}
        </div>
        <h3 className="text-sm font-black uppercase tracking-[0.2em] italic">{title}</h3>
      </div>
      <div className="pt-2">
        {children}
      </div>
    </div>
  )
}
