import { eventsApi, organizationApi } from '@/lib/api'
import DashboardHeader from '@/components/DashboardHeader'
import EventsList from './components/EventsList'
import CreateEventButton from './components/CreateEventButton'

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

  // Load events (Server Side)
  const response = await eventsApi.getEvents({
    ...(!isSuperAdmin && { businessId }),
    ...(!isSuperAdmin && { status: 'published' }),
    limit: 100
  })

  // Normalize data safely
  const events = Array.isArray(response.data) ? response.data : response?.data?.data || []

  return (
    <div className="space-y-6">
      <DashboardHeader 
        title="Event Operations" 
        subtitle="Operational reach & performance engine"
      >
        <CreateEventButton />
      </DashboardHeader>

      <EventsList initialEvents={events} />
    </div>
  )
}
