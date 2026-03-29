"use client";

import React, { useState, useEffect } from 'react';
import { 
  Building2, 
  Settings2, 
  Layers, 
  ChevronRight, 
  Loader2, 
  AlertCircle
} from 'lucide-react';
import { CoreOrganization, MiceVenue } from '../types/mice';
import { miceService } from '../../../lib/miceService';
import VenueManager from './VenueManager';
import OrganizationPanel from './OrganizationPanel';

export default function MiceManagementDashboard() {
  const [activeTab, setActiveTab] = useState<'profile' | 'inventory' | 'rfps' | 'performance'>('profile');
  const [org, setOrg] = useState<CoreOrganization | null>(null);
  const [venues, setVenues] = useState<MiceVenue[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function init() {
      try {
        setLoading(true);
        // Step 1: Get the current partner org
        const userOrg = await miceService.getMyOrganization();
        if (userOrg) {
          setOrg(userOrg);
          // Step 2: Get venues associated with this org
          const orgVenues = await miceService.getVenues(userOrg.id);
          setVenues(orgVenues);
        }
      } catch (err) {
        console.error("Dashboard failed to initialize:", err);
      } finally {
        setLoading(false);
      }
    }
    init();
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px]">
        <Loader2 className="animate-spin text-red-600 mb-4" size={48} />
        <p className="text-gray-500 font-bold uppercase tracking-widest text-xs">Initializing MICE Cloud...</p>
      </div>
    );
  }

  if (!org) {
    return (
      <div className="p-8 bg-red-50 border-2 border-dashed border-red-200 rounded-2xl text-center">
        <AlertCircle className="text-red-600 mx-auto mb-4" size={48} />
        <h2 className="text-xl font-black text-gray-900 mb-2">Unauthorized Access</h2>
        <p className="text-gray-600 max-w-md mx-auto">We couldn't link your session to a MICE partner organization. Please ensure your account has the 'Partner' role assigned.</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl animate-fade-in">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
        <div>
          <span className="text-red-600 font-black tracking-tighter text-sm uppercase px-2 py-1 bg-red-50 rounded mb-2 inline-block">
            MICE v2.4 (CORE)
          </span>
          <h1 className="text-5xl font-black text-gray-900 tracking-tighter leading-none">{org.name}</h1>
          <p className="text-gray-400 mt-2 font-medium flex items-center space-x-2">
            <span>Inventory Management Dashboard</span>
            <ChevronRight size={14} className="text-gray-300" />
            <span className="text-gray-500 bg-gray-100 px-2 py-0.5 rounded text-[10px] font-bold uppercase">Legacy ID: {org.legacy_id || 'NOT_SYNCED'}</span>
          </p>
        </div>
      </div>

      {/* Primary Navigation Tabs */}
      <div className="flex items-center space-x-1 mb-8 bg-gray-100 p-1.5 rounded-2xl max-w-fit shadow-inner">
        {[
          { id: 'profile', label: 'Org Settings', icon: Settings2 },
          { id: 'inventory', label: 'Inventory', icon: Building2 },
          { id: 'rfps', label: 'RFP Queue', icon: Layers },
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`flex items-center space-x-2 px-6 py-3 rounded-xl font-bold text-xs uppercase transition-all duration-300 ${
              activeTab === tab.id 
                ? 'bg-white text-gray-900 shadow-xl scale-105' 
                : 'text-gray-500 hover:text-gray-700 hover:bg-gray-200'
            }`}
          >
            <tab.icon size={16} />
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      {/* Tab Panels */}
      <div className="min-h-[500px]">
        {activeTab === 'profile' && (
          <OrganizationPanel org={org} onUpdate={(updated) => setOrg(updated)} />
        )}
        
        {activeTab === 'inventory' && (
          <VenueManager orgId={org.id} initialVenues={venues} />
        )}

        {activeTab === 'rfps' && (
          <div className="bg-gray-50 border-2 border-dashed border-gray-200 rounded-3xl p-16 text-center animate-pulse">
            <Layers size={64} className="text-gray-200 mx-auto mb-4" />
            <h2 className="text-sm font-bold text-gray-400 uppercase tracking-widest leading-relaxed">RFP Engine Offline</h2>
            <p className="text-xs text-gray-400 mt-1 uppercase font-medium">Matching restricted to Phase 7+ Deployment</p>
          </div>
        )}
      </div>
    </div>
  );
}
