'use client'

import React, { useState, useEffect, useMemo } from 'react'
import { Check, X, Split, Layers, RotateCcw, AlertTriangle, Play, ChevronRight, LayoutGrid, LayoutList } from 'lucide-react'

// Mock Ingestion Batch interface
interface IngestionBatch {
  id: string
  source_name: string
  global_date: string
  status: string
  total_items: number
  created_at: string
  mode: 'terry' | 'facebook' | 'ocr' | 'manual'
}

type IngestionMode = 'terry' | 'facebook' | 'ocr' | 'manual'

// Mock Queue Item interface
interface QueueItem {
  id: string
  batch_id: string
  ingestion_group_id: string
  raw_venue: string
  raw_performer: string
  raw_time: string
  raw_snippet_context: string
  matched_venue_id: string | null
  matching_confidence: number
  start_time: string | null
  end_time: string | null
  validation_status: 'pending' | 'approved' | 'rejected'
  duplicate_warning: boolean
  is_inferred_duration: boolean
  extracted_title: string
  raw_date: string
}

const IngestionDashboard = ({ organizationId, initialBatches }: { organizationId: string, initialBatches: IngestionBatch[] }) => {
  const [batches, setBatches] = useState(initialBatches)
  const [selectedBatchId, setSelectedBatchId] = useState<string | null>(initialBatches[0]?.id || null)
  const [queue, setQueue] = useState<QueueItem[]>([])
  const [mode, setMode] = useState<'table' | 'grouped'>('grouped')
  const [loading, setLoading] = useState(false)
  const [showIngestModal, setShowIngestModal] = useState(false)
  
  // Modal State
  const [newBatch, setNewBatch] = useState({
    source: '',
    date: new Date().toISOString().split('T')[0],
    mode: 'terry' as IngestionMode,
    content: ''
  })
  
  const selectedBatch = batches.find(b => b.id === selectedBatchId)

  // 1. Fetch Queue for selected batch
  useEffect(() => {
    if (selectedBatchId) fetchQueue(selectedBatchId)
  }, [selectedBatchId])

  const fetchQueue = async (batchId: string) => {
    setLoading(true)
    try {
      const response = await fetch(`/api/data-ingest?endpoint=queue&batchId=${batchId}`)
      const json = await response.json()
      setQueue(json.data || [])
    } catch (err: any) {
      alert(err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleIngestSubmit = async () => {
     setLoading(true)
     try {
        const res = await fetch('/api/data-ingest', {
           method: 'POST',
           headers: { 'Content-Type': 'application/json' },
           body: JSON.stringify({
              endpoint: 'parse',
              organization_id: organizationId,
              source_name: newBatch.source,
              global_date: newBatch.date,
              mode: newBatch.mode,
              raw_content: newBatch.content
           })
        })
        const json = await res.json()
        if (json.success) {
           alert('Batch created. Redirecting to validation...')
           setShowIngestModal(false)
           window.location.reload()
        }
     } finally {
        setLoading(false)
     }
  }

  // 2. Action Handlers (Phase I2 Mechanics)
  const handleUpdate = async (id: string, updates: Partial<QueueItem>) => {
    setQueue(prev => prev.map(q => q.id === id ? { ...q, ...updates } : q))
  }

  const handleApprove = (id: string) => handleUpdate(id, { validation_status: 'approved' })
  const handleReject = (id: string) => handleUpdate(id, { validation_status: 'rejected' })

  const handleRollback = async () => {
    if (!selectedBatchId) return
    if (!confirm('This will delete all event instances created from this batch. Continue?')) return
    
    setLoading(true)
    try {
      await fetch('/api/data-ingest', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ endpoint: 'rollback', batchId: selectedBatchId })
      })
      alert('Rollback successful. Returning to validation.')
      fetchQueue(selectedBatchId)
    } finally {
      setLoading(false)
    }
  }

  const handleCommit = async () => {
    if (!selectedBatchId) return
    const pending = queue.filter(q => q.validation_status === 'pending').length
    if (pending > 0 && !confirm(`There are ${pending} rows still pending. Commit only approved rows?`)) return

    setLoading(true)
    try {
      await fetch('/api/data-ingest', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ endpoint: 'commit', batchId: selectedBatchId })
      })
      alert('Data committed to production Event Engine.')
      fetchQueue(selectedBatchId)
    } catch (err: any) {
      alert(err.message)
    } finally {
      setLoading(false)
    }
  }

  // 3. Grouping Logic
  const groupedData = useMemo(() => {
    const groups: Record<string, QueueItem[]> = {}
    queue.forEach(item => {
      if (!groups[item.ingestion_group_id]) groups[item.ingestion_group_id] = []
      groups[item.ingestion_group_id].push(item)
    })
    return groups
  }, [queue])

  return (
    <div className="flex bg-white rounded-[40px] border border-gray-100 overflow-hidden min-h-[700px] shadow-2xl relative">
      
      {/* 🚀 INGEST MODAL */}
      {showIngestModal && (
         <div className="fixed inset-0 z-[100] bg-black/40 backdrop-blur-sm flex items-center justify-center p-8">
            <div className="bg-white rounded-[48px] w-full max-w-2xl p-12 shadow-2xl space-y-8 animate-in fade-in zoom-in duration-300">
               <h2 className="text-3xl font-black italic tracking-tighter text-gray-900 mb-6">Initialize <span className="text-red-500">Intake.</span></h2>
               <div className="space-y-6">
                  <div className="grid grid-cols-2 gap-6">
                     <div>
                        <label className="text-[10px] font-black uppercase text-gray-400 mb-2 block">Source Name</label>
                        <input className="w-full px-6 py-4 bg-gray-50 border-none rounded-2xl font-bold" value={newBatch.source} onChange={e => setNewBatch({...newBatch, source: e.target.value})} placeholder="e.g. Terry's Tuesday Post" />
                     </div>
                     <div>
                        <label className="text-[10px] font-black uppercase text-gray-400 mb-2 block">Ingestion Mode</label>
                        <select className="w-full px-6 py-4 bg-gray-50 border-none rounded-2xl font-bold appearance-none" value={newBatch.mode} onChange={e => setNewBatch({...newBatch, mode: e.target.value as any})}>
                           <option value="terry">Terry Feed (Inherited Venue)</option>
                           <option value="facebook">Facebook Dump (Raw AI)</option>
                           <option value="ocr">OCR / Photo Scan (Strict Match)</option>
                           <option value="manual">Manual Scratchpad</option>
                        </select>
                     </div>
                  </div>
                  <div>
                     <label className="text-[10px] font-black uppercase text-gray-400 mb-2 block">Raw Input Content</label>
                     <textarea className="w-full px-6 py-4 bg-gray-50 border-none rounded-2xl font-medium min-h-[200px]" value={newBatch.content} onChange={e => setNewBatch({...newBatch, content: e.target.value})} placeholder="Paste messy text here..." />
                  </div>
               </div>
               <div className="flex gap-4 pt-6">
                  <button onClick={() => setShowIngestModal(false)} className="flex-1 py-5 border border-gray-100 rounded-3xl text-[10px] font-black uppercase text-gray-400 hover:bg-gray-50 transition-all">CANCEL</button>
                  <button onClick={handleIngestSubmit} disabled={loading} className="flex-[2] py-5 bg-red-500 text-white rounded-3xl text-[10px] font-black uppercase tracking-widest shadow-xl hover:bg-black transition-all">START AI INGESTION →</button>
               </div>
            </div>
         </div>
      )}

      {/* Sidebar: Batches */}
      <div className="w-80 border-r border-gray-100 bg-gray-50/30 flex flex-col">
        <div className="p-8 border-b border-gray-100 bg-white">
          <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 mb-4">Discovery History.</h3>
          <button onClick={() => setShowIngestModal(true)} className="w-full py-4 bg-black text-white rounded-2xl text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-red-500 transition-all">
            <Play size={14} fill="currentColor" /> START NEW INTAKE
          </button>
        </div>
        <div className="flex-1 overflow-y-auto p-4 space-y-2">
          {batches.map(b => (
            <div 
              key={b.id} 
              onClick={() => setSelectedBatchId(b.id)}
              className={`p-6 rounded-[32px] cursor-pointer transition-all border ${selectedBatchId === b.id ? 'bg-white border-gray-200 shadow-xl scale-105' : 'border-transparent hover:bg-gray-100'}`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className={`text-[8px] font-black uppercase px-2 py-1 rounded-lg ${b.mode === 'ocr' ? 'bg-purple-100 text-purple-700' : 'bg-blue-100 text-blue-700'}`}>{b.mode}</span>
                <span className={`text-[9px] font-black uppercase px-2 py-1 rounded-full ${b.status === 'completed' ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700'}`}>{b.status}</span>
              </div>
              <h4 className="text-sm font-black text-gray-900 leading-tight mb-1">{b.source_name}</h4>
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-tighter">{new Date(b.created_at).toLocaleDateString()} • {b.total_items} Items</p>
            </div>
          ))}
        </div>
      </div>

      {/* Main Content: The Grid */}
      <div className="flex-1 flex flex-col relative bg-white">
        {/* Header Controls */}
        <div className="p-8 border-b border-gray-100 bg-white flex items-center justify-between sticky top-0 z-10 shadow-sm">
          <div className="flex items-center gap-4">
            <h2 className="text-2xl font-black italic tracking-tighter text-gray-900">{selectedBatch?.source_name} <span className="text-gray-300">Ops</span></h2>
            <div className="flex bg-gray-100 p-1 rounded-2xl ml-4">
               <button onClick={() => setMode('grouped')} className={`px-4 py-2 rounded-xl text-[10px] font-black flex items-center gap-2 transition-all ${mode === 'grouped' ? 'bg-white text-black shadow-sm' : 'text-gray-400 hover:text-black'}`}><LayoutGrid size={12} /> CLUSTERS</button>
               <button onClick={() => setMode('table')} className={`px-4 py-2 rounded-xl text-[10px] font-black flex items-center gap-2 transition-all ${mode === 'table' ? 'bg-white text-black shadow-sm' : 'text-gray-400 hover:text-black'}`}><LayoutList size={12} /> ROWS</button>
            </div>
          </div>

          <div className="flex items-center gap-4">
              <button onClick={handleRollback} className="px-6 py-3 border border-gray-200 text-[10px] font-black text-gray-400 hover:text-red-500 hover:border-red-500 rounded-2xl flex items-center gap-2 transition-all"><RotateCcw size={14} /> ROLLBACK</button>
              <button onClick={handleCommit} className="px-10 py-3 bg-red-500 hover:bg-black text-white text-[10px] font-black uppercase tracking-widest rounded-2xl shadow-lg transition-all flex items-center gap-2 animate-pulse hover:animate-none">COMMIT LEDGER <ChevronRight size={14} /></button>
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 p-8 bg-gray-50/20 overflow-y-auto">
          {mode === 'grouped' ? (
             <div className="space-y-12 pb-24">
               {Object.entries(groupedData).map(([groupId, rows]) => (
                  <div key={groupId} className="space-y-4">
                     <div className="flex items-center justify-between px-4">
                        <div className="flex items-center gap-3">
                           <div className="w-1 bg-gray-900 h-6 rounded-full"></div>
                           <h3 className="text-lg font-black italic text-gray-900">{rows[0].matched_venue_id ? rows[0].raw_venue : <span className="text-red-500">UNMATCHED VENUE</span>}</h3>
                           <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{rows[0].raw_date}</span>
                        </div>
                     </div>
                     <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {rows.map(row => (
                           <div key={row.id} className={`bg-white border rounded-[40px] p-8 shadow-sm hover:shadow-2xl transition-all group ${row.validation_status === 'approved' ? 'border-green-500/30 bg-green-50/10' : row.matching_confidence < 90 ? 'border-red-100 bg-red-50/10' : 'border-gray-50'}`}>
                              <div className="flex items-start justify-between mb-8">
                                 <div className={`p-4 rounded-3xl font-black text-sm ${row.matching_confidence < 70 ? 'bg-red-100 text-red-600' : 'bg-gray-50 text-gray-400'}`}>
                                    {row.start_time ? new Date(row.start_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false }) : 'TIME?'}
                                 </div>
                                 <div className="flex items-center gap-2">
                                    <button onClick={() => handleApprove(row.id)} className={`p-3 rounded-2xl transition-all ${row.validation_status === 'approved' ? 'bg-green-500 text-white shadow-lg' : 'bg-gray-50 text-gray-300 hover:bg-green-100 hover:text-green-600'}`}><Check size={18} /></button>
                                    <button onClick={() => handleReject(row.id)} className={`p-3 rounded-2xl transition-all ${row.validation_status === 'rejected' ? 'bg-red-500 text-white shadow-lg' : 'bg-gray-50 text-gray-300 hover:bg-red-100 hover:text-red-600'}`}><X size={18} /></button>
                                 </div>
                              </div>
                              <h5 className="text-sm font-black text-gray-900 mb-2 leading-tight uppercase italic">{row.raw_performer}</h5>
                              <p className="text-[11px] font-medium text-gray-400 line-clamp-2 leading-relaxed mb-8">"{row.raw_snippet_context}"</p>
                              
                              <div className="pt-6 border-t border-gray-50 flex items-center justify-between">
                                 <div className="flex items-center gap-1">
                                    <button className="px-3 py-1 bg-gray-50 hover:bg-black hover:text-white rounded-lg text-[8px] font-black text-gray-300 transition-all uppercase">SPLIT</button>
                                    <button className="px-3 py-1 bg-gray-50 hover:bg-black hover:text-white rounded-lg text-[8px] font-black text-gray-300 transition-all uppercase">MERGE</button>
                                 </div>
                                 <span className={`text-[9px] font-black uppercase tracking-widest ${row.matching_confidence > 90 ? 'text-green-500' : 'text-red-500'}`}>{row.matching_confidence.toFixed(0)}% MATCH</span>
                              </div>
                           </div>
                        ))}
                     </div>
                  </div>
               ))}
             </div>
          ) : (
             <div className="bg-white rounded-[40px] border border-gray-100 overflow-hidden shadow-xl mb-24">
                <table className="w-full text-left border-collapse">
                   <thead>
                      <tr className="bg-gray-900 border-none">
                         <th className="p-8 text-[10px] font-black text-gray-400 uppercase tracking-widest">Status</th>
                         <th className="p-8 text-[10px] font-black text-gray-400 uppercase tracking-widest">Venue</th>
                         <th className="p-8 text-[10px] font-black text-gray-400 uppercase tracking-widest">Performer</th>
                         <th className="p-8 text-[10px] font-black text-gray-400 uppercase tracking-widest">Time</th>
                         <th className="p-8 text-[10px] font-black text-gray-400 uppercase tracking-widest">Confidence</th>
                         <th className="p-8 text-[10px] font-black text-gray-400 uppercase tracking-widest px-8">Audit</th>
                      </tr>
                   </thead>
                   <tbody>
                      {queue.map(row => (
                         <tr key={row.id} className="border-b border-gray-50 hover:bg-gray-50/50 transition-all group">
                            <td className="p-8">
                               <div className={`w-4 h-4 rounded-full border-4 border-white shadow-sm ${row.validation_status === 'approved' ? 'bg-green-500' : row.validation_status === 'rejected' ? 'bg-red-500' : 'bg-gray-100 animate-pulse'}`}></div>
                            </td>
                            <td className={`p-8 font-black italic text-sm ${row.matching_confidence < 90 ? 'text-red-500' : 'text-gray-900'}`}>{row.raw_venue}</td>
                            <td className="p-8 text-sm font-black text-gray-900/40 group-hover:text-gray-900 transition-colors uppercase italic">{row.raw_performer}</td>
                            <td className="p-8 text-xs font-black text-gray-400">
                               {row.start_time ? new Date(row.start_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false }) : '??:??'}
                            </td>
                            <td className="p-8">
                               <span className={`text-[10px] font-black ${row.matching_confidence > 90 ? 'text-green-500' : 'text-red-500'}`}>{row.matching_confidence.toFixed(1)}%</span>
                            </td>
                            <td className="p-8 px-8 flex items-center gap-3">
                               <button onClick={() => handleApprove(row.id)} className={`p-3 rounded-2xl transition-all shadow-sm ${row.validation_status === 'approved' ? 'bg-green-500 text-white' : 'bg-gray-100 text-gray-300 hover:bg-green-500 hover:text-white'}`}><Check size={16} /></button>
                               <button onClick={() => handleReject(row.id)} className={`p-3 rounded-2xl transition-all shadow-sm ${row.validation_status === 'rejected' ? 'bg-red-500 text-white' : 'bg-gray-100 text-gray-300 hover:bg-red-500 hover:text-white'}`}><X size={16} /></button>
                               <button className="p-3 rounded-2xl bg-gray-100 text-gray-300 hover:text-black transition-all shadow-sm"><Split size={16} /></button>
                            </td>
                         </tr>
                      ))}
                   </tbody>
                </table>
             </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default IngestionDashboard
