// [2026-02-14] - Premium Public Menu View for Consumers
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { supabase } from '../services/supabase';
import { restaurantService, MenuItem } from '../services/restaurantService';
import {
    Utensils,
    Info,
    Clock,
    MapPin,
    Smartphone,
    ChevronDown,
    Loader2
} from 'lucide-react';

const PublicMenu: React.FC = () => {
    const { businessId } = useParams<{ businessId: string }>();
    const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
    const [business, setBusiness] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [activeCategory, setActiveCategory] = useState<string | null>(null);

    useEffect(() => {
        if (businessId) {
            loadMenu();
        }
    }, [businessId]);

    const loadMenu = async () => {
        setLoading(true);
        try {
            // Get business info
            const { data: biz } = await supabase
                .from('businesses')
                .select('*')
                .eq('id', businessId)
                .single();

            setBusiness(biz);

            // Get menu items
            const items = await restaurantService.getMenuItems(businessId!);
            setMenuItems(items || []);

            if (items && items.length > 0) {
                const categories = Array.from(new Set(items.map(i => i.category || 'General')));
                setActiveCategory(categories[0]);
            }
        } catch (err) {
            console.error('Error loading public menu:', err);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-8">
                <Loader2 className="animate-spin text-indigo-600 mb-4" size={48} />
                <h2 className="text-xl font-bold text-slate-800">Setting the table...</h2>
            </div>
        );
    }

    if (!business) {
        return (
            <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-8 text-center">
                <Utensils className="text-slate-300 mb-6" size={64} />
                <h2 className="text-2xl font-bold text-slate-800">Menu Not Found</h2>
                <p className="text-slate-500 mt-2">We couldn't find the menu for this restaurant.</p>
            </div>
        );
    }

    const groupedItems = menuItems.reduce((acc: { [key: string]: MenuItem[] }, item) => {
        const cat = item.category || 'General';
        if (!acc[cat]) acc[cat] = [];
        acc[cat].push(item);
        return acc;
    }, {});

    const categories = Object.keys(groupedItems);

    return (
        <div className="min-h-screen bg-slate-50 text-slate-900 font-sans selection:bg-indigo-100">
            {/* Hero Header */}
            <div className="relative h-[40vh] bg-slate-900 overflow-hidden">
                <div className="absolute inset-0 opacity-40">
                    <img
                        src={business.image_url || "https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?auto=format&fit=crop&q=80&w=2000"}
                        alt={business.name}
                        className="w-full h-full object-cover"
                    />
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/20 to-transparent" />

                <div className="absolute bottom-0 left-0 right-0 p-8 text-white max-w-4xl mx-auto">
                    <div className="flex items-center gap-2 mb-3">
                        <span className="px-3 py-1 bg-indigo-600 rounded-full text-[10px] font-black uppercase tracking-widest">
                            {business.business_type || 'Restaurant'}
                        </span>
                    </div>
                    <h1 className="text-4xl md:text-5xl font-black tracking-tight mb-2 italic uppercase">{business.name}</h1>
                    <div className="flex flex-wrap items-center gap-6 text-slate-300 text-sm font-medium">
                        <div className="flex items-center gap-2">
                            <MapPin size={16} className="text-indigo-400" />
                            {business.city || 'Rawai, Phuket'}
                        </div>
                        <div className="flex items-center gap-2">
                            <Smartphone size={16} className="text-indigo-400" />
                            Digital Menu
                        </div>
                        <div className="flex items-center gap-2">
                            <Clock size={16} className="text-indigo-400" />
                            Open Now
                        </div>
                    </div>
                </div>
            </div>

            {/* Category Navigation (Sticky) */}
            <div className="sticky top-0 z-50 bg-white/80 backdrop-blur-xl border-b border-slate-100 overflow-x-auto no-scrollbar shadow-sm">
                <div className="max-w-4xl mx-auto px-4 flex">
                    {categories.map(cat => (
                        <button
                            key={cat}
                            onClick={() => {
                                setActiveCategory(cat);
                                document.getElementById(cat)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                            }}
                            className={`px-6 py-4 text-sm font-black uppercase tracking-tighter whitespace-nowrap transition-all border-b-2 ${activeCategory === cat
                                    ? 'text-indigo-600 border-indigo-600'
                                    : 'text-slate-400 border-transparent hover:text-slate-600'
                                }`}
                        >
                            {cat}
                        </button>
                    ))}
                </div>
            </div>

            {/* Menu Items */}
            <div className="max-w-4xl mx-auto p-4 md:p-8 space-y-16 pb-32">
                {Object.entries(groupedItems).map(([category, items]) => (
                    <section key={category} id={category} className="space-y-8 scroll-mt-24">
                        <div className="flex items-center gap-4">
                            <h2 className="text-3xl font-black text-slate-900 tracking-tighter italic uppercase">{category}</h2>
                            <div className="h-0.5 flex-1 bg-indigo-50" />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            {items.map((item, idx) => (
                                <div key={idx} className="group cursor-pointer">
                                    <div className="flex justify-between items-start gap-4 mb-2">
                                        <h3 className="text-lg font-bold text-slate-900 group-hover:text-indigo-600 transition-colors uppercase leading-tight font-sans">
                                            {item.name}
                                        </h3>
                                        <div className="flex items-center gap-1">
                                            <span className="text-xs font-black text-slate-400">฿</span>
                                            <span className="text-xl font-black text-slate-900 tracking-tighter">{item.price}</span>
                                        </div>
                                    </div>
                                    <p className="text-sm text-slate-500 leading-relaxed line-clamp-2 italic">
                                        {item.description || "The chef's secret recipe version of this classic dish."}
                                    </p>
                                    {item.image_url && (
                                        <div className="mt-4 rounded-2xl overflow-hidden h-48 bg-slate-100">
                                            <img src={item.image_url} alt={item.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </section>
                ))}
            </div>

            {/* Fixed Footer CTA */}
            <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-[60] w-[calc(100%-2rem)] max-w-lg">
                <div className="bg-slate-900 text-white p-6 rounded-[32px] shadow-2xl shadow-indigo-200/50 flex items-center justify-between border border-white/10 backdrop-blur-md bg-opacity-95">
                    <div>
                        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-indigo-400 mb-1">LocalPlus Dining</p>
                        <h4 className="text-sm font-bold tracking-tight">Support local restaurants</h4>
                    </div>
                    <button className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 rounded-2xl font-black text-xs uppercase tracking-widest transition-all hover:scale-105 active:scale-95 shadow-lg shadow-indigo-500/20">
                        Order At Table
                    </button>
                </div>
            </div>
        </div>
    );
};

export default PublicMenu;
