import { eventsApi, organizationApi } from '@/lib/api.server'
import DashboardHeader from '@/components/DashboardHeader'
import EventsList from '@/app/(dashboard)/events/components/EventsList'
import { Calendar } from 'lucide-react'

export default async function EventInstancesPage({ params }: { params: { id: string } }) {
  const businessId = await organizationApi.getPartnerBusiness()
  
  // Load strategy details for the header
  const eventRes = await eventsApi.getEvent(params.id)
  const event = eventRes.data

  // Load instances strictly for this strategy
  const instanceRes = await eventsApi.getInstances({
    eventId: params.id,
    limit: 100
  })
  
  const instances = Array.isArray(instanceRes.data) ? instanceRes.data : []
  
  return (
    <div className="space-y-8 pb-20">
      <DashboardHeader 
        title={event?.title || 'Event Control'} 
        subtitle="Operational Execution Ledger & Instance Management"
      >
         <div className="px-4 py-2 bg-gray-100 rounded-xl text-[10px] font-black uppercase tracking-widest text-gray-500">
            ID: {params.id.slice(0,8)}
         </div>
      </DashboardHeader>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        <div className="lg:col-span-12">
           <EventsList initialInstances={instances} />
        </div>
      </div>
      
      {instances.length === 0 && (
        <div className="py-24 text-center border-2 border-dashed border-gray-100 rounded-[40px] bg-gray-50/50">
           <Calendar className="mx-auto text-gray-200 mb-4" size={48} />
           <h3 className="text-sm font-black text-gray-400 uppercase tracking-widest">No active instances in the temporal registry.</h3>
           <p className="text-[10px] font-bold text-gray-300 mt-2">The engine will expand this strategy upon next synchronization.</p>
        </div>
      )}
    </div>
  )
}
