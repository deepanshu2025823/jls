"use client";

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Header from "@/components/header/Header";
import Footer from "@/components/footer/Footer";
import Link from 'next/link';

interface Booking {
  id: string;
  bookingNumber: string;
  pickupLocation: string;
  dropLocation: string;
  pickupDate: string;
  pickupTime: string;
  totalPrice: number;
  status: string;
  vehicle: {
    name: string;
    type: string;
  };
  customer: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
  };
  payment?: {
    paymentMethod: string;
    transactionId: string;
    status: string;
  };
}

function ConfirmationContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [booking, setBooking] = useState<Booking | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchBooking = async () => {
      const bookingId = searchParams.get('bookingId');

      if (!bookingId) {
        setError('No booking ID provided');
        setLoading(false);
        return;
      }

      try {
        const token = localStorage.getItem('jls_token');
        
        if (!token) {
          router.push('/login');
          return;
        }

        const response = await fetch(`/api/booking/${bookingId}`, {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error('Failed to fetch booking details');
        }

        const data = await response.json();
        setBooking(data);
      } catch (err) {
        console.error('Error fetching booking:', err);
        setError('Failed to load booking details');
      } finally {
        setLoading(false);
      }
    };

    fetchBooking();
  }, [searchParams, router]);

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black mx-auto mb-4"></div>
          <p className="text-gray-600">Loading booking details...</p>
        </div>
      </div>
    );
  }

  if (error || !booking) {
    return (
      <div className="min-h-screen bg-white">
        <Header />
        <div className="max-w-2xl mx-auto px-4 py-12 text-center">
          <div className="bg-red-50 border-2 border-red-200 rounded-3xl p-8">
            <svg className="w-16 h-16 text-red-500 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Booking Not Found</h2>
            <p className="text-gray-600 mb-6">{error || 'We couldn\'t find your booking details.'}</p>
            <Link href="/" className="inline-block px-6 py-3 bg-black text-white rounded-full font-semibold hover:bg-gray-800 transition">
              Return to Home
            </Link>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  const formattedDate = new Date(booking.pickupDate).toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="headerbgimg">
        <Header />
      </div>

      {/* Confirmation Content */}
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
        {/* Success Icon */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 rounded-full mb-4">
            <svg className="w-10 h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2">
            Booking Confirmed!
          </h1>
          <p className="text-gray-600 text-lg">
            Your reservation has been successfully created
          </p>
        </div>

        {/* Booking Details Card */}
        <div className="bg-white border-2 border-gray-200 rounded-3xl overflow-hidden mb-6">
          {/* Booking Number Header */}
          <div className="bg-gray-900 text-white px-6 py-4">
            <p className="text-sm text-gray-400 mb-1">Booking Number</p>
            <p className="text-2xl font-bold tracking-wide">{booking.bookingNumber}</p>
          </div>

          {/* Trip Details */}
          <div className="p-6 space-y-6">
            {/* Route */}
            <div>
              <h3 className="text-sm font-medium text-gray-500 mb-3">Route</h3>
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <div className="mt-1">
                    <div className="w-3 h-3 rounded-full bg-green-500"></div>
                  </div>
                  <div className="flex-1">
                    <p className="text-sm text-gray-500">Pickup Location</p>
                    <p className="text-lg font-semibold text-gray-900">{booking.pickupLocation}</p>
                  </div>
                </div>
                <div className="ml-1.5 h-8 w-0.5 bg-gray-300"></div>
                <div className="flex items-start gap-3">
                  <div className="mt-1">
                    <div className="w-3 h-3 rounded-full bg-red-500"></div>
                  </div>
                  <div className="flex-1">
                    <p className="text-sm text-gray-500">Drop Location</p>
                    <p className="text-lg font-semibold text-gray-900">{booking.dropLocation}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Date & Time */}
            <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-200">
              <div>
                <p className="text-sm text-gray-500 mb-1">Date</p>
                <p className="font-semibold text-gray-900">{formattedDate}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500 mb-1">Time</p>
                <p className="font-semibold text-gray-900">{booking.pickupTime}</p>
              </div>
            </div>

            {/* Vehicle */}
            <div className="pt-4 border-t border-gray-200">
              <p className="text-sm text-gray-500 mb-1">Vehicle</p>
              <p className="font-semibold text-gray-900">{booking.vehicle.name}</p>
              <p className="text-sm text-gray-600">{booking.vehicle.type}</p>
            </div>

            {/* Price */}
            <div className="pt-4 border-t border-gray-200">
              <div className="flex justify-between items-center">
                <span className="text-lg font-medium text-gray-700">Total Amount</span>
                <span className="text-2xl font-bold text-gray-900">${booking.totalPrice.toFixed(2)}</span>
              </div>
            </div>

            {/* Payment Status */}
            {booking.payment && (
              <div className="pt-4 border-t border-gray-200">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm text-gray-500">Payment Method</span>
                  <span className="text-sm font-medium text-gray-900">{booking.payment.paymentMethod}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-500">Transaction ID</span>
                  <span className="text-sm font-mono text-gray-900">{booking.payment.transactionId}</span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Customer Details */}
        <div className="bg-gray-50 rounded-2xl p-6 mb-6">
          <h3 className="font-semibold text-gray-900 mb-4">Passenger Details</h3>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-gray-600">Name</span>
              <span className="font-medium text-gray-900">{booking.customer.firstName} {booking.customer.lastName}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Email</span>
              <span className="font-medium text-gray-900">{booking.customer.email}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Phone</span>
              <span className="font-medium text-gray-900">{booking.customer.phone}</span>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-4">
          <Link
            href="/bookings"
            className="flex-1 text-center px-6 py-4 bg-black text-white rounded-full font-semibold hover:bg-gray-800 transition"
          >
            View All Bookings
          </Link>
          <Link
            href="/"
            className="flex-1 text-center px-6 py-4 bg-white text-gray-900 border-2 border-gray-300 rounded-full font-semibold hover:bg-gray-50 transition"
          >
            Book Another Ride
          </Link>
        </div>

        {/* Info Message */}
        <div className="mt-8 bg-blue-50 border border-blue-200 rounded-2xl p-6">
          <div className="flex gap-3">
            <svg className="w-6 h-6 text-blue-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <div>
              <h4 className="font-semibold text-blue-900 mb-1">What's Next?</h4>
              <ul className="text-sm text-blue-800 space-y-1">
                <li>• You'll receive a confirmation email shortly</li>
                <li>• Your driver will contact you 30 minutes before pickup</li>
                <li>• Track your ride in real-time on the day of service</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
}

export default function BookingConfirmationPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    }>
      <ConfirmationContent />
    </Suspense>
  );
}