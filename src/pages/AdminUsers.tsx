// [2025-11-26] - Admin page to display all partners/users and their credentials
import React, { useState, useEffect } from 'react';
import { supabase } from '../services/supabase';

interface PartnerUser {
  partner_id: string;
  user_id: string;
  email: string;
  first_name: string | null;
  last_name: string | null;
  phone: string | null;
  business_id: string;
  business_name: string | null;
  role: string;
  is_active: boolean;
  created_at: string;
  accepted_at: string | null;
}

interface Business {
  id: string;
  name: string;
}

const AdminUsers: React.FC = () => {
  const [partners, setPartners] = useState<PartnerUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRole, setFilterRole] = useState<string>('all');
  
  // Create Partner Modal State
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [createLoading, setCreateLoading] = useState(false);
  const [createError, setCreateError] = useState<string | null>(null);
  const [businesses, setBusinesses] = useState<Business[]>([]);
  const [formData, setFormData] = useState({
    userEmail: '',
    businessId: '',
    role: 'manager',
    isActive: true
  });

  useEffect(() => {
    loadPartners();
    loadBusinesses();
  }, []);

  const loadBusinesses = async () => {
    try {
      const { data, error } = await supabase
        .from('businesses')
        .select('id, name')
        .order('name');
      
      if (error) {
        console.error('Error loading businesses:', error);
        return;
      }
      
      setBusinesses(data || []);
    } catch (err) {
      console.error('Error loading businesses:', err);
    }
  };

  const loadPartners = async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch partners with user and business details
      // Note: Using separate queries due to RLS policies
      const { data: partnersData, error: partnersError } = await supabase
        .from('partners')
        .select('*')
        .order('created_at', { ascending: false });

      if (partnersError) {
        throw partnersError;
      }

      if (!partnersData || partnersData.length === 0) {
        setPartners([]);
        return;
      }

      // Fetch user details for all partner user_ids
      const userIds = partnersData?.map(p => p.user_id) || [];
      const { data: usersData, error: usersError } = await supabase
        .from('users')
        .select('id, email, first_name, last_name, phone')
        .in('id', userIds);

      if (usersError) {
        console.warn('Error fetching users:', usersError);
      }

      // Fetch business details for all partner business_ids
      const businessIds = partnersData?.map(p => p.business_id) || [];
      const { data: businessesData, error: businessesError } = await supabase
        .from('businesses')
        .select('id, name')
        .in('id', businessIds);

      if (businessesError) {
        console.warn('Error fetching businesses:', businessesError);
      }

      // Create lookup maps
      const usersMap = new Map((usersData || []).map(u => [u.id, u]));
      const businessesMap = new Map((businessesData || []).map(b => [b.id, b]));

      // Transform the data to flatten the structure
      const transformedData: PartnerUser[] = (partnersData || []).map((partner: any) => {
        const user = usersMap.get(partner.user_id);
        const business = businessesMap.get(partner.business_id);
        
        return {
          partner_id: partner.id,
          user_id: partner.user_id,
          email: user?.email || 'N/A',
          first_name: user?.first_name || null,
          last_name: user?.last_name || null,
          phone: user?.phone || null,
          business_id: partner.business_id,
          business_name: business?.name || 'N/A',
          role: partner.role,
          is_active: partner.is_active,
          created_at: partner.created_at,
          accepted_at: partner.accepted_at
        };
      });

      setPartners(transformedData);
    } catch (err: any) {
      console.error('Error loading partners:', err);
      setError(err.message || 'Failed to load partners');
    } finally {
      setLoading(false);
    }
  };

  const filteredPartners = partners.filter((partner) => {
    const matchesSearch =
      partner.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      partner.first_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      partner.last_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      partner.business_name?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesRole = filterRole === 'all' || partner.role === filterRole;
    
    return matchesSearch && matchesRole;
  });

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    // You could add a toast notification here
  };

  const handleCreatePartner = async (e: React.FormEvent) => {
    e.preventDefault();
    setCreateLoading(true);
    setCreateError(null);

    try {
      // Step 1: Find user by email
      const { data: usersData, error: usersError } = await supabase
        .from('users')
        .select('id, email')
        .eq('email', formData.userEmail)
        .single();

      if (usersError || !usersData) {
        throw new Error(`User with email ${formData.userEmail} not found. Please ensure the user exists in the system.`);
      }

      const userId = usersData.id;

      // Step 2: Create partner record
      const { data: partnerData, error: partnerError } = await supabase
        .from('partners')
        .insert({
          user_id: userId,
          business_id: formData.businessId,
          role: formData.role,
          permissions: ['view_bookings', 'manage_bookings', 'view_analytics'],
          is_active: formData.isActive,
          accepted_at: new Date().toISOString()
        })
        .select()
        .single();

      if (partnerError) {
        // Check if it's an RLS error
        if (partnerError.code === '42501' || partnerError.message.includes('row-level security')) {
          throw new Error(
            'Permission denied: Cannot create partner record due to Row Level Security (RLS) policies. ' +
            'Please use Supabase SQL Editor with service role permissions, or contact an administrator.'
          );
        }
        if (partnerError.code === '23505') {
          throw new Error('This user is already a partner for this business.');
        }
        throw partnerError;
      }

      // Success - close modal and refresh list
      setShowCreateModal(false);
      setFormData({
        userEmail: '',
        businessId: '',
        role: 'manager',
        isActive: true
      });
      await loadPartners();
    } catch (err: any) {
      console.error('Error creating partner:', err);
      setCreateError(err.message || 'Failed to create partner record');
    } finally {
      setCreateLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading partners...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <p className="text-red-800">Error: {error}</p>
        <button
          onClick={loadPartners}
          className="mt-2 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Admin - Partners & Users</h1>
          <p className="text-sm text-gray-500 mt-1">
            View all partners and their credentials ({partners.length} total)
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setShowCreateModal(true)}
            className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
          >
            + Create Partner
          </button>
          <button
            onClick={loadPartners}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Refresh
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Search
            </label>
            <input
              type="text"
              placeholder="Search by email, name, or business..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Filter by Role
            </label>
            <select
              value={filterRole}
              onChange={(e) => setFilterRole(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Roles</option>
              <option value="owner">Owner</option>
              <option value="manager">Manager</option>
              <option value="staff">Staff</option>
            </select>
          </div>
        </div>
      </div>

      {/* Partners Table */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  User Info
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Business
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Role
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Created
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredPartners.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-4 text-center text-gray-500">
                    No partners found
                  </td>
                </tr>
              ) : (
                filteredPartners.map((partner) => (
                  <tr key={partner.partner_id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex flex-col">
                        <div className="text-sm font-medium text-gray-900">
                          {partner.first_name || partner.last_name
                            ? `${partner.first_name || ''} ${partner.last_name || ''}`.trim()
                            : 'N/A'}
                        </div>
                        <div className="text-sm text-gray-500 flex items-center gap-2">
                          <span>{partner.email}</span>
                          <button
                            onClick={() => copyToClipboard(partner.email)}
                            className="text-blue-600 hover:text-blue-800"
                            title="Copy email"
                          >
                            📋
                          </button>
                        </div>
                        {partner.phone && (
                          <div className="text-xs text-gray-400">{partner.phone}</div>
                        )}
                        <div className="text-xs text-gray-400 mt-1">
                          ID: {partner.user_id.substring(0, 8)}...
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{partner.business_name}</div>
                      <div className="text-xs text-gray-500">
                        {partner.business_id.substring(0, 8)}...
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        partner.role === 'owner'
                          ? 'bg-purple-100 text-purple-800'
                          : partner.role === 'manager'
                          ? 'bg-blue-100 text-blue-800'
                          : 'bg-gray-100 text-gray-800'
                      }`}>
                        {partner.role}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        partner.is_active
                          ? 'bg-green-100 text-green-800'
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {partner.is_active ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(partner.created_at).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button
                        onClick={() => {
                          const credentials = `Email: ${partner.email}\nUser ID: ${partner.user_id}\nBusiness ID: ${partner.business_id}`;
                          copyToClipboard(credentials);
                        }}
                        className="text-blue-600 hover:text-blue-900"
                        title="Copy credentials"
                      >
                        Copy Credentials
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
          <div className="text-sm text-gray-500">Total Partners</div>
          <div className="text-2xl font-bold text-gray-900">{partners.length}</div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
          <div className="text-sm text-gray-500">Active</div>
          <div className="text-2xl font-bold text-green-600">
            {partners.filter(p => p.is_active).length}
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
          <div className="text-sm text-gray-500">Owners</div>
          <div className="text-2xl font-bold text-purple-600">
            {partners.filter(p => p.role === 'owner').length}
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
          <div className="text-sm text-gray-500">Managers</div>
          <div className="text-2xl font-bold text-blue-600">
            {partners.filter(p => p.role === 'manager').length}
          </div>
        </div>
      </div>

      {/* Create Partner Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-gray-900">Create Partner</h2>
                <button
                  onClick={() => {
                    setShowCreateModal(false);
                    setCreateError(null);
                    setFormData({
                      userEmail: '',
                      businessId: '',
                      role: 'manager',
                      isActive: true
                    });
                  }}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ✕
                </button>
              </div>

              {createError && (
                <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md">
                  <p className="text-sm text-red-800">{createError}</p>
                </div>
              )}

              <form onSubmit={handleCreatePartner} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    User Email *
                  </label>
                  <input
                    type="email"
                    required
                    value={formData.userEmail}
                    onChange={(e) => setFormData({ ...formData, userEmail: e.target.value })}
                    placeholder="user@example.com"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <p className="mt-1 text-xs text-gray-500">
                    User must already exist in the system
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Business *
                  </label>
                  <select
                    required
                    value={formData.businessId}
                    onChange={(e) => setFormData({ ...formData, businessId: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Select a business...</option>
                    {businesses.map((business) => (
                      <option key={business.id} value={business.id}>
                        {business.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Role *
                  </label>
                  <select
                    required
                    value={formData.role}
                    onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="owner">Owner</option>
                    <option value="manager">Manager</option>
                    <option value="staff">Staff</option>
                  </select>
                </div>

                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="isActive"
                    checked={formData.isActive}
                    onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label htmlFor="isActive" className="ml-2 block text-sm text-gray-700">
                    Active
                  </label>
                </div>

                <div className="flex gap-2 pt-4">
                  <button
                    type="button"
                    onClick={() => {
                      setShowCreateModal(false);
                      setCreateError(null);
                      setFormData({
                        userEmail: '',
                        businessId: '',
                        role: 'manager',
                        isActive: true
                      });
                    }}
                    className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50"
                    disabled={createLoading}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
                    disabled={createLoading}
                  >
                    {createLoading ? 'Creating...' : 'Create Partner'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminUsers;

