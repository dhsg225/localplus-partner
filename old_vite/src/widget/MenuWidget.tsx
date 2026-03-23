
import React, { useState, useEffect } from 'react';
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

// --- Sub-components ---

const HeroSlider: React.FC<{ business: any, menuItems: MenuItem[] }> = ({ business, menuItems }) => {
    // 1. Gather Images (Business Cover + Top Menu Items)
    const heroImages = React.useMemo(() => {
        // 1. Start with the specific brand images uploaded by the user
        const brandImages = [
            "https://blush-gastrobar.eatsthailand.com/wp-content/uploads/sites/20/2026/02/Driink-Mojito2.jpg",
            "https://blush-gastrobar.eatsthailand.com/wp-content/uploads/sites/20/2026/02/Food-carppcio.jpg",
            "https://blush-gastrobar.eatsthailand.com/wp-content/uploads/sites/20/2026/02/Food-carppcio2.jpg",
            "https://blush-gastrobar.eatsthailand.com/wp-content/uploads/sites/20/2026/02/Food-Fetticune-Carbonara3.jpg"
        ];

        const imgs = [...brandImages];
        if (business.image_url && !imgs.includes(business.image_url)) imgs.push(business.image_url);

        // Add up to 4 more from any menu items that have them
        const foodImages = menuItems
            .filter(item => item.image_url && !imgs.includes(item.image_url))
            .map(item => item.image_url!)
            .slice(0, 4);

        const allImages = [...imgs, ...foodImages];
        console.log('🍽️ HeroSlider Images:', allImages.length, allImages);
        return allImages;
    }, [business, menuItems]);

    // 2. Slider State
    const [currentSlide, setCurrentSlide] = React.useState(0);

    // 3. Auto-advance
    React.useEffect(() => {
        if (heroImages.length <= 1) return;
        const timer = setInterval(() => {
            setCurrentSlide(prev => (prev + 1) % heroImages.length);
        }, 5000);
        return () => clearInterval(timer);
    }, [heroImages.length]);

    // Fallback image if totally empty
    const displayImages = heroImages.length > 0
        ? heroImages
        : ["https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?auto=format&fit=crop&q=80&w=2000"];

    return (
        <div className="relative h-[40vh] min-h-[300px] bg-slate-900 overflow-hidden">
            {/* Image Slider */}
            {displayImages.map((img, idx) => (
                <div
                    key={idx}
                    className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${idx === currentSlide ? 'opacity-100' : 'opacity-0'
                        }`}
                >
                    <img
                        src={img}
                        alt={business.name}
                        className="w-full h-full object-cover"
                    />
                    {/* Overlay per slide to ensure text readability */}
                    <div className="absolute inset-0 bg-slate-900/40" />
                </div>
            ))}

            {/* Gradient Gradient */}
            <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/20 to-transparent z-10" />

            {/* Hero Content */}
            <div className="absolute bottom-0 left-0 right-0 p-8 text-white max-w-4xl mx-auto z-20">
                <div className="flex items-center gap-2 mb-3">
                    <span className="px-3 py-1 bg-indigo-600 rounded-full text-[10px] font-black uppercase tracking-widest">
                        {business.business_type || 'Restaurant'}
                    </span>
                </div>
                <h1 className="text-4xl md:text-[3.75rem] mb-4 uppercase tracking-[0.05em]" style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 300 }}>
                    {business.name}
                </h1>
                <div className="flex flex-wrap items-center gap-6 text-slate-200 text-sm font-medium">
                    <div className="flex items-center gap-2">
                        <MapPin size={16} className="text-indigo-400" />
                        {business.city || 'Hua Hin'}
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
    );
};

const MenuWidget: React.FC<{ businessId?: string }> = ({ businessId: propId }) => {
    // 1. Determine Business ID (Prop > Attribute > URL fallback)
    const [targetId, setTargetId] = useState<string | null>(propId || null);

    useEffect(() => {
        if (propId) {
            setTargetId(propId);
            return;
        }

        // Check for mounting point attribute
        const mountPoint = document.querySelector('.localplus-menu-root');
        if (mountPoint instanceof HTMLElement && mountPoint.dataset.bid) {
            setTargetId(mountPoint.dataset.bid);
        }
    }, [propId]);

    const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
    const [business, setBusiness] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [activeCategory, setActiveCategory] = useState<string | null>(null);

    useEffect(() => {
        if (targetId) {
            loadMenu(targetId);
        }
    }, [targetId]);

    const loadMenu = async (id: string) => {
        setLoading(true);
        try {
            // Get business info
            const { data: biz } = await supabase
                .from('businesses')
                .select('*')
                .eq('id', id)
                .single();

            setBusiness(biz);

            // Get menu items
            const items = await restaurantService.getMenuItems(id);
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
            {/* Hero Header with Fading Slider */}
            {/* Hero Header with Fading Slider */}
            <HeroSlider business={business} menuItems={menuItems} />

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

            {/* Discreet Bottom Right CTA */}
            <div className="fixed bottom-6 right-6 z-[60]">
                <button className="flex items-center gap-4 bg-slate-900/95 text-white pl-5 pr-2 py-2 rounded-2xl shadow-2xl border border-white/10 backdrop-blur-md transition-all hover:bg-slate-900 group">
                    <div className="text-left">
                        <p className="text-[8px] font-black uppercase tracking-[0.2em] text-indigo-400 leading-none mb-1">LocalPlus Dining</p>
                        <h4 className="text-[11px] font-bold tracking-tight opacity-70 group-hover:opacity-100 transition-opacity whitespace-nowrap">Support local restaurants</h4>
                    </div>
                    <div className="bg-indigo-600 px-4 py-3 rounded-xl font-black text-[10px] uppercase tracking-widest shadow-lg shadow-indigo-500/20 active:scale-95 transition-transform whitespace-nowrap">
                        Order At Table
                    </div>
                </button>
            </div>
        </div>
    );
};

export default MenuWidget;
