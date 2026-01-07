"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Header from "@/components/header/Header";
import Footer from "@/components/footer/Footer";

interface SavedAddress {
  id: string;
  label: string;
  address: string;
  isDefault: boolean;
  createdAt: string;
}

export default function SavedAddressesPage() {
  const router = useRouter();
  const [addresses, setAddresses] = useState<SavedAddress[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newAddress, setNewAddress] = useState({ label: '', address: '' });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('jls_token');
    if (!token) {
      router.push('/login?redirect=/saved-addresses');
      return;
    }

    fetchAddresses();
  }, [router]);

  const fetchAddresses = async () => {
    try {
      const token = localStorage.getItem('jls_token');
      const response = await fetch('/api/user/addresses', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch addresses');
      }

      const data = await response.json();
      setAddresses(data);
    } catch (error) {
      console.error('Error fetching addresses:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSetDefault = async (addressId: string) => {
    try {
      const token = localStorage.getItem('jls_token');
      const response = await fetch(`/api/user/addresses/${addressId}/default`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to set default address');
      }

      fetchAddresses();
    } catch (error) {
      console.error('Error setting default address:', error);
      alert('Failed to set default address');
    }
  };

  const handleDelete = async (addressId: string) => {
    if (!confirm('Are you sure you want to delete this address?')) {
      return;
    }

    setDeleting(addressId);
    try {
      const token = localStorage.getItem('jls_token');
      const response = await fetch(`/api/user/addresses/${addressId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to delete address');
      }

      fetchAddresses();
    } catch (error) {
      console.error('Error deleting address:', error);
      alert('Failed to delete address');
    } finally {
      setDeleting(null);
    }
  };

  const handleAddAddress = async () => {
    if (!newAddress.label || !newAddress.address) {
      alert('Please fill in all fields');
      return;
    }

    setSaving(true);
    try {
      const token = localStorage.getItem('jls_token');
      const response = await fetch('/api/user/addresses', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(newAddress),
      });

      if (!response.ok) {
        throw new Error('Failed to add address');
      }

      setNewAddress({ label: '', address: '' });
      setShowAddModal(false);
      fetchAddresses();
    } catch (error) {
      console.error('Error adding address:', error);
      alert('Failed to add address');
    } finally {
      setSaving(false);
    }
  };

  const getLabelIcon = (label: string) => {
    const labelLower = label.toLowerCase();
    if (labelLower.includes('home')) return '🏠';
    if (labelLower.includes('work') || labelLower.includes('office')) return '🏢';
    if (labelLower.includes('airport')) return '✈️';
    return '📍';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black mx-auto mb-4"></div>
          <p className="text-gray-600">Loading addresses...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="headerbgimg">
        <Header />
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
        <div className="mb-6">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back
          </button>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Saved Addresses</h1>
              <p className="text-gray-600 mt-2">Manage your frequently used locations</p>
            </div>
            <button
              onClick={() => setShowAddModal(true)}
              className="px-6 py-3 bg-black text-white rounded-full font-medium hover:bg-gray-800 transition"
            >
              + Add Address
            </button>
          </div>
        </div>

        {addresses.length === 0 ? (
          <div className="bg-white rounded-3xl shadow-sm border border-gray-200 p-12 text-center">
            <div className="text-6xl mb-4">📍</div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">No Saved Addresses</h2>
            <p className="text-gray-600 mb-6">Save your frequently used addresses for faster booking</p>
            <button
              onClick={() => setShowAddModal(true)}
              className="px-6 py-3 bg-black text-white rounded-full font-medium hover:bg-gray-800 transition"
            >
              Add Your First Address
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {addresses.map((address) => (
              <div
                key={address.id}
                className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition"
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-4 flex-1">
                    <div className="text-3xl mt-1">{getLabelIcon(address.label)}</div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="font-semibold text-gray-900">{address.label}</h3>
                        {address.isDefault && (
                          <span className="px-2 py-1 bg-green-100 text-green-800 text-xs font-medium rounded-full">
                            Default
                          </span>
                        )}
                      </div>
                      <p className="text-gray-600">{address.address}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 ml-4">
                    {!address.isDefault && (
                      <button
                        onClick={() => handleSetDefault(address.id)}
                        className="px-4 py-2 bg-gray-100 text-gray-700 rounded-full text-sm font-medium hover:bg-gray-200 transition whitespace-nowrap"
                      >
                        Set as Default
                      </button>
                    )}
                    <button
                      onClick={() => handleDelete(address.id)}
                      disabled={deleting === address.id}
                      className="px-4 py-2 bg-red-50 text-red-600 rounded-full text-sm font-medium hover:bg-red-100 transition disabled:opacity-50"
                    >
                      {deleting === address.id ? 'Deleting...' : 'Delete'}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Add Address Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-3xl max-w-md w-full p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Add New Address</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Label
                </label>
                <input
                  type="text"
                  value={newAddress.label}
                  onChange={(e) => setNewAddress({ ...newAddress, label: e.target.value })}
                  placeholder="e.g., Home, Work, Airport"
                  className="w-full px-4 py-3 bg-gray-50 rounded-xl border-0 focus:ring-2 focus:ring-black outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Address
                </label>
                <textarea
                  value={newAddress.address}
                  onChange={(e) => setNewAddress({ ...newAddress, address: e.target.value })}
                  placeholder="Enter full address"
                  rows={3}
                  className="w-full px-4 py-3 bg-gray-50 rounded-xl border-0 focus:ring-2 focus:ring-black outline-none resize-none"
                />
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={() => {
                  setShowAddModal(false);
                  setNewAddress({ label: '', address: '' });
                }}
                className="flex-1 px-6 py-3 bg-gray-200 text-gray-700 rounded-full font-medium hover:bg-gray-300 transition"
              >
                Cancel
              </button>
              <button
                onClick={handleAddAddress}
                disabled={saving}
                className="flex-1 px-6 py-3 bg-black text-white rounded-full font-medium hover:bg-gray-800 transition disabled:opacity-50"
              >
                {saving ? 'Adding...' : 'Add Address'}
              </button>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}