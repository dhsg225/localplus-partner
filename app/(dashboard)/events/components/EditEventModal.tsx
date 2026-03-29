'use client'

import { useState, useEffect } from 'react'
import { X, Calendar, Clock, Globe, Repeat, CheckCircle, AlertCircle, Loader2, Users } from 'lucide-react'
import { eventsApi, organizationApi } from '@/lib/api'
import { useRouter } from 'next/navigation'
import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

interface EditEventModalProps {
  organizationId: string
  event: any
  onClose: () => void
  onSuccess: () => void
}

export default function EditEventModal({ organizationId, event, onClose, onSuccess }: EditEventModalProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  // Form State
  const [title, setTitle] = useState(event?.title || '')
  const [startTime, setStartTime] = useState(event?.start_time ? new Date(event.start_time).toISOString().slice(0,16) : '')
  const [endTime, setEndTime] = useState(event?.end_time ? new Date(event.end_time).toISOString().slice(0,16) : '')
  const [status, setStatus] = useState(event?.status || 'published')
  const [isRecurring, setIsRecurring] = useState(event?.is_recurring || false)
  const [frequency, setFrequency] = useState('daily')
  const [interval, setInterval] = useState(1)
  const [byDay, setByDay] = useState<string[]>([]) // For weekly: ['mo', 'tu', ...]
  const [bymonthday, setByMonthDay] = useState<number[]>([]) // For monthly: [1, 15]

  // Advanced Assets
  const [maxParticipants, setMaxParticipants] = useState<number | ''>(event?.max_participants || 50)
  const [rsvpDeadlineHours, setRsvpDeadlineHours] = useState(event?.rsvp_deadline_hours || 24)
  const [categories, setCategories] = useState<string[]>(event?.categories || ['Social'])
  const [tags, setTags] = useState<string[]>(event?.tags || [])
  const [newTag, setNewTag] = useState('')

  // Selected Resources
  const [selectedVenue, setSelectedVenue] = useState<string>(event?.venue_id || '')
  const [selectedStaff, setSelectedStaff] = useState<string[]>([])
  
  // Loaded Context
  const [venues, setVenues] = useState<any[]>([])
  const [staff, setStaff] = useState<any[]>([])

  // UI Tabs
  const [activeTab, setActiveTab] = useState<'general' | 'temporal' | 'tickets' | 'resources'>('general')

  useEffect(() => {
    loadResources()
  }, [])

  const loadResources = async () => {
    try {
      const [vRes, sRes] = await Promise.all([
        organizationApi.getVenues(organizationId),
        organizationApi.getStaff(organizationId)
      ])
      if (vRes.success) setVenues(vRes.data)
      if (sRes.success) setStaff(sRes.data)
    } catch (err) {
      console.warn('Operational resource fetch failed.')
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      // 1. Prepare Atomic Payload for Event Engine v1.7.5
      const payload = {
        id: event.id,
        event: {
          title,
          organization_id: organizationId,
          start_time: new Date(startTime).toISOString(),
          end_time: new Date(endTime).toISOString(),
          status,
          is_recurring: isRecurring,
          timezone: 'Asia/Bangkok',
          max_participants: maxParticipants ? parseInt(String(maxParticipants)) : null,
          rsvp_deadline_hours: rsvpDeadlineHours,
          venue_id: selectedVenue || null,
          categories: categories,
          tags: tags
        },
        ...(isRecurring && {
          recurrence: {
            frequency,
            interval: parseInt(String(interval)),
            by_day: byDay,
            by_month_day: bymonthday
          }
        })
      }

      // 2. Transmit to Strategy Layer (v1.7.5 API)
      const res = await eventsApi.updateEvent(payload)

      if (res.success) {
        setSuccess(true)
        setTimeout(() => {
          onSuccess()
          router.refresh() // Trigger RSC revalidation for Instance-First dashboard
        }, 1500)
      } else {
        throw new Error(res.error || 'Failed to initialize safe-update engine transaction.')
      }

    } catch (err: any) {
      setError(err.message || 'Atomic transaction aborted. Check engine logs.')
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async () => {
    if (!confirm('Warning: This will perform a soft-delete on this strategy and wipe future temporal instances. Proceed?')) return
    setLoading(true)
    try {
      await eventsApi.deleteEvent(event.id)
      onClose()
      router.refresh()
    } catch (err: any) {
      setError('Deletion failed.')
      setLoading(false)
    }
  }

  if (success) {
    return (
      <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
        <div className="bg-white rounded-[40px] p-12 text-center max-w-sm w-full animate-in zoom-in-95 duration-200">
           <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-6">
             <CheckCircle className="text-green-500" size={40} />
           </div>
           <h2 className="text-xl font-black text-gray-900 mb-2 italic tracking-tighter">Engine Synchronized.</h2>
           <p className="text-sm font-medium text-gray-500">Temporal instances have been generated and pushed to the operational dashboard.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-md p-4 animate-in fade-in duration-300">
      <div className="bg-white rounded-[40px] shadow-2xl max-w-lg w-full overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-8 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
          <div>
            <h2 className="text-xl font-black text-gray-900 italic tracking-tighter">Strategic Execution Update.</h2>
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1">Executing Safe-Update (Wipe & Regenerate)</p>
          </div>
          <button onClick={onClose} className="p-3 hover:bg-white rounded-full transition-colors text-gray-400 hover:text-gray-900 border border-transparent hover:border-gray-100">
            <X size={20} />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-8 space-y-8">
          {error && (
            <div className="p-4 bg-red-50 border border-red-100 rounded-2xl flex items-center space-x-3 text-red-700 animate-in slide-in-from-top-2">
              <AlertCircle size={20} className="shrink-0" />
              <p className="text-xs font-black uppercase tracking-tight italic">{error}</p>
            </div>
          )}

          {/* Navigation Matrix */}
          <div className="flex bg-gray-50 p-1 rounded-2xl border border-gray-100">
             {['general', 'temporal', 'tickets', 'resources'].map(tab => (
               <button 
                 key={tab}
                 type="button"
                 onClick={() => setActiveTab(tab as any)}
                 className={cn(
                   "flex-1 px-4 py-2 text-[10px] font-black uppercase tracking-widest rounded-xl transition-all",
                   activeTab === tab ? "bg-white text-red-500 shadow-sm" : "text-gray-400 hover:text-gray-600"
                 )}
               >
                 {tab === 'resources' ? 'Staff/Venue' : tab}
               </button>
             ))}
          </div>

          {activeTab === 'general' && (
            <div className="space-y-8 animate-in fade-in slide-in-from-top-4 duration-300">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest pl-1">Event Title</label>
              <input 
                required
                type="text" 
                value={title}
                onChange={e => setTitle(e.target.value)}
                placeholder="The Saturday Night Gala."
                className="w-full px-6 py-4 bg-gray-50 border-2 border-transparent focus:border-red-500 focus:bg-white rounded-2xl outline-none transition-all text-sm font-bold shadow-inner"
              />
            </div>

            <div className="grid grid-cols-2 gap-4 pt-2">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest pl-1">Strategy State</label>
                <select 
                  value={status}
                  onChange={e => setStatus(e.target.value)}
                  className="w-full px-6 py-4 bg-gray-50 border-2 border-transparent focus:border-red-500 focus:bg-white rounded-2xl outline-none transition-all text-sm font-black italic shadow-inner appearance-none"
                >
                  <option value="published">Status: Published</option>
                  <option value="draft">Status: Draft (Strategy Only)</option>
                </select>
              </div>
              <div className="space-y-2">
                 <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest pl-1">Capacity Cap</label>
                 <input 
                   type="number"
                   value={maxParticipants}
                   onChange={e => setMaxParticipants(e.target.value ? parseInt(e.target.value) : '')}
                   placeholder="Max Guests..."
                   className="w-full px-6 py-4 bg-gray-50 border-2 border-transparent focus:border-red-500 focus:bg-white rounded-2xl outline-none transition-all text-sm font-bold shadow-inner"
                 />
              </div>
            </div>

            {/* Categorization Matrix */}
            <div className="space-y-4 pt-4 border-t border-gray-100">
               <div className="flex items-center justify-between">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest pl-1">Operational Tags</label>
                  <div className="flex space-x-1">
                    {categories.map(c => (
                       <span key={c} className="px-2 py-0.5 bg-red-500 text-white text-[8px] font-black uppercase rounded-lg">{c}</span>
                    ))}
                  </div>
               </div>
               <div className="flex space-x-2">
                  <input 
                    type="text" 
                    value={newTag}
                    onChange={e => setNewTag(e.target.value)}
                    onKeyDown={e => {
                      if (e.key === 'Enter' && newTag) {
                        e.preventDefault()
                        setTags(prev => [...prev, newTag])
                        setNewTag('')
                      }
                    }}
                    placeholder="Type tag and press Enter..."
                    className="flex-1 px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl text-xs font-bold outline-none"
                  />
                  <div className="flex flex-wrap gap-1 max-w-[150px]">
                    {tags.map(t => (
                      <span key={t} className="px-2 py-1 bg-gray-100 text-gray-500 text-[8px] font-bold rounded-lg border border-gray-200">{t}</span>
                    ))}
                  </div>
               </div>
            </div>
            </div>
          )}

          {activeTab === 'temporal' && (
            <div className="space-y-8 animate-in fade-in slide-in-from-top-4 duration-300">
               {/* Temporal Matrix */}
               <div className="p-6 bg-gray-50 rounded-[32px] border border-gray-100 space-y-6">
                 <h3 className="text-xs font-black text-gray-900 italic tracking-widest uppercase flex items-center space-x-2">
                   <Clock size={14} className="text-red-500" />
                   <span>Temporal Matrix</span>
                 </h3>

                 <div className="grid grid-cols-2 gap-4">
                   <div className="space-y-2">
                     <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Instance Start</label>
                     <input 
                       required
                       type="datetime-local" 
                       value={startTime}
                       onChange={e => setStartTime(e.target.value)}
                       className="w-full px-4 py-3 bg-white border border-gray-100 rounded-xl text-xs font-bold transition-all focus:ring-2 focus:ring-red-500/10 shadow-sm"
                     />
                   </div>
                   <div className="space-y-2">
                     <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Instance End</label>
                     <input 
                       required
                       type="datetime-local" 
                       value={endTime}
                       onChange={e => setEndTime(e.target.value)}
                       className="w-full px-4 py-3 bg-white border border-gray-100 rounded-xl text-xs font-bold transition-all focus:ring-2 focus:ring-red-500/10 shadow-sm"
                     />
                   </div>
                 </div>

                 {/* Recurrence Engine */}
                 <div className="pt-4 border-t border-gray-200/60">
                    <label className="flex items-center space-x-3 cursor-pointer group">
                      <div className="relative">
                        <input 
                          type="checkbox" 
                          className="sr-only peer" 
                          checked={isRecurring}
                          onChange={e => setIsRecurring(e.target.checked)}
                        />
                        <div className="w-10 h-6 bg-gray-200 rounded-full peer peer-checked:bg-red-500 transition-all shadow-inner" />
                        <div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full transition-transform peer-checked:translate-x-4 shadow-sm" />
                      </div>
                      <span className="text-xs font-bold uppercase tracking-widest text-gray-500 group-hover:text-gray-900 transition-colors">Enable Recurrence Engine</span>
                    </label>

                    {isRecurring && (
                      <div className="mt-6 p-6 bg-white rounded-2xl border border-gray-100 space-y-4 animate-in slide-in-from-top-4 duration-300">
                        <div className="flex items-center space-x-3 text-red-500 mb-2">
                          <Repeat size={14} />
                          <span className="text-[10px] font-black uppercase tracking-wider">Strategy: Automatic Expansion</span>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-4">
                           <div className="space-y-2">
                             <label className="text-[10px] font-bold text-gray-400 uppercase">Frequency</label>
                             <select 
                               value={frequency}
                               onChange={e => setFrequency(e.target.value)}
                               className="w-full p-3 bg-gray-50 border border-gray-100 rounded-xl text-xs font-bold outline-none"
                             >
                               <option value="daily">Daily</option>
                               <option value="weekly">Weekly</option>
                               <option value="monthly">Monthly</option>
                             </select>
                           </div>
                           <div className="space-y-2">
                             <label className="text-[10px] font-bold text-gray-400 uppercase">Interval (Every X)</label>
                             <input 
                               type="number" 
                               min="1"
                               value={interval}
                               onChange={e => setInterval(parseInt(e.target.value))}
                               className="w-full p-3 bg-gray-50 border border-gray-100 rounded-xl text-xs font-bold outline-none"
                             />
                           </div>
                        </div>

                        {frequency === 'weekly' && (
                          <div className="space-y-3 pt-2">
                             <label className="text-[9px] font-black text-gray-400 uppercase tracking-wide">Select Weekdays</label>
                             <div className="flex flex-wrap gap-2">
                               {['mo', 'tu', 'we', 'th', 'fr', 'sa', 'su'].map(day => (
                                 <button
                                   key={day}
                                   type="button"
                                   onClick={() => setByDay(prev => prev.includes(day) ? prev.filter(d => d !== day) : [...prev, day])}
                                   className={cn(
                                     "w-9 h-9 rounded-xl text-[10px] font-black uppercase transition-all flex items-center justify-center border-2",
                                     byDay.includes(day) ? "bg-red-500 border-red-500 text-white" : "bg-gray-50 border-gray-100 text-gray-400 hover:border-gray-200"
                                   )}
                                 >
                                   {day}
                                 </button>
                               ))}
                             </div>
                          </div>
                        )}
                        <p className="text-[9px] font-medium text-gray-400 italic">The engine will auto-expand this event into distinct operational instances for the next 3 months.</p>
                      </div>
                    )}
                 </div>
               </div>
            </div>
          )}

          {activeTab === 'tickets' && (
            <div className="space-y-8 animate-in fade-in slide-in-from-top-4 duration-300">
               <div className="p-8 bg-gray-900 rounded-[32px] border border-gray-800 text-center space-y-4">
                  <Globe className="mx-auto text-red-500" size={32} />
                  <h3 className="text-sm font-black text-white italic tracking-widest uppercase">Ticketing Engine [STUB]</h3>
                  <p className="text-[10px] font-medium text-gray-400 uppercase tracking-tighter leading-relaxed mx-auto max-w-[300px]">Strategic Ticketing Layer is currently in sandbox mode. Initialization requires separate merchant-ID synchronization.</p>
                  
                  <div className="pt-6 grid grid-cols-2 gap-3 opacity-50 cursor-not-allowed">
                     <div className="p-4 bg-white/5 border border-white/10 rounded-2xl text-left">
                        <span className="text-[9px] font-black text-gray-500 uppercase">TIER_1</span>
                        <p className="text-xs font-bold text-white mt-1">Free RSVP.</p>
                     </div>
                     <div className="p-4 bg-white/5 border border-white/10 rounded-2xl text-left">
                        <span className="text-[9px] font-black text-gray-500 uppercase">TIER_2</span>
                        <p className="text-xs font-bold text-white mt-1">Paid Sale.</p>
                     </div>
                  </div>
               </div>
            </div>
          )}

          {activeTab === 'resources' && (
            <div className="space-y-8 animate-in fade-in slide-in-from-top-4 duration-300">
               {/* Venue Assignment - ACTIVATED */}
               <div className="p-6 bg-gray-50 rounded-[32px] border border-gray-100 space-y-4">
                  <div className="flex items-center space-x-2 text-gray-900 mb-2">
                     <Globe size={16} className="text-red-500" />
                     <span className="text-xs font-black uppercase tracking-widest italic">Strategic Venue Choice.</span>
                  </div>
                  <select 
                    value={selectedVenue}
                    onChange={e => setSelectedVenue(e.target.value)}
                    className="w-full px-6 py-4 bg-white border border-gray-100 rounded-2xl text-xs font-bold text-gray-900 shadow-sm appearance-none outline-none focus:ring-2 focus:ring-red-500/10 transition-all"
                  >
                     <option value="">Global/Mobile Venue</option>
                     {venues.map(v => (
                        <option key={v.id} value={v.id}>{v.name} (Cap: {v.capacity})</option>
                     ))}
                  </select>
                  <p className="text-[9px] font-medium text-gray-400 italic pl-1">Venue-ID will be propagated to all child temporal instances for resource booking fidelity.</p>
               </div>

               {/* Staff Assignment - ACTIVATED */}
               <div className="p-6 bg-gray-900 rounded-[32px] border border-gray-800 space-y-4">
                  <div className="flex items-center space-x-2 text-white mb-2">
                     <Users size={16} className="text-red-500" />
                     <span className="text-xs font-black uppercase tracking-widest italic">Operational Team Roster.</span>
                  </div>
                  
                  <div className="space-y-2">
                     {staff.length > 0 ? staff.map(member => (
                        <button 
                          key={member.id}
                          type="button" 
                          onClick={() => setSelectedStaff(prev => prev.includes(member.id) ? prev.filter(id => id !== member.id) : [...prev, member.id])}
                          className={cn(
                             "w-full p-4 border rounded-2xl flex items-center justify-between transition-all",
                             selectedStaff.includes(member.id) 
                              ? "bg-red-500 border-red-500 text-white shadow-xl shadow-red-500/20" 
                              : "bg-white/5 border-white/10 text-gray-300 hover:bg-white/10"
                          )}
                        >
                           <span className="text-[10px] font-black uppercase italic">{member.name} — {member.role}</span>
                           <CheckCircle size={14} className={cn(!selectedStaff.includes(member.id) && "opacity-0")} />
                        </button>
                     )) : (
                        <div className="text-center py-6">
                           <p className="text-[9px] font-black text-gray-600 uppercase">Registry Empty. Initializing global roles.</p>
                        </div>
                     )}
                  </div>
               </div>
            </div>
          )}
        </form>

        {/* Footer */}
        <div className="p-8 border-t border-gray-100 bg-gray-50 flex flex-col space-y-4">
           <div className="flex items-center justify-between">
              <p className="text-[9px] font-medium text-gray-400 max-w-[200px]">By initializing, you verify that this strategy conforms to organizational guidelines. Manual overrides will be protected.</p>
              <div className="flex space-x-3">
                <button 
                  type="button"
                  onClick={onClose}
                  className="px-6 py-3 text-[10px] font-black uppercase tracking-widest text-gray-400 hover:text-gray-900 transition-colors"
                >
                  Discard
                </button>
                <button 
                  type="button"
                  onClick={handleSubmit}
                  disabled={loading}
                  className="px-8 py-4 bg-gray-900 text-white rounded-2xl text-[11px] font-black uppercase tracking-widest shadow-2xl hover:bg-black hover:scale-105 active:scale-95 transition-all flex items-center space-x-3"
                >
                  {loading ? (
                    <Loader2 className="animate-spin" size={16} />
                  ) : (
                    <>
                      <Calendar size={16} />
                      <span>Execute Safe-Update →</span>
                    </>
                  )}
                </button>
              </div>
           </div>
           
           <div className="pt-4 border-t border-gray-200">
              <button 
                type="button"
                onClick={handleDelete}
                disabled={loading}
                className="w-full px-6 py-4 bg-red-50 text-red-500 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-red-100 transition-all flex items-center justify-center space-x-2"
              >
                 <span>Wipe Strategy & Instances</span>
              </button>
           </div>
        </div>
      </div>
    </div>
  )
}
