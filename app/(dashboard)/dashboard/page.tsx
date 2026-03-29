export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-gray-900 tracking-tight">Overview</h1>
          <p className="text-gray-500 font-medium">Welcome to your operational partner dashboard.</p>
        </div>
        <div className="flex items-center space-x-3">
          <div className="bg-green-50 text-green-700 px-3 py-1.5 rounded-full text-xs font-bold ring-1 ring-green-600/20">
            System Online
          </div>
          <div className="bg-gray-100 text-gray-400 px-3 py-1.5 rounded-full text-[10px] font-black tracking-widest uppercase">
            v1.3.0 (CORE)
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm border-b-4 border-b-blue-500">
          <p className="text-xs font-black text-gray-400 uppercase tracking-widest mb-1">Active Events</p>
          <div className="flex items-end justify-between">
            <p className="text-4xl font-black text-gray-900">12</p>
            <div className="text-green-600 text-xs font-bold">+2 this week</div>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm border-b-4 border-b-purple-500">
          <p className="text-xs font-black text-gray-400 uppercase tracking-widest mb-1">Pending Bookings</p>
          <div className="flex items-end justify-between">
            <p className="text-4xl font-black text-gray-900">4</p>
            <div className="text-gray-400 text-xs font-bold">Action required</div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm border-b-4 border-b-red-500">
          <p className="text-xs font-black text-gray-400 uppercase tracking-widest mb-1">Partner Score</p>
          <div className="flex items-end justify-between">
            <p className="text-4xl font-black text-gray-900">4.8</p>
            <div className="text-yellow-500 text-xs font-bold">Excellent</div>
          </div>
        </div>
      </div>

      <div className="bg-blue-600 rounded-[32px] p-8 text-white relative overflow-hidden group">
        <div className="relative z-10">
          <h2 className="text-2xl font-black mb-2 italic">Modernizing the Partner OS.</h2>
          <p className="text-blue-100 max-w-lg mb-6 leading-relaxed">
            We are currently migrating the legacy Vite modules to this unified Next.js dashboard. 
            MICE Cloud and Events are the priority.
          </p>
          <button className="bg-white text-blue-600 px-6 py-2.5 rounded-full text-sm font-bold shadow-xl shadow-blue-900/20 active:scale-95 transition-transform">
            View Migration Roadmap
          </button>
        </div>
        
        {/* Abstract Background Shapes */}
        <div className="absolute -top-24 -right-24 w-64 h-64 bg-white/10 rounded-full blur-3xl group-hover:bg-white/20 transition-colors" />
        <div className="absolute top-1/2 -left-12 w-32 h-32 bg-blue-400/20 rounded-full blur-2xl" />
      </div>
    </div>
  )
}
