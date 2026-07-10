import Link from 'next/link'
import { Settings } from 'lucide-react'
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
      >
        <Link
          href="/bookings/settings"
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-gray-600 hover:bg-gray-100 border border-gray-200"
        >
          <Settings size={13} />
          Booking rules
        </Link>
      </DashboardHeader>
      <BookingsDashboard initialBookings={bookings} />
    </div>
  )
}
