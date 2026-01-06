"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from "next/image";
import Link from "next/link";

interface Driver {
  id: string;
  userId: string;
  userName: string;
  email: string;
  phone: string;
  profileImage?: string;
  licenseNumber: string;
  licenseExpiry: string;
  experience: number;
  rating: number;
  totalTrips: number;
  isAvailable: boolean;
  currentLocation?: string;
  vehicleName?: string;
  createdAt: string;
}

export default function DriversManagement() {
  const router = useRouter();
  const [drivers, setDrivers] = useState<Driver[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [availabilityFilter, setAvailabilityFilter] = useState('ALL');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedDriver, setSelectedDriver] = useState<Driver | null>(null);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    password: '',
    licenseNumber: '',
    licenseExpiry: '',
    experience: 0,
    currentLocation: ''
  });

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

    loadDrivers(token);
  }, [router]);

  const loadDrivers = async (token: string) => {
    try {
      const response = await fetch('/api/admin/drivers', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setDrivers(data.drivers);
      }
    } catch (error) {
      console.error('Error loading drivers:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddDriver = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = localStorage.getItem('jls_token');

    try {
      const response = await fetch('/api/admin/drivers', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        alert('Driver added successfully!');
        setShowAddModal(false);
        resetForm();
        loadDrivers(token!);
      } else {
        const error = await response.json();
        alert(error.error || 'Failed to add driver');
      }
    } catch (error) {
      console.error('Error adding driver:', error);
      alert('Failed to add driver');
    }
  };

  const handleEditDriver = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedDriver) return;

    const token = localStorage.getItem('jls_token');

    try {
      const response = await fetch(`/api/admin/drivers/${selectedDriver.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        alert('Driver updated successfully!');
        setShowEditModal(false);
        setSelectedDriver(null);
        resetForm();
        loadDrivers(token!);
      } else {
        const error = await response.json();
        alert(error.error || 'Failed to update driver');
      }
    } catch (error) {
      console.error('Error updating driver:', error);
      alert('Failed to update driver');
    }
  };

  const handleDeleteDriver = async (driverId: string) => {
    if (!confirm('Are you sure you want to delete this driver? This will also delete their user account.')) return;

    const token = localStorage.getItem('jls_token');

    try {
      const response = await fetch(`/api/admin/drivers/${driverId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        alert('Driver deleted successfully!');
        loadDrivers(token!);
      } else {
        const error = await response.json();
        alert(error.error || 'Failed to delete driver');
      }
    } catch (error) {
      console.error('Error deleting driver:', error);
      alert('Failed to delete driver');
    }
  };

  const toggleAvailability = async (driverId: string, currentStatus: boolean) => {
    const token = localStorage.getItem('jls_token');

    try {
      const response = await fetch(`/api/admin/drivers/${driverId}/availability`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ isAvailable: !currentStatus })
      });

      if (response.ok) {
        loadDrivers(token!);
      } else {
        const error = await response.json();
        alert(error.error || 'Failed to update availability');
      }
    } catch (error) {
      console.error('Error updating availability:', error);
      alert('Failed to update availability');
    }
  };

  const openEditModal = (driver: Driver) => {
    setSelectedDriver(driver);
    const names = driver.userName.split(' ');
    setFormData({
      firstName: names[0] || '',
      lastName: names.slice(1).join(' ') || '',
      email: driver.email,
      phone: driver.phone,
      password: '',
      licenseNumber: driver.licenseNumber,
      licenseExpiry: driver.licenseExpiry.split('T')[0],
      experience: driver.experience,
      currentLocation: driver.currentLocation || ''
    });
    setShowEditModal(true);
  };

  const resetForm = () => {
    setFormData({
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      password: '',
      licenseNumber: '',
      licenseExpiry: '',
      experience: 0,
      currentLocation: ''
    });
  };

  const filteredDrivers = drivers.filter(driver => {
    const matchesSearch = 
      driver.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      driver.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      driver.phone.includes(searchTerm) ||
      driver.licenseNumber.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesAvailability = availabilityFilter === 'ALL' || 
      (availabilityFilter === 'AVAILABLE' && driver.isAvailable) ||
      (availabilityFilter === 'UNAVAILABLE' && !driver.isAvailable);

    return matchesSearch && matchesAvailability;
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading drivers...</p>
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
                <Link href="/admin/drivers" className="text-white font-medium">Chauffeurs</Link>
                <Link href="/admin/users" className="hover:text-gray-300">Users</Link>
                <Link href="/admin/addons" className="hover:text-gray-300">Perks</Link>
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
              <h1 className="text-3xl font-bold text-gray-900">Chauffeur Management</h1>
              <p className="text-gray-600 mt-2">Manage your professional chauffeurs</p>
            </div>
            <button
              onClick={() => setShowAddModal(true)}
              className="px-6 py-3 bg-black text-white rounded-lg hover:bg-gray-800 transition font-medium flex items-center gap-2"
            >
              <span>➕</span> Add New Chauffeur
            </button>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-6 border border-gray-200">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Search</label>
              <input
                type="text"
                placeholder="Search by name, email, phone, license..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Availability</label>
              <select
                value={availabilityFilter}
                onChange={(e) => setAvailabilityFilter(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
              >
                <option value="ALL">All Status</option>
                <option value="AVAILABLE">Available</option>
                <option value="UNAVAILABLE">Unavailable</option>
              </select>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
            <p className="text-sm text-blue-800 font-medium">Total Chauffeurs</p>
            <p className="text-2xl font-bold text-blue-900 mt-1">{drivers.length}</p>
          </div>
          <div className="bg-green-50 rounded-lg p-4 border border-green-200">
            <p className="text-sm text-green-800 font-medium">Available</p>
            <p className="text-2xl font-bold text-green-900 mt-1">
              {drivers.filter(d => d.isAvailable).length}
            </p>
          </div>
          <div className="bg-amber-50 rounded-lg p-4 border border-amber-200">
            <p className="text-sm text-amber-800 font-medium">Avg Rating</p>
            <p className="text-2xl font-bold text-amber-900 mt-1">
              {drivers.length > 0 
                ? (drivers.reduce((acc, d) => acc + d.rating, 0) / drivers.length).toFixed(1) 
                : '0.0'}
              <span className="text-lg">⭐</span>
            </p>
          </div>
          <div className="bg-purple-50 rounded-lg p-4 border border-purple-200">
            <p className="text-sm text-purple-800 font-medium">Total Trips</p>
            <p className="text-2xl font-bold text-purple-900 mt-1">
              {drivers.reduce((acc, d) => acc + d.totalTrips, 0)}
            </p>
          </div>
        </div>

        {/* Drivers Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredDrivers.length === 0 ? (
            <div className="col-span-full text-center py-12 bg-white rounded-xl border border-gray-200">
              <p className="text-gray-500">No drivers found</p>
            </div>
          ) : (
            filteredDrivers.map((driver) => (
              <div key={driver.id} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition">
                {/* Driver Header */}
                <div className="bg-gradient-to-br from-gray-800 to-gray-900 p-6 text-white">
                  <div className="flex items-center gap-4">
                    {driver.profileImage ? (
                      <Image
                        src={driver.profileImage}
                        alt={driver.userName}
                        width={60}
                        height={60}
                        className="rounded-full border-2 border-white"
                      />
                    ) : (
                      <div className="w-15 h-15 bg-gray-600 rounded-full flex items-center justify-center border-2 border-white">
                        <span className="text-2xl font-bold">
                          {driver.userName.split(' ').map(n => n[0]).join('')}
                        </span>
                      </div>
                    )}
                    <div className="flex-1">
                      <h3 className="text-lg font-bold">{driver.userName}</h3>
                      <p className="text-sm text-gray-300">{driver.email}</p>
                    </div>
                  </div>
                </div>

                {/* Driver Info */}
                <div className="p-6">
                  <div className="space-y-3 mb-4">
                    <div className="flex items-center gap-2 text-sm">
                      <span className="text-gray-600">📞</span>
                      <span className="text-gray-900">{driver.phone}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <span className="text-gray-600">🪪</span>
                      <span className="text-gray-900">{driver.licenseNumber}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <span className="text-gray-600">📅</span>
                      <span className="text-gray-900">
                        Exp: {new Date(driver.licenseExpiry).toLocaleDateString()}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <span className="text-gray-600">💼</span>
                      <span className="text-gray-900">{driver.experience} years experience</span>
                    </div>
                    {driver.vehicleName && (
                      <div className="flex items-center gap-2 text-sm">
                        <span className="text-gray-600">🚗</span>
                        <span className="text-gray-900">{driver.vehicleName}</span>
                      </div>
                    )}
                    {driver.currentLocation && (
                      <div className="flex items-center gap-2 text-sm">
                        <span className="text-gray-600">📍</span>
                        <span className="text-gray-900">{driver.currentLocation}</span>
                      </div>
                    )}
                  </div>

                  <div className="border-t border-gray-200 pt-4 mb-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-xs text-gray-600">Rating</p>
                        <p className="text-lg font-bold text-gray-900">
                          {driver.rating.toFixed(1)} ⭐
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-xs text-gray-600">Total Trips</p>
                        <p className="text-lg font-bold text-gray-900">{driver.totalTrips}</p>
                      </div>
                      <div>
                        <button
                          onClick={() => toggleAvailability(driver.id, driver.isAvailable)}
                          className={`px-3 py-1 rounded-full text-xs font-medium transition ${
                            driver.isAvailable 
                              ? 'bg-green-100 text-green-800 hover:bg-green-200' 
                              : 'bg-red-100 text-red-800 hover:bg-red-200'
                          }`}
                        >
                          {driver.isAvailable ? '✓ Available' : '✗ Unavailable'}
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={() => openEditModal(driver)}
                      className="flex-1 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition text-sm font-medium"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDeleteDriver(driver.id)}
                      className="flex-1 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition text-sm font-medium"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Add Driver Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 overflow-y-auto">
          <div className="bg-white rounded-xl max-w-2xl w-full my-8">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-2xl font-bold text-gray-900">Add New Chauffeur</h2>
            </div>
            <form onSubmit={handleAddDriver} className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">First Name *</label>
                  <input
                    type="text"
                    required
                    value={formData.firstName}
                    onChange={(e) => setFormData({...formData, firstName: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Last Name *</label>
                  <input
                    type="text"
                    required
                    value={formData.lastName}
                    onChange={(e) => setFormData({...formData, lastName: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Email *</label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Phone *</label>
                  <input
                    type="tel"
                    required
                    value={formData.phone}
                    onChange={(e) => setFormData({...formData, phone: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Password *</label>
                  <input
                    type="password"
                    required
                    value={formData.password}
                    onChange={(e) => setFormData({...formData, password: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">License Number *</label>
                  <input
                    type="text"
                    required
                    value={formData.licenseNumber}
                    onChange={(e) => setFormData({...formData, licenseNumber: e.target.value.toUpperCase()})}
                    placeholder="DL1234567890123"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">License Expiry *</label>
                  <input
                    type="date"
                    required
                    value={formData.licenseExpiry}
                    onChange={(e) => setFormData({...formData, licenseExpiry: e.target.value})}
                    min={new Date().toISOString().split('T')[0]}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Experience (Years) *</label>
                  <input
                    type="number"
                    required
                    min="0"
                    max="50"
                    value={formData.experience}
                    onChange={(e) => setFormData({...formData, experience: parseInt(e.target.value)})}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Current Location</label>
                  <input
                    type="text"
                    value={formData.currentLocation}
                    onChange={(e) => setFormData({...formData, currentLocation: e.target.value})}
                    placeholder="New Delhi, India"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                  />
                </div>
              </div>
              <div className="flex gap-4 mt-6">
                <button
                  type="submit"
                  className="flex-1 px-6 py-3 bg-black text-white rounded-lg hover:bg-gray-800 transition font-medium"
                >
                  Update Chauffeur
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowEditModal(false);
                    setSelectedDriver(null);
                    resetForm();
                  }}
                  className="flex-1 px-6 py-3 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition font-medium"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}