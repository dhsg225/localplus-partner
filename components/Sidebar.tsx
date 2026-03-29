'use client'

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
  Users
} from 'lucide-react'
import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'
import { createClient } from '@/lib/supabase/client'

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

const navItems = [
  { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { name: 'Events', href: '/events', icon: Calendar },
  { name: 'MICE Cloud', href: '/mice', icon: MapPin },
  { name: 'Business Data', href: '/business', icon: Building2 },
  { name: 'Loyalty', href: '/loyalty', icon: Star },
  { name: 'Advertising', href: '/advertising', icon: Megaphone },
  { name: 'Analytics', href: '/analytics', icon: TrendingUp },
]

export default function Sidebar({ user }: { user: any }) {
  const pathname = usePathname()
  const supabase = createClient()

  async function handleSignOut() {
    await supabase.auth.signOut()
    window.location.href = '/'
  }

  return (
    <aside className="w-64 border-r border-gray-200 bg-white flex flex-col shrink-0">
      <div className="p-6 border-b border-gray-100 h-[88px] flex items-center">
        <div className="flex items-center space-x-2">
          <div className="bg-red-600 w-8 h-8 rounded-lg flex items-center justify-center">
            <span className="text-white font-black text-lg">P</span>
          </div>
          <span className="font-outfit font-black text-xl tracking-tight text-gray-900">LocalPlus Partner</span>
        </div>
      </div>

      <nav className="flex-1 overflow-y-auto p-4 space-y-1">
        {navItems.map((item) => {
          const isActive = pathname.startsWith(item.href)
          const Icon = item.icon
          
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "flex items-center space-x-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all group",
                isActive 
                  ? "bg-red-50 text-red-600" 
                  : "text-gray-500 hover:bg-gray-50 hover:text-gray-900"
              )}
            >
              <Icon size={19} className={cn(
                "transition-colors",
                isActive ? "text-red-600" : "text-gray-400 group-hover:text-gray-600"
              )} />
              <span>{item.name}</span>
            </Link>
          )
        })}
      </nav>

      <div className="p-4 border-t border-gray-100">
        <div className="bg-gray-50 rounded-2xl p-4 mb-4">
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Account</p>
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-full bg-gray-200 border border-white flex items-center justify-center text-xs font-bold text-gray-500">
              {user.email?.[0].toUpperCase()}
            </div>
            <div className="flex-1 truncate">
              <p className="text-xs font-bold text-gray-900 truncate">{user.email}</p>
              <p className="text-[10px] text-gray-500">Partner Organization</p>
            </div>
          </div>
        </div>

        <button 
          onClick={handleSignOut}
          className="flex items-center space-x-3 w-full px-3 py-2.5 rounded-xl text-sm font-medium text-gray-500 hover:bg-red-50 hover:text-red-600 transition-all group"
        >
          <LogOut size={19} className="text-gray-400 group-hover:text-red-600" />
          <span>Sign Out</span>
        </button>
      </div>
    </aside>
  )
}
