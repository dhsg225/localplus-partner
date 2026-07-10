"use client"

import { useState } from "react"
import { restaurantSettingsApi } from "@/lib/api"
import { Check } from "lucide-react"

interface Settings {
  booking_enabled: boolean
  min_party_size: number
  max_party_size: number
  advance_booking_days: number
}

const DEFAULTS: Settings = {
  booking_enabled: true,
  min_party_size: 1,
  max_party_size: 12,
  advance_booking_days: 30,
}

export default function BookingSettingsForm({ initialSettings }: { initialSettings: Partial<Settings> | null }) {
  const [form, setForm] = useState<Settings>({ ...DEFAULTS, ...initialSettings })
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [saved, setSaved] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    setError(null)
    setSaved(false)
    try {
      const res = await restaurantSettingsApi.updateSettings(form)
      if (res?.success === false) throw new Error(res.error || 'Failed to save settings.')
      if (res?.data) setForm({ ...DEFAULTS, ...res.data })
      setSaved(true)
      setTimeout(() => setSaved(false), 2500)
    } catch (e: any) {
      setError(e.message || 'Failed to save settings.')
    } finally {
      setSaving(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="rounded-2xl border border-gray-200 bg-white p-5 shadow-card space-y-5 max-w-xl">
      {error && (
        <div className="rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
          {error}
        </div>
      )}

      <div className="flex items-start justify-between gap-4 pb-4 border-b border-gray-100">
        <div>
          <h3 className="text-sm font-bold text-gray-900">Accepting bookings</h3>
          <p className="text-xs text-gray-500 mt-0.5">
            Turn off temporarily for a holiday, private event, or full closure — existing bookings are unaffected.
          </p>
        </div>
        <button
          type="button"
          role="switch"
          aria-checked={form.booking_enabled}
          onClick={() => setForm(f => ({ ...f, booking_enabled: !f.booking_enabled }))}
          className={`relative shrink-0 w-11 h-6 rounded-full transition-colors ${form.booking_enabled ? 'bg-brand-500' : 'bg-gray-300'}`}
        >
          <span className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform ${form.booking_enabled ? 'translate-x-5' : ''}`} />
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Field label="Minimum party size" hint="Smallest booking guests can make">
          <input
            type="number" min={1} value={form.min_party_size}
            onChange={e => setForm(f => ({ ...f, min_party_size: parseInt(e.target.value, 10) || 1 }))}
            className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm outline-none focus:border-brand-500"
          />
        </Field>
        <Field label="Maximum party size" hint="Largest booking guests can make">
          <input
            type="number" min={1} value={form.max_party_size}
            onChange={e => setForm(f => ({ ...f, max_party_size: parseInt(e.target.value, 10) || 1 }))}
            className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm outline-none focus:border-brand-500"
          />
        </Field>
        <Field label="Advance booking window (days)" hint="How far ahead guests can book">
          <input
            type="number" min={0} value={form.advance_booking_days}
            onChange={e => setForm(f => ({ ...f, advance_booking_days: parseInt(e.target.value, 10) || 0 }))}
            className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm outline-none focus:border-brand-500"
          />
        </Field>
      </div>

      {form.min_party_size > form.max_party_size && (
        <p className="text-xs font-medium text-red-600">Minimum party size can't be greater than the maximum.</p>
      )}

      <div className="flex items-center justify-end gap-3 pt-1">
        {saved && (
          <span className="flex items-center gap-1 text-xs font-semibold text-green-600">
            <Check size={13} /> Saved
          </span>
        )}
        <button
          type="submit"
          disabled={saving || form.min_party_size > form.max_party_size}
          className="px-4 py-2 rounded-lg text-xs font-semibold bg-brand-500 text-white hover:bg-brand-600 disabled:opacity-50"
        >
          {saving ? 'Saving…' : 'Save changes'}
        </button>
      </div>
    </form>
  )
}

function Field({ label, hint, children }: { label: string; hint?: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="text-xs font-semibold text-gray-700">{label}</span>
      {hint && <span className="block text-[11px] text-gray-400 mt-0.5">{hint}</span>}
      <div className="mt-1">{children}</div>
    </label>
  )
}
