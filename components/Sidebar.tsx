'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { 
  Building2, 
  Calendar, 
  Menu, 
  TrendingUp, 
  Megaphone, 
  Star, 
  LayoutDashboard,
  LogOut,
  MapPin,
  Users,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  Settings2,
  Home,
  Briefcase,
  Layers,
  Utensils,
  Bed,
  Activity,
  Ticket,
  Globe,
  Wrench,
  Bell,
  MessageSquare
} from 'lucide-react'
import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'
import { createClient } from '@/lib/supabase/client'

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

type Perspective = 'Global' | 'Restaurant' | 'Hotel' | 'Event Organizer' | 'Service Provider' | 'Activities' | 'Attractions'

interface NavItem {
  name: string
  href: string
  icon: any
  perspectives?: Perspective[]
  subItems?: NavItem[]
  isEmoji?: boolean
}

const navItems: NavItem[] = [
  { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { 
    name: 'Events', 
    href: '/events', 
    icon: () => <span className="text-lg">🎟️</span>,
    perspectives: ['Global', 'Event Organizer', 'Activities', 'Attractions'],
    isEmoji: true,
    subItems: [
      { name: 'STRATEGY HUB', href: '/events', icon: Layers },
      { name: 'TACTICS & TAXONOMY', href: '/events/taxonomy', icon: Settings2 },
      { name: 'LIVE VENUES', href: '/events/venues', icon: Home },
      { name: 'SERVICE ROSTERS', href: '/events/staff', icon: Briefcase },
    ]
  },
  { 
    name: 'Tickets', 
    href: '/events/tickets', 
    icon: () => <span className="text-lg">🎫</span>, 
    perspectives: ['Global', 'Event Organizer'],
    isEmoji: true
  },
  { 
    name: 'Reviews', 
    href: '/events/reviews', 
    icon: () => <span className="text-lg">⭐</span>, 
    perspectives: ['Global', 'Event Organizer', 'Restaurant', 'Hotel'],
    isEmoji: true
  },
  { 
    name: 'Notifications', 
    href: '/events/notifications', 
    icon: () => <span className="text-lg">🔔</span>, 
    perspectives: ['Global', 'Event Organizer'],
    isEmoji: true
  },
  { name: 'MICE Cloud', href: '/mice', icon: MapPin, perspectives: ['Global', 'Event Organizer'] },
  { name: 'Business Data', href: '/business', icon: Building2 },
  { name: 'Loyalty', href: '/loyalty', icon: Star, perspectives: ['Global', 'Restaurant', 'Hotel', 'Activities'] },
  { name: 'Advertising', href: '/advertising', icon: Megaphone },
  { name: 'Analytics', href: '/analytics', icon: TrendingUp },
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

export default function Sidebar({ user }: { user: any }) {
  const pathname = usePathname()
  const supabase = createClient()
  const [isCollapsed, setIsCollapsed] = useState(false)
  const [expandedItems, setExpandedItems] = useState<string[]>(['Events'])
  const [activePerspective, setActivePerspective] = useState<Perspective>('Global')
  const [showPerspectivePicker, setShowPerspectivePicker] = useState(false)

  // Load perspective preference
  useEffect(() => {
    const saved = localStorage.getItem('lp_active_perspective') as Perspective
    if (saved && perspectives.some(p => p.name === saved)) {
      setActivePerspective(saved)
    }
  }, [])

  // Save perspective preference
  const handlePerspectiveChange = (p: Perspective) => {
    setActivePerspective(p)
    localStorage.setItem('lp_active_perspective', p)
    setShowPerspectivePicker(false)
  }

  async function handleSignOut() {
    await supabase.auth.signOut()
    window.location.href = '/'
  }

  const toggleExpand = (name: string) => {
    setExpandedItems(prev => 
      prev.includes(name) ? prev.filter(i => i !== name) : [...prev, name]
    )
  }

  const currentPerspective = perspectives.find(p => p.name === activePerspective) || perspectives[0]
  const PerspectiveIcon = currentPerspective.icon

  // Filter items based on active perspective
  const filteredNavItems = navItems.filter(item => 
    !item.perspectives || item.perspectives.includes(activePerspective)
  )

  return (
    <aside className={cn(
      "border-r border-gray-200 bg-white flex flex-col shrink-0 transition-all duration-300 relative",
      isCollapsed ? "w-20" : "w-64"
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
        "p-6 border-b border-gray-100 flex flex-col transition-all overflow-hidden relative",
        isCollapsed ? "justify-center p-4 h-[88px]" : "items-start h-[160px] justify-center"
      )}>
        <button 
          onClick={() => !isCollapsed && setShowPerspectivePicker(!showPerspectivePicker)}
          className={cn(
            "flex items-center space-x-3 w-full group transition-all rounded-[24px]",
            !isCollapsed && "hover:bg-gray-50 p-4 -m-4 bg-white shadow-sm border border-gray-100"
          )}
        >
          <div className={cn(
            "w-10 h-10 rounded-[18px] flex items-center justify-center shrink-0 shadow-lg transition-transform group-hover:scale-105",
            currentPerspective.color
          )}>
            <PerspectiveIcon size={20} className="text-white" />
          </div>
          {!isCollapsed && (
            <div className="flex-1 text-left">
              <span className="block font-outfit font-black text-sm tracking-tight text-gray-900 leading-none mb-1 animate-in fade-in slide-in-from-left-2 uppercase italic">
                {activePerspective}
              </span>
              <span className="block text-[9px] font-bold text-gray-400 uppercase tracking-widest leading-none">Management View.</span>
            </div>
          )}
          {!isCollapsed && <ChevronDown size={14} className={cn("text-gray-400 transition-transform", showPerspectivePicker && "rotate-180")} />}
        </button>

        {/* Perspective Picker Overlay */}
        {showPerspectivePicker && !isCollapsed && (
          <div className="absolute top-[120px] left-4 right-4 bg-white border border-gray-100 rounded-[32px] shadow-2xl z-[100] p-3 animate-in zoom-in-95 duration-200 border-t-4 border-t-red-500">
             <div className="flex items-center justify-between px-3 py-2 border-b border-gray-50 mb-2">
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Select Operational Perspective</p>
                <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
             </div>
             <div className="space-y-1 max-h-[400px] overflow-y-auto pr-1">
                {perspectives.map(p => {
                  const Icon = p.icon
                  const isActive = activePerspective === p.name
                  return (
                    <button
                      key={p.name}
                      onClick={() => handlePerspectiveChange(p.name)}
                      className={cn(
                        "w-full flex items-center space-x-4 px-3 py-3 rounded-2xl text-[11px] font-black uppercase tracking-wide transition-all",
                        isActive ? "bg-red-50 text-red-600 italic" : "text-gray-500 hover:bg-gray-50 hover:text-gray-900"
                      )}
                    >
                      <div className={cn("p-2 rounded-xl text-white shadow-md", p.color)}>
                        <Icon size={16} />
                      </div>
                      <span>{p.name}.</span>
                    </button>
                  )
                })}
             </div>
          </div>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto p-4 space-y-2 scrollbar-hide">
        {filteredNavItems.map((item) => {
          const isActive = pathname === item.href || (item.href !== '/dashboard' && pathname.startsWith(item.href))
          const isExpanded = expandedItems.includes(item.name)
          const Icon = item.icon
          const hasSubItems = item.subItems && item.subItems.length > 0
          
          return (
            <div key={item.name} className="space-y-1">
              <div 
                className={cn(
                  "flex items-center justify-between px-4 py-3 rounded-[20px] text-[12px] font-black uppercase tracking-tight transition-all group cursor-pointer",
                  isActive && !hasSubItems
                    ? "bg-red-50 text-red-600 shadow-sm border border-red-100/50" 
                    : "text-gray-500 hover:bg-gray-50 hover:text-gray-900 border border-transparent"
                )}
                onClick={() => {
                  if (hasSubItems) toggleExpand(item.name)
                }}
              >
                <Link 
                  href={item.href} 
                  className="flex items-center flex-1 space-x-4"
                  onClick={(e) => {
                    if (hasSubItems) e.stopPropagation();
                  }}
                >
                  <div className={cn(
                    "transition-all shrink-0",
                    isActive ? "scale-110" : "group-hover:scale-110"
                  )}>
                    {typeof Icon === 'function' ? <Icon /> : <Icon size={20} className={cn(
                      "transition-colors",
                      isActive ? "text-red-600" : "text-gray-400 group-hover:text-gray-600"
                    )} />}
                  </div>
                  {!isCollapsed && (
                    <span className="animate-in fade-in slide-in-from-left-1">{item.name}</span>
                  )}
                </Link>
                
                {hasSubItems && !isCollapsed && (
                  <ChevronDown 
                    size={14} 
                    className={cn(
                      "transition-transform text-gray-300",
                      isExpanded ? "rotate-180" : ""
                    )} 
                  />
                )}
              </div>

              {/* Sub Items */}
              {hasSubItems && isExpanded && !isCollapsed && (
                <div className="ml-8 pl-6 border-l-2 border-gray-50 space-y-1 animate-in slide-in-from-top-2">
                   {item.subItems.map(subItem => {
                     const isSubActive = pathname === subItem.href
                     const SubIcon = subItem.icon
                     return (
                       <Link
                         key={subItem.name}
                         href={subItem.href}
                         className={cn(
                           "flex items-center space-x-3 px-3 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all",
                           isSubActive ? "text-red-600 italic bg-red-50" : "text-gray-400 hover:text-gray-700 hover:translate-x-1"
                         )}
                       >
                         <SubIcon size={14} className={isSubActive ? "text-red-600" : "text-gray-300"} />
                         <span>{subItem.name}</span>
                       </Link>
                     )
                   })}
                </div>
              )}
            </div>
          )
        })}
      </nav>

      {/* Account Section */}
      <div className="p-4 border-t border-gray-100">
        {!isCollapsed ? (
          <div className="bg-gray-50 rounded-[24px] p-5 mb-4 animate-in fade-in zoom-in-95 border border-gray-100 shadow-sm">
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-3 pl-1 italic">Identity Portal.</p>
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-2xl bg-white border border-gray-200 shadow-sm flex items-center justify-center text-sm font-black text-gray-900 shrink-0 capitalize">
                {user.email?.[0].toUpperCase()}
              </div>
              <div className="flex-1 truncate">
                <p className="text-[11px] font-black text-gray-900 truncate uppercase italic">{user.email?.split('@')[0]}</p>
                <p className="text-[8px] font-black text-red-500 uppercase tracking-tighter bg-red-50 px-2 py-0.5 rounded-full inline-block mt-1">v7.0.0 Global</p>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex justify-center mb-4">
            <div className="w-9 h-9 rounded-xl bg-red-50 border border-red-100 flex items-center justify-center text-xs font-black text-red-600 capitalize">
              {user.email?.[0].toUpperCase()}
            </div>
          </div>
        )}

        <button 
          onClick={handleSignOut}
          className={cn(
            "flex items-center px-4 py-3.5 rounded-[20px] text-[11px] font-black uppercase tracking-widest text-gray-400 hover:bg-red-50 hover:text-red-600 transition-all group w-full",
            isCollapsed ? "justify-center" : "space-x-4"
          )}
        >
          <LogOut size={20} className="text-gray-300 group-hover:text-red-600 shrink-0" />
          {!isCollapsed && <span>End Session</span>}
        </button>
      </div>
    </aside>
  )
}
