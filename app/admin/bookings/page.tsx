"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from "next/image";
import Link from "next/link";
import AdminHeader from '@/components/AdminHeader';

interface Booking {
  id: string;
  bookingNumber: string;
  customerName: string;
  customerId: string;
  customerPhone: string;
  driverName?: string;
  driverId?: string;
  vehicleName: string;
  vehicleId: string;
  bookingType: 'INDIVIDUAL' | 'AIRPORT_VIP' | 'VIP_TRANSFER' | 'WEDDING' | 'CORPORATE_EVENT';
  tripType: 'SINGLE_TRIP' | 'MULTI_STOP' | 'HOURLY_RENTAL' | 'TOUR_PACKAGE';
  pickupLocation: string;
  dropLocation: string;
  pickupDate: string;
  pickupTime: string;
  flightNumber?: string;
  pickupSign?: string;
  specialNotes?: string;
  referenceCode?: string;
  status: 'PENDING' | 'CONFIRMED' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED';
  paymentType: 'INSTANT_BILLING' | 'CORPORATE_BILLING';
  basePrice: number;
  addonPrice: number;
  totalPrice: number;
  tipAmount: number;
  isPaid: boolean;
  createdAt: string;
  addons?: Array<{
    name: string;
    quantity: number;
    price: number;
  }>;
  extraStops?: Array<{
    location: string;
    stopOrder: number;
    notes?: string;
  }>;
}

interface Vehicle {
  id: string;
  name: string;
}

interface Driver {
  id: string;
  name: string;
}

export default function BookingsManagement() {
  const router = useRouter();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [drivers, setDrivers] = useState<Driver[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [bookingTypeFilter, setBookingTypeFilter] = useState('ALL');
  const [tripTypeFilter, setTripTypeFilter] = useState('ALL');
  const [paymentTypeFilter, setPaymentTypeFilter] = useState('ALL');
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showAssignDriverModal, setShowAssignDriverModal] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [assignDriverId, setAssignDriverId] = useState('');

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

    loadBookings(token);
    loadVehicles(token);
    loadDrivers(token);
  }, [router]);

  const loadBookings = async (token: string) => {
    try {
      const response = await fetch('/api/admin/bookings', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setBookings(data.bookings);
      }
    } catch (error) {
      console.error('Error loading bookings:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadVehicles = async (token: string) => {
    try {
      const response = await fetch('/api/admin/vehicles', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setVehicles(data.vehicles);
      }
    } catch (error) {
      console.error('Error loading vehicles:', error);
    }
  };

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
    }
  };

  const updateBookingStatus = async (bookingId: string, newStatus: string) => {
    const token = localStorage.getItem('jls_token');

    try {
      const response = await fetch(`/api/admin/bookings/${bookingId}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ status: newStatus })
      });

      if (response.ok) {
        alert('Booking status updated successfully!');
        loadBookings(token!);
      } else {
        const error = await response.json();
        alert(error.error || 'Failed to update status');
      }
    } catch (error) {
      console.error('Error updating status:', error);
      alert('Failed to update status');
    }
  };

  const assignDriver = async () => {
    if (!selectedBooking || !assignDriverId) {
      alert('Please select a driver');
      return;
    }

    const token = localStorage.getItem('jls_token');

    try {
      const response = await fetch(`/api/admin/bookings/${selectedBooking.id}/assign-driver`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ driverId: assignDriverId })
      });

      if (response.ok) {
        alert('Driver assigned successfully!');
        setShowAssignDriverModal(false);
        setAssignDriverId('');
        loadBookings(token!);
      } else {
        const error = await response.json();
        alert(error.error || 'Failed to assign driver');
      }
    } catch (error) {
      console.error('Error assigning driver:', error);
      alert('Failed to assign driver');
    }
  };

  const cancelBooking = async (bookingId: string) => {
    if (!confirm('Are you sure you want to cancel this booking?')) return;

    const token = localStorage.getItem('jls_token');

    try {
      const response = await fetch(`/api/admin/bookings/${bookingId}/cancel`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        alert('Booking cancelled successfully!');
        loadBookings(token!);
      } else {
        const error = await response.json();
        alert(error.error || 'Failed to cancel booking');
      }
    } catch (error) {
      console.error('Error cancelling booking:', error);
      alert('Failed to cancel booking');
    }
  };

  const viewBookingDetails = async (booking: Booking) => {
    const token = localStorage.getItem('jls_token');

    try {
      const response = await fetch(`/api/admin/bookings/${booking.id}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setSelectedBooking(data.booking);
        setShowDetailsModal(true);
      }
    } catch (error) {
      console.error('Error loading booking details:', error);
    }
  };

  const filteredBookings = bookings.filter(booking => {
    const matchesSearch = 
      booking.bookingNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking.pickupLocation.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking.dropLocation.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = statusFilter === 'ALL' || booking.status === statusFilter;
    const matchesBookingType = bookingTypeFilter === 'ALL' || booking.bookingType === bookingTypeFilter;
    const matchesTripType = tripTypeFilter === 'ALL' || booking.tripType === tripTypeFilter;
    const matchesPaymentType = paymentTypeFilter === 'ALL' || booking.paymentType === paymentTypeFilter;

    return matchesSearch && matchesStatus && matchesBookingType && matchesTripType && matchesPaymentType;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PENDING': return 'bg-yellow-100 text-yellow-800';
      case 'CONFIRMED': return 'bg-purple-100 text-purple-800';
      case 'IN_PROGRESS': return 'bg-blue-100 text-blue-800';
      case 'COMPLETED': return 'bg-green-100 text-green-800';
      case 'CANCELLED': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getBookingTypeIcon = (type: string) => {
    switch (type) {
      case 'INDIVIDUAL': return '👤';
      case 'AIRPORT_VIP': return '✈️';
      case 'VIP_TRANSFER': return '⭐';
      case 'WEDDING': return '💒';
      case 'CORPORATE_EVENT': return '🏢';
      default: return '📋';
    }
  };

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
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Bookings Management</h1>
              <p className="text-gray-600 mt-2">Manage all luxury limousine bookings</p>
            </div>
            <Link href="/admin/bookings/new">
              <button className="px-6 py-3 bg-black text-white rounded-lg hover:bg-gray-800 transition font-medium flex items-center gap-2">
                <span>➕</span> New Booking
              </button>
            </Link>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-6 border border-gray-200">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Search</label>
              <input
                type="text"
                placeholder="Search bookings..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
              >
                <option value="ALL">All Status</option>
                <option value="PENDING">Pending</option>
                <option value="CONFIRMED">Confirmed</option>
                <option value="IN_PROGRESS">In Progress</option>
                <option value="COMPLETED">Completed</option>
                <option value="CANCELLED">Cancelled</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Booking Type</label>
              <select
                value={bookingTypeFilter}
                onChange={(e) => setBookingTypeFilter(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
              >
                <option value="ALL">All Types</option>
                <option value="INDIVIDUAL">Individual</option>
                <option value="AIRPORT_VIP">Airport VIP</option>
                <option value="VIP_TRANSFER">VIP Transfer</option>
                <option value="WEDDING">Wedding</option>
                <option value="CORPORATE_EVENT">Corporate Event</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Trip Type</label>
              <select
                value={tripTypeFilter}
                onChange={(e) => setTripTypeFilter(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
              >
                <option value="ALL">All Trips</option>
                <option value="SINGLE_TRIP">Single Trip</option>
                <option value="MULTI_STOP">Multi Stop</option>
                <option value="HOURLY_RENTAL">Hourly Rental</option>
                <option value="TOUR_PACKAGE">Tour Package</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Payment</label>
              <select
                value={paymentTypeFilter}
                onChange={(e) => setPaymentTypeFilter(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
              >
                <option value="ALL">All Payment</option>
                <option value="INSTANT_BILLING">Instant</option>
                <option value="CORPORATE_BILLING">Corporate</option>
              </select>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
          <div className="bg-yellow-50 rounded-lg p-4 border border-yellow-200">
            <p className="text-sm text-yellow-800 font-medium">Pending</p>
            <p className="text-2xl font-bold text-yellow-900 mt-1">
              {bookings.filter(b => b.status === 'PENDING').length}
            </p>
          </div>
          <div className="bg-purple-50 rounded-lg p-4 border border-purple-200">
            <p className="text-sm text-purple-800 font-medium">Confirmed</p>
            <p className="text-2xl font-bold text-purple-900 mt-1">
              {bookings.filter(b => b.status === 'CONFIRMED').length}
            </p>
          </div>
          <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
            <p className="text-sm text-blue-800 font-medium">In Progress</p>
            <p className="text-2xl font-bold text-blue-900 mt-1">
              {bookings.filter(b => b.status === 'IN_PROGRESS').length}
            </p>
          </div>
          <div className="bg-green-50 rounded-lg p-4 border border-green-200">
            <p className="text-sm text-green-800 font-medium">Completed</p>
            <p className="text-2xl font-bold text-green-900 mt-1">
              {bookings.filter(b => b.status === 'COMPLETED').length}
            </p>
          </div>
          <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
            <p className="text-sm text-gray-800 font-medium">Total Revenue</p>
            <p className="text-2xl font-bold text-gray-900 mt-1">
              ₹{(bookings.filter(b => b.isPaid).reduce((sum, b) => sum + b.totalPrice, 0) / 1000).toFixed(0)}K
            </p>
          </div>
        </div>

        {/* Bookings Table */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase">Booking</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase">Customer</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase">Trip Details</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase">Vehicle</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase">Driver</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase">Amount</th>
                  <th className="px-6 py-4 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredBookings.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="px-6 py-12 text-center text-gray-500">
                      No bookings found
                    </td>
                  </tr>
                ) : (
                  filteredBookings.map((booking) => (
                    <tr key={booking.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <div>
                          <p className="font-medium text-gray-900">{booking.bookingNumber}</p>
                          <p className="text-xs text-gray-500">
                            {new Date(booking.pickupDate).toLocaleDateString()}
                          </p>
                          <div className="flex items-center gap-1 mt-1">
                            <span className="text-sm">{getBookingTypeIcon(booking.bookingType)}</span>
                            <span className="text-xs text-gray-600">
                              {booking.bookingType.replace(/_/g, ' ')}
                            </span>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div>
                          <p className="text-sm font-medium text-gray-900">{booking.customerName}</p>
                          <p className="text-xs text-gray-500">{booking.customerPhone}</p>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="max-w-xs">
                          <p className="text-xs text-gray-600 truncate">📍 {booking.pickupLocation}</p>
                          <p className="text-xs text-gray-600 truncate">🎯 {booking.dropLocation}</p>
                          <p className="text-xs text-gray-500 mt-1">
                            {booking.tripType.replace(/_/g, ' ')}
                          </p>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-sm text-gray-900">{booking.vehicleName}</p>
                      </td>
                      <td className="px-6 py-4">
                        {booking.driverName ? (
                          <p className="text-sm text-gray-900">{booking.driverName}</p>
                        ) : (
                          <button
                            onClick={() => {
                              setSelectedBooking(booking);
                              setShowAssignDriverModal(true);
                            }}
                            className="text-xs text-blue-600 hover:underline"
                          >
                            Assign Driver
                          </button>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(booking.status)}`}>
                          {booking.status}
                        </span>
                        <div className="mt-1">
                          <span className={`inline-block px-2 py-0.5 rounded text-xs ${
                            booking.isPaid ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                          }`}>
                            {booking.isPaid ? '💳 Paid' : '⏳ Unpaid'}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-sm font-bold text-gray-900">₹{booking.totalPrice.toLocaleString()}</p>
                        <p className="text-xs text-gray-500">{booking.paymentType.replace(/_/g, ' ')}</p>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => viewBookingDetails(booking)}
                            className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 transition text-xs"
                          >
                            View
                          </button>
                          {booking.status === 'PENDING' && (
                            <button
                              onClick={() => updateBookingStatus(booking.id, 'CONFIRMED')}
                              className="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600 transition text-xs"
                            >
                              Confirm
                            </button>
                          )}
                          {booking.status === 'CONFIRMED' && (
                            <button
                              onClick={() => updateBookingStatus(booking.id, 'IN_PROGRESS')}
                              className="px-3 py-1 bg-purple-500 text-white rounded hover:bg-purple-600 transition text-xs"
                            >
                              Start
                            </button>
                          )}
                          {booking.status === 'IN_PROGRESS' && (
                            <button
                              onClick={() => updateBookingStatus(booking.id, 'COMPLETED')}
                              className="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600 transition text-xs"
                            >
                              Complete
                            </button>
                          )}
                          {(booking.status === 'PENDING' || booking.status === 'CONFIRMED') && (
                            <button
                              onClick={() => cancelBooking(booking.id)}
                              className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 transition text-xs"
                            >
                              Cancel
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Booking Details Modal */}
      {showDetailsModal && selectedBooking && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 overflow-y-auto">
          <div className="bg-white rounded-xl max-w-4xl w-full my-8">
            <div className="p-6 border-b border-gray-200">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-gray-900">Booking Details</h2>
                <button
                  onClick={() => setShowDetailsModal(false)}
                  className="text-gray-500 hover:text-gray-700 text-2xl"
                >
                  ✕
                </button>
              </div>
            </div>
            <div className="p-6 max-h-[70vh] overflow-y-auto">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Booking Information */}
                <div>
                  <h3 className="text-lg font-bold text-gray-900 mb-4">Booking Information</h3>
                  <div className="space-y-3">
                    <div>
                      <p className="text-sm text-gray-600">Booking Number</p>
                      <p className="font-medium text-gray-900">{selectedBooking.bookingNumber}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Booking Type</p>
                      <p className="font-medium text-gray-900">
                        {getBookingTypeIcon(selectedBooking.bookingType)} {selectedBooking.bookingType.replace(/_/g, ' ')}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Trip Type</p>
                      <p className="font-medium text-gray-900">{selectedBooking.tripType.replace(/_/g, ' ')}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Status</p>
                      <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(selectedBooking.status)}`}>
                        {selectedBooking.status}
                      </span>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Created At</p>
                      <p className="font-medium text-gray-900">
                        {new Date(selectedBooking.createdAt).toLocaleString()}
                      </p>
                    </div>
                    {selectedBooking.referenceCode && (
                      <div>
                        <p className="text-sm text-gray-600">Reference Code</p>
                        <p className="font-medium text-gray-900">{selectedBooking.referenceCode}</p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Customer Information */}
                <div>
                  <h3 className="text-lg font-bold text-gray-900 mb-4">Customer Information</h3>
                  <div className="space-y-3">
                    <div>
                      <p className="text-sm text-gray-600">Name</p>
                      <p className="font-medium text-gray-900">{selectedBooking.customerName}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Phone</p>
                      <p className="font-medium text-gray-900">{selectedBooking.customerPhone}</p>
                    </div>
                  </div>
                </div>

                {/* Trip Details */}
                <div className="md:col-span-2">
                  <h3 className="text-lg font-bold text-gray-900 mb-4">Trip Details</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-600">Pickup Location</p>
                      <p className="font-medium text-gray-900">📍 {selectedBooking.pickupLocation}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Drop Location</p>
                      <p className="font-medium text-gray-900">🎯 {selectedBooking.dropLocation}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Pickup Date</p>
                      <p className="font-medium text-gray-900">
                        {new Date(selectedBooking.pickupDate).toLocaleDateString()}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Pickup Time</p>
                      <p className="font-medium text-gray-900">{selectedBooking.pickupTime}</p>
                    </div>
                    {selectedBooking.flightNumber && (
                      <div>
                        <p className="text-sm text-gray-600">Flight Number</p>
                        <p className="font-medium text-gray-900">✈️ {selectedBooking.flightNumber}</p>
                      </div>
                    )}
                    {selectedBooking.pickupSign && (
                      <div>
                        <p className="text-sm text-gray-600">Pickup Sign</p>
                        <p className="font-medium text-gray-900">🪧 {selectedBooking.pickupSign}</p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Vehicle & Driver */}
                <div className="md:col-span-2">
                  <h3 className="text-lg font-bold text-gray-900 mb-4">Vehicle & Driver</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-600">Vehicle</p>
                      <p className="font-medium text-gray-900">🚗 {selectedBooking.vehicleName}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Driver</p>
                      <p className="font-medium text-gray-900">
                        {selectedBooking.driverName ? `👤 ${selectedBooking.driverName}` : '⏳ Not Assigned'}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Extra Stops */}
                {selectedBooking.extraStops && selectedBooking.extraStops.length > 0 && (
                  <div className="md:col-span-2">
                    <h3 className="text-lg font-bold text-gray-900 mb-4">Extra Stops</h3>
                    <div className="space-y-2">
                      {selectedBooking.extraStops.map((stop, index) => (
                        <div key={index} className="bg-gray-50 p-3 rounded-lg">
                          <p className="text-sm font-medium text-gray-900">
                            Stop {stop.stopOrder}: {stop.location}
                          </p>
                          {stop.notes && (
                            <p className="text-xs text-gray-600 mt-1">{stop.notes}</p>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Add-ons/Perks */}
                {selectedBooking.addons && selectedBooking.addons.length > 0 && (
                  <div className="md:col-span-2">
                    <h3 className="text-lg font-bold text-gray-900 mb-4">Add-ons & Perks</h3>
                    <div className="space-y-2">
                      {selectedBooking.addons.map((addon, index) => (
                        <div key={index} className="flex justify-between items-center bg-gray-50 p-3 rounded-lg">
                          <div>
                            <p className="text-sm font-medium text-gray-900">{addon.name}</p>
                            <p className="text-xs text-gray-600">Quantity: {addon.quantity}</p>
                          </div>
                          <p className="text-sm font-bold text-gray-900">₹{addon.price.toLocaleString()}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Special Notes */}
                {selectedBooking.specialNotes && (
                  <div className="md:col-span-2">
                    <h3 className="text-lg font-bold text-gray-900 mb-4">Special Notes</h3>
                    <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                      <p className="text-sm text-gray-900">{selectedBooking.specialNotes}</p>
                    </div>
                  </div>
                )}

                {/* Payment Information */}
                <div className="md:col-span-2">
                  <h3 className="text-lg font-bold text-gray-900 mb-4">Payment Information</h3>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Base Price</span>
                        <span className="text-sm font-medium text-gray-900">₹{selectedBooking.basePrice.toLocaleString()}</span>
                      </div>
                      {selectedBooking.addonPrice > 0 && (
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-600">Add-ons Price</span>
                          <span className="text-sm font-medium text-gray-900">₹{selectedBooking.addonPrice.toLocaleString()}</span>
                        </div>
                      )}
                      {selectedBooking.tipAmount > 0 && (
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-600">Tip Amount</span>
                          <span className="text-sm font-medium text-gray-900">₹{selectedBooking.tipAmount.toLocaleString()}</span>
                        </div>
                      )}
                      <div className="border-t border-gray-300 pt-2 mt-2">
                        <div className="flex justify-between">
                          <span className="text-base font-bold text-gray-900">Total Price</span>
                          <span className="text-base font-bold text-gray-900">₹{selectedBooking.totalPrice.toLocaleString()}</span>
                        </div>
                      </div>
                      <div className="flex justify-between items-center mt-3">
                        <span className="text-sm text-gray-600">Payment Type</span>
                        <span className="text-sm font-medium text-gray-900">{selectedBooking.paymentType.replace(/_/g, ' ')}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">Payment Status</span>
                        <span className={`text-sm font-medium px-3 py-1 rounded-full ${
                          selectedBooking.isPaid ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                        }`}>
                          {selectedBooking.isPaid ? '✓ Paid' : '✗ Unpaid'}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="p-6 border-t border-gray-200 flex justify-end gap-3">
              <button
                onClick={() => setShowDetailsModal(false)}
                className="px-6 py-2 bg-gray-200 text-gray-900 rounded-lg hover:bg-gray-300 transition"
              >
                Close
              </button>
              {selectedBooking.status === 'PENDING' && (
                <button
                  onClick={() => {
                    updateBookingStatus(selectedBooking.id, 'CONFIRMED');
                    setShowDetailsModal(false);
                  }}
                  className="px-6 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition"
                >
                  Confirm Booking
                </button>
              )}
              {selectedBooking.status === 'CONFIRMED' && (
                <button
                  onClick={() => {
                    updateBookingStatus(selectedBooking.id, 'IN_PROGRESS');
                    setShowDetailsModal(false);
                  }}
                  className="px-6 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition"
                >
                  Start Trip
                </button>
              )}
              {selectedBooking.status === 'IN_PROGRESS' && (
                <button
                  onClick={() => {
                    updateBookingStatus(selectedBooking.id, 'COMPLETED');
                    setShowDetailsModal(false);
                  }}
                  className="px-6 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition"
                >
                  Complete Trip
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Assign Driver Modal */}
      {showAssignDriverModal && selectedBooking && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-md w-full">
            <div className="p-6 border-b border-gray-200">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-bold text-gray-900">Assign Driver</h2>
                <button
                  onClick={() => {
                    setShowAssignDriverModal(false);
                    setAssignDriverId('');
                  }}
                  className="text-gray-500 hover:text-gray-700 text-2xl"
                >
                  ✕
                </button>
              </div>
            </div>
            <div className="p-6">
              <div className="mb-4">
                <p className="text-sm text-gray-600 mb-2">Booking Number</p>
                <p className="font-medium text-gray-900">{selectedBooking.bookingNumber}</p>
              </div>
              <div className="mb-4">
                <p className="text-sm text-gray-600 mb-2">Vehicle</p>
                <p className="font-medium text-gray-900">🚗 {selectedBooking.vehicleName}</p>
              </div>
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Select Driver <span className="text-red-500">*</span>
                </label>
                <select
                  value={assignDriverId}
                  onChange={(e) => setAssignDriverId(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                  required
                >
                  <option value="">Select a driver...</option>
                  {drivers.map(driver => (
                    <option key={driver.id} value={driver.id}>
                      {driver.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div className="p-6 border-t border-gray-200 flex justify-end gap-3">
              <button
                onClick={() => {
                  setShowAssignDriverModal(false);
                  setAssignDriverId('');
                }}
                className="px-6 py-2 bg-gray-200 text-gray-900 rounded-lg hover:bg-gray-300 transition"
              >
                Cancel
              </button>
              <button
                onClick={assignDriver}
                disabled={!assignDriverId}
                className={`px-6 py-2 rounded-lg transition ${
                  assignDriverId
                    ? 'bg-black text-white hover:bg-gray-800'
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                }`}
              >
                Assign Driver
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}