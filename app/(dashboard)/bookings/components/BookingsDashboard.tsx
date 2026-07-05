"use client"

import { useMemo, useState } from "react"
import { bookingsApi } from "@/lib/api"
import { Calendar, Check, X, UserCheck, RefreshCw, Plus, Clock, Users, Phone, Mail } from "lucide-react"

interface Booking {
  id: string
  business_id: string
  customer_name: string
  customer_email: string
  customer_phone: string
  party_size: number
  booking_date: string
  booking_time: string
  special_requests?: string | null
  status: 'pending' | 'confirmed' | 'seated' | 'completed' | 'cancelled' | 'no_show'
  confirmation_code?: string | null
  cancellation_reason?: string | null
  created_at: string
}

const STATUS_STYLE: Record<string, string> = {
  pending: 'bg-yellow-100 text-yellow-800',
  confirmed: 'bg-green-100 text-green-800',
  seated: 'bg-blue-100 text-blue-800',
  completed: 'bg-gray-100 text-gray-600',
  cancelled: 'bg-red-100 text-red-800',
  no_show: 'bg-orange-100 text-orange-800',
}

const STATUS_LABEL: Record<string, string> = {
  pending: 'Pending',
  confirmed: 'Confirmed',
  seated: 'Seated',
  completed: 'Completed',
  cancelled: 'Cancelled',
  no_show: 'No-show',
}

function toDateKey(d: Date) {
  return d.toISOString().split('T')[0]
}

function formatTime(time: string) {
  const [h, m] = time.split(':')
  const d = new Date()
  d.setHours(parseInt(h, 10), parseInt(m, 10))
  return d.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })
}

export default function BookingsDashboard({ initialBookings }: { initialBookings: Booking[] }) {
  const [bookings, setBookings] = useState<Booking[]>(initialBookings)
  const [weekStart, setWeekStart] = useState(() => {
    const d = new Date()
    d.setHours(0, 0, 0, 0)
    return d
  })
  const [selectedDate, setSelectedDate] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [actionId, setActionId] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [showNewForm, setShowNewForm] = useState(false)

  const refetch = async () => {
    setLoading(true)
    setError(null)
    try {
      const res = await bookingsApi.getBookings({ limit: 200 })
      setBookings(Array.isArray(res?.data) ? res.data : [])
    } catch (e: any) {
      setError(e.message || 'Failed to load bookings.')
    } finally {
      setLoading(false)
    }
  }

  const weekDays = useMemo(() => {
    return Array.from({ length: 7 }, (_, i) => {
      const d = new Date(weekStart)
      d.setDate(d.getDate() + i)
      return d
    })
  }, [weekStart])

  const countsByDate = useMemo(() => {
    const counts: Record<string, number> = {}
    for (const b of bookings) {
      counts[b.booking_date] = (counts[b.booking_date] || 0) + 1
    }
    return counts
  }, [bookings])

  const visibleBookings = useMemo(() => {
    const filtered = selectedDate ? bookings.filter(b => b.booking_date === selectedDate) : bookings
    return [...filtered].sort((a, b) => {
      if (a.booking_date !== b.booking_date) return a.booking_date.localeCompare(b.booking_date)
      return a.booking_time.localeCompare(b.booking_time)
    })
  }, [bookings, selectedDate])

  const runAction = async (id: string, action: () => Promise<any>) => {
    setActionId(id)
    setError(null)
    try {
      const res = await action()
      if (res?.success === false) throw new Error(res.error || 'Action failed')
      await refetch()
    } catch (e: any) {
      setError(e.message || 'Action failed.')
    } finally {
      setActionId(null)
    }
  }

  return (
    <div className="space-y-5">
      {error && (
        <div className="rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
          {error}
        </div>
      )}

      {/* Week strip */}
      <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-card">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <button
              onClick={() => { const d = new Date(weekStart); d.setDate(d.getDate() - 7); setWeekStart(d) }}
              className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-500"
            >
              ‹
            </button>
            <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
              {weekDays[0].toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} – {weekDays[6].toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
            </span>
            <button
              onClick={() => { const d = new Date(weekStart); d.setDate(d.getDate() + 7); setWeekStart(d) }}
              className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-500"
            >
              ›
            </button>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={refetch}
              disabled={loading}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-gray-600 hover:bg-gray-100 disabled:opacity-50"
            >
              <RefreshCw size={13} className={loading ? 'animate-spin' : ''} />
              Refresh
            </button>
            <button
              onClick={() => setShowNewForm(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-brand-500 text-white hover:bg-brand-600"
            >
              <Plus size={13} />
              New booking
            </button>
          </div>
        </div>

        <div className="grid grid-cols-7 gap-2">
          {weekDays.map(d => {
            const key = toDateKey(d)
            const isToday = key === toDateKey(new Date())
            const isSelected = selectedDate === key
            const count = countsByDate[key] || 0
            return (
              <button
                key={key}
                onClick={() => setSelectedDate(isSelected ? null : key)}
                className={`rounded-xl border p-2.5 text-center transition-colors ${
                  isSelected
                    ? 'bg-brand-500 border-brand-500 text-white'
                    : isToday
                      ? 'border-brand-200 bg-brand-50 text-gray-900'
                      : 'border-gray-100 bg-gray-50 text-gray-700 hover:bg-gray-100'
                }`}
              >
                <p className={`text-[10px] font-semibold uppercase tracking-wide ${isSelected ? 'text-white/80' : 'text-gray-400'}`}>
                  {d.toLocaleDateString('en-US', { weekday: 'short' })}
                </p>
                <p className="text-sm font-bold mt-0.5">{d.getDate()}</p>
                {count > 0 && (
                  <p className={`text-[10px] font-semibold mt-0.5 ${isSelected ? 'text-white' : 'text-brand-600'}`}>
                    {count}
                  </p>
                )}
              </button>
            )
          })}
        </div>
      </div>

      {/* New booking form */}
      {showNewForm && (
        <NewBookingForm
          onClose={() => setShowNewForm(false)}
          onCreated={async () => {
            setShowNewForm(false)
            await refetch()
          }}
        />
      )}

      {/* Booking list */}
      {visibleBookings.length === 0 ? (
        <div className="rounded-2xl border border-gray-200 bg-white p-10 text-center shadow-card">
          <Calendar className="mx-auto text-gray-300 mb-3" size={28} />
          <p className="text-sm font-semibold text-gray-500">
            {selectedDate ? 'No bookings for this day.' : 'No bookings yet.'}
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {visibleBookings.map(booking => (
            <div key={booking.id} className="rounded-2xl border border-gray-200 bg-white p-5 shadow-card">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h3 className="text-sm font-bold text-gray-900">{booking.customer_name}</h3>
                  <div className="flex flex-wrap items-center gap-x-3 gap-y-0.5 mt-1 text-xs text-gray-500">
                    <span className="flex items-center gap-1"><Mail size={11} />{booking.customer_email}</span>
                    <span className="flex items-center gap-1"><Phone size={11} />{booking.customer_phone}</span>
                  </div>
                </div>
                <span className={`px-2.5 py-1 rounded-full text-[11px] font-semibold shrink-0 ${STATUS_STYLE[booking.status] || 'bg-gray-100 text-gray-700'}`}>
                  {STATUS_LABEL[booking.status] || booking.status}
                </span>
              </div>

              <div className="flex flex-wrap gap-x-6 gap-y-2 mt-3 text-xs">
                <span className="flex items-center gap-1.5 text-gray-600">
                  <Clock size={13} className="text-gray-400" />
                  {new Date(booking.booking_date).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })} · {formatTime(booking.booking_time)}
                </span>
                <span className="flex items-center gap-1.5 text-gray-600">
                  <Users size={13} className="text-gray-400" />
                  {booking.party_size} guests
                </span>
                {booking.confirmation_code && (
                  <span className="font-mono text-gray-400">#{booking.confirmation_code}</span>
                )}
              </div>

              {booking.special_requests && (
                <p className="mt-3 pt-3 border-t border-gray-100 text-xs text-gray-600">
                  <span className="font-semibold text-gray-400 uppercase tracking-wide mr-1.5">Notes</span>
                  {booking.special_requests}
                </p>
              )}
              {booking.cancellation_reason && (
                <p className="mt-3 pt-3 border-t border-gray-100 text-xs text-red-600">
                  <span className="font-semibold uppercase tracking-wide mr-1.5">Cancelled</span>
                  {booking.cancellation_reason}
                </p>
              )}

              <div className="flex flex-wrap gap-2 mt-4 pt-4 border-t border-gray-100">
                {booking.status === 'pending' && (
                  <ActionButton
                    label="Confirm"
                    icon={<Check size={13} />}
                    color="bg-green-600 hover:bg-green-700"
                    disabled={actionId === booking.id}
                    onClick={() => runAction(booking.id, () => bookingsApi.confirmBooking(booking.id))}
                  />
                )}
                {booking.status === 'confirmed' && (
                  <ActionButton
                    label="Seat"
                    icon={<UserCheck size={13} />}
                    color="bg-blue-600 hover:bg-blue-700"
                    disabled={actionId === booking.id}
                    onClick={() => runAction(booking.id, () => bookingsApi.seatBooking(booking.id))}
                  />
                )}
                {booking.status === 'seated' && (
                  <ActionButton
                    label="Complete"
                    icon={<Check size={13} />}
                    color="bg-purple-600 hover:bg-purple-700"
                    disabled={actionId === booking.id}
                    onClick={() => runAction(booking.id, () => bookingsApi.completeBooking(booking.id))}
                  />
                )}
                {!['cancelled', 'completed', 'no_show'].includes(booking.status) && (
                  <>
                    <ActionButton
                      label="Cancel"
                      icon={<X size={13} />}
                      color="bg-red-600 hover:bg-red-700"
                      disabled={actionId === booking.id}
                      onClick={() => runAction(booking.id, () => bookingsApi.cancelBooking(booking.id))}
                    />
                    <ActionButton
                      label="No-show"
                      icon={<X size={13} />}
                      color="bg-orange-600 hover:bg-orange-700"
                      disabled={actionId === booking.id}
                      onClick={() => runAction(booking.id, () => bookingsApi.markNoShow(booking.id))}
                    />
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

function ActionButton({ label, icon, color, onClick, disabled }: {
  label: string
  icon: React.ReactNode
  color: string
  onClick: () => void
  disabled?: boolean
}) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-white transition-colors disabled:opacity-50 ${color}`}
    >
      {icon}
      {label}
    </button>
  )
}

function NewBookingForm({ onClose, onCreated }: { onClose: () => void; onCreated: () => void }) {
  const [form, setForm] = useState({
    customer_name: '',
    customer_email: '',
    customer_phone: '',
    party_size: 2,
    booking_date: toDateKey(new Date()),
    booking_time: '19:00',
    special_requests: '',
  })
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    setError(null)
    try {
      const res = await bookingsApi.createBooking(form)
      if (res?.success === false) throw new Error(res.error || 'Failed to create booking.')
      onCreated()
    } catch (e: any) {
      setError(e.message || 'Failed to create booking.')
    } finally {
      setSaving(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="rounded-2xl border border-gray-200 bg-white p-5 shadow-card space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-bold text-gray-900">New booking</h3>
        <button type="button" onClick={onClose} className="text-gray-400 hover:text-gray-700">
          <X size={16} />
        </button>
      </div>

      {error && <p className="text-xs font-medium text-red-600">{error}</p>}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <Field label="Customer name" required>
          <input required value={form.customer_name} onChange={e => setForm(f => ({ ...f, customer_name: e.target.value }))}
            className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm outline-none focus:border-brand-500" />
        </Field>
        <Field label="Phone" required>
          <input required value={form.customer_phone} onChange={e => setForm(f => ({ ...f, customer_phone: e.target.value }))}
            className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm outline-none focus:border-brand-500" />
        </Field>
        <Field label="Email" required>
          <input required type="email" value={form.customer_email} onChange={e => setForm(f => ({ ...f, customer_email: e.target.value }))}
            className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm outline-none focus:border-brand-500" />
        </Field>
        <Field label="Party size" required>
          <input required type="number" min={1} value={form.party_size} onChange={e => setForm(f => ({ ...f, party_size: parseInt(e.target.value, 10) || 1 }))}
            className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm outline-none focus:border-brand-500" />
        </Field>
        <Field label="Date" required>
          <input required type="date" value={form.booking_date} onChange={e => setForm(f => ({ ...f, booking_date: e.target.value }))}
            className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm outline-none focus:border-brand-500" />
        </Field>
        <Field label="Time" required>
          <input required type="time" value={form.booking_time} onChange={e => setForm(f => ({ ...f, booking_time: e.target.value }))}
            className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm outline-none focus:border-brand-500" />
        </Field>
      </div>

      <Field label="Special requests">
        <textarea value={form.special_requests} onChange={e => setForm(f => ({ ...f, special_requests: e.target.value }))}
          rows={2} className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm outline-none focus:border-brand-500" />
      </Field>

      <div className="flex justify-end gap-2 pt-1">
        <button type="button" onClick={onClose} className="px-4 py-2 rounded-lg text-xs font-semibold text-gray-600 hover:bg-gray-100">
          Cancel
        </button>
        <button type="submit" disabled={saving} className="px-4 py-2 rounded-lg text-xs font-semibold bg-brand-500 text-white hover:bg-brand-600 disabled:opacity-50">
          {saving ? 'Saving…' : 'Create booking'}
        </button>
      </div>
    </form>
  )
}

function Field({ label, required, children }: { label: string; required?: boolean; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="text-xs font-semibold text-gray-700">{label}{required && <span className="text-red-500 ml-0.5">*</span>}</span>
      <div className="mt-1">{children}</div>
    </label>
  )
}
