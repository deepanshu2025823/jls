"use client";

import { useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Header from "@/components/header/Header";
import Footer from "@/components/footer/Footer";

function PaymentContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const [cardName, setCardName] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [cvv, setCvv] = useState('');
  const [saveCard, setSaveCard] = useState(false);
  const [showBookingInfo, setShowBookingInfo] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [showTerms, setShowTerms] = useState(false);

  const bookingInfo = {
    pickup: searchParams.get('pickup') || 'Not specified',
    dropoff: searchParams.get('drop') || 'Not specified',
    service: searchParams.get('service') || 'Distance',
    date: searchParams.get('date') || 'Not specified',
    time: searchParams.get('time') || '10:00',
    vehicle: searchParams.get('vehicle') || 'sedan',
    price: searchParams.get('price') || '0',
    bookingFor: searchParams.get('bookingFor') || 'myself',
    flightNumber: searchParams.get('flightNumber') || '',
    pickupSign: searchParams.get('pickupSign') || '',
    notes: searchParams.get('notes') || '',
    reference: searchParams.get('reference') || ''
  };

  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\s/g, '');
    let formattedValue = value.match(/.{1,4}/g)?.join(' ') || value;
    if (formattedValue.length <= 19) {
      setCardNumber(formattedValue);
    }
  };

  const handleExpiryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\D/g, '');
    if (value.length >= 2) {
      value = value.slice(0, 2) + '/' + value.slice(2, 4);
    }
    if (value.length <= 5) {
      setExpiryDate(value);
    }
  };

  const handleCvvChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, '');
    if (value.length <= 4) {
      setCvv(value);
    }
  };

  const handleCheckout = async () => {
    if (!cardName || !cardNumber || !expiryDate || !cvv) {
      alert('Please fill all payment fields');
      return;
    }

    if (cardNumber.replace(/\s/g, '').length < 13) {
      alert('Please enter a valid card number');
      return;
    }

    if (expiryDate.length !== 5) {
      alert('Please enter a valid expiry date (MM/YY)');
      return;
    }

    if (cvv.length < 3) {
      alert('Please enter a valid CVV');
      return;
    }

    setIsProcessing(true);

    try {
      console.log('Creating booking...');
      const bookingResponse = await fetch('/api/booking', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customerId: 'user_1766835439621_owqgx5ttl',
          vehicleId: bookingInfo.vehicle,
          bookingType: 'INDIVIDUAL',
          tripType: 'SINGLE_TRIP',
          pickupLocation: bookingInfo.pickup,
          dropLocation: bookingInfo.dropoff,
          pickupDate: bookingInfo.date,
          pickupTime: bookingInfo.time,
          flightNumber: bookingInfo.flightNumber || null,
          pickupSign: bookingInfo.pickupSign || null,
          specialNotes: bookingInfo.notes || null,
          referenceCode: bookingInfo.reference || null,
          basePrice: parseFloat(bookingInfo.price),
          addonPrice: 0,
          totalPrice: parseFloat(bookingInfo.price),
          addons: []
        })
      });

      const bookingData = await bookingResponse.json();

      if (!bookingData.success) {
        throw new Error(bookingData.message || 'Failed to create booking');
      }

      console.log('Booking created:', bookingData.booking.bookingNumber);

      console.log('Processing payment...');
      const paymentResponse = await fetch('/api/payments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          bookingId: bookingData.booking.id,
          amount: parseFloat(bookingInfo.price),
          tipAmount: 0,
          paymentMethod: 'Credit Card',
          cardDetails: {
            cardName,
            cardNumber,
            expiryDate,
            cvv
          },
          saveCard,
          userId: 'user_1766835439621_owqgx5ttl'
        })
      });

      const paymentData = await paymentResponse.json();

      if (!paymentData.success) {
        throw new Error(paymentData.message || 'Payment failed');
      }

      console.log('Payment successful:', paymentData.payment.transactionId);

      router.push(`/booking/confirmation?bookingId=${bookingData.booking.id}`);

    } catch (error: any) {
      console.error('Checkout error:', error);
      alert(error.message || 'Failed to process booking. Please try again.');
    } finally {
      setIsProcessing(false);
    }
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
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-4 sm:py-12 pb-32 lg:pb-12">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-3 gap-2">
          <h1 className="text-xl sm:text-3xl font-bold text-gray-900">Payment Info</h1>
          <span className="bg-gray-100 text-gray-700 px-3 py-1.5 rounded-full text-xs font-medium w-fit">Step 3/3</span>
        </div>

        <p className="text-gray-600 mb-4 text-sm">Add credit or debit card</p>

        {/* Payment Form - Mobile Improved */}
        <div className="bg-white rounded-2xl lg:rounded-lg p-4 mb-4 border border-gray-200 space-y-4">
          {/* Card Name */}
          <div>
            <label className="block text-sm lg:text-xs text-gray-700 mb-2 lg:mb-1.5 font-medium lg:font-normal">Name on card*</label>
            <input
              type="text"
              value={cardName}
              onChange={(e) => setCardName(e.target.value)}
              placeholder="John Doe"
              className="w-full px-4 lg:px-3 py-3 lg:py-2.5 bg-gray-50 rounded-xl lg:rounded-lg border-0 focus:ring-2 focus:ring-black outline-none text-sm"
              disabled={isProcessing}
            />
          </div>

          {/* Card Number */}
          <div>
            <label className="block text-sm lg:text-xs text-gray-700 mb-2 lg:mb-1.5 font-medium lg:font-normal">Card number*</label>
            <input
              type="text"
              value={cardNumber}
              onChange={handleCardNumberChange}
              placeholder="1234 5678 9012 3456"
              className="w-full px-4 lg:px-3 py-3 lg:py-2.5 bg-gray-50 rounded-xl lg:rounded-lg border-0 focus:ring-2 focus:ring-black outline-none text-sm"
              disabled={isProcessing}
            />
          </div>

          {/* Expiry & CVV */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm lg:text-xs text-gray-700 mb-2 lg:mb-1.5 font-medium lg:font-normal">Expiry date*</label>
              <input
                type="text"
                value={expiryDate}
                onChange={handleExpiryChange}
                placeholder="MM/YY"
                className="w-full px-4 lg:px-3 py-3 lg:py-2.5 bg-gray-50 rounded-xl lg:rounded-lg border-0 focus:ring-2 focus:ring-black outline-none text-sm"
                disabled={isProcessing}
              />
            </div>
            <div>
              <label className="block text-sm lg:text-xs text-gray-700 mb-2 lg:mb-1.5 font-medium lg:font-normal">CVV*</label>
              <input
                type="text"
                value={cvv}
                onChange={handleCvvChange}
                placeholder="123"
                className="w-full px-4 lg:px-3 py-3 lg:py-2.5 bg-gray-50 rounded-xl lg:rounded-lg border-0 focus:ring-2 focus:ring-black outline-none text-sm"
                disabled={isProcessing}
              />
            </div>
          </div>

          {/* Save Card */}
          <label className="flex items-center gap-3 cursor-pointer p-2 lg:p-0 rounded-lg lg:rounded-none hover:bg-gray-50 lg:hover:bg-transparent transition">
            <input
              type="checkbox"
              checked={saveCard}
              onChange={(e) => setSaveCard(e.target.checked)}
              className="w-5 h-5 lg:w-4 lg:h-4 rounded border-gray-300 text-black focus:ring-black"
              disabled={isProcessing}
            />
            <span className="text-sm lg:text-xs text-gray-700">Save card to your list</span>
          </label>
        </div>

        {/* Security Info */}
        <div className="space-y-3 mb-6">
          <div className="flex items-start gap-2 p-3 bg-white rounded-2xl lg:rounded-lg lg:bg-gray-50 border border-gray-200">
            <svg className="w-5 h-5 lg:w-4 lg:h-4 text-green-600 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            <p className="text-gray-700 text-xs leading-relaxed">
              Our servers are encrypted with TLS/SSL to ensure security and privacy.
            </p>
          </div>

          <div className="flex items-start gap-2 p-3 bg-white rounded-2xl lg:rounded-lg lg:bg-gray-50 border border-gray-200">
            <svg className="w-5 h-5 lg:w-4 lg:h-4 text-blue-600 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
            </svg>
            <p className="text-gray-700 text-xs leading-relaxed">
              The amount will be held from your selected payment method after the booking. We only charge you after the ride is finished.
            </p>
          </div>
        </div>

        {/* Terms Link - Mobile Only */}
        <button 
          onClick={() => setShowTerms(!showTerms)}
          className="lg:hidden text-sm underline mb-4 text-gray-700"
        >
          View terms & conditions
        </button>
      </div>

      {/* Fixed Bottom Button - Mobile */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 shadow-lg">
        <button
          onClick={handleCheckout}
          disabled={isProcessing}
          className={`w-full py-4 rounded-full font-bold transition text-base ${
            isProcessing 
              ? 'bg-gray-400 text-white cursor-not-allowed' 
              : 'bg-black text-white'
          }`}
        >
          {isProcessing ? (
            <span className="flex items-center justify-center gap-2">
              <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Processing...
            </span>
          ) : (
            'Proceed to Checkout'
          )}
        </button>
      </div>

      {/* Desktop Actions - ORIGINAL */}
      <div className="hidden lg:flex justify-end max-w-4xl mx-auto px-6 pb-5">
        <button
          onClick={handleCheckout}
          disabled={isProcessing}
          className={`px-8 py-3 rounded-full font-semibold transition text-sm ${
            isProcessing 
              ? 'bg-gray-400 text-white cursor-not-allowed' 
              : 'bg-black text-white hover:bg-gray-800'
          }`}
        >
          {isProcessing ? (
            <span className="flex items-center gap-2">
              <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Processing...
            </span>
          ) : (
            'Proceed to Checkout'
          )}
        </button>
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

export default function PaymentPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black mx-auto mb-4"></div>
          <p className="text-gray-600">Loading payment page...</p>
        </div>
      </div>
    }>
      <PaymentContent />
    </Suspense>
  );
}