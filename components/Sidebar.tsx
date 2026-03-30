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
  Wrench
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
}

const navItems: NavItem[] = [
  { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { 
    name: 'Events', 
    href: '/events', 
    icon: Calendar,
    perspectives: ['Global', 'Event Organizer', 'Activities', 'Attractions'],
    subItems: [
      { name: 'Strategy Hub', href: '/events', icon: Layers },
      { name: 'Tactics & Taxonomy', href: '/events/taxonomy', icon: Settings2 },
      { name: 'Live Venues', href: '/events/venues', icon: Home },
      { name: 'Service Rosters', href: '/events/staff', icon: Briefcase },
      { name: 'Tickets & Sales', href: '/events/tickets', icon: Star },
      { name: 'Strategy Reviews', href: '/events/reviews', icon: TrendingUp },
      { name: 'System Notifications', href: '/events/notifications', icon: Megaphone },
    ]
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
        isCollapsed ? "items-center" : "items-start"
      )}>
        <button 
          onClick={() => !isCollapsed && setShowPerspectivePicker(!showPerspectivePicker)}
          className={cn(
            "flex items-center space-x-3 w-full group transition-all rounded-xl",
            !isCollapsed && "hover:bg-gray-50 p-2 -m-2"
          )}
        >
          <div className={cn(
            "w-9 h-9 rounded-xl flex items-center justify-center shrink-0 shadow-lg transition-transform group-hover:scale-105",
            currentPerspective.color
          )}>
            <PerspectiveIcon size={20} className="text-white" />
          </div>
          {!isCollapsed && (
            <div className="flex-1 text-left">
              <span className="block font-outfit font-black text-sm tracking-tight text-gray-900 leading-none mb-1 animate-in fade-in slide-in-from-left-2">
                {activePerspective}
              </span>
              <span className="block text-[9px] font-bold text-gray-400 uppercase tracking-widest leading-none">Operational View</span>
            </div>
          )}
          {!isCollapsed && <ChevronDown size={14} className={cn("text-gray-400 transition-transform", showPerspectivePicker && "rotate-180")} />}
        </button>

        {/* Perspective Picker Overlay */}
        {showPerspectivePicker && !isCollapsed && (
          <div className="absolute top-[80px] left-4 right-4 bg-white border border-gray-100 rounded-2xl shadow-2xl z-[100] p-2 animate-in zoom-in-95 duration-200">
             <p className="px-3 py-2 text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1">Switch Perspective</p>
             <div className="space-y-1">
                {perspectives.map(p => {
                  const Icon = p.icon
                  const isActive = activePerspective === p.name
                  return (
                    <button
                      key={p.name}
                      onClick={() => handlePerspectiveChange(p.name)}
                      className={cn(
                        "w-full flex items-center space-x-3 px-3 py-2.5 rounded-xl text-[11px] font-bold transition-all",
                        isActive ? "bg-gray-100 text-gray-900" : "text-gray-500 hover:bg-gray-50 hover:text-gray-900"
                      )}
                    >
                      <div className={cn("p-1.5 rounded-lg text-white shadow-sm", p.color)}>
                        <Icon size={14} />
                      </div>
                      <span className={isActive ? "font-black italic" : ""}>{p.name}</span>
                    </button>
                  )
                })}
             </div>
          </div>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto p-4 space-y-1 scrollbar-hide">
        {filteredNavItems.map((item) => {
          const isActive = pathname === item.href || (item.href !== '/dashboard' && pathname.startsWith(item.href))
          const isExpanded = expandedItems.includes(item.name)
          const Icon = item.icon
          const hasSubItems = item.subItems && item.subItems.length > 0
          
          return (
            <div key={item.name} className="space-y-1">
              <div 
                className={cn(
                  "flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-medium transition-all group cursor-pointer",
                  isActive && !hasSubItems
                    ? "bg-red-50 text-red-600" 
                    : "text-gray-500 hover:bg-gray-50 hover:text-gray-900"
                )}
                onClick={() => {
                  if (hasSubItems) toggleExpand(item.name)
                }}
              >
                <Link 
                  href={item.href} 
                  className="flex items-center flex-1 space-x-3"
                  onClick={(e) => {
                    if (hasSubItems) e.stopPropagation();
                  }}
                >
                  <Icon size={19} className={cn(
                    "transition-colors shrink-0",
                    isActive ? "text-red-600" : "text-gray-400 group-hover:text-gray-600"
                  )} />
                  {!isCollapsed && (
                    <span className="animate-in fade-in slide-in-from-left-1">{item.name}</span>
                  )}
                </Link>
                
                {hasSubItems && !isCollapsed && (
                  <ChevronDown 
                    size={14} 
                    className={cn(
                      "transition-transform",
                      isExpanded ? "rotate-180" : ""
                    )} 
                  />
                )}
              </div>

              {/* Sub Items */}
              {hasSubItems && isExpanded && !isCollapsed && (
                <div className="ml-6 pl-4 border-l border-gray-100 space-y-1 animate-in slide-in-from-top-2">
                   {item.subItems.map(subItem => {
                     const isSubActive = pathname === subItem.href
                     const SubIcon = subItem.icon
                     return (
                       <Link
                         key={subItem.name}
                         href={subItem.href}
                         className={cn(
                           "flex items-center space-x-3 px-3 py-2 rounded-lg text-[11px] font-bold uppercase tracking-wider transition-all",
                           isSubActive ? "text-red-600 italic" : "text-gray-400 hover:text-gray-700 hover:translate-x-1"
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
          <div className="bg-gray-50 rounded-2xl p-4 mb-4 animate-in fade-in zoom-in-95">
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Account</p>
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 rounded-full bg-white border border-gray-200 shadow-sm flex items-center justify-center text-xs font-bold text-gray-900 shrink-0 capitalize">
                {user.email?.[0].toUpperCase()}
              </div>
              <div className="flex-1 truncate">
                <p className="text-[11px] font-black text-gray-900 truncate italic">{user.email}</p>
                <p className="text-[9px] font-bold text-gray-400 uppercase tracking-tighter">Partner OS {activePerspective}</p>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex justify-center mb-4">
            <div className="w-8 h-8 rounded-full bg-red-50 border border-red-100 flex items-center justify-center text-xs font-bold text-red-600 capitalize">
              {user.email?.[0].toUpperCase()}
            </div>
          </div>
        )}

        <button 
          onClick={handleSignOut}
          className={cn(
            "flex items-center px-3 py-2.5 rounded-xl text-sm font-medium text-gray-500 hover:bg-red-50 hover:text-red-600 transition-all group w-full",
            isCollapsed ? "justify-center" : "space-x-3"
          )}
        >
          <LogOut size={19} className="text-gray-400 group-hover:text-red-600 shrink-0" />
          {!isCollapsed && <span>Sign Out</span>}
        </button>
      </div>
    </aside>
  )
}
