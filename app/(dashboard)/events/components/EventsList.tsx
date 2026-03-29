'use client'

import { useState } from 'react'
import { Calendar, Search, MapPin, MoreHorizontal, Copy, Pencil, Trash2, Users, RefreshCw, PlusCircle, Bookmark } from 'lucide-react'
import { eventsApi } from '@/lib/api'
import CapacityEditModal from './CapacityEditModal'
import AddManualInstanceModal from './AddManualInstanceModal'
import EditEventModal from './EditEventModal'
import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

interface EventInstance {
  id: string
  event_id: string
  start_time: string
  end_time: string
  status: string
  current_rsvp_count: number
  max_capacity: number | null
  source_type: 'generated' | 'manual'
  events: {
    id: string
    title: string
    organization_id: string
    timezone: string
    venue_id?: string
    venues?: { name: string, capacity: number }
  }
}

export default function EventsList({ initialInstances }: { initialInstances: EventInstance[] }) {
  const [instances, setInstances] = useState<EventInstance[]>(initialInstances)
  const [searchTerm, setSearchTerm] = useState('')
  const [processingId, setProcessingId] = useState<string | null>(null)

  const handleCancelInstance = async (id: string) => {
    if (!confirm('Are you sure you want to cancel this specific date? This will mark it as a "No-Go" in the discovery engine.')) return
    
    setProcessingId(id)
    try {
      const res = await eventsApi.updateInstance({ id, status: 'cancelled' })
      if (res.success) {
        // Optimistic UI Update
        setInstances(prev => prev.map(inst => 
          inst.id === id ? { ...inst, status: 'cancelled' } : inst
        ))
      }
    } catch (err) {
      alert('Failed to cancel instance. Engine rejected the command.')
    } finally {
      setProcessingId(null)
    }
  }

  const handleRevertInstance = async (id: string) => {
    setProcessingId(id)
    try {
      const res = await eventsApi.updateInstance({ id, status: 'scheduled' })
      if (res.success) {
        setInstances(prev => prev.map(inst => 
          inst.id === id ? { ...inst, status: 'scheduled' } : inst
        ))
      }
    } catch (err) {
      alert('Failed to re-schedule instance. Engine rejected the command.')
    } finally {
      setProcessingId(null)
    }
  }

  // Modal States
  const [editingCapacity, setEditingCapacity] = useState<EventInstance | null>(null)
  const [addingSpecial, setAddingSpecial] = useState<EventInstance | null>(null)
  const [editingStrategy, setEditingStrategy] = useState<string | null>(null) 
  const [editingStrategyData, setEditingStrategyData] = useState<any>(null)

  const handleEditStrategy = async (eventId: string) => {
    try {
      const res = await eventsApi.getEvent(eventId)
      if (res && res.data) {
        setEditingStrategyData(res.data)
        setEditingStrategy(eventId)
      }
    } catch {
      alert("Failed to load strategy definition.")
    }
  }

  const handleCreatedManual = (newInstance: any) => {
    // Inject the new instance into state, making sure to include necessary event data for the title.
    const enriched = { 
      ...newInstance, 
      events: addingSpecial?.events || { title: 'Unknown Event' } 
    }
    setInstances(prev => [...prev, enriched].sort((a,b) => new Date(a.start_time).getTime() - new Date(b.start_time).getTime()))
  }

  // Filter instances by parent event title or ID
  const filtered = instances.filter(i => 
    i.events?.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    i.id.includes(searchTerm)
  )

  // Group instances by Date (YYYY-MM-DD)
  const grouped = filtered.reduce((acc, inst) => {
    const date = new Date(inst.start_time).toISOString().split('T')[0]
    if (!acc[date]) acc[date] = []
    acc[date].push(inst)
    return acc
  }, {} as Record<string, EventInstance[]>)

  const sortedDates = Object.keys(grouped).sort()

  function formatTime(dateString: string) {
    const d = new Date(dateString)
    return d.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    })
  }

  function formatDateHeader(dateStr: string) {
    const d = new Date(dateStr)
    return d.toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'long',
      day: 'numeric'
    })
  }

  return (
    <div className="space-y-12 pb-24">
      {/* Search & Tooling */}
      <div className="flex gap-4 p-4 bg-white rounded-2xl border border-gray-100 shadow-sm sticky top-0 z-10 backdrop-blur-md bg-white/80">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input 
            type="text" 
            placeholder="Search by event title or instance ID..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-gray-50 border border-gray-100 rounded-xl pl-10 pr-4 py-2 text-sm font-medium focus:ring-2 focus:ring-red-500/10 focus:border-red-500/40 outline-none transition-all"
          />
        </div>
      </div>

      {sortedDates.map((date) => (
        <div key={date} className="space-y-6">
          <div className="flex items-center space-x-4">
            <h2 className="text-xs font-black text-gray-400 uppercase tracking-widest bg-gray-50 px-3 py-1 rounded-full">{formatDateHeader(date)}</h2>
            <div className="flex-1 h-px bg-gray-100" />
            <div className="text-[10px] font-bold text-gray-300 uppercase">{grouped[date].length} OPS RUNNING</div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
             {grouped[date].map((inst) => (
              <div 
                key={inst.id}
                className={cn(
                  "group bg-white rounded-[32px] border p-6 flex flex-col shadow-sm hover:shadow-2xl hover:shadow-gray-200/50 transition-all transform hover:-translate-y-1 relative overflow-hidden",
                  inst.source_type === 'manual' ? "border-dashed border-red-500/40 bg-red-50/10" : "border-gray-100"
                )}
              >
                {inst.source_type === 'manual' && (
                  <div className="absolute top-0 right-0 p-3 opacity-20 hover:opacity-100 transition-opacity">
                    <Bookmark size={24} className="text-red-500 fill-red-500" />
                  </div>
                )}
                <div className="flex justify-between items-start mb-4">
                  <div className="flex flex-col gap-1.5">
                    <div className={cn(
                      "px-2.5 py-1 rounded-full text-[9px] font-black uppercase tracking-widest ring-1 w-fit",
                      inst.status === 'scheduled' 
                        ? "bg-blue-50 text-blue-700 ring-blue-600/20" 
                        : inst.status === 'active'
                        ? "bg-green-50 text-green-700 ring-green-600/20 animate-pulse"
                        : inst.status === 'cancelled'
                        ? "bg-red-50 text-red-500 ring-red-500/20"
                        : "bg-gray-50 text-gray-400 ring-gray-200"
                    )}>
                      [{inst.status === 'cancelled' ? 'No-Go' : inst.status}]
                    </div>
                    {inst.source_type === 'manual' && (
                      <div className="text-[8px] font-black text-red-500 uppercase tracking-tighter leading-none italic pl-1">Operational Extension [Manual]</div>
                    )}
                  </div>
                  <div className="flex items-center space-x-1.5 text-[9px] font-black text-gray-300 italic">
                    <span className="h-1.5 w-1.5 rounded-full bg-gray-200" />
                    <span>ENGINE_RUN_{inst.id.substring(0, 6)}</span>
                  </div>
                </div>

                <h3 className="text-lg font-black text-gray-900 mb-1 italic tracking-tight line-clamp-1">{inst.events?.title}.</h3>
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-4">Strategic Temporal Instance</p>
                
                <div className="space-y-3 mb-6 bg-gray-50 p-4 rounded-2xl border border-gray-100">
                  <div className="flex items-center justify-between text-[11px] font-bold">
                    <div className="flex items-center space-x-2 text-gray-500">
                      <Calendar size={14} className="text-red-500" />
                      <span>{formatTime(inst.start_time)}</span>
                    </div>
                    <div className="text-gray-400">→ {formatTime(inst.end_time)}</div>
                  </div>
                  
                  <div className="flex items-center justify-between pt-2 border-t border-gray-200/50">
                    <div className="flex items-center space-x-2 text-[10px] font-black uppercase text-gray-400">
                      <Users size={12} />
                      <span>Capacity Utilization</span>
                    </div>
                    <div className="text-[11px] font-black text-gray-900">
                      {inst.current_rsvp_count} / {inst.max_capacity || '∞'}
                    </div>
                  </div>
                  <div className="w-full bg-gray-200 h-1 rounded-full overflow-hidden">
                    <div 
                      className="bg-red-500 h-full transition-all duration-1000" 
                      style={{ width: `${Math.min(100, (inst.current_rsvp_count / (inst.max_capacity || 100)) * 100)}%` }}
                    />
                  </div>

                  {/* RESOURCE STUB UI RESOLVED */}
                  <div className="pt-3 mt-3 border-t border-gray-200/50 space-y-2">
                     <div className="flex items-center justify-between group/res opacity-60 hover:opacity-100 transition-all">
                        <div className="flex items-center space-x-2">
                          <MapPin size={12} className="text-gray-400" />
                          <span className="text-[9px] font-black text-gray-500 uppercase tracking-tighter">Strategic Venue</span>
                        </div>
                        <span className="text-[9px] font-bold text-gray-900 italic">
                          {inst.events?.venues?.name || (inst.events?.venue_id ? `Assigned (${inst.events.venue_id.slice(0,5)})` : 'None Assigned')}
                        </span>
                     </div>
                     <div className="flex items-center justify-between group/res opacity-60 hover:opacity-100 transition-all">
                        <div className="flex items-center space-x-2">
                          <Users size={12} className="text-gray-400" />
                          <span className="text-[9px] font-black text-gray-500 uppercase tracking-tighter">Service Roster</span>
                        </div>
                        <span className="text-[9px] font-bold text-gray-900 italic">Live Mapping</span>
                     </div>
                  </div>

                  {/* TICKETING STUB UI */}
                  <div className="pt-3 mt-3 border-t border-gray-200/50 flex items-center justify-between group/stub transition-all opacity-80 hover:opacity-100">
                     <div className="flex items-center space-x-2">
                       <div className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
                       <span className="text-[9px] font-black text-gray-900 uppercase tracking-tighter italic">Engine Ticket [STUB]</span>
                     </div>
                     <div className="text-[10px] font-black text-gray-400 tabular-nums">
                       0 Sold / $0.00
                     </div>
                  </div>
                </div>

                <div className="mt-auto pt-4 border-t border-gray-50 flex items-center justify-between">
                   <button 
                    onClick={() => setAddingSpecial(inst)}
                    className="flex items-center space-x-1.5 text-xs font-black text-red-500 uppercase tracking-tighter hover:text-black transition-colors"
                   >
                     <PlusCircle size={14} />
                     <span>Special Date →</span>
                   </button>
                   
                   <div className="flex space-x-1">
                     <button 
                       onClick={() => handleEditStrategy(inst.event_id)}
                       title="Edit Strategy (All Instances)"
                       className="p-2 rounded-xl text-gray-300 hover:bg-red-50 hover:text-red-500 transition-all"
                     >
                       <Pencil size={14} />
                     </button>
                     <button 
                       onClick={() => setEditingCapacity(inst)}
                       title="Override Instance Capacity"
                       className="p-2 rounded-xl text-gray-300 hover:bg-gray-50 hover:text-gray-900 transition-all"
                     >
                       <Users size={14} />
                     </button>
                     
                     {inst.status === 'cancelled' && (
                       <button 
                        onClick={() => handleRevertInstance(inst.id)}
                        disabled={processingId === inst.id}
                        className="p-2 rounded-xl text-green-500 bg-green-50/50 hover:bg-green-100 transition-all animate-in zoom-in-75 duration-300"
                        title="Re-schedule this occurrence"
                       >
                         <RefreshCw size={14} className={cn(processingId === inst.id && "animate-spin")} />
                       </button>
                     )}

                     {inst.status !== 'cancelled' && (
                       <button 
                         onClick={() => handleCancelInstance(inst.id)}
                         disabled={processingId === inst.id}
                         className="p-2 rounded-xl text-gray-300 hover:bg-red-50 hover:text-red-500 transition-all"
                         title="Cancel this occurrence"
                       >
                         <Trash2 size={14} className={cn(processingId === inst.id && "animate-spin")} />
                       </button>
                     )}
                   </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}

      {editingStrategy && editingStrategyData && (
        <EditEventModal 
          organizationId={editingStrategyData.organization_id}
          event={editingStrategyData}
          onClose={() => setEditingStrategy(null)}
          onSuccess={() => {
            setEditingStrategy(null)
            window.location.reload()
          }}
        />
      )}

      {editingCapacity && (
        <CapacityEditModal 
          instanceId={editingCapacity.id}
          currentRsvpCount={editingCapacity.current_rsvp_count}
          currentMaxCapacity={editingCapacity.max_capacity}
          onClose={() => setEditingCapacity(null)}
          onUpdate={(newMax) => {
            setInstances(prev => prev.map(inst => 
              inst.id === editingCapacity.id ? { ...inst, max_capacity: newMax } : inst
            ))
          }}
        />
      )}

      {addingSpecial && (
        <AddManualInstanceModal 
          eventId={addingSpecial.event_id}
          eventTitle={addingSpecial.events.title}
          onClose={() => setAddingSpecial(null)}
          onCreated={handleCreatedManual}
        />
      )}
      
      {filtered.length === 0 && (
        <div className="py-24 text-center">
          <Calendar className="mx-auto text-gray-200 mb-4" size={48} />
          <h3 className="text-sm font-black text-gray-400 uppercase tracking-widest">No instances scheduled in this window.</h3>
        </div>
      )}
    </div>
  )
}
