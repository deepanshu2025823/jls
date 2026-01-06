import { Suspense } from 'react';
import PickupInfoContent from './PickupInfoContent/page';

export default function PickupInfoPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    }>
      <PickupInfoContent />
    </Suspense>
  );
}