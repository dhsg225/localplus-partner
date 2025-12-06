// [2025-11-30] - Event Taxonomy Manager - Admin UI for managing hierarchical categories
// Supports categories, sub-categories, and sub-sub-categories
import React, { useEffect, useState } from 'react';
import { supabase } from '../services/supabase';

interface EventType {
  id: string;
  key: string;
  label: string;
  description?: string;
  color?: string;
  icon?: string;
  level: number;
  parent_id?: string;
  parent_label?: string;
  parent_key?: string;
  sort_order: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  full_path?: string;
}

const EventTaxonomyManager: React.FC = () => {
  const [categories, setCategories] = useState<EventType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editingCategory, setEditingCategory] = useState<EventType | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [formData, setFormData] = useState({
    key: '',
    label: '',
    description: '',
    color: '#6366f1',
    icon: '',
    parent_id: '',
    sort_order: 0,
    is_active: true
  });

  // Load categories from hierarchy view
  const loadCategories = async () => {
    try {
      setLoading(true);
      setError(null);

      const { data, error: fetchError } = await supabase
        .from('event_types_hierarchy')
        .select('*')
        .order('level', { ascending: true })
        .order('sort_order', { ascending: true })
        .order('label', { ascending: true });

      if (fetchError) throw fetchError;

      setCategories(data || []);
    } catch (err: any) {
      console.error('[TaxonomyManager] Error loading categories:', err);
      setError(err?.message || 'Failed to load categories');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCategories();
  }, []);

  // Get categories by level for hierarchical display
  const getCategoriesByLevel = (level: number) => {
    return categories.filter(cat => cat.level === level);
  };

  // Get children of a parent category
  const getChildren = (parentId: string) => {
    return categories.filter(cat => cat.parent_id === parentId);
  };

  // Handle create/edit
  const handleSave = async () => {
    try {
      setError(null);

      if (!formData.key || !formData.label) {
        setError('Key and Label are required');
        return;
      }

      const categoryData: any = {
        key: formData.key.toLowerCase().replace(/\s+/g, '-'),
        label: formData.label,
        description: formData.description || null,
        color: formData.color,
        icon: formData.icon || null,
        sort_order: formData.sort_order,
        is_active: formData.is_active,
        parent_id: formData.parent_id || null
      };

      if (editingCategory) {
        // Update existing
        const { error: updateError } = await supabase
          .from('event_types')
          .update(categoryData)
          .eq('id', editingCategory.id);

        if (updateError) throw updateError;
      } else {
        // Create new
        const { error: insertError } = await supabase
          .from('event_types')
          .insert([categoryData]);

        if (insertError) throw insertError;
      }

      await loadCategories();
      setShowCreateModal(false);
      setEditingCategory(null);
      resetForm();
    } catch (err: any) {
      console.error('[TaxonomyManager] Error saving category:', err);
      setError(err?.message || 'Failed to save category');
    }
  };

  // Handle delete
  const handleDelete = async (category: EventType) => {
    if (!confirm(`Are you sure you want to delete "${category.label}"? This will also delete all sub-categories.`)) {
      return;
    }

    try {
      const { error } = await supabase
        .from('event_types')
        .delete()
        .eq('id', category.id);

      if (error) throw error;

      await loadCategories();
    } catch (err: any) {
      console.error('[TaxonomyManager] Error deleting category:', err);
      setError(err?.message || 'Failed to delete category');
    }
  };

  // Handle edit
  const handleEdit = (category: EventType) => {
    setEditingCategory(category);
    setFormData({
      key: category.key,
      label: category.label,
      description: category.description || '',
      color: category.color || '#6366f1',
      icon: category.icon || '',
      parent_id: category.parent_id || '',
      sort_order: category.sort_order,
      is_active: category.is_active
    });
    setShowCreateModal(true);
  };

  // Reset form
  const resetForm = () => {
    setFormData({
      key: '',
      label: '',
      description: '',
      color: '#6366f1',
      icon: '',
      parent_id: '',
      sort_order: 0,
      is_active: true
    });
  };

  // Get available parents (categories at level 1 or 2, depending on what we're creating)
  const getAvailableParents = (currentLevel?: number) => {
    if (editingCategory) {
      // When editing, exclude self and descendants
      return categories.filter(
        cat => cat.id !== editingCategory.id &&
        cat.level < (editingCategory.level + 1) &&
        (!cat.parent_id || cat.parent_id !== editingCategory.id)
      );
    }
    // When creating, show all categories up to level 2 (for sub-sub-categories)
    return categories.filter(cat => cat.level < 3);
  };

  const level1Categories = getCategoriesByLevel(1);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Event Taxonomy Manager</h1>
          <p className="text-sm text-gray-500 mt-1">Manage categories, sub-categories, and sub-sub-categories</p>
        </div>
        <button
          onClick={() => {
            resetForm();
            setEditingCategory(null);
            setShowCreateModal(true);
          }}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          + Create Category
        </button>
      </div>

      {error && (
        <div className="text-red-600 text-sm border border-red-200 bg-red-50 rounded-md p-3">
          {error}
        </div>
      )}

      {loading ? (
        <div className="text-center py-8 text-gray-500">Loading categories...</div>
      ) : (
        <div className="space-y-6">
          {/* Level 1: Categories */}
          {level1Categories.map((category) => (
            <CategoryTree
              key={category.id}
              category={category}
              allCategories={categories}
              onEdit={handleEdit}
              onDelete={handleDelete}
              onCreateSub={(parentId) => {
                resetForm();
                setFormData(prev => ({ ...prev, parent_id: parentId }));
                setEditingCategory(null);
                setShowCreateModal(true);
              }}
              depth={0}
            />
          ))}

          {level1Categories.length === 0 && (
            <div className="text-center py-8 text-gray-500 border border-gray-200 rounded-lg">
              No categories yet. Create your first category to get started.
            </div>
          )}
        </div>
      )}

      {/* Create/Edit Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
            <div
              className="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75"
              onClick={() => {
                setShowCreateModal(false);
                setEditingCategory(null);
                resetForm();
              }}
            />

            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-2xl sm:w-full">
              <div className="bg-white px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900">
                  {editingCategory ? 'Edit Category' : 'Create Category'}
                </h3>
              </div>

              <div className="bg-white px-6 py-4 max-h-[70vh] overflow-y-auto">
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Key (URL-friendly) *
                    </label>
                    <input
                      type="text"
                      value={formData.key}
                      onChange={(e) => setFormData({ ...formData, key: e.target.value })}
                      placeholder="music-jazz-live"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      disabled={!!editingCategory}
                    />
                    <p className="text-xs text-gray-500 mt-1">Used in URLs, lowercase with hyphens</p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Label *
                    </label>
                    <input
                      type="text"
                      value={formData.label}
                      onChange={(e) => setFormData({ ...formData, label: e.target.value })}
                      placeholder="Live Jazz Performance"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Description
                    </label>
                    <textarea
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      placeholder="Brief description of this category"
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Color
                      </label>
                      <input
                        type="color"
                        value={formData.color}
                        onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                        className="w-full h-10 border border-gray-300 rounded-md"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Sort Order
                      </label>
                      <input
                        type="number"
                        value={formData.sort_order}
                        onChange={(e) => setFormData({ ...formData, sort_order: parseInt(e.target.value) || 0 })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Icon (icon name or URL)
                    </label>
                    <input
                      type="text"
                      value={formData.icon}
                      onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
                      placeholder="music-note or https://..."
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Parent Category
                    </label>
                    <select
                      value={formData.parent_id}
                      onChange={(e) => setFormData({ ...formData, parent_id: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">None (Top-level category)</option>
                      {getAvailableParents().map((parent) => (
                        <option key={parent.id} value={parent.id}>
                          {parent.full_path || parent.label} (Level {parent.level})
                        </option>
                      ))}
                    </select>
                    <p className="text-xs text-gray-500 mt-1">
                      Leave empty for top-level category. Select a parent to create a sub-category.
                    </p>
                  </div>

                  <div>
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={formData.is_active}
                        onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                        className="mr-2"
                      />
                      <span className="text-sm text-gray-700">Active (visible in dropdowns)</span>
                    </label>
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 px-6 py-4 flex justify-end gap-3 border-t border-gray-200">
                <button
                  onClick={() => {
                    setShowCreateModal(false);
                    setEditingCategory(null);
                    resetForm();
                  }}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
                >
                  {editingCategory ? 'Update' : 'Create'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Recursive component for displaying category tree
interface CategoryTreeProps {
  category: EventType;
  allCategories: EventType[];
  onEdit: (category: EventType) => void;
  onDelete: (category: EventType) => void;
  onCreateSub: (parentId: string) => void;
  depth?: number;
}

const CategoryTree: React.FC<CategoryTreeProps> = ({
  category,
  allCategories,
  onEdit,
  onDelete,
  onCreateSub,
  depth = 0
}) => {
  const children = allCategories.filter(cat => cat.parent_id === category.id);
  const indent = depth * 24;

  return (
    <div className="border border-gray-200 rounded-lg bg-white">
      <div className="p-4 flex items-center justify-between" style={{ paddingLeft: `${16 + indent}px` }}>
        <div className="flex items-center gap-3 flex-1">
          {/* Level indicator */}
          <div
            className="w-2 h-2 rounded-full"
            style={{ backgroundColor: category.color || '#6366f1' }}
          />

          <div className="flex-1">
            <div className="flex items-center gap-2">
              <h3 className="font-semibold text-gray-900">{category.label}</h3>
              {!category.is_active && (
                <span className="px-2 py-0.5 text-xs bg-gray-100 text-gray-600 rounded">Inactive</span>
              )}
              <span className="px-2 py-0.5 text-xs bg-blue-100 text-blue-800 rounded">
                Level {category.level}
              </span>
            </div>
            {category.description && (
              <p className="text-sm text-gray-600 mt-1">{category.description}</p>
            )}
            {category.full_path && (
              <p className="text-xs text-gray-500 mt-1">Path: {category.full_path}</p>
            )}
            <div className="flex items-center gap-4 mt-2 text-xs text-gray-500">
              <span>Key: {category.key}</span>
              {category.icon && <span>Icon: {category.icon}</span>}
              <span>Sort: {category.sort_order}</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {category.level < 3 && (
            <button
              onClick={() => onCreateSub(category.id)}
              className="px-3 py-1 text-xs font-medium text-blue-600 bg-blue-50 rounded-md hover:bg-blue-100"
              title="Create sub-category"
            >
              + Sub
            </button>
          )}
          <button
            onClick={() => onEdit(category)}
            className="px-3 py-1 text-xs font-medium text-indigo-600 bg-indigo-50 rounded-md hover:bg-indigo-100"
          >
            Edit
          </button>
          <button
            onClick={() => onDelete(category)}
            className="px-3 py-1 text-xs font-medium text-red-600 bg-red-50 rounded-md hover:bg-red-100"
          >
            Delete
          </button>
        </div>
      </div>

      {/* Children */}
          {children.length > 0 && (
        <div className="border-t border-gray-200">
          {children.map((child) => (
            <CategoryTree
              key={child.id}
              category={child}
              allCategories={allCategories}
              onEdit={onEdit}
              onDelete={onDelete}
              onCreateSub={onCreateSub}
              depth={depth + 1}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default EventTaxonomyManager;

