import { intelligenceApi } from "@/lib/api.server"
import IntelligenceUI from "./components/IntelligenceUI"
import { Metadata } from "next"

export const metadata: Metadata = {
  title: "Partner Intelligence | LocalPlus",
  description: "Performance insights and engine recommendation signals.",
}

export default async function IntelligencePage() {
  let data;
  try {
    data = await intelligenceApi.getMetrics()
  } catch (e) {
    console.error("Failed to fetch intelligence metrics:", e)
    // Fallback to empty state or error UI handled by component defaults if needed.
    // In this implementation, the API route itself provides mock data if the AE endpoint fails.
    return (
      <div className="p-8">
        <div className="bg-red-50 border border-red-100 p-6 rounded-3xl text-red-600">
          <h1 className="font-black italic uppercase tracking-tighter text-xl mb-2">Intelligence Stream Offline</h1>
          <p className="text-sm font-medium">Unable to connect to the Answer Engine analytics gateway. Please ensure the backend is active.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-[1600px] mx-auto">
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-6">
        <div>
          <h1 className="text-4xl font-black italic tracking-tighter text-gray-900 leading-none">Partner Intelligence</h1>
          <p className="text-sm font-medium text-gray-400 uppercase tracking-[0.2em] mt-3">Advanced Discovery Analytics & Signal Audit</p>
        </div>
        <div className="px-4 py-2 bg-gray-100 rounded-full border border-gray-200 flex items-center space-x-2 text-[10px] font-black text-gray-500">
          <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
          <span>Live Engine Feed Active</span>
        </div>
      </div>

      <IntelligenceUI data={data} />
    </div>
  )
}
