'use client'

import { useState, useEffect } from 'react'
import { 
  Search, 
  Filter, 
  Grid, 
  List, 
  RefreshCw, 
  Plus, 
  MoreHorizontal, 
  Calendar, 
  MapPin, 
  User, 
  Edit3, 
  Copy, 
  Trash2,
  CheckCircle,
  AlertCircle
} from 'lucide-react'
import { eventsApi } from '@/lib/api'
import { useRouter } from 'next/navigation'
import CreateEventModal from './CreateEventModal'
import EditEventModal from './EditEventModal'
import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export default function EventsDashboard({ 
  organizationId, 
  isSuperAdmin,
  initialEvents = []
}: { 
  organizationId: string, 
  isSuperAdmin: boolean,
  initialEvents?: any[] 
}) {
  const router = useRouter()
  const [events, setEvents] = useState<any[]>(initialEvents)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  
  // Dashboard Controls
  const [viewMode, setViewMode] = useState<'card' | 'list'>(isSuperAdmin ? 'list' : 'card')
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('')
  const [selectedEvents, setSelectedEvents] = useState<string[]>([])
  
  // Modals
  const [showCreate, setShowCreate] = useState(false)
  const [editingEvent, setEditingEvent] = useState<any>(null)

  const loadEvents = async () => {
    setLoading(true)
    setError(null)
    try {
      const res = await eventsApi.getEvents({
        businessId: !isSuperAdmin ? organizationId : undefined,
        status: statusFilter || undefined,
        eventType: categoryFilter || undefined,
        search: searchQuery || undefined
      })
      if (res.success) {
        setEvents(res.data)
      } else {
        throw new Error(res.error || 'Fetch failure')
      }
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  // Reload when filters change (ignoring search for debounce later)
  useEffect(() => {
    if (initialEvents.length === 0) loadEvents()
  }, [statusFilter, categoryFilter])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    loadEvents()
  }

  const toggleSelectAll = () => {
    if (selectedEvents.length === events.length) {
      setSelectedEvents([])
    } else {
      setSelectedEvents(events.map(e => e.id))
    }
  }

  const toggleSelect = (id: string) => {
    setSelectedEvents(prev => 
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    )
  }

  const handleDuplicate = async (eventId: string) => {
     // Implement duplication logic (client-side modal open with prefetched data)
     try {
       const res = await eventsApi.getEvent(eventId)
       if (res.success) {
         setEditingEvent({ ...res.data, id: undefined, title: `${res.data.title} (Copy)` })
       }
     } catch (err) {
       alert("Duplication engine failure.")
     }
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      
      {/* Search & Global Controls (Superuser Parity) */}
      <div className="flex flex-col md:flex-row gap-4">
        <form onSubmit={handleSearch} className="flex-1 relative">
           <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
           <input 
             type="text"
             placeholder="Search strategies, locations, or organizers..."
             className="w-full pl-12 pr-4 py-4 bg-white border border-gray-100 rounded-[24px] text-sm font-bold shadow-sm focus:ring-4 focus:ring-red-500/5 transition-all outline-none"
             value={searchQuery}
             onChange={e => setSearchQuery(e.target.value)}
           />
           <button type="submit" className="absolute right-3 top-1/2 -translate-y-1/2 px-4 py-2 bg-red-500 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-black transition-all">
             Search Engine
           </button>
        </form>

        <div className="flex items-center space-x-2 bg-white p-1 rounded-[24px] border border-gray-100 shadow-sm">
           <button 
             onClick={() => setViewMode('card')}
             className={cn(
               "p-3 rounded-2xl transition-all",
               viewMode === 'card' ? "bg-red-50 text-red-500" : "text-gray-400 hover:text-gray-600"
             )}
           >
              <Grid size={20} />
           </button>
           <button 
              onClick={() => setViewMode('list')}
              className={cn(
                "p-3 rounded-2xl transition-all",
                viewMode === 'list' ? "bg-red-50 text-red-500" : "text-gray-400 hover:text-gray-600"
              )}
           >
              <List size={20} />
           </button>
        </div>

        <button 
          onClick={() => setShowCreate(true)}
          className="px-8 py-4 bg-red-500 text-white rounded-[24px] text-[11px] font-black uppercase tracking-widest shadow-xl shadow-red-500/20 hover:scale-105 active:scale-95 transition-all flex items-center space-x-3"
        >
           <Plus size={18} />
           <span>Create Execution Strategy</span>
        </button>
      </div>

      {/* Filter Matrix */}
      <div className="flex flex-wrap items-center gap-4 bg-gray-50/50 p-6 rounded-[32px] border border-dashed border-gray-200">
         <div className="flex items-center space-x-2">
            <Filter size={14} className="text-gray-400" />
            <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">Filters:</span>
         </div>
         
         <select 
           value={statusFilter}
           onChange={e => setStatusFilter(e.target.value)}
           className="bg-white border border-gray-100 rounded-xl px-4 py-2 text-[10px] font-black uppercase tracking-wider outline-none focus:border-red-500 transition-colors"
         >
            <option value="">All Statuses</option>
            <option value="published">Published</option>
            <option value="draft">Draft (Strategy Only)</option>
            <option value="cancelled">Cancelled</option>
         </select>

         <select 
           value={categoryFilter}
           onChange={e => setCategoryFilter(e.target.value)}
           className="bg-white border border-gray-100 rounded-xl px-4 py-2 text-[10px] font-black uppercase tracking-wider outline-none focus:border-red-500 transition-colors"
         >
            <option value="">All Categories</option>
            <option value="Social">Social</option>
            <option value="Networking">Networking</option>
            <option value="Culinary">Culinary</option>
         </select>

         <div className="ml-auto flex items-center space-x-3">
             {selectedEvents.length > 0 && (
                <div className="flex items-center space-x-2 animate-in slide-in-from-right-4">
                   <span className="text-[10px] font-black text-red-900 bg-red-100 px-3 py-1 rounded-full uppercase italic">{selectedEvents.length} selected</span>
                   <button className="p-2 text-gray-400 hover:text-red-500 transition-colors"><Trash2 size={16} /></button>
                </div>
             )}
             <button onClick={loadEvents} className={cn("p-2 text-gray-400 hover:text-gray-900 transition-all", loading && "animate-spin")}>
                <RefreshCw size={18} />
             </button>
         </div>
      </div>

      {/* Content Rendering Grid / Table */}
      {error && (
        <div className="p-12 bg-red-50 border border-red-100 rounded-[40px] text-center space-y-4">
           <AlertCircle className="mx-auto text-red-500" size={48} />
           <p className="text-sm font-black text-red-900 italic uppercase">Strategy Layer Synchronization Error.</p>
           <p className="text-xs text-red-500 font-medium">{error}</p>
        </div>
      )}

      {loading ? (
        <div className="py-24 space-y-4 text-center">
            <div className="w-12 h-12 border-4 border-red-500/20 border-t-red-500 rounded-full animate-spin mx-auto" />
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] italic">Retrieving Global Registry...</p>
        </div>
      ) : (
        <>
          {viewMode === 'list' ? (
            <div className="bg-white rounded-[40px] border border-gray-100 shadow-sm overflow-hidden overflow-x-auto">
               <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-gray-50 border-b border-gray-100">
                      <th className="p-6">
                        <input type="checkbox" checked={selectedEvents.length === events.length && events.length > 0} onChange={toggleSelectAll} className="w-4 h-4 rounded border-gray-300 text-red-500 focus:ring-red-500" />
                      </th>
                      <th className="p-6 text-[10px] font-black text-gray-400 uppercase tracking-widest italic">Title</th>
                      <th className="p-6 text-[10px] font-black text-gray-400 uppercase tracking-widest italic">Date & Time</th>
                      <th className="p-6 text-[10px] font-black text-gray-400 uppercase tracking-widest italic">Category</th>
                      <th className="p-6 text-[10px] font-black text-gray-400 uppercase tracking-widest italic">Status</th>
                      <th className="p-6 text-[10px] font-black text-gray-400 uppercase tracking-widest italic">Location</th>
                      <th className="p-6 text-[10px] font-black text-gray-400 uppercase tracking-widest italic">Organizer</th>
                      <th className="p-6 text-[10px] font-black text-gray-400 uppercase tracking-widest italic text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {events.map(event => (
                      <tr key={event.id} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors group text-[11px]">
                        <td className="p-6">
                           <input type="checkbox" checked={selectedEvents.includes(event.id)} onChange={() => toggleSelect(event.id)} className="w-4 h-4 rounded border-gray-300 text-red-500 focus:ring-red-500" />
                        </td>
                        <td className="p-6">
                           <div className="flex flex-col">
                              <span className="text-sm font-black text-gray-900 italic tracking-tight">{event.title}</span>
                              <span className="text-[9px] font-bold text-gray-400 uppercase tracking-tighter mt-1">{event.id.slice(0,8)}...</span>
                           </div>
                        </td>
                        <td className="p-6 font-bold text-gray-600">
                           {new Date(event.start_time).toLocaleDateString()}. {new Date(event.start_time).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                        </td>
                        <td className="p-6">
                           <div className="flex flex-wrap gap-1">
                              {(event.event_type_names || event.eventType || event.categories || 'general').split(',').map((c: string) => (
                                <span key={c} className="px-2 py-0.5 bg-red-50 text-red-500 text-[8px] font-black uppercase rounded-lg border border-red-100">{c.trim()}</span>
                              ))}
                           </div>
                        </td>
                        <td className="p-6">
                           <span className={cn(
                             "px-3 py-1 text-[8px] font-black uppercase rounded-full border",
                             event.status === 'published' ? "bg-green-50 text-green-700 border-green-200" : "bg-gray-50 text-gray-400 border-gray-200"
                           )}>
                             {event.status}
                           </span>
                        </td>
                        <td className="p-6 font-bold text-gray-500 italic">
                           {event.venue_area || event.location || event.venue_name || '—'}
                        </td>
                        <td className="p-6 font-bold text-gray-500 italic">
                           {event.metadata?.organizer_name || event.organization_name || '—'}
                        </td>
                        <td className="p-6 text-right">
                           <div className="flex items-center justify-end space-x-2">
                              <button onClick={() => setEditingEvent(event)} className="p-2 hover:bg-white rounded-xl text-gray-400 hover:text-red-500 transition-all border border-transparent hover:border-gray-100"><Edit3 size={14} /></button>
                              <button onClick={() => handleDuplicate(event.id)} className="p-2 hover:bg-white rounded-xl text-gray-400 hover:text-gray-900 transition-all border border-transparent hover:border-gray-100"><Copy size={14} /></button>
                              <button onClick={() => {}} className="p-2 hover:bg-white rounded-xl text-gray-400 hover:text-red-500 transition-all border border-transparent hover:border-gray-100"><Trash2 size={14} /></button>
                           </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
               </table>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 2xl:grid-cols-3 gap-6">
               {events.map(event => (
                 <div key={event.id} className="bg-white rounded-[40px] border border-gray-100 shadow-sm hover:shadow-2xl hover:shadow-gray-200/50 transition-all p-8 flex flex-col group relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-2 h-full bg-red-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                    
                    <div className="flex justify-between items-start mb-6">
                       <span className="px-3 py-1 bg-green-50 text-green-700 text-[9px] font-black uppercase tracking-widest rounded-full border border-green-100 italic">
                         {event.status}
                       </span>
                       <button className="p-2 text-gray-300 hover:text-gray-900 transition-colors"><MoreHorizontal size={20} /></button>
                    </div>

                    <h3 className="text-xl font-black text-gray-900 mb-2 italic tracking-tighter leading-tight shrink-0">{event.title}.</h3>
                    
                    <div className="space-y-4 mb-8">
                       <div className="flex items-center space-x-3 text-gray-400 group-hover:text-red-500 transition-colors">
                          <Calendar size={14} />
                          <span className="text-[11px] font-bold italic">{new Date(event.start_time).toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })}</span>
                       </div>
                       <div className="flex items-center space-x-3 text-gray-400">
                          <MapPin size={14} />
                          <span className="text-[10px] font-black uppercase tracking-tighter italic">Digital Presence Optimized</span>
                       </div>
                    </div>

                    <div className="mt-auto pt-6 border-t border-gray-50 flex items-center justify-between">
                       <div className="flex -space-x-2">
                          {[1,2,3].map(i => (
                            <div key={i} className="w-8 h-8 rounded-full border-2 border-white bg-gray-100 flex items-center justify-center overflow-hidden">
                               <User size={14} className="text-gray-300" />
                            </div>
                          ))}
                          <div className="w-8 h-8 rounded-full border-2 border-white bg-gray-900 flex items-center justify-center text-[8px] font-black text-white">+12</div>
                       </div>
                       
                       <div className="flex items-center space-x-2">
                          <button onClick={() => handleDuplicate(event.id)} className="p-3 text-gray-300 hover:text-red-500 transition-all border border-gray-100 rounded-2xl bg-gray-50/50 hover:bg-red-50"><Copy size={16} /></button>
                          <button 
                            onClick={() => router.push(`/events/${event.id}/instances`)}
                            className="px-6 py-3 bg-gray-900 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-red-500 hover:scale-105 transition-all shadow-xl shadow-gray-900/10"
                          >
                             Manage Engine
                          </button>
                       </div>
                    </div>
                 </div>
               ))}
            </div>
          )}
        </>
      )}

      {/* Modals */}
      {showCreate && (
         <CreateEventModal 
           organizationId={organizationId} 
           onClose={() => setShowCreate(false)} 
         />
      )}

      {editingEvent && (
         <EditEventModal 
           organizationId={organizationId}
           event={editingEvent}
           onClose={() => setEditingEvent(null)}
           onSuccess={() => {
             setEditingEvent(null)
             loadEvents()
           }}
         />
      )}
    </div>
  )
}
