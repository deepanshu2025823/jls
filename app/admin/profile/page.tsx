"use client";
import { useState, useEffect } from "react";
import Image from "next/image";

export default function ProfilePage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  
  // State matching your SQL User table structure
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    membershipStatus: "STANDARD",
    profileImage: "",
  });

  useEffect(() => {
    // Simulating database fetch based on your SQL dump data
    // In production, replace with: fetch('/api/user/profile')
    const fetchUserData = async () => {
      try {
        setLoading(true);
        // Mocking the data from your user table (Deepanshu Joshi)
        setTimeout(() => {
          setFormData({
            firstName: "Deepanshu",
            lastName: "Joshi",
            email: "mr.deepanshujoshi@gmail.com",
            phone: "8368436412",
            membershipStatus: "VIP",
            profileImage: "/admin/profile.svg",
          });
          setLoading(false);
        }, 800);
      } catch (error) {
        console.error("Error fetching profile:", error);
      }
    };

    fetchUserData();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    
    // Simulate API Update call
    await new Promise(resolve => setTimeout(resolve, 1000));
    alert("Profile updated successfully!");
    setSaving(false);
  };

  if (loading) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black"></div>
      </div>
    );
  }

  return (
    <div className="p-6 lg:p-10 max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Account Settings</h1>
        <p className="text-gray-500">Manage your profile information and preferences.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Profile Image Section */}
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-6">
          <div className="relative h-24 w-24 rounded-full overflow-hidden border-2 border-gray-100">
            <img 
              src={formData.profileImage || "/admin/profile.svg"} 
              alt="Avatar" 
              className="h-full w-full object-cover"
            />
          </div>
          <div>
            <button type="button" className="px-4 py-2 bg-black text-white text-sm rounded-lg hover:bg-gray-800 transition-colors">
              Change Photo
            </button>
            <p className="text-xs text-gray-400 mt-2">JPG, GIF or PNG. Max size of 2MB.</p>
          </div>
        </div>

        {/* Personal Information */}
        <div className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm">
          <h2 className="text-lg font-semibold mb-6">Personal Information</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">First Name</label>
              <input 
                type="text" 
                value={formData.firstName}
                onChange={(e) => setFormData({...formData, firstName: e.target.value})}
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-black/5 outline-none transition-all"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Last Name</label>
              <input 
                type="text" 
                value={formData.lastName}
                onChange={(e) => setFormData({...formData, lastName: e.target.value})}
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-black/5 outline-none transition-all"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Email Address</label>
              <input 
                type="email" 
                disabled
                value={formData.email}
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 bg-gray-50 text-gray-500 cursor-not-allowed outline-none"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Phone Number</label>
              <input 
                type="tel" 
                value={formData.phone}
                onChange={(e) => setFormData({...formData, phone: e.target.value})}
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-black/5 outline-none transition-all"
              />
            </div>
          </div>
        </div>

        {/* Account Details */}
        <div className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm">
          <h2 className="text-lg font-semibold mb-4">Account Status</h2>
          <div className="inline-flex items-center px-3 py-1 rounded-full bg-yellow-100 text-yellow-800 text-sm font-medium">
             Membership: {formData.membershipStatus}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-end gap-4">
          <button 
            type="button"
            className="px-6 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-xl transition-colors"
          >
            Cancel
          </button>
          <button 
            type="submit"
            disabled={saving}
            className="px-8 py-2.5 bg-black text-white text-sm font-medium rounded-xl hover:bg-gray-800 disabled:bg-gray-400 transition-all shadow-lg shadow-black/10"
          >
            {saving ? "Saving Changes..." : "Save Changes"}
          </button>
        </div>
      </form>
    </div>
  );
}