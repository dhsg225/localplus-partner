import { eventsApi, organizationApi } from '@/lib/api'
import DashboardHeader from '@/components/DashboardHeader'
import BookingInstanceExplorer from './components/BookingInstanceExplorer'
import AIDiscoveryInsights from '@/app/(dashboard)/events/components/AIDiscoveryInsights'

export default async function BookingsPage() {
  const businessId = await organizationApi.getPartnerBusiness()
  
  if (!businessId) {
    return (
       <div className="bg-red-50 border border-red-100 p-8 rounded-[32px] text-center">
         <h2 className="text-xl font-black text-red-900 italic mb-2">Organization Required.</h2>
         <p className="text-red-700 font-medium">We couldn't link your account to a partner business. Please contact support.</p>
       </div>
    )
  }

  // Fetch instances for the next 7 days for the initial view
  const startDate = new Date().toISOString()
  const endDate = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString()

  const response = await eventsApi.getInstances({
    organizationId: businessId,
    startDate,
    endDate,
    limit: 100
  })

  const instances = Array.isArray(response.data) ? response.data : []

  return (
    <div className="space-y-8 pb-20">
      <DashboardHeader 
        title="Booking Control Management" 
        subtitle="Manage transactional operational instances"
      />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        <div className="lg:col-span-8">
           <BookingInstanceExplorer initialInstances={instances} businessId={businessId} />
        </div>
        <div className="lg:col-span-4 sticky top-32 h-fit">
           <AIDiscoveryInsights organizationId={businessId} />
        </div>
      </div>
    </div>
  )
}
