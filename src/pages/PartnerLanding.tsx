import React, { useState } from 'react';

interface PartnerLandingProps {
  onLoginClick: () => void;
}

const PartnerLanding: React.FC<PartnerLandingProps> = ({ onLoginClick }) => {
  return (
    <div className="min-h-screen bg-white font-sans text-slate-800">

      {/* 1. Header & Hero Section */}
      <header className="bg-gradient-to-br from-slate-900 to-slate-800 text-white pb-20 pt-6 px-4 md:px-8">
        <div className="max-w-6xl mx-auto">
          {/* Nav */}
          <nav className="flex justify-between items-center mb-16">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
                <span className="font-bold text-white text-lg">L</span>
              </div>
              <span className="text-xl font-bold tracking-tight">LocalPlus Partners</span>
            </div>
            <button
              onClick={onLoginClick}
              className="px-5 py-2 rounded-lg bg-white/10 hover:bg-white/20 transition-all font-medium border border-white/10"
            >
              Partner Log In
            </button>
          </nav>

          {/* Hero Content */}
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight mb-6 leading-tight">
              The Operating System <br />
              <span className="text-blue-400">for Local Business</span>
            </h1>
            <p className="text-lg md:text-xl text-slate-300 mb-10 leading-relaxed max-w-2xl">
              Streamline your day-to-day with tools built for busy operators. Whether you run a restaurant, manage tours, or host events, LocalPlus helps you cut through the noise and focus on what matters.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <a href="#industries" className="px-8 py-4 bg-blue-500 hover:bg-blue-600 text-white rounded-xl font-bold text-lg transition-all shadow-lg shadow-blue-500/30 text-center">
                Explore Your Industry
              </a>
              <button onClick={onLoginClick} className="px-8 py-4 bg-white/10 hover:bg-white/20 text-white rounded-xl font-bold text-lg transition-all border border-white/10">
                Partner Log In
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* 2. Who It’s For (Industries) */}
      <section id="industries" className="py-20 px-4 md:px-8 relative -mt-10">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-end justify-between mb-8">
            <h2 className="text-3xl font-bold text-slate-900">Built for Your Sector</h2>
            <p className="text-slate-500 hidden md:block">Purpose-built tools, not generic software.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-20">
            {/* Hospitality Card */}
            <div className="bg-white p-8 rounded-2xl shadow-xl shadow-slate-200/50 border border-slate-100 hover:-translate-y-1 transition-transform duration-300">
              <div className="w-12 h-12 bg-orange-100 text-orange-600 rounded-xl flex items-center justify-center mb-6">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg>
              </div>
              <h3 className="text-xl font-bold mb-3 text-slate-800">Hospitality & Dining</h3>
              <p className="text-slate-600 text-sm mb-6 leading-relaxed">
                Manage bookings, tables, and guest flow without the enterprise bloat.
              </p>
              <a href="#hospitality-spotlight" className="text-orange-600 font-semibold text-sm flex items-center gap-1 hover:gap-2 transition-all">
                Learn More <span>→</span>
              </a>
            </div>

            {/* Tourism Card */}
            <div className="bg-white p-8 rounded-2xl shadow-xl shadow-slate-200/50 border border-slate-100 hover:-translate-y-1 transition-transform duration-300">
              <div className="w-12 h-12 bg-teal-100 text-teal-600 rounded-xl flex items-center justify-center mb-6">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
              </div>
              <h3 className="text-xl font-bold mb-3 text-slate-800">Tourism & Experiences</h3>
              <p className="text-slate-600 text-sm mb-6 leading-relaxed">
                Simplify ticketing, availability, and guide management.
              </p>
              <button className="text-teal-600 font-semibold text-sm flex items-center gap-1 hover:gap-2 transition-all">
                Learn More <span>→</span>
              </button>
            </div>

            {/* Events Card */}
            <div className="bg-white p-8 rounded-2xl shadow-xl shadow-slate-200/50 border border-slate-100 hover:-translate-y-1 transition-transform duration-300">
              <div className="w-12 h-12 bg-purple-100 text-purple-600 rounded-xl flex items-center justify-center mb-6">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
              </div>
              <h3 className="text-xl font-bold mb-3 text-slate-800">Event Organisers</h3>
              <p className="text-slate-600 text-sm mb-6 leading-relaxed">
                Handle RSVPs, guest lists, and check-ins effortlessly.
              </p>
              <button className="text-purple-600 font-semibold text-sm flex items-center gap-1 hover:gap-2 transition-all">
                Learn More <span>→</span>
              </button>
            </div>

            {/* Coming Soon Card */}
            <div className="bg-slate-50 p-8 rounded-2xl border border-slate-200 border-dashed flex flex-col justify-center opacity-70 hover:opacity-100 transition-opacity">
              <div className="w-12 h-12 bg-slate-200 text-slate-500 rounded-xl flex items-center justify-center mb-6">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H4" /></svg>
              </div>
              <h3 className="text-xl font-bold mb-2 text-slate-700">Local Services</h3>
              <p className="text-slate-500 text-sm mb-4">
                Coming soon: tools for service providers and appointments.
              </p>
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Coming Soon</span>
            </div>
          </div>
        </div>
      </section>

      {/* 2.5 Industry Spotlight: Hospitality */}
      <section id="hospitality-spotlight" className="py-20 bg-orange-50 border-y border-orange-100 scroll-mt-20">
        <div className="max-w-6xl mx-auto px-4 md:px-8">
          <div className="flex flex-col md:flex-row gap-12 mb-16">
            <div className="flex-1">
              <div className="inline-block px-4 py-1 bg-orange-100 text-orange-700 rounded-full text-sm font-bold mb-6">
                Industry Spotlight
              </div>
              <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 mb-6">
                Hospitality Solutions
              </h2>
              <p className="text-lg text-slate-700 leading-relaxed mb-6">
                <span className="font-semibold block mb-2">Built for busy hospitality teams — not enterprise dashboards.</span>
                LocalPlus helps restaurants, bars, cafés, and hospitality venues manage bookings, communicate faster, and stay organised — without forcing staff to live inside complicated systems.
              </p>
              <p className="text-slate-600 mb-8">
                Whether you’re a single venue or a growing group, LocalPlus keeps bookings visible, manageable, and human.
              </p>

              {/* Comparison Table Small */}
              <div className="bg-white rounded-xl shadow-sm p-6 border border-orange-100">
                <h4 className="font-bold text-slate-900 mb-4">Why Hospitality Teams Choose LocalPlus</h4>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="space-y-2">
                    <div className="font-bold text-orange-600">LocalPlus</div>
                    <div className="flex items-center gap-2"><svg className="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg> WhatsApp-first</div>
                    <div className="flex items-center gap-2"><svg className="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg> Lightweight & local</div>
                    <div className="flex items-center gap-2"><svg className="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg> Easy for staff</div>
                    <div className="flex items-center gap-2"><svg className="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg> Calm summaries</div>
                  </div>
                  <div className="space-y-2 text-slate-400">
                    <div className="font-bold text-slate-500">Traditional Platforms</div>
                    <div>Dashboard-first</div>
                    <div>Heavy & enterprise</div>
                    <div>Training required</div>
                    <div>Constant alerts</div>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex-1 space-y-8">
              {/* Feature 1 */}
              <div className="bg-white p-6 rounded-xl shadow-sm border border-orange-100/50">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center text-orange-600 flex-shrink-0">
                    <span className="text-xl">🪑</span>
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-slate-900 mb-2">Reservations & Bookings (Made Simple)</h3>
                    <p className="text-slate-600 text-sm leading-relaxed mb-3">
                      Online reservations via LocalPlus listings, manual bookings, and walk-ins. Manage Guest notes (VIPs, allergies) and set rules for capacity.
                    </p>
                    <div className="text-xs font-semibold text-orange-600 bg-orange-50 inline-block px-2 py-1 rounded">No table chess. No over-engineering. Just bookings that work.</div>
                  </div>
                </div>
              </div>

              {/* Feature 2 - Secret Weapon */}
              <div className="bg-slate-900 p-6 rounded-xl shadow-xl text-white relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-green-500/10 rounded-full blur-3xl -mr-16 -mt-16"></div>
                <div className="flex items-start gap-4 relative z-10">
                  <div className="w-10 h-10 bg-white/10 rounded-lg flex items-center justify-center flex-shrink-0">
                    <span className="text-xl">📲</span>
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-white mb-2">Booking Summaries (Our Secret Weapon)</h3>
                    <p className="text-slate-300 text-sm leading-relaxed mb-4">
                      Push information to partners — don’t pull them into dashboards.
                      Restaurant managers receive automatic booking summaries via <strong>WhatsApp (preferred)</strong> or Email.
                    </p>

                    {/* Fake WhatsApp Message */}
                    <div className="bg-[#DCF8C6] text-slate-800 p-3 rounded-lg rounded-tl-none text-xs font-mono shadow-sm max-w-xs ml-2 border border-green-200/50">
                      <div className="font-bold text-green-800 mb-1">📅 Today’s Bookings — Fri</div>
                      <div className="mb-2">🍽 7 bookings / 26 guests</div>
                      <ul className="mb-2 space-y-1">
                        <li>• 12:30 — 2 pax (John)</li>
                        <li>• 13:00 — 4 pax (Anna – birthday)</li>
                        <li>• 19:00 — 8 pax (VIP)</li>
                      </ul>
                      <div className="text-green-800 font-bold">⏳ Pending: 1</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Feature 3 & 4 Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="bg-white p-5 rounded-xl shadow-sm border border-orange-100/50">
                  <h4 className="font-bold text-slate-900 mb-2 flex items-center gap-2"><span>⚙️</span> Smart Automation</h4>
                  <p className="text-slate-600 text-xs">Event-aware messaging and clear flags for VIPs or allergies. Nothing noisy or distracting.</p>
                </div>
                <div className="bg-white p-5 rounded-xl shadow-sm border border-orange-100/50">
                  <h4 className="font-bold text-slate-900 mb-2 flex items-center gap-2"><span>🧠</span> Guest Notes</h4>
                  <p className="text-slate-600 text-xs">Simple tags and visit context. Designed for hospitality memory, not marketing spam.</p>
                </div>
              </div>

            </div>
          </div>

          {/* Designed to Grow */}
          <div className="bg-orange-100/50 rounded-2xl p-8 border border-orange-100 text-center">
            <h3 className="text-xl font-bold text-slate-900 mb-4">Designed to Grow With You</h3>
            <div className="flex flex-col md:flex-row justify-center items-center gap-8 md:gap-16">
              <div className="text-left">
                <div className="text-xs font-bold uppercase tracking-wider text-orange-600 mb-2">Today</div>
                <ul className="space-y-1 text-slate-700 text-sm font-medium">
                  <li className="flex items-center gap-2">✓ Reservations</li>
                  <li className="flex items-center gap-2">✓ Booking summaries</li>
                  <li className="flex items-center gap-2">✓ Partner dashboard</li>
                  <li className="flex items-center gap-2">✓ WhatsApp + Email notifications</li>
                </ul>
              </div>
              <div className="w-px h-24 bg-orange-200 hidden md:block"></div>
              <div className="text-left opacity-75">
                <div className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">Coming Next</div>
                <ul className="space-y-1 text-slate-600 text-sm">
                  <li>• Events & experiences</li>
                  <li>• Deposits & prepayments</li>
                  <li>• Loyalty & perks</li>
                  <li>• Multi-location tools</li>
                </ul>
              </div>
            </div>
            <div className="mt-8">
              <button onClick={onLoginClick} className="px-6 py-3 bg-orange-600 hover:bg-orange-700 text-white rounded-lg font-bold shadow-lg shadow-orange-500/20 transition-all">
                Get Started with Hospitality
              </button>
            </div>
          </div>

        </div>
      </section>

      {/* 3. Platform Philosophy */}
      <section className="py-20 bg-slate-50 border-y border-slate-200">
        <div className="max-w-6xl mx-auto px-4 md:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl font-bold text-slate-900 mb-4">How We Work</h2>
            <p className="text-slate-600 text-lg">Designed for the chaos of real-time operations.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            <div className="text-center px-4">
              <div className="w-16 h-16 mx-auto bg-blue-100 rounded-full flex items-center justify-center mb-6 text-blue-600">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">Push, Don't Pull</h3>
              <p className="text-slate-600 leading-relaxed">
                We bring information to you. Get critical updates via WhatsApp or email so you aren't constantly checking another dashboard.
              </p>
            </div>

            <div className="text-center px-4">
              <div className="w-16 h-16 mx-auto bg-green-100 rounded-full flex items-center justify-center mb-6 text-green-600">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">Operational Reality</h3>
              <p className="text-slate-600 leading-relaxed">
                Built for busy hands. Fast, reliable, and works on the mobile device you already have in your pocket.
              </p>
            </div>

            <div className="text-center px-4">
              <div className="w-16 h-16 mx-auto bg-indigo-100 rounded-full flex items-center justify-center mb-6 text-indigo-600">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" /></svg>
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">Your Workflow, Respected</h3>
              <p className="text-slate-600 leading-relaxed">
                We fit into your existing habits. No retraining your entire staff just to accept a single booking.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 4. What Partners Get (Benefits) */}
      <section className="py-20 px-4 md:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row items-center gap-12">
            <div className="flex-1">
              <h2 className="text-3xl font-bold text-slate-900 mb-6">"Reliable tools that just work."</h2>
              <ul className="space-y-6">
                {[
                  { title: "Unified Command Center", desc: "One central dashboard to oversee all your interactions, bookings, and enquiries." },
                  { title: "Smart Notifications", desc: "Receive alerts that actually matter, routed to the right person at the right time." },
                  { title: "Control Your Pace", desc: "Flexible settings for timing, capacity, and availability. You decide when you're open." },
                  { title: "Direct Communication", desc: "Chat directly with customers through verified channels. No more lost emails." }
                ].map((item, i) => (
                  <li key={i} className="flex gap-4">
                    <div className="mt-1 w-6 h-6 rounded-full bg-green-100 flex-shrink-0 flex items-center justify-center text-green-600">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-900">{item.title}</h4>
                      <p className="text-slate-600 text-sm">{item.desc}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
            <div className="flex-1 bg-slate-100 rounded-3xl p-8 border border-slate-200 shadow-inner min-h-[400px] flex items-center justify-center">
              <div className="bg-white p-6 rounded-xl shadow-lg w-full max-w-sm">
                <div className="h-4 w-1/3 bg-slate-200 rounded mb-4"></div>
                <div className="h-40 bg-blue-50 rounded-lg mb-4 border border-blue-100 p-4">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 bg-blue-200 rounded-full"></div>
                    <div>
                      <div className="h-3 w-20 bg-blue-200 rounded mb-1"></div>
                      <div className="h-2 w-12 bg-blue-100 rounded"></div>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="h-2 w-full bg-blue-100 rounded"></div>
                    <div className="h-2 w-5/6 bg-blue-100 rounded"></div>
                  </div>
                </div>
                <div className="flex gap-2">
                  <div className="h-10 flex-1 bg-slate-800 rounded-lg"></div>
                  <div className="h-10 flex-1 bg-slate-200 rounded-lg"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. Built to Grow */}
      <section className="py-20 bg-slate-900 text-white px-4 md:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-6">Start Simple, Scale Up.</h2>
          <p className="text-xl text-slate-300 mb-10 leading-relaxed">
            You don't need to use everything on day one. Start with a simple profile or basic booking link. As your needs grow, turn on advanced modules like ticketing, table management, or staff accounts. The platform evolves with you.
          </p>

          <div className="p-8 bg-white/5 rounded-2xl border border-white/10 backdrop-blur-sm">
            <h3 className="text-xl font-bold mb-2">Ready to run smoother?</h3>
            <p className="text-slate-400 mb-6">Join thousands of local operators building better businesses with LocalPlus.</p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <a href="#industries" className="px-8 py-3 bg-white text-slate-900 rounded-lg font-bold hover:bg-blue-50 transition-colors">Select Your Industry</a>
              <button onClick={onLoginClick} className="px-8 py-3 bg-transparent border border-white/30 text-white rounded-lg font-bold hover:bg-white/10 transition-colors">Partner Log In</button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-950 text-slate-500 py-12 px-4 md:px-8 border-t border-slate-900">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-slate-800 rounded flex items-center justify-center text-slate-400 font-bold text-xs">L</div>
            <span className="font-bold text-slate-400">LocalPlus Partners</span>
          </div>
          <div className="text-sm">
            &copy; {new Date().getFullYear()} LocalPlus City. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
};

export default PartnerLanding;
