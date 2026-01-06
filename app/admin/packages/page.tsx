"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from "next/image";
import Link from "next/link";
import AdminHeader from '@/components/AdminHeader';

interface CityPackage {
  id: string;
  fromCity: string;
  toCity: string;
  distance: number;
  duration: string;
  basePrice: number;
  description?: string;
  isActive: boolean;
  createdAt: string;
}

interface TourPackage {
  id: string;
  title: string;
  description: string;
  destinations: string;
  duration: string;
  price: number;
  images: string;
  isActive: boolean;
  createdAt: string;
}

export default function PackagesManagement() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'CITY' | 'TOUR'>('CITY');
  const [cityPackages, setCityPackages] = useState<CityPackage[]>([]);
  const [tourPackages, setTourPackages] = useState<TourPackage[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  
  // Modals
  const [showCityModal, setShowCityModal] = useState(false);
  const [showTourModal, setShowTourModal] = useState(false);
  const [editingCityPackage, setEditingCityPackage] = useState<CityPackage | null>(null);
  const [editingTourPackage, setEditingTourPackage] = useState<TourPackage | null>(null);

  // City Package Form
  const [cityForm, setCityForm] = useState({
    fromCity: '',
    toCity: '',
    distance: '',
    duration: '',
    basePrice: '',
    description: '',
    isActive: true
  });

  // Tour Package Form
  const [tourForm, setTourForm] = useState({
    title: '',
    description: '',
    destinations: '',
    duration: '',
    price: '',
    images: '',
    isActive: true
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

    loadPackages(token);
  }, [router]);

  const loadPackages = async (token: string) => {
    try {
      const cityResponse = await fetch('/api/admin/packages/city', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (cityResponse.ok) {
        const cityData = await cityResponse.json();
        setCityPackages(cityData.packages);
      }

      const tourResponse = await fetch('/api/admin/packages/tour', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (tourResponse.ok) {
        const tourData = await tourResponse.json();
        setTourPackages(tourData.packages);
      }
    } catch (error) {
      console.error('Error loading packages:', error);
    } finally {
      setLoading(false);
    }
  };

  const openCreateCityModal = () => {
    setEditingCityPackage(null);
    setCityForm({
      fromCity: '',
      toCity: '',
      distance: '',
      duration: '',
      basePrice: '',
      description: '',
      isActive: true
    });
    setShowCityModal(true);
  };

  const openEditCityModal = (pkg: CityPackage) => {
    setEditingCityPackage(pkg);
    setCityForm({
      fromCity: pkg.fromCity,
      toCity: pkg.toCity,
      distance: pkg.distance.toString(),
      duration: pkg.duration,
      basePrice: pkg.basePrice.toString(),
      description: pkg.description || '',
      isActive: pkg.isActive
    });
    setShowCityModal(true);
  };

  const handleCitySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = localStorage.getItem('jls_token');

    const packageData = {
      fromCity: cityForm.fromCity,
      toCity: cityForm.toCity,
      distance: parseFloat(cityForm.distance),
      duration: cityForm.duration,
      basePrice: parseFloat(cityForm.basePrice),
      description: cityForm.description || undefined,
      isActive: cityForm.isActive
    };

    try {
      const url = editingCityPackage
        ? `/api/admin/packages/city/${editingCityPackage.id}`
        : '/api/admin/packages/city';
      
      const response = await fetch(url, {
        method: editingCityPackage ? 'PUT' : 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(packageData)
      });

      if (response.ok) {
        alert(editingCityPackage ? '✅ City package updated successfully!' : '✅ City package created successfully!');
        setShowCityModal(false);
        loadPackages(token!);
      } else {
        const error = await response.json();
        alert('❌ ' + (error.error || 'Failed to save package'));
      }
    } catch (error) {
      console.error('Error saving city package:', error);
      alert('❌ Failed to save package');
    }
  };

  const deleteCityPackage = async (packageId: string) => {
    if (!confirm('⚠️ Are you sure you want to delete this city package? This action cannot be undone.')) return;

    const token = localStorage.getItem('jls_token');
    try {
      const response = await fetch(`/api/admin/packages/city/${packageId}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (response.ok) {
        alert('✅ City package deleted successfully!');
        loadPackages(token!);
      } else {
        alert('❌ Failed to delete package');
      }
    } catch (error) {
      console.error('Error deleting package:', error);
      alert('❌ Failed to delete package');
    }
  };

  const openCreateTourModal = () => {
    setEditingTourPackage(null);
    setTourForm({
      title: '',
      description: '',
      destinations: '',
      duration: '',
      price: '',
      images: '',
      isActive: true
    });
    setShowTourModal(true);
  };

  const openEditTourModal = (pkg: TourPackage) => {
    setEditingTourPackage(pkg);
    setTourForm({
      title: pkg.title,
      description: pkg.description,
      destinations: pkg.destinations,
      duration: pkg.duration,
      price: pkg.price.toString(),
      images: pkg.images,
      isActive: pkg.isActive
    });
    setShowTourModal(true);
  };

  const handleTourSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = localStorage.getItem('jls_token');

    const packageData = {
      title: tourForm.title,
      description: tourForm.description,
      destinations: tourForm.destinations,
      duration: tourForm.duration,
      price: parseFloat(tourForm.price),
      images: tourForm.images,
      isActive: tourForm.isActive
    };

    try {
      const url = editingTourPackage
        ? `/api/admin/packages/tour/${editingTourPackage.id}`
        : '/api/admin/packages/tour';
      
      const response = await fetch(url, {
        method: editingTourPackage ? 'PUT' : 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(packageData)
      });

      if (response.ok) {
        alert(editingTourPackage ? '✅ Tour package updated successfully!' : '✅ Tour package created successfully!');
        setShowTourModal(false);
        loadPackages(token!);
      } else {
        const error = await response.json();
        alert('❌ ' + (error.error || 'Failed to save package'));
      }
    } catch (error) {
      console.error('Error saving tour package:', error);
      alert('❌ Failed to save package');
    }
  };

  const deleteTourPackage = async (packageId: string) => {
    if (!confirm('⚠️ Are you sure you want to delete this tour package? This action cannot be undone.')) return;

    const token = localStorage.getItem('jls_token');
    try {
      const response = await fetch(`/api/admin/packages/tour/${packageId}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (response.ok) {
        alert('✅ Tour package deleted successfully!');
        loadPackages(token!);
      } else {
        alert('❌ Failed to delete package');
      }
    } catch (error) {
      console.error('Error deleting package:', error);
      alert('❌ Failed to delete package');
    }
  };

  const togglePackageStatus = async (packageId: string, type: 'CITY' | 'TOUR', currentStatus: boolean) => {
    const token = localStorage.getItem('jls_token');
    const endpoint = type === 'CITY' ? 'city' : 'tour';

    try {
      const response = await fetch(`/api/admin/packages/${endpoint}/${packageId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ isActive: !currentStatus })
      });

      if (response.ok) {
        loadPackages(token!);
      }
    } catch (error) {
      console.error('Error toggling status:', error);
    }
  };

  const filteredCityPackages = cityPackages.filter(pkg => {
    const matchesSearch = pkg.fromCity.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         pkg.toCity.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'ALL' ||
                         (statusFilter === 'ACTIVE' && pkg.isActive) ||
                         (statusFilter === 'INACTIVE' && !pkg.isActive);
    return matchesSearch && matchesStatus;
  });

  const filteredTourPackages = tourPackages.filter(pkg => {
    const matchesSearch = pkg.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         pkg.destinations.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'ALL' ||
                         (statusFilter === 'ACTIVE' && pkg.isActive) ||
                         (statusFilter === 'INACTIVE' && !pkg.isActive);
    return matchesSearch && matchesStatus;
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <AdminHeader currentPage="packages" />
        <div className="flex items-center justify-center h-[calc(100vh-4rem)]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-4 border-gray-300 border-t-black mx-auto"></div>
            <p className="mt-6 text-gray-600 font-medium text-lg">Loading packages...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminHeader currentPage="packages" />

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">📦 Packages Management</h1>
          <p className="text-gray-600 text-lg">Manage city-to-city packages and destination tour packages</p>
        </div>

        {/* Tabs */}
        <div className="mb-6 border-b border-gray-200">
          <div className="flex gap-8">
            <button
              onClick={() => setActiveTab('CITY')}
              className={`pb-4 px-4 font-semibold text-lg transition-all ${
                activeTab === 'CITY'
                  ? 'text-black border-b-2 border-black'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              🏙️ City Packages ({cityPackages.length})
            </button>
            <button
              onClick={() => setActiveTab('TOUR')}
              className={`pb-4 px-4 font-semibold text-lg transition-all ${
                activeTab === 'TOUR'
                  ? 'text-black border-b-2 border-black'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              🗺️ Tour Packages ({tourPackages.length})
            </button>
          </div>
        </div>

        {/* Filters & Actions */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-6 border border-gray-200">
          <div className="flex flex-col md:flex-row gap-4 items-center">
            <div className="flex-1 w-full md:w-auto">
              <div className="relative">
                <input
                  type="text"
                  placeholder={`Search ${activeTab === 'CITY' ? 'city' : 'tour'} packages...`}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full px-4 py-3 pl-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent text-base"
                />
                <span className="absolute left-3 top-3.5 text-gray-400">🔍</span>
              </div>
            </div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent text-base font-medium w-full md:w-auto"
            >
              <option value="ALL">📋 All Status</option>
              <option value="ACTIVE">✅ Active Only</option>
              <option value="INACTIVE">❌ Inactive Only</option>
            </select>
            <button
              onClick={activeTab === 'CITY' ? openCreateCityModal : openCreateTourModal}
              className="px-6 py-3 bg-black text-white rounded-lg hover:bg-gray-800 transition font-semibold flex items-center gap-2 w-full md:w-auto justify-center"
            >
              <span className="text-xl">➕</span> Add {activeTab === 'CITY' ? 'City' : 'Tour'} Package
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-6 border-2 border-green-300 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-green-700 font-semibold mb-1">Active Packages</p>
                <p className="text-3xl font-bold text-green-900">
                  {activeTab === 'CITY' 
                    ? cityPackages.filter(p => p.isActive).length 
                    : tourPackages.filter(p => p.isActive).length}
                </p>
              </div>
              <div className="text-4xl">✅</div>
            </div>
          </div>
          <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-6 border-2 border-blue-300 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-blue-700 font-semibold mb-1">Total Packages</p>
                <p className="text-3xl font-bold text-blue-900">
                  {activeTab === 'CITY' ? cityPackages.length : tourPackages.length}
                </p>
              </div>
              <div className="text-4xl">📦</div>
            </div>
          </div>
          <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-6 border-2 border-purple-300 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-purple-700 font-semibold mb-1">Average Price</p>
                <p className="text-3xl font-bold text-purple-900">
                  ₹{activeTab === 'CITY'
                    ? cityPackages.length > 0 ? Math.round(cityPackages.reduce((sum, p) => sum + p.basePrice, 0) / cityPackages.length).toLocaleString() : '0'
                    : tourPackages.length > 0 ? Math.round(tourPackages.reduce((sum, p) => sum + p.price, 0) / tourPackages.length).toLocaleString() : '0'}
                </p>
              </div>
              <div className="text-4xl">💰</div>
            </div>
          </div>
        </div>

        {/* City Packages Grid */}
        {activeTab === 'CITY' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCityPackages.length === 0 ? (
              <div className="col-span-full">
                <div className="bg-white rounded-xl shadow-sm p-12 text-center border-2 border-dashed border-gray-300">
                  <div className="text-6xl mb-4">🏙️</div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">No city packages found</h3>
                  <p className="text-gray-600 mb-6">Create your first city package to get started</p>
                  <button
                    onClick={openCreateCityModal}
                    className="px-6 py-3 bg-black text-white rounded-lg hover:bg-gray-800 transition font-semibold"
                  >
                    ➕ Create City Package
                  </button>
                </div>
              </div>
            ) : (
              filteredCityPackages.map(pkg => (
                <div
                  key={pkg.id}
                  className="bg-white rounded-xl shadow-md p-6 border-2 border-gray-200 hover:shadow-xl hover:border-black transition-all duration-300"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-3">
                        <span className="text-3xl">🏙️</span>
                        <div>
                          <h3 className="font-bold text-gray-900 text-xl leading-tight">
                            {pkg.fromCity}
                          </h3>
                          <div className="flex items-center gap-2 mt-1">
                            <span className="text-gray-400">→</span>
                            <span className="font-bold text-gray-900 text-xl">{pkg.toCity}</span>
                          </div>
                        </div>
                      </div>
                      <div className="space-y-2 bg-gray-50 p-3 rounded-lg">
                        <div className="flex items-center gap-2 text-sm">
                          <span className="font-semibold text-gray-700">📏 Distance:</span>
                          <span className="text-gray-900">{pkg.distance} km</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <span className="font-semibold text-gray-700">⏱️ Duration:</span>
                          <span className="text-gray-900">{pkg.duration}</span>
                        </div>
                      </div>
                    </div>
                    <button
                      onClick={() => togglePackageStatus(pkg.id, 'CITY', pkg.isActive)}
                      className={`px-4 py-2 rounded-full text-xs font-bold transition-all ${
                        pkg.isActive
                          ? 'bg-green-500 text-white hover:bg-green-600 shadow-md'
                          : 'bg-gray-300 text-gray-700 hover:bg-gray-400'
                      }`}
                    >
                      {pkg.isActive ? '✓ Active' : '○ Inactive'}
                    </button>
                  </div>

                  {pkg.description && (
                    <div className="mb-4">
                      <p className="text-sm text-gray-600 line-clamp-2 bg-blue-50 p-3 rounded-lg border border-blue-200">
                        💡 {pkg.description}
                      </p>
                    </div>
                  )}

                  <div className="flex items-center justify-between pt-4 border-t-2 border-gray-200">
                    <div>
                      <p className="text-xs text-gray-500 font-semibold mb-1">Starting from</p>
                      <p className="text-2xl font-bold text-gray-900">₹{pkg.basePrice.toLocaleString()}</p>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => openEditCityModal(pkg)}
                        className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition font-semibold text-sm shadow-md"
                      >
                        ✏️ Edit
                      </button>
                      <button
                        onClick={() => deleteCityPackage(pkg.id)}
                        className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition font-semibold text-sm shadow-md"
                      >
                        🗑️ Delete
                      </button>
                    </div>
                  </div>

                  <div className="mt-4 text-xs text-gray-500 text-center">
                    Created: {new Date(pkg.createdAt).toLocaleDateString()}
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* Tour Packages Grid */}
        {activeTab === 'TOUR' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredTourPackages.length === 0 ? (
              <div className="col-span-full">
                <div className="bg-white rounded-xl shadow-sm p-12 text-center border-2 border-dashed border-gray-300">
                  <div className="text-6xl mb-4">🗺️</div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">No tour packages found</h3>
                  <p className="text-gray-600 mb-6">Create your first tour package to get started</p>
                  <button
                    onClick={openCreateTourModal}
                    className="px-6 py-3 bg-black text-white rounded-lg hover:bg-gray-800 transition font-semibold"
                  >
                    ➕ Create Tour Package
                  </button>
                </div>
              </div>
            ) : (
              filteredTourPackages.map(pkg => (
                <div
                  key={pkg.id}
                  className="bg-white rounded-xl shadow-md border-2 border-gray-200 hover:shadow-xl hover:border-black transition-all duration-300 overflow-hidden"
                >
                  {pkg.images && (
                    <div className="h-56 bg-gradient-to-br from-blue-400 to-purple-500 relative overflow-hidden">
                      <Image
                        src={pkg.images.split(',')[0]}
                        alt={pkg.title}
                        fill
                        className="object-cover hover:scale-110 transition-transform duration-500"
                      />
                      <div className="absolute top-4 right-4">
                        <button
                          onClick={() => togglePackageStatus(pkg.id, 'TOUR', pkg.isActive)}
                          className={`px-4 py-2 rounded-full text-xs font-bold transition-all shadow-lg ${
                            pkg.isActive
                              ? 'bg-green-500 text-white hover:bg-green-600'
                              : 'bg-gray-300 text-gray-700 hover:bg-gray-400'
                          }`}
                        >
                          {pkg.isActive ? '✓ Active' : '○ Inactive'}
                        </button>
                      </div>
                    </div>
                  )}
                  
                  <div className="p-6">
                    <div className="mb-4">
                      <h3 className="font-bold text-gray-900 text-2xl mb-2">{pkg.title}</h3>
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <span className="font-semibold">⏱️ Duration:</span>
                        <span>{pkg.duration}</span>
                      </div>
                    </div>

                    <p className="text-sm text-gray-600 mb-4 line-clamp-3 bg-gray-50 p-3 rounded-lg border border-gray-200">
                      {pkg.description}
                    </p>

                    <div className="mb-4 bg-blue-50 p-4 rounded-lg border border-blue-200">
                      <p className="text-xs text-blue-700 font-semibold mb-2">📍 Destinations:</p>
                      <p className="text-sm text-gray-900 font-medium">{pkg.destinations}</p>
                    </div>

                    <div className="flex items-center justify-between pt-4 border-t-2 border-gray-200">
                      <div>
                        <p className="text-xs text-gray-500 font-semibold mb-1">Package Price</p>
                        <p className="text-2xl font-bold text-gray-900">₹{pkg.price.toLocaleString()}</p>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => openEditTourModal(pkg)}
                          className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition font-semibold text-sm shadow-md"
                        >
                          ✏️ Edit
                        </button>
                        <button
                          onClick={() => deleteTourPackage(pkg.id)}
                          className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition font-semibold text-sm shadow-md"
                        >
                          🗑️ Delete
                        </button>
                      </div>
                    </div>

                    <div className="mt-4 text-xs text-gray-500 text-center">
                      Created: {new Date(pkg.createdAt).toLocaleDateString()}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>

      {/* City Package Modal */}
      {showCityModal && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-3xl w-full my-8 shadow-2xl">
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-6 rounded-t-2xl">
              <div className="flex justify-between items-center">
                <div>
                  <h2 className="text-3xl font-bold text-white flex items-center gap-3">
                    🏙️ {editingCityPackage ? 'Edit City Package' : 'Create City Package'}
                  </h2>
                  <p className="text-blue-100 mt-1">Configure city-to-city travel package</p>
                </div>
                <button
                  onClick={() => setShowCityModal(false)}
                  className="text-white hover:text-gray-200 transition text-3xl font-bold"
                >
                  ✕
                </button>
              </div>
            </div>
            
            <form onSubmit={handleCitySubmit}>
              <div className="p-8 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">
                      From City <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={cityForm.fromCity}
                      onChange={(e) => setCityForm({ ...cityForm, fromCity: e.target.value })}
                      placeholder="e.g., Delhi"
                      className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-base"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">
                      To City <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={cityForm.toCity}
                      onChange={(e) => setCityForm({ ...cityForm, toCity: e.target.value })}
                      placeholder="e.g., Agra"
                      className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-base"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">
                      📏 Distance (km) <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="number"
                      value={cityForm.distance}
                      onChange={(e) => setCityForm({ ...cityForm, distance: e.target.value })}
                      placeholder="0"
                      min="0"
                      step="0.1"
                      className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-base"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">
                      ⏱️ Duration <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={cityForm.duration}
                      onChange={(e) => setCityForm({ ...cityForm, duration: e.target.value })}
                      placeholder="e.g., 4-5 hours"
                      className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-base"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">
                    💰 Base Price (₹) <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    value={cityForm.basePrice}
                    onChange={(e) => setCityForm({ ...cityForm, basePrice: e.target.value })}
                    placeholder="0"
                    min="0"
                    step="0.01"
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-base"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">
                    📝 Description
                  </label>
                  <textarea
                    value={cityForm.description}
                    onChange={(e) => setCityForm({ ...cityForm, description: e.target.value })}
                    placeholder="Package details, highlights, inclusions..."
                    rows={4}
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-base resize-none"
                  />
                </div>

                <div className="bg-gray-50 p-4 rounded-lg border-2 border-gray-200">
                  <div className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      id="cityActive"
                      checked={cityForm.isActive}
                      onChange={(e) => setCityForm({ ...cityForm, isActive: e.target.checked })}
                      className="w-5 h-5 text-blue-600"
                    />
                    <label htmlFor="cityActive" className="text-sm font-bold text-gray-700">
                      Active (Available for booking)
                    </label>
                  </div>
                </div>
              </div>

              <div className="p-6 bg-gray-50 border-t-2 border-gray-200 rounded-b-2xl flex justify-end gap-4">
                <button
                  type="button"
                  onClick={() => setShowCityModal(false)}
                  className="px-8 py-3 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition font-semibold text-base"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition font-semibold text-base shadow-lg"
                >
                  {editingCityPackage ? '💾 Update Package' : '✨ Create Package'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Tour Package Modal */}
      {showTourModal && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-3xl w-full my-8 shadow-2xl">
            <div className="bg-gradient-to-r from-green-600 to-teal-600 p-6 rounded-t-2xl">
              <div className="flex justify-between items-center">
                <div>
                  <h2 className="text-3xl font-bold text-white flex items-center gap-3">
                    🗺️ {editingTourPackage ? 'Edit Tour Package' : 'Create Tour Package'}
                  </h2>
                  <p className="text-green-100 mt-1">Configure multi-destination tour package</p>
                </div>
                <button
                  onClick={() => setShowTourModal(false)}
                  className="text-white hover:text-gray-200 transition text-3xl font-bold"
                >
                  ✕
                </button>
              </div>
            </div>
            
            <form onSubmit={handleTourSubmit}>
              <div className="p-8 space-y-6">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">
                    📌 Package Title <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={tourForm.title}
                    onChange={(e) => setTourForm({ ...tourForm, title: e.target.value })}
                    placeholder="e.g., Golden Triangle Tour, Rajasthan Heritage Tour"
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 text-base"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">
                    📝 Description <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    value={tourForm.description}
                    onChange={(e) => setTourForm({ ...tourForm, description: e.target.value })}
                    placeholder="Detailed description of the tour, highlights, what's included..."
                    rows={4}
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 text-base resize-none"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">
                    📍 Destinations <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={tourForm.destinations}
                    onChange={(e) => setTourForm({ ...tourForm, destinations: e.target.value })}
                    placeholder="e.g., Delhi, Agra, Jaipur (comma-separated)"
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 text-base"
                    required
                  />
                  <p className="text-xs text-gray-500 mt-1">Separate multiple destinations with commas</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">
                      ⏱️ Duration <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={tourForm.duration}
                      onChange={(e) => setTourForm({ ...tourForm, duration: e.target.value })}
                      placeholder="e.g., 5 Days / 4 Nights"
                      className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 text-base"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">
                      💰 Package Price (₹) <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="number"
                      value={tourForm.price}
                      onChange={(e) => setTourForm({ ...tourForm, price: e.target.value })}
                      placeholder="0"
                      min="0"
                      step="0.01"
                      className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 text-base"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">
                    🖼️ Images (URLs) <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={tourForm.images}
                    onChange={(e) => setTourForm({ ...tourForm, images: e.target.value })}
                    placeholder="https://example.com/image1.jpg, https://example.com/image2.jpg"
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 text-base"
                    required
                  />
                  <p className="text-xs text-gray-500 mt-1">Separate multiple image URLs with commas</p>
                </div>

                <div className="bg-gray-50 p-4 rounded-lg border-2 border-gray-200">
                  <div className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      id="tourActive"
                      checked={tourForm.isActive}
                      onChange={(e) => setTourForm({ ...tourForm, isActive: e.target.checked })}
                      className="w-5 h-5 text-green-600"
                    />
                    <label htmlFor="tourActive" className="text-sm font-bold text-gray-700">
                      Active (Available for booking)
                    </label>
                  </div>
                </div>
              </div>

              <div className="p-6 bg-gray-50 border-t-2 border-gray-200 rounded-b-2xl flex justify-end gap-4">
                <button
                  type="button"
                  onClick={() => setShowTourModal(false)}
                  className="px-8 py-3 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition font-semibold text-base"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-8 py-3 bg-gradient-to-r from-green-600 to-teal-600 text-white rounded-lg hover:from-green-700 hover:to-teal-700 transition font-semibold text-base shadow-lg"
                >
                  {editingTourPackage ? '💾 Update Package' : '✨ Create Package'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}