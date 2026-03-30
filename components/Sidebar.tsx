'use client'

import { useState } from 'react'
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
  Layers
} from 'lucide-react'
import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'
import { createClient } from '@/lib/supabase/client'

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

const navItems = [
  { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { 
    name: 'Events', 
    href: '/events', 
    icon: Calendar,
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
  { name: 'MICE Cloud', href: '/mice', icon: MapPin },
  { name: 'Business Data', href: '/business', icon: Building2 },
  { name: 'Loyalty', href: '/loyalty', icon: Star },
  { name: 'Advertising', href: '/advertising', icon: Megaphone },
  { name: 'Analytics', href: '/analytics', icon: TrendingUp },
]

export default function Sidebar({ user }: { user: any }) {
  const pathname = usePathname()
  const supabase = createClient()
  const [isCollapsed, setIsCollapsed] = useState(false)
  const [expandedItems, setExpandedItems] = useState<string[]>(['Events'])

  async function handleSignOut() {
    await supabase.auth.signOut()
    window.location.href = '/'
  }

  const toggleExpand = (name: string) => {
    setExpandedItems(prev => 
      prev.includes(name) ? prev.filter(i => i !== name) : [...prev, name]
    )
  }

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

      {/* Header */}
      <div className={cn(
        "p-6 border-b border-gray-100 h-[88px] flex items-center overflow-hidden",
        isCollapsed ? "justify-center" : "justify-start"
      )}>
        <div className="flex items-center space-x-2 shrink-0">
          <div className="bg-red-600 w-8 h-8 rounded-lg flex items-center justify-center shrink-0 shadow-lg shadow-red-500/20">
            <span className="text-white font-black text-lg">P</span>
          </div>
          {!isCollapsed && (
            <span className="font-outfit font-black text-xl tracking-tight text-gray-900 animate-in fade-in slide-in-from-left-2">
              LocalPlus Partner
            </span>
          )}
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto p-4 space-y-1">
        {navItems.map((item) => {
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
                <p className="text-[9px] font-bold text-gray-400 uppercase tracking-tighter">OS v7.0.0 Partner</p>
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
