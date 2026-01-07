"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Header from "@/components/header/Header";
import Footer from "@/components/footer/Footer";
import Image from 'next/image';

interface UserData {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phone: string;
  role: string;
  membershipStatus: string;
  profileImage?: string;
  createdAt: string;
}

export default function ProfilePage() {
  const router = useRouter();
  const [user, setUser] = useState<UserData | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');

  useEffect(() => {
    // Check if user is logged in
    const token = localStorage.getItem('jls_token');
    const userData = localStorage.getItem('jls_user');

    if (!token || !userData) {
      router.push('/login?redirect=/profile');
      return;
    }

    try {
      const parsedUser = JSON.parse(userData);
      setUser(parsedUser);
      setFirstName(parsedUser.firstName);
      setLastName(parsedUser.lastName);
      setPhone(parsedUser.phone);
      setEmail(parsedUser.email);
    } catch (error) {
      console.error('Error parsing user data:', error);
      router.push('/login');
    } finally {
      setLoading(false);
    }
  }, [router]);

  const handleSave = async () => {
    setSaving(true);
    try {
      // Here you would call your API to update user profile
      const token = localStorage.getItem('jls_token');
      
      const response = await fetch('/api/user/profile', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          firstName,
          lastName,
          phone,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to update profile');
      }

      const updatedUser = await response.json();
      
      // Update localStorage
      localStorage.setItem('jls_user', JSON.stringify(updatedUser));
      setUser(updatedUser);
      setIsEditing(false);
      
      alert('Profile updated successfully!');
    } catch (error) {
      console.error('Error updating profile:', error);
      alert('Failed to update profile. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('jls_token');
    localStorage.removeItem('jls_user');
    router.push('/');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black mx-auto mb-4"></div>
          <p className="text-gray-600">Loading profile...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="headerbgimg">
        <Header />
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
        {/* Profile Header */}
        <div className="bg-white rounded-3xl shadow-sm border border-gray-200 p-6 sm:p-8 mb-6">
          <div className="flex flex-col sm:flex-row items-center gap-6">
            {/* Profile Image */}
            <div className="relative">
              <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-full bg-gradient-to-br from-gray-800 to-gray-600 flex items-center justify-center text-white text-3xl sm:text-4xl font-bold">
                {user.firstName[0]}{user.lastName[0]}
              </div>
              {user.membershipStatus === 'VIP' && (
                <div className="absolute -bottom-2 -right-2 bg-yellow-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg">
                  VIP
                </div>
              )}
            </div>

            {/* User Info */}
            <div className="flex-1 text-center sm:text-left">
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-1">
                {user.firstName} {user.lastName}
              </h1>
              <p className="text-gray-600 mb-2">{user.email}</p>
              <div className="flex flex-wrap gap-2 justify-center sm:justify-start">
                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                  {user.role}
                </span>
                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                  {user.membershipStatus}
                </span>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-2">
              <button
                onClick={() => setIsEditing(!isEditing)}
                className="px-4 py-2 bg-black text-white rounded-full text-sm font-medium hover:bg-gray-800 transition"
              >
                {isEditing ? 'Cancel' : 'Edit Profile'}
              </button>
              <button
                onClick={handleLogout}
                className="px-4 py-2 bg-red-600 text-white rounded-full text-sm font-medium hover:bg-red-700 transition"
              >
                Logout
              </button>
            </div>
          </div>
        </div>

        {/* Profile Details */}
        <div className="bg-white rounded-3xl shadow-sm border border-gray-200 p-6 sm:p-8">
          <h2 className="text-xl font-bold text-gray-900 mb-6">Personal Information</h2>

          <div className="space-y-6">
            {/* First Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                First Name
              </label>
              <input
                type="text"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                disabled={!isEditing}
                className="w-full px-4 py-3 bg-gray-50 rounded-xl border-0 focus:ring-2 focus:ring-black outline-none disabled:opacity-50 disabled:cursor-not-allowed"
              />
            </div>

            {/* Last Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Last Name
              </label>
              <input
                type="text"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                disabled={!isEditing}
                className="w-full px-4 py-3 bg-gray-50 rounded-xl border-0 focus:ring-2 focus:ring-black outline-none disabled:opacity-50 disabled:cursor-not-allowed"
              />
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email Address
              </label>
              <input
                type="email"
                value={email}
                disabled
                className="w-full px-4 py-3 bg-gray-100 rounded-xl border-0 cursor-not-allowed opacity-50"
              />
              <p className="text-xs text-gray-500 mt-1">Email cannot be changed</p>
            </div>

            {/* Phone */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Phone Number
              </label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                disabled={!isEditing}
                className="w-full px-4 py-3 bg-gray-50 rounded-xl border-0 focus:ring-2 focus:ring-black outline-none disabled:opacity-50 disabled:cursor-not-allowed"
              />
            </div>

            {/* Save Button */}
            {isEditing && (
              <div className="flex justify-end gap-3 pt-4">
                <button
                  onClick={() => setIsEditing(false)}
                  className="px-6 py-3 bg-gray-200 text-gray-700 rounded-full font-medium hover:bg-gray-300 transition"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  disabled={saving}
                  className="px-6 py-3 bg-black text-white rounded-full font-medium hover:bg-gray-800 transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {saving ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Quick Links */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-6">
          <button
            onClick={() => router.push('/bookings')}
            className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition text-left"
          >
            <div className="text-2xl mb-2">📅</div>
            <h3 className="font-semibold text-gray-900 mb-1">My Bookings</h3>
            <p className="text-sm text-gray-600">View your trip history</p>
          </button>

          <button
            onClick={() => router.push('/saved-cards')}
            className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition text-left"
          >
            <div className="text-2xl mb-2">💳</div>
            <h3 className="font-semibold text-gray-900 mb-1">Payment Methods</h3>
            <p className="text-sm text-gray-600">Manage your cards</p>
          </button>

          <button
            onClick={() => router.push('/saved-addresses')}
            className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition text-left"
          >
            <div className="text-2xl mb-2">📍</div>
            <h3 className="font-semibold text-gray-900 mb-1">Saved Addresses</h3>
            <p className="text-sm text-gray-600">Manage your locations</p>
          </button>
        </div>
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
}