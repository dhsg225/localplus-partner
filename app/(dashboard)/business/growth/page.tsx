import { intelligenceApi } from "@/lib/api.server"
import GrowthUI from "./components/GrowthUI"
import { Metadata } from "next"

export const metadata: Metadata = {
  title: "Growth & Boost | LocalPlus",
  description: "Maximize your business visibility and engine exposure.",
}

export default async function GrowthPage() {
  let intelligenceData;
  try {
    intelligenceData = await intelligenceApi.getMetrics()
  } catch (e) {
    console.error("Failed to fetch intelligence metrics for growth page:", e)
    // Fallback dealt with by the UI component defaults
  }

  return (
    <div className="max-w-[1600px] mx-auto">
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-6">
        <div>
          <h1 className="text-4xl font-black italic tracking-tighter text-gray-900 leading-none">Growth & Boost</h1>
          <p className="text-sm font-medium text-gray-400 uppercase tracking-[0.2em] mt-3">Monetization Path & Exposure Control</p>
        </div>
        <div className="flex items-center space-x-2 text-[10px] font-black text-emerald-600 bg-emerald-50 px-4 py-2 rounded-full border border-emerald-100 italic">
          <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
          <span>Verified Grounding Advantage Active</span>
        </div>
      </div>

      <GrowthUI intelligenceData={intelligenceData} />
    </div>
  )
}
