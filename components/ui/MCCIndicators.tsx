"use client"

import { motion } from "framer-motion"

interface IndicatorProps {
  type: 'mention' | 'citation' | 'click' | 'sponsored'
  label?: string
  showLabel?: boolean
}

export const MCCIndicators = ({ type, label, showLabel = true }: IndicatorProps) => {
  const configs = {
    mention: { icon: "·", color: "text-gray-400 font-bold", bg: "bg-gray-100", dot: "#9ca3af", tooltip: "Mention: Your business is named in the AI's conversation." },
    citation: { icon: "†", color: "text-blue-600 font-bold", bg: "bg-blue-100", dot: "#3b82f6", tooltip: "Citation: Link to your business as a factual source." },
    click: { icon: "↗", color: "text-green-600 font-bold", bg: "bg-green-100", dot: "#22c55e", tooltip: "Click: Direct traffic from AI to your website." },
    sponsored: { icon: "★", color: "text-amber-600 font-bold", bg: "bg-amber-100", dot: "#fbbf24", tooltip: "Sponsored: Priority placement in AI search results." }
  }

  const config = configs[type]

  return (
    <div className="relative group inline-flex items-center">
      <div className={`flex items-center justify-center w-6 h-6 rounded-lg font-black ${config.color} ${config.bg} shadow-sm group-hover:scale-110 transition-transform duration-200 border border-white/50 backdrop-blur-sm`}>
        {config.icon}
      </div>
      {showLabel && label && (
        <span className={`ml-1.5 text-xs font-medium ${config.color}`}>
          {label}
        </span>
      )}
      
      {/* Tooltip */}
      <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-48 p-2 bg-gray-900 text-white text-[10px] rounded opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity duration-300 z-50">
        <p>{config.tooltip}</p>
        <div className="absolute top-full left-1/2 -translate-x-1/2 border-x-4 border-x-transparent border-t-4 border-t-gray-900" />
      </div>
    </div>
  )
}
