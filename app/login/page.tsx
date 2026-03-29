'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import Link from 'next/link'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError(null)

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) {
      setError(error.message)
      setLoading(false)
    } else {
      router.push('/dashboard')
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50/50 p-6">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-[32px] p-10 border border-gray-100 shadow-2xl shadow-gray-200/50 relative overflow-hidden">
          
          <div className="relative z-10">
            <div className="flex justify-center mb-8">
              <div className="bg-red-600 w-12 h-12 rounded-xl flex items-center justify-center shadow-lg shadow-red-500/20">
                <span className="text-white font-black text-2xl tracking-tighter">LP</span>
              </div>
            </div>

            <h1 className="text-2xl font-black text-center text-gray-900 mb-2 italic">Partner Portal.</h1>
            <p className="text-center text-gray-500 text-sm mb-8 font-medium italic">Operational Control System</p>

            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest pl-1 mb-1 block">Login Email</label>
                <input 
                  type="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@business.com" 
                  className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-5 py-3.5 text-sm focus:ring-2 focus:ring-red-500/10 focus:border-red-500/40 outline-none transition-all"
                  required
                />
              </div>

              <div>
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest pl-1 mb-1 block">Password</label>
                <input 
                  type="password" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••" 
                  className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-5 py-3.5 text-sm focus:ring-2 focus:ring-red-500/10 focus:border-red-500/40 outline-none transition-all"
                  required
                />
              </div>

              {error && (
                <div className="bg-red-50 border border-red-100 text-red-600 text-[10px] font-bold py-2 px-3 rounded-xl flex items-center">
                  Error: {error}
                </div>
              )}

              <button 
                type="submit" 
                disabled={loading}
                className="w-full bg-gray-900 text-white font-black py-4 rounded-2xl shadow-xl hover:bg-black active:scale-[0.98] transition-all disabled:opacity-50 disabled:scale-100"
              >
                {loading ? 'Authenticating...' : 'Enter Dashboard'}
              </button>
            </form>

            <div className="mt-8 pt-8 border-t border-gray-100 text-center">
              <Link href="/" className="text-gray-400 text-xs font-bold hover:text-gray-900 transition-colors uppercase tracking-widest">
                Return to Explainer
              </Link>
            </div>
          </div>

          {/* Abstract Shape */}
          <div className="absolute -top-12 -right-12 w-32 h-32 bg-red-500/5 rounded-full blur-3xl" />
        </div>
      </div>
    </div>
  )
}
