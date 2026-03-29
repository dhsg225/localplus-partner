'use client'

import { Plus } from 'lucide-react'

export default function CreateEventButton() {
  function handleCreate() {
    alert('Create Event modal integration in progress (Phase M2 continuation).')
  }

  return (
    <button 
      onClick={handleCreate}
      className="flex items-center space-x-2 px-6 py-3 bg-red-600 text-white rounded-full text-sm font-black shadow-xl shadow-red-500/20 hover:bg-black hover:scale-105 active:scale-95 transition-all uppercase tracking-widest"
    >
      <Plus size={18} className="text-white" />
      <span>Create Event</span>
    </button>
  )
}
