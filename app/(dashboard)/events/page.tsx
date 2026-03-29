import { eventsApi, organizationApi } from '@/lib/api.server'
import DashboardHeader from '@/components/DashboardHeader'
import EventsDashboard from '@/app/(dashboard)/events/components/EventsDashboard'
import AIDiscoveryInsights from '@/app/(dashboard)/events/components/AIDiscoveryInsights'
import { Search } from 'lucide-react'

export default async function EventsPage() {
  const { isSuperAdmin } = await organizationApi.checkPermissions()
  const businessId = await organizationApi.getPartnerBusiness()
  
  if (!isSuperAdmin && !businessId) {
    return (
      <div className="bg-red-50 border border-red-100 p-8 rounded-[32px] text-center">
        <h2 className="text-xl font-black text-red-900 italic mb-2">Organization Required.</h2>
        <p className="text-red-700 font-medium">We couldn't link your account to a partner business. Please contact support.</p>
      </div>
    )
  }

  // Load Strategy Registry (The "Definition" Layer)
  const response = await eventsApi.getEvents({
    businessId: !isSuperAdmin ? businessId : undefined,
    limit: 100
  })
  
  // Normalize data (strategies)
  const events = Array.isArray(response.data) ? response.data : []
  
  return (
    <div className="space-y-8 pb-20">
      <DashboardHeader 
        title="Event Operations" 
        subtitle="Strategy-first dashboard for global & local executions"
      />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        <div className="lg:col-span-12">
           <EventsDashboard 
             organizationId={businessId!} 
             isSuperAdmin={isSuperAdmin}
             initialEvents={events} 
           />
        </div>
      </div>
      
      {/* Footer Metrics / Insights Layer */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-12 border-t border-gray-100 pt-12">
         <AIDiscoveryInsights organizationId={businessId!} />
         
         <div className="bg-red-50 p-8 rounded-[40px] border border-red-100 flex flex-col items-center text-center space-y-4 shadow-sm group hover:shadow-xl transition-all h-fit">
            <div className="p-4 bg-white rounded-full text-red-500 shadow-xl group-hover:scale-110 transition-transform">
               <Search size={24} />
            </div>
            <div>
               <h4 className="text-sm font-black text-red-900 uppercase tracking-widest italic mb-2">Operational Audit.</h4>
               <p className="text-[10px] font-bold text-red-500/60 uppercase tracking-tighter leading-snug">Continuous integrity analysis is running on the temporal ledger.</p>
            </div>
            <button className="w-full py-4 bg-red-500 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-black transition-all">
               Generate Ops Report →
            </button>
         </div>
         
         <div className="p-8 border border-gray-100 rounded-[40px] bg-white flex flex-col justify-center text-center space-y-2">
            <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Strategy Count.</h4>
            <div className="text-5xl font-black text-gray-900 italic tracking-tighter">{events.length}</div>
            <p className="text-[9px] font-bold text-gray-300 uppercase">Synchronized with WordPress Engine</p>
         </div>
      </div>
    </div>
  )
}
