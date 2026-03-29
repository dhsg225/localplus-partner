import { organizationApi, eventsApi } from '@/lib/api.server'
import DashboardHeader from '@/components/DashboardHeader'
import { Users, Calendar, TrendingUp, Building2, MapPin, Search, ChevronRight } from 'lucide-react'

export default async function MiceDashboard() {
  const { isSuperAdmin } = await organizationApi.checkPermissions()

  // Load Macro City Data
  // Standard admins will see their targeted slice (or global fallback if none), superusers see all.
  const partners = await organizationApi.getAllPartners(isSuperAdmin)
  
  // Note: Here we pass a mock venue/org filter if not super admin, mimicking the fallback
  // For standard admins, restrict instances to their specific organization scopes
  let instancesParams = { limit: 500 } as any
  if (!isSuperAdmin && partners.length > 0) {
     const partnerId = partners[0]?.business_id || partners[0]?.organization_id
     instancesParams.organizationId = partnerId
  }
  const instances = await eventsApi.getInstances(instancesParams) 
  
  const totalPartners = partners?.length || 0
  const totalInstances = instances.data?.length || 0
  const totalRsvps = instances.data?.reduce((acc: number, inst: any) => acc + (inst.current_rsvp_count || 0), 0) || 0

  return (
    <div className="space-y-12 pb-32">
       <DashboardHeader 
         title="MICE Destination Command" 
         subtitle="Macro-level oversight for city-wide event strategies"
       />

       {/* Macro Stats Radar */}
       <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            { label: 'Active Partners', value: totalPartners, icon: Building2, color: 'text-blue-500', bg: 'bg-blue-50' },
            { label: 'Live Temporal Slots', value: totalInstances, icon: Calendar, color: 'text-red-500', bg: 'bg-red-50' },
            { label: 'Aggregated RSVPs', value: totalRsvps, icon: Users, color: 'text-emerald-500', bg: 'bg-emerald-50' },
          ].map((stat, i) => (
            <div key={i} className="bg-white p-10 rounded-[48px] border border-gray-100 shadow-sm hover:shadow-xl transition-all group">
               <div className={`p-4 rounded-3xl ${stat.bg} ${stat.color} w-fit mb-6 transition-transform group-hover:scale-110`}>
                 <stat.icon size={24} />
               </div>
               <div className="text-4xl font-black italic tracking-tighter text-gray-900 mb-1">{stat.value}</div>
               <div className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{stat.label}</div>
            </div>
          ))}
       </div>

       {/* Partner Oversight Ledger & Audit Options */}
       <div className="space-y-6">
          <div className="flex justify-between items-center px-4">
             <h3 className="text-sm font-black text-gray-900 uppercase tracking-[0.2em] italic flex items-center space-x-2">
                <TrendingUp size={16} className="text-red-500" />
                <span>Partner Performance Registry {isSuperAdmin ? '[ALL]' : '[FALLBACK/LOCAL]'}</span>
             </h3>
             <div className="flex items-center space-x-4">
                {/* Audit & Filtering Hooks - Vite Parity */}
                <input type="date" className="px-3 py-1.5 bg-gray-50 border border-gray-200 rounded-lg text-[9px] font-black uppercase tracking-tighter shadow-sm outline-none" title="Filter by Date Range" />
                <select className="px-3 py-1.5 bg-gray-50 border border-gray-200 rounded-lg text-[9px] font-black uppercase tracking-tighter shadow-sm outline-none" title="Partner Activity Log">
                  <option>All Activity</option>
                  <option>Recent Edits</option>
                  <option>Security/Audit</option>
                </select>
                <div className="flex bg-gray-100 rounded-2xl p-1 border border-gray-200 ml-2">
                   <button className="px-4 py-1.5 bg-white rounded-xl text-[9px] font-black uppercase tracking-tighter shadow-sm">Grid View</button>
                   <button className="px-4 py-1.5 text-[9px] font-black uppercase tracking-tighter text-gray-400">List View</button>
                </div>
             </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
             {partners?.map((p: any) => (
                <div key={p.id} className="bg-white p-8 rounded-[40px] border border-gray-100 hover:border-red-500/20 hover:shadow-2xl hover:shadow-gray-200/50 transition-all flex items-center space-x-6 group">
                   <div className="w-16 h-16 bg-gray-50 rounded-[24px] border border-gray-100 flex items-center justify-center text-gray-300 font-black italic text-xl group-hover:bg-red-50 group-hover:text-red-500 transition-colors">
                      {p.business_name?.charAt(0) || 'P'}
                   </div>
                   <div className="flex-1">
                      <h4 className="text-lg font-black text-gray-900 italic tracking-tight">{p.business_name}</h4>
                      <div className="flex items-center space-x-3 mt-1">
                         <span className="px-2 py-0.5 bg-gray-100 text-gray-500 text-[8px] font-black uppercase rounded-md border border-gray-200">MICE_RETAIL</span>
                         <span className="text-[10px] font-medium text-gray-400 italic">Connected since 2026.</span>
                      </div>
                   </div>
                   <button className="p-4 bg-gray-50 rounded-full text-gray-300 hover:bg-gray-900 hover:text-white transition-all hover:scale-110">
                      <ChevronRight size={20} />
                   </button>
                </div>
             ))}
          </div>
       </div>
    </div>
  )
}
