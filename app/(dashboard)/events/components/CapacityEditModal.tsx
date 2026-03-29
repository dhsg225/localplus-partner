'use client'

import { useState } from 'react'
import { X, Users, AlertCircle, Loader2, Save } from 'lucide-react'
import { eventsApi } from '@/lib/api'

interface CapacityEditModalProps {
  instanceId: string
  currentRsvpCount: number
  currentMaxCapacity: number | null
  onClose: () => void
  onUpdate: (newMax: number) => void
}

export default function CapacityEditModal({ 
  instanceId, 
  currentRsvpCount, 
  currentMaxCapacity, 
  onClose, 
  onUpdate 
}: CapacityEditModalProps) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [newMax, setNewMax] = useState<number>(currentMaxCapacity || 0)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      if (newMax < currentRsvpCount) {
        throw new Error(`Instance has ${currentRsvpCount} registrants. Cannot reduce capacity below current utilization.`)
      }

      const res = await eventsApi.updateInstance({ 
        id: instanceId, 
        max_capacity: newMax 
      })

      if (res.success) {
        onUpdate(newMax)
        onClose()
      } else {
        throw new Error(res.error || 'Engine rejected capacity override.')
      }
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center bg-black/40 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-[40px] shadow-2xl max-w-sm w-full p-8 border border-gray-100 flex flex-col">
        {/* Header */}
        <div className="flex justify-between items-start mb-6">
          <div>
            <h2 className="text-xl font-black text-gray-900 italic tracking-tighter">Capacity Override.</h2>
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1">Instance-level Operational Adjustment</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-400">
            <X size={18} />
          </button>
        </div>

        {error && (
          <div className="p-4 bg-red-50 border border-red-100 rounded-2xl flex items-center space-x-3 text-red-700 mb-6 animate-in slide-in-from-top-2">
            <AlertCircle size={16} className="shrink-0" />
            <p className="text-[10px] font-black uppercase tracking-tight italic">{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="bg-gray-50 p-6 rounded-3xl border border-gray-100 space-y-4">
             <div className="flex justify-between items-center text-[11px] font-bold">
               <span className="text-gray-400 uppercase tracking-widest leading-none flex items-center gap-1.5"><Users size={12}/> Locked Utilization</span>
               <span className="text-gray-900">{currentRsvpCount} Guests</span>
             </div>
             
             <div className="space-y-2">
               <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest pl-1">Target Max Capacity</label>
               <input 
                 required
                 type="number" 
                 min={currentRsvpCount}
                 value={newMax}
                 onChange={e => setNewMax(parseInt(e.target.value))}
                 className="w-full px-6 py-4 bg-white border-2 border-transparent focus:border-red-500 rounded-2xl outline-none transition-all text-lg font-black italic shadow-inner"
               />
             </div>
          </div>

          <div className="flex space-x-3">
             <button 
               type="button"
               onClick={onClose}
               className="flex-1 py-4 text-[10px] font-black uppercase tracking-widest text-gray-400 hover:text-gray-900 transition-colors"
             >
               Cancel
             </button>
             <button 
               type="submit"
               disabled={loading}
               className="flex-1 py-4 bg-gray-900 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-xl hover:bg-black active:scale-95 transition-all flex items-center justify-center space-x-2"
             >
               {loading ? (
                 <Loader2 className="animate-spin" size={14} />
               ) : (
                 <>
                   <Save size={14} />
                   <span>Apply Override</span>
                 </>
               )}
             </button>
          </div>
        </form>
      </div>
    </div>
  )
}
