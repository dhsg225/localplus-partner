import { useState } from 'react'
import { Plus } from 'lucide-react'
import CreateEventModal from './CreateEventModal'

export default function CreateEventButton({ organizationId }: { organizationId: string }) {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <>
      <button 
        onClick={() => setIsOpen(true)}
        className="flex items-center space-x-2 px-6 py-3 bg-red-600 text-white rounded-full text-sm font-black shadow-xl shadow-red-500/20 hover:bg-black hover:scale-105 active:scale-95 transition-all uppercase tracking-widest"
      >
        <Plus size={18} className="text-white" />
        <span>Create Event</span>
      </button>

      {isOpen && (
        <CreateEventModal 
          organizationId={organizationId} 
          onClose={() => setIsOpen(false)} 
        />
      )}
    </>
  )
}
