"use client";

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import Header from "@/components/header/Header";
import Footer from "@/components/footer/Footer";

const vehicles = [
  {
    id: 'sedan',
    name: 'Sedan',
    capacity: '2 People',
    luggage: '2 Luggage',
    models: 'Acura MDX, Lexus RX, BMW X5',
    price: 72.50,
    image: '/images/fleet/01.svg'
  },
  {
    id: 'premium-suv',
    name: 'Premium SUV',
    capacity: '6 People',
    luggage: '4 Luggage',
    models: 'Mercedes E-Class, Lexus ES, Cadillac CT6, or similar.',
    price: 96.44,
    image: '/images/fleet/02.svg'
  },
  {
    id: 'executive-van',
    name: 'Executive Van',
    capacity: '8 People',
    luggage: '4 Luggage',
    models: 'Cadillac Escalade, Lincoln Navigator, Chevrolet Suburban',
    price: 127.60,
    image: '/images/fleet/03.svg'
  },
  {
    id: 'sprinter-van',
    name: 'Sprinter Van',
    capacity: '12 People',
    luggage: '6 Luggage',
    models: 'Cadillac Escalade, Lincoln Navigator, Chevrolet Suburban',
    price: 182.50,
    image: '/images/fleet/03.svg'
  }
];

export default function BookingPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [selectedVehicle, setSelectedVehicle] = useState<string | null>(null);
  const [showBookingInfo, setShowBookingInfo] = useState(false);
  const [showTerms, setShowTerms] = useState(false);

  // ✅ DYNAMIC: Get data from URL params
  const bookingInfo = {
    pickup: searchParams.get('pickup') || 'Not specified',
    dropoff: searchParams.get('drop') || 'Not specified',
    service: searchParams.get('service') || 'Distance',
    date: searchParams.get('date') || new Date().toLocaleDateString('en-US', { day: '2-digit', month: 'short', year: 'numeric' }),
    time: searchParams.get('time') || '10:00'
  };

  const handleContinue = () => {
    if (!selectedVehicle) {
      alert('Please select a vehicle');
      return;
    }
    
    // ✅ DYNAMIC: Pass all booking data to next step
    const params = new URLSearchParams({
      vehicle: selectedVehicle,
      pickup: bookingInfo.pickup,
      drop: bookingInfo.dropoff,
      service: bookingInfo.service,
      date: bookingInfo.date,
      time: bookingInfo.time,
      price: vehicles.find(v => v.id === selectedVehicle)?.price.toString() || '0'
    });
    
    router.push(`/booking/personal-details?${params.toString()}`);
  };

  const handleEditSearch = () => {
    router.push('/');
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Desktop Header - ORIGINAL */}
      <div className="headerbgimg hidden lg:block">
        <Header />
      </div>

      {/* Mobile Header - NEW DESIGN */}
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
              <svg className="w-4 h-4 text-gray-400 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              </svg>
              <div className="flex-1">
                <p className="text-xs text-gray-500">Pickup Location</p>
                <p className="text-sm font-medium text-gray-900">{bookingInfo.pickup}</p>
              </div>
            </div>
            <div className="flex items-start gap-2">
              <svg className="w-4 h-4 text-gray-400 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              </svg>
              <div className="flex-1">
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

      {/* Desktop Booking Info Bar - ORIGINAL */}
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
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-4 sm:py-12">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-4 gap-2">
          <h1 className="text-xl sm:text-3xl font-bold text-gray-900">Select a vehicle class</h1>
          <span className="bg-gray-100 text-gray-700 px-3 py-1.5 rounded-full text-xs font-medium w-fit">Step 1/3</span>
        </div>

        <p className="text-gray-600 mb-4 sm:mb-8 text-xs sm:text-sm">All prices include estimated VAT, fees, and tolls</p>

        {/* Vehicle Cards - MOBILE IMPROVED */}
        <div className="space-y-3 mb-6 sm:mb-8">
          {vehicles.map((vehicle) => (
            <div
              key={vehicle.id}
              onClick={() => setSelectedVehicle(vehicle.id)}
              className={`bg-white rounded-lg lg:rounded-lg p-4 cursor-pointer transition border-2 ${
                selectedVehicle === vehicle.id
                  ? 'border-black shadow-md lg:shadow-none'
                  : 'border-gray-200'
              }`}
            >
              <div className="flex items-start gap-3">
                <div className="relative w-20 h-16 sm:w-32 sm:h-24 flex-shrink-0 bg-gray-50 lg:bg-transparent rounded-xl lg:rounded-none">
                  <Image src={vehicle.image} alt={vehicle.name} fill className="object-contain p-2 lg:p-0" />
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <h3 className="text-base sm:text-xl font-bold text-gray-900">{vehicle.name}</h3>
                    <div className="text-right flex-shrink-0">
                      <div className="text-lg sm:text-2xl font-bold text-gray-900">${vehicle.price}</div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3 text-xs text-gray-600 mb-2">
                    <span className="flex items-center gap-1">
                      <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" />
                      </svg>
                      {vehicle.capacity}
                    </span>
                    <span className="flex items-center gap-1">
                      <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 2a4 4 0 00-4 4v1H5a1 1 0 00-.994.89l-1 9A1 1 0 004 18h12a1 1 0 00.994-1.11l-1-9A1 1 0 0015 7h-1V6a4 4 0 00-4-4zm2 5V6a2 2 0 10-4 0v1h4zm-6 3a1 1 0 112 0 1 1 0 01-2 0zm7-1a1 1 0 100 2 1 1 0 000-2z" clipRule="evenodd" />
                      </svg>
                      {vehicle.luggage}
                    </span>
                  </div>
                  
                  <p className="text-xs text-gray-500 line-clamp-1">{vehicle.models}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Included Features */}
        <div className="bg-gray-50 rounded-lg p-4 border border-gray-200 mb-6">
          <h3 className="font-semibold mb-3 text-sm text-gray-900">All classes include:</h3>
          <div className="space-y-2.5">
            {[
              'Free cancellation up until 1 hour before pickup',
              'Free 15 minutes of wait time',
              'Meet & Greet',
              'Complimentary bottle of water'
            ].map((item, i) => (
              <div key={i} className="flex items-start gap-2">
                <svg className="w-4 h-4 lg:w-5 lg:h-5 text-green-600 lg:text-green-600 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span className="text-xs text-gray-700 leading-relaxed">{item}</span>
              </div>
            ))}
          </div>

          <div className="border-t border-gray-200 mt-4 pt-4">
            <p className="font-semibold text-gray-900 mb-2 text-xs">Please note:</p>
            <div className="space-y-2">
              <div className="flex gap-2 text-xs text-gray-600">
                <span className="text-orange-500">⚠️</span>
                <p>Guest/luggage capacities must be abided by for safety reasons.</p>
              </div>
              <div className="flex gap-2 text-xs text-gray-600">
                <span className="text-orange-500">⚠️</span>
                <p>The vehicle images above are examples. You may get a different vehicle of similar quality.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Terms Link - Mobile Only */}
        <button 
          onClick={() => setShowTerms(!showTerms)}
          className="lg:hidden text-sm underline mb-4 text-gray-700"
        >
          View terms & conditions
        </button>

        {/* Fixed Bottom Button - Mobile */}
        <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 shadow-lg">
          <button
            onClick={handleContinue}
            disabled={!selectedVehicle}
            className={`w-full py-3.5 rounded-full font-semibold transition text-sm ${
              selectedVehicle
                ? 'bg-black text-white'
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }`}
          >
            Continue
          </button>
        </div>

        {/* Desktop Actions - ORIGINAL */}
        <div className="hidden lg:flex justify-end">
          <button
            onClick={handleContinue}
            disabled={!selectedVehicle}
            className={`px-8 py-3 rounded-full font-semibold transition text-sm ${
              selectedVehicle
                ? 'bg-black text-white hover:bg-gray-800'
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }`}
          >
            Continue
          </button>
        </div>

        <div className="lg:hidden h-20"></div>
      </div>
      
      {/* Desktop Footer - ORIGINAL */}
      <div className="hidden lg:block">
        <Footer />
      </div>

      {/* Terms Modal - Mobile Only */}
      {showTerms && (
        <div className="lg:hidden fixed inset-0 bg-black/50 z-50 flex items-end">
          <div className="bg-white w-full rounded-t-3xl max-h-[80vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 p-4 flex items-center justify-between">
              <h3 className="text-lg font-bold">Terms & Conditions</h3>
              <button onClick={() => setShowTerms(false)} className="p-2">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="p-4 text-sm text-gray-700 space-y-4">
              <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p>
              <p>Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}