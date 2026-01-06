"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from "next/image";
import Link from "next/link";
import io from 'socket.io-client';
import AdminHeader from '@/components/AdminHeader';

interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
  membershipStatus: string;
  profileImage?: string;
}

interface DashboardStats {
  totalBookings: number;
  totalRevenue: number;
  activeDrivers: number;
  totalCustomers: number;
  pendingBookings: number;
  completedBookings: number;
  vipMembers: number;
  corporateAccounts: number;
  totalVehicles: number;
  availableVehicles: number;
}

interface RecentBooking {
  id: string;
  bookingNumber: string;
  customerName: string;
  pickupLocation: string;
  bookingType: string;
  status: string;
  totalPrice: number;
  createdAt: string;
}

interface Notification {
  id: string;
  type: string;
  message: string;
  timestamp: string;
  read: boolean;
}

export default function AdminDashboard() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [recentBookings, setRecentBookings] = useState<RecentBooking[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const [socket, setSocket] = useState<any>(null);

  useEffect(() => {
    const userData = localStorage.getItem('jls_user');
    const token = localStorage.getItem('jls_token');

    if (!userData || !token) {
      router.push('/login');
      return;
    }

    const parsedUser = JSON.parse(userData);
    
    if (parsedUser.role !== 'ADMIN') {
      router.push('/');
      return;
    }

    setUser(parsedUser);
    loadDashboardData(token);
    initializeSocket(parsedUser.id);
  }, [router]);

  const initializeSocket = (userId: string) => {
    const socketUrl = process.env.NEXT_PUBLIC_SOCKET_URL || 'http://localhost:3001';
    const newSocket = io(socketUrl, {
      query: { userId, role: 'ADMIN' }
    });

    newSocket.on('connect', () => {
      console.log('Socket connected');
    });

    newSocket.on('newBooking', (data: any) => {
      setNotifications(prev => [{
        id: Date.now().toString(),
        type: 'booking',
        message: `New booking received: ${data.bookingNumber}`,
        timestamp: new Date().toISOString(),
        read: false
      }, ...prev]);
      loadDashboardData(localStorage.getItem('jls_token')!);
    });

    newSocket.on('bookingStatusUpdate', (data: any) => {
      setNotifications(prev => [{
        id: Date.now().toString(),
        type: 'status',
        message: `Booking ${data.bookingNumber} status updated to ${data.status}`,
        timestamp: new Date().toISOString(),
        read: false
      }, ...prev]);
      loadDashboardData(localStorage.getItem('jls_token')!);
    });

    newSocket.on('newDriver', (data: any) => {
      setNotifications(prev => [{
        id: Date.now().toString(),
        type: 'driver',
        message: `New driver registered: ${data.name}`,
        timestamp: new Date().toISOString(),
        read: false
      }, ...prev]);
      loadDashboardData(localStorage.getItem('jls_token')!);
    });

    setSocket(newSocket);

    return () => {
      newSocket.disconnect();
    };
  };

  const loadDashboardData = async (token: string) => {
    try {
      const response = await fetch('/api/admin/dashboard', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setStats(data.stats);
        setRecentBookings(data.recentBookings);
      }
    } catch (error) {
      console.error('Error loading dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    if (socket) {
      socket.disconnect();
    }
    localStorage.removeItem('jls_token');
    localStorage.removeItem('jls_user');
    router.push('/login');
  };

  const markNotificationAsRead = (id: string) => {
    setNotifications(prev =>
      prev.map(notif => notif.id === id ? { ...notif, read: true } : notif)
    );
  };

  const unreadCount = notifications.filter(n => !n.read).length;

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
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Welcome back, {user?.firstName}!</h1>
          <p className="text-gray-600 mt-2">Here's what's happening with your luxury limousine service today.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl shadow-lg p-6 text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium opacity-90">Total Bookings</p>
                <p className="text-3xl font-bold mt-2">{stats?.totalBookings || 0}</p>
              </div>
              <div className="w-12 h-12 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
            </div>
            <div className="mt-4 flex items-center text-sm opacity-90">
              <span className="font-medium">↑ 12.5%</span>
              <span className="ml-2">from last month</span>
            </div>
          </div>

          {/* Total Revenue */}
          <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl shadow-lg p-6 text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium opacity-90">Total Revenue</p>
                <p className="text-3xl font-bold mt-2">₹{((stats?.totalRevenue || 0) / 1000).toFixed(0)}K</p>
              </div>
              <div className="w-12 h-12 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
            <div className="mt-4 flex items-center text-sm opacity-90">
              <span className="font-medium">↑ 18.2%</span>
              <span className="ml-2">from last month</span>
            </div>
          </div>

          {/* Active Chauffeurs */}
          <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl shadow-lg p-6 text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium opacity-90">Active Chauffeurs</p>
                <p className="text-3xl font-bold mt-2">{stats?.activeDrivers || 0}</p>
              </div>
              <div className="w-12 h-12 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
            </div>
            <div className="mt-4 flex items-center text-sm opacity-90">
              <span className="font-medium">+3 new</span>
              <span className="ml-2">this week</span>
            </div>
          </div>

          {/* Total Customers */}
          <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl shadow-lg p-6 text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium opacity-90">Total Customers</p>
                <p className="text-3xl font-bold mt-2">{stats?.totalCustomers || 0}</p>
              </div>
              <div className="w-12 h-12 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              </div>
            </div>
            <div className="mt-4 flex items-center text-sm opacity-90">
              <span className="font-medium">+45 new</span>
              <span className="ml-2">this month</span>
            </div>
          </div>
        </div>

        {/* Secondary Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center">
                <span className="text-2xl">👑</span>
              </div>
              <div>
                <p className="text-sm text-gray-600">VIP Members</p>
                <p className="text-2xl font-bold text-gray-900">{stats?.vipMembers || 0}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                <span className="text-2xl">🏢</span>
              </div>
              <div>
                <p className="text-sm text-gray-600">Corporate Accounts</p>
                <p className="text-2xl font-bold text-gray-900">{stats?.corporateAccounts || 0}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                <span className="text-2xl">🚗</span>
              </div>
              <div>
                <p className="text-sm text-gray-600">Total Fleet</p>
                <p className="text-2xl font-bold text-gray-900">{stats?.totalVehicles || 0}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                <span className="text-2xl">✓</span>
              </div>
              <div>
                <p className="text-sm text-gray-600">Available Vehicles</p>
                <p className="text-2xl font-bold text-gray-900">{stats?.availableVehicles || 0}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions & Recent Bookings */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Quick Actions */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
              <h2 className="text-lg font-bold text-gray-900 mb-4">Quick Actions</h2>
              <div className="space-y-3">
                <Link href="/admin/bookings/new">
                  <button className="w-full text-left px-4 py-3 bg-black text-white rounded-lg hover:bg-gray-800 transition flex items-center gap-2">
                    <span>➕</span> New Booking
                  </button>
                </Link>
                <Link href="/admin/drivers/add">
                  <button className="w-full text-left px-4 py-3 bg-gray-100 text-gray-900 rounded-lg hover:bg-gray-200 transition flex items-center gap-2">
                    <span>👤</span> Add Chauffeur
                  </button>
                </Link>
                <Link href="/admin/vehicles/add">
                  <button className="w-full text-left px-4 py-3 bg-gray-100 text-gray-900 rounded-lg hover:bg-gray-200 transition flex items-center gap-2">
                    <span>🚗</span> Add Vehicle
                  </button>
                </Link>
                <Link href="/admin/addons">
                  <button className="w-full text-left px-4 py-3 bg-gray-100 text-gray-900 rounded-lg hover:bg-gray-200 transition flex items-center gap-2">
                    <span>🎁</span> Manage Perks
                  </button>
                </Link>
                <Link href="/admin/packages">
                  <button className="w-full text-left px-4 py-3 bg-gray-100 text-gray-900 rounded-lg hover:bg-gray-200 transition flex items-center gap-2">
                    <span>📦</span> Manage Packages
                  </button>
                </Link>
                <Link href="/admin/reports">
                  <button className="w-full text-left px-4 py-3 bg-gray-100 text-gray-900 rounded-lg hover:bg-gray-200 transition flex items-center gap-2">
                    <span>📊</span> View Reports
                  </button>
                </Link>
                <Link href="/admin/settings">
                  <button className="w-full text-left px-4 py-3 bg-gray-100 text-gray-900 rounded-lg hover:bg-gray-200 transition flex items-center gap-2">
                    <span>⚙️</span> Settings
                  </button>
                </Link>
              </div>
            </div>
          </div>

          {/* Recent Bookings */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-bold text-gray-900">Recent Bookings</h2>
                <Link href="/admin/bookings" className="text-sm text-blue-600 hover:underline font-medium">
                  View All →
                </Link>
              </div>
              {recentBookings.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <p>No recent bookings</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {recentBookings.slice(0, 4).map((booking, index) => (
                    <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition cursor-pointer">
                      <div className="flex-1">
                        <p className="font-semibold text-gray-900">{booking.bookingNumber}</p>
                        <p className="text-sm text-gray-600">{booking.customerName}</p>
                        <p className="text-xs text-gray-500 mt-1 flex items-center gap-1">
                          <span>📍</span> {booking.pickupLocation}
                        </p>
                        <p className="text-xs text-gray-400 mt-1">
                          {new Date(booking.createdAt).toLocaleString()}
                        </p>
                      </div>
                      <div className="text-right">
                        <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium mb-2 ${
                          booking.status === 'COMPLETED' ? 'bg-green-100 text-green-800' :
                          booking.status === 'IN_PROGRESS' ? 'bg-blue-100 text-blue-800' :
                          booking.status === 'CONFIRMED' ? 'bg-purple-100 text-purple-800' :
                          booking.status === 'CANCELLED' ? 'bg-red-100 text-red-800' :
                          'bg-yellow-100 text-yellow-800'
                        }`}>
                          {booking.status}
                        </span>
                        <p className="text-sm font-bold text-gray-900">₹{booking.totalPrice.toLocaleString()}</p>
                        <p className="text-xs text-gray-500">{booking.bookingType}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Booking Status Overview */}
        <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-yellow-50 rounded-xl p-6 border border-yellow-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-yellow-800 font-medium">Pending Bookings</p>
                <p className="text-2xl font-bold text-yellow-900 mt-2">{stats?.pendingBookings || 0}</p>
              </div>
              <div className="w-10 h-10 bg-yellow-200 rounded-full flex items-center justify-center">
                <span className="text-xl">⏳</span>
              </div>
            </div>
            <Link href="/admin/bookings?status=PENDING" className="text-xs text-yellow-700 hover:underline mt-3 inline-block">
              View Pending →
            </Link>
          </div>

          <div className="bg-blue-50 rounded-xl p-6 border border-blue-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-blue-800 font-medium">In Progress</p>
                <p className="text-2xl font-bold text-blue-900 mt-2">
                  {(stats?.totalBookings || 0) - (stats?.completedBookings || 0) - (stats?.pendingBookings || 0)}
                </p>
              </div>
              <div className="w-10 h-10 bg-blue-200 rounded-full flex items-center justify-center">
                <span className="text-xl">🚗</span>
              </div>
            </div>
            <Link href="/admin/bookings?status=IN_PROGRESS" className="text-xs text-blue-700 hover:underline mt-3 inline-block">
              View Active →
            </Link>
          </div>

          <div className="bg-green-50 rounded-xl p-6 border border-green-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-green-800 font-medium">Completed</p>
                <p className="text-2xl font-bold text-green-900 mt-2">{stats?.completedBookings || 0}</p>
              </div>
              <div className="w-10 h-10 bg-green-200 rounded-full flex items-center justify-center">
                <span className="text-xl">✅</span>
              </div>
            </div>
            <Link href="/admin/bookings?status=COMPLETED" className="text-xs text-green-700 hover:underline mt-3 inline-block">
              View Completed →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}