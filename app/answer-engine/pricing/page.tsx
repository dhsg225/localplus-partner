"use client"

import { motion } from "framer-motion"
import { Check, Zap, Star, Shield, Info } from "lucide-react"

const PLANS = [
  {
    name: "FREE",
    subtitle: "“Get on the Map”",
    price: "0",
    color: "emerald",
    features: [
      "Business listing (Name, category, location)",
      "Appears in AI results (basic facts only)",
      "Marked as Unverified"
    ],
    aiBehavior: "“The Reporter” — AI only states facts",
    cta: "Get Listed",
    icon: <Star className="w-5 h-5" />
  },
  {
    name: "STARTER",
    subtitle: "“Get Verified”",
    price: "495",
    color: "blue",
    features: [
      "Verified business (no “unverified” label)",
      "3 key highlights (WiFi, Parking, etc.)",
      "Basic visibility in AI responses"
    ],
    aiBehavior: "“The Confirmer” — AI confirms suitability",
    credits: "~500 AI Credits / month",
    cta: "Start Plan",
    icon: <Shield className="w-5 h-5" />
  },
  {
    name: "GROWTH",
    subtitle: "“Show Your Vibe”",
    price: "995",
    color: "purple",
    features: [
      "Full business description",
      "AI summarises reviews",
      "Stronger presence in recommendations"
    ],
    aiBehavior: "“The Concierge” — AI explains experience & vibe",
    credits: "~1,500 AI Credits / month",
    cta: "Upgrade",
    icon: <Zap className="w-5 h-5" />
  },
  {
    name: "DOMINANT",
    subtitle: "“Get Customers”",
    price: "1,995",
    color: "orange",
    isPopular: true,
    features: [
      "Priority ranking in AI responses",
      "Direct action buttons (Call / WhatsApp)",
      "Deep context used in recommendations"
    ],
    aiBehavior: "“The Promoter” — AI actively recommends",
    credits: "~5,000 AI Credits / month",
    cta: "Go Dominant",
    icon: <Star className="w-5 h-5 fill-current" />
  }
]

const PROGRESSION = [
  { label: "Exists", plan: "FREE", color: "bg-emerald-500" },
  { label: "Trusted", plan: "STARTER", color: "bg-blue-500" },
  { label: "Understood", plan: "GROWTH", color: "bg-purple-500" },
  { label: "Recommended", plan: "DOMINANT", color: "bg-orange-500" }
]

export default function PricingPage() {
  return (
    <main className="min-h-screen bg-white">
      {/* 1. HERO SECTION */}
      <section className="pt-24 pb-16 px-6 text-center space-y-8">
        <motion.div
           initial={{ opacity: 0, y: 20 }}
           animate={{ opacity: 1, y: 0 }}
           transition={{ duration: 0.8, ease: "easeOut" }}
           className="space-y-4"
        >
          <h1 className="text-5xl md:text-8xl font-black text-gray-900 italic tracking-tighter leading-[0.85] font-heading max-w-5xl mx-auto">
            Be Recommended <br/> 
            <span className="text-blue-600 not-italic">By AI — Not Just Listed</span>
          </h1>
          <p className="max-w-2xl mx-auto text-xl md:text-2xl text-gray-400 font-bold tracking-tight leading-tight">
            LocalPlus helps AI understand and promote your business to <span className="text-gray-900">customers actively searching nearby.</span>
          </p>
          <p className="text-blue-500 italic uppercase tracking-[0.2em] text-[10px] font-black animate-pulse">
            The more context you provide, the more confidently AI recommends you.
          </p>
        </motion.div>
      </section>

      {/* 5. VISUAL EXPLAINER (Horizontal Progression) */}
      <section className="pb-24 px-6">
        <div className="max-w-4xl mx-auto bg-gray-50/50 border border-gray-100 rounded-[32px] p-8 md:p-12 relative overflow-hidden">
          <div className="absolute top-0 right-0 p-8 opacity-5">
             <Star size={120} />
          </div>
          
          <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8 md:gap-4">
             {PROGRESSION.map((step, idx) => (
                <div key={step.label} className="flex flex-col items-center flex-1 w-full md:w-auto">
                   <div className="flex items-center w-full md:w-auto">
                      <div className={`w-4 h-4 rounded-full ${step.color} shadow-lg shadow-${step.color}/20`} />
                      {idx < PROGRESSION.length - 1 && (
                         <div className="hidden md:block h-px flex-1 bg-gray-200 mx-4 min-w-[40px]" />
                      )}
                   </div>
                   <div className="mt-4 text-center">
                      <p className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 mb-1">{step.plan}</p>
                      <p className="text-lg font-black italic text-gray-900">{step.label}</p>
                   </div>
                </div>
             ))}
          </div>
        </div>
      </section>

      {/* 2. PRICING CARDS */}
      <section className="pb-24 px-6 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {PLANS.map((plan, idx) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
              className={`relative flex flex-col rounded-[2.5rem] p-8 transition-all hover:scale-[1.02] ${
                plan.isPopular 
                  ? 'bg-gray-900 text-white shadow-2xl ring-4 ring-orange-500/20' 
                  : 'bg-white border border-gray-100 shadow-sm hover:shadow-xl'
              }`}
            >
              {plan.isPopular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-orange-500 text-white text-[10px] font-black uppercase tracking-[0.2em] px-4 py-1.5 rounded-full shadow-lg">
                  Most Powerful
                </div>
              )}

              <div className="mb-6 flex justify-between items-start">
                <div>
                  <p className={`text-[11px] font-black uppercase tracking-[0.2em] mb-1 ${plan.isPopular ? 'text-orange-400' : 'text-gray-400'}`}>
                    {plan.name}
                  </p>
                  <h3 className="text-xl font-black italic">{plan.subtitle}</h3>
                </div>
                <div className={plan.isPopular ? 'text-orange-400' : 'text-blue-500'}>
                  {plan.icon}
                </div>
              </div>

              <div className="mb-8">
                <div className="flex items-baseline space-x-1">
                  <span className="text-4xl font-black">{plan.price}</span>
                  <span className={`text-sm font-bold opacity-60`}>THB / mo</span>
                </div>
              </div>

              <div className="space-y-6 flex-1">
                <div className="space-y-3">
                  {plan.features.map((feature, i) => (
                    <div key={i} className="flex items-start space-x-3 group">
                      <Check className={`w-4 h-4 mt-0.5 flex-shrink-0 ${plan.isPopular ? 'text-orange-400' : 'text-emerald-500'}`} />
                      <span className={`text-[13px] font-bold leading-tight ${plan.isPopular ? 'text-gray-300' : 'text-gray-500'}`}>
                        {feature}
                      </span>
                    </div>
                  ))}
                </div>

                <div className={`p-4 rounded-2xl ${plan.isPopular ? 'bg-white/5 border border-white/10' : 'bg-gray-50 border border-gray-100'}`}>
                  <p className={`text-[10px] font-black uppercase tracking-[0.1em] mb-2 ${plan.isPopular ? 'text-orange-400' : 'text-blue-500'}`}>
                    AI Behaviour
                  </p>
                  <p className="text-[13px] font-black italic leading-tight">
                    {plan.aiBehavior}
                  </p>
                </div>

                {plan.credits && (
                  <div className="flex items-center space-x-2">
                    <Zap className="w-4 h-4 text-yellow-500 fill-current" />
                    <span className="text-xs font-black uppercase tracking-wider">{plan.credits}</span>
                  </div>
                )}
              </div>

              <button className={`mt-10 w-full py-4 rounded-2xl text-[13px] font-black uppercase tracking-[0.2em] transition-all ${
                plan.isPopular 
                  ? 'bg-orange-500 hover:bg-orange-600 text-white shadow-lg shadow-orange-500/20' 
                  : 'bg-gray-900 hover:bg-black text-white'
              }`}>
                {plan.cta}
              </button>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Comparison Section: Us vs. Them */}
      <section className="py-24 px-6 bg-gray-50/30 border-y border-gray-100">
        <div className="max-w-5xl mx-auto space-y-16">
          <div className="text-center space-y-4">
            <h2 className="text-4xl md:text-6xl font-black italic tracking-tighter text-gray-900 leading-tight">
              Like Ads. <br className="md:hidden" />
              <span className="text-blue-600 not-italic">But way easier.</span>
            </h2>
            <p className="text-xl text-gray-400 font-bold max-w-2xl mx-auto">
              Stop fighting with complicated ad managers. LocalPlus gives you the results of advertising without the headache.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-px bg-gray-200 rounded-[2.5rem] overflow-hidden border border-gray-200 shadow-2xl">
            {/* Traditional Ads */}
            <div className="bg-white p-10 md:p-14 space-y-8">
              <div className="space-y-2">
                <div className="w-12 h-12 bg-gray-100 rounded-2xl flex items-center justify-center text-gray-400 grayscale">
                   <Zap size={24} />
                </div>
                <h3 className="text-2xl font-black text-gray-300 italic">Traditional Ads</h3>
                <p className="text-xs font-black uppercase tracking-widest text-gray-400">Google & Facebook</p>
              </div>

              <div className="space-y-6">
                {[
                  { label: "Management", value: "Daily monitoring & tweaking required", bad: true },
                  { label: "Setup", value: "Complex keywords, audiences & bids", bad: true },
                  { label: "Cost", value: "Unpredictable. Easy to overspend.", bad: true },
                  { label: "Result", value: "Just a link in a list of results", bad: true }
                ].map((item, i) => (
                  <div key={i} className="space-y-1">
                    <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">{item.label}</p>
                    <p className="text-sm font-bold text-gray-400 line-through decoration-red-500/30">{item.value}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* LocalPlus */}
            <div className="bg-gray-900 p-10 md:p-14 space-y-8 relative overflow-hidden">
              <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
                 <Zap size={160} className="text-orange-500 fill-current" />
              </div>

              <div className="space-y-2 relative z-10">
                <div className="w-12 h-12 bg-orange-500 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-orange-500/20">
                   <Zap size={24} className="fill-current" />
                </div>
                <h3 className="text-2xl font-black text-white italic">The LocalPlus Way</h3>
                <p className="text-xs font-black uppercase tracking-widest text-orange-500">Pure Grounded AI</p>
              </div>

              <div className="space-y-6 relative z-10">
                {[
                  { label: "Management", value: "Zero. AI handles everything.", good: true },
                  { label: "Setup", value: "Instant. No keywords or bidding.", good: true },
                  { label: "Cost", value: "Fixed monthly. Completely predictable.", good: true },
                  { label: "Result", value: "A direct, active recommendation.", good: true }
                ].map((item, i) => (
                  <div key={i} className="space-y-1">
                    <p className="text-[10px] font-black uppercase tracking-widest text-gray-500">{item.label}</p>
                    <div className="flex items-center space-x-2">
                       <Check size={14} className="text-orange-500" />
                       <p className="text-sm font-bold text-white">{item.value}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. HOW IT WORKS SECTION */}
      <section className="py-24 bg-gray-50/50 border-y border-gray-100 px-6">
        <div className="max-w-4xl mx-auto grid md:grid-cols-2 gap-16 items-center">
          <div className="space-y-6">
            <h2 className="text-4xl md:text-6xl font-black italic tracking-tighter text-gray-900">
               How AI <br/> <span className="text-blue-600 not-italic">Credits Work</span>
            </h2>
            <p className="text-lg text-gray-500 font-bold leading-relaxed">
              AI Credits power how often and how strongly the AI can recommend your business to nearby customers.
            </p>
          </div>
          
          <div className="space-y-4">
             {[
               "Basic mentions use fewer credits",
               "Recommendations and customer actions use more credits",
               "When credits run out, your business stays visible but with basic information only"
             ].map((text, i) => (
               <div key={i} className="flex items-center space-x-4 bg-white p-5 rounded-2xl border border-black/5 shadow-sm">
                  <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 font-black text-xs">
                     {i + 1}
                  </div>
                  <p className="text-sm font-bold text-gray-700">{text}</p>
               </div>
             ))}
          </div>
        </div>
      </section>

      {/* 4. BOOST SECTION (Top-up) */}
      <section className="py-24 px-6 text-center bg-gray-900 text-white">
        <div className="max-w-4xl mx-auto space-y-12">
           <div className="space-y-4">
              <Zap className="w-12 h-12 text-orange-500 fill-current mx-auto animate-pulse" />
              <h2 className="text-4xl md:text-6xl font-black italic tracking-tight">Need More <br/> Customers This Month?</h2>
              <p className="text-gray-400 font-bold max-w-xl mx-auto">
                 You can top up AI Credits anytime to boost your visibility during busy periods or special events.
              </p>
           </div>
           
           <div className="flex flex-col md:flex-row justify-center gap-6">
              <div className="bg-white/5 border border-white/10 p-8 rounded-[2rem] flex-1">
                 <p className="text-4xl font-black text-orange-500 mb-2">+500 THB</p>
                 <p className="text-[11px] font-black uppercase tracking-[0.2em] text-gray-400">Extra exposure boost</p>
              </div>
              <div className="bg-white/5 border border-white/10 p-8 rounded-[2rem] flex-1">
                 <p className="text-4xl font-black text-orange-400 mb-2">+1,000 THB</p>
                 <p className="text-[11px] font-black uppercase tracking-[0.2em] text-gray-400">Stronger boost</p>
              </div>
           </div>
        </div>
      </section>

      {/* Trust Footer */}
      <section className="py-16 text-center opacity-30">
         <p className="text-[10px] font-black uppercase tracking-[0.4em]">Propelling local businesses through grounded intelligence</p>
      </section>
    </main>
  )
}
