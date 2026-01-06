"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from "next/image";
import Link from "next/link";
import io from 'socket.io-client';

interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
  membershipStatus: string;
  profileImage?: string;
}

interface Notification {
  id: string;
  type: string;
  message: string;
  timestamp: string;
  read: boolean;
}

interface AdminHeaderProps {
  currentPage?: string;
}

export default function AdminHeader({ currentPage = '' }: AdminHeaderProps) {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
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
    });

    newSocket.on('bookingStatusUpdate', (data: any) => {
      setNotifications(prev => [{
        id: Date.now().toString(),
        type: 'status',
        message: `Booking ${data.bookingNumber} status updated to ${data.status}`,
        timestamp: new Date().toISOString(),
        read: false
      }, ...prev]);
    });

    newSocket.on('newDriver', (data: any) => {
      setNotifications(prev => [{
        id: Date.now().toString(),
        type: 'driver',
        message: `New driver registered: ${data.name}`,
        timestamp: new Date().toISOString(),
        read: false
      }, ...prev]);
    });

    setSocket(newSocket);

    return () => {
      newSocket.disconnect();
    };
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

  const isActive = (page: string) => currentPage === page;

  return (
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
                <Link href="/admin/dashboard" className="text-white hover:text-gray-300 font-medium">
                  Dashboard
                </Link>
                <Link href="/admin/bookings" className="hover:text-gray-300">Bookings</Link>
                <Link href="/admin/vehicles" className="hover:text-gray-300">Fleet</Link>
                <Link href="/admin/drivers" className="hover:text-gray-300">Chauffeurs</Link>
                <Link href="/admin/users" className="hover:text-gray-300">Users</Link>
                <Link href="/admin/addons" className="hover:text-gray-300">Perks</Link>
                <Link href="/admin/packages" className="hover:text-gray-300">Packages</Link>
              </div>
            </div>
            <div className="flex items-center gap-4">
              {/* Notifications */}
              <div className="relative">
                <button
                  onClick={() => setShowNotifications(!showNotifications)}
                  className="relative p-2 hover:bg-gray-800 rounded-lg transition"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                  </svg>
                  {unreadCount > 0 && (
                    <span className="absolute top-0 right-0 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                      {unreadCount}
                    </span>
                  )}
                </button>
                
                {showNotifications && (
                  <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-xl border border-gray-200 text-gray-900 max-h-96 overflow-y-auto">
                    <div className="p-4 border-b border-gray-200">
                      <h3 className="font-semibold">Notifications</h3>
                    </div>
                    {notifications.length === 0 ? (
                      <div className="p-4 text-center text-gray-500">
                        No notifications
                      </div>
                    ) : (
                      <div>
                        {notifications.map(notif => (
                          <div
                            key={notif.id}
                            onClick={() => markNotificationAsRead(notif.id)}
                            className={`p-4 border-b border-gray-100 hover:bg-gray-50 cursor-pointer ${
                              !notif.read ? 'bg-blue-50' : ''
                            }`}
                          >
                            <p className="text-sm font-medium">{notif.message}</p>
                            <p className="text-xs text-gray-500 mt-1">
                              {new Date(notif.timestamp).toLocaleString()}
                            </p>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>

              <div className="flex items-center gap-3">
                {user?.profileImage ? (
                  <Image
                    src={user.profileImage}
                    alt={user.firstName}
                    width={40}
                    height={40}
                    className="rounded-full"
                  />
                ) : (
                  <div className="w-10 h-10 bg-gray-600 rounded-full flex items-center justify-center">
                    <span className="text-white font-medium">
                      {user?.firstName?.[0]}{user?.lastName?.[0]}
                    </span>
                  </div>
                )}
                <div className="text-right">
                  <p className="text-sm font-medium">{user?.firstName} {user?.lastName}</p>
                  <p className="text-xs text-gray-400">{user?.role}</p>
                </div>
              </div>
              <button
                onClick={handleLogout}
                className="px-4 py-2 bg-white text-black rounded-lg hover:bg-gray-200 transition font-medium"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </nav>
  );
}