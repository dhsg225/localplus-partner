"use client"

import { useState, useEffect, useCallback, useMemo } from "react"
import { motion, AnimatePresence } from "framer-motion"

const PRELOADED_QUERIES = [
  { 
    id: 1, 
    icon: "🍽️",
    query: "Fresh seafood dinner for 4 on the beach in Hua Hin tonight, sunset view", 
    answer: "I've found the perfect beachside spot. [Living Room Seafood·] is the top choice for tonight. They have a [Table for 4 at 6:30 PM†] on the sand with [Sunset Views†] and a [Verified Fresh Catch Menu†]. You might like their [Grilled Tiger Prawns (฿850)†]. Alternatively, I recommend [Beach Society†] (Chic, 4.8★) or [Seaside Cafe†] (Casual, 4.6★). You can [Book Table↗] instantly.",
    type: "Premium Dining",
    color: "blue",
    bgColor: "bg-blue-50 border-blue-200 text-blue-600 active:bg-blue-600 active:text-white",
    accentBg: "bg-blue-50/60 border-blue-100",
    badge: "text-blue-500 bg-blue-500/10",
    avatar: "https://i.pravatar.cc/150?u=premium_dining"
  },
  { 
    id: 2, 
    icon: "🏥",
    query: "24-hour pediatrician or emergency dentist near Bluport, Hua Hin", 
    answer: "There's an opening right now at [Hua Hin Care Hub·] for urgent consults near Bluport. They currently have [Zero Wait†] for pediatric emergencies and accept [Global Insurance†]. [Dental Consults start at ฿1,200†]. Other options include [San Paulo Hospital†] (5 min away) or [Bangkok Hospital HH†] (10 min away). [Get Directions↗] for the quickest route.",
    type: "Urgent Health",
    color: "green",
    bgColor: "bg-green-50 border-green-200 text-green-600 active:bg-green-600 active:text-white",
    accentBg: "bg-green-50/60 border-green-100",
    badge: "text-green-500 bg-green-500/10",
    avatar: "https://i.pravatar.cc/150?u=urgent_health"
  },
  { 
    id: 3, 
    icon: "💻",
    query: "Quiet cafe with fiber internet and private pods in Khao Takiab", 
    answer: "You're all set. [Takiab Tech Cafe·] has the high-speed fiber you need and is [Open Now†]. They currently have [2 Private Pods†] available. A [Day Pass is ฿250†]. I also verified [Pine Cone Space†] (High-Speed WiFi) or [Work Lab HH†] (Silent Zone). You can proceed with a [30-min booking↗].",
    type: "Digital Nomad",
    color: "purple",
    bgColor: "bg-purple-50 border-purple-200 text-purple-600 active:bg-purple-600 active:text-white",
    accentBg: "bg-purple-50/60 border-purple-100",
    badge: "text-purple-500 bg-purple-500/10",
    avatar: "https://i.pravatar.cc/150?u=digital_nomad"
  },
  {
    id: 4,
    icon: "🧘",
    query: "Luxury spa retreat with infrared sauna near Centennial Park",
    answer: "I've found a perfect wellness retreat for you. [The Hua Hin Sanctuary·] offers [Infrared Sauna†] sessions and has a [Holistic Wellness Bar†] on-site. Verified: [Mineral Hot Spring†] available. Alternatively, you might like [Heal+ Hub HH†] (Hydrotherapy) or [Vitality Lab†] (Traditional Thai). [Check Schedule↗] for availability.",
    type: "Luxury Wellness",
    color: "amber",
    bgColor: "bg-amber-50 border-amber-200 text-amber-600 active:bg-amber-600 active:text-white",
    accentBg: "bg-amber-50/60 border-amber-100",
    badge: "text-amber-500 bg-amber-500/10",
    avatar: "https://i.pravatar.cc/150?u=luxury_wellness"
  },
  {
    id: 5,
    icon: "🐾",
    query: "Pet-friendly cafe with dog park access near Market Village",
    answer: "Here's a great spot for you and your pet. [Paws & Beach·] is dog-friendly and adjacent to the [Village Dog Park†]. They offer [Full Grooming†] and even have a [Verified Pet Menu†]. Suggested: [Takiab Treats (฿150)†]. Also check out: [Bark Street HH†] (Cafe) or [Doggy Spa†] (Grooming). [Book Grooming↗] now.",
    type: "Pet Services",
    color: "orange",
    bgColor: "bg-orange-50 border-orange-200 text-orange-600 active:bg-orange-600 active:text-white",
    accentBg: "bg-orange-50/60 border-orange-100",
    badge: "text-orange-500 bg-orange-500/10",
    avatar: "https://i.pravatar.cc/150?u=pet_services"
  },
  {
    id: 6,
    icon: "🍸",
    query: "Rooftop cocktail bar with live jazz near Hua Hin Night Market",
    answer: "I've found a sophisticated spot for your night out. [Night Market Sky·] features [Live Jazz†] tonight at 9 PM. They specialize in [Signature Gin Flights†] and offer [Artisan Cocktails†]. Also verified: [The Blue Rooftop†] (Bypass view) or [Jazz Corner†] (Speakeasy). [Reserve Spot↗] for the best view.",
    type: "Nightlife",
    color: "indigo",
    bgColor: "bg-indigo-50 border-indigo-200 text-indigo-600 active:bg-indigo-600 active:text-white",
    accentBg: "bg-indigo-50/60 border-indigo-100",
    badge: "text-indigo-500 bg-indigo-500/10",
    avatar: "https://i.pravatar.cc/150?u=nightlife"
  },
  {
    id: 7,
    icon: "🎡",
    query: "Family-friendly brunch with kid-safe area near Vana Nava",
    answer: "Here's a family-friendly recommendation for you. [Little Sprout HH·] is known for its [Kid-Safe Areas†] and is fully [Stroller Accessible†]. Verified: [Nursery On-Site†]. Other good choices: [Water Park Garden†] (Outdoor) or [Family Fork†] (Playroom). [See Menu↗] for kids' options.",
    type: "Family Outing",
    color: "rose",
    bgColor: "bg-rose-50 border-rose-200 text-rose-600 active:bg-rose-600 active:text-white",
    accentBg: "bg-rose-50/60 border-rose-100",
    badge: "text-rose-500 bg-rose-500/10",
    avatar: "https://i.pravatar.cc/150?u=family_outing"
  },
  {
    id: 8,
    icon: "⚡",
    query: "EV Fast Charger (Level 3) with workspace and coffee in North Hua Hin",
    answer: "I've found a convenient charging hub for you. [Volt Station HH·] has [Level 3 Fast Charging†] available now. You can use their [Quiet Workspace†] and visit the [Craft Coffee Bar†] while you wait. Also verified: [North Energy Hub†] (Level 2) or [Plug & Work†] (Level 3). [Check Status↗] for real-time stall availability.",
    type: "Automotive",
    color: "emerald",
    bgColor: "bg-emerald-50 border-emerald-200 text-emerald-600 active:bg-emerald-600 active:text-white",
    accentBg: "bg-emerald-50/60 border-emerald-100",
    badge: "text-emerald-500 bg-emerald-500/10",
    avatar: "https://i.pravatar.cc/150?u=automotive"
  },
  {
    id: 9,
    icon: "🛍️",
    query: "Verified boutique fashion with personal styling near Bluport Mall",
    answer: "I've found a boutique that matches your preference. [Bluport Mode·] offers [Personal Styling†] by appointment and has [VIP Lounge†] available. Verified: [Silk Collection†]. Other options: [Chic Row HH†] (Designer) or [Trend Lab†] (Casual). [Request Stylist↗] for today.",
    type: "Retail Therapy",
    color: "fuchsia",
    bgColor: "bg-fuchsia-50 border-fuchsia-200 text-fuchsia-600 active:bg-fuchsia-600 active:text-white",
    accentBg: "bg-fuchsia-50/60 border-fuchsia-100",
    badge: "text-fuchsia-500 bg-fuchsia-500/10",
    avatar: "https://i.pravatar.cc/150?u=retail_therapy"
  },
  {
    id: 10,
    icon: "🔧",
    query: "Emergency AC repair available now in Khao Takiab area",
    answer: "I've found an available professional for you. [Cool Pros HH·] is [Available Now†] with 24/7 emergency service and [Verified AC Techs†]. They offer [Upfront Pricing†]. Other reliable options: [Quick Chill†] (Emergency) or [Trusty AC†] (Maintenance). [Call Professional↗] instantly.",
    type: "Home Services",
    color: "cyan",
    bgColor: "bg-cyan-50 border-cyan-200 text-cyan-600 active:bg-cyan-600 active:text-white",
    accentBg: "bg-cyan-50/60 border-cyan-100",
    badge: "text-cyan-500 bg-cyan-500/10",
    avatar: "https://i.pravatar.cc/150?u=home_services"
  },
  {
    id: 11,
    icon: "🏠",
    query: "Pool villa rentals with sea view and private garden in Hua Hin West",
    answer: "I've identified a premium residency for you. [West View Villas·] has units with [Sea Views†] and [Private Gardens†] available. I've verified the [Latest Floor Plans†]. Other projects: [Peak Villa HH†] (Penthouse) or [Aria West†] (Modern). [Book Viewing↗] for tonight.",
    type: "Real Estate",
    color: "slate",
    bgColor: "bg-slate-50 border-slate-200 text-slate-600 active:bg-slate-600 active:text-white",
    accentBg: "bg-slate-50/60 border-slate-100",
    badge: "text-slate-500 bg-slate-500/10",
    avatar: "https://i.pravatar.cc/150?u=real_estate"
  },
  {
    id: 12,
    icon: "🎓",
    query: "International prep school open house near Palm Hills",
    answer: "I've found the school information you're looking for. [St. Palm's HH·] is hosting an [Open House†] this Saturday and has a [Summer Soccer Camp†]. Verified: [IB Curriculum†]. Also check: [Global Academy†] (Prep) or [Unity High HH†] (Arts focus). [Register for Open House↗] now.",
    type: "Education",
    color: "sky",
    bgColor: "bg-sky-50 border-sky-200 text-sky-600 active:bg-sky-600 active:text-white",
    accentBg: "bg-sky-50/60 border-sky-100",
    badge: "text-sky-500 bg-sky-500/10",
    avatar: "https://i.pravatar.cc/150?u=education"
  },
  {
    id: 13,
    icon: "🥊",
    query: "Muay Thai gym with beginner trial class near Grand Market",
    answer: "Prepare for your training session! [Grand Muay Thai·] has a [Beginner Trial Class†] starting tonight at 7 PM. I've verified their [Pro Trainers†] and [New Gear†]. Also grounded: [Warrior Gym HH†] (Group Class) or [Legacy Combat†] (Private). [Sign Up↗] for your trial.",
    type: "Fitness",
    color: "red",
    bgColor: "bg-red-50 border-red-200 text-red-600 active:bg-red-600 active:text-white",
    accentBg: "bg-red-50/60 border-red-100",
    badge: "text-red-500 bg-red-500/10",
    avatar: "https://i.pravatar.cc/150?u=fitness"
  },
  {
    id: 14,
    icon: "✈️",
    query: "Private car to Suvarnabhumi Airport for tomorrow at 5am",
    answer: "I've found a reliable airport transfer for you. [Hua Hin Express Vans·] has a [Private Car†] available for 5 AM tomorrow. Verified: [฿2,000 Flat Rate†] and [English Speaking Driver†]. Also verified: [HH Taxi Center†] (Boutique) or [Airport Palace†] (VIP). [Book Stay↗] instantly.",
    type: "Travel",
    color: "teal",
    bgColor: "bg-teal-50 border-teal-200 text-teal-600 active:bg-teal-600 active:text-white",
    accentBg: "bg-teal-50/60 border-teal-100",
    badge: "text-teal-500 bg-teal-500/10",
    avatar: "https://i.pravatar.cc/150?u=travel"
  },
  {
    id: 15,
    icon: "📱",
    query: "iPhone screen repair with warranty near Cicada Market",
    answer: "I've found a reliable tech service for you. [Cicada iFix·] offers [Same-Day Repair†] for iPhone screens with a [6-Month Warranty†]. Verified: [Genuine Parts†]. Other options: [Tech Station HH†] (Certified) or [Laptop Care†] (Express). [Get Quote↗] now.",
    type: "Tech Support",
    color: "gray",
    bgColor: "bg-gray-50 border-gray-200 text-gray-600 active:bg-gray-600 active:text-white",
    accentBg: "bg-gray-50/60 border-gray-100",
    badge: "text-gray-500 bg-gray-500/10",
    avatar: "https://i.pravatar.cc/150?u=tech_support"
  },
  {
    id: 16,
    icon: "⚖️",
    query: "English speaking lawyer for visa or property in Hua Hin Center",
    answer: "I've located a legal professional for you. [Hua Hin Law Hub·] is [Open Now†] for visa and property consults. They have [Verified Notaries†] and [Fixed Pricing†] for consultations. Also grounded: [Law HH†] (Express) or [City Notary†] (Walk-in). [Get Directions↗] for the quickest route.",
    type: "Legal Services",
    color: "zinc",
    bgColor: "bg-zinc-50 border-zinc-200 text-zinc-600 active:bg-zinc-600 active:text-white",
    accentBg: "bg-zinc-50/60 border-zinc-100",
    badge: "text-zinc-500 bg-zinc-500/10",
    avatar: "https://i.pravatar.cc/150?u=legal_services"
  }
]

export default function QuerySimulator() {
  const [activeId, setActiveId] = useState(1)
  const [displayText, setDisplayText] = useState("")
  const [isTyping, setIsTyping] = useState(false)
  const [isAutoPlaying, setIsAutoPlaying] = useState(true)
  const [userLocation, setUserLocation] = useState({ city: "Hua Hin", isLocal: true })

  // 🌍 GEO-INTELLIGENCE: Detect user city on load
  useEffect(() => {
    const detectLocation = async () => {
      try {
        const res = await fetch("https://ipapi.co/json/")
        const data = await res.json()
        if (data.city) {
          const isPrachuap = data.city.includes("Hua Hin") || data.region?.includes("Prachuap")
          setUserLocation({ 
            city: isPrachuap ? "Hua Hin" : data.city, 
            isLocal: isPrachuap 
          })
        }
      } catch (e) {
        console.error("Location lookup failed, defaulting to Hua Hin")
      }
    }
    detectLocation()
  }, [])

  // 🗺️ LOCALIZATION LAYER: Deep-swap Hua Hin centric landmarks for generic global ones
  const localizedQueries = useMemo(() => {
    return PRELOADED_QUERIES.map(q => {
      let lQuery = q.query
      let lAnswer = q.answer

      if (!userLocation.isLocal) {
        // Swap city name
        lQuery = lQuery.replaceAll("Hua Hin", userLocation.city)
        lAnswer = lAnswer.replaceAll("Hua Hin", userLocation.city)
        lAnswer = lAnswer.replaceAll("Paws & Beach", `Paws & ${userLocation.city}`)
        
        // Swap specific landmarks for descriptive generic equivalents
        const landmarkMap: Record<string, string> = {
          "Bluport Mall": "The Central Mall",
          "Bluport": "The Mall",
          "Market Village": "The Main Center",
          "Cicada Market": "The Local Artisan Market",
          "Night Market": "The City Night Market",
          "Khao Takiab": "The South District",
          "Takiab": "The Beachfront District",
          "Vana Nava": "The Waterpark",
          "Centennial Park": "The City Park",
          "Grand Market": "The Central Market",
          "Palm Hills": "The North District"
        }

        Object.entries(landmarkMap).forEach(([key, val]) => {
          lQuery = lQuery.replaceAll(key, val)
          lAnswer = lAnswer.replaceAll(key, val)
        })
      }

      return { ...q, query: lQuery, answer: lAnswer }
    })
  }, [userLocation])

  const activeQuery = localizedQueries.find(q => q.id === activeId)!

  const rotateQuery = useCallback(() => {
    setActiveId(prev => (prev % PRELOADED_QUERIES.length) + 1)
  }, [])

  // Typing Effect
  useEffect(() => {
    setIsTyping(true)
    setDisplayText("")
    let currentText = ""
    let i = 0
    const timer = setInterval(() => {
      if (i < activeQuery.answer.length) {
        currentText += activeQuery.answer[i]
        setDisplayText(currentText)
        i++
      } else {
        clearInterval(timer)
        setIsTyping(false)
        
        if (isAutoPlaying) {
          const rotateTimer = setTimeout(rotateQuery, 6000)
          return () => clearTimeout(rotateTimer)
        }
      }
    }, 12)
    return () => clearInterval(timer)
  }, [activeId, activeQuery.answer, isAutoPlaying, rotateQuery])

  const formatText = (text: string) => {
    return text.split(/(\[.*?\])/g).map((part, index) => {
      if (part.startsWith('[') && part.endsWith(']')) {
        const content = part.slice(1, -1)
        const symbol = content.slice(-1)
        const name = content.slice(0, -1)
        
        let color = "text-blue-600"
        let bgColor = "bg-blue-600/90 shadow-blue-500/20" 
        let pillBg = "hover/word:bg-blue-50/80 hover/word:border-blue-200"
        let label = "Mention"

        if (symbol === "†") {
            color = "text-green-600"
            bgColor = "bg-green-600/90 shadow-green-500/20"
            pillBg = "hover/word:bg-green-50/80 hover/word:border-green-200"
            label = "Citation"
        } else if (symbol === "↗") {
            color = "text-purple-600"
            bgColor = "bg-purple-600/90 shadow-purple-500/20"
            pillBg = "hover/word:bg-purple-50/80 hover/word:border-purple-200"
            label = "Action"
        }

        return (
          <motion.span 
            key={index}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className={`inline-flex items-center px-1.5 py-0.5 rounded-lg transition-all border border-transparent ${pillBg} ${color} font-black mx-1 group/word relative cursor-help align-middle my-0.5`}
          >
            {name}{symbol}
            <span className={`absolute -bottom-5 -right-5 opacity-0 group-hover/word:opacity-80 scale-90 group-hover/word:scale-105 ${bgColor} text-white text-[9px] px-2.5 py-1 rounded-full font-black uppercase tracking-[0.1em] whitespace-nowrap transition-all shadow-xl z-50 pointer-events-none border border-white/20 ring-1 ring-white/5`}>
                {label}
            </span>
          </motion.span>
        )
      }
      return <span key={index} className="leading-inherit text-gray-700/90">{part}</span>
    })
  }

  const queryPhrases = useMemo(() => {
    return activeQuery.query.split(', ').map(p => p.trim())
  }, [activeQuery.query])

  return (
    <div className="w-full max-w-6xl mx-auto p-4 md:px-8 md:py-4 space-y-4">
      {/* ⚡ INSTANT PRELOADER */}
      <div className="hidden" aria-hidden="true">
        {PRELOADED_QUERIES.map(q => (
             <img key={q.id} src={q.avatar} alt="preload" />
        ))}
      </div>

      {/* Query Selector */}
      <div className="flex flex-col items-center space-y-3">
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3 w-full">
          {PRELOADED_QUERIES.map((q) => (
            <button
              key={q.id}
              onClick={() => {
                setActiveId(q.id)
                setIsAutoPlaying(false)
              }}
              className={`px-2 py-3 rounded-[12px] text-[10px] font-black uppercase tracking-[0.05em] transition-all border flex flex-col items-center justify-center gap-2 min-h-[70px] ${
                activeId === q.id 
                  ? "bg-gray-900 border-gray-900 text-white shadow-lg scale-105 z-10" 
                  : `${q.bgColor} opacity-80 hover:opacity-100 shadow-sm`
              }`}
            >
              <span className="text-xl leading-none">{q.icon}</span>
              <span className="leading-tight text-center">{q.type}</span>
            </button>
          ))}
        </div>
        
        <div className="flex items-center space-x-4">
            {!isAutoPlaying && (
                <button 
                onClick={() => setIsAutoPlaying(true)}
                className="text-[10px] font-black text-blue-500 uppercase tracking-widest hover:underline"
                >
                ▶ Resume Auto-Simulation
                </button>
            )}
            
            {/* Geo Badge */}
            <motion.div 
               initial={{ opacity: 0 }}
               animate={{ opacity: 1 }}
               className="flex items-center space-x-1.5 px-3 py-1 bg-green-50 border border-green-100 rounded-full"
            >
                <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse shadow-[0_0_8px_#22c55e]" />
                <p className="text-[9px] font-black text-green-600 uppercase tracking-widest whitespace-nowrap">Geo-Linked: {userLocation.city}</p>
            </motion.div>
        </div>
      </div>

      {/* Main Card */}
      <div className="relative group/card perspective-1000">
         <div className={`absolute -inset-1 bg-gradient-to-r from-blue-500/5 via-green-500/5 to-purple-500/5 rounded-[48px] blur-2xl group-hover/card:opacity-60 transition duration-1000`} />
         <div className={`relative bg-gray-50/10 backdrop-blur-3xl border border-gray-200/50 rounded-[40px] p-2 md:p-3 shadow-xl space-y-2 group-hover/card:border-gray-200 transition-all duration-500 overflow-hidden leading-none`}>
            
            {/* SUB-PILL: QUESTION (Intent Capture) */}
            <div className={`${activeQuery.accentBg} backdrop-blur-md rounded-[28px] p-3 md:p-5 border shadow-sm transition-colors duration-500 overflow-hidden relative`}>
                <div className="flex flex-col md:flex-row items-center md:items-start space-y-4 md:space-y-0 md:space-x-4 relative z-10">
                   <div className="w-12 h-12 rounded-xl overflow-hidden bg-white shadow-inner border border-white/50 shadow-[0_4px_10px_-5px_rgba(0,0,0,0.2)] flex-shrink-0">
                       <AnimatePresence mode="wait">
                           <motion.img 
                            key={activeQuery.avatar}
                            src={activeQuery.avatar} 
                            alt="User" 
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="w-full h-full object-cover"
                            loading="eager"
                            decoding="async"
                           />
                       </AnimatePresence>
                   </div>
                   
                   <div className="flex-1 space-y-0.5 overflow-hidden">
                      <div className="flex items-center space-x-2 mb-2">
                        <p className={`text-[8px] font-black uppercase tracking-[0.4em] leading-none px-2 py-1 rounded-full ${activeQuery.badge}`}>Intent Capture</p>
                      </div>
                      <div className="flex flex-wrap gap-x-2 text-base md:text-lg font-black italic tracking-tighter text-gray-900 max-w-2xl min-h-[1.2em] items-center justify-center md:justify-start">
                        <AnimatePresence mode="wait">
                          <motion.div 
                            key={`${activeId}-${userLocation.city}`}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.3 }}
                            className="flex flex-wrap justify-center md:justify-start gap-x-2"
                          >
                            {queryPhrases.map((phrase, i) => (
                               <motion.span
                                 key={phrase}
                                 initial={{ opacity: 0, x: -10, filter: "blur(4px)" }}
                                 animate={{ opacity: 1, x: 0, filter: "blur(0px)" }}
                                 transition={{ delay: i * 0.1, duration: 0.4 }}
                                 className="inline-block"
                                >
                                  {phrase}{i < queryPhrases.length - 1 ? "," : ""}
                               </motion.span>
                            ))}
                          </motion.div>
                        </AnimatePresence>
                      </div>
                   </div>
                </div>
            </div>

            {/* SUB-PILL: ANSWER (Engine Response) */}
            <div className="bg-white/95 backdrop-blur-lg rounded-[28px] p-4 md:p-7 border border-white shadow-sm space-y-5 min-h-[280px]">
               <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                     <div className={`w-1.5 h-1.5 rounded-full ${isTyping ? 'bg-orange-400 animate-pulse' : 'bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.3)]'}`} />
                     <p className="text-[8px] font-black text-gray-400 uppercase tracking-widest leading-none">LocalPlus Engine: Verify & Ground</p>
                  </div>
                  {isTyping ? (
                    <span className="text-[8px] font-black text-orange-500 uppercase animate-pulse tracking-[0.3em]">Processing at Relay: {userLocation.city}...</span>
                  ) : (
                    <span className="text-[8px] font-black text-green-500 uppercase tracking-[0.3em] flex items-center gap-1">
                        <div className="w-1 h-1 bg-green-500 rounded-full" /> Localized: {userLocation.city}
                    </span>
                  )}
               </div>

               <div className="text-[16px] font-black leading-[2.1] tracking-tight text-gray-900 text-center md:text-left">
                  {formatText(displayText)}
                  {isTyping && <motion.span animate={{ opacity: [0, 1] }} transition={{ repeat: Infinity }} className="inline-block w-1 h-5 bg-blue-500 ml-1.5 translate-y-1 rounded-full shadow-[0_0_5px_rgba(59,130,246,0.2)]" />}
               </div>

               {/* Grounding Legend */}
               <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-5 border-t border-gray-100">
                    <div className="p-2.5 rounded-xl flex items-center space-x-3 border border-blue-50/50">
                       <p className="text-blue-600 font-black text-sm">·</p>
                       <p className="text-[8px] font-black text-blue-600 uppercase tracking-[0.1em]">Merchant Grounding</p>
                    </div>
                    <div className="p-2.5 rounded-xl flex items-center space-x-3 border border-green-50/50">
                       <p className="text-green-600 font-black text-sm">†</p>
                       <p className="text-[8px] font-black text-green-600 uppercase tracking-[0.1em]">Live Data Citation</p>
                    </div>
                    <div className="p-2.5 rounded-xl flex items-center space-x-3 border border-purple-50/50">
                       <p className="text-purple-600 font-black text-sm">↗</p>
                       <p className="text-[8px] font-black text-purple-600 uppercase tracking-[0.1em]">Action Bridge</p>
                    </div>
                </div>
            </div>

         </div>
      </div>
    </div>
  )
}
