"use client"

import { motion } from "framer-motion"
import Link from "next/link"
import { usePathname } from "next/navigation"

export default function ExplainerLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()

  const navLinks = [
    { href: "/answer-engine", label: "Consumers", icon: "👤" },
    { href: "/answer-engine/businesses", label: "Businesses", icon: "🏪" },
    { href: "/answer-engine/tech", label: "How It Works", icon: "⚙️" },
  ]

  const placeholders = [
    { label: "Platform" },
    { label: "Solutions" },
    { label: "Pricing" },
  ]

  return (
    <div className="relative w-full overflow-x-hidden selection:bg-gray-900 selection:text-white bg-white min-h-screen">
      {/* Scroll Progress Bar */}
      <motion.div
         style={{ scaleX: 0 }}
         animate={{ scaleX: 1 }}
         transition={{ duration: 1 }}
         className="fixed top-0 left-0 right-0 h-1 bg-gray-900 origin-left z-[130]"
      />
      
      {/* Ghost-Mask Menu Pass (v0.4.7) - MAXIMUM TRANSLUCENCY + DARK TYPOGRAPHY */}
      <div className="fixed top-4 left-1/2 -translate-x-1/2 z-[120] w-[calc(100%-4rem)] max-w-4xl px-4">
          <div className="bg-white/10 backdrop-blur-3xl p-1 rounded-[24px] text-gray-900 border border-gray-900/5 flex items-center justify-between shadow-sm">
              <div className="flex items-center flex-1">
                  {navLinks.map((link) => {
                    const isActive = pathname === link.href
                    return (
                      <Link 
                        key={link.href}
                        href={link.href}
                        className={`relative flex items-center justify-center space-x-2 py-2.5 px-4 rounded-[18px] transition-all flex-1 ${
                          isActive ? 'z-10 bg-gray-900 shadow-xl' : 'hover:bg-gray-900/5 opacity-50 hover:opacity-100'
                        }`}
                      >
                        <span className={`relative z-10 text-base md:text-lg ${isActive ? 'text-white' : 'text-gray-900 grayscale brightness-50'}`}>{link.icon}</span>
                        <span className={`relative z-10 text-[11px] font-black uppercase tracking-[0.15em] whitespace-nowrap hidden sm:inline ${isActive ? 'text-white' : 'text-gray-900'}`}>
                           {link.label}
                        </span>
                      </Link>
                    )
                  })}
              </div>

              {/* Functional Placeholders */}
              <div className="hidden lg:flex items-center space-x-1 px-4 border-l border-black/5 ml-2">
                  {placeholders.map((p) => (
                    <div 
                      key={p.label}
                      className="px-4 py-2 opacity-20 hover:opacity-100 transition-opacity cursor-not-allowed"
                    >
                      <span className="text-[11px] font-black uppercase tracking-[0.3em] whitespace-nowrap text-gray-900">
                         {p.label}
                      </span>
                    </div>
                  ))}
              </div>
          </div>
      </div>

      <main className="pt-20">{children}</main>

      {/* Version Marker - v0.4.7 */}
      <div className="fixed bottom-6 right-8 z-[150] pointer-events-none opacity-80">
         <p className="text-[10px] font-mono font-black text-gray-400 uppercase tracking-[0.3em] bg-white/50 backdrop-blur-sm px-3 py-2 rounded-lg border border-gray-100 shadow-sm">Build v0.4.7 (simulation_env)</p>
      </div>
    </div>
  )
}
