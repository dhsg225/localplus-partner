'use client'

import { useState, useEffect } from 'react'
import { X, Users, CheckCircle, Clock, Trash2, UserPlus, Loader2, AlertCircle } from 'lucide-react'
import { eventsApi } from '@/lib/api'

interface Registration {
  id: string
  user_id?: string
  status: string
  registered_at: string
  role: string
  profiles?: {
    full_name: string
    email: string
  }
}

interface RegistrationManagerProps {
  instanceId: string
  eventTitle: string
  onClose: () => void
}

export default function RegistrationManager({ instanceId, eventTitle, onClose }: RegistrationManagerProps) {
  const [registrations, setRegistrations] = useState<Registration[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [processingId, setProcessingId] = useState<string | null>(null)

  useEffect(() => {
    loadRegistrations()
  }, [instanceId])

  const loadRegistrations = async () => {
    setLoading(true)
    setError(null)
    try {
      const res = await eventsApi.getRegistrations(instanceId)
      if (res.success) {
        setRegistrations(res.data)
      } else {
        throw new Error(res.error || 'Failed to sync with local registry.')
      }
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleUpdateStatus = async (regId: string, newStatus: string) => {
    setProcessingId(regId)
    try {
      const res = await eventsApi.updateRegistration(regId, newStatus)
      if (res.success) {
        setRegistrations(prev => prev.map(r => r.id === regId ? { ...r, status: newStatus } : r))
      }
    } catch (err) {
      alert('Failed to update guest status on the ledger.')
    } finally {
      setProcessingId(null)
    }
  }

  return (
    <div className="fixed inset-0 z-[120] flex items-center justify-end bg-black/40 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="bg-white h-full w-full max-w-xl shadow-2xl flex flex-col animate-in slide-in-from-right duration-500 rounded-l-[48px] overflow-hidden">
        {/* Header */}
        <div className="p-10 bg-gray-50 border-b border-gray-100 flex justify-between items-start">
           <div>
             <h2 className="text-2xl font-black text-gray-900 italic tracking-tighter">Guest List & Check-in.</h2>
             <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1">Operational Instance Interface for: {eventTitle}</p>
           </div>
           <button onClick={onClose} className="p-3 hover:bg-white rounded-full transition-all text-gray-400 border border-transparent hover:border-gray-100">
             <X size={24} />
           </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-10 space-y-8">
           {loading ? (
             <div className="flex flex-col items-center justify-center py-20 animate-pulse">
                <Loader2 className="animate-spin text-gray-200 mb-4" size={48} />
                <p className="text-xs font-black text-gray-300 uppercase italic">Synchronizing Operational Ledger...</p>
             </div>
           ) : error ? (
             <div className="p-6 bg-red-50 border border-red-100 rounded-3xl text-red-700 flex items-center space-x-3">
                <AlertCircle size={20} />
                <p className="text-xs font-black uppercase tracking-tight italic">{error}</p>
             </div>
           ) : registrations.length === 0 ? (
             <div className="text-center py-32 space-y-4">
                <Users className="mx-auto text-gray-100" size={64} />
                <h3 className="text-sm font-black text-gray-300 uppercase tracking-widest">No registrations found.</h3>
                <p className="text-xs text-gray-400 italic">This operational slot is currently empty.</p>
                <button className="px-6 py-3 bg-gray-100 text-gray-900 rounded-full text-[10px] font-black uppercase tracking-widest hover:bg-gray-200 transition-all flex items-center space-x-2 mx-auto">
                   <UserPlus size={14} />
                   <span>Manual Check-in</span>
                </button>
             </div>
           ) : (
             <div className="space-y-4">
                {registrations.map((reg) => (
                  <div 
                    key={reg.id}
                    className="group bg-white rounded-3xl border border-gray-100 p-6 flex items-center justify-between hover:border-red-500/20 hover:shadow-xl hover:shadow-gray-200/50 transition-all"
                  >
                    <div className="flex items-center space-x-4">
                       <div className="w-12 h-12 rounded-full bg-gray-50 flex items-center justify-center text-gray-400 border border-gray-100 font-black italic">
                          {reg.profiles?.full_name?.charAt(0) || 'U'}
                       </div>
                       <div>
                          <h4 className="text-sm font-black text-gray-900">{reg.profiles?.full_name || 'Anonymous Guest'}</h4>
                          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{reg.profiles?.email || 'Walk-in Registration'}</p>
                       </div>
                    </div>

                    <div className="flex items-center space-x-3">
                       <select 
                         value={reg.status}
                         onChange={(e) => handleUpdateStatus(reg.id, e.target.value)}
                         disabled={processingId === reg.id}
                         className="bg-gray-50 border-none rounded-xl px-4 py-2 text-[10px] font-black uppercase tracking-widest outline-none focus:ring-2 focus:ring-red-500/10 transition-all appearance-none cursor-pointer"
                       >
                          <option value="pending">Pending</option>
                          <option value="confirmed">Confirmed</option>
                          <option value="seated">Seated</option>
                          <option value="completed">Completed</option>
                          <option value="cancelled">Cancelled</option>
                       </select>
                       
                       {reg.status === 'confirmed' && (
                         <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                       )}
                    </div>
                  </div>
                ))}
             </div>
           )}
        </div>

        {/* Footer */}
        <div className="p-10 border-t border-gray-100 bg-gray-50 flex items-center justify-between">
           <div className="flex items-center space-x-2 text-[10px] font-black text-gray-400 uppercase">
              <Clock size={14} />
              <span>Last Ledger Sync: Just Now</span>
           </div>
           <button className="px-8 py-4 bg-gray-900 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-xl hover:bg-black transition-all">
              Export Audit Trail
           </button>
        </div>
      </div>
    </div>
  )
}
