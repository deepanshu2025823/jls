"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from "next/image";
import Link from "next/link";

interface Addon {
  id: string;
  name: string;
  type: string;
  description?: string;
  price: number;
  isActive: boolean;
  icon?: string;
  createdAt: string;
}

export default function AddonsManagement() {
  const router = useRouter();
  const [addons, setAddons] = useState<Addon[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('ALL');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [showModal, setShowModal] = useState(false);
  const [editingAddon, setEditingAddon] = useState<Addon | null>(null);
  
  const [formData, setFormData] = useState({
    name: '',
    type: 'BEVERAGES',
    description: '',
    price: '',
    icon: '🍾',
    isActive: true
  });

  const addonTypes = [
    'BEVERAGES',
    'REFRESHMENTS',
    'FLOWERS',
    'IN_CAR_WIFI',
    'CHAMPAGNE',
    'DECORATIONS',
    'SPECIAL_REQUEST',
    'OTHER'
  ];

  const iconOptions = [
    '🍾', '🥂', '🍷', '🍸', '☕', '🍰', '🍫', '💐',
    '🌹', '🌺', '📶', '🎵', '🎁', '✨', '⭐', '💎'
  ];

  useEffect(() => {
    const token = localStorage.getItem('jls_token');
    const userData = localStorage.getItem('jls_user');

    if (!token || !userData) {
      router.push('/login');
      return;
    }

    const user = JSON.parse(userData);
    if (user.role !== 'ADMIN') {
      router.push('/');
      return;
    }

    loadAddons(token);
  }, [router]);

  const loadAddons = async (token: string) => {
    try {
      const response = await fetch('/api/admin/addons', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setAddons(data.addons);
      }
    } catch (error) {
      console.error('Error loading addons:', error);
    } finally {
      setLoading(false);
    }
  };

  const openCreateModal = () => {
    setEditingAddon(null);
    setFormData({
      name: '',
      type: 'BEVERAGES',
      description: '',
      price: '',
      icon: '🍾',
      isActive: true
    });
    setShowModal(true);
  };

  const openEditModal = (addon: Addon) => {
    setEditingAddon(addon);
    setFormData({
      name: addon.name,
      type: addon.type,
      description: addon.description || '',
      price: addon.price.toString(),
      icon: addon.icon || '🍾',
      isActive: addon.isActive
    });
    setShowModal(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = localStorage.getItem('jls_token');

    const addonData = {
      name: formData.name,
      type: formData.type,
      description: formData.description || undefined,
      price: parseFloat(formData.price),
      icon: formData.icon,
      isActive: formData.isActive
    };

    try {
      const url = editingAddon 
        ? `/api/admin/addons/${editingAddon.id}`
        : '/api/admin/addons';
      
      const response = await fetch(url, {
        method: editingAddon ? 'PUT' : 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(addonData)
      });

      if (response.ok) {
        alert(editingAddon ? 'Add-on updated successfully!' : 'Add-on created successfully!');
        setShowModal(false);
        loadAddons(token!);
      } else {
        const error = await response.json();
        alert(error.error || 'Failed to save add-on');
      }
    } catch (error) {
      console.error('Error saving addon:', error);
      alert('Failed to save add-on');
    }
  };

  const toggleAddonStatus = async (addonId: string, currentStatus: boolean) => {
    const token = localStorage.getItem('jls_token');

    try {
      const response = await fetch(`/api/admin/addons/${addonId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ isActive: !currentStatus })
      });

      if (response.ok) {
        loadAddons(token!);
      }
    } catch (error) {
      console.error('Error toggling status:', error);
    }
  };

  const deleteAddon = async (addonId: string) => {
    if (!confirm('Are you sure you want to delete this add-on?')) return;

    const token = localStorage.getItem('jls_token');

    try {
      const response = await fetch(`/api/admin/addons/${addonId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        alert('Add-on deleted successfully!');
        loadAddons(token!);
      } else {
        const error = await response.json();
        alert(error.error || 'Failed to delete add-on');
      }
    } catch (error) {
      console.error('Error deleting addon:', error);
      alert('Failed to delete add-on');
    }
  };

  const filteredAddons = addons.filter(addon => {
    const matchesSearch = addon.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         addon.type.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = typeFilter === 'ALL' || addon.type === typeFilter;
    const matchesStatus = statusFilter === 'ALL' || 
                         (statusFilter === 'ACTIVE' && addon.isActive) ||
                         (statusFilter === 'INACTIVE' && !addon.isActive);
    
    return matchesSearch && matchesType && matchesStatus;
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading add-ons...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <nav className="bg-black text-white shadow-lg sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-8">
              <Link href="/" className="flex items-center gap-3">
                <Image 
                  src="/logo.svg"   
                  alt="JLS"
                  width={80}
                  height={80}
                  priority
                />
              </Link>
              <div className="hidden lg:flex gap-6">
                <Link href="/admin/dashboard" className="hover:text-gray-300">Dashboard</Link>
                <Link href="/admin/bookings" className="hover:text-gray-300">Bookings</Link>
                <Link href="/admin/vehicles" className="hover:text-gray-300">Fleet</Link>
                <Link href="/admin/drivers" className="hover:text-gray-300">Chauffeurs</Link>
                <Link href="/admin/users" className="hover:text-gray-300">Users</Link>
                <Link href="/admin/addons" className="text-white font-medium">Perks</Link>
                <Link href="/admin/packages" className="hover:text-gray-300">Packages</Link>
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Luxury Add-ons & Perks</h1>
              <p className="text-gray-600 mt-2">Manage premium amenities and services</p>
            </div>
            <button
              onClick={openCreateModal}
              className="px-6 py-3 bg-black text-white rounded-lg hover:bg-gray-800 transition font-medium flex items-center gap-2"
            >
              <span>➕</span> Add New Perk
            </button>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-6 border border-gray-200">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Search</label>
              <input
                type="text"
                placeholder="Search add-ons..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Type</label>
              <select
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
              >
                <option value="ALL">All Types</option>
                {addonTypes.map(type => (
                  <option key={type} value={type}>{type.replace(/_/g, ' ')}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
              >
                <option value="ALL">All Status</option>
                <option value="ACTIVE">Active</option>
                <option value="INACTIVE">Inactive</option>
              </select>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-green-50 rounded-lg p-4 border border-green-200">
            <p className="text-sm text-green-800 font-medium">Active Perks</p>
            <p className="text-2xl font-bold text-green-900 mt-1">
              {addons.filter(a => a.isActive).length}
            </p>
          </div>
          <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
            <p className="text-sm text-gray-800 font-medium">Total Perks</p>
            <p className="text-2xl font-bold text-gray-900 mt-1">{addons.length}</p>
          </div>
          <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
            <p className="text-sm text-blue-800 font-medium">Avg. Price</p>
            <p className="text-2xl font-bold text-blue-900 mt-1">
              ₹{addons.length > 0 ? Math.round(addons.reduce((sum, a) => sum + a.price, 0) / addons.length) : 0}
            </p>
          </div>
        </div>

        {/* Add-ons Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredAddons.length === 0 ? (
            <div className="col-span-full text-center py-12 text-gray-500">
              No add-ons found
            </div>
          ) : (
            filteredAddons.map(addon => (
              <div
                key={addon.id}
                className="bg-white rounded-xl shadow-sm p-6 border border-gray-200 hover:shadow-md transition"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="text-4xl">{addon.icon || '🎁'}</div>
                    <div>
                      <h3 className="font-bold text-gray-900">{addon.name}</h3>
                      <p className="text-xs text-gray-500">{addon.type.replace(/_/g, ' ')}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => toggleAddonStatus(addon.id, addon.isActive)}
                    className={`px-3 py-1 rounded-full text-xs font-medium transition ${
                      addon.isActive
                        ? 'bg-green-100 text-green-800 hover:bg-green-200'
                        : 'bg-red-100 text-red-800 hover:bg-red-200'
                    }`}
                  >
                    {addon.isActive ? '● Active' : '○ Inactive'}
                  </button>
                </div>

                {addon.description && (
                  <p className="text-sm text-gray-600 mb-4 line-clamp-2">{addon.description}</p>
                )}

                <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                  <div>
                    <p className="text-xs text-gray-500">Price</p>
                    <p className="text-xl font-bold text-gray-900">₹{addon.price.toLocaleString()}</p>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => openEditModal(addon)}
                      className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 transition text-sm"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => deleteAddon(addon.id)}
                      className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 transition text-sm"
                    >
                      Delete
                    </button>
                  </div>
                </div>

                <div className="mt-3 pt-3 border-t border-gray-100">
                  <p className="text-xs text-gray-400">
                    Added {new Date(addon.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Create/Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 overflow-y-auto">
          <div className="bg-white rounded-xl max-w-2xl w-full my-8">
            <div className="p-6 border-b border-gray-200">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-gray-900">
                  {editingAddon ? 'Edit Add-on' : 'Create New Add-on'}
                </h2>
                <button
                  onClick={() => setShowModal(false)}
                  className="text-gray-500 hover:text-gray-700 text-2xl"
                >
                  ✕
                </button>
              </div>
            </div>
            
            <form onSubmit={handleSubmit}>
              <div className="p-6 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="e.g., Premium Champagne"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Type <span className="text-red-500">*</span>
                    </label>
                    <select
                      value={formData.type}
                      onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                      required
                    >
                      {addonTypes.map(type => (
                        <option key={type} value={type}>
                          {type.replace(/_/g, ' ')}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Describe the add-on..."
                    rows={3}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Price (₹) <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="number"
                      value={formData.price}
                      onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                      placeholder="0"
                      min="0"
                      step="0.01"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Icon
                    </label>
                    <div className="grid grid-cols-8 gap-2">
                      {iconOptions.map(icon => (
                        <button
                          key={icon}
                          type="button"
                          onClick={() => setFormData({ ...formData, icon })}
                          className={`text-2xl p-2 rounded border-2 transition ${
                            formData.icon === icon
                              ? 'border-black bg-gray-50'
                              : 'border-gray-200 hover:border-gray-400'
                          }`}
                        >
                          {icon}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    id="isActive"
                    checked={formData.isActive}
                    onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                    className="w-4 h-4"
                  />
                  <label htmlFor="isActive" className="text-sm font-medium text-gray-700">
                    Active (available for booking)
                  </label>
                </div>
              </div>

              <div className="p-6 border-t border-gray-200 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-6 py-2 bg-gray-200 text-gray-900 rounded-lg hover:bg-gray-300 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition"
                >
                  {editingAddon ? 'Update Add-on' : 'Create Add-on'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}