// [2026-02-13] - Premium Menu Management with AI OCR Ingestion
import React, { useState, useEffect, useRef } from 'react';
import {
    Plus,
    FileText,
    Upload,
    Loader2,
    Check,
    X,
    Edit3,
    Trash2,
    ChevronRight,
    Utensils,
    Image as ImageIcon,
    AlertCircle,
    Smartphone,
    ArrowUp,
    ArrowDown
} from 'lucide-react';
import { restaurantService, MenuItem as IMenuItem } from '../services/restaurantService';
import { supabase } from '../services/supabase';

const MenuManagement: React.FC = () => {
    const [menuItems, setMenuItems] = useState<IMenuItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [isImporting, setIsImporting] = useState(false);
    const [importStatus, setImportStatus] = useState<'idle' | 'uploading' | 'parsing' | 'review'>('idle');
    const [parsedData, setParsedData] = useState<{ categories: { name: string, items: IMenuItem[] }[] }>({ categories: [] });
    const [businessId, setBusinessId] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);

    // [New] Individual Edit States
    const [editingItem, setEditingItem] = useState<IMenuItem | null>(null);
    const [showEditModal, setShowEditModal] = useState(false);
    const [isUploadingImage, setIsUploadingImage] = useState(false);
    const [showShareToast, setShowShareToast] = useState(false);

    const fileInputRef = useRef<HTMLInputElement>(null);
    const dishImageRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        loadMenu();
    }, []);

    const loadMenu = async () => {
        setLoading(true);
        try {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) return;

            const { data: partner } = await supabase
                .from('partners')
                .select('business_id')
                .eq('user_id', user.id)
                .single();

            if (partner?.business_id) {
                setBusinessId(partner.business_id);
                const items = await restaurantService.getMenuItems(partner.business_id);
                setMenuItems(items || []);
            }
        } catch (err) {
            console.error('Error loading menu:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (!files || files.length === 0 || !businessId) return;

        setImportStatus('parsing');
        setError(null);

        try {
            // Support multi-file ingestion sequentially
            for (let i = 0; i < files.length; i++) {
                const result = await restaurantService.ingestMenu(files[i], businessId);
                if (result.success && result.menu) {
                    // Merge categories from this page into parsedData
                    setParsedData(prev => {
                        const newCategories = [...prev.categories];
                        result.menu.categories.forEach((newCat: any) => {
                            const existing = newCategories.find(c => c.name.toLowerCase() === newCat.name.toLowerCase());
                            if (existing) {
                                existing.items = [...existing.items, ...newCat.items];
                            } else {
                                newCategories.push(newCat);
                            }
                        });
                        return { categories: newCategories };
                    });
                }
            }
            setImportStatus('review');
        } catch (err: any) {
            setError(err.message || 'Failed to process image');
            setImportStatus('idle');
        }
    };

    const confirmImport = async () => {
        if (parsedData.categories.length === 0 || !businessId) return;

        setLoading(true);
        try {
            // Get current max sort order to append
            const currentMax = menuItems.length > 0 ? Math.max(...menuItems.map(i => i.sort_order || 0)) : -1;

            const itemsToSave = parsedData.categories.flatMap((cat, cIdx) =>
                cat.items.map((item, iIdx) => ({
                    ...item,
                    category: cat.name,
                    sort_order: currentMax + 1 + (cIdx * 100) + iIdx
                }))
            );

            await restaurantService.saveMenuItems(itemsToSave, businessId);
            setIsImporting(false);
            setParsedData({ categories: [] });
            setImportStatus('idle');
            loadMenu();
        } catch (err) {
            setError('Failed to save menu items');
        } finally {
            setLoading(false);
        }
    };

    const handleUpdateItem = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!editingItem || !editingItem.id) return;

        try {
            await restaurantService.updateMenuItem(editingItem.id, editingItem);
            setShowEditModal(false);
            loadMenu();
        } catch (err) {
            console.error('Error updating item:', err);
            alert('Failed to update item');
        }
    };

    const handleDeleteItem = async (id: string) => {
        if (!window.confirm('Are you sure you want to delete this item?')) return;
        try {
            await restaurantService.deleteMenuItem(id);
            loadMenu();
        } catch (err) {
            console.error('Error deleting item:', err);
        }
    };

    const handleAddItem = () => {
        setEditingItem({
            name: '',
            price: 0,
            description: '',
            category: 'Menu',
            is_available: true,
            sort_order: menuItems.length
        });
        setShowEditModal(true);
    };

    const handleSaveNewItem = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!editingItem || !businessId) return;

        try {
            await restaurantService.saveMenuItems([editingItem], businessId);
            setShowEditModal(false);
            setEditingItem(null);
            loadMenu();
        } catch (err) {
            console.error('Error adding item:', err);
        }
    };

    const handleDishPhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file || !editingItem) return;

        setIsUploadingImage(true);
        try {
            const { apiService } = await import('../services/apiService');
            const result = await apiService.uploadMedia(file, businessId || undefined);
            if (result.url) {
                const updatedItem = { ...editingItem, image_url: result.url };
                setEditingItem(updatedItem);

                // [New] Auto-save if uploading directly from card (modal closed)
                if (!showEditModal && updatedItem.id) {
                    await restaurantService.updateMenuItem(updatedItem.id, updatedItem);
                    loadMenu();
                }
            }
        } catch (err) {
            console.error('Photo upload failed:', err);
            alert('Photo upload failed');
        } finally {
            setIsUploadingImage(false);
        }
    };

    const moveItem = async (item: IMenuItem, direction: 'up' | 'down') => {
        const index = menuItems.findIndex(i => i.id === item.id);
        if (index === -1) return;

        const newItems = [...menuItems];
        if (direction === 'up' && index > 0) {
            [newItems[index], newItems[index - 1]] = [newItems[index - 1], newItems[index]];
        } else if (direction === 'down' && index < newItems.length - 1) {
            [newItems[index], newItems[index + 1]] = [newItems[index + 1], newItems[index]];
        } else {
            return;
        }

        // Optimistic update
        setMenuItems(newItems);

        // Save new order
        try {
            await Promise.all(newItems.map((item, idx) =>
                restaurantService.updateMenuItem(item.id!, { sort_order: idx })
            ));
        } catch (err) {
            console.error('Failed to save order:', err);
            loadMenu(); // Rollback
        }
    };

    const copyPublicLink = () => {
        if (!businessId) return;
        const url = `${window.location.origin}/menu/p/${businessId}`;
        navigator.clipboard.writeText(url);
        setShowShareToast(true);
        setTimeout(() => setShowShareToast(false), 3000);
    };

    // Group items by category for display
    const groupedItems = menuItems.reduce((acc: { [key: string]: IMenuItem[] }, item) => {
        const cat = item.category || 'General';
        if (!acc[cat]) acc[cat] = [];
        acc[cat].push(item);
        return acc;
    }, {});

    return (
        <div className="max-w-7xl mx-auto space-y-8 animate-in fade-in duration-700">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white/40 backdrop-blur-md p-8 rounded-3xl border border-white shadow-xl">
                <div>
                    <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Menu Management</h1>
                    <p className="text-slate-500 mt-1">Manage your dishes, prices, and categories with AI assistance.</p>
                </div>
                <div className="flex gap-3 flex-wrap">
                    <button
                        onClick={copyPublicLink}
                        className="flex items-center gap-2 px-6 py-3 bg-white border border-slate-200 text-indigo-600 rounded-2xl font-bold hover:bg-indigo-50 transition-all shadow-sm"
                    >
                        <Smartphone size={18} />
                        Share Menu
                    </button>
                    <button
                        onClick={() => setIsImporting(true)}
                        className="flex items-center gap-2 px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl font-semibold shadow-lg shadow-indigo-200 transition-all"
                    >
                        <Upload size={18} />
                        Import
                    </button>
                    <button
                        onClick={handleAddItem}
                        className="flex items-center gap-2 px-6 py-3 bg-slate-900 text-white rounded-2xl font-semibold hover:bg-slate-800 transition-all"
                    >
                        <Plus size={18} />
                        Add New
                    </button>
                </div>
            </div>

            {loading && menuItems.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-20 bg-white/20 rounded-3xl">
                    <Loader2 className="animate-spin text-indigo-500 mb-4" size={48} />
                    <p className="text-slate-500 font-medium">Brewing your menu...</p>
                </div>
            ) : menuItems.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-24 bg-white/40 backdrop-blur-md border border-dashed border-slate-300 rounded-[40px] text-center">
                    <div className="w-24 h-24 bg-indigo-50 text-indigo-500 rounded-full flex items-center justify-center mb-6">
                        <Utensils size={40} />
                    </div>
                    <h2 className="text-2xl font-bold text-slate-800">Your menu is empty</h2>
                    <p className="text-slate-500 mt-2 max-w-md">
                        Don't waste time typing! Upload a photo of your physical menu and our AI will digitize it for you in seconds.
                    </p>
                    <button
                        onClick={() => setIsImporting(true)}
                        className="mt-8 px-8 py-4 bg-slate-900 text-white rounded-2xl font-bold hover:bg-slate-800 transition-all flex items-center gap-2"
                    >
                        <ImageIcon size={20} />
                        Try AI Menu Ingest
                    </button>
                </div>
            ) : (
                <div className="space-y-12">
                    {Object.entries(groupedItems).map(([category, items], catIdx) => (
                        <div key={catIdx} className="space-y-6">
                            <div className="flex items-center gap-4">
                                <h2 className="text-2xl font-black text-slate-900 tracking-tight italic">{category}</h2>
                                <div className="h-px flex-1 bg-slate-200" />
                                <span className="text-sm font-bold text-slate-400 bg-slate-50 px-3 py-1 rounded-full">{items.length} items</span>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {items.map((item, idx) => (
                                    <div key={item.id || idx} className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm hover:shadow-md transition-all group relative overflow-hidden">
                                        {item.image_url && (
                                            <div className="absolute top-0 right-0 w-24 h-24 opacity-10 -mr-4 -mt-4 rotate-12">
                                                <img src={item.image_url} alt="" className="w-full h-full object-cover rounded-full" />
                                            </div>
                                        )}
                                        <div className="flex justify-between items-start">
                                            <div className="flex-1 pr-4">
                                                <h3 className="text-lg font-bold text-slate-800 group-hover:text-indigo-600 transition-colors uppercase tracking-tight">{item.name}</h3>
                                                <p className="text-sm text-slate-500 mt-1 line-clamp-2 leading-relaxed">{item.description || 'No description provided.'}</p>
                                            </div>
                                            <div className="text-xl font-black text-slate-900 bg-slate-50 px-3 py-1 rounded-2xl">
                                                ฿{item.price}
                                            </div>
                                        </div>
                                        <div className="mt-8 pt-4 border-t border-slate-50 flex gap-2">
                                            <div className="flex items-center gap-1">
                                                <button
                                                    onClick={() => moveItem(item, 'up')}
                                                    className="p-2 text-slate-300 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all"
                                                    title="Move Up"
                                                >
                                                    <ArrowUp size={14} />
                                                </button>
                                                <button
                                                    onClick={() => moveItem(item, 'down')}
                                                    className="p-2 text-slate-300 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all"
                                                    title="Move Down"
                                                >
                                                    <ArrowDown size={14} />
                                                </button>
                                                <button
                                                    onClick={() => { setEditingItem(item); setTimeout(() => dishImageRef.current?.click(), 0); }}
                                                    className="p-2 text-slate-300 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all"
                                                    title="Upload Photo"
                                                >
                                                    <ImageIcon size={14} />
                                                </button>
                                            </div>
                                            <button
                                                onClick={() => { setEditingItem(item); setShowEditModal(true); }}
                                                className="flex-1 flex items-center justify-center gap-2 py-2 text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl transition-all font-bold text-sm"
                                            >
                                                <Edit3 size={16} />
                                                Edit
                                            </button>
                                            <button
                                                onClick={() => handleDeleteItem(item.id!)}
                                                className="p-2 text-slate-300 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all"
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Individual Edit/Add Modal */}
            {showEditModal && editingItem && (
                <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={() => setShowEditModal(false)} />
                    <form
                        onSubmit={editingItem.id ? handleUpdateItem : handleSaveNewItem}
                        className="relative w-full max-w-lg bg-white rounded-[40px] shadow-2xl overflow-hidden border border-white animate-in zoom-in-95 duration-200"
                    >
                        <div className="p-8 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                            <h2 className="text-2xl font-black text-slate-900 italic">
                                {editingItem.id ? 'Edit Dish' : 'Add New Dish'}
                            </h2>
                            <button type="button" onClick={() => setShowEditModal(false)} className="p-2 hover:bg-white rounded-full text-slate-400 transition-all shadow-sm">
                                <X size={20} />
                            </button>
                        </div>
                        <div className="p-8 space-y-6">
                            <div className="space-y-2">
                                <label className="text-xs font-black uppercase tracking-widest text-slate-400 ml-1">Dish Name</label>
                                <input
                                    required
                                    className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl font-bold text-slate-800 focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all outline-none"
                                    value={editingItem.name}
                                    onChange={e => setEditingItem({ ...editingItem, name: e.target.value })}
                                    placeholder="e.g. Wagyu Beef Burger"
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-4">
                                    <div className="space-y-2">
                                        <label className="text-xs font-black uppercase tracking-widest text-slate-400 ml-1">Category</label>
                                        <input
                                            className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl font-bold text-slate-800 focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all outline-none"
                                            value={editingItem.category}
                                            onChange={e => setEditingItem({ ...editingItem, category: e.target.value })}
                                            placeholder="Appetizers"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-xs font-black uppercase tracking-widest text-slate-400 ml-1">Photo</label>
                                        <div
                                            onClick={() => dishImageRef.current?.click()}
                                            className="relative aspect-video bg-slate-100 rounded-2xl flex items-center justify-center overflow-hidden border border-slate-200 hover:border-indigo-400 transition-all cursor-pointer group"
                                        >
                                            {editingItem.image_url ? (
                                                <img src={editingItem.image_url} alt="" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                                            ) : (
                                                <div className="text-center">
                                                    <ImageIcon size={24} className="text-slate-300 mx-auto mb-2" />
                                                    <span className="text-[10px] font-bold text-slate-400 uppercase">Click to upload</span>
                                                </div>
                                            )}
                                            {isUploadingImage && (
                                                <div className="absolute inset-0 bg-white/80 backdrop-blur-sm flex items-center justify-center">
                                                    <Loader2 className="animate-spin text-indigo-600" size={24} />
                                                </div>
                                            )}
                                        </div>
                                        <input
                                            type="file"
                                            className="hidden"
                                            ref={dishImageRef}
                                            accept="image/*"
                                            onChange={handleDishPhotoUpload}
                                        />
                                    </div>
                                </div>
                                <div className="space-y-4">
                                    <div className="space-y-2">
                                        <label className="text-xs font-black uppercase tracking-widest text-slate-400 ml-1">Price (THB)</label>
                                        <div className="relative">
                                            <span className="absolute left-6 top-1/2 -translate-y-1/2 font-bold text-slate-400">฿</span>
                                            <input
                                                type="number"
                                                required
                                                className="w-full pl-12 pr-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl font-black text-slate-800 focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all outline-none"
                                                value={editingItem.price}
                                                onChange={e => setEditingItem({ ...editingItem, price: parseFloat(e.target.value) })}
                                            />
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-xs font-black uppercase tracking-widest text-slate-400 ml-1">Description</label>
                                        <textarea
                                            rows={5}
                                            className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl font-medium text-slate-600 focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all outline-none resize-none"
                                            value={editingItem.description}
                                            onChange={e => setEditingItem({ ...editingItem, description: e.target.value })}
                                            placeholder="Tell us about this dish..."
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="p-8 bg-slate-50 border-t border-slate-100 flex gap-4">
                            <button
                                type="button"
                                onClick={() => setShowEditModal(false)}
                                className="flex-1 py-4 bg-white border border-slate-200 text-slate-700 rounded-2xl font-bold hover:bg-white transition-all shadow-sm"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                className="flex-1 py-4 bg-slate-900 text-white rounded-2xl font-bold hover:bg-slate-800 transition-all shadow-xl shadow-slate-200"
                            >
                                {editingItem.id ? 'Save Changes' : 'Add to Menu'}
                            </button>
                        </div>
                    </form>
                </div>
            )}

            {/* AI Import Modal (Enhanced for Multi-photo) */}
            {isImporting && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
                    <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setIsImporting(false)} />
                    <div className="relative w-full max-w-4xl bg-white rounded-[40px] shadow-2xl overflow-hidden border border-white animate-in zoom-in-95 duration-200">

                        {/* Modal Header */}
                        <div className="p-8 border-b border-slate-100 flex items-center justify-between">
                            <div>
                                <h2 className="text-2xl font-black text-slate-900 flex items-center gap-3">
                                    <span className="p-2 bg-indigo-600 text-white rounded-xl"><Upload size={20} /></span>
                                    AI Menu Ingest
                                </h2>
                                <p className="text-slate-500 mt-1">Convert your physical menu to digital format instantly.</p>
                            </div>
                            <button onClick={() => setIsImporting(false)} className="p-2 hover:bg-slate-100 rounded-full text-slate-400 transition-all">
                                <X size={24} />
                            </button>
                        </div>

                        {/* Modal Content */}
                        <div className="p-8 max-h-[70vh] overflow-y-auto">
                            {(importStatus === 'idle' || importStatus === 'review') && (
                                <div
                                    className={`group relative border-2 border-dashed border-slate-200 hover:border-indigo-400 rounded-3xl p-12 text-center transition-all cursor-pointer bg-slate-50 hover:bg-indigo-50/30 mb-8 ${importStatus === 'review' ? 'opacity-80' : ''}`}
                                    onClick={() => fileInputRef.current?.click()}
                                >
                                    <input
                                        type="file"
                                        className="hidden"
                                        ref={fileInputRef}
                                        multiple
                                        accept="image/*,.pdf"
                                        onChange={handleFileUpload}
                                    />
                                    <div className="w-16 h-16 bg-white shadow-xl rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                                        <Plus className="text-indigo-600" size={24} />
                                    </div>
                                    <h3 className="text-lg font-bold text-slate-800">
                                        {importStatus === 'review' ? 'Add Another Page' : 'Choose menu images or PDF'}
                                    </h3>
                                    <p className="text-slate-500 text-sm mt-1">Upload multiple photos at once for a full menu.</p>
                                </div>
                            )}

                            {importStatus === 'parsing' && (
                                <div className="py-20 text-center">
                                    <div className="relative w-24 h-24 mx-auto mb-8">
                                        <div className="absolute inset-0 border-4 border-indigo-100 rounded-full" />
                                        <div className="absolute inset-0 border-4 border-indigo-600 rounded-full border-t-transparent animate-spin" />
                                        <Utensils className="absolute inset-0 m-auto text-indigo-600" size={32} />
                                    </div>
                                    <h3 className="text-2xl font-bold text-slate-800 animate-pulse">Analyzing your menu...</h3>
                                    <p className="text-slate-500 mt-2 max-w-sm mx-auto">
                                        Our AI is currently reading your dishes, prices, and descriptions. This usually takes 5-10 seconds.
                                    </p>
                                </div>
                            )}

                            {importStatus === 'review' && parsedData.categories.length > 0 && (
                                <div className="space-y-8">
                                    <div className="bg-green-50 text-green-700 p-4 rounded-2xl flex items-center gap-3 border border-green-100">
                                        <div className="bg-green-100 p-1.5 rounded-full"><Check size={18} /></div>
                                        <p className="font-semibold italic">Aha! I found {parsedData.categories.reduce((acc, c) => acc + c.items.length, 0)} items and {parsedData.categories.length} categories.</p>
                                    </div>

                                    {parsedData.categories.map((cat, cIdx) => (
                                        <div key={cIdx} className="space-y-4">
                                            <div className="flex items-center gap-4">
                                                <input
                                                    type="text"
                                                    value={cat.name}
                                                    onChange={(e) => {
                                                        const newData = { ...parsedData };
                                                        newData.categories[cIdx].name = e.target.value;
                                                        setParsedData(newData);
                                                    }}
                                                    className="text-lg font-black text-slate-900 border-none bg-transparent hover:bg-slate-100 px-2 py-1 rounded-md focus:ring-2 focus:ring-indigo-500 transition-all outline-none"
                                                />
                                                <div className="h-px flex-1 bg-slate-100" />
                                            </div>

                                            <div className="grid grid-cols-1 gap-3">
                                                {cat.items.map((item, iIdx) => (
                                                    <div key={iIdx} className="flex items-center gap-4 bg-slate-50 p-4 rounded-2xl group border border-transparent hover:border-indigo-200 hover:bg-white transition-all">
                                                        <div className="flex-1">
                                                            <input
                                                                className="font-bold text-slate-800 bg-transparent block w-full focus:outline-none"
                                                                value={item.name}
                                                                onChange={(e) => {
                                                                    const newData = { ...parsedData };
                                                                    newData.categories[cIdx].items[iIdx].name = e.target.value;
                                                                    setParsedData(newData);
                                                                }}
                                                            />
                                                            <input
                                                                className="text-sm text-slate-500 bg-transparent block w-full focus:outline-none mt-0.5"
                                                                value={item.description}
                                                                onChange={(e) => {
                                                                    const newData = { ...parsedData };
                                                                    newData.categories[cIdx].items[iIdx].description = e.target.value;
                                                                    setParsedData(newData);
                                                                }}
                                                            />
                                                        </div>
                                                        <div className="flex items-center gap-2 bg-white px-3 py-1.5 rounded-xl border border-slate-200">
                                                            <span className="text-slate-400 font-bold text-xs font-mono">฿</span>
                                                            <input
                                                                type="number"
                                                                className="w-20 font-black text-slate-900 focus:outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                                                                value={item.price}
                                                                onChange={(e) => {
                                                                    const newData = { ...parsedData };
                                                                    newData.categories[cIdx].items[iIdx].price = parseFloat(e.target.value);
                                                                    setParsedData(newData);
                                                                }}
                                                            />
                                                        </div>
                                                        <button
                                                            onClick={() => {
                                                                const newData = { ...parsedData };
                                                                newData.categories[cIdx].items.splice(iIdx, 1);
                                                                if (newData.categories[cIdx].items.length === 0) newData.categories.splice(cIdx, 1);
                                                                setParsedData(newData);
                                                            }}
                                                            className="text-slate-300 hover:text-red-500 transition-colors"
                                                        >
                                                            <X size={18} />
                                                        </button>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}

                            {error && (
                                <div className="bg-red-50 text-red-600 p-6 rounded-3xl mt-4 flex items-center gap-4 border border-red-100">
                                    <AlertCircle size={32} />
                                    <div>
                                        <h4 className="font-bold">Ouch! Something went wrong</h4>
                                        <p className="text-sm opacity-90">{error}</p>
                                        <button
                                            onClick={() => setImportStatus('idle')}
                                            className="mt-2 text-sm font-bold underline"
                                        >
                                            Try again
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Modal Footer */}
                        {importStatus === 'review' && (
                            <div className="p-8 border-t border-slate-100 flex gap-4 bg-slate-50/50">
                                <button
                                    onClick={() => { setIsImporting(false); setParsedData({ categories: [] }); setImportStatus('idle'); }}
                                    className="px-8 py-4 bg-white border border-slate-200 text-slate-700 rounded-2xl font-bold hover:bg-white transition-all shadow-sm"
                                >
                                    Discard
                                </button>
                                <button
                                    onClick={confirmImport}
                                    className="flex-1 py-4 bg-indigo-600 text-white rounded-2xl font-bold hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-100 flex items-center justify-center gap-2"
                                >
                                    <Check size={20} />
                                    Confirm & Save {parsedData.categories.reduce((acc, c) => acc + c.items.length, 0)} Items
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default MenuManagement;
