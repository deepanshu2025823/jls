"use client";

import { useState, Suspense, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Header from "@/components/header/Header";
import Footer from "@/components/footer/Footer";
import Link from 'next/link';

const countryCodes = [
  { code: '+1', country: 'us', name: 'United States' },
  { code: '+44', country: 'gb', name: 'United Kingdom' },
  { code: '+91', country: 'in', name: 'India' },
  { code: '+86', country: 'cn', name: 'China' },
  { code: '+33', country: 'fr', name: 'France' },
  { code: '+49', country: 'de', name: 'Germany' },
];

function PersonalDetailsContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [countryCode, setCountryCode] = useState('+91');
  const [selectedCountry, setSelectedCountry] = useState('in');
  const [mobileNumber, setMobileNumber] = useState('');
  const [showBookingInfo, setShowBookingInfo] = useState(false);

  // Check if user is logged in
  useEffect(() => {
    const token = localStorage.getItem('jls_token');
    const user = localStorage.getItem('jls_user');
    
    if (!token || !user) {
      // Not logged in, redirect to login with return URL
      const currentPath = '/booking/personal-details';
      const currentParams = searchParams.toString();
      const redirectUrl = currentParams ? `${currentPath}?${currentParams}` : currentPath;
      
      router.push(`/login?redirect=${encodeURIComponent(redirectUrl)}`);
      return;
    }

    // Pre-fill user data if available
    try {
      const userData = JSON.parse(user);
      if (userData.firstName) setFirstName(userData.firstName);
      if (userData.lastName) setLastName(userData.lastName);
      if (userData.phone) setMobileNumber(userData.phone);
    } catch (e) {
      console.error('Failed to parse user data');
    }
  }, [router, searchParams]);

  // Get booking data from URL
  const bookingInfo = {
    pickup: searchParams.get('pickup') || 'Not specified',
    dropoff: searchParams.get('drop') || 'Not specified',
    service: searchParams.get('service') || 'Distance',
    date: searchParams.get('date') || 'Not specified',
    time: searchParams.get('time') || '10:00',
    vehicle: searchParams.get('vehicle') || 'sedan',
    price: searchParams.get('price') || '0'
  };

  const handleCountryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedCode = e.target.value;
    const country = countryCodes.find(c => c.code === selectedCode);
    setCountryCode(selectedCode);
    setSelectedCountry(country?.country || 'in');
  };

  const handleSubmit = async () => {
    if (!firstName || !lastName || !mobileNumber) {
      alert('Please fill all fields');
      return;
    }

    // Validate mobile number
    if (mobileNumber.length < 10) {
      alert('Please enter a valid mobile number');
      return;
    }

    // Here you would save user details to database
    // For now, we'll just proceed to the next step
    
    // Pass all data to pickup info page
    const params = new URLSearchParams({
      vehicle: bookingInfo.vehicle,
      pickup: bookingInfo.pickup,
      drop: bookingInfo.dropoff,
      service: bookingInfo.service,
      date: bookingInfo.date,
      time: bookingInfo.time,
      price: bookingInfo.price
    });
    
    router.push(`/booking/pickup-info?${params.toString()}`);
  };

  const handleEditSearch = () => {
    router.push('/');
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Desktop Header */}
      <div className="headerbgimg hidden lg:block">
        <Header />
      </div>

      {/* Mobile Header */}
      <div className="lg:hidden sticky top-0 z-50 bg-white border-b border-gray-200">
        <div className="flex items-center justify-between px-4 py-3">
          <button onClick={() => router.back()} className="p-2 -ml-2">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <button 
            onClick={() => setShowBookingInfo(!showBookingInfo)}
            className="flex-1 text-center"
          >
            <h1 className="text-base font-bold">{bookingInfo.pickup}</h1>
            <p className="text-xs text-gray-500">{bookingInfo.date} • {bookingInfo.time}</p>
          </button>
          <button onClick={handleEditSearch} className="p-2 -mr-2">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
            </svg>
          </button>
        </div>

        {/* Expandable Booking Info - Mobile */}
        {showBookingInfo && (
          <div className="border-t border-gray-200 p-4 space-y-3 bg-gray-50">
            <div className="flex items-start gap-2">
              <svg className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              </svg>
              <div className="flex-1 min-w-0">
                <p className="text-xs text-gray-500">Pickup Location</p>
                <p className="text-sm font-medium text-gray-900">{bookingInfo.pickup}</p>
              </div>
            </div>
            <div className="flex items-start gap-2">
              <svg className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              </svg>
              <div className="flex-1 min-w-0">
                <p className="text-xs text-gray-500">Drop Location</p>
                <p className="text-sm font-medium text-gray-900">{bookingInfo.dropoff}</p>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-3">
              <div>
                <p className="text-xs text-gray-500">Service</p>
                <p className="text-sm font-medium text-gray-900">{bookingInfo.service}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500">Date</p>
                <p className="text-sm font-medium text-gray-900">{bookingInfo.date}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500">Time</p>
                <p className="text-sm font-medium text-gray-900">{bookingInfo.time}</p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Desktop Booking Info Bar */}
      <div className="hidden lg:block bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between gap-6">
            <div className="flex items-center gap-6 flex-1">
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                </svg>
                <div>
                  <p className="text-xs text-gray-500">Pickup</p>
                  <p className="text-sm font-semibold text-gray-900">{bookingInfo.pickup}</p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                </svg>
                <div>
                  <p className="text-xs text-gray-500">Drop</p>
                  <p className="text-sm font-semibold text-gray-900">{bookingInfo.dropoff}</p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <div>
                  <p className="text-xs text-gray-500">Date & Time</p>
                  <p className="text-sm font-semibold text-gray-900">{bookingInfo.date} at {bookingInfo.time}</p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <div>
                  <p className="text-xs text-gray-500">Price</p>
                  <p className="text-sm font-semibold text-gray-900">${bookingInfo.price}</p>
                </div>
              </div>
            </div>

            <button 
              onClick={handleEditSearch}
              className="bg-black text-white px-6 py-2.5 rounded-full hover:bg-gray-800 transition flex items-center gap-2 text-sm font-medium"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
              Edit Search
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-2xl mx-auto px-4 sm:px-6 py-4 sm:py-12 pb-24 lg:pb-12">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-xl sm:text-3xl font-bold text-gray-900 mb-2">Add your personal details</h1>
          <p className="text-sm sm:text-base text-gray-600">
            Complete your profile to keep your account up to date and secure
          </p>
        </div>

        {/* Form Card */}
        <div className="bg-white rounded-2xl lg:rounded-3xl border border-gray-200 p-4 sm:p-10 mb-4">
          <div className="space-y-4 sm:space-y-6">
            {/* First Name */}
            <div>
              <label className="block text-sm text-gray-700 mb-2 font-medium lg:hidden">First Name</label>
              <input
                type="text"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                placeholder="First Name"
                className="w-full px-4 sm:px-5 py-3 sm:py-4 bg-gray-50 rounded-xl border-0 focus:ring-2 focus:ring-black outline-none text-sm sm:text-base placeholder:text-gray-500"
              />
            </div>

            {/* Last Name */}
            <div>
              <label className="block text-sm text-gray-700 mb-2 font-medium lg:hidden">Last Name</label>
              <input
                type="text"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                placeholder="Last Name"
                className="w-full px-4 sm:px-5 py-3 sm:py-4 bg-gray-50 rounded-xl border-0 focus:ring-2 focus:ring-black outline-none text-sm sm:text-base placeholder:text-gray-500"
              />
            </div>

            {/* Mobile Number with Country Code */}
            <div>
              <label className="block text-sm text-gray-700 mb-2 font-medium lg:hidden">Mobile Number</label>
              <div className="grid grid-cols-[110px_1fr] sm:grid-cols-[140px_1fr] gap-2 sm:gap-3">
                <div className="relative">
                  <img 
                    src={`https://flagcdn.com/w40/${selectedCountry}.png`}
                    alt={selectedCountry}
                    className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 w-5 h-4 object-cover rounded pointer-events-none"
                  />
                  <select
                    value={countryCode}
                    onChange={handleCountryChange}
                    className="w-full pl-10 sm:pl-12 pr-6 sm:pr-8 py-3 sm:py-4 bg-gray-50 rounded-xl border-0 focus:ring-2 focus:ring-black outline-none text-sm sm:text-base appearance-none cursor-pointer"
                  >
                    {countryCodes.map((c) => (
                      <option key={c.code} value={c.code}>{c.code}</option>
                    ))}
                  </select>
                  <svg
                    className="absolute right-2 sm:right-3 top-1/2 -translate-y-1/2 w-3 h-3 sm:w-4 sm:h-4 text-gray-600 pointer-events-none"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>

                <input
                  type="tel"
                  value={mobileNumber}
                  onChange={(e) => setMobileNumber(e.target.value)}
                  placeholder="Mobile Number"
                  className="w-full px-4 sm:px-5 py-3 sm:py-4 bg-gray-50 rounded-xl border-0 focus:ring-2 focus:ring-black outline-none text-sm sm:text-base placeholder:text-gray-500"
                />
              </div>
            </div>

            {/* Helper Text */}
            <p className="text-xs sm:text-sm text-gray-600">
              Add your mobile number for your chauffeur's notification
            </p>
          </div>
        </div>

        {/* Privacy Policy */}
        <div className="text-center mb-4">
          <p className="text-xs sm:text-sm text-gray-600">
            By adding your personal details, you agree to our{' '}
            <Link href="/privacy" className="text-gray-900 underline hover:text-black">
              Privacy Policy
            </Link>
            {' '}and{' '}
            <Link href="/terms" className="text-gray-900 underline hover:text-black">
              Terms of Use
            </Link>
          </p>
        </div>
      </div>

      {/* Fixed Bottom Button - Mobile */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 shadow-lg">
        <button
          onClick={handleSubmit}
          className="w-full py-4 bg-black text-white rounded-full font-bold transition text-base"
        >
          Save and Continue
        </button>
      </div>

      {/* Desktop Button */}
      <div className="hidden lg:flex justify-end max-w-2xl mx-auto px-6 pb-5">
        <button
          onClick={handleSubmit}
          className="px-8 py-3 bg-black text-white rounded-full font-semibold hover:bg-gray-800 transition text-sm"
        >
          Save and Continue
        </button>
      </div>

      {/* Desktop Footer */}
      <div className="hidden lg:block">
        <Footer />
      </div>
    </div>
  );
}

export default function PersonalDetailsPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    }>
      <PersonalDetailsContent />
    </Suspense>
  );
}