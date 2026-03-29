"use client";

import React, { useState, useEffect } from 'react';
import { 
  Maximize, 
  Sun, 
  Moon, 
  Trash2, 
  Plus, 
  Save, 
  Layout, 
  Settings,
  MoreVertical,
  CheckCircle2,
  Loader2
} from 'lucide-react';
import { MiceVenueSpace } from '../types/mice';
import { miceService } from '../../../lib/miceService';

interface SpaceBuilderProps {
  venueId: string;
}

const SpaceBuilder: React.FC<SpaceBuilderProps> = ({ venueId }) => {
  const [spaces, setSpaces] = useState<MiceVenueSpace[]>([]);
  const [isAdding, setIsAdding] = useState(false);
  const [loading, setLoading] = useState(true);
  const [savingId, setSavingId] = useState<string | null>(null);

  const [newSpace, setNewSpace] = useState({
    name: '',
    area_sqm: 0,
    natural_light: false,
    minimum_spend: 0
  });

  useEffect(() => {
    fetchSpaces();
  }, [venueId]);

  const fetchSpaces = async () => {
    try {
      setLoading(true);
      const data = await miceService.getSpaces(venueId);
      setSpaces(data);
    } catch (err) {
      console.error('Failed to load spaces:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddSpace = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setSavingId('new');
      const added = await miceService.addSpace({
        venue_id: venueId,
        ...newSpace
      });
      if (added) {
        setSpaces(prev => [...prev, added]);
        setIsAdding(false);
        setNewSpace({ name: '', area_sqm: 0, natural_light: false, minimum_spend: 0 });
      }
    } catch (err) {
      alert('Failed to add space');
    } finally {
      setSavingId(null);
    }
  };

  if (loading) {
    return <div className="text-xs text-gray-400 font-bold uppercase py-4 animate-pulse">Loading Spaces...</div>;
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-xs font-bold text-gray-700 uppercase tracking-widest flex items-center space-x-2">
          <Layout size={14} className="text-red-500" />
          <span>Room Inventory</span>
        </h3>
        <button 
          onClick={() => setIsAdding(!isAdding)}
          className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase transition-all flex items-center space-x-1 ${
            isAdding ? 'bg-gray-200 text-gray-700' : 'bg-red-50 text-red-600 hover:bg-red-100'
          }`}
        >
          {isAdding ? 'Cancel' : (
            <>
              <Plus size={12} />
              <span>Add Space</span>
            </>
          )}
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {isAdding && (
          <div className="bg-white border-2 border-dashed border-red-200 p-4 rounded-xl shadow-inner animate-fade-in">
            <form onSubmit={handleAddSpace} className="space-y-3">
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-gray-500 uppercase px-1">Room/Area Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Sapphire Suite"
                  className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:border-red-500 outline-none"
                  value={newSpace.name}
                  onChange={e => setNewSpace({...newSpace, name: e.target.value})}
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-gray-500 uppercase px-1">Area (sqm)</label>
                  <div className="relative">
                    <input
                      type="number"
                      placeholder="0"
                      className="w-full pl-3 pr-10 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:border-red-500 outline-none"
                      value={newSpace.area_sqm || ''}
                      onChange={e => setNewSpace({...newSpace, area_sqm: parseInt(e.target.value) || 0})}
                    />
                    <Maximize size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  </div>
                </div>
                
                <div className="space-y-1 flex flex-col justify-end">
                  <button
                    type="button"
                    onClick={() => setNewSpace({...newSpace, natural_light: !newSpace.natural_light})}
                    className={`h-[38px] flex items-center justify-center space-x-2 px-3 border rounded-lg transition-all ${
                      newSpace.natural_light ? 'bg-yellow-50 border-yellow-200 text-yellow-600' : 'bg-gray-50 border-gray-200 text-gray-400'
                    }`}
                  >
                    {newSpace.natural_light ? <Sun size={14} /> : <Moon size={14} />}
                    <span className="text-[10px] font-bold uppercase">{newSpace.natural_light ? 'Natural Light' : 'No Daylight'}</span>
                  </button>
                </div>
              </div>

              <button 
                type="submit" 
                disabled={savingId === 'new'}
                className="w-full bg-red-600 text-white font-bold py-2 rounded-lg text-xs hover:bg-black transition-all flex items-center justify-center space-x-2 shadow-lg"
              >
                {savingId === 'new' ? (
                   <Loader2 className="animate-spin" size={16} />
                ) : (
                  <>
                    <CheckCircle2 size={14} />
                    <span>Confirm Space</span>
                  </>
                )}
              </button>
            </form>
          </div>
        )}

        {spaces.length === 0 && !isAdding && (
          <div className="col-span-full py-8 text-center bg-gray-50/50 rounded-xl border border-dotted border-gray-200">
            <Layout size={32} className="text-gray-200 mx-auto mb-2" />
            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">No rooms defined yet</p>
          </div>
        )}

        {spaces.map(space => (
          <div key={space.id} className="bg-white border border-gray-200 p-4 rounded-xl hover:border-red-200 transition-all flex items-center justify-between group shadow-sm hover:shadow-md">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-gray-50 rounded-lg text-gray-600 group-hover:bg-red-50 group-hover:text-red-600 transition-all">
                <Layout size={20} />
              </div>
              <div>
                <h4 className="text-sm font-bold text-gray-900 group-hover:text-red-700 transition-all leading-tight">
                  {space.name}
                </h4>
                <div className="flex items-center space-x-3 mt-1 text-[10px] font-bold text-gray-400 uppercase tracking-tighter">
                  <div className="flex items-center space-x-1">
                    <Maximize size={10} />
                    <span>{space.area_sqm || '--'} sqm</span>
                  </div>
                  {space.natural_light && (
                    <div className="flex items-center space-x-1 text-yellow-500">
                      <Sun size={10} />
                      <span>Natural Light</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
            
            <div className="flex items-center opacity-0 group-hover:opacity-100 transition-all">
               <button className="p-1.5 text-gray-300 hover:text-red-600 transition-all">
                 <Trash2 size={14} />
               </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SpaceBuilder;
