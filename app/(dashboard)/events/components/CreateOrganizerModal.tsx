'use client'

import { useState } from 'react'
import { X, Users, CheckCircle, AlertCircle } from 'lucide-react'
import { eventsApi } from '@/lib/api'

export default function CreateOrganizerModal({ organizationId, onClose, onSuccess }: { organizationId: string, onClose: () => void, onSuccess: () => void }) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    contact: '',
    address: ''
  })

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError(null)
    try {
      const res = await eventsApi.createOrganizer(formData)
      if (res.success) {
        onSuccess()
      } else {
        throw new Error(res.error || 'Failed to create organizer')
      }
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[200] flex items-center justify-center p-4 animate-in fade-in duration-300">
      <div className="bg-white rounded-[40px] w-full max-w-lg shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300">
        <div className="p-8 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
          <div className="flex items-center space-x-3">
             <div className="p-3 bg-red-500 text-white rounded-2xl shadow-lg shadow-red-500/20">
                <Users size={20} />
             </div>
             <div>
                <h2 className="text-xl font-black text-gray-900 italic tracking-tighter">Register Organizer.</h2>
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest leading-none">New operational resource identity</p>
             </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-white rounded-full transition-colors text-gray-400"><X size={20} /></button>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-6">
          {error && (
            <div className="p-4 bg-red-50 border border-red-100 rounded-2xl flex items-center space-x-2 text-[10px] font-black uppercase text-red-600 italic">
               <AlertCircle size={14} />
               <span>{error}</span>
            </div>
          )}

          <div className="space-y-4">
            <div className="space-y-1">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest pl-1">Legal / Trade Name</label>
              <input
                required
                className="w-full px-5 py-4 bg-gray-50 border border-gray-100 rounded-2xl text-sm font-bold focus:ring-4 focus:ring-red-500/5 outline-none transition-all focus:bg-white focus:border-red-500"
                placeholder="e.g. Sandy Beach Resort"
                value={formData.name}
                onChange={e => setFormData({...formData, name: e.target.value})}
              />
            </div>
            
            <div className="space-y-1">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest pl-1">Description (Optional)</label>
              <textarea
                className="w-full px-5 py-4 bg-gray-50 border border-gray-100 rounded-2xl text-sm font-bold focus:ring-4 focus:ring-red-500/5 outline-none transition-all focus:bg-white focus:border-red-500 h-24 resize-none"
                placeholder="Brief operational history..."
                value={formData.description}
                onChange={e => setFormData({...formData, description: e.target.value})}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
               <div className="space-y-1">
                 <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest pl-1">Contact Info</label>
                 <input
                   className="w-full px-5 py-4 bg-gray-50 border border-gray-100 rounded-2xl text-[11px] font-bold focus:ring-4 focus:ring-red-500/5 outline-none transition-all focus:bg-white focus:border-red-500"
                   placeholder="Phone / Email"
                   value={formData.contact}
                   onChange={e => setFormData({...formData, contact: e.target.value})}
                 />
               </div>
               <div className="space-y-1">
                 <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest pl-1">Primary Address</label>
                 <input
                   className="w-full px-5 py-4 bg-gray-50 border border-gray-100 rounded-2xl text-[11px] font-bold focus:ring-4 focus:ring-red-500/5 outline-none transition-all focus:bg-white focus:border-red-500"
                   placeholder="Physical Location"
                   value={formData.address}
                   onChange={e => setFormData({...formData, address: e.target.value})}
                 />
               </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-5 bg-black text-white rounded-[24px] text-[11px] font-black uppercase tracking-[0.2em] shadow-xl hover:bg-red-500 transition-all flex items-center justify-center group disabled:opacity-50"
          >
             {loading ? <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" /> : (
               <>
                 <span>Finalise Identity Registration</span>
                 <CheckCircle size={16} className="ml-3 group-hover:scale-110 transition-transform" />
               </>
             )}
          </button>
        </form>
      </div>
    </div>
  )
}
