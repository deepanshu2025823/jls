"use client";

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Header from "@/components/header/Header";
import Footer from "@/components/footer/Footer";

export default function PickupInfoContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const [bookingFor, setBookingFor] = useState('myself');
  const [flightNumber, setFlightNumber] = useState('');
  const [pickupSign, setPickupSign] = useState('');
  const [notes, setNotes] = useState('');
  const [reference, setReference] = useState('');
  const [showBookingInfo, setShowBookingInfo] = useState(false);

  // ✅ DYNAMIC: Get data from URL params
  const bookingInfo = {
    pickup: searchParams.get('pickup') || 'Not specified',
    dropoff: searchParams.get('drop') || 'Not specified',
    service: searchParams.get('service') || 'Distance',
    date: searchParams.get('date') || 'Not specified',
    time: searchParams.get('time') || '10:00',
    vehicle: searchParams.get('vehicle') || 'sedan',
    price: searchParams.get('price') || '0'
  };

  const handleContinue = () => {
    // ✅ DYNAMIC: Pass all data to payment page
    const params = new URLSearchParams({
      vehicle: bookingInfo.vehicle,
      pickup: bookingInfo.pickup,
      drop: bookingInfo.dropoff,
      service: bookingInfo.service,
      date: bookingInfo.date,
      time: bookingInfo.time,
      price: bookingInfo.price,
      bookingFor: bookingFor,
      flightNumber: flightNumber,
      pickupSign: pickupSign,
      notes: notes,
      reference: reference
    });
    
    router.push(`/booking/payment?${params.toString()}`);
  };

  const handleEditSearch = () => {
    router.push('/');
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="headerbgimg hidden lg:block">
        <Header />
      </div>

      <div className="lg:hidden sticky top-0 z-50 bg-white border-b border-gray-200 px-4 py-3">
        <div className="flex items-center justify-between">
          <button onClick={() => router.back()} className="p-2 -ml-2">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <button 
            onClick={() => setShowBookingInfo(!showBookingInfo)}
            className="flex items-center gap-2 text-sm flex-1 justify-center"
          >
            <span className="font-medium truncate max-w-[180px]">{bookingInfo.pickup}</span>
            <svg className={`w-4 h-4 transition-transform flex-shrink-0 ${showBookingInfo ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
          <button onClick={handleEditSearch} className="p-2 -mr-2">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
          </button>
        </div>

        {/* Expandable Booking Info - Mobile */}
        {showBookingInfo && (
          <div className="mt-3 pb-3 space-y-3 border-t pt-3">
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
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-4 sm:py-12">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-4 gap-2">
          <h1 className="text-xl sm:text-3xl font-bold text-gray-900">Pickup Info</h1>
          <span className="bg-gray-100 text-gray-700 px-3 py-1.5 rounded-full text-xs font-medium w-fit">Step 2/3</span>
        </div>

        <p className="text-gray-600 mb-4 text-xs sm:text-sm">Select who you are booking for</p>

        {/* Booking For */}
        <div className="bg-white rounded-lg p-4 mb-4 border border-gray-200">
          <div className="space-y-3">
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="radio"
                name="bookingFor"
                value="myself"
                checked={bookingFor === 'myself'}
                onChange={(e) => setBookingFor(e.target.value)}
                className="w-4 h-4"
              />
              <span className="text-sm text-gray-900">Book for myself</span>
            </label>
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="radio"
                name="bookingFor"
                value="someone"
                checked={bookingFor === 'someone'}
                onChange={(e) => setBookingFor(e.target.value)}
                className="w-4 h-4"
              />
              <span className="text-sm text-gray-900">Book for someone else</span>
            </label>
          </div>
        </div>

        {/* Additional Information */}
        <div className="bg-white rounded-lg p-4 border border-gray-200 mb-6">
          <h2 className="text-base font-bold mb-1 text-gray-900">Provide additional information</h2>
          <p className="text-gray-600 mb-4 text-xs">Enter your flight number to ensure your chauffeur can track your flight and adjust the pickup time</p>

          <div className="space-y-4">
            {/* Flight Number */}
            <div>
              <label className="block text-xs text-gray-700 mb-1.5">Flight Number</label>
              <input
                type="text"
                value={flightNumber}
                onChange={(e) => setFlightNumber(e.target.value)}
                placeholder="eg. FH653, BA453"
                className="w-full px-3 py-2.5 bg-gray-50 rounded-lg border-0 focus:ring-2 focus:ring-black outline-none text-sm"
              />
            </div>

            {/* Pickup Sign */}
            <div>
              <label className="block text-xs text-gray-700 mb-1.5">Pickup sign</label>
              <input
                type="text"
                value={pickupSign}
                onChange={(e) => setPickupSign(e.target.value)}
                placeholder="Enter name for pickup sign"
                className="w-full px-3 py-2.5 bg-gray-50 rounded-lg border-0 focus:ring-2 focus:ring-black outline-none text-sm"
              />
              <p className="text-xs text-gray-500 mt-1.5">It will appear on your chauffeur's pickup sign when they meet you.</p>
            </div>

            {/* Notes for Chauffeur */}
            <div>
              <label className="block text-xs text-gray-700 mb-1.5">Note for the chauffeurs</label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Add special requests..."
                rows={3}
                className="w-full px-3 py-2.5 bg-gray-50 rounded-lg border-0 focus:ring-2 focus:ring-black outline-none resize-none text-sm"
              />
              <p className="text-xs text-gray-500 mt-1.5">Add special requests, e.g. number of bags, child seats, etc. Please do not include confidential information.</p>
            </div>

            {/* Reference Code */}
            <div>
              <label className="block text-xs text-gray-700 mb-1.5">Reference code or cost center</label>
              <input
                type="text"
                value={reference}
                onChange={(e) => setReference(e.target.value)}
                placeholder="Enter reference code"
                className="w-full px-3 py-2.5 bg-gray-50 rounded-lg border-0 focus:ring-2 focus:ring-black outline-none text-sm"
              />
              <p className="text-xs text-gray-500 mt-1.5">Booking for business? What you enter above will appear on the invoice.</p>
            </div>
          </div>
        </div>

        {/* Fixed Bottom Button - Mobile */}
        <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4">
          <button
            onClick={handleContinue}
            className="w-full py-3.5 bg-black text-white rounded-full font-semibold transition text-sm"
          >
            Continue
          </button>
        </div>

        {/* Desktop Continue Button */}
        <div className="hidden lg:flex justify-end">
          <button
            onClick={handleContinue}
            className="px-8 py-3 bg-black text-white rounded-full font-semibold hover:bg-gray-800 transition text-sm"
          >
            Continue
          </button>
        </div>

        <div className="lg:hidden h-20"></div>
      </div>
      <div className="hidden lg:block">
        <Footer />
      </div>
    </div>
  );
}