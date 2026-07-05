'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  Building2,
  Calendar,
  TrendingUp,
  Megaphone,
  Star,
  LayoutDashboard,
  LogOut,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  Utensils,
  Bed,
  Activity,
  Ticket,
  Globe,
  Wrench,
  Bell,
  LayoutGrid,
} from 'lucide-react'
import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'
import { createClient } from '@/lib/supabase/client'

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

const NAV_ACRONYMS = ['MICE', 'ROI']

function toTitleCase(str: string) {
  const titled = str
    .toLowerCase()
    .replace(/\b\w/g, (c) => c.toUpperCase())
  return NAV_ACRONYMS.reduce(
    (s, acronym) => s.replace(new RegExp(`\\b${acronym[0]}${acronym.slice(1).toLowerCase()}\\b`, 'g'), acronym),
    titled
  )
}

type Perspective = 'Global' | 'Restaurant' | 'Hotel' | 'Event Organizer' | 'Service Provider' | 'Activities' | 'Attractions'

interface NavItem {
  name: string
  href: string
  icon: any
  perspectives?: Perspective[]
  section?: string
}

// Events and Business Data used to carry nested sub-item dropdowns (Strategy Hub, Tactics &
// Taxonomy, Canonical Profile, etc.). Flattened to single links — those destinations are now
// reached via in-page tabs on their landing pages (see components/SectionTabs.tsx) instead of
// a nested sidebar tree, to keep the rail's item count close to the approved design direction.
const navItems: NavItem[] = [
  { name: 'DASHBOARD', href: '/dashboard', icon: LayoutDashboard },
  {
    name: 'EVENTS',
    href: '/events',
    icon: Calendar,
    perspectives: ['Global', 'Event Organizer', 'Activities', 'Attractions'],
    section: 'Events',
  },
  {
    name: 'TICKETS',
    href: '/events/tickets',
    icon: Ticket,
    perspectives: ['Global', 'Event Organizer'],
    section: 'Events',
  },
  {
    name: 'REVIEWS',
    href: '/events/reviews',
    icon: Star,
    perspectives: ['Global', 'Event Organizer', 'Restaurant', 'Hotel'],
    section: 'Events',
  },
  {
    name: 'NOTIFICATIONS',
    href: '/events/notifications',
    icon: Bell,
    perspectives: ['Global', 'Event Organizer'],
    section: 'Events',
  },
  { name: 'MICE CLOUD', href: '/mice', icon: Globe, perspectives: ['Global', 'Event Organizer'], section: 'Events' },
  { name: 'BUSINESS DATA', href: '/business/profile', icon: Building2, section: 'Business' },
  { name: 'LOYALTY', href: '/loyalty', icon: Star, perspectives: ['Global', 'Restaurant', 'Hotel', 'Activities'], section: 'Business' },
  { name: 'ADVERTISING', href: '/advertising', icon: Megaphone, section: 'Business' },
  { name: 'ANALYTICS', href: '/analytics', icon: TrendingUp, section: 'Business' },
]

const perspectives: { name: Perspective; icon: any; color: string }[] = [
  { name: 'Global', icon: Globe, color: 'bg-blue-600' },
  { name: 'Restaurant', icon: Utensils, color: 'bg-orange-500' },
  { name: 'Hotel', icon: Bed, color: 'bg-indigo-600' },
  { name: 'Event Organizer', icon: Calendar, color: 'bg-red-600' },
  { name: 'Service Provider', icon: Wrench, color: 'bg-gray-700' },
  { name: 'Activities', icon: Activity, color: 'bg-green-600' },
  { name: 'Attractions', icon: Ticket, color: 'bg-purple-600' },
]

// Maps free-text businesses.business_type(s) values onto the fixed Perspective values.
// Unrecognized values are dropped (not guessed at) — this must tolerate whatever
// casing/format the data is in, and a business can legitimately have more than one.
function normalizeBusinessTypes(raw: string[]): Perspective[] {
  const map: Record<string, Perspective> = {
    restaurant: 'Restaurant',
    cafe: 'Restaurant',
    bar: 'Restaurant',
    hotel: 'Hotel',
    accommodation: 'Hotel',
    event_organizer: 'Event Organizer',
    events: 'Event Organizer',
    service_provider: 'Service Provider',
    service: 'Service Provider',
    activity: 'Activities',
    activities: 'Activities',
    attraction: 'Attractions',
    attractions: 'Attractions',
  }
  const out: Perspective[] = []
  for (const value of raw) {
    if (!value) continue
    const key = value.toLowerCase().trim().replace(/[\s_-]+/g, '_')
    const mapped = map[key]
    if (mapped && !out.includes(mapped)) out.push(mapped)
  }
  return out
}

export default function Sidebar({ user, businessTypes }: { user: any, businessTypes?: string[] }) {
  const pathname = usePathname()
  const supabase = createClient()
  const [isCollapsed, setIsCollapsed] = useState(false)
  const businessPerspectives = normalizeBusinessTypes(businessTypes ?? [])

  // A business can be more than one thing (a hotel that also runs a restaurant and hosts
  // events) — by default we show the union of everything relevant to any of its real types,
  // not just one. `focusOverride` is an optional, explicit narrowing — either a partner
  // temporarily focusing on one facet, or a super-admin previewing a single type.
  const [focusOverride, setFocusOverride] = useState<Perspective | null>(null)
  const [showPerspectivePicker, setShowPerspectivePicker] = useState(false)

  useEffect(() => {
    const saved = localStorage.getItem('lp_active_perspective') as Perspective
    if (saved && perspectives.some(p => p.name === saved)) {
      setFocusOverride(saved)
    }
  }, [])

  const handlePerspectiveChange = (p: Perspective) => {
    setFocusOverride(p)
    localStorage.setItem('lp_active_perspective', p)
    setShowPerspectivePicker(false)
  }

  const handleClearFocus = () => {
    setFocusOverride(null)
    localStorage.removeItem('lp_active_perspective')
    setShowPerspectivePicker(false)
  }

  async function handleSignOut() {
    await supabase.auth.signOut()
    window.location.href = '/'
  }

  // Everything relevant to the effective set of perspectives is shown — union, not a single
  // active mode. Falls back to 'Global' (show everything) if we don't know any real type.
  const effectivePerspectives: Perspective[] = focusOverride
    ? [focusOverride]
    : businessPerspectives.length > 0
      ? businessPerspectives
      : ['Global']

  let displayPerspective: { name: string; icon: any; color: string }
  if (focusOverride) {
    displayPerspective = perspectives.find(p => p.name === focusOverride)!
  } else if (businessPerspectives.length === 1) {
    displayPerspective = perspectives.find(p => p.name === businessPerspectives[0])!
  } else if (businessPerspectives.length > 1) {
    displayPerspective = {
      name: businessPerspectives.length <= 2 ? businessPerspectives.join(' + ') : 'All types',
      icon: LayoutGrid,
      color: 'bg-blue-600',
    }
  } else {
    displayPerspective = perspectives.find(p => p.name === 'Global')!
  }
  const PerspectiveIcon = displayPerspective.icon

  const filteredNavItems = navItems.filter(item =>
    !item.perspectives || item.perspectives.some(p => effectivePerspectives.includes(p))
  )

  return (
    <aside className={cn(
      "border-r border-gray-200 bg-white flex flex-col shrink-0 transition-all duration-300 relative",
      isCollapsed ? "w-20" : "w-56"
    )}>
      {/* Toggle Button */}
      <button
        onClick={() => setIsCollapsed(!isCollapsed)}
        className="absolute -right-3 top-10 bg-white border border-gray-200 rounded-full p-1 shadow-sm hover:shadow-md transition-shadow z-50 text-gray-400 hover:text-gray-900"
      >
        {isCollapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
      </button>

      {/* Header & Perspective Switcher */}
      <div className={cn(
        "p-5 pb-3 border-b border-gray-100 flex flex-col gap-3 transition-all relative z-[100]",
        isCollapsed ? "items-center p-3" : "items-start"
      )}>
        <div className={cn("flex items-center gap-2", isCollapsed && "justify-center")}>
          <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-brand-500 to-brand-300 flex items-center justify-center text-white font-bold text-[11px] shrink-0">
            L+
          </div>
          {!isCollapsed && (
            <div className="leading-none">
              <div className="text-[14px] font-bold text-gray-900 tracking-tight">LocalPlus</div>
              <div className="text-[9px] font-semibold text-gray-400 uppercase tracking-wide mt-0.5">Partners</div>
            </div>
          )}
        </div>

        <button
          onClick={() => !isCollapsed && setShowPerspectivePicker(!showPerspectivePicker)}
          className={cn(
            "flex items-center space-x-2.5 w-full group transition-all rounded-xl border border-transparent",
            !isCollapsed && "hover:bg-gray-50 hover:border-gray-100 p-2.5 -m-2.5"
          )}
        >
          <div className={cn(
            "w-8 h-8 rounded-lg flex items-center justify-center shrink-0 shadow-sm transition-transform group-hover:scale-105",
            displayPerspective.color
          )}>
            <PerspectiveIcon size={16} className="text-white" />
          </div>
          {!isCollapsed && (
            <div className="flex-1 text-left min-w-0">
              <span className="block font-semibold text-[13px] tracking-tight text-gray-900 leading-none mb-0.5 truncate">
                {displayPerspective.name}
              </span>
              <span className="block text-[9px] font-medium text-gray-400 uppercase tracking-wide leading-none">
                {focusOverride ? 'Focused view' : 'Management view'}
              </span>
            </div>
          )}
          {!isCollapsed && <ChevronDown size={13} className={cn("text-gray-400 transition-transform shrink-0", showPerspectivePicker && "rotate-180")} />}
        </button>

        {/* Perspective Picker Overlay */}
        {showPerspectivePicker && !isCollapsed && (
          <div className="absolute top-[112px] left-3 right-3 bg-white border border-gray-100 rounded-xl shadow-2xl z-[100] p-2 animate-in zoom-in-95 duration-200 border-t-4 border-t-brand-500">
             <div className="flex items-center justify-between px-2 py-1.5 border-b border-gray-50 mb-1">
                <p className="text-[9px] font-semibold text-gray-400 uppercase tracking-wide">Focus view</p>
                <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
             </div>
             <div className="space-y-0.5 max-h-[360px] overflow-y-auto pr-1 scrollbar-hide">
                {businessPerspectives.length > 1 && (
                  <button
                    onClick={handleClearFocus}
                    className={cn(
                      "w-full flex items-center space-x-3 px-2.5 py-2 rounded-lg text-[13px] font-medium transition-all text-left",
                      !focusOverride ? "bg-brand-50 text-brand-700 font-semibold" : "text-gray-500 hover:bg-gray-50 hover:text-gray-900"
                    )}
                  >
                    <div className="p-1.5 rounded-md text-white bg-blue-600">
                      <LayoutGrid size={14} />
                    </div>
                    <span>Show all ({businessPerspectives.join(' + ')})</span>
                  </button>
                )}
                {perspectives.map(p => {
                  const Icon = p.icon
                  const isActive = focusOverride === p.name
                  return (
                    <button
                      key={p.name}
                      onClick={() => handlePerspectiveChange(p.name)}
                      className={cn(
                        "w-full flex items-center space-x-3 px-2.5 py-2 rounded-lg text-[13px] font-medium transition-all text-left",
                        isActive ? "bg-brand-50 text-brand-700 font-semibold" : "text-gray-500 hover:bg-gray-50 hover:text-gray-900"
                      )}
                    >
                      <div className={cn("p-1.5 rounded-md text-white", p.color)}>
                        <Icon size={14} />
                      </div>
                      <span>{p.name}</span>
                      {businessPerspectives.includes(p.name) && (
                        <span className="ml-auto text-[9px] font-semibold text-gray-400 uppercase">Yours</span>
                      )}
                    </button>
                  )
                })}
             </div>
          </div>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto p-3 space-y-0.5 scrollbar-hide">
        {filteredNavItems.map((item, idx) => {
          const isActive = pathname === item.href || (item.href !== '/dashboard' && pathname.startsWith(item.href))
          const Icon = item.icon
          const prevSection = filteredNavItems[idx - 1]?.section
          const showSectionLabel = !isCollapsed && item.section && item.section !== prevSection

          return (
            <div key={item.name}>
              {showSectionLabel && (
                <p className="px-3 pt-3 pb-1 text-[10px] font-bold text-gray-400 uppercase tracking-wide">
                  {item.section}
                </p>
              )}
              <Link
                href={item.href}
                className={cn(
                  "flex items-center space-x-2.5 px-3 py-2 rounded-lg text-[13px] transition-all group",
                  isActive
                    ? "bg-brand-50 text-brand-700 font-semibold"
                    : "text-gray-600 font-medium hover:bg-gray-50 hover:text-gray-900"
                )}
              >
                <Icon size={18} className={cn(
                  "transition-colors shrink-0",
                  isActive ? "text-brand-600" : "text-gray-400 group-hover:text-gray-600"
                )} />
                {!isCollapsed && <span>{toTitleCase(item.name)}</span>}
              </Link>
            </div>
          )
        })}
      </nav>

      {/* Account Section */}
      <div className="p-3 border-t border-gray-100">
        {!isCollapsed ? (
          <div className="bg-gray-50 rounded-xl p-3.5 mb-3 border border-gray-100">
            <p className="text-[9px] font-semibold text-gray-400 uppercase tracking-wide mb-2">Identity portal</p>
            <div className="flex items-center space-x-2.5">
              <div className="w-8 h-8 rounded-lg bg-white border border-gray-200 flex items-center justify-center text-xs font-bold text-gray-900 shrink-0 capitalize">
                {user.email?.[0].toUpperCase()}
              </div>
              <div className="flex-1 truncate">
                <p className="text-[11px] font-semibold text-gray-900 truncate">{user.email?.split('@')[0]}</p>
                <p className="text-[9px] font-semibold text-brand-600 bg-brand-50 px-1.5 py-0.5 rounded-md inline-block mt-0.5">v7.0.0 Global</p>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex justify-center mb-3">
            <div className="w-8 h-8 rounded-lg bg-brand-50 border border-brand-100 flex items-center justify-center text-xs font-bold text-brand-600 capitalize">
              {user.email?.[0].toUpperCase()}
            </div>
          </div>
        )}

        <button
          onClick={handleSignOut}
          className={cn(
            "flex items-center px-3 py-2.5 rounded-lg text-[12px] font-medium text-gray-500 hover:bg-brand-50 hover:text-brand-600 transition-all group w-full",
            isCollapsed ? "justify-center" : "space-x-2.5"
          )}
        >
          <LogOut size={18} className="text-gray-400 group-hover:text-brand-600 shrink-0" />
          {!isCollapsed && <span>End session</span>}
        </button>
      </div>
    </aside>
  )
}
