'use client'

import { useState } from 'react'
import { Calendar, Search, MapPin, MoreHorizontal, Copy, Pencil, Trash2 } from 'lucide-react'
import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

interface EventRecord {
  id: string
  title: string
  description?: string
  status: string
  start_time: string
  end_time: string
  event_type: string
  business_id: string | null
}

export default function EventsList({ initialEvents }: { initialEvents: EventRecord[] }) {
  const [events, setEvents] = useState<EventRecord[]>(initialEvents)
  const [searchTerm, setSearchTerm] = useState('')

  const filteredEvents = events.filter(e => 
    e.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    e.description?.toLowerCase().includes(searchTerm.toLowerCase())
  )

  function formatTime(dateString: string) {
    const d = new Date(dateString)
    return d.toLocaleString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  return (
    <div className="space-y-6">
      {/* Search & Tooling */}
      <div className="flex gap-4 p-4 bg-white rounded-2xl border border-gray-100 shadow-sm">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input 
            type="text" 
            placeholder="Search events, organizers, categories..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-gray-50 border border-gray-100 rounded-xl pl-10 pr-4 py-2 text-sm focus:ring-2 focus:ring-red-500/10 focus:border-red-500/40 outline-none transition-all placeholder:italic"
          />
        </div>
        <div className="flex items-center space-x-2">
          <div className="text-xs font-black text-gray-400 uppercase tracking-widest pl-2">Filter By</div>
          <select className="bg-gray-50 border border-gray-100 rounded-xl px-4 py-2 text-xs font-bold ring-0 outline-none">
            <option>All Status</option>
            <option>Published</option>
            <option>Draft</option>
          </select>
        </div>
      </div>

      {/* Grid List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredEvents.map((event) => (
          <div 
            key={event.id}
            className="group bg-white rounded-[32px] border border-gray-100 p-6 flex flex-col shadow-sm hover:shadow-2xl hover:shadow-gray-200/50 transition-all transform hover:-translate-y-1"
          >
            <div className="flex justify-between items-start mb-4">
              <div className={cn(
                "px-2.5 py-1 rounded-full text-[9px] font-black uppercase tracking-widest ring-1",
                event.status === 'published' 
                  ? "bg-green-50 text-green-700 ring-green-600/20" 
                  : "bg-gray-50 text-gray-400 ring-gray-200"
              )}>
                {event.status}
              </div>
              <button className="text-gray-400 hover:text-gray-900 transition-colors">
                <MoreHorizontal size={18} />
              </button>
            </div>

            <h3 className="text-lg font-black text-gray-900 mb-2 italic tracking-tight line-clamp-1">{event.title}.</h3>
            
            <div className="space-y-2 mb-6 flex-1">
              <div className="flex items-center space-x-2 text-xs font-medium text-gray-500">
                <Calendar size={14} className="text-red-500" />
                <span>{formatTime(event.start_time)}</span>
              </div>
              <div className="flex items-center space-x-2 text-xs font-medium text-gray-500">
                <MapPin size={14} className="text-blue-500" />
                <span className="truncate">Digital Presence Optimized</span>
              </div>
            </div>

            <div className="pt-4 border-t border-gray-50 flex items-center justify-between">
              <div className="flex -space-x-1.5">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="w-6 h-6 rounded-full border border-white bg-gray-200" />
                ))}
                <div className="w-6 h-6 rounded-full border border-white bg-gray-100 flex items-center justify-center text-[8px] font-black text-gray-400">+12</div>
              </div>
              
              <div className="flex space-x-2">
                <button className="p-2 rounded-xl text-gray-400 hover:bg-gray-50 hover:text-gray-900 transition-all" title="Duplicate">
                  <Copy size={16} />
                </button>
                <button className="px-4 py-2 bg-gray-900 text-white rounded-xl text-xs font-black shadow-xl hover:bg-black active:scale-95 transition-all">
                  Manage Engine
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      {filteredEvents.length === 0 && (
        <div className="py-24 text-center">
          <Calendar className="mx-auto text-gray-200 mb-4" size={48} />
          <h3 className="text-sm font-black text-gray-400 uppercase tracking-widest">No matching events found.</h3>
        </div>
      )}
    </div>
  )
}
