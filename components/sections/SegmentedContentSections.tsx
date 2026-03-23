"use client"

import { motion } from "framer-motion"
import { MCCIndicators } from "../ui/MCCIndicators"

export const SegmentedContentSections = () => {
    return (
        <div className="bg-white">
            {/* Section 1: For Consumers */}
            <section id="consumers" className="py-40 px-6 border-b border-gray-100">
                <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-24 items-center">
                    <div className="space-y-8">
                        <div className="space-y-4">
                            <h2 className="text-5xl md:text-7xl font-black text-gray-900 tracking-tighter leading-none font-heading italic">The End of the Endless Scroll.</h2>
                            <p className="text-xl text-gray-400 font-bold lowercase tracking-tight">Consumers don't want links. They want answers. LocalPlus delivers the single, most relevant choice directly into the conversation.</p>
                        </div>
                        <ul className="space-y-6">
                            {[
                                { title: "Zero Ads", desc: "No sponsored clutter interfering with the best result." },
                                { title: "Verified Data", desc: "Every business is cross-referenced for real-time accuracy." },
                                { title: "Instant Action", desc: "Book, call, or navigate in one click from the AI interface." }
                            ].map((item, i) => (
                                <li key={i} className="flex items-start space-x-4">
                                    <div className="w-6 h-6 rounded-full bg-green-500 flex items-center justify-center text-white text-[10px] shrink-0 mt-1">✓</div>
                                    <div className="space-y-1">
                                        <p className="font-black text-gray-900 uppercase text-xs tracking-widest">{item.title}</p>
                                        <p className="text-sm text-gray-500 font-medium">{item.desc}</p>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    </div>
                    <div className="relative p-8 bg-gray-50 rounded-[48px] border border-gray-100 overflow-hidden group">
                        <div className="absolute inset-0 bg-gradient-radial from-blue-100/30 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
                        <div className="p-8 bg-white rounded-3xl shadow-xl border border-gray-100 space-y-6">
                             <div className="flex justify-between items-center">
                                 <div className="w-12 h-1.5 bg-gray-100 rounded" />
                                 <div className="w-4 h-4 rounded-full border-2 border-green-500" />
                             </div>
                             <p className="text-lg font-bold text-gray-900 leading-snug italic">"Here is the best vet open right now within 5 miles. They specialize in emergency care."</p>
                             <button className="w-full py-3 bg-gray-900 text-white rounded-2xl font-black text-xs uppercase tracking-widest">Navigate Now</button>
                        </div>
                    </div>
                </div>
            </section>

            {/* Section 2: For Businesses */}
            <section id="businesses" className="py-40 px-6 bg-gray-900 text-white overflow-hidden relative">
                <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-500/10 blur-[150px] -z-0" />
                <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-24 items-center relative z-10">
                    <div className="order-2 lg:order-1">
                        <div className="grid grid-cols-2 gap-4">
                            {[
                                { label: "Discovery Rate", val: "+340%", color: "text-blue-400" },
                                { label: "Conversion", val: "12.4%", color: "text-green-400" },
                                { label: "Cost Per Lead", val: "$0.12", color: "text-amber-400" },
                                { label: "ROI", val: "15x", color: "text-white" }
                            ].map((stat, i) => (
                                <div key={i} className="p-8 bg-white/5 rounded-3xl border border-white/10 backdrop-blur-xl">
                                    <p className="text-[10px] font-black text-white/30 uppercase tracking-widest mb-2">{stat.label}</p>
                                    <p className={`text-4xl font-black italic tracking-tighter ${stat.color}`}>{stat.val}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                    <div className="space-y-8 order-1 lg:order-2">
                         <div className="space-y-4">
                            <h2 className="text-5xl md:text-7xl font-black text-white tracking-tighter leading-none font-heading italic">Be the Answer. <br/>Not a Link.</h2>
                            <p className="text-xl text-white/40 font-bold lowercase tracking-tight">Traditional SEO is dead. Local SEO is being replaced by AI Selection. We ensure your business is the one the model chooses when intent matches your service.</p>
                         </div>
                         <button className="px-10 py-5 bg-white text-gray-900 rounded-full font-black uppercase text-sm tracking-widest hover:scale-105 active:scale-95 transition-all shadow-2xl">Own Your Discovery</button>
                    </div>
                </div>
            </section>

            {/* Section 3: The Tech */}
            <section id="tech" className="py-40 px-6 bg-white">
                <div className="max-w-4xl mx-auto text-center space-y-24">
                    <div className="space-y-4">
                        <h2 className="text-5xl md:text-7xl font-black text-gray-900 tracking-tighter leading-none font-heading italic">How the Logic Works.</h2>
                        <p className="text-xl text-gray-400 font-bold lowercase tracking-tight">The LocalPlus "Answer Engine" operates on three primary metrics of trust that AI models respect.</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                         {[
                             { type: "mention", title: "Semantic Relevance", desc: "We map your service capabilities into the AI's training nodes, ensuring a high similarity score for user intent." },
                             { type: "citation", title: "Source Verification", desc: "Our real-time data API provides the 'Facts' that models use as grounded citations, bypassinghallucination." },
                             { type: "click", title: "Action Intent", desc: "The final layer converts AI output into physical actions (bookings, calls), completing the monetization loop." }
                         ].map((item, i) => (
                             <div key={i} className="flex flex-col items-center text-center space-y-6 p-10 bg-gray-50 rounded-[40px] border border-gray-100 hover:border-blue-500/20 transition-all group">
                                 <div className="scale-150 transform group-hover:scale-[1.7] transition-transform duration-500">
                                     <MCCIndicators type={item.type as any} showLabel={false} />
                                 </div>
                                 <h3 className="text-xl font-black text-gray-900 italic tracking-tighter uppercase font-heading">{item.title}</h3>
                                 <p className="text-sm text-gray-400 font-medium leading-relaxed">{item.desc}</p>
                             </div>
                         ))}
                    </div>
                </div>
            </section>
        </div>
    )
}
