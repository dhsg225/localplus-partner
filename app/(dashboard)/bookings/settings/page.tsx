import { restaurantSettingsApi } from '@/lib/api.server'
import DashboardHeader from '@/components/DashboardHeader'
import BookingSettingsForm from './components/BookingSettingsForm'

export default async function BookingSettingsPage() {
  const res = await restaurantSettingsApi.getSettings()
  const settings = res?.data ?? null

  return (
    <div className="space-y-6">
      <DashboardHeader
        title="Booking rules"
        subtitle="Control whether you're taking bookings and the limits guests can book within."
      />
      <BookingSettingsForm initialSettings={settings} />
    </div>
  )
}
