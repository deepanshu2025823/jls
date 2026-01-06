import { Suspense } from 'react';

export default function BookingPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black mx-auto mb-4"></div>
          <p className="text-gray-600">Loading booking options...</p>
        </div>
      </div>
    }>
      <BookingPageContent />
    </Suspense>
  );
}

import BookingPageContent from './BookingPageContent';