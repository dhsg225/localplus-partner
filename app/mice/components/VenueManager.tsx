"use client";

import React, { useState } from 'react';
import { 
  Building2, 
  MapPin, 
  Plus, 
  ChevronRight, 
  ChevronDown, 
  Trash2, 
  Edit3, 
  Settings2,
  Users
} from 'lucide-react';
import { MiceVenue, MiceVenueType } from '../types/mice';
import { miceService } from '../../../lib/miceService';
import SpaceBuilder from './SpaceBuilder';

interface VenueManagerProps {
  orgId: string;
  initialVenues: MiceVenue[];
}

const VenueManager: React.FC<VenueManagerProps> = ({ orgId, initialVenues }) => {
  const [venues, setVenues] = useState<MiceVenue[]>(initialVenues);
  const [selectedVenueId, setSelectedVenueId] = useState<string | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  const [newVenue, setNewVenue] = useState({
    name: '',
    venue_type: 'hotel_ballroom' as MiceVenueType,
    max_capacity: 0
  });

  const handleAddVenue = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const added = await miceService.addVenue({
        organization_id: orgId,
        ...newVenue
      });
      if (added) {
        setVenues(prev => [...prev, added]);
        setIsAdding(false);
        setNewVenue({ name: '', venue_type: 'hotel_ballroom', max_capacity: 0 });
      }
    } catch (err) {
      alert('Failed to add venue');
    }
  };

  const getVenueTypeLabel = (type: MiceVenueType) => {
    return type.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
  };

  return (
    <div className="space-y-6 animate-fade-in-up">
      {/* Venue List */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
        <div className="p-4 border-b border-gray-100 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <h2 className="text-lg font-bold text-gray-900 leading-tight">Your MICE Venues</h2>
            <span className="bg-gray-100 px-2 py-0.5 rounded text-[10px] font-bold text-gray-500 uppercase">
              {venues.length} Total
            </span>
          </div>
          <button 
            onClick={() => setIsAdding(!isAdding)}
            className="flex items-center space-x-1.5 px-3 py-1.5 bg-red-600 text-white rounded-lg hover:bg-red-700 font-bold text-xs transition-all active:scale-95 shadow-md"
          >
            <Plus size={14} />
            <span>New Venue</span>
          </button>
        </div>

        <div className="divide-y divide-gray-100">
          {isAdding && (
            <div className="p-4 bg-gray-50 border-b border-red-100">
              <form onSubmit={handleAddVenue} className="space-y-3">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                  <input
                    type="text"
                    required
                    placeholder="Venue Name (e.g. Grand Ballroom)"
                    className="px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:border-red-500 outline-none shadow-inner"
                    value={newVenue.name}
                    onChange={e => setNewVenue({...newVenue, name: e.target.value})}
                  />
                  <select
                    className="px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:border-red-500 outline-none"
                    value={newVenue.venue_type}
                    onChange={e => setNewVenue({...newVenue, venue_type: e.target.value as MiceVenueType})}
                  >
                    <option value="hotel_ballroom">Hotel Ballroom</option>
                    <option value="conference_center">Conference Center</option>
                    <option value="beach_venue">Beach Venue</option>
                    <option value="restaurant">Restaurant</option>
                    <option value="other">Other Unique Venue</option>
                  </select>
                  <div className="flex items-center space-x-2">
                    <button 
                      type="submit" 
                      className="flex-1 bg-gray-900 text-white font-bold py-2 rounded-lg text-xs"
                    >
                      Save Venue
                    </button>
                    <button 
                      type="button"
                      onClick={() => setIsAdding(false)}
                      className="px-4 py-2 text-gray-400 font-bold text-xs"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </form>
            </div>
          )}

          {venues.length === 0 && !isAdding && (
            <div className="p-12 text-center">
              <Building2 size={48} className="text-gray-200 mx-auto mb-3" />
              <h3 className="text-sm font-bold text-gray-500 uppercase tracking-widest">Empty Inventory</h3>
              <p className="text-xs text-gray-400 mt-1">Start by adding your first venue above.</p>
            </div>
          )}

          {venues.map((venue) => (
            <div 
              key={venue.id} 
              className={`transition-all duration-300 ${
                selectedVenueId === venue.id ? 'bg-red-50/30' : 'hover:bg-gray-50'
              }`}
            >
              <div 
                className="p-4 flex items-center justify-between cursor-pointer group"
                onClick={() => setSelectedVenueId(selectedVenueId === venue.id ? null : venue.id)}
              >
                <div className="flex items-center space-x-4">
                  <div className={`p-2.5 rounded-xl border border-transparent transition-all ${
                    selectedVenueId === venue.id ? 'bg-red-600 text-white shadow-lg' : 'bg-gray-100 text-gray-600 group-hover:bg-gray-200'
                  }`}>
                    <Building2 size={24} />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-gray-900 leading-tight">{venue.name}</h3>
                    <div className="flex items-center space-x-3 mt-1.5">
                      <div className="flex items-center space-x-1 text-gray-500">
                        <Settings2 size={12} />
                        <span className="text-[10px] font-bold uppercase">{getVenueTypeLabel(venue.venue_type)}</span>
                      </div>
                      <div className="flex items-center space-x-1 text-gray-500 border-l border-gray-200 pl-3">
                        <Users size={12} />
                        <span className="text-[10px] font-bold uppercase">{venue.max_capacity || 0} Capacity</span>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="hidden group-hover:flex items-center space-x-1 pr-4">
                    <button className="p-2 text-gray-400 hover:text-blue-600 hover:bg-white rounded-lg transition-all border border-transparent hover:border-blue-100 hover:shadow-sm">
                      <Edit3 size={16} />
                    </button>
                    <button className="p-2 text-gray-400 hover:text-red-600 hover:bg-white rounded-lg transition-all border border-transparent hover:border-red-100 hover:shadow-sm">
                      <Trash2 size={16} />
                    </button>
                  </div>
                  <div className={`p-1 rounded-full border transition-all ${
                    selectedVenueId === venue.id ? 'bg-red-100 border-red-200 text-red-600' : 'bg-gray-50 border-gray-100 text-gray-400 group-hover:bg-white group-hover:border-gray-200 group-hover:text-gray-600'
                  }`}>
                    {selectedVenueId === venue.id ? <ChevronDown size={18} /> : <ChevronRight size={18} />}
                  </div>
                </div>
              </div>

              {selectedVenueId === venue.id && (
                <div className="px-4 pb-6 pt-2 animate-slide-down">
                  <div className="ml-14 border-l-2 border-red-100 pl-6 pb-2">
                    <SpaceBuilder venueId={venue.id} />
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default VenueManager;
