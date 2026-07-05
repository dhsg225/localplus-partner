import { bookingsApi } from '@/lib/api.server'
import DashboardHeader from '@/components/DashboardHeader'
import BookingsDashboard from './components/BookingsDashboard'

export default async function BookingsPage() {
  const res = await bookingsApi.getBookings({ limit: 200 })
  const bookings = Array.isArray(res?.data) ? res.data : []

  return (
    <div className="space-y-6">
      <DashboardHeader
        title="Bookings"
        subtitle="Manage reservations and guest requests."
      />
      <BookingsDashboard initialBookings={bookings} />
    </div>
  )
}
