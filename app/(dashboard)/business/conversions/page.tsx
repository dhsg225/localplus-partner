import { conversionApi } from "@/lib/api.server"
import ConversionUI from "./components/ConversionUI"
import { Metadata } from "next"

export const metadata: Metadata = {
  title: "Conversions & ROI | LocalPlus",
  description: "Track real business impact and discovery funnel performance.",
}

export default async function ConversionsPage() {
  let data;
  try {
    data = await conversionApi.getConversions()
  } catch (e) {
    console.error("Failed to fetch conversion metrics:", e)
    return (
      <div className="p-8">
        <div className="bg-red-50 border border-red-100 p-6 rounded-3xl text-red-600">
          <h1 className="font-black italic uppercase tracking-tighter text-xl mb-2">ROI Stream Offline</h1>
          <p className="text-sm font-medium">Unable to connect to the conversion tracking gateway. High-intent signals are not being processed.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-[1600px] mx-auto">
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-6">
        <div>
          <h1 className="text-4xl font-black italic tracking-tighter text-gray-900 leading-none">Conversions & ROI</h1>
          <p className="text-sm font-medium text-gray-400 uppercase tracking-[0.2em] mt-3">High-Intent Outcome Analysis</p>
        </div>
        <div className="px-4 py-2 bg-gray-100 rounded-full border border-gray-200 flex items-center space-x-2 text-[10px] font-black text-gray-500">
          <div className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse" />
          <span>Real-Time Action Tracking Active</span>
        </div>
      </div>

      <ConversionUI data={data} />
    </div>
  )
}
