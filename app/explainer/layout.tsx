import { motion } from "framer-motion"
import ExplainerNavbar from "@/components/ui/ExplainerNavbar"

export default function ExplainerLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="relative w-full overflow-x-hidden selection:bg-gray-900 selection:text-white">
      <ExplainerNavbar />
      
      {/* Scroll Progress Bar (Shared) */}
      <motion.div
         style={{ scaleX: 0 }}
         animate={{ scaleX: 1 }}
         transition={{ duration: 1 }}
         className="fixed top-0 left-0 right-0 h-1 bg-gray-900 origin-left z-[110]"
      />

      <main>{children}</main>
    </div>
  )
}
