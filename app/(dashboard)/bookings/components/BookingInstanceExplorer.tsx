'use client'

import { useState, useMemo } from 'react'
import { Calendar, Users, ChevronLeft, ChevronRight, Bookmark, CheckCircle, Clock, MapPin, Search } from 'lucide-react'
import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'
import RegistrationManager from './RegistrationManager'

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
    title: string
    organization_id: string
  }
}

interface Props {
  initialInstances: EventInstance[]
  businessId: string
}

export default function BookingInstanceExplorer({ initialInstances, businessId }: Props) {
  const [instances] = useState<EventInstance[]>(initialInstances)
  const [selectedDate, setSelectedDate] = useState<string>(new Date().toISOString().split('T')[0])
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedInstance, setSelectedInstance] = useState<EventInstance | null>(null)

  // Generate 14 days of calendar
  const calendarDays = useMemo(() => {
    const days = []
    const start = new Date()
    for (let i = 0; i < 14; i++) {
       const d = new Date(start)
       d.setDate(start.getDate() + i)
       const dateStr = d.toISOString().split('T')[0]
       days.push({
         date: dateStr,
         dayName: d.toLocaleDateString('en-US', { weekday: 'short' }),
         dayNum: d.getDate(),
         isToday: i === 0
       })
    }
    return days
  }, [])

  const filteredInstances = useMemo(() => {
    return instances.filter(inst => {
      const isSameDay = inst.start_time.startsWith(selectedDate)
      const matchesSearch = inst.events?.title?.toLowerCase().includes(searchTerm.toLowerCase()) || inst.id.includes(searchTerm)
      return isSameDay && matchesSearch
    })
  }, [instances, selectedDate, searchTerm])

  function formatTime(dateString: string) {
    return new Date(dateString).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    })
  }

  return (
    <div className="space-y-8">
      {/* Dynamic Operational Calendar */}
      <div className="bg-white rounded-[40px] p-8 border border-gray-100 shadow-sm overflow-hidden">
        <div className="flex justify-between items-center mb-8">
           <h2 className="text-xl font-black text-gray-900 italic tracking-tighter">Operational Timeline.</h2>
           <div className="flex items-center space-x-2">
             <button className="p-2 hover:bg-gray-50 rounded-full text-gray-400 transition-all"><ChevronLeft size={20}/></button>
             <button className="p-2 hover:bg-gray-50 rounded-full text-gray-400 transition-all"><ChevronRight size={20}/></button>
           </div>
        </div>

        <div className="flex gap-4 overflow-x-auto pb-4 no-scrollbar">
           {calendarDays.map((day) => (
             <button 
               key={day.date}
               onClick={() => setSelectedDate(day.date)}
               className={cn(
                 "flex flex-col items-center min-w-[72px] p-5 rounded-[28px] border-2 transition-all",
                 selectedDate === day.date 
                   ? "bg-gray-900 border-gray-900 text-white shadow-xl shadow-gray-900/20 scale-105" 
                   : "bg-white border-gray-100 text-gray-400 hover:border-gray-300"
               )}
             >
               <span className="text-[10px] font-black uppercase tracking-widest mb-2">{day.dayName}</span>
               <span className="text-2xl font-black italic tabular-nums leading-none">{day.dayNum}</span>
               {day.isToday && <div className={cn("w-1 h-1 rounded-full mt-2", selectedDate === day.date ? "bg-white" : "bg-red-500")} />}
             </button>
           ))}
        </div>
      </div>

      {/* Instance Interaction Layer */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* List of Instances */}
        <div className="lg:col-span-12 space-y-6">
           <div className="flex justify-between items-center px-2">
              <div className="flex items-center space-x-3">
                 <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                 <h3 className="text-sm font-black text-gray-900 uppercase tracking-widest italic">
                   {filteredInstances.length} OPERATIONAL SLOTS ON {new Date(selectedDate).toLocaleDateString('en-US', { month: 'long', day: 'numeric' })}
                 </h3>
              </div>
              
              <div className="relative max-w-xs w-full">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                <input 
                  type="text" 
                  placeholder="Filter by event title..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full bg-white border border-gray-100 rounded-2xl pl-10 pr-4 py-2 text-xs font-bold outline-none focus:ring-2 focus:ring-red-500/10 transition-all shadow-sm"
                />
              </div>
           </div>

           {filteredInstances.length > 0 ? (
             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
               {filteredInstances.map((inst) => (
                 <div 
                   key={inst.id}
                   className={cn(
                     "group bg-white rounded-[40px] border p-8 flex flex-col shadow-sm transition-all hover:shadow-2xl hover:shadow-gray-200/50 relative overflow-hidden",
                     inst.source_type === 'manual' ? "border-dashed border-red-500/40 bg-red-50/10" : "border-gray-100"
                   )}
                 >
                   {inst.source_type === 'manual' && (
                     <div className="absolute top-0 right-0 p-4 opacity-30">
                       <Bookmark size={24} className="text-red-500 fill-red-500" />
                     </div>
                   )}

                   <div className="flex justify-between items-start mb-6">
                     <div className={cn(
                       "px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ring-1",
                       inst.status === 'scheduled' ? "bg-blue-50 text-blue-700 ring-blue-600/20" : 
                       inst.status === 'active' ? "bg-green-50 text-green-700 ring-green-600/20 animate-pulse" :
                       inst.status === 'cancelled' ? "bg-red-50 text-red-500 ring-red-500/20" :
                       "bg-gray-50 text-gray-400 ring-gray-200"
                     )}>
                       [{inst.status === 'cancelled' ? 'No-Go' : inst.status}]
                     </div>
                     <span className="text-[9px] font-bold text-gray-300 font-mono tracking-tighter">RUN_{inst.id.substring(0, 6)}</span>
                   </div>

                   <h4 className="text-xl font-black text-gray-900 italic tracking-tight mb-1">{inst.events?.title}.</h4>
                   <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-6">
                     {inst.source_type === 'manual' ? 'Operational Extension' : 'Standard Recurrence Rhythm'}
                   </p>

                   <div className="space-y-4 mb-8">
                      <div className="flex items-center space-x-3 text-sm font-bold text-gray-500">
                        <Clock size={16} className="text-red-500" />
                        <span>{formatTime(inst.start_time)} – {formatTime(inst.end_time)}</span>
                      </div>
                      
                      <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100 flex items-center justify-between">
                         <div className="flex items-center space-x-2">
                           <Users size={16} className="text-blue-500" />
                           <span className="text-xs font-black text-gray-900 uppercase">Booked Load</span>
                         </div>
                         <div className="text-sm font-black tabular-nums">
                           {inst.current_rsvp_count} / {inst.max_capacity || '∞'}
                         </div>
                      </div>
                      
                      <div className="w-full bg-gray-200 h-1 rounded-full overflow-hidden">
                        <div 
                          className="bg-red-500 h-full transition-all duration-1000" 
                          style={{ width: `${Math.min(100, (inst.current_rsvp_count / (inst.max_capacity || 100)) * 100)}%` }}
                        />
                      </div>
                   </div>

                   <button 
                    onClick={() => setSelectedInstance(inst)}
                    className="mt-auto px-6 py-4 bg-gray-900 text-white rounded-[24px] text-xs font-black uppercase tracking-widest shadow-xl hover:bg-black hover:scale-105 active:scale-95 transition-all flex items-center justify-center space-x-2"
                   >
                      <CheckCircle size={16} />
                      <span>Manage Registrations →</span>
                   </button>
                 </div>
               ))}
             </div>
           ) : (
             <div className="py-32 bg-gray-50/50 rounded-[40px] border border-dashed border-gray-200 text-center">
                <Calendar size={48} className="mx-auto text-gray-200 mb-6" />
                <h3 className="text-sm font-black text-gray-400 uppercase tracking-widest italic">No operational slots found for this date.</h3>
                <p className="text-xs font-medium text-gray-400 mt-2 italic">Strategies have not been initialized or expanded for this window.</p>
             </div>
           )}
        </div>
      </div>

      {selectedInstance && (
        <RegistrationManager 
          instanceId={selectedInstance.id}
          eventTitle={selectedInstance.events.title}
          onClose={() => setSelectedInstance(null)}
        />
      )}
    </div>
  )
}
