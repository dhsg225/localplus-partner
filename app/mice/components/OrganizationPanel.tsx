"use client";

import React, { useState } from 'react';
import { 
  Building2, 
  Mail, 
  Phone, 
  FileText, 
  Save, 
  Sync, 
  AlertCircle,
  CheckCircle2,
  RefreshCw
} from 'lucide-react';
import { CoreOrganization } from '../types/mice';
import { miceService } from '../../../lib/miceService';

interface OrganizationPanelProps {
  org: CoreOrganization;
  onUpdate: (updated: CoreOrganization) => void;
}

const OrganizationPanel: React.FC<OrganizationPanelProps> = ({ org, onUpdate }) => {
  const [formData, setFormData] = useState<Partial<CoreOrganization>>({
    name: org.name,
    contact_email: org.contact_email || '',
    phone: org.phone || '',
    description: org.description || ''
  });
  const [isSaving, setIsSaving] = useState(false);
  const [lastSync, setLastSync] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setError(null);
    try {
      const updated = await miceService.updateOrganization(org.id, formData);
      setLastSync(new Date().toLocaleTimeString());
      onUpdate(updated);
    } catch (err) {
      setError("Sync write failure. Check RLS context.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 animate-fade-in-up">
      <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-2xl">
        <div className="mb-6">
          <h2 className="text-xl font-black text-gray-900 mb-1">Organizational Details</h2>
          <p className="text-[10px] font-bold text-red-500 uppercase tracking-widest">Write-Forward Sync Engine Active</p>
        </div>

        <form onSubmit={handleSave} className="space-y-6">
          <div className="space-y-2">
            <label className="text-xs font-black text-gray-500 uppercase flex items-center space-x-2">
              <Building2 size={12} />
              <span>Entity Name</span>
            </label>
            <input
              type="text"
              className="w-full px-4 py-3 bg-gray-50 border border-transparent rounded-xl text-sm font-bold text-gray-900 focus:bg-white focus:border-red-500 outline-none transition-all shadow-inner"
              value={formData.name}
              onChange={e => setFormData({ ...formData, name: e.target.value })}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-xs font-black text-gray-500 uppercase flex items-center space-x-2">
                <Mail size={12} />
                <span>Contact Email</span>
              </label>
              <input
                type="email"
                className="w-full px-4 py-3 bg-gray-50 border border-transparent rounded-xl text-sm font-bold text-gray-900 focus:bg-white focus:border-red-500 outline-none transition-all shadow-inner"
                value={formData.contact_email}
                onChange={e => setFormData({ ...formData, contact_email: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-black text-gray-500 uppercase flex items-center space-x-2">
                <Phone size={12} />
                <span>Global Phone</span>
              </label>
              <input
                type="text"
                className="w-full px-4 py-3 bg-gray-50 border border-transparent rounded-xl text-sm font-bold text-gray-900 focus:bg-white focus:border-red-500 outline-none transition-all shadow-inner"
                value={formData.phone}
                onChange={e => setFormData({ ...formData, phone: e.target.value })}
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-black text-gray-500 uppercase flex items-center space-x-2">
              <FileText size={12} />
              <span>Public Description</span>
            </label>
            <textarea
              rows={4}
              className="w-full px-4 py-3 bg-gray-50 border border-transparent rounded-xl text-sm font-bold text-gray-900 focus:bg-white focus:border-red-500 outline-none transition-all shadow-inner resize-none"
              value={formData.description}
              onChange={e => setFormData({ ...formData, description: e.target.value })}
            />
          </div>

          <div className="pt-4">
            <button 
              type="submit"
              disabled={isSaving}
              className="w-full bg-red-600 text-white font-black py-4 rounded-2xl hover:bg-black transition-all flex items-center justify-center space-x-3 shadow-xl group"
            >
              {isSaving ? (
                <Loader2 className="animate-spin" size={20} />
              ) : (
                <>
                  <RefreshCw size={18} className="group-hover:rotate-180 transition-transform duration-500" />
                  <span className="uppercase tracking-widest text-xs">Sync Organizational Data</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>

      <div className="flex flex-col space-y-8">
        {/* Legacy Health Check */}
        <div className="bg-gray-900 p-8 rounded-3xl text-white shadow-2xl relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition-opacity">
            <Building2 size={120} />
          </div>
          <h3 className="text-sm font-black uppercase tracking-widest text-red-500 mb-6 flex items-center space-x-2.5">
             <span className="h-2.5 w-2.5 bg-red-500 rounded-full animate-pulse" />
             <span>Sync Status: [ LIVE ]</span>
          </h3>
          
          <div className="space-y-6">
            <div className="flex items-center space-x-4">
               <div className="p-3 bg-white/10 rounded-xl">
                 <CheckCircle2 size={24} className="text-green-400" />
               </div>
               <div>
                 <p className="text-[10px] font-bold text-white/40 uppercase">Bridge Verification</p>
                 <p className="text-sm font-bold">LEGACY_{org.legacy_id || 'ID_NOT_FOUND'}</p>
               </div>
            </div>

            <div className="border-t border-white/10 pt-6">
              <p className="text-[10px] font-bold text-white/40 uppercase mb-2">Internal Health Audit</p>
              <div className="flex space-x-1">
                {[1,2,3,4,5,6,7].map(i => (
                  <div key={i} className="h-4 w-1 bg-green-500/40 rounded-full" />
                ))}
                <div className="h-4 w-1 bg-red-500 rounded-full animate-pulse" />
              </div>
            </div>
            
            {lastSync && (
              <p className="text-[10px] font-black italic text-green-400">
                Last propagated to businesses table at {lastSync}
              </p>
            )}
            
            {error && (
              <div className="mt-4 p-4 bg-red-500/20 border border-red-500/30 rounded-2xl flex items-center space-x-3">
                <AlertCircle size={16} className="text-red-400" />
                <p className="text-[10px] font-bold text-red-100 uppercase italic leading-none">{error}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

// Internal Loader helper
const Loader2 = ({ className, size }: { className?: string, size?: number }) => (
  <RefreshCw className={`animate-spin ${className}`} size={size} />
);

export default OrganizationPanel;
