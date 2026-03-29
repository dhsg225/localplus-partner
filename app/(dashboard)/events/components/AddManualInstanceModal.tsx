'use client'

import { useState } from 'react'
import { X, Calendar, Clock, Loader2, PlusCircle, AlertCircle } from 'lucide-react'
import { eventsApi } from '@/lib/api'

interface AddManualInstanceModalProps {
  eventId: string
  eventTitle: string
  onClose: () => void
  onCreated: (newInstance: any) => void
}

export default function AddManualInstanceModal({ eventId, eventTitle, onClose, onCreated }: AddManualInstanceModalProps) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const [startTime, setStartTime] = useState('')
  const [endTime, setEndTime] = useState('')
  const [maxCapacity, setMaxCapacity] = useState<number | ''>('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      const payload = {
        eventId,
        start_time: new Date(startTime).toISOString(),
        end_time: new Date(endTime).toISOString(),
        ...(maxCapacity && { max_capacity: parseInt(String(maxCapacity)) })
      }

      const res = await eventsApi.createInstance(payload)

      if (res.success) {
        onCreated(res.data)
        onClose()
      } else {
        throw new Error(res.error || 'Engine rejected manual instance creation.')
      }
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center bg-black/40 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-[40px] shadow-2xl max-w-lg w-full overflow-hidden flex flex-col border border-gray-100">
        {/* Header */}
        <div className="p-8 border-b border-gray-100 bg-gray-50/50 flex justify-between items-center">
          <div>
            <h2 className="text-xl font-black text-gray-900 italic tracking-tighter">New Special Instance.</h2>
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1">Manual Operational Extension for: {eventTitle}</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-white rounded-full transition-colors text-gray-400 border border-transparent hover:border-gray-100">
            <X size={20} />
          </button>
        </div>

        {/* Body */}
        <form onSubmit={handleSubmit} className="p-8 space-y-6">
          {error && (
            <div className="p-4 bg-red-50 border border-red-100 rounded-2xl flex items-center space-x-3 text-red-700 animate-in slide-in-from-top-2">
              <AlertCircle size={16} className="shrink-0" />
              <p className="text-[10px] font-black uppercase tracking-tight italic">{error}</p>
            </div>
          )}

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest pl-1">Start Time</label>
              <input 
                required
                type="datetime-local" 
                value={startTime}
                onChange={e => setStartTime(e.target.value)}
                className="w-full px-4 py-3 bg-gray-50 border-2 border-transparent focus:border-red-500 focus:bg-white rounded-2xl outline-none transition-all text-sm font-bold shadow-inner"
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest pl-1">End Time</label>
              <input 
                required
                type="datetime-local" 
                value={endTime}
                onChange={e => setEndTime(e.target.value)}
                className="w-full px-4 py-3 bg-gray-50 border-2 border-transparent focus:border-red-500 focus:bg-white rounded-2xl outline-none transition-all text-sm font-bold shadow-inner"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest pl-1">Custom Capacity (Optional Override)</label>
            <input 
              type="number" 
              placeholder="Defaults to Strategic Strategy..."
              value={maxCapacity}
              onChange={e => setMaxCapacity(e.target.value ? parseInt(e.target.value) : '')}
              className="w-full px-6 py-4 bg-gray-50 border-2 border-transparent focus:border-red-500 focus:bg-white rounded-2xl outline-none transition-all text-sm font-bold shadow-inner"
            />
          </div>

          <p className="text-[9px] font-medium text-gray-400 italic">This instance will be flagged as [Manual]. It will not be affected by changes to the parent recurrence rules.</p>
        </form>

        {/* Footer */}
        <div className="p-8 border-t border-gray-100 bg-gray-50 flex justify-end space-x-3">
          <button 
            type="button"
            onClick={onClose}
            className="px-6 py-3 text-[10px] font-black uppercase tracking-widest text-gray-400 hover:text-gray-900 transition-colors"
          >
            Discard
          </button>
          <button 
            onClick={handleSubmit}
            disabled={loading}
            className="px-8 py-4 bg-gray-900 text-white rounded-2xl text-[11px] font-black uppercase tracking-widest shadow-xl hover:bg-black hover:scale-105 active:scale-95 transition-all flex items-center space-x-2"
          >
            {loading ? (
              <Loader2 className="animate-spin" size={16} />
            ) : (
              <>
                <PlusCircle size={16} />
                <span>Inject Manual Instance →</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  )
}
